-- Add missing columns to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create or replace the update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Ensure RLS is disabled for testing
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;