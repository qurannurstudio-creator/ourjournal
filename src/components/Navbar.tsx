'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Navbar({ alwaysDark = false }: { alwaysDark?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [navLinks, setNavLinks] = useState<string[]>(['#', '#', '#', '#']);

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
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        isScrolled || alwaysDark
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-red-900/30 py-4' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-bold text-2xl tracking-tight text-white group-hover:text-slate-200 transition-colors">
              Modern<span className="text-red-500">Journal</span>
            </span>
          </Link>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
            <Link href={navLinks[0]} className="text-red-500 hover:text-red-400 transition-colors">Trending</Link>
            <Link href={navLinks[1]} className="hover:text-white transition-colors">World</Link>
            <Link href={navLinks[2]} className="hover:text-white transition-colors">Technology</Link>
            <Link href={navLinks[3]} className="hover:text-white transition-colors">Lifestyle</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
