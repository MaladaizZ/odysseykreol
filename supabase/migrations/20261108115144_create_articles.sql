create table public.articles (
  id uuid primary key default gen_random_uuid(),

  author_id uuid not null references auth.users(id) on delete restrict,

  title text not null,
  slug text not null unique,
  excerpt text not null,
  content jsonb not null,

  status text not null default 'draft'
    check (status in ('draft', 'published')),

  created_at timestamptz not null default now(),
  published_at timestamptz
);

alter table public.articles enable row level security; --active la RLS