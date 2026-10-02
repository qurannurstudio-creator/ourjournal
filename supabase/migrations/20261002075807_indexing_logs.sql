create table if not exists public.indexing_logs (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    date date not null default current_date,
    urls_sent integer not null,
    status text not null,
    batch_id uuid references public.batches(id) on delete set null
);

-- Enable RLS
alter table public.indexing_logs enable row level security;

-- Allow public read access (for admin dashboard)
create policy "Allow public read access on indexing_logs"
  on public.indexing_logs for select
  using (true);

-- Allow service role to insert (Edge Function)
create policy "Allow service role insert on indexing_logs"
  on public.indexing_logs for insert
  with check (true);
