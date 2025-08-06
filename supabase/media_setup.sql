-- Media Gallery Setup
-- This file creates the necessary table and storage bucket for the gallery feature

-- Create media_gallery table to store metadata
CREATE TABLE IF NOT EXISTS media_gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL DEFAULT 'Other',
    file_url TEXT NOT NULL,
    file_type VARCHAR(10) NOT NULL CHECK (file_type IN ('image', 'video')),
    file_size INTEGER, -- in bytes
    mime_type VARCHAR(100),
    uploaded_by VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_media_gallery_category ON media_gallery(category);
CREATE INDEX idx_media_gallery_active ON media_gallery(is_active);
CREATE INDEX idx_media_gallery_created ON media_gallery(created_at DESC);

-- Add RLS policies
ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;

-- Public can view active media
CREATE POLICY "Public can view active media" ON media_gallery
    FOR SELECT USING (is_active = true);

-- Authenticated users (managers) can manage all media
CREATE POLICY "Managers can manage media" ON media_gallery
    FOR ALL USING (auth.role() = 'authenticated');

-- Create or replace the function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update updated_at
CREATE TRIGGER update_media_gallery_updated_at 
    BEFORE UPDATE ON media_gallery
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Note: Categories are hardcoded in the application for now
-- Future enhancement: Store categories in app_settings table

-- Storage bucket setup instructions:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create a new bucket called 'gallery'
-- 3. Make it PUBLIC (toggle the public switch)
-- 4. Set the following policies:
--    - Allow public to view: SELECT on storage.objects WHERE bucket_id = 'gallery'
--    - Allow authenticated to upload: INSERT on storage.objects WHERE bucket_id = 'gallery'
--    - Allow authenticated to delete: DELETE on storage.objects WHERE bucket_id = 'gallery'