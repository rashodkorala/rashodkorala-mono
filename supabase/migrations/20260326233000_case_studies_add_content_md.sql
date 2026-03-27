-- Add markdown body to simplified case studies model

alter table public.case_studies
  add column if not exists content_md text not null default '';
