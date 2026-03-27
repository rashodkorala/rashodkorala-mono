-- Add subtitle back to projects schema

alter table public.projects
  add column if not exists subtitle text;
