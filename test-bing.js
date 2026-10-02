const BING_API_KEY = 'b136599ff6344d19a8b38d1b1e81b0d5';
const BING_SUBMIT_URL = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${BING_API_KEY}`;
const SITE_URL = 'https://modernjournal.info';

async function test() {
  const urls = [];
  for (let i = 0; i < 100; i++) urls.push(`https://modernjournal.info/test-${i}`);

  const response = await fetch(BING_SUBMIT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      siteUrl: SITE_URL,
      urlList: urls,
    }),
  });

  const text = await response.text();
  console.log('Status:', response.status);
  console.log('Response:', text);
}
test();
