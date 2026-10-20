-- Limit public reads of case_studies to published rows, matching projects_public_read.
-- Drafts and archived entries were readable by anyone holding the publishable key.
-- The CMS keeps reading its own rows through case_studies_select_own; portfolio draft
-- previews read through SUPABASE_SERVICE_ROLE_KEY (set it before applying this).
-- case_study_projects has no public policy (only csp_*_own), so it is left alone.

drop policy if exists "case_studies_public_read" on public.case_studies;
create policy "case_studies_public_read"
on public.case_studies
for select
to anon, authenticated
using (status = 'published');
