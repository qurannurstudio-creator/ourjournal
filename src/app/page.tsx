import AutoRedirect from '@/components/AutoRedirect';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Modern Journal - Exclusive Trending Stories",
  description: "Your premium source for the latest viral stories, in-depth analysis, and exclusive deep-dives into trending topics.",
  alternates: {
    canonical: 'https://modernjournal.info',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-red-600 selection:text-white">
      {/* Kept the auto-redirect exactly as requested */}
      <AutoRedirect />

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-red-900/30 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg shadow-red-500/20 flex items-center justify-center">
                <span className="font-bold text-white tracking-tighter">M</span>
              </div>
              <span className="font-bold text-xl tracking-tight">Modern<span className="text-red-500">Journal</span></span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
              <a href="#" className="text-red-500 hover:text-red-400 transition-colors">Trending</a>
              <a href="#" className="hover:text-white transition-colors">World</a>
              <a href="#" className="hover:text-white transition-colors">Technology</a>
              <a href="#" className="hover:text-white transition-colors">Lifestyle</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-red-900/30 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold tracking-wider uppercase mb-6">
            Breaking News & Exclusives
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Uncover The Truth With <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-700">
              Modern Journal
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Your premium source for the latest viral stories, in-depth analysis, and exclusive deep-dives into topics that matter today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:shadow-lg hover:shadow-red-600/30 hover:scale-105 transition-all duration-300">
              Read Latest Stories
            </button>
            <button className="px-8 py-4 rounded-full bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-all duration-300 border border-slate-700 hover:border-slate-600">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </section>

      {/* Featured Grid Section */}
      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Trending <span className="text-red-500">Now</span></h2>
            <div className="h-px bg-slate-800 flex-grow ml-8 hidden sm:block"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20">
              <div className="h-48 bg-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-slate-900/80 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 bg-red-600 text-xs font-bold rounded uppercase tracking-wider text-white">Exclusive</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-red-400 transition-colors">The Digital Revolution in Modern Media</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">How new algorithms are shaping the way we consume viral content across the globe.</p>
                <span className="text-red-500 font-medium text-sm inline-flex items-center group-hover:translate-x-1 transition-transform">
                  Read Article &rarr;
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20">
              <div className="h-48 bg-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/40 to-slate-900/80 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 bg-slate-700 text-xs font-bold rounded uppercase tracking-wider text-white">Technology</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-red-400 transition-colors">Future of Artificial Intelligence</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">A deep dive into how AI generated content is bypassing traditional security measures.</p>
                <span className="text-red-500 font-medium text-sm inline-flex items-center group-hover:translate-x-1 transition-transform">
                  Read Article &rarr;
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20 md:hidden lg:block">
              <div className="h-48 bg-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 to-slate-900/80 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 bg-red-900 text-xs font-bold rounded uppercase tracking-wider text-white">Lifestyle</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-red-400 transition-colors">Psychology of Viral Trends</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Why certain topics capture the world's attention instantly and refuse to let go.</p>
                <span className="text-red-500 font-medium text-sm inline-flex items-center group-hover:translate-x-1 transition-transform">
                  Read Article &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6">
             <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                <span className="font-bold text-white text-xs">M</span>
              </div>
             <span className="font-bold text-lg">Modern<span className="text-red-500">Journal</span></span>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Modern Journal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
