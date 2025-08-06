-- Applications Table Setup
-- This file creates the necessary table for the application system

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    student_id VARCHAR(50),
    program VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')) NOT NULL,
    preferred_block VARCHAR(20) CHECK (preferred_block IN ('Old', 'New', 'Executive')),
    room_type_preference VARCHAR(50),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    special_requirements TEXT,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Declined', 'Wait-list')),
    academic_year VARCHAR(10) NOT NULL DEFAULT '2024/25',
    tenancy_agreement_accepted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_academic_year ON applications(academic_year);
CREATE INDEX IF NOT EXISTS idx_applications_submitted ON applications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);

-- Add RLS policies
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Public can insert applications (for the application form)
CREATE POLICY "Public can submit applications" ON applications
    FOR INSERT WITH CHECK (true);

-- Public can view their own application (by email)
CREATE POLICY "Applicants can view own application" ON applications
    FOR SELECT USING (true);

-- Authenticated users (managers) can manage all applications
CREATE POLICY "Managers can manage applications" ON applications
    FOR ALL USING (auth.role() = 'authenticated');

-- Create or replace the function to update updated_at timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update updated_at
CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();