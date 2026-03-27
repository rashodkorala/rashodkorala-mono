-- CMS schema cleanup: canonical domains (work, journal, about, media)
-- Safe for phased rollout with compatibility views.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'work_kind') then
    create type public.work_kind as enum ('case_study', 'project', 'commercial_photography');
  end if;
  if not exists (select 1 from pg_type where typname = 'publish_status') then
    create type public.publish_status as enum ('draft', 'published', 'archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'work_target_app') then
    create type public.work_target_app as enum ('portfolio', 'photos', 'both');
  end if;
  if not exists (select 1 from pg_type where typname = 'journal_entry_type') then
    create type public.journal_entry_type as enum ('photo_story', 'travel_note', 'essay', 'update');
  end if;
  if not exists (select 1 from pg_type where typname = 'photo_type') then
    create type public.photo_type as enum ('hobby', 'commercial');
  end if;
  if not exists (select 1 from pg_type where typname = 'hobby_category') then
    create type public.hobby_category as enum ('travel', 'leisure', 'documentary', 'other');
  end if;
  if not exists (select 1 from pg_type where typname = 'library_media_type') then
    create type public.library_media_type as enum ('image', 'video', 'audio', 'document', 'other');
  end if;
end $$;

create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket text not null default 'media',
  path text not null,
  public_url text,
  media_type public.library_media_type not null default 'image',
  width integer,
  height integer,
  bytes bigint,
  alt_text text,
  folder text,
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, path)
);

