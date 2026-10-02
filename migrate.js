const { createClient } = require('@supabase/supabase-js');
const Papa = require('papaparse');

const SUPABASE_URL = 'https://pjjuhpwvlzlcowdpufda.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqanVocHd2bHpsY293ZHB1ZmRhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDg1NTk5NywiZXhwIjoyMTA2NDMxOTk3fQ.2DC2EkLgiRxe63SVutpUzpUCyDzSGMpDS3bftOmUjVA';
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_q0UqgVywATO3HNZV3CwkU-BS2bJAvH0e3vtVt-C2AUVk4FMMUpOTxDHv6TfC3vhUUZ3yHxI-G1zY/pub?output=csv';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function migrate() {
  console.log('Fetching CSV from Google Sheets...');
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error('Failed to fetch CSV');
  const csvText = await res.text();

  console.log('Parsing CSV...');
  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const posts = results.data;
      console.log(`Found ${posts.length} posts. Inserting to Supabase...`);

      const formattedPosts = posts.map(post => ({
        title: post.Title,
        slug: post.Slug,
        description: post.Description,
        content: post.Content,
        image: post.Image,
        date: post.Date,
        tags: post.Tags,
      }));

      // Insert in chunks of 50 to avoid any limits
      const chunkSize = 50;
      for (let i = 0; i < formattedPosts.length; i += chunkSize) {
        const chunk = formattedPosts.slice(i, i + chunkSize);
        const { error } = await supabase.from('blogs').upsert(chunk, { onConflict: 'slug' });
        if (error) {
          console.error('Error inserting chunk:', error);
          return;
        }
        console.log(`Inserted ${i + chunk.length} / ${formattedPosts.length} posts...`);
      }
      
      console.log('Migration complete!');
    }
  });
}

migrate().catch(console.error);
