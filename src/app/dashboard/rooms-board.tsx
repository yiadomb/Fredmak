import { createServerSupabaseClient } from '@/lib/supabase/server'
import RoomCard from '@/components/RoomCard'

export default async function RoomsBoard() {
  const supabase = createServerSupabaseClient()
  
  // First, fetch all rooms
  const { data: rooms, error: roomsError } = await supabase
    .from('rooms')
    .select('*')
    .order('block', { ascending: true })
    .order('room_no', { ascending: true })

  if (roomsError) {
    console.error('Error fetching rooms:', roomsError)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-medium">Error loading rooms data</p>
        <p className="text-sm mt-1">Details: {roomsError.message}</p>
        <p className="text-sm mt-2">
          Please visit <a href="/setup" className="underline font-medium">Setup Page</a> to initialize the database.
        </p>
      </div>
    )
  }

  // If no rooms found
  if (!rooms || rooms.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        <p className="font-medium">No rooms found in database</p>
        <p className="text-sm mt-1">
          Please visit <a href="/setup" className="underline font-medium">Setup Page</a> to initialize room data.
        </p>
      </div>
    )
  }

  // Then fetch active occupancies separately
  const { data: occupancies, error: occupanciesError } = await supabase
    .from('occupancies')
    .select('room_id')
    .eq('is_active', true)

  if (occupanciesError) {
    console.error('Error fetching occupancies:', occupanciesError)
  }

  // Count occupancies per room
  const occupancyCount = occupancies?.reduce((acc: any, occ) => {
    acc[occ.room_id] = (acc[occ.room_id] || 0) + 1
    return acc
  }, {}) || {}

  // Add occupancy count to rooms and map to expected format
  const roomsWithOccupancy = rooms?.map(room => ({
    ...room,
    room_number: room.room_no, // Map room_no to room_number
    building: room.block,      // Map block to building
    price: room.type === '1-bed' && room.block === 'Executive' ? 13000 : 
           room.type === '2-bed' && room.block === 'Executive' ? 8000 :
           room.type === '2-bed' && room.block === 'New' ? 7000 : 5500,
    occupied: occupancyCount[room.id] || 0
  })) || []

  // Group rooms by building
  const roomsByBuilding = roomsWithOccupancy.reduce((acc: any, room) => {
    if (!acc[room.building]) {
      acc[room.building] = []
    }
    acc[room.building].push(room)
    return acc
  }, {})

  // Define the order of blocks
  const blockOrder = ['Executive', 'Old', 'New']
  const orderedBlocks = blockOrder.filter(block => roomsByBuilding[block])

  // Calculate statistics
  const totalRooms = roomsWithOccupancy.length
  const totalOccupied = roomsWithOccupancy.filter(r => r.occupied > 0).length
  const totalBeds = roomsWithOccupancy.reduce((sum, r) => sum + r.capacity, 0)
  const totalResidents = roomsWithOccupancy.reduce((sum, r) => sum + r.occupied, 0)
  const occupancyRate = totalBeds > 0 ? Math.round((totalResidents / totalBeds) * 100) : 0

  return (
    <>
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Rooms</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalRooms}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Occupied Rooms</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">{totalOccupied}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Residents</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">{totalResidents}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Occupancy Rate</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{occupancyRate}%</p>
        </div>
      </div>

      {/* Rooms by Building */}
      {orderedBlocks.map((building: string) => {
        const buildingRooms = roomsByBuilding[building] || []
        const buildingOccupied = buildingRooms.filter((r: any) => r.occupied > 0).length
        const displayName = building === 'Old' ? 'Old Block' : 
                           building === 'New' ? 'New Block' : 
                           'Executive Block'
        
        return (
          <div key={building} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {displayName}
              </h3>
              <span className="text-sm text-gray-500">
                {buildingOccupied} occupied
              </span>
            </div>
            
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
              building === 'Executive' ? 'xl:grid-cols-4' : 'xl:grid-cols-5'
            } gap-4`}>
              {buildingRooms
                .sort((a: any, b: any) => {
                  // Special sorting for Executive block
                  if (building === 'Executive') {
                    const aNum = parseInt(a.room_number.substring(1))
                    const bNum = parseInt(b.room_number.substring(1))
                    
                    // Group E1-E4 first, then E5-E8
                    const aGroup = aNum <= 4 ? 0 : 1
                    const bGroup = bNum <= 4 ? 0 : 1
                    
                    if (aGroup !== bGroup) return aGroup - bGroup
                    return aNum - bNum
                  }
                  // Default sorting for other blocks
                  return a.room_number.localeCompare(b.room_number)
                })
                .map((room: any) => (
                  <RoomCard
                    key={room.id}
                    roomNumber={room.room_number}
                    building={displayName}
                    capacity={room.capacity}
                    occupied={room.occupied}
                    price={room.price}
                  />
                ))}
            </div>
          </div>
        )
      })}
    </>
  )
}