import Link from 'next/link';
import Footer from './Footer';
import Navbar from './Navbar';

export default function LegalLayout({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-red-600 selection:text-white flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-red-900/10 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
      </div>
      
      <Navbar />

      <main className="flex-grow w-full relative z-10 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Glassmorphism Card */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl">
            
            <h1 className="text-3xl md:text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 border-b border-slate-800 pb-8">
              {title}
            </h1>
            
            <div className="text-slate-300 text-lg leading-relaxed [&>p]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-white [&>ul]:list-disc [&>ul]:ml-6 [&>ul>li]:mb-3 [&>a]:text-red-400 [&>a]:underline hover:[&>a]:text-red-300">
              {children}
            </div>

            {/* Internal Links for SEO */}
            <div className="mt-16 pt-10 border-t border-slate-800">
              <h3 className="text-xl font-bold text-white mb-6">Explore Modern Journal</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/" className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/50 hover:bg-slate-900 transition-all text-sm text-slate-300 hover:text-red-400 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
                  Latest News
                </Link>
                <Link href="/about" className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/50 hover:bg-slate-900 transition-all text-sm text-slate-300 hover:text-red-400 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  About Us
                </Link>
                <Link href="/contact" className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/50 hover:bg-slate-900 transition-all text-sm text-slate-300 hover:text-red-400 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  Contact
                </Link>
                <Link href="/privacy" className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/50 hover:bg-slate-900 transition-all text-sm text-slate-300 hover:text-red-400 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Privacy Policy
                </Link>
                <Link href="/terms" className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/50 hover:bg-slate-900 transition-all text-sm text-slate-300 hover:text-red-400 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                  Terms of Service
                </Link>
                <Link href="/disclaimer" className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/50 hover:bg-slate-900 transition-all text-sm text-slate-300 hover:text-red-400 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                  Disclaimer
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
