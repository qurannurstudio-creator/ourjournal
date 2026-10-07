'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Navbar({ alwaysDark = false }: { alwaysDark?: boolean }) {
  const [navLinks, setNavLinks] = useState<string[]>(['#', '#', '#', '#']);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      const { data } = await supabase.from('batches').select('id, name').limit(4);
      if (data && data.length > 0) {
        const links = Array.from({ length: 4 }).map((_, i) => 
          `/collection/${data[i % data.length].id}`
        );
        setNavLinks(links);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // Hide on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false); // Scrolling down
        } else {
          setIsVisible(true); // Scrolling up
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav 
        className={`fixed w-full z-50 top-0 transition-transform duration-300 ease-in-out border-b border-red-900/30 bg-slate-950/80 backdrop-blur-md ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link href="/" className="font-bold text-xl tracking-tight text-white hover:text-slate-200 transition-colors">
                Modern<span className="text-red-500">Journal</span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
              <Link href={navLinks[0]} className="text-red-500 hover:text-red-400 transition-colors">Trending</Link>
              <Link href={navLinks[1]} className="hover:text-white transition-colors">World</Link>
              <Link href={navLinks[2]} className="hover:text-white transition-colors">Technology</Link>
              <Link href={navLinks[3]} className="hover:text-white transition-colors">Lifestyle</Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="text-slate-300 hover:text-white focus:outline-none p-2 -mr-2"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu (Drawer) */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div 
          className={`fixed right-0 top-0 bottom-0 w-64 bg-slate-950 border-l border-slate-800 p-6 transform transition-transform duration-300 ease-in-out flex flex-col ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
            <span className="font-bold text-lg text-white">Menu</span>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col space-y-4 flex-grow overflow-y-auto">
            <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">Categories</h3>
            <Link href={navLinks[0]} onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors">Trending</Link>
            <Link href={navLinks[1]} onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors">World</Link>
            <Link href={navLinks[2]} onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors">Technology</Link>
            <Link href={navLinks[3]} onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors">Lifestyle</Link>
            
            <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider mt-6 mb-2">Information</h3>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </>
  );
}
