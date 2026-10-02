'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function QuotaTracker() {
  const [urlsSent, setUrlsSent] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    fetchQuota();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchQuota = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('indexing_logs')
      .select('urls_sent')
      .eq('date', today);

    if (error) {
      console.error('Error fetching quota:', error);
      return;
    }

    if (data) {
      const total = data.reduce((acc, log) => acc + (log.urls_sent || 0), 0);
      setUrlsSent(total);
    }
  };

  const updateTimer = () => {
    const now = new Date();
    // UTC Midnight
    const tomorrow = new Date(now);
    tomorrow.setUTCHours(24, 0, 0, 0);

    const diff = tomorrow.getTime() - now.getTime();
    if (diff <= 0) {
      setTimeLeft('00:00:00');
      // Refetch if day rolled over
      fetchQuota();
      return;
    }

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeLeft(
      `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
  };

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${urlsSent >= 200 ? 'bg-red-500' : 'bg-green-500'}`}></div>
        <span className="text-xs font-medium text-slate-600">
          Quota: {urlsSent} / 200
        </span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span className="text-xs font-medium text-slate-600">
          Resets in: {timeLeft}
        </span>
      </div>
    </div>
  );
}
