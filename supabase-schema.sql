-- Curated Tweets — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Categories table
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now() not null
);

-- Tweets table
create table tweets (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  category_id uuid not null references categories(id) on delete cascade,
  note text,
  pinned boolean default false not null,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_tweets_category_id on tweets(category_id);
create index idx_tweets_created_at on tweets(created_at desc);

-- Enable Row Level Security
alter table categories enable row level security;
alter table tweets enable row level security;

-- Categories: public read
create policy "Anyone can read categories"
  on categories for select
  to anon, authenticated
  using (true);

-- Categories: authenticated write
create policy "Authenticated users can create categories"
  on categories for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update categories"
  on categories for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete categories"
  on categories for delete
  to authenticated
  using (true);

-- Tweets: public read
create policy "Anyone can read tweets"
  on tweets for select
  to anon, authenticated
  using (true);

-- Tweets: authenticated write
create policy "Authenticated users can create tweets"
  on tweets for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update tweets"
  on tweets for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete tweets"
  on tweets for delete
  to authenticated
  using (true);

-- Add metadata columns to tweets (for caching enrichment data)
-- Run this if you already have the tweets table:
-- ALTER TABLE tweets ADD COLUMN image_url text;
-- ALTER TABLE tweets ADD COLUMN author_name text;
-- ALTER TABLE tweets ADD COLUMN author_handle text;
-- ALTER TABLE tweets ADD COLUMN text_content text;

-- Submissions table (public suggestions)
create table submissions (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  submitted_by text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now() not null
);

alter table submissions enable row level security;

-- Submissions: anyone can insert
create policy "Anyone can submit"
  on submissions for insert
  to anon, authenticated
  with check (true);

-- Submissions: only authenticated can read/update/delete
create policy "Authenticated users can read submissions"
  on submissions for select
  to authenticated
  using (true);

create policy "Authenticated users can update submissions"
  on submissions for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete submissions"
  on submissions for delete
  to authenticated
  using (true);

-- Seed categories (adjust as needed)
insert into categories (name, slug) values
  ('Design', 'design'),
  ('AI', 'ai'),
  ('Web3', 'web3'),
  ('Branding', 'branding'),
  ('Systems', 'systems');
