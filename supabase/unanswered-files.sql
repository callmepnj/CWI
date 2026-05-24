create extension if not exists pgcrypto;

create table if not exists cwi_unanswered_articles (
  id text primary key,
  slug text not null unique,
  title text not null,
  summary text,
  category text,
  location text,
  start_date text,
  current_status text,
  hero_image text,
  reading_time text,
  source_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz not null default now(),
  seo_title text,
  seo_description text,
  seo_keywords text[]
);

create table if not exists cwi_unanswered_article_views (
  id bigserial primary key,
  article_id text not null references cwi_unanswered_articles(id) on delete cascade,
  ip_hash text,
  user_agent_hash text,
  viewed_at timestamptz not null default now()
);

create table if not exists cwi_unanswered_article_likes (
  id bigserial primary key,
  article_id text not null references cwi_unanswered_articles(id) on delete cascade,
  user_id text,
  ip_hash text,
  created_at timestamptz not null default now(),
  unique (article_id, ip_hash)
);

create table if not exists cwi_unanswered_article_shares (
  id bigserial primary key,
  article_id text not null references cwi_unanswered_articles(id) on delete cascade,
  platform text not null,
  shared_at timestamptz not null default now(),
  ip_hash text
);

create table if not exists cwi_unanswered_article_bookmarks (
  id bigserial primary key,
  article_id text not null references cwi_unanswered_articles(id) on delete cascade,
  user_id text,
  ip_hash text,
  created_at timestamptz not null default now(),
  unique (article_id, ip_hash)
);

create table if not exists cwi_unanswered_comments (
  id uuid primary key default gen_random_uuid(),
  article_id text not null references cwi_unanswered_articles(id) on delete cascade,
  parent_id uuid references cwi_unanswered_comments(id) on delete cascade,
  name text not null,
  email text,
  comment_text text not null,
  status text not null default 'pending',
  likes_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  ip_hash text,
  user_agent text
);

create table if not exists cwi_unanswered_comment_likes (
  id bigserial primary key,
  comment_id uuid not null references cwi_unanswered_comments(id) on delete cascade,
  user_id text,
  ip_hash text,
  created_at timestamptz not null default now(),
  unique (comment_id, ip_hash)
);

create table if not exists cwi_unanswered_sources (
  id bigserial primary key,
  article_id text not null references cwi_unanswered_articles(id) on delete cascade,
  title text not null,
  publisher text not null,
  source_url text not null,
  published_date text,
  reliability_label text,
  summary text,
  category text
);

create table if not exists cwi_unanswered_timelines (
  id bigserial primary key,
  article_id text not null references cwi_unanswered_articles(id) on delete cascade,
  event_date text not null,
  title text not null,
  description text not null,
  importance text,
  source_url text,
  image_url text,
  order_index integer not null default 0
);

create index if not exists cwi_unanswered_views_article_idx
on cwi_unanswered_article_views (article_id, viewed_at desc);

create index if not exists cwi_unanswered_comments_article_status_idx
on cwi_unanswered_comments (article_id, status, created_at desc);
