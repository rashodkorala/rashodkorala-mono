-- Migration: Add video support for projects, case studies, and blogs
-- Run this in Supabase SQL Editor after existing schemas. Does not drop data.

-- Projects: add gallery video URLs
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS gallery_video_urls TEXT[] DEFAULT '{}';

-- Blogs: add optional featured video URL
ALTER TABLE blogs
  ADD COLUMN IF NOT EXISTS featured_video_url TEXT;

-- Case studies: add gallery video URLs (images stay in gallery_urls)
ALTER TABLE case_studies
  ADD COLUMN IF NOT EXISTS gallery_video_urls TEXT[] DEFAULT '{}';

-- Optional: Allow video uploads in projects bucket (run if bucket already exists)
UPDATE storage.buckets
SET
  file_size_limit = 104857600,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
WHERE id = 'projects';
