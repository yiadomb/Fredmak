-- Fix RLS policies for applications table
-- Drop existing policies first
DROP POLICY IF EXISTS "Public can submit applications" ON applications;
DROP POLICY IF EXISTS "Applicants can view own application" ON applications;
DROP POLICY IF EXISTS "Public can view applications" ON applications;
DROP POLICY IF EXISTS "Managers can manage applications" ON applications;

-- Temporarily disable RLS to test
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS enabled but make it more permissive:
-- ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable all access for testing" ON applications
--     FOR ALL USING (true) WITH CHECK (true);