-- Settings Table Setup
-- Stores system configuration for the hostel management system

-- Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Enforce single row
    
    -- Hostel Information
    hostel_name VARCHAR(255) DEFAULT 'Fredmak Hostel',
    hostel_address TEXT,
    hostel_phone VARCHAR(20),
    hostel_email VARCHAR(255),
    manager_name VARCHAR(255) DEFAULT 'Manager',
    
    -- Academic Year
    current_academic_year VARCHAR(10) DEFAULT '2024/25',
    semester_start_date DATE,
    semester_end_date DATE,
    
    -- Fee Settings (in local currency)
    old_building_fee DECIMAL(10, 2) DEFAULT 5500,
    new_building_fee DECIMAL(10, 2) DEFAULT 7000,
    executive_fee DECIMAL(10, 2) DEFAULT 8000,
    
    -- Room Configuration
    total_old_rooms INTEGER DEFAULT 20,
    total_new_rooms INTEGER DEFAULT 20,
    total_executive_rooms INTEGER DEFAULT 8,
    
    -- System Settings
    allow_online_applications BOOLEAN DEFAULT TRUE,
    maintenance_email_alerts BOOLEAN DEFAULT FALSE,
    auto_assign_rooms BOOLEAN DEFAULT FALSE,
    require_guarantor BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create or replace the update function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update updated_at
DROP TRIGGER IF EXISTS update_app_settings_updated_at ON app_settings;
CREATE TRIGGER update_app_settings_updated_at 
    BEFORE UPDATE ON app_settings
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings if not exists
INSERT INTO app_settings (id) 
VALUES (1) 
ON CONFLICT (id) DO NOTHING;

-- Disable RLS for simplicity (settings are manager-only)
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;

-- Grant permissions (if needed for your setup)
-- GRANT ALL ON app_settings TO authenticated;