const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');
const tempDir = path.join(__dirname, 'out_temp_build');
const newsDir = path.join(outDir, 'news');

console.log('[postbuild] Structuring out directory for /news basePath...');

if (!fs.existsSync(outDir)) {
  console.error('[postbuild] Error: out directory does not exist!');
  process.exit(1);
}

// 1. Move out/ to out_temp_build/
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.renameSync(outDir, tempDir);

// 2. Re-create out/ and move everything into out/news/
fs.mkdirSync(outDir, { recursive: true });
fs.renameSync(tempDir, newsDir);

// 3. Create out/news.html as a copy of out/news/index.html
// This guarantees that GET /news directly serves the page with 200 OK
if (fs.existsSync(path.join(newsDir, 'index.html'))) {
  fs.copyFileSync(path.join(newsDir, 'index.html'), path.join(outDir, 'news.html'));
}

// 4. Write instant redirect at root out/index.html
const rootIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Modern Journal</title>
  <meta http-equiv="refresh" content="0; url=/news">
  <link rel="canonical" href="https://modernjournal.info/news">
  <script>window.location.replace("/news");</script>
</head>
<body style="background:#020617;color:#f8fafc;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <div style="text-align:center;">
    <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;">Modern <span style="color:#ef4444;">Journal</span></h1>
    <p style="color:#94a3b8;font-size:0.95rem;">Redirecting to <a href="/news" style="color:#ef4444;text-decoration:none;font-weight:600;">/news</a>...</p>
  </div>
</body>
</html>`;
fs.writeFileSync(path.join(outDir, 'index.html'), rootIndexHtml, 'utf8');

// 5. Copy robots.txt and sitemap.xml to root out/
if (fs.existsSync(path.join(newsDir, 'robots.txt'))) {
  fs.copyFileSync(path.join(newsDir, 'robots.txt'), path.join(outDir, 'robots.txt'));
}
if (fs.existsSync(path.join(newsDir, 'sitemap.xml'))) {
  fs.copyFileSync(path.join(newsDir, 'sitemap.xml'), path.join(outDir, 'sitemap.xml'));
}

// 6. Copy icons to root out/
const iconFiles = ['icon.png', 'apple-icon.png', 'favicon.ico'];
for (const icon of iconFiles) {
  if (fs.existsSync(path.join(newsDir, icon))) {
    fs.copyFileSync(path.join(newsDir, icon), path.join(outDir, icon));
  }
}

// 7. Copy _next to root out/_next as well so non-prefixed asset requests resolve
if (fs.existsSync(path.join(newsDir, '_next'))) {
  fs.cpSync(path.join(newsDir, '_next'), path.join(outDir, '_next'), { recursive: true });
}

// 8. Handle 404 at root to redirect old URLs to /news/...
let notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    if (!window.location.pathname.startsWith('/news')) {
      window.location.replace('/news' + window.location.pathname + window.location.search);
    }
  </script>
</head>
<body></body>
</html>`;
if (fs.existsSync(path.join(newsDir, '404.html'))) {
  const original404 = fs.readFileSync(path.join(newsDir, '404.html'), 'utf8');
  notFoundHtml = original404.replace('<head>', '<head><script>if(!window.location.pathname.startsWith("/news")){window.location.replace("/news"+window.location.pathname+window.location.search);}</script>');
}
fs.writeFileSync(path.join(outDir, '404.html'), notFoundHtml, 'utf8');

// 9. Write Cloudflare Pages _redirects file: ONLY redirect root / to /news
const redirectsContent = `/ /news 301
`;
fs.writeFileSync(path.join(outDir, '_redirects'), redirectsContent, 'utf8');
if (fs.existsSync(path.join(__dirname, 'public'))) {
  fs.writeFileSync(path.join(__dirname, 'public', '_redirects'), redirectsContent, 'utf8');
}

console.log('[postbuild] Done! Static export successfully organized under /news with root redirects and asset fallbacks.');
