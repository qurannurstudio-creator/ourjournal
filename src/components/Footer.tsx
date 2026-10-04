import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 py-12 border-t border-slate-900 text-center relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg shadow-red-500/20 flex items-center justify-center">
              <span className="font-bold text-white text-sm tracking-tighter">M</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Modern<span className="text-red-500">Journal</span>
            </span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-medium text-slate-400">
            <Link href="/about" className="hover:text-red-400 transition-colors">About Us</Link>
            <Link href="/privacy" className="hover:text-red-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-red-400 transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-red-400 transition-colors">Disclaimer</Link>
            <Link href="/contact" className="hover:text-red-400 transition-colors">Contact Us</Link>
          </nav>
        </div>
        
        <p className="text-slate-600 text-sm">
          &copy; {new Date().getFullYear()} Modern Journal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
