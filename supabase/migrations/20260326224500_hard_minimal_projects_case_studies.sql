-- Hard-minimal schema for projects + case_studies
-- Keeps only target fields plus identity/audit columns

-- ============================================================
-- projects
-- ============================================================
alter table public.projects
  add column if not exists short_description text,
  add column if not exists cover_image text,
  add column if not exists project_media jsonb not null default '[]'::jsonb,
  add column if not exists role text,
  add column if not exists timeline text,
  add column if not exists tech_stack text[] not null default '{}',
  add column if not exists live_url text,
  add column if not exists github_url text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'projects_project_media_is_array_chk'
      and conrelid = 'public.projects'::regclass
  ) then
    alter table public.projects
      add constraint projects_project_media_is_array_chk
      check (jsonb_typeof(project_media) = 'array');
  end if;
end $$;

alter table public.projects
  drop column if exists subtitle,
  drop column if exists problem,
  drop column if exists solution,
  drop column if exists roles,
  drop column if exists features,
  drop column if exists tech,
  drop column if exists cover_image_url,
  drop column if exists gallery_image_urls,
  drop column if exists gallery_video_urls,
  drop column if exists category,
  drop column if exists status,
  drop column if exists featured,
  drop column if exists sort_order,
  drop column if exists content_md;

-- ============================================================
-- case_studies
-- ============================================================
alter table public.case_studies
  add column if not exists gallery text[] not null default '{}',
  add column if not exists featured_screens text[] not null default '{}',
  add column if not exists before_after jsonb not null default '{"beforeImage":null,"afterImage":null}'::jsonb,
  add column if not exists "order" integer not null default 0,
  add column if not exists featured boolean not null default false,
  add column if not exists tags text[] not null default '{}';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'case_studies_before_after_is_object_chk'
      and conrelid = 'public.case_studies'::regclass
  ) then
    alter table public.case_studies
      add constraint case_studies_before_after_is_object_chk
      check (jsonb_typeof(before_after) = 'object');
  end if;
end $$;

update public.case_studies
set gallery = coalesce(gallery_paths::text[], '{}')
where cardinality(gallery) = 0;

alter table public.case_studies
  drop column if exists lede,
  drop column if exists summary,
  drop column if exists content_md,
  drop column if exists type,
  drop column if exists status,
  drop column if exists category,
  drop column if exists sort_order,
  drop column if exists role,
  drop column if exists team_size,
  drop column if exists timeline,
  drop column if exists industry,
  drop column if exists audience,
  drop column if exists skills,
  drop column if exists stack,
  drop column if exists results,
  drop column if exists metrics,
  drop column if exists links,
  drop column if exists cover_path,
  drop column if exists gallery_paths,
  drop column if exists seo_title,
  drop column if exists seo_description,
  drop column if exists views,
  drop column if exists published_at;

drop index if exists idx_projects_user_status;
drop index if exists idx_projects_status_sort;
drop index if exists idx_case_studies_user_status;
drop index if exists idx_case_studies_status_sort;

create index if not exists idx_projects_user_updated
  on public.projects(user_id, updated_at desc);

create index if not exists idx_case_studies_project_order
  on public.case_studies(project_id, "order");
