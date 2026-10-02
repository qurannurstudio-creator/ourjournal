'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

function BatchDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const batchId = searchParams?.get('id');

  const [batch, setBatch] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState('Copy All Links');
  const [mainUrlCopied, setMainUrlCopied] = useState(false);

  const MAIN_DOMAIN = 'https://modernjournal.info';

  useEffect(() => {
    if (batchId) {
      fetchBatchDetails();
    } else {
      setLoading(false);
    }
  }, [batchId]);

  const fetchBatchDetails = async () => {
    setLoading(true);
    // Fetch batch info
    const { data: batchData } = await supabase.from('batches').select('*').eq('id', batchId).single();
    if (batchData) setBatch(batchData);

    // Fetch blogs for this batch
    const { data: blogsData } = await supabase.from('blogs').select('id, title, slug').eq('batch_id', batchId);
    if (blogsData) setBlogs(blogsData);
    
    setLoading(false);
  };

  const copyMainUrl = () => {
    const url = `${MAIN_DOMAIN}/collection/${batch.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setMainUrlCopied(true);
      setTimeout(() => setMainUrlCopied(false), 2000);
      toast.success('Main URL copied!');
    });
  };

  const copyAllLinks = () => {
    const urls = blogs.map(blog => `${MAIN_DOMAIN}/${blog.slug}`).join('\n');
    navigator.clipboard.writeText(urls).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy All Links'), 2000);
      toast.success('All links copied!');
    });
  };

  const [chunkCopyStatus, setChunkCopyStatus] = useState<Record<number, string>>({});
  const [quotaRemaining, setQuotaRemaining] = useState<number>(0); // Default to 0 until loaded

  useEffect(() => {
    fetchQuota();
  }, []);

  const fetchQuota = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('indexing_logs')
      .select('urls_sent')
      .eq('date', today);
      
    if (error) {
      console.error('Error fetching quota (table might be missing):', error);
      toast.error('Could not fetch quota. Did you run the SQL code?');
      setQuotaRemaining(0);
      return;
    }
    
    if (data) {
      const total = data.reduce((acc, log) => acc + (log.urls_sent || 0), 0);
      setQuotaRemaining(Math.max(0, 200 - total));
    }
  };

  const chunks: any[][] = [];
  if (blogs.length > 0) {
    chunks.push(blogs.slice(0, 200));
    if (blogs.length > 200) {
      chunks.push(blogs.slice(200));
    }
  }

  const copyChunkLinks = (chunk: any[], index: number) => {
    const urls = chunk.map(blog => `${MAIN_DOMAIN}/${blog.slug}`).join('\n');
    navigator.clipboard.writeText(urls).then(() => {
      setChunkCopyStatus(prev => ({ ...prev, [index]: 'Copied!' }));
      setTimeout(() => {
        setChunkCopyStatus(prev => ({ ...prev, [index]: `Copy these ${chunk.length} Links` }));
      }, 2000);
      toast.success(`Copied ${chunk.length} links!`);
    });
  };

  const [isIndexing, setIsIndexing] = useState(false);
  const [indexingProgress, setIndexingProgress] = useState(0);

  const handleSendToGoogle = async (originalChunk: any[]) => {
    if (quotaRemaining <= 0) {
      toast.error("Today's quota is exhausted. Please try again tomorrow.");
      return;
    }

    setIsIndexing(true);
    setIndexingProgress(0);
    
    const chunk = originalChunk.slice(0, quotaRemaining);
    if (chunk.length < originalChunk.length) {
      toast.success(`Only sending first ${chunk.length} URLs due to quota limits.`);
    }

    const subChunks = [];
    for (let i = 0; i < chunk.length; i += 100) {
      subChunks.push(chunk.slice(i, i + 100));
    }

    try {
      for (const subChunk of subChunks) {
        const urls = subChunk.map(blog => `${MAIN_DOMAIN}/${blog.slug}`);
        const blogIds = subChunk.map(blog => blog.id);

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        
        const res = await fetch(`${supabaseUrl}/functions/v1/google-indexer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ urls, blogIds, batchId })
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to send to Google');
        }

        setIndexingProgress(prev => prev + subChunk.length);
        await new Promise(r => setTimeout(r, 1000));
      }
      toast.success('Successfully sent to Google Indexer!');
      fetchBatchDetails();
      fetchQuota();
      // Reload page to update the TopBar quota as well
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      toast.error(error.message || 'Error communicating with Edge Function');
    } finally {
      setIsIndexing(false);
      setIndexingProgress(0);
    }
  };

  const deleteBlog = (id: string, title: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-slate-900">Delete this blog?</p>
        <p className="text-xs text-slate-500">"{title}" will be permanently deleted.</p>
        <div className="flex gap-2 justify-end mt-2">
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const toastId = toast.loading('Deleting blog...');
              const { error } = await supabase.from('blogs').delete().eq('id', id);
              if (error) {
                toast.error(`Error deleting blog: ${error.message}`, { id: toastId });
              } else {
                setBlogs(blogs.filter(b => b.id !== id));
                setBatch({ ...batch, post_count: Math.max(0, batch.post_count - 1) });
                toast.success('Blog deleted successfully', { id: toastId });
              }
            }} 
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-32 bg-slate-200 rounded mb-6"></div>
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="h-10 w-64 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 w-56 bg-slate-200 rounded"></div>
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded"></div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-96 bg-slate-50"></div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Batch Not Found</h2>
        <button onClick={() => router.push('/admin/batches')} className="text-blue-600 hover:underline cursor-pointer">
          &larr; Back to Batches
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <button 
          onClick={() => router.push('/admin/batches')} 
          className="inline-flex items-center text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-md mb-6 transition-colors cursor-pointer border border-slate-200 shadow-sm"
        >
          &larr; Back to Batches
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-1">{batch.name}</h1>
            <p className="text-slate-500 text-sm mb-2">Uploaded: {new Date(batch.created_at).toLocaleString()} &middot; {batch.post_count} URLs</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-700">Public URL: </span>
              <a href={`${MAIN_DOMAIN}/collection/${batch.id}`} target="_blank" className="text-blue-600 hover:underline">
                {MAIN_DOMAIN}/collection/{batch.id}
              </a>
              <button 
                onClick={copyMainUrl}
                title="Copy Public URL"
                className="ml-2 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                {mainUrlCopied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                )}
              </button>
            </div>
          </div>
          <button 
            onClick={copyAllLinks}
            className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            {copyStatus}
          </button>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm p-8 text-center text-slate-500">
          No blogs found in this batch.
        </div>
      ) : (
        chunks.map((chunk, chunkIndex) => {
          const isFirstChunk = chunkIndex === 0;
          return (
            <div key={chunkIndex} className={`mb-8 bg-white border rounded-xl overflow-hidden shadow-sm ${isFirstChunk ? 'border-blue-400 ring-1 ring-blue-400' : 'border-slate-200'}`}>
              <div className={`px-6 py-4 border-b flex justify-between items-center ${isFirstChunk ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-200'}`}>
                <div>
                  <h3 className={`font-semibold ${isFirstChunk ? 'text-blue-900' : 'text-slate-800'}`}>
                    Table {chunkIndex + 1} {isFirstChunk && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Next for Indexing</span>}
                  </h3>
                  <p className={`text-xs mt-1 ${isFirstChunk ? 'text-blue-700' : 'text-slate-500'}`}>
                    URLs {chunkIndex === 0 ? 1 : 201} to {chunkIndex === 0 ? chunk.length : blogs.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  {isFirstChunk && (
                    <button
                      onClick={() => handleSendToGoogle(chunk)}
                      disabled={isIndexing || quotaRemaining <= 0}
                      className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm border bg-green-600 text-white hover:bg-green-700 border-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isIndexing ? `Sending... ${indexingProgress}/${Math.min(chunk.length, quotaRemaining)}` : quotaRemaining <= 0 ? 'Quota Exhausted' : 'Send to Google Indexer'}
                    </button>
                  )}
                  <button 
                    onClick={() => copyChunkLinks(chunk, chunkIndex)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm border ${
                      isFirstChunk 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600' 
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                    }`}
                  >
                    {chunkCopyStatus[chunkIndex] || `Copy these ${chunk.length} Links`}
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-sm text-slate-500">
                  <thead className={`text-xs uppercase sticky top-0 backdrop-blur-sm ${isFirstChunk ? 'text-blue-800 bg-blue-50/90' : 'text-slate-700 bg-slate-50/90'}`}>
                    <tr>
                      <th className="px-6 py-3 font-medium w-12">#</th>
                      <th className="px-6 py-3 font-medium w-1/3">Blog Title</th>
                      <th className="px-6 py-3 font-medium">Generated URL</th>
                      <th className="px-6 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {chunk.map((blog, index) => (
                      <tr key={blog.id} className={`hover:bg-slate-50 transition-colors ${isFirstChunk ? 'hover:bg-blue-50/30' : ''}`}>
                        <td className="px-6 py-2.5 font-mono text-xs text-slate-400">
                          {chunkIndex * 200 + index + 1}
                        </td>
                        <td className="px-6 py-2.5 font-medium text-slate-900 truncate max-w-xs">
                          {blog.title}
                        </td>
                        <td className="px-6 py-2.5 font-mono text-xs text-slate-600">
                          <a 
                            href={`${MAIN_DOMAIN}/${blog.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 hover:underline transition-colors"
                          >
                            {MAIN_DOMAIN}/{blog.slug}
                          </a>
                        </td>
                        <td className="px-6 py-2.5 text-right">
                          <button 
                            onClick={() => deleteBlog(blog.id, blog.title)}
                            className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default function BatchDetailsPage() {
  return (
    <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
      <BatchDetailsContent />
    </Suspense>
  );
}
