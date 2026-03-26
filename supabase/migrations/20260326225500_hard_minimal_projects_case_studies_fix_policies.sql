-- Fix hard-minimal migration by removing policies depending on dropped columns

drop policy if exists "projects_public_published" on public.projects;
drop policy if exists "case_studies_public_published" on public.case_studies;

alter table public.projects
  drop column if exists subtitle,
  drop column if exists problem,
  drop column if exists solution,
  drop column if exists roles,
  drop column if exists features,
  drop column if exists tech,
  drop column if exists cover_image_url,
  drop column if exists gallery_image_urls,
  drop column if exists gallery_video_urls,
  drop column if exists category,
  drop column if exists status,
  drop column if exists featured,
  drop column if exists sort_order,
  drop column if exists content_md;

alter table public.case_studies
  drop column if exists lede,
  drop column if exists summary,
  drop column if exists content_md,
  drop column if exists type,
  drop column if exists status,
  drop column if exists category,
  drop column if exists sort_order,
  drop column if exists role,
  drop column if exists team_size,
  drop column if exists timeline,
  drop column if exists industry,
  drop column if exists audience,
  drop column if exists skills,
  drop column if exists stack,
  drop column if exists results,
  drop column if exists metrics,
  drop column if exists links,
  drop column if exists cover_path,
  drop column if exists gallery_paths,
  drop column if exists seo_title,
  drop column if exists seo_description,
  drop column if exists views,
  drop column if exists published_at;
