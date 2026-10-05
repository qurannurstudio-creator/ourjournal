'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function KeywordScraperAdmin() {
  const [urlPrefix, setUrlPrefix] = useState<string>('https://completion.amazon.com/api/2017/suggestions?mid=ATVPDKIKX0DER&alias=aps&prefix=');
  const [seedKeywords, setSeedKeywords] = useState<string[]>(['best phone', 'budget smartphone']);
  const [keywordInput, setKeywordInput] = useState<string>('');
  const [targetCount, setTargetCount] = useState<number>(50);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [sourceId, setSourceId] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedSource();
  }, []);

  async function fetchSavedSource() {
    const { data } = await supabase.from('scraper_sources').select('*').limit(1).single();
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
        await supabase.from('scraper_sources').update({ url_template: urlPrefix }).eq('id', sourceId);
      } else {
        const { data } = await supabase.from('scraper_sources').insert([{ name: 'Saved API', url_template: urlPrefix }]).select().single();
        if (data) setSourceId(data.id);
      }
      toast.success('API URL Saved!');
    } catch (err) {
      toast.error('Failed to save URL');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteUrl() {
    if (!sourceId) return;
    if (!confirm('Are you sure you want to delete this saved URL?')) return;
    try {
      await supabase.from('scraper_sources').delete().eq('id', sourceId);
      setSourceId(null);
      setUrlPrefix('');
      toast.success('API URL Deleted!');
    } catch (err) {
      toast.error('Failed to delete URL');
    }
  }

  // Generic JSON extractor logic directly in the client
  function extractSuggestions(data: any): string[] {
    if (data && data.suggestions && Array.isArray(data.suggestions)) {
      return data.suggestions.map((item: any) => item.value).filter((v: any) => typeof v === 'string');
    }
    if (Array.isArray(data)) {
      if (data.length > 1 && Array.isArray(data[1])) {
        return data[1].filter((v: any) => typeof v === 'string' || (Array.isArray(v) && typeof v[0] === 'string')).map((v:any) => typeof v === 'string' ? v : v[0]);
      }
      return data.filter((v: any) => typeof v === 'string');
    }
    return [];
  }

  async function handleGenerate() {
    if (seedKeywords.length === 0) {
      toast.error('Please add at least one seed keyword.');
      return;
    }
    if (!urlPrefix) {
      toast.error('API URL Prefix is required.');
      return;
    }

    setLoading(true);
    setResults([]);

    const finalSeeds = [...seedKeywords];
    if (keywordInput.trim() !== '') {
      finalSeeds.push(keywordInput.trim());
      setSeedKeywords(finalSeeds);
      setKeywordInput('');
    }

    const count = targetCount || 50;
    const allKeywords = new Set<string>(finalSeeds);
    const keywordsToProcess = [...finalSeeds];
    let requestsMade = 0;
    const MAX_REQUESTS = 15; 

    try {
      while (keywordsToProcess.length > 0 && allKeywords.size < count && requestsMade < MAX_REQUESTS) {
        const currentKw = keywordsToProcess.shift();
        if (!currentKw) continue;

        // Use a CORS proxy so we can fetch directly from the browser!
        const fetchUrl = urlPrefix + encodeURIComponent(currentKw);
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(fetchUrl)}`;
        
        try {
          const response = await fetch(proxyUrl);
          if (response.ok) {
            const data = await response.json();
            const newSuggestions = extractSuggestions(data);

            for (const word of newSuggestions) {
              if (!allKeywords.has(word)) {
                allKeywords.add(word);
                keywordsToProcess.push(word);
                if (allKeywords.size >= count) break;
              }
            }
          }
        } catch (err) {
          console.error(`Error fetching data for ${currentKw}:`, err);
        }

        requestsMade++;
        if (keywordsToProcess.length > 0 && allKeywords.size < count) {
          // Prevent browser freezing with a slight delay
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      setResults(Array.from(allKeywords));
      toast.success(`Generated ${allKeywords.size} keywords!`);
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
        <p className="text-slate-500">Generate bulk keywords automatically from anywhere.</p>
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
                <input
                  type="url"
                  value={urlPrefix}
                  onChange={(e) => setUrlPrefix(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all text-sm mb-3"
                  placeholder="https://completion.amazon.com/api/2017/suggestions?...&prefix="
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleSaveUrl}
                    disabled={saving}
                    className="flex-1 bg-slate-100 text-slate-900 border border-slate-200 py-1.5 rounded text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save URL'}
                  </button>
                  {sourceId && (
                    <button 
                      onClick={handleDeleteUrl}
                      className="px-3 bg-red-50 text-red-600 border border-red-100 rounded hover:bg-red-100 transition-colors flex items-center justify-center"
                      title="Delete Saved URL"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Seed Keywords</label>
                <div className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-slate-900 transition-all min-h-[42px] flex flex-wrap gap-2">
                  {seedKeywords.map((kw, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-sm">
                      <span>{kw}</span>
                      <button 
                        type="button" 
                        onClick={() => setSeedKeywords(seedKeywords.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-500 font-bold ml-1"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const val = keywordInput.trim();
                        if (val && !seedKeywords.includes(val)) {
                          setSeedKeywords([...seedKeywords, val]);
                        }
                        setKeywordInput('');
                      } else if (e.key === 'Backspace' && keywordInput === '' && seedKeywords.length > 0) {
                        e.preventDefault();
                        setSeedKeywords(seedKeywords.slice(0, -1));
                      }
                    }}
                    placeholder={seedKeywords.length === 0 ? "Type and press Enter..." : ""}
                    className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Type a keyword and press Enter or Comma (,) to add it.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Target Keyword Count</label>
                <input
                  type="number"
                  value={targetCount}
                  onChange={(e) => setTargetCount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all text-sm"
                  min="1"
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
