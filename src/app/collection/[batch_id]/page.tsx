import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AutoRedirect from '@/components/AutoRedirect';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamic = 'force-static';
export const revalidate = false;

export async function generateStaticParams() {
  const { data: batches } = await supabase.from('batches').select('id');
  
  if (!batches || batches.length === 0) {
    return [{ batch_id: 'empty' }];
  }

  return batches.map((batch) => ({
    batch_id: batch.id,
  }));
}

export default async function BatchCollectionPage({ params }: { params: Promise<{ batch_id: string }> }) {
  const { batch_id } = await params;
  
  const { data: batch } = await supabase
    .from('batches')
    .select('*')
    .eq('id', batch_id)
    .single();

  if (!batch) {
    notFound();
  }

  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('batch_id', batch_id)
    .order('created_at', { ascending: false });

  const posts = blogs || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-red-600 selection:text-white">
      {/* Auto redirect component kept exactly as requested */}
      <AutoRedirect />

      {/* JSON-LD Schemas for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                "name": "Trending Stories",
                "item": `https://modernjournal.info/collection/${batch_id}`
              }
            ]
          })
        }}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold tracking-wider uppercase mb-6">
            Curated Selection
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Exclusive <span className="text-red-500">Trending</span> Stories
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400">
            Explore our latest collection of {posts.length} viral articles, in-depth psychological analyses, and exclusive insights.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link 
                key={post.id}
                href={`/${post.slug}`}
                className="group rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20 flex flex-col"
              >
                <div className="h-48 bg-slate-800 relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-slate-900/80 group-hover:scale-110 transition-transform duration-500 z-10"></div>
                  {post.image && (
                    <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  )}
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="px-2 py-1 bg-red-600 text-xs font-bold rounded uppercase tracking-wider text-white">Hot</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow relative z-20">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-red-400 transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">{post.description}</p>
                  <span className="text-red-500 font-medium text-sm inline-flex items-center group-hover:translate-x-1 transition-transform mt-auto">
                    Read Article &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
