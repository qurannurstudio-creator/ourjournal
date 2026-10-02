'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import toast from 'react-hot-toast';

function BatchRow({ batch, deleteBatch }: { batch: any; deleteBatch: (id: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [indexStatus, setIndexStatus] = useState(batch.index_status || 'Not Indexed');
  const [mainSiteStatus, setMainSiteStatus] = useState(batch.main_site_status || 'Not Sent');

  const copyUrl = () => {
    const url = `https://modernjournal.info/collection/${batch.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('URL copied to clipboard!');
    });
  };

  const updateStatus = async (field: string, value: string) => {
    const { error } = await supabase.from('batches').update({ [field]: value }).eq('id', batch.id);
    if (error) {
      toast.error(`Error updating status: ${error.message}`);
    } else {
      toast.success('Status updated!');
    }
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 font-medium text-slate-900">
        {batch.name}
      </td>
      <td className="px-6 py-4 text-slate-500">
        {new Date(batch.created_at).toLocaleString()}
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
          {batch.post_count}
        </span>
      </td>
      <td className="px-6 py-4">
        <select 
          value={indexStatus}
          onChange={(e) => {
            setIndexStatus(e.target.value);
            updateStatus('index_status', e.target.value);
          }}
          className={`text-xs font-medium border-none bg-transparent focus:ring-0 cursor-pointer p-0 ${indexStatus === 'Indexed' ? 'text-blue-600' : 'text-red-600'}`}
        >
          <option value="Not Indexed" className="text-slate-900">Not Indexed</option>
          <option value="Indexed" className="text-slate-900">Indexed</option>
        </select>
      </td>
      <td className="px-6 py-4">
        <select 
          value={mainSiteStatus}
          onChange={(e) => {
            setMainSiteStatus(e.target.value);
            updateStatus('main_site_status', e.target.value);
          }}
          className={`text-xs font-medium border-none bg-transparent focus:ring-0 cursor-pointer p-0 ${mainSiteStatus === 'Sent to Main Site' ? 'text-blue-600' : 'text-red-600'}`}
        >
          <option value="Not Sent" className="text-slate-900">Not Sent</option>
          <option value="Sent to Main Site" className="text-slate-900">Sent to Main Site</option>
        </select>
      </td>
      <td className="px-6 py-4 flex items-center gap-2">
        <Link 
          href={`/collection/${batch.id}`} 
          target="_blank" 
          className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          /collection/...{batch.id.slice(0, 6)}
        </Link>
        <button 
          onClick={copyUrl}
          title="Copy Public URL"
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          )}
        </button>
      </td>
      <td className="px-6 py-4 text-right space-x-3">
        <Link 
          href={`/admin/batch-details?id=${batch.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View URLs
        </Link>
        <button 
          onClick={() => deleteBatch(batch.id)}
          className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function AllBatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .order('created_at', { ascending: true }); // Earliest first to show Batch 1, 2, 3...
    
    if (!error && data) {
      setBatches(data);
    }
    setLoading(false);
  };

  const deleteBatch = (batchId: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-slate-900">Are you sure you want to delete this ENTIRE batch?</p>
        <p className="text-xs text-slate-500">All associated blogs will be permanently deleted.</p>
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
              const toastId = toast.loading('Deleting batch...');
              const { error } = await supabase.from('batches').delete().eq('id', batchId);
              
              if (error) {
                toast.error(`Error deleting batch: ${error.message}`, { id: toastId });
              } else {
                fetchBatches(); // Refresh
                toast.success('Batch and all its blogs deleted successfully.', { id: toastId });
              }
            }} 
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            Delete Batch
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-8">All Batches</h1>
      
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] whitespace-nowrap text-left text-sm text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Batch Name</th>
                <th className="px-6 py-4 font-medium">Date Uploaded</th>
                <th className="px-6 py-4 font-medium">Posts</th>
                <th className="px-6 py-4 font-medium">Index Status</th>
                <th className="px-6 py-4 font-medium">Main Site Status</th>
                <th className="px-6 py-4 font-medium">Public URL</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                    <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded w-8"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16 float-right"></div></td>
                  </tr>
                ))
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">No batches uploaded yet.</td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <BatchRow key={batch.id} batch={batch} deleteBatch={deleteBatch} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
