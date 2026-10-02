-- The portfolio home (about) section reads this table on every request.
-- Visitors can read it. Only the owner can change their row.

drop policy if exists "about_profiles_public_read" on public.about_profiles;
create policy "about_profiles_public_read"
on public.about_profiles
for select
to anon, authenticated
using (true);
