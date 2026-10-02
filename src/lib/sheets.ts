import { supabase } from './supabase';

export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  date: string;
  tags: string;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    let allBlogs: BlogPost[] = [];
    let hasMore = true;
    let page = 0;
    const pageSize = 1000;

    while (hasMore) {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: true })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (error) {
        console.error('Error fetching blogs from Supabase:', error);
        return allBlogs;
      }

      if (data && data.length > 0) {
        allBlogs = [...allBlogs, ...(data as BlogPost[])];
        page++;
      } else {
        hasMore = false;
      }
    }

    return allBlogs;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      return undefined;
    }

    return data as BlogPost;
  } catch {
    return undefined;
  }
}
