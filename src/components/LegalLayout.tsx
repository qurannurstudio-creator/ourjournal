import Link from 'next/link';
import Footer from './Footer';

export default function LegalLayout({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-red-600 selection:text-white flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-red-900/10 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
      </div>
      
      {/* Simple Header */}
      <header className="w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="font-bold text-white tracking-tighter">M</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Modern<span className="text-red-500">Journal</span></span>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-grow w-full relative z-10 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Glassmorphism Card */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl">
            
            <h1 className="text-3xl md:text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 border-b border-slate-800 pb-8">
              {title}
            </h1>
            
            <div className="prose prose-invert prose-lg prose-red max-w-none text-slate-300">
              {children}
            </div>

            {/* Internal Links for SEO */}
            <div className="mt-16 pt-8 border-t border-slate-800">
              <h3 className="text-xl font-bold text-white mb-6">Explore Modern Journal</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/" className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/50 hover:bg-slate-900 transition-all text-sm text-slate-400 hover:text-red-400 flex items-center gap-2">
                  <span>📰</span> Latest News
                </Link>
                <Link href="/about" className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/50 hover:bg-slate-900 transition-all text-sm text-slate-400 hover:text-red-400 flex items-center gap-2">
                  <span>ℹ️</span> About Us
                </Link>
                <Link href="/contact" className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/50 hover:bg-slate-900 transition-all text-sm text-slate-400 hover:text-red-400 flex items-center gap-2">
                  <span>✉️</span> Contact
                </Link>
                <Link href="/privacy" className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/50 hover:bg-slate-900 transition-all text-sm text-slate-400 hover:text-red-400 flex items-center gap-2">
                  <span>🔒</span> Privacy Policy
                </Link>
                <Link href="/terms" className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/50 hover:bg-slate-900 transition-all text-sm text-slate-400 hover:text-red-400 flex items-center gap-2">
                  <span>📜</span> Terms of Service
                </Link>
                <Link href="/disclaimer" className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/50 hover:bg-slate-900 transition-all text-sm text-slate-400 hover:text-red-400 flex items-center gap-2">
                  <span>⚠️</span> Disclaimer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
