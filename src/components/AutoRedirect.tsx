'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AutoRedirect() {
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 1)
          .single();
          
        if (!error && data && data.redirect_enabled && data.redirect_url) {
          // Detect search engine bots to allow them to index the real content
          const isBot = /bot|googlebot|crawler|spider|robot|crawling|yandex|bing|slurp|duckduckbot|baiduspider|ia_archiver|facebookexternalhit|twitterbot/i.test(navigator.userAgent);
          
          if (!isBot) {
            window.location.href = data.redirect_url;
          } else {
            console.log('Bot detected, bypassing redirect to allow indexing.');
          }
        }
      } catch (err) {
        console.error('Failed to check redirect settings:', err);
      }
    };

    checkRedirect();
  }, []);

  return null;
}
