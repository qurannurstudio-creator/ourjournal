import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BING_API_KEY = 'b136599ff6344d19a8b38d1b1e81b0d5';
const BING_SUBMIT_URL = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${BING_API_KEY}`;
const SITE_URL = 'https://modernjournal.info';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { urls } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ error: 'No URLs provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Submit to Bing API
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
      let bingErrorMsg = 'Failed to submit to Bing API';
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.Message) bingErrorMsg = parsed.Message;
      } catch(e) {}

      return new Response(JSON.stringify({ error: bingErrorMsg }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, count: urls.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
