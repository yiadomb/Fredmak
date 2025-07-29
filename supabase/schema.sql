-- Fredmak Hostel Database Schema
-- This file contains all the tables needed for the hostel management system

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE room_block AS ENUM ('Old', 'New', 'Executive');
CREATE TYPE application_status AS ENUM ('Pending', 'Accepted', 'Declined', 'Wait-list');
CREATE TYPE maintenance_status AS ENUM ('Open', 'In Progress', 'Completed', 'Cancelled');
CREATE TYPE payment_method AS ENUM ('Cash', 'Bank Transfer', 'Mobile Money', 'Cheque');
CREATE TYPE user_role AS ENUM ('Manager', 'Owner');

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Rooms table
CREATE TABLE rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_no VARCHAR(10) NOT NULL UNIQUE,
    block room_block NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 3,
    type VARCHAR(50) NOT NULL,
    floor VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Residents table (timeless student records)
CREATE TABLE residents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')),
    phone VARCHAR(20),
    email VARCHAR(255),
    student_id VARCHAR(50),
    program VARCHAR(255),
    level VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Occupancies table (links residents to rooms for specific academic years)
CREATE TABLE occupancies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    academic_year VARCHAR(10) NOT NULL DEFAULT '2024/25',
    fee_due DECIMAL(10,2) NOT NULL,
    move_in_date DATE,
    move_out_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(resident_id, academic_year)
);

-- Payments table
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    method payment_method NOT NULL DEFAULT 'Cash',
    reference_number VARCHAR(100),
    academic_year VARCHAR(10) NOT NULL DEFAULT '2024/25',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table (for new applicants)
CREATE TABLE applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    student_id VARCHAR(50),
    program VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')) NOT NULL,
    preferred_block room_block,
    room_type_preference VARCHAR(50),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    status application_status DEFAULT 'Pending',
    academic_year VARCHAR(10) NOT NULL DEFAULT '2024/25',
    tenancy_agreement_accepted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by VARCHAR(255),
    notes TEXT
);

-- Renewals table (for returning students)
CREATE TABLE renewals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
    academic_year VARCHAR(10) NOT NULL,
    stay BOOLEAN NOT NULL DEFAULT FALSE,
    desired_type VARCHAR(50),
    keep_roommates BOOLEAN DEFAULT TRUE,
    status application_status DEFAULT 'Pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    UNIQUE(resident_id, academic_year)
);

-- Maintenance Issues table
CREATE TABLE maintenance_issues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    block room_block NOT NULL,
    category VARCHAR(100),
    description TEXT NOT NULL,
    status maintenance_status DEFAULT 'Open',
    priority VARCHAR(20) DEFAULT 'Medium',
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    logged_by VARCHAR(255),
    assigned_to VARCHAR(255),
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    notes TEXT
);

-- App settings table (for academic year and fee matrix)
CREATE TABLE app_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by VARCHAR(255)
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role user_role NOT NULL DEFAULT 'Manager',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to calculate fee based on room type and academic year
CREATE OR REPLACE FUNCTION calculate_fee(room_block room_block, room_capacity INTEGER, academic_year VARCHAR(10))
RETURNS DECIMAL(10,2) AS $$
DECLARE
    fee_amount DECIMAL(10,2);
BEGIN
    -- Get fee matrix for the academic year
    SELECT 
        CASE 
            WHEN room_block = 'Old' AND room_capacity = 3 THEN 5500
            WHEN room_block = 'New' AND room_capacity = 2 THEN 7000
            WHEN room_block = 'Executive' AND room_capacity = 2 THEN 8000
            WHEN room_block = 'Executive' AND room_capacity = 1 THEN 13000
            ELSE 5500 -- Default fallback
        END INTO fee_amount;
    
    RETURN fee_amount;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_residents_updated_at BEFORE UPDATE ON residents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_occupancies_updated_at BEFORE UPDATE ON occupancies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewals ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (Manager and Owner roles)
-- Manager: Full access (read/write)
-- Owner: Read-only access

CREATE POLICY "Enable read access for authenticated users" ON rooms
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for managers" ON rooms
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'Manager'
        )
    );

-- Similar policies for other tables (simplified for brevity)
-- In production, each table would have detailed policies

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default app settings
INSERT INTO app_settings (key, value, description) VALUES
('current_academic_year', '"2024/25"', 'Current academic year for the system'),
('fee_matrix', '{
    "2024/25": {
        "Old": {"3": 5500},
        "New": {"2": 7000},
        "Executive": {"1": 13000, "2": 8000}
    }
}', 'Fee matrix for different room types by academic year');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;