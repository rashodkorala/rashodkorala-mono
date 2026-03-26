-- Remove featured screens from case studies (no longer needed)

alter table public.case_studies
  drop column if exists featured_screens;
