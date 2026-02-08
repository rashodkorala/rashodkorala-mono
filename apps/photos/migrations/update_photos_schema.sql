-- Drop existing check constraint
ALTER TABLE public.photos DROP CONSTRAINT IF EXISTS photos_category_check;

-- Update the table to make fields optional
ALTER TABLE public.photos 
    ALTER COLUMN title DROP NOT NULL,
    ALTER COLUMN description DROP NOT NULL,
    ALTER COLUMN category DROP NOT NULL,
    ALTER COLUMN alt_text DROP NOT NULL;

-- Add new check constraint for category
ALTER TABLE public.photos ADD CONSTRAINT photos_category_check 
CHECK (category IN (
    'architecture',
    'nature',
    'street',
    'travel',
    'wildlife',
    'night',
    'abstract'
) OR category IS NULL);

-- Add default values for optional fields
ALTER TABLE public.photos 
    ALTER COLUMN title SET DEFAULT 'Untitled',
    ALTER COLUMN category SET DEFAULT 'abstract';

-- Update existing NULL values with defaults
UPDATE public.photos 
SET title = 'Untitled' 
WHERE title IS NULL;

UPDATE public.photos 
SET category = 'abstract' 
WHERE category IS NULL; 