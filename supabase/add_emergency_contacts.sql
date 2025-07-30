-- Add emergency contact fields to residents table
ALTER TABLE residents 
ADD COLUMN emergency_contact_name VARCHAR(255),
ADD COLUMN emergency_contact_relationship VARCHAR(100),
ADD COLUMN emergency_contact_phone VARCHAR(20);

-- Update the existing update trigger to include new columns
-- (The trigger will automatically handle these new columns)