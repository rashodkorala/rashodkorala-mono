-- Canonical schema migration
-- Drops work_items / journal_entries / legacy tables
-- Creates projects + case_studies as first-class tables
-- Safe to run after 20260326120000_cms_schema_cleanup.sql

-- ============================================================
-- Step 1: Create new `projects` table
-- ============================================================

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  title text not null,
  subtitle text,
  problem text,
  solution text,
  roles text[] not null default '{}',
  features text[] not null default '{}',
  tech text[] not null default '{}',
  live_url text,
  github_url text,
  cover_image_url text,
  gallery_image_urls text[] not null default '{}',
  gallery_video_urls text[] not null default '{}',
  category text check (category in ('startup', 'client', 'personal', 'school')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

-- ============================================================
-- Step 2: Create new `case_studies` table
-- ============================================================

create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  slug text not null,
  lede text,
  summary text,
  content_md text not null default '',
  type text not null default 'descriptive' check (type in ('problem-solving', 'descriptive')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  category text check (category in ('startup', 'client', 'personal', 'school')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  role text,
  team_size text,
  timeline text,
  industry text,
  audience text,
  tags jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  stack jsonb not null default '[]'::jsonb,
  results jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '[]'::jsonb,
  links jsonb not null default '[]'::jsonb,
  cover_path text,
  gallery_paths jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  views integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

-- ============================================================
-- Step 3: updated_at triggers for new tables
-- ============================================================

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_projects_updated_at'
      and tgrelid = 'public.projects'::regclass
  ) then
    create trigger set_projects_updated_at
    before update on public.projects
    for each row execute function handle_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_case_studies_updated_at'
      and tgrelid = 'public.case_studies'::regclass
  ) then
    create trigger set_case_studies_updated_at
    before update on public.case_studies
    for each row execute function handle_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_media_library_updated_at'
      and tgrelid = 'public.media_library'::regclass
  ) then
    create trigger set_media_library_updated_at
    before update on public.media_library
    for each row execute function handle_updated_at();
  end if;
end $$;

-- ============================================================
-- Step 4: Migrate data from work_items → projects and case_studies
-- ============================================================

-- Projects: kind in ('project', 'commercial_photography')
insert into public.projects (
  id, user_id, slug, title, subtitle, tech, live_url, github_url,
  cover_image_url, gallery_image_urls, gallery_video_urls,
  status, featured, sort_order, created_at, updated_at
)
select
  wi.id,
  wi.user_id,
  wi.slug,
  wi.title,
  wi.subtitle,
  array(select jsonb_array_elements_text(wi.stack)),
  wi.live_url,
  wi.github_url,
  wi.cover_image_url,
  array(select jsonb_array_elements_text(wi.gallery_urls)),
  array(select jsonb_array_elements_text(wi.gallery_video_urls)),
  wi.status::text,
  wi.featured,
  wi.sort_order,
  wi.created_at,
  wi.updated_at
from public.work_items wi
where wi.kind in ('project', 'commercial_photography')
on conflict (user_id, slug) do nothing;

-- Case studies: kind = 'case_study'
insert into public.case_studies (
  id, user_id, slug, title, summary, content_md,
  status, featured, sort_order, role, timeline,
  tags, stack, links, views, published_at, created_at, updated_at
)
select
  wi.id,
  wi.user_id,
  wi.slug,
  wi.title,
  wi.summary,
  coalesce(wb.content_md, ''),
  wi.status::text,
  wi.featured,
  wi.sort_order,
  wi.role,
  wi.timeline,
  wi.tags,
  wi.stack,
  wi.links,
  0,
  wi.published_at,
  wi.created_at,
  wi.updated_at
from public.work_items wi
left join public.work_bodies wb on wb.work_item_id = wi.id
where wi.kind = 'case_study'
on conflict (user_id, slug) do nothing;

-- ============================================================
-- Step 5: Indexes on new tables
-- ============================================================

