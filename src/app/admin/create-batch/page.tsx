'use client';

import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CreateBatchPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nextBatchNumber, setNextBatchNumber] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function getBatchNumber() {
      const { count } = await supabase.from('batches').select('*', { count: 'exact', head: true });
      if (count !== null) setNextBatchNumber(count + 1);
    }
    getBatchNumber();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const triggerBuild = async () => {
    const webhookUrl = "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/7086bb21-4a5f-4aaa-b2c3-88beff25882a";
    try {
      await fetch(webhookUrl, { method: 'POST' });
      console.log('Build triggered successfully');
    } catch (err) {
      console.error('Failed to trigger build', err);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a CSV file first');
      return;
    }

    setIsLoading(true);
    setStatus('Parsing CSV...');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const posts = results.data as any[];
          setStatus(`Found ${posts.length} posts. Creating Batch ${nextBatchNumber}...`);

          // 1. Create a Batch
          const batchName = `Batch ${nextBatchNumber} - ${new Date().toLocaleString()}`;
          const { data: batchData, error: batchError } = await supabase
            .from('batches')
            .insert([{ name: batchName, post_count: posts.length }])
            .select()
            .single();

          if (batchError) throw batchError;
          const batchId = batchData.id;

          // 2. Format Posts with batch_id
          const formattedPosts = posts.map((post) => ({
            title: post.Title || post.title,
            slug: post.Slug || post.slug,
            description: post.Description || post.description,
            content: post.Content || post.content,
            image: post.Image || post.image,
            date: post.Date || post.date,
            tags: post.Tags || post.tags,
            batch_id: batchId
          }));

          setStatus(`Batch created. Uploading to Supabase...`);

          // 3. Insert in chunks
          const chunkSize = 50;
          for (let i = 0; i < formattedPosts.length; i += chunkSize) {
            const chunk = formattedPosts.slice(i, i + chunkSize);
            const { error } = await supabase.from('blogs').upsert(chunk, { onConflict: 'slug' });
            
            if (error) {
              setStatus(`Error: ${error.message}`);
              setIsLoading(false);
              return;
            }
          }

          setStatus('Upload complete! Triggering Cloudflare Build...');
          await triggerBuild();

          setTimeout(() => {
            router.push(`/admin/batch-details?id=${batchId}`);
          }, 1500);

        } catch (error: any) {
          setStatus(`Error: ${error.message}`);
          setIsLoading(false);
        }
      },
      error: (error) => {
        setStatus(`Error parsing CSV: ${error.message}`);
        setIsLoading(false);
      }
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-8">Create Batch</h1>
      
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm max-w-2xl">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Upload CSV</h2>
        <p className="text-slate-500 mb-8 text-sm">Drag and drop your CSV file here or click to browse. It will automatically be created as <strong>Batch {nextBatchNumber}</strong>.</p>
        
        {/* Drag and Drop Zone */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all mb-8 ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
          }`}
        >
          <input 
            type="file" 
            accept=".csv"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          
          {file ? (
            <p className="text-sm font-medium text-blue-600">{file.name}</p>
          ) : (
            <div>
              <p className="text-sm font-medium text-slate-900 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500">CSV files only</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <button 
            onClick={handleUpload}
            disabled={isLoading || !file}
            className="w-full bg-slate-900 px-6 py-3 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Uploading & Building...' : 'Upload & Publish Batch'}
          </button>
        </div>

        {status && (
          <div className={`mt-6 p-4 rounded-md text-sm font-medium border ${status.includes('Error') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
