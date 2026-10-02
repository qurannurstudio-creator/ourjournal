import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/sheets';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();
  const baseUrl = 'https://modernjournal.info';

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const { data: batches } = await supabase.from('batches').select('id');
  const batchEntries: MetadataRoute.Sitemap = (batches || []).map((batch) => ({
    url: `${baseUrl}/collection/${batch.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...blogEntries,
    ...batchEntries,
  ];
}
