-- Satahan entries carry a real published date, set once on first publish and never changed by later edits.

alter table public.case_studies
  add column if not exists published_at timestamptz;

-- Entries already live get their creation time as the best available publish date.
update public.case_studies
set published_at = created_at
where status = 'published' and published_at is null;
