import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const BING_API_KEY = 'b136599ff6344d19a8b38d1b1e81b0d5';
const BING_SUBMIT_URL = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${BING_API_KEY}`;
const SITE_URL = 'https://modernjournal.info';

export async function POST(req: Request) {
  try {
    const { urls, blogIds, batchId } = await req.json();

    if (!urls || !urls.length) {
      return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });
    }

    // 1. Submit to Bing API
    const response = await fetch(BING_SUBMIT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        siteUrl: SITE_URL,
        urlList: urls,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bing API Error:', errorText);
      return NextResponse.json({ error: 'Failed to submit to Bing API' }, { status: response.status });
    }

    // 2. Update Supabase blogs table to mark as indexed
    if (blogIds && blogIds.length > 0) {
      const { error: updateError } = await supabase
        .from('blogs')
        .update({ indexed_at: new Date().toISOString() })
        .in('id', blogIds);

      if (updateError) {
        console.error('Error updating indexed_at in Supabase:', updateError);
        // We continue because Bing submission was successful
      }
    }

    // 3. Log to indexing_logs
    const today = new Date().toISOString().split('T')[0];
    const { error: logError } = await supabase
      .from('indexing_logs')
      .insert({
        date: today,
        urls_sent: urls.length,
      });

    if (logError) {
      console.error('Error logging to indexing_logs:', logError);
    }

    return NextResponse.json({ success: true, count: urls.length });
  } catch (error: any) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
