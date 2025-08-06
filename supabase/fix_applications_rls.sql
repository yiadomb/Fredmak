-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'applications';

-- Disable RLS to allow updates
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS but make it permissive for now:
-- ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
-- 
-- DROP POLICY IF EXISTS "Enable all for testing" ON applications;
-- CREATE POLICY "Enable all for testing" ON applications
--     FOR ALL 
--     USING (true) 
--     WITH CHECK (true);