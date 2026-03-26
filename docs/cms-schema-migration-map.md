# CMS Schema Field Mapping

This document defines exact field-level mapping from legacy tables to canonical tables.

## `work` -> `work_items`

- `work.id` -> `work_items.id`
- `work.user_id` -> `work_items.user_id`
- `work.slug` -> `work_items.slug`
- `work.title` -> `work_items.title`
- `work.subtitle` -> `work_items.subtitle`
- `work.description` -> `work_items.summary`
- `work.category` -> `work_items.kind`:
  - `case-study` / `case_study` / `case study` -> `case_study`
  - `commercial` / `commercial-photography` / `commercial_photography` -> `commercial_photography`
  - otherwise -> `project`
- `work.status` -> `work_items.status`
- `work.target_app` -> `work_items.target_app`
- `work.featured` -> `work_items.featured`
- `work.sort_order` -> `work_items.sort_order`
- `work.cover_image_url` -> `work_items.cover_image_url`
- `work.live_url` -> `work_items.live_url`
- `work.github_url` -> `work_items.github_url`
- `work.case_study_url` -> `work_items.case_study_url`
- `work.tech` -> `work_items.stack` (array -> jsonb)
- `work.created_at` -> `work_items.created_at`
- `work.updated_at` -> `work_items.updated_at`
- derived: if `status = published`, set `published_at = updated_at` fallback `created_at`

## `projects` -> `work_items` (optional import)

- `projects.id` -> `work_items.id`
- `projects.user_id` -> `work_items.user_id`
- `projects.slug` -> `work_items.slug`
- `projects.title` -> `work_items.title`
- `projects.subtitle` -> `work_items.subtitle`
- `projects.problem` -> `work_items.summary`
- `projects.role` (if present) -> `work_items.role`
- `projects.timeline` (if present) -> `work_items.timeline`
- fixed: `work_items.kind = project`
- `projects.status` -> `work_items.status`
- `projects.featured` -> `work_items.featured`
- `projects.sort_order` -> `work_items.sort_order`
- `projects.cover_image_url` -> `work_items.cover_image_url`
- `projects.live_url` -> `work_items.live_url`
- `projects.github_url` -> `work_items.github_url`
- `projects.case_study_url` -> `work_items.case_study_url`
- `projects.tech` -> `work_items.stack` (array -> jsonb)
- `projects.gallery_image_urls` -> `work_items.gallery_urls` (array -> jsonb)
- `projects.gallery_video_urls` -> `work_items.gallery_video_urls` (array -> jsonb)
- `projects.created_at` -> `work_items.created_at`
- `projects.updated_at` -> `work_items.updated_at`

## `case_studies` -> `work_items` + `work_bodies`

- `case_studies.id` -> `work_items.id`
- `case_studies.user_id` -> `work_items.user_id`
- `case_studies.slug` -> `work_items.slug`
- `case_studies.title` -> `work_items.title`
- `case_studies.summary` -> `work_items.summary`
- `case_studies.role` -> `work_items.role`
- `case_studies.timeline` -> `work_items.timeline`
- fixed: `work_items.kind = case_study`
- `case_studies.status` -> `work_items.status`
- `case_studies.featured` -> `work_items.featured`
- `case_studies.published_at` -> `work_items.published_at`
- `case_studies.cover_url` -> `work_items.cover_image_url`
- `case_studies.stack` -> `work_items.stack` (array -> jsonb)
- `case_studies.tags` -> `work_items.tags` (array -> jsonb)
- `case_studies.links` -> `work_items.links` (jsonb passthrough)
- `case_studies.gallery_urls` -> `work_items.gallery_urls` (array -> jsonb)
- `case_studies.gallery_video_urls` -> `work_items.gallery_video_urls` (array -> jsonb)
- `case_studies.created_at` -> `work_items.created_at`
- `case_studies.updated_at` -> `work_items.updated_at`
- `case_studies.mdx_path` content (resolved externally) -> `work_bodies.content_md`

## `stories` -> `journal_entries`

- `stories.id` -> `journal_entries.id`
- `stories.user_id` -> `journal_entries.user_id`
- `stories.slug` -> `journal_entries.slug`
- `stories.title` -> `journal_entries.title`
- `stories.description` -> `journal_entries.excerpt`
- `stories.description` -> `journal_entries.content_md` (fallback bootstrap content)
- fixed: `journal_entries.entry_type = photo_story`
- `stories.published` -> `journal_entries.status` (`true` => `published`, `false` => `draft`)
- when published: `stories.updated_at` -> `journal_entries.published_at`
- `stories.cover_image_url` -> `journal_entries.cover_image_url`
- fixed: `journal_entries.target_app = photos`
- `stories.created_at` -> `journal_entries.created_at`
- `stories.updated_at` -> `journal_entries.updated_at`

## `view_posts` -> `journal_entries`

- `view_posts.id` -> `journal_entries.id`
- `view_posts.user_id` -> `journal_entries.user_id`
- `view_posts.slug` -> `journal_entries.slug`
- `view_posts.title` -> `journal_entries.title`
- `view_posts.excerpt` -> `journal_entries.excerpt`
- `view_posts.content` -> `journal_entries.content_md`
- inferred `journal_entries.entry_type`:
  - story/travel/photo-story -> `photo_story`
  - travel-note -> `travel_note`
  - otherwise -> `essay`
- `view_posts.status` -> `journal_entries.status`
- `view_posts.published_at` -> `journal_entries.published_at`
- `view_posts.featured_image_url` -> `journal_entries.cover_image_url`
- `view_posts.featured_video_url` -> `journal_entries.cover_video_url`
- `view_posts.tags` -> `journal_entries.tags` (array -> jsonb)
- `view_posts.category` -> `journal_entries.category`
- `view_posts.target_app` -> `journal_entries.target_app`
- `view_posts.featured` -> `journal_entries.featured`
- `view_posts.views` -> `journal_entries.views`
- `view_posts.author_name` -> `journal_entries.author_name`
- `view_posts.seo_title` -> `journal_entries.seo_title`
- `view_posts.seo_description` -> `journal_entries.seo_description`
- `view_posts.created_at` -> `journal_entries.created_at`
- `view_posts.updated_at` -> `journal_entries.updated_at`

## `photos` compatibility updates

- preserve all existing columns and rows.
- add `photo_type` with default `hobby`.
- add `hobby_category` nullable.
- add `journal_entry_id` nullable.
- backfill `photos.journal_entry_id = photos.story_id` when present.

