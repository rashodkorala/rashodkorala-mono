-- Updated blogs table schema - using markdown files in storage instead of content TEXT
-- Run this SQL in your Supabase SQL Editor

-- Add mdx_path column (if it doesn't exist)
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS mdx_path TEXT;

-- Make content column nullable (since we're using markdown files in storage)
ALTER TABLE blogs ALTER COLUMN content DROP NOT NULL;

-- Optionally, remove content column entirely if you have no data to migrate
-- ALTER TABLE blogs DROP COLUMN IF EXISTS content;

-- Create index for mdx_path
CREATE INDEX IF NOT EXISTS blogs_mdx_path_idx ON blogs(mdx_path);