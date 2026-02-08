-- Migration: Add target_app column to blogs table
-- Run this SQL in your Supabase SQL Editor

-- Add target_app column with default value 'portfolio'
ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS target_app TEXT NOT NULL
CHECK (target_app IN ('portfolio', 'photos', 'both'))
DEFAULT 'portfolio';

-- Create index for filtering by target app
CREATE INDEX IF NOT EXISTS blogs_target_app_idx ON blogs(target_app);

-- Add policy for public read access to published blogs
-- This allows the portfolio and photos apps to fetch blogs without authentication
DROP POLICY IF EXISTS "Public can view published blogs" ON blogs;
CREATE POLICY "Public can view published blogs"
  ON blogs FOR SELECT
  USING (status = 'published');

-- Note: The existing user policies still apply for authenticated users
-- This new policy only allows anonymous users to see published blogs
