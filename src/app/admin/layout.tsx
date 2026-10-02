'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

import { QuotaTracker } from '@/components/admin/QuotaTracker';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const [loginError, setLoginError] = useState('');
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      } else if (pathname !== '/admin') {
        router.push('/admin');
      }
      setIsChecking(false);
    };
    
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (!session && pathname !== '/admin') {
        router.push('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setLoginError(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isChecking) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-sm w-full">
          <h1 className="text-2xl font-semibold tracking-tight mb-6 text-center text-slate-900">Admin Login</h1>
          {loginError && <p className="text-sm text-red-600 mb-4 text-center font-medium bg-red-50 p-2 rounded">{loginError}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-md mb-4 focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-md mb-4 focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all text-sm"
          />
          <button type="submit" className="w-full bg-slate-900 text-slate-50 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Fixed Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed top-0 left-0 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Admin</h2>
        </div>
        <nav className="px-4 pb-6 space-y-1">
          <Link
            href="/admin"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === '/admin' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Overview
          </Link>
          <Link
            href="/admin/batches"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname.includes('/admin/batches') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            All Batches
          </Link>
          <Link
            href="/admin/create-batch"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === '/admin/create-batch' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Create Batch
          </Link>
          <Link
            href="/admin/indexing-history"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === '/admin/indexing-history' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Indexing History
          </Link>
        </nav>
      </aside>

      {/* Main Content Area (Offset by sidebar width) */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-medium text-slate-500">Dashboard</h2>
            <div className="h-4 w-px bg-slate-300"></div>
            <QuotaTracker />
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm font-semibold text-slate-600 hover:text-white bg-slate-100 hover:bg-red-600 px-4 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-red-500/30"
          >
            Logout
          </button>
        </header>

        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
        <Toaster position="top-center" />
      </main>
    </div>
  );
}
