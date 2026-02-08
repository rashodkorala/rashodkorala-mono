-- Update RLS policy to allow authenticated users (including service account) to read all photos
-- This keeps data read-only for authenticated users while allowing the service account to fetch photos

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own photos" ON public.photos;

-- Create a new policy that allows any authenticated user to read photos
CREATE POLICY "Authenticated users can view photos"
ON public.photos
FOR SELECT
TO authenticated
USING (true);

-- Keep the existing policies for INSERT, UPDATE, DELETE (users can only modify their own)
-- These should remain as "Users can insert/update/delete their own photos"

-- Verify the policy was created
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'photos'
ORDER BY policyname;

