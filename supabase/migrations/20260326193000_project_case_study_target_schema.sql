-- Align projects + case_studies with target CMS schema
-- Safe additive migration (empty tables in your environment)

alter table public.projects
  add column if not exists short_description text,
  add column if not exists cover_image text,
  add column if not exists project_media jsonb not null default '[]'::jsonb,
  add column if not exists role text,
  add column if not exists timeline text,
  add column if not exists tech_stack text[] not null default '{}';

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

alter table public.case_studies
  add column if not exists problem text,
  add column if not exists approach text,
  add column if not exists solution text,
  add column if not exists impact text,
  add column if not exists learnings text,
  add column if not exists featured_screens text[] not null default '{}',
  add column if not exists before_after jsonb not null default '{"beforeImage":null,"afterImage":null}'::jsonb;

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
