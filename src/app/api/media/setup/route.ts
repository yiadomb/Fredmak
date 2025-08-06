import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create media_gallery table
    const { error: tableError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS media_gallery (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100) NOT NULL DEFAULT 'Other',
          file_url TEXT NOT NULL,
          file_type VARCHAR(10) NOT NULL CHECK (file_type IN ('image', 'video')),
          file_size INTEGER,
          mime_type VARCHAR(100),
          uploaded_by VARCHAR(255),
          is_active BOOLEAN DEFAULT TRUE,
          display_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_media_gallery_category ON media_gallery(category);
        CREATE INDEX IF NOT EXISTS idx_media_gallery_active ON media_gallery(is_active);
        CREATE INDEX IF NOT EXISTS idx_media_gallery_created ON media_gallery(created_at DESC);
      `
    }).single()

    if (tableError) {
      console.error('Table creation error:', tableError)
      // Table might already exist, continue
    }

    // Check if storage bucket exists
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()
    
    if (bucketsError) {
      throw new Error(`Failed to list buckets: ${bucketsError.message}`)
    }

    const galleryBucketExists = buckets?.some(bucket => bucket.name === 'gallery')

    if (!galleryBucketExists) {
      // Create the gallery bucket
      const { data: bucket, error: createError } = await supabaseAdmin.storage.createBucket('gallery', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
      })

      if (createError) {
        console.error('Bucket creation error:', createError)
        throw new Error(`Failed to create storage bucket: ${createError.message}`)
      }

      console.log('Gallery bucket created successfully:', bucket)
    } else {
      console.log('Gallery bucket already exists')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Media gallery setup completed',
      bucketExists: galleryBucketExists
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Setup failed' },
      { status: 500 }
    )
  }
}