'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LightweightPost {
  title: string;
  slug: string;
  image: string;
  date: string;
  tags: string;
}

interface HomePageGridProps {
  initialPosts: LightweightPost[];
}

export default function HomePageGrid({ initialPosts }: HomePageGridProps) {
  const [displayPosts, setDisplayPosts] = useState<LightweightPost[]>([]);

  const shuffleAndSelect = () => {
    // Clone and shuffle using Fisher-Yates
    const shuffled = [...initialPosts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Pick first 20
    setDisplayPosts(shuffled.slice(0, 20));
  };

  useEffect(() => {
    // Initial pick
    shuffleAndSelect();

    // Set interval for 10 minutes (600,000 ms)
    const intervalId = setInterval(() => {
      shuffleAndSelect();
    }, 600000);

    return () => clearInterval(intervalId);
  }, [initialPosts]);

  if (displayPosts.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight mb-6">
          Discover The Latest
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Explore our handpicked collection of trending stories, deep dives, and expert insights. Updated every 10 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {displayPosts.map((post, index) => (
          <Link href={`/${post.slug}`} key={`${post.slug}-${index}`} className="group block">
            <div className="relative h-full flex flex-col bg-white/70 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              
              {/* Image Section */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                  src={post.image.startsWith('http') ? post.image : `https://${post.image}`}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-grow p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {post.tags || 'Featured'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{post.date}</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 leading-snug mb-4 line-clamp-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>

                <div className="mt-auto flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                  Read Article
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
