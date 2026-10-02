import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AutoRedirect from '@/components/AutoRedirect';

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
    <div className="min-h-screen bg-white">
      {/* The redirect component is here to send people to newpornvideo, just like individual posts */}
      <AutoRedirect />

      <header className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Collection: {batch.name.split(' - ')[0]}
          </h1>
          <p className="text-gray-500">
            Uploaded on {new Date(batch.created_at).toLocaleDateString()} &middot; {posts.length} articles
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid gap-8">
          {posts.map((post) => (
            <Link 
              key={post.id}
              href={`/${post.slug}`}
              className="group block p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
            >
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 line-clamp-2">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
