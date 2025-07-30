'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import ResidentDetailsModal from '@/components/ResidentDetailsModal'

interface ResidentsListProps {
  refreshKey?: number
}

export default function ResidentsList({ refreshKey }: ResidentsListProps) {
  const [residents, setResidents] = useState<any[]>([])
  const [occupancies, setOccupancies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedResident, setSelectedResident] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBlock, setSelectedBlock] = useState('')
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchData()
  }, [refreshKey]) // Re-fetch when refreshKey changes

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch all residents first
      const { data: residentsData, error: residentsError } = await supabase
        .from('residents')
        .select('*')
        .order('full_name', { ascending: true })

      if (residentsError) {
        console.error('Error fetching residents:', residentsError)
        setError(residentsError.message)
        return
      }

      // Fetch active occupancies
      const { data: occupanciesData, error: occupanciesError } = await supabase
        .from('occupancies')
        .select(`
          *,
          rooms (
            room_no,
            block,
            type
          )
        `)
        .eq('is_active', true)

      if (occupanciesError) {
        console.error('Error fetching occupancies:', occupanciesError)
      }

      setResidents(residentsData || [])
      setOccupancies(occupanciesData || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Map occupancies to residents
  const residentsWithRooms = residents?.map(resident => {
    const occupancy = occupancies?.find(occ => occ.resident_id === resident.id)
    return {
      ...resident,
      currentOccupancy: occupancy,
      room: occupancy?.rooms
    }
  }) || []

  // Filter residents based on search and block
  const filteredResidents = residentsWithRooms.filter(resident => {
    // Search filter
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = searchTerm === '' || 
      resident.full_name?.toLowerCase().includes(searchLower) ||
      resident.room?.room_no?.toLowerCase().includes(searchLower) ||
      resident.email?.toLowerCase().includes(searchLower) ||
      resident.phone?.includes(searchTerm)
    
    // Block filter
    const matchesBlock = selectedBlock === '' || resident.room?.block === selectedBlock
    
    return matchesSearch && matchesBlock
  })

  // Sort residents by room number using the same logic as rooms board
  const sortedResidents = [...filteredResidents].sort((a, b) => {
    // If one has no room and the other does, put the one with no room at the end
    if (!a.room && b.room) return 1
    if (a.room && !b.room) return -1
    if (!a.room && !b.room) return a.full_name.localeCompare(b.full_name)
    
    // Both have rooms, sort by block then room number
    const blockOrder = { 'Executive': 0, 'Old': 1, 'New': 2 }
    const aBlockOrder = blockOrder[a.room.block] ?? 99
    const bBlockOrder = blockOrder[b.room.block] ?? 99
    
    if (aBlockOrder !== bBlockOrder) return aBlockOrder - bBlockOrder
    
    // Same block, apply specific sorting rules
    const roomA = a.room.room_no
    const roomB = b.room.room_no
    
    // Executive block sorting (E1-E4 first, then E5-E8)
    if (a.room.block === 'Executive') {
      const aNum = parseInt(roomA.substring(1))
      const bNum = parseInt(roomB.substring(1))
      
      const aGroup = aNum <= 4 ? 0 : 1
      const bGroup = bNum <= 4 ? 0 : 1
      
      if (aGroup !== bGroup) return aGroup - bGroup
      return aNum - bNum
    }
    
    // New block sorting (F, S, T, L floors)
    if (a.room.block === 'New') {
      const aFloor = roomA[1]
      const bFloor = roomB[1]
      const aNum = parseInt(roomA.substring(2))
      const bNum = parseInt(roomB.substring(2))
      
      const floorOrder = { 'F': 0, 'S': 1, 'T': 2, 'L': 3 }
      const aFloorOrder = floorOrder[aFloor] ?? 99
      const bFloorOrder = floorOrder[bFloor] ?? 99
      
      if (aFloorOrder !== bFloorOrder) return aFloorOrder - bFloorOrder
      return aNum - bNum
    }
    
    // Old block sorting (G, F, S, T floors)
    if (a.room.block === 'Old') {
      const aFloor = roomA[0]
      const bFloor = roomB[0]
      const aNum = parseInt(roomA.substring(1))
      const bNum = parseInt(roomB.substring(1))
      
      const floorOrder = { 'G': 0, 'F': 1, 'S': 2, 'T': 3 }
      const aFloorOrder = floorOrder[aFloor] ?? 99
      const bFloorOrder = floorOrder[bFloor] ?? 99
      
      if (aFloorOrder !== bFloorOrder) return aFloorOrder - bFloorOrder
      return aNum - bNum
    }
    
    // Default sorting
    return roomA.localeCompare(roomB)
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading residents data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-medium">Error loading residents data</p>
        <p className="text-sm mt-1">Details: {error}</p>
      </div>
    )
  }

  // If no residents found
  if (!residentsWithRooms || residentsWithRooms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Residents Yet</h3>
        <p className="text-gray-600 mb-4">Start by adding your first resident to the hostel.</p>
        {/* Button will be handled by the wrapper */}
      </div>
    )
  }



  return (
    <>
      {/* Search and Filter Bar */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, room number, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select 
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Blocks</option>
          <option value="Executive">Executive Block</option>
          <option value="Old">Old Block</option>
          <option value="New">New Block</option>
        </select>

      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
        <h3 className="text-sm font-medium text-gray-600">Total Residents</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{sortedResidents.length}</p>
      </div>

      {/* Residents Table */}
      {sortedResidents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No residents found matching your search criteria</p>
        </div>
      ) : (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-xs text-gray-600">💡 Tip: Double-click on any resident to view or edit their details</p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resident
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResidents.map((resident) => (
                <tr 
                  key={resident.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onDoubleClick={() => {
                    setSelectedResident(resident)
                    setIsModalOpen(true)
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {resident.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {resident.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {resident.student_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{resident.email}</div>
                    <div className="text-sm text-gray-500">{resident.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {resident.room ? (
                      <span className="text-sm font-medium text-gray-900">{resident.room.room_no}</span>
                    ) : (
                      <span className="text-sm text-gray-400">No room assigned</span>
                    )}
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* Resident Details Modal */}
      <ResidentDetailsModal
        resident={selectedResident}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedResident(null)
        }}
        onUpdate={() => {
          fetchData()
          setIsModalOpen(false)
        }}
      />
    </>
  )
}