-- Maintenance Issues Setup
-- Simple table for logging maintenance issues with auto-grouping by room

-- Create maintenance_issues table
CREATE TABLE IF NOT EXISTS maintenance_issues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id VARCHAR(20),  -- Optional, can be extracted from description
    block VARCHAR(50),    -- Optional, for future use
    category VARCHAR(100), -- Optional, for categorization
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved')),
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_issues(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_logged ON maintenance_issues(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_maintenance_room ON maintenance_issues(room_id);

-- Disable RLS for now (enable with proper policies in production)
ALTER TABLE maintenance_issues DISABLE ROW LEVEL SECURITY;

-- Create or replace the update function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_maintenance_updated_at ON maintenance_issues;
CREATE TRIGGER update_maintenance_updated_at 
    BEFORE UPDATE ON maintenance_issues
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();