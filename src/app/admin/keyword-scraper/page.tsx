'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FiSearch, FiSave, FiDownload, FiCopy, FiPlus, FiX } from 'react-icons/fi';

interface ScraperSource {
  id: string;
  name: string;
  url_template: string;
}

export default function KeywordScraperAdmin() {
  const [sources, setSources] = useState<ScraperSource[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string>('');
  const [seedKeywords, setSeedKeywords] = useState<string>('best phone\nbudget smartphone');
  const [targetCount, setTargetCount] = useState<number>(50);
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // New source modal state
  const [showModal, setShowModal] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');

  useEffect(() => {
    fetchSources();
  }, []);

  async function fetchSources() {
    const { data, error } = await supabase.from('scraper_sources').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setSources(data);
      if (data.length > 0 && !selectedSourceId) {
        setSelectedSourceId(data[0].id);
      }
    }
  }

  async function handleAddSource(e: React.FormEvent) {
    e.preventDefault();
    if (!newSourceName || !newSourceUrl) return;

    const { data, error } = await supabase
      .from('scraper_sources')
      .insert([{ name: newSourceName, url_template: newSourceUrl }])
      .select()
      .single();

    if (!error && data) {
      setSources([data, ...sources]);
      setSelectedSourceId(data.id);
      setShowModal(false);
      setNewSourceName('');
      setNewSourceUrl('');
    } else {
      alert('Error adding source: ' + (error?.message || 'Unknown error'));
    }
  }

  async function handleGenerate() {
    if (!selectedSourceId) {
      setError('Please select a source first.');
      return;
    }

    const source = sources.find(s => s.id === selectedSourceId);
    if (!source) return;

    const seeds = seedKeywords.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    if (seeds.length === 0) {
      setError('Please provide at least one seed keyword.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch('/api/scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urlTemplate: source.url_template,
          seedKeywords: seeds,
          targetCount: targetCount
        })
      });

      const data = await res.json();
      if (res.ok) {
        setResults(data.keywords || []);
      } else {
        setError(data.error || 'Failed to generate keywords');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  function handleCopyAll() {
    navigator.clipboard.writeText(results.join('\n'));
    alert('Copied to clipboard!');
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Keyword Scraper</h1>
          <p className="text-gray-500 text-sm mt-1">Generate bulk keywords automatically bypassing CORS.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Source Selection */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">API Source</label>
              <button 
                onClick={() => setShowModal(true)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
              >
                <FiPlus /> Add New
              </button>
            </div>
            <select
              value={selectedSourceId}
              onChange={(e) => setSelectedSourceId(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border bg-gray-50"
            >
              <option value="" disabled>Select a source...</option>
              {sources.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {selectedSourceId && (
              <p className="mt-2 text-xs text-gray-500 break-all bg-gray-50 p-2 rounded border">
                {sources.find(s => s.id === selectedSourceId)?.url_template}
              </p>
            )}
          </div>

          {/* Configuration */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seed Keywords (One per line)</label>
              <textarea
                value={seedKeywords}
                onChange={(e) => setSeedKeywords(e.target.value)}
                rows={5}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 border"
                placeholder="best phone&#10;budget smartphone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Count</label>
              <input
                type="number"
                value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value))}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
                min="10"
                max="1000"
              />
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex justify-center items-center gap-2 transition-colors`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Scraping...
                </>
              ) : (
                <>
                  <FiSearch /> Generate Keywords
                </>
              )}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Generated Keywords ({results.length})</h2>
            {results.length > 0 && (
              <div className="flex gap-2">
                <button 
                  onClick={handleCopyAll}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
                >
                  <FiCopy /> Copy All
                </button>
                <button 
                  onClick={handleDownload}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
                >
                  <FiDownload /> Download TXT
                </button>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-auto p-0">
            {results.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((kw, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{kw}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <FiSearch className="w-12 h-12 mb-4 text-gray-300" />
                <p>No keywords generated yet.</p>
                <p className="text-sm mt-1">Configure sources and click generate to start.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Source Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Add New API Source</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddSource} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Name</label>
                <input
                  type="text"
                  required
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  placeholder="e.g., Google Search"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Template</label>
                <p className="text-xs text-gray-500 mb-2">Use <code>{'{keyword}'}</code> where the search term should be injected.</p>
                <input
                  type="url"
                  required
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  placeholder="https://.../?q={keyword}"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <FiSave /> Save Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
