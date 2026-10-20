-- Short-lived tokens for previewing unpublished Satahan entries on the portfolio.
-- The CMS (signed in) creates a token for one entry; the portfolio, using only the public key,
-- exchanges it for that entry through preview_case_study(). No service-role key is needed.

create table if not exists public.preview_tokens (
  token text primary key default encode(extensions.gen_random_bytes(24), 'hex'),
  case_study_id uuid not null references public.case_studies (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  expires_at timestamptz not null default now() + interval '1 hour',
  created_at timestamptz not null default now()
);

create index if not exists preview_tokens_user_id_idx on public.preview_tokens (user_id);
create index if not exists preview_tokens_case_study_id_idx on public.preview_tokens (case_study_id);

alter table public.preview_tokens enable row level security;

-- Only the owner of an entry can make, see or revoke its tokens. Nobody else can read the table.
create policy "preview_tokens_insert_own"
on public.preview_tokens
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.case_studies cs
    where cs.id = case_study_id and cs.user_id = (select auth.uid())
  )
);

create policy "preview_tokens_select_own"
on public.preview_tokens
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "preview_tokens_delete_own"
on public.preview_tokens
for delete
to authenticated
using (user_id = (select auth.uid()));

-- The one way in for the portfolio: a valid, unexpired token returns exactly its entry, in any status.
create or replace function public.preview_case_study(preview_token text)
returns setof public.case_studies
language sql
stable
security definer
set search_path = ''
as $$
  select cs.*
  from public.case_studies cs
  join public.preview_tokens pt on pt.case_study_id = cs.id
  where pt.token = preview_token
    and pt.expires_at > now();
$$;

revoke all on function public.preview_case_study(text) from public;
grant execute on function public.preview_case_study(text) to anon, authenticated;
