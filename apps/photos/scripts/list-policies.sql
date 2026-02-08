-- List all RLS policies for tables
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- List all storage bucket policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;

-- Summary: Count policies per table
SELECT 
    schemaname,
    tablename,
    COUNT(*) as policy_count
FROM pg_policies
GROUP BY schemaname, tablename
ORDER BY schemaname, tablename;

