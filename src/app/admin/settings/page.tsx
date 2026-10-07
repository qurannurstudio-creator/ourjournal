'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [redirectEnabled, setRedirectEnabled] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, which means the user hasn't run the SQL yet
          toast.error('Settings table not found. Please run the SQL setup script.');
        } else {
          toast.error('Failed to load settings');
          console.error(error);
        }
      } else if (data) {
        setRedirectUrl(data.redirect_url || '');
        setRedirectEnabled(data.redirect_enabled || false);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while loading settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('settings')
        .update({
          redirect_url: redirectUrl,
          redirect_enabled: redirectEnabled,
        })
        .eq('id', 1);

      if (error) {
        toast.error('Failed to save settings');
        console.error(error);
      } else {
        toast.success('Settings saved successfully!');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Website Settings</h1>
        <p className="text-slate-500">Manage real-time redirect configurations for your website.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-900">Auto Redirect Configuration</h2>
        </div>
        
        <form onSubmit={handleSave} className="p-6">
          <div className="mb-6">
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <span className="block text-sm font-medium text-slate-900 mb-1">Enable Redirect</span>
                <span className="block text-sm text-slate-500">
                  When enabled, visitors will be instantly redirected to the URL below.
                </span>
              </div>
              <div className="relative inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={redirectEnabled}
                  onChange={(e) => setRedirectEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
            </label>
          </div>

          <div className="mb-8">
            <label htmlFor="redirectUrl" className="block text-sm font-medium text-slate-900 mb-2">
              Redirect Destination URL
            </label>
            <input
              type="url"
              id="redirectUrl"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://example.com"
              required={redirectEnabled}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
            />
            <p className="mt-2 text-xs text-slate-500">Must be a valid URL including http:// or https://</p>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
