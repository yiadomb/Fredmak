import { supabaseAdmin } from './supabase/client'

// Room data based on PRD specifications
const ROOMS_DATA = [
  // Old Building - Ground Floor
  { room_no: 'G1', block: 'Old', capacity: 3, type: '3-bed', floor: 'Ground' },
  { room_no: 'G2', block: 'Old', capacity: 3, type: '3-bed', floor: 'Ground' },
  { room_no: 'G3', block: 'Old', capacity: 3, type: '3-bed', floor: 'Ground' },
  { room_no: 'G4', block: 'Old', capacity: 3, type: '3-bed', floor: 'Ground' },
  { room_no: 'G5', block: 'Old', capacity: 3, type: '3-bed', floor: 'Ground' },
  
  // Old Building - First Floor
  { room_no: 'F1', block: 'Old', capacity: 3, type: '3-bed', floor: 'First' },
  { room_no: 'F2', block: 'Old', capacity: 3, type: '3-bed', floor: 'First' },
  { room_no: 'F3', block: 'Old', capacity: 3, type: '3-bed', floor: 'First' },
  { room_no: 'F4', block: 'Old', capacity: 3, type: '3-bed', floor: 'First' },
  { room_no: 'F5', block: 'Old', capacity: 3, type: '3-bed', floor: 'First' },
  
  // Old Building - Second Floor
  { room_no: 'S1', block: 'Old', capacity: 3, type: '3-bed', floor: 'Second' },
  { room_no: 'S2', block: 'Old', capacity: 3, type: '3-bed', floor: 'Second' },
  { room_no: 'S3', block: 'Old', capacity: 3, type: '3-bed', floor: 'Second' },
  { room_no: 'S4', block: 'Old', capacity: 3, type: '3-bed', floor: 'Second' },
  { room_no: 'S5', block: 'Old', capacity: 3, type: '3-bed', floor: 'Second' },
  
  // Old Building - Third Floor
  { room_no: 'T1', block: 'Old', capacity: 3, type: '3-bed', floor: 'Third' },
  { room_no: 'T2', block: 'Old', capacity: 3, type: '3-bed', floor: 'Third' },
  { room_no: 'T3', block: 'Old', capacity: 3, type: '3-bed', floor: 'Third' },
  { room_no: 'T4', block: 'Old', capacity: 3, type: '3-bed', floor: 'Third' },
  { room_no: 'T5', block: 'Old', capacity: 3, type: '3-bed', floor: 'Third' },
  
  // New Building - First Floor
  { room_no: '2F1', block: 'New', capacity: 2, type: '2-bed', floor: 'First' },
  { room_no: '2F2', block: 'New', capacity: 2, type: '2-bed', floor: 'First' },
  { room_no: '2F3', block: 'New', capacity: 2, type: '2-bed', floor: 'First' },
  { room_no: '2F4', block: 'New', capacity: 2, type: '2-bed', floor: 'First' },
  { room_no: '2F5', block: 'New', capacity: 2, type: '2-bed', floor: 'First' },
  
  // New Building - Second Floor
  { room_no: '2S1', block: 'New', capacity: 2, type: '2-bed', floor: 'Second' },
  { room_no: '2S2', block: 'New', capacity: 2, type: '2-bed', floor: 'Second' },
  { room_no: '2S3', block: 'New', capacity: 2, type: '2-bed', floor: 'Second' },
  { room_no: '2S4', block: 'New', capacity: 2, type: '2-bed', floor: 'Second' },
  { room_no: '2S5', block: 'New', capacity: 2, type: '2-bed', floor: 'Second' },
  
  // New Building - Third Floor
  { room_no: '2T1', block: 'New', capacity: 2, type: '2-bed', floor: 'Third' },
  { room_no: '2T2', block: 'New', capacity: 2, type: '2-bed', floor: 'Third' },
  { room_no: '2T3', block: 'New', capacity: 2, type: '2-bed', floor: 'Third' },
  { room_no: '2T4', block: 'New', capacity: 2, type: '2-bed', floor: 'Third' },
  { room_no: '2T5', block: 'New', capacity: 2, type: '2-bed', floor: 'Third' },
  
  // New Building - Last Floor
  { room_no: '2L1', block: 'New', capacity: 2, type: '2-bed', floor: 'Last' },
  { room_no: '2L2', block: 'New', capacity: 2, type: '2-bed', floor: 'Last' },
  { room_no: '2L3', block: 'New', capacity: 2, type: '2-bed', floor: 'Last' },
  { room_no: '2L4', block: 'New', capacity: 2, type: '2-bed', floor: 'Last' },
  { room_no: '2L5', block: 'New', capacity: 2, type: '2-bed', floor: 'Last' },
  
  // Executive Building
  { room_no: 'E1', block: 'Executive', capacity: 2, type: 'Executive 2-bed', floor: 'Ground' },
  { room_no: 'E2', block: 'Executive', capacity: 2, type: 'Executive 2-bed', floor: 'Ground' },
  { room_no: 'E3', block: 'Executive', capacity: 1, type: 'Executive 1-bed', floor: 'Ground' },
  { room_no: 'E4', block: 'Executive', capacity: 1, type: 'Executive 1-bed', floor: 'Ground' },
  { room_no: 'E5', block: 'Executive', capacity: 2, type: 'Executive 2-bed', floor: 'First' },
  { room_no: 'E6', block: 'Executive', capacity: 2, type: 'Executive 2-bed', floor: 'First' },
  { room_no: 'E7', block: 'Executive', capacity: 1, type: 'Executive 1-bed', floor: 'First' },
  { room_no: 'E8', block: 'Executive', capacity: 1, type: 'Executive 1-bed', floor: 'First' },
]

export async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...')
    
    // Check if rooms already exist to avoid duplicates
    const { data: existingRooms, error: checkError } = await supabaseAdmin
      .from('rooms')
      .select('room_no')
      .limit(1)
    
    if (checkError && !checkError.message.includes('relation "rooms" does not exist')) {
      throw checkError
    }
    
    if (existingRooms && existingRooms.length > 0) {
      console.log('✅ Database already set up with rooms data')
      return
    }
    
    // Insert room data
    const { error: roomsError } = await supabaseAdmin
      .from('rooms')
      .insert(ROOMS_DATA)
    
    if (roomsError) {
      throw roomsError
    }
    
    console.log('✅ Successfully seeded rooms data')
    console.log(`📊 Created ${ROOMS_DATA.length} rooms:`)
    console.log(`   - Old Block: 20 rooms (3-bed each)`)
    console.log(`   - New Block: 20 rooms (2-bed each)`)
    console.log(`   - Executive: 8 rooms (4x 1-bed, 4x 2-bed)`)
    
    return { success: true, message: 'Database setup completed successfully' }
    
  } catch (error) {
    console.error('Error setting up database:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function createAdminUser(email: string, password: string) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'Manager',
        full_name: 'System Administrator'
      }
    })
    
    if (error) throw error
    
    // Create user profile
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: data.user.id,
        email: data.user.email,
        full_name: 'System Administrator',
        role: 'Manager'
      })
    
    if (profileError) throw profileError
    
    return { success: true, user: data.user }
  } catch (error) {
    console.error('Error creating admin user:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}