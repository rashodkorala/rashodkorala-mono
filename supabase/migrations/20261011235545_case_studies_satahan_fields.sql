-- Satahan (formerly case studies on /work): entries are either long case studies or short notes,
-- carry a permanent notebook number ("Satahan Nº 02"), and an optional one-line takeaway.

alter table public.case_studies
  add column if not exists kind text not null default 'case_study',
  add column if not exists entry_number integer,
  add column if not exists in_short text;

alter table public.case_studies
  drop constraint if exists case_studies_kind_check;
alter table public.case_studies
  add constraint case_studies_kind_check check (kind in ('case_study', 'note'));

-- Number already-published entries oldest first. New entries get a number on first publish.
with numbered as (
  select id, row_number() over (partition by user_id order by created_at) as n
  from public.case_studies
  where status = 'published' and entry_number is null
)
update public.case_studies cs
set entry_number = numbered.n
from numbered
where cs.id = numbered.id;

create unique index if not exists case_studies_user_entry_number_key
  on public.case_studies (user_id, entry_number)
  where entry_number is not null;