create index if not exists idx_projects_user_status on public.projects(user_id, status);
create index if not exists idx_projects_status_sort on public.projects(status, sort_order, created_at desc) where status = 'published';
create index if not exists idx_case_studies_user_status on public.case_studies(user_id, status);
create index if not exists idx_case_studies_status_sort on public.case_studies(status, sort_order, published_at desc) where status = 'published';
create index if not exists idx_case_studies_project_id on public.case_studies(project_id);

-- ============================================================
-- Step 6: RLS on new tables
-- ============================================================

alter table public.projects enable row level security;
alter table public.case_studies enable row level security;

-- Public read (published)
drop policy if exists "projects_public_published" on public.projects;
create policy "projects_public_published" on public.projects
for select to anon, authenticated
using (status = 'published');

drop policy if exists "case_studies_public_published" on public.case_studies;
create policy "case_studies_public_published" on public.case_studies
for select to anon, authenticated
using (status = 'published');

-- Owner CRUD
drop policy if exists "projects_select_own" on public.projects;
drop policy if exists "projects_insert_own" on public.projects;
drop policy if exists "projects_update_own" on public.projects;
drop policy if exists "projects_delete_own" on public.projects;
create policy "projects_select_own" on public.projects for select using ((select auth.uid()) = user_id);
create policy "projects_insert_own" on public.projects for insert with check ((select auth.uid()) = user_id);
create policy "projects_update_own" on public.projects for update using ((select auth.uid()) = user_id);
create policy "projects_delete_own" on public.projects for delete using ((select auth.uid()) = user_id);

drop policy if exists "case_studies_select_own" on public.case_studies;
drop policy if exists "case_studies_insert_own" on public.case_studies;
drop policy if exists "case_studies_update_own" on public.case_studies;
drop policy if exists "case_studies_delete_own" on public.case_studies;
create policy "case_studies_select_own" on public.case_studies for select using ((select auth.uid()) = user_id);
create policy "case_studies_insert_own" on public.case_studies for insert with check ((select auth.uid()) = user_id);
create policy "case_studies_update_own" on public.case_studies for update using ((select auth.uid()) = user_id);
create policy "case_studies_delete_own" on public.case_studies for delete using ((select auth.uid()) = user_id);

-- ============================================================
-- Step 7: Drop legacy compatibility views
-- ============================================================

drop view if exists public.projects_legacy_view;
drop view if exists public.case_studies_legacy_view;

-- ============================================================
-- Step 8: Drop legacy tables (journal_entries, work_items, etc.)
-- Ordered by FK dependencies.
-- ============================================================

-- photos.journal_entry_id FK
alter table public.photos
  drop column if exists journal_entry_id,
  drop column if exists photo_type,
  drop column if exists hobby_category;

drop table if exists public.journal_media cascade;
drop table if exists public.journal_entries cascade;
drop table if exists public.work_bodies cascade;
drop table if exists public.work_items cascade;

-- ============================================================
-- Step 9: Drop unused enum types (only if no longer referenced)
-- ============================================================

do $$
begin
  if exists (select 1 from pg_type where typname = 'work_kind') then
    drop type if exists public.work_kind cascade;
  end if;
  if exists (select 1 from pg_type where typname = 'work_target_app') then
    drop type if exists public.work_target_app cascade;
  end if;
  if exists (select 1 from pg_type where typname = 'journal_entry_type') then
    drop type if exists public.journal_entry_type cascade;
  end if;
  if exists (select 1 from pg_type where typname = 'hobby_category') then
    drop type if exists public.hobby_category cascade;
  end if;
  if exists (select 1 from pg_type where typname = 'photo_type') then
    drop type if exists public.photo_type cascade;
  end if;
end $$;

-- ============================================================
-- Step 10: Drop old source tables (work, stories, view_posts)
-- Only if they exist and were not already removed.
-- ============================================================

drop table if exists public.view_posts cascade;
drop table if exists public.stories cascade;
drop table if exists public.work cascade;
drop table if exists public.blogs cascade;
drop table if exists public.media cascade;
drop table if exists public.analytics cascade;
