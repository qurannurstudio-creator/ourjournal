'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function IndexingHistoryPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('indexing_logs')
      .select(`
        *,
        batches ( name )
      `)
      .order('created_at', { ascending: false });
    
    if (data) {
      setLogs(data);
    } else {
      console.error(error);
    }
    setLoading(false);
  };

  // Group logs by date
  const groupedLogs = logs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded mb-6"></div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-64 bg-slate-50"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Indexing History</h1>
      <p className="text-slate-500 text-sm mb-8">View a log of all URLs sent to the Google Indexing API by date.</p>

      {Object.keys(groupedLogs).length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center text-slate-500">
          No indexing history found yet.
        </div>
      ) : (
        Object.keys(groupedLogs).map(date => {
          const dateLogs = groupedLogs[date];
          const totalSent = dateLogs.reduce((acc: number, log: any) => acc + (log.urls_sent || 0), 0);

          return (
            <div key={date} className="mb-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b bg-slate-50 border-slate-200 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">
                  {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Total Sent: {totalSent} / 200 URLs
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-500">
                  <thead className="text-xs uppercase bg-white border-b border-slate-100 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">Time</th>
                      <th className="px-6 py-3 font-medium">Batch</th>
                      <th className="px-6 py-3 font-medium">URLs Sent</th>
                      <th className="px-6 py-3 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {dateLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 text-slate-600">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-3 font-medium text-slate-900">
                          {log.batches?.name || 'Unknown Batch'}
                        </td>
                        <td className="px-6 py-3 text-slate-600">
                          {log.urls_sent}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            log.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status}
                          </span>
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
