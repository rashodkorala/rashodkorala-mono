-- Create storage buckets for case studies

-- Bucket for MDX files
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-studies-mdx', 'case-studies-mdx', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket for media (images, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-studies-media', 'case-studies-media', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload MDX files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own MDX files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own MDX files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view MDX files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own media" ON storage.objects;
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;

-- Policies for MDX bucket
CREATE POLICY "Authenticated users can upload MDX files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'case-studies-mdx');

CREATE POLICY "Users can update their own MDX files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'case-studies-mdx');

CREATE POLICY "Users can delete their own MDX files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'case-studies-mdx');

CREATE POLICY "Public can view MDX files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'case-studies-mdx');

-- Policies for media bucket
CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'case-studies-media');

CREATE POLICY "Users can update their own media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'case-studies-media');

CREATE POLICY "Users can delete their own media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'case-studies-media');

CREATE POLICY "Public can view media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'case-studies-media');