create table if not exists public.work_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  title text not null,
  subtitle text,
  summary text,
  role text,
  timeline text,
  kind public.work_kind not null default 'project',
  status public.publish_status not null default 'draft',
  target_app public.work_target_app not null default 'portfolio',
  featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  cover_media_id uuid references public.media_library(id) on delete set null,
  cover_image_url text,
  live_url text,
  github_url text,
  case_study_url text,
  stack jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  links jsonb not null default '[]'::jsonb,
  gallery_urls jsonb not null default '[]'::jsonb,
  gallery_video_urls jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table if not exists public.work_bodies (
  work_item_id uuid primary key references public.work_items(id) on delete cascade,
  content_md text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  title text not null,
  excerpt text,
  content_md text not null default '',
  entry_type public.journal_entry_type not null default 'essay',
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  cover_media_id uuid references public.media_library(id) on delete set null,
  cover_image_url text,
  cover_video_url text,
  tags jsonb not null default '[]'::jsonb,
  category text,
  target_app public.work_target_app not null default 'portfolio',
  featured boolean not null default false,
  views integer not null default 0,
  author_name text,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table if not exists public.journal_media (
  id uuid primary key default gen_random_uuid(),
  journal_entry_id uuid not null references public.journal_entries(id) on delete cascade,
  media_id uuid not null references public.media_library(id) on delete cascade,
  sort_order integer not null default 0,
  caption text,
  created_at timestamptz not null default now(),
  unique (journal_entry_id, media_id)
);

create table if not exists public.about_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  headline text,
  bio_md text not null default '',
  location text,
  email_public text,
  avatar_media_id uuid references public.media_library(id) on delete set null,
  avatar_url text,
  social_links jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.photos
  add column if not exists photo_type public.photo_type default 'hobby',
  add column if not exists hobby_category public.hobby_category,
  add column if not exists journal_entry_id uuid references public.journal_entries(id) on delete set null;

update public.photos
set photo_type = 'hobby'
where photo_type is null;

-- Backfill work_items from current work table.
insert into public.work_items (
  id, user_id, slug, title, subtitle, summary, kind, status, target_app, featured, sort_order,
  cover_image_url, live_url, github_url, case_study_url, stack, tags, links, created_at, updated_at, published_at
)
select
  w.id,
  w.user_id,
  w.slug,
  w.title,
  w.subtitle,
  w.description,
  case
    when lower(coalesce(w.category, '')) in ('case-study', 'case_study', 'case study') then 'case_study'::public.work_kind
    when lower(coalesce(w.category, '')) in ('commercial', 'commercial-photography', 'commercial_photography') then 'commercial_photography'::public.work_kind
    else 'project'::public.work_kind
  end,
  case
    when w.status = 'published' then 'published'::public.publish_status
    when w.status = 'archived' then 'archived'::public.publish_status
    else 'draft'::public.publish_status
  end,
  case
    when w.target_app = 'photos' then 'photos'::public.work_target_app
    when w.target_app = 'both' then 'both'::public.work_target_app
    else 'portfolio'::public.work_target_app
  end,
  coalesce(w.featured, false),
  coalesce(w.sort_order, 0),
  w.cover_image_url,
  w.live_url,
  w.github_url,
  w.case_study_url,
  to_jsonb(coalesce(w.tech, array[]::text[])),
  '[]'::jsonb,
  '[]'::jsonb,
  w.created_at,
  w.updated_at,
  case when w.status = 'published' then coalesce(w.updated_at, w.created_at) else null end
from public.work w
on conflict (id) do nothing;

-- Backfill journal_entries from stories.
insert into public.journal_entries (
  id, user_id, slug, title, excerpt, content_md, entry_type, status, published_at,
  cover_image_url, target_app, featured, views, created_at, updated_at
)
select
  s.id,
  s.user_id,
  s.slug,
  s.title,
  s.description,
  coalesce(s.description, ''),
  'photo_story'::public.journal_entry_type,
  case when s.published then 'published'::public.publish_status else 'draft'::public.publish_status end,
  case when s.published then s.updated_at else null end,
  s.cover_image_url,
  'photos'::public.work_target_app,
  false,
  0,
  s.created_at,
  s.updated_at
from public.stories s
on conflict (id) do nothing;

-- Backfill journal_entries from view_posts/blogs.
insert into public.journal_entries (
  id, user_id, slug, title, excerpt, content_md, entry_type, status, published_at,
  cover_image_url, cover_video_url, tags, category, target_app, featured, views, author_name,
  seo_title, seo_description, created_at, updated_at
)
select
  b.id,
  b.user_id,
  b.slug,
  b.title,
  b.excerpt,
  coalesce(b.content, ''),
  case
    when lower(coalesce(b.category, '')) in ('story', 'travel', 'photo-story', 'photo_story') then 'photo_story'::public.journal_entry_type
    when lower(coalesce(b.category, '')) in ('travel-note', 'travel_note') then 'travel_note'::public.journal_entry_type
    else 'essay'::public.journal_entry_type
  end,
  case
    when b.status = 'published' then 'published'::public.publish_status
    when b.status = 'archived' then 'archived'::public.publish_status
    else 'draft'::public.publish_status
  end,
  b.published_at,
  b.featured_image_url,
  b.featured_video_url,
  to_jsonb(coalesce(b.tags, array[]::text[])),
  b.category,
  case
    when b.target_app = 'photos' then 'photos'::public.work_target_app
    when b.target_app = 'both' then 'both'::public.work_target_app
    else 'portfolio'::public.work_target_app
  end,
  coalesce(b.featured, false),
  coalesce(b.views, 0),
  b.author_name,
  b.seo_title,
  b.seo_description,
  b.created_at,
  b.updated_at
from public.view_posts b
on conflict (id) do nothing;

-- Backfill photos -> journal relationship where story_id exists.
update public.photos p
set journal_entry_id = p.story_id
where p.story_id is not null
  and p.journal_entry_id is null
  and exists (
    select 1
    from public.journal_entries je
    where je.id = p.story_id
  );

create index if not exists idx_work_items_user_status on public.work_items(user_id, status);
create index if not exists idx_work_items_kind_status on public.work_items(kind, status);
create index if not exists idx_journal_entries_user_status on public.journal_entries(user_id, status);
create index if not exists idx_journal_entries_entry_type_status on public.journal_entries(entry_type, status);
create index if not exists idx_media_library_user_folder on public.media_library(user_id, folder);
create index if not exists idx_photos_journal_entry_id on public.photos(journal_entry_id);
create index if not exists idx_work_items_user_status_updated on public.work_items(user_id, status, updated_at desc);
create index if not exists idx_journal_entries_user_status_created on public.journal_entries(user_id, status, created_at desc);
create index if not exists idx_work_items_published_target_sort
  on public.work_items(status, target_app, sort_order, created_at desc)
  where status = 'published';
create index if not exists idx_journal_entries_published_target_date
  on public.journal_entries(status, target_app, published_at desc, created_at desc)
  where status = 'published';
create index if not exists idx_work_items_cover_media_id on public.work_items(cover_media_id);
create index if not exists idx_journal_entries_cover_media_id on public.journal_entries(cover_media_id);
create index if not exists idx_about_profiles_avatar_media_id on public.about_profiles(avatar_media_id);
create index if not exists idx_journal_media_entry_id on public.journal_media(journal_entry_id);
create index if not exists idx_journal_media_media_id on public.journal_media(media_id);

-- Data shape constraints (idempotent).
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'work_items_slug_format_chk'
      and conrelid = 'public.work_items'::regclass
  ) then
    alter table public.work_items
      add constraint work_items_slug_format_chk
      check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'journal_entries_slug_format_chk'
      and conrelid = 'public.journal_entries'::regclass
  ) then
    alter table public.journal_entries
      add constraint journal_entries_slug_format_chk
      check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'work_items_stack_is_array_chk'
      and conrelid = 'public.work_items'::regclass
  ) then
    alter table public.work_items
      add constraint work_items_stack_is_array_chk
      check (jsonb_typeof(stack) = 'array');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'work_items_tags_is_array_chk'
      and conrelid = 'public.work_items'::regclass
  ) then
    alter table public.work_items
      add constraint work_items_tags_is_array_chk
      check (jsonb_typeof(tags) = 'array');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'work_items_links_is_array_chk'
      and conrelid = 'public.work_items'::regclass
  ) then
    alter table public.work_items
      add constraint work_items_links_is_array_chk
      check (jsonb_typeof(links) = 'array');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'journal_entries_tags_is_array_chk'
      and conrelid = 'public.journal_entries'::regclass
  ) then
    alter table public.journal_entries
      add constraint journal_entries_tags_is_array_chk
      check (jsonb_typeof(tags) = 'array');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'media_library_tags_is_array_chk'
      and conrelid = 'public.media_library'::regclass
  ) then
    alter table public.media_library
      add constraint media_library_tags_is_array_chk
      check (jsonb_typeof(tags) = 'array');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'about_profiles_social_links_is_array_chk'
      and conrelid = 'public.about_profiles'::regclass
  ) then
    alter table public.about_profiles
      add constraint about_profiles_social_links_is_array_chk
      check (jsonb_typeof(social_links) = 'array');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'photos_hobby_category_for_hobby_chk'
      and conrelid = 'public.photos'::regclass
  ) then
    alter table public.photos
      add constraint photos_hobby_category_for_hobby_chk
      check (
        (photo_type = 'commercial' and hobby_category is null)
        or (photo_type = 'hobby')
      );
  end if;
end $$;

alter table public.photos alter column photo_type set not null;

alter table public.work_items enable row level security;
alter table public.work_bodies enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journal_media enable row level security;
alter table public.about_profiles enable row level security;
alter table public.media_library enable row level security;

-- owner policies created below using performance-optimized `(select auth.uid())` pattern.

-- Public read policies for published content.
drop policy if exists "work_items_public_published" on public.work_items;
create policy "work_items_public_published" on public.work_items
for select to anon, authenticated
using (status = 'published');

drop policy if exists "journal_entries_public_published" on public.journal_entries;
create policy "journal_entries_public_published" on public.journal_entries
for select to anon, authenticated
using (status = 'published');

-- Recreate performance-optimized RLS policies (auth.uid evaluated once).
drop policy if exists "work_items_select_own" on public.work_items;
drop policy if exists "work_items_insert_own" on public.work_items;
drop policy if exists "work_items_update_own" on public.work_items;
drop policy if exists "work_items_delete_own" on public.work_items;
create policy "work_items_select_own" on public.work_items
for select using ((select auth.uid()) = user_id);
create policy "work_items_insert_own" on public.work_items
for insert with check ((select auth.uid()) = user_id);
create policy "work_items_update_own" on public.work_items
for update using ((select auth.uid()) = user_id);
create policy "work_items_delete_own" on public.work_items
for delete using ((select auth.uid()) = user_id);

drop policy if exists "journal_entries_select_own" on public.journal_entries;
drop policy if exists "journal_entries_insert_own" on public.journal_entries;
drop policy if exists "journal_entries_update_own" on public.journal_entries;
drop policy if exists "journal_entries_delete_own" on public.journal_entries;
create policy "journal_entries_select_own" on public.journal_entries
for select using ((select auth.uid()) = user_id);
create policy "journal_entries_insert_own" on public.journal_entries
for insert with check ((select auth.uid()) = user_id);
create policy "journal_entries_update_own" on public.journal_entries
for update using ((select auth.uid()) = user_id);
create policy "journal_entries_delete_own" on public.journal_entries
for delete using ((select auth.uid()) = user_id);

drop policy if exists "about_profiles_select_own" on public.about_profiles;
drop policy if exists "about_profiles_insert_own" on public.about_profiles;
drop policy if exists "about_profiles_update_own" on public.about_profiles;
drop policy if exists "about_profiles_delete_own" on public.about_profiles;
create policy "about_profiles_select_own" on public.about_profiles
for select using ((select auth.uid()) = user_id);
create policy "about_profiles_insert_own" on public.about_profiles
for insert with check ((select auth.uid()) = user_id);
create policy "about_profiles_update_own" on public.about_profiles
for update using ((select auth.uid()) = user_id);
create policy "about_profiles_delete_own" on public.about_profiles
for delete using ((select auth.uid()) = user_id);

drop policy if exists "media_library_select_own" on public.media_library;
drop policy if exists "media_library_insert_own" on public.media_library;
drop policy if exists "media_library_update_own" on public.media_library;
drop policy if exists "media_library_delete_own" on public.media_library;
create policy "media_library_select_own" on public.media_library
for select using ((select auth.uid()) = user_id);
create policy "media_library_insert_own" on public.media_library
for insert with check ((select auth.uid()) = user_id);
create policy "media_library_update_own" on public.media_library
for update using ((select auth.uid()) = user_id);
create policy "media_library_delete_own" on public.media_library
for delete using ((select auth.uid()) = user_id);

drop policy if exists "work_bodies_select_own" on public.work_bodies;
drop policy if exists "work_bodies_insert_own" on public.work_bodies;
drop policy if exists "work_bodies_update_own" on public.work_bodies;
drop policy if exists "work_bodies_delete_own" on public.work_bodies;
create policy "work_bodies_select_own" on public.work_bodies
for select using (
  exists (
    select 1 from public.work_items wi
    where wi.id = work_item_id and wi.user_id = (select auth.uid())
  )
);
create policy "work_bodies_insert_own" on public.work_bodies
for insert with check (
  exists (
    select 1 from public.work_items wi
    where wi.id = work_item_id and wi.user_id = (select auth.uid())
  )
);
create policy "work_bodies_update_own" on public.work_bodies
for update using (
  exists (
    select 1 from public.work_items wi
    where wi.id = work_item_id and wi.user_id = (select auth.uid())
  )
);
create policy "work_bodies_delete_own" on public.work_bodies
for delete using (
  exists (
    select 1 from public.work_items wi
    where wi.id = work_item_id and wi.user_id = (select auth.uid())
  )
);

drop policy if exists "journal_media_select_own" on public.journal_media;
drop policy if exists "journal_media_insert_own" on public.journal_media;
drop policy if exists "journal_media_update_own" on public.journal_media;
drop policy if exists "journal_media_delete_own" on public.journal_media;
create policy "journal_media_select_own" on public.journal_media
for select using (
  exists (
    select 1 from public.journal_entries je
    where je.id = journal_entry_id and je.user_id = (select auth.uid())
  )
);
create policy "journal_media_insert_own" on public.journal_media
for insert with check (
  exists (
    select 1 from public.journal_entries je
    where je.id = journal_entry_id and je.user_id = (select auth.uid())
  )
);
create policy "journal_media_update_own" on public.journal_media
for update using (
  exists (
    select 1 from public.journal_entries je
    where je.id = journal_entry_id and je.user_id = (select auth.uid())
  )
);
create policy "journal_media_delete_own" on public.journal_media
for delete using (
  exists (
    select 1 from public.journal_entries je
    where je.id = journal_entry_id and je.user_id = (select auth.uid())
  )
);

-- Compatibility views for phased code migration.
create or replace view public.projects_legacy_view as
select
  wi.id,
  wi.user_id,
  wi.slug,
  wi.title,
  wi.subtitle,
  wi.summary as problem,
  null::text as solution,
  null::text[] as roles,
  null::text[] as features,
  array(select jsonb_array_elements_text(wi.stack)) as tech,
  wi.live_url,
  wi.github_url,
  wi.case_study_url,
  wi.cover_image_url,
  array(select jsonb_array_elements_text(wi.gallery_urls)) as gallery_image_urls,
  array(select jsonb_array_elements_text(wi.gallery_video_urls)) as gallery_video_urls,
  case wi.kind when 'project' then 'personal'::text else 'client'::text end as category,
  wi.status::text as status,
  wi.featured,
  wi.sort_order,
  wi.created_at,
  wi.updated_at
from public.work_items wi
where wi.kind in ('project', 'commercial_photography');

create or replace view public.case_studies_legacy_view as
select
  wi.id,
  wi.user_id,
  wi.title,
  wi.slug,
  wi.summary,
  'descriptive'::text as type,
  wi.status::text as status,
  wi.featured,
  wi.published_at,
  null::text as subject_name,
  null::text as subject_type,
  null::text as industry,
  null::text as audience,
  wi.role,
  null::text as team_size,
  wi.timeline,
  array(select jsonb_array_elements_text(wi.tags)) as tags,
  array[]::text[] as skills,
  array(select jsonb_array_elements_text(wi.stack)) as stack,
  wi.cover_image_url as cover_url,
  array(select jsonb_array_elements_text(wi.gallery_urls)) as gallery_urls,
  array(select jsonb_array_elements_text(wi.gallery_video_urls)) as gallery_video_urls,
  wi.links,
  '[]'::jsonb as results,
  '[]'::jsonb as metrics,
  null::text as mdx_path,
  null::text as seo_title,
  null::text as seo_description,
  0::integer as views,
  wi.created_at,
  wi.updated_at
from public.work_items wi
where wi.kind = 'case_study';

