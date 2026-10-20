-- Satahan entries can be linked to a page in the Notion "Writings" database and pulled from it.

alter table public.case_studies
  add column if not exists notion_page_id text unique,
  -- Notion's last_edited_time as of the last pull, so the CMS can tell when Notion has newer edits.
  add column if not exists notion_last_edited_at timestamptz,
  add column if not exists notion_synced_at timestamptz,
  -- sha256 of content_md as pulled; a different hash now means the body was edited in the CMS since.
  add column if not exists notion_body_hash text;
