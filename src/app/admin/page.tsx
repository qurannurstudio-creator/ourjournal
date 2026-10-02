'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ batches: 0, blogs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { count: batchCount } = await supabase.from('batches').select('*', { count: 'exact', head: true });
      const { count: blogCount } = await supabase.from('blogs').select('*', { count: 'exact', head: true });
      
      setStats({
        batches: batchCount || 0,
        blogs: blogCount || 0
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-8">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Blogs Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Total Blogs</h3>
          <div className="text-4xl font-bold text-slate-900">
            {loading ? (
              <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
            ) : (
              stats.blogs
            )}
          </div>
        </div>

        {/* Total Batches Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Total Batches</h3>
          <div className="text-4xl font-bold text-slate-900">
            {loading ? (
              <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
            ) : (
              stats.batches
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
