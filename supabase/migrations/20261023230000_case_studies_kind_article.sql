-- Satahan gets a third kind: long-form articles, alongside case studies and notes.
alter table public.case_studies
  drop constraint if exists case_studies_kind_check;
alter table public.case_studies
  add constraint case_studies_kind_check check (kind in ('case_study', 'article', 'note'));
