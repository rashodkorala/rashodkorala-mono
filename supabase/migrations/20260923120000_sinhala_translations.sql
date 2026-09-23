-- Sinhala (si) translations for portfolio content.
--
-- The CMS fills the *_si columns automatically when English content is saved
-- (apps/cms/lib/translation). Empty *_si values fall back to English on the portfolio.
--
-- translation_hashes: { "<english column>": "<hash of the English text the Sinhala was made from>" }
--   → lets the CMS re-translate only the fields whose English actually changed.
-- translation_status:
--   pending  = translation queued/running after a save
--   auto     = machine-translated, not yet reviewed
--   reviewed = a human checked/edited the Sinhala
--   stale    = English changed but re-translation failed (Sinhala shown is outdated)

alter table public.projects
  add column if not exists title_si text,
  add column if not exists subtitle_si text,
  add column if not exists short_description_si text,
  add column if not exists role_si text,
  add column if not exists timeline_si text,
  add column if not exists translation_hashes jsonb not null default '{}'::jsonb,
  add column if not exists translation_status text,
  add column if not exists translated_at timestamptz;

alter table public.case_studies
  add column if not exists title_si text,
  add column if not exists summary_si text,
  add column if not exists content_md_si text,
  add column if not exists role_si text,
  add column if not exists timeline_si text,
  add column if not exists translation_hashes jsonb not null default '{}'::jsonb,
  add column if not exists translation_status text,
  add column if not exists translated_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'projects_translation_status_chk'
      and conrelid = 'public.projects'::regclass
  ) then
    alter table public.projects
      add constraint projects_translation_status_chk
      check (translation_status is null or translation_status in ('pending', 'auto', 'reviewed', 'stale'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'case_studies_translation_status_chk'
      and conrelid = 'public.case_studies'::regclass
  ) then
    alter table public.case_studies
      add constraint case_studies_translation_status_chk
      check (translation_status is null or translation_status in ('pending', 'auto', 'reviewed', 'stale'));
  end if;
end $$;
