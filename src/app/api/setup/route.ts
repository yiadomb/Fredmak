import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

// Room data - exactly as specified in PRD
const ROOMS_DATA = [
  // Old Building - Ground Floor (G1-G5)
  { room_no: 'G1', block: 'Old', capacity: 3, type: '3-bed', floor: 'Ground' },
  { room_no: 'G2', block: 'Old', capacity: 3, type: '3-bed', floor: 'Ground' },
  { room_no: 'G3', block: 'Old', capacity: 3, type: '3-bed', floor: 'Ground' },
  { room_no: 'G4', block: 'Old', capacity: 3, type: '3-bed', floor: 'Ground' },
  { room_no: 'G5', block: 'Old', capacity: 3, type: '3-bed', floor: 'Ground' },
  
  // Old Building - First Floor (F1-F5)
  { room_no: 'F1', block: 'Old', capacity: 3, type: '3-bed', floor: 'First' },
  { room_no: 'F2', block: 'Old', capacity: 3, type: '3-bed', floor: 'First' },
  { room_no: 'F3', block: 'Old', capacity: 3, type: '3-bed', floor: 'First' },
  { room_no: 'F4', block: 'Old', capacity: 3, type: '3-bed', floor: 'First' },
  { room_no: 'F5', block: 'Old', capacity: 3, type: '3-bed', floor: 'First' },
  
  // Old Building - Second Floor (S1-S5)
  { room_no: 'S1', block: 'Old', capacity: 3, type: '3-bed', floor: 'Second' },
  { room_no: 'S2', block: 'Old', capacity: 3, type: '3-bed', floor: 'Second' },
  { room_no: 'S3', block: 'Old', capacity: 3, type: '3-bed', floor: 'Second' },
  { room_no: 'S4', block: 'Old', capacity: 3, type: '3-bed', floor: 'Second' },
  { room_no: 'S5', block: 'Old', capacity: 3, type: '3-bed', floor: 'Second' },
  
  // Old Building - Third Floor (T1-T5)
  { room_no: 'T1', block: 'Old', capacity: 3, type: '3-bed', floor: 'Third' },
  { room_no: 'T2', block: 'Old', capacity: 3, type: '3-bed', floor: 'Third' },
  { room_no: 'T3', block: 'Old', capacity: 3, type: '3-bed', floor: 'Third' },
  { room_no: 'T4', block: 'Old', capacity: 3, type: '3-bed', floor: 'Third' },
  { room_no: 'T5', block: 'Old', capacity: 3, type: '3-bed', floor: 'Third' },
  
  // New Building - First Floor (2F1-2F5)
  { room_no: '2F1', block: 'New', capacity: 2, type: '2-bed', floor: 'First' },
  { room_no: '2F2', block: 'New', capacity: 2, type: '2-bed', floor: 'First' },
  { room_no: '2F3', block: 'New', capacity: 2, type: '2-bed', floor: 'First' },
  { room_no: '2F4', block: 'New', capacity: 2, type: '2-bed', floor: 'First' },
  { room_no: '2F5', block: 'New', capacity: 2, type: '2-bed', floor: 'First' },
  
  // New Building - Second Floor (2S1-2S5)
  { room_no: '2S1', block: 'New', capacity: 2, type: '2-bed', floor: 'Second' },
  { room_no: '2S2', block: 'New', capacity: 2, type: '2-bed', floor: 'Second' },
  { room_no: '2S3', block: 'New', capacity: 2, type: '2-bed', floor: 'Second' },
  { room_no: '2S4', block: 'New', capacity: 2, type: '2-bed', floor: 'Second' },
  { room_no: '2S5', block: 'New', capacity: 2, type: '2-bed', floor: 'Second' },
  
  // New Building - Third Floor (2T1-2T5)
  { room_no: '2T1', block: 'New', capacity: 2, type: '2-bed', floor: 'Third' },
  { room_no: '2T2', block: 'New', capacity: 2, type: '2-bed', floor: 'Third' },
  { room_no: '2T3', block: 'New', capacity: 2, type: '2-bed', floor: 'Third' },
  { room_no: '2T4', block: 'New', capacity: 2, type: '2-bed', floor: 'Third' },
  { room_no: '2T5', block: 'New', capacity: 2, type: '2-bed', floor: 'Third' },
  
  // New Building - Last Floor (2L1-2L5)
  { room_no: '2L1', block: 'New', capacity: 2, type: '2-bed', floor: 'Last' },
  { room_no: '2L2', block: 'New', capacity: 2, type: '2-bed', floor: 'Last' },
  { room_no: '2L3', block: 'New', capacity: 2, type: '2-bed', floor: 'Last' },
  { room_no: '2L4', block: 'New', capacity: 2, type: '2-bed', floor: 'Last' },
  { room_no: '2L5', block: 'New', capacity: 2, type: '2-bed', floor: 'Last' },
  
  // Executive Building (E1-E8)
  { room_no: 'E1', block: 'Executive', capacity: 2, type: 'Executive 2-bed', floor: 'Ground' },
  { room_no: 'E2', block: 'Executive', capacity: 2, type: 'Executive 2-bed', floor: 'Ground' },
  { room_no: 'E3', block: 'Executive', capacity: 1, type: 'Executive 1-bed', floor: 'Ground' },
  { room_no: 'E4', block: 'Executive', capacity: 1, type: 'Executive 1-bed', floor: 'Ground' },
  { room_no: 'E5', block: 'Executive', capacity: 2, type: 'Executive 2-bed', floor: 'First' },
  { room_no: 'E6', block: 'Executive', capacity: 2, type: 'Executive 2-bed', floor: 'First' },
  { room_no: 'E7', block: 'Executive', capacity: 1, type: 'Executive 1-bed', floor: 'First' },
  { room_no: 'E8', block: 'Executive', capacity: 1, type: 'Executive 1-bed', floor: 'First' },
]

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting database setup...')

    // Check if rooms already exist
    const { data: existingRooms, error: checkError } = await supabaseAdmin
      .from('rooms')
      .select('room_no')
      .limit(1)

    if (existingRooms && existingRooms.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already initialized',
        roomsCount: ROOMS_DATA.length
      })
    }

    // Insert room data
    const { error: roomsError } = await supabaseAdmin
      .from('rooms')
      .insert(ROOMS_DATA)

    if (roomsError) {
      console.error('Error creating rooms:', roomsError)
      return NextResponse.json({
        success: false,
        error: `Failed to create rooms: ${roomsError.message}`
      }, { status: 500 })
    }

    console.log(`✅ Successfully created ${ROOMS_DATA.length} rooms`)

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      roomsCount: ROOMS_DATA.length,
      details: {
        oldBlock: 20,
        newBlock: 20,
        executive: 8
      }
    })

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}