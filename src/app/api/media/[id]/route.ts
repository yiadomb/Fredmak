import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // First get the media item to find the file URL
    const { data: mediaItem, error: fetchError } = await supabase
      .from('media_gallery')
      .select('file_url')
      .eq('id', params.id)
      .single()

    if (fetchError || !mediaItem) {
      return NextResponse.json(
        { success: false, error: 'Media item not found' },
        { status: 404 }
      )
    }

    // Extract file path from URL
    const url = new URL(mediaItem.file_url)
    const pathParts = url.pathname.split('/')
    const bucketIndex = pathParts.indexOf('gallery')
    const filePath = pathParts.slice(bucketIndex + 1).join('/')

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('gallery')
      .remove([filePath])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
      // Continue to delete from database even if storage deletion fails
    }

    // Delete from database (soft delete by setting is_active to false)
    const { error: dbError } = await supabase
      .from('media_gallery')
      .update({ is_active: false })
      .eq('id', params.id)

    if (dbError) {
      throw dbError
    }

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Delete failed' },
      { status: 500 }
    )
  }
}