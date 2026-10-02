-- Publish / unpublish for projects.
-- Rows that already exist were publicly readable, so they stay published.
-- New rows default to draft until the CMS publishes them.

alter table public.projects
  add column if not exists status text,
  add column if not exists published_at timestamptz;

update public.projects
set status = 'published'
where status is null;

update public.projects
set published_at = coalesce(updated_at, created_at, now())
where status = 'published'
  and published_at is null;

alter table public.projects
  alter column status set default 'draft',
  alter column status set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'projects_status_chk'
      and conrelid = 'public.projects'::regclass
  ) then
    alter table public.projects
      add constraint projects_status_chk
      check (status in ('draft', 'published'));
  end if;
end $$;

create index if not exists idx_projects_published_created
  on public.projects (published_at desc, created_at desc)
  where status = 'published';

-- Visitors only see published projects. Owners still read drafts via projects_select_own.
drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read"
on public.projects
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "projects_select_own" on public.projects;
drop policy if exists "projects_insert_own" on public.projects;
drop policy if exists "projects_update_own" on public.projects;
drop policy if exists "projects_delete_own" on public.projects;

create policy "projects_select_own" on public.projects
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "projects_insert_own" on public.projects
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "projects_update_own" on public.projects
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "projects_delete_own" on public.projects
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
