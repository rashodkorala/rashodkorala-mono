-- Photo "Stories" — thematic groups (places, trips). Run in Supabase SQL editor after photos table exists.

CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT stories_user_slug_unique UNIQUE (user_id, slug)
);

CREATE INDEX IF NOT EXISTS stories_user_id_idx ON stories(user_id);
CREATE INDEX IF NOT EXISTS stories_published_idx ON stories(published) WHERE published = true;

ALTER TABLE photos ADD COLUMN IF NOT EXISTS story_id UUID REFERENCES stories(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS photos_story_id_idx ON photos(story_id) WHERE story_id IS NOT NULL;

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own stories" ON stories;
DROP POLICY IF EXISTS "Users can insert own stories" ON stories;
DROP POLICY IF EXISTS "Users can update own stories" ON stories;
DROP POLICY IF EXISTS "Users can delete own stories" ON stories;
DROP POLICY IF EXISTS "Public read published stories" ON stories;

CREATE POLICY "Users can view own stories"
  ON stories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stories"
  ON stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories"
  ON stories FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories"
  ON stories FOR DELETE
  USING (auth.uid() = user_id);

-- Anonymous visitors can read published stories (Photos app)
CREATE POLICY "Public read published stories"
  ON stories FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Public read photos in published stories" ON photos;

CREATE POLICY "Public read photos in published stories"
  ON photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM stories s
      WHERE s.id = photos.story_id AND s.published = true
    )
  );

CREATE OR REPLACE FUNCTION update_stories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_stories_updated_at ON stories;
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_stories_updated_at();
