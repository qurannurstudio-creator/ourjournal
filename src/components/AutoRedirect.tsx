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
          window.location.href = data.redirect_url;
        }
      } catch (err) {
        console.error('Failed to check redirect settings:', err);
      }
    };

    checkRedirect();
  }, []);

  return null;
}
