import { getBlogPosts } from '@/lib/sheets';
import HomePageGrid from '@/components/HomePageGrid';

export default async function Home() {
  const allPosts = await getBlogPosts();
  
  // Shuffle all posts on the server at build time
  const shuffled = [...allPosts];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Select 100 posts for the client pool and strip heavy content to keep payload ultra-light
  const pool = shuffled.slice(0, 100).map(post => ({
    title: post.title,
    slug: post.slug,
    image: post.image,
    date: post.date,
    tags: post.tags,
  }));

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      <HomePageGrid initialPosts={pool} />
    </div>
  );
}
