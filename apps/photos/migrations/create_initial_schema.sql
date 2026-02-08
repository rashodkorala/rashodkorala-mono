BEGIN;

-- Ensure UUID generation is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Photos table definition
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT DEFAULT 'Untitled',
    description TEXT,
    category TEXT DEFAULT 'abstract',
    image_url TEXT NOT NULL,
    alt_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT photos_category_check CHECK (
        category IN (
            'architecture',
            'nature',
            'street',
            'travel',
            'wildlife',
            'night',
            'abstract',
            'interior_spaces'
        ) OR category IS NULL
    )
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_photos_category ON public.photos (category);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON public.photos (created_at DESC);

-- Maintain updated_at automatically
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_photos_updated_at ON public.photos;

CREATE TRIGGER set_photos_updated_at
BEFORE UPDATE ON public.photos
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Ensure storage bucket exists for photo assets
INSERT INTO storage.buckets (id, name, public)
SELECT 'photos', 'photos', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'photos'
);

-- Grant public read access to the photos bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname = 'allow_public_read_photos'
    ) THEN
        CREATE POLICY "allow_public_read_photos"
        ON storage.objects
        FOR SELECT
        USING (bucket_id = 'photos');
    END IF;
END;
$$;

-- Allow authenticated users to upload/update objects in the photos bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname = 'allow_authenticated_upload_photos'
    ) THEN
        CREATE POLICY "allow_authenticated_upload_photos"
        ON storage.objects
        FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'photos');
    END IF;
END;
$$;

COMMIT;

