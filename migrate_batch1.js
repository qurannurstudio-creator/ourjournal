const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('Fetching blogs without batch_id...');
  
  const { data: blogs, error: fetchError } = await supabase
    .from('blogs')
    .select('id')
    .is('batch_id', null);

  if (fetchError) {
    console.error('Error fetching blogs:', fetchError);
    return;
  }

  if (!blogs || blogs.length === 0) {
    console.log('No blogs found without a batch_id. Migration already complete or no data.');
    return;
  }

  console.log(`Found ${blogs.length} blogs. Creating Batch 1...`);

  const { data: batch, error: batchError } = await supabase
    .from('batches')
    .insert([{ name: 'Batch 1 (Initial)', post_count: blogs.length }])
    .select()
    .single();

  if (batchError) {
    console.error('Error creating batch:', batchError);
    return;
  }

  const batchId = batch.id;
  console.log(`Created Batch 1 with ID: ${batchId}. Updating blogs...`);

  const blogIds = blogs.map(b => b.id);

  // Supabase update with IN operator
  const { error: updateError } = await supabase
    .from('blogs')
    .update({ batch_id: batchId })
    .in('id', blogIds);

  if (updateError) {
    console.error('Error updating blogs:', updateError);
    return;
  }

  console.log('Migration complete! All existing blogs assigned to Batch 1.');
}

migrate();
