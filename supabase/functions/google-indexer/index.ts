import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SignJWT, importPKCS8 } from "npm:jose";
import { createClient } from "npm:@supabase/supabase-js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getAccessToken(clientEmail: string, privateKey: string) {
  const alg = 'RS256';
  const privateKeyObj = await importPKCS8(privateKey, alg);

  const jwt = await new SignJWT({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKeyObj);

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error('Failed to get access token from Google: ' + JSON.stringify(data));
  }
  return data.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { urls, blogIds, batchId } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ error: 'No URLs provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check Quota
    const today = new Date().toISOString().split('T')[0];
    const { data: logs, error: logError } = await supabase
      .from('indexing_logs')
      .select('urls_sent')
      .eq('date', today);

    if (logError) {
      console.error('Error fetching logs:', logError);
    }

    let todaySent = 0;
    if (logs && logs.length > 0) {
      todaySent = logs.reduce((acc, log) => acc + (log.urls_sent || 0), 0);
    }

    if (todaySent + urls.length > 200) {
      return new Response(JSON.stringify({ error: `Quota Exceeded. You have already sent ${todaySent}/200 URLs today. Limit is 200.` }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let credsJson = Deno.env.get('GOOGLE_APPLICATION_CREDENTIALS_JSON');
    if (!credsJson) {
      throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS_JSON secret');
    }

    let creds;
    try {
      creds = JSON.parse(credsJson);
    } catch(e) {
      creds = JSON.parse(credsJson.replace(/\\n/g, '\\n'));
    }

    const privateKey = creds.private_key.replace(/\\n/g, '\n');
    const token = await getAccessToken(creds.client_email, privateKey);

    // Send URLs to Google
    const results = await Promise.all(urls.map(async (url) => {
      const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          url: url,
          type: 'URL_UPDATED'
        })
      });
      return { url, status: res.status };
    }));

    // Update Supabase Blogs
    if (blogIds && blogIds.length > 0) {
      await supabase
        .from('blogs')
        .update({ indexed_at: new Date().toISOString() })
        .in('id', blogIds);
    }

    // Insert Log
    await supabase.from('indexing_logs').insert({
      urls_sent: urls.length,
      status: 'SUCCESS',
      batch_id: batchId || null,
      date: today
    });

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
