const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Need service role to bypass RLS for bulk update
);

async function fix() {
  // Get all blogs about F1/Singapore (the 200 we just added)
  const { data: blogs, error: fetchError } = await supabase
    .from('blogs')
    .select('id, title')
    .ilike('title', '%Guide%')
    .ilike('title', '%Free%');

  if (fetchError) {
    console.error("Fetch Error:", fetchError);
    return;
  }
  
  console.log(`Found ${blogs.length} blogs to update.`);
  
  if(blogs.length === 0) return;

  // Update them in chunks
  let updatedCount = 0;
  for (let i = 0; i < blogs.length; i++) {
    const seed = Math.floor(Math.random() * 100000);
    const newImageUrl = `https://picsum.photos/seed/f1_sg_${seed}/800/600`;
    
    const { error: updateError } = await supabase
      .from('blogs')
      .update({ image: newImageUrl })
      .eq('id', blogs[i].id);
      
    if (updateError) {
      console.error(`Failed to update ${blogs[i].id}:`, updateError);
    } else {
      updatedCount++;
    }
  }
  
  console.log(`Successfully updated ${updatedCount} images to picsum.`);
}

fix();
