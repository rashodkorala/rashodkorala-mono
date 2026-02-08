-- Create storage buckets for blogs (The View)

-- Bucket for Markdown files
INSERT INTO storage.buckets (id, name, public)
VALUES ('blogs-mdx', 'blogs-mdx', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket for blog media (images used in blog posts)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blogs-media', 'blogs-media', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload blog MDX files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own blog MDX files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own blog MDX files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view blog MDX files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own blog media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own blog media" ON storage.objects;
DROP POLICY IF EXISTS "Public can view blog media" ON storage.objects;

-- Policies for MDX bucket
CREATE POLICY "Authenticated users can upload blog MDX files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blogs-mdx');

CREATE POLICY "Users can update their own blog MDX files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blogs-mdx');

CREATE POLICY "Users can delete their own blog MDX files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blogs-mdx');

CREATE POLICY "Public can view blog MDX files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'blogs-mdx');

-- Policies for media bucket
CREATE POLICY "Authenticated users can upload blog media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blogs-media');

CREATE POLICY "Users can update their own blog media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blogs-media');

CREATE POLICY "Users can delete their own blog media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blogs-media');

CREATE POLICY "Public can view blog media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'blogs-media');