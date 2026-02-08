-- Drop existing table if you need to start fresh
-- DROP TABLE IF EXISTS case_studies CASCADE;

-- Case Studies Table
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  type TEXT DEFAULT 'problem-solving' CHECK (type IN ('problem-solving', 'descriptive')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  
  -- Subject
  subject_name TEXT,
  subject_type TEXT,
  industry TEXT,
  audience TEXT,
  
  -- Team
  role TEXT,
  team_size TEXT,
  timeline TEXT,
  
  -- Technical (JSONB for arrays)
  tags JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  stack JSONB DEFAULT '[]',
  
  -- Media
  cover_url TEXT,
  gallery_urls JSONB DEFAULT '[]',
  
  -- Links and Proof
  links JSONB DEFAULT '[]',
  results JSONB DEFAULT '[]',
  metrics JSONB DEFAULT '[]',
  
  -- MDX Storage Reference
  mdx_path TEXT NOT NULL,
  
  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  
  -- Analytics
  views INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Policies: Allow anyone to read published case studies
CREATE POLICY "Published case studies are viewable by everyone"
  ON case_studies FOR SELECT
  USING (status = 'published');

-- Allow authenticated users to view all their own case studies
CREATE POLICY "Users can view their own case studies"
  ON case_studies FOR SELECT
  USING (auth.uid() = user_id);

-- Allow authenticated users to create case studies
CREATE POLICY "Users can create their own case studies"
  ON case_studies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own case studies
CREATE POLICY "Users can update their own case studies"
  ON case_studies FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own case studies
CREATE POLICY "Users can delete their own case studies"
  ON case_studies FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS case_studies_user_id_idx ON case_studies(user_id);
CREATE INDEX IF NOT EXISTS case_studies_slug_idx ON case_studies(slug);
CREATE INDEX IF NOT EXISTS case_studies_status_idx ON case_studies(status);
CREATE INDEX IF NOT EXISTS case_studies_type_idx ON case_studies(type);
CREATE INDEX IF NOT EXISTS case_studies_featured_idx ON case_studies(featured);
CREATE INDEX IF NOT EXISTS case_studies_published_at_idx ON case_studies(published_at);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_case_studies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW
  EXECUTE FUNCTION update_case_studies_updated_at();
