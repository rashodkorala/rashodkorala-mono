-- Restore public read access for portfolio app
-- Schema is now hard-minimal (no status column), so allow read on all rows.

drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read"
on public.projects
for select
to anon, authenticated
using (true);

drop policy if exists "case_studies_public_read" on public.case_studies;
create policy "case_studies_public_read"
on public.case_studies
for select
to anon, authenticated
using (true);
