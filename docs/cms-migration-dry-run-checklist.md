# CMS Migration Dry-Run Checklist

Use this before applying `supabase/migrations/20260326120000_cms_schema_cleanup.sql`.

## 1) Preflight data checks

Run these in Supabase SQL editor first:

```sql
-- Unknown statuses in legacy tables
select status, count(*) from public.work group by status order by 2 desc;
select status, count(*) from public.view_posts group by status order by 2 desc;

-- Unknown target_app values
select target_app, count(*) from public.work group by target_app order by 2 desc;
select target_app, count(*) from public.view_posts group by target_app order by 2 desc;

-- Orphan story links from photos
select count(*) as orphan_story_links
from public.photos p
left join public.stories s on s.id = p.story_id
where p.story_id is not null and s.id is null;
```

Expected:
- status values should mostly be `draft`, `published`, `archived`
- target app values should be `portfolio`, `photos`, `both`, or null
- orphan links can exist; migration now safely skips those rows

## 2) Apply migration in staging first

1. Create/refresh staging project.
2. Apply migration.
3. Validate row counts:

```sql
select count(*) from public.work_items;
select count(*) from public.journal_entries;
select count(*) from public.about_profiles;
```

## 3) Validate backfill mapping

```sql
-- Work kind distribution
select kind, count(*) from public.work_items group by kind order by 2 desc;

-- Journal type distribution
select entry_type, count(*) from public.journal_entries group by entry_type order by 2 desc;

-- Photos linked to journal
select count(*) from public.photos where journal_entry_id is not null;
```

## 4) Validate public reads

```sql
-- Published content should be visible to anon/authenticated by policy
select count(*) from public.work_items where status = 'published';
select count(*) from public.journal_entries where status = 'published';
```

## 5) Validate compatibility views

```sql
select count(*) from public.projects_legacy_view;
select count(*) from public.case_studies_legacy_view;
```

## 6) Query plan sanity checks (optional but recommended)

```sql
explain analyze
select *
from public.work_items
where status = 'published'
  and target_app in ('portfolio', 'both')
order by sort_order asc, created_at desc
limit 20;

explain analyze
select *
from public.journal_entries
where status = 'published'
  and target_app in ('portfolio', 'both')
order by published_at desc, created_at desc
limit 20;
```

You should see index-backed plans, not large sequential scans, on moderate/large tables.

## 7) Rollout order

1. Apply SQL migration.
2. Deploy app code that reads canonical tables.
3. Monitor errors for old-table reads.
4. Keep compatibility views for one release window.
5. Remove legacy paths/tables only after stable verification.

