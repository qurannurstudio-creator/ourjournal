import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Algeria Times',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDeprecatedPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white text-center font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <h1 className="text-6xl font-black text-emerald-500 mb-2">404</h1>
        <h2 className="text-xl font-bold mb-3">Page Not Found</h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          The requested route does not exist or has been permanently removed.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/30 text-sm"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
