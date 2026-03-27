-- Add optional logo field to projects
alter table public.projects
  add column if not exists logo text;
