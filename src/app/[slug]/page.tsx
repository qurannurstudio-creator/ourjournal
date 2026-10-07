import { getBlogPostBySlug, getBlogPosts } from '@/lib/sheets';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import AutoRedirect from '@/components/AutoRedirect';

// Generate static params for all slugs in the sheet
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  const imageUrl = post.image.startsWith('http') ? post.image : `https://${post.image}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags ? post.tags.split(',').map((t: string) => t.trim()) : [],
    alternates: {
      canonical: `https://modernjournal.info/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date || new Date().toISOString(),
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: post.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const post = currentIndex !== -1 ? posts[currentIndex] : undefined;

  if (!post) {
    notFound();
  }

  // Calculate next post for internal linking
  const nextPost = currentIndex !== -1 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : posts[0];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar alwaysDark={true} />
      <article className="max-w-3xl mx-auto py-32 px-4 sm:px-6 flex-grow w-full">
        <AutoRedirect />
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-500 text-sm gap-4">
            <span>{post.date}</span>
            <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">{post.tags}</span>
          </div>
        </header>

        {/* JSON-LD Schemas for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": post.title,
                "description": post.description,
                "image": post.image.startsWith('http') ? post.image : `https://${post.image}`,
                "datePublished": post.date || new Date().toISOString(),
                "author": {
                  "@type": "Person",
                  "name": "Modern Journal"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://modernjournal.info"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": post.title,
                    "item": `https://modernjournal.info/${slug}`
                  }
                ]
              }
            ])
          }}
        />

        {post.image && (
          <div className="mb-10 aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={post.image.startsWith('http') ? post.image : `https://${post.image}`} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Internal Linking: Read Next */}
        {nextPost && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-4">Read Next</h3>
            <Link 
              href={`/${nextPost.slug}`}
              className="group block p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                {nextPost.title}
              </h4>
              <p className="text-gray-600 line-clamp-2 text-sm">
                {nextPost.description}
              </p>
            </Link>
          </div>
        )}
      </article>
      <Footer />
    </div>
  );
}
