'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function KeywordScraperAdmin() {
  const [urlPrefix, setUrlPrefix] = useState<string>('https://completion.amazon.com/api/2017/suggestions?mid=ATVPDKIKX0DER&alias=aps&prefix=');
  const [seedKeywords, setSeedKeywords] = useState<string>('best phone\nbudget smartphone');
  const [targetCount, setTargetCount] = useState<number>(50);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [sourceId, setSourceId] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedSource();
  }, []);

  async function fetchSavedSource() {
    // Just fetch the first saved URL to prepopulate
    const { data, error } = await supabase.from('scraper_sources').select('*').limit(1).single();
    if (data) {
      setUrlPrefix(data.url_template);
      setSourceId(data.id);
    }
  }

  async function handleSaveUrl() {
    if (!urlPrefix) return;
    setSaving(true);
    try {
      if (sourceId) {
        // Update existing
        await supabase.from('scraper_sources').update({ url_template: urlPrefix }).eq('id', sourceId);
      } else {
        // Insert new
        const { data } = await supabase.from('scraper_sources').insert([{ name: 'Default API', url_template: urlPrefix }]).select().single();
        if (data) setSourceId(data.id);
      }
      toast.success('API URL Saved!');
    } catch (err) {
      toast.error('Failed to save URL');
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerate() {
    const seeds = seedKeywords.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    if (seeds.length === 0) {
      toast.error('Please provide at least one seed keyword.');
      return;
    }
    if (!urlPrefix) {
      toast.error('API URL Prefix is required.');
      return;
    }

    setLoading(true);
    setResults([]);
    
    // Auto save the URL when generating
    handleSaveUrl();

    try {
      const res = await fetch('/api/scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urlPrefix: urlPrefix,
          seedKeywords: seeds,
          targetCount: targetCount
        })
      });

      const data = await res.json();
      if (res.ok) {
        setResults(data.keywords || []);
        toast.success(`Generated ${data.keywords?.length || 0} keywords!`);
      } else {
        toast.error(data.error || 'Failed to generate keywords');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  function handleCopyAll() {
    navigator.clipboard.writeText(results.join('\n'));
    toast.success('Copied to clipboard!');
  }

  function handleDownload() {
    const blob = new Blob([results.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keywords-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Keyword Scraper</h1>
        <p className="text-slate-500">Generate bulk keywords automatically bypassing CORS. Just provide an autocomplete API URL.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-900">Configuration</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">API URL Prefix</label>
                <p className="text-xs text-slate-500 mb-2">The keyword will be attached at the very end of this URL.</p>
                <input
                  type="url"
                  value={urlPrefix}
                  onChange={(e) => setUrlPrefix(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all text-sm"
                  placeholder="https://completion.amazon.com/api/2017/suggestions?...&prefix="
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Seed Keywords (One per line)</label>
                <textarea
                  value={seedKeywords}
                  onChange={(e) => setSeedKeywords(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all text-sm"
                  placeholder="best phone&#10;budget smartphone"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Target Keyword Count</label>
                <input
                  type="number"
                  value={targetCount}
                  onChange={(e) => setTargetCount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all text-sm"
                  min="10"
                  max="1000"
                />
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-slate-900 text-slate-50 py-2.5 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-50"></div>
                    Scraping...
                  </>
                ) : (
                  'Generate Keywords'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">Results ({results.length})</h2>
            {results.length > 0 && (
              <div className="flex gap-2">
                <button 
                  onClick={handleCopyAll}
                  className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Copy All
                </button>
                <button 
                  onClick={handleDownload}
                  className="px-3 py-1.5 text-sm bg-slate-900 text-slate-50 rounded-md hover:bg-slate-800 transition-colors"
                >
                  Download TXT
                </button>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-auto p-0">
            {results.length > 0 ? (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-16">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Keyword</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {results.map((kw, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-500">{idx + 1}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{kw}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                <p className="text-slate-500 font-medium">No keywords generated yet.</p>
                <p className="text-sm mt-1">Configure your API URL and click generate to start.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
