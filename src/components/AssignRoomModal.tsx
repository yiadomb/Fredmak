'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface AssignRoomModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  resident: any
}

export default function AssignRoomModal({ isOpen, onClose, onSuccess, resident }: AssignRoomModalProps) {
  const [rooms, setRooms] = useState<any[]>([])
  const [selectedRoom, setSelectedRoom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBlock, setSelectedBlock] = useState('all')

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (isOpen) {
      fetchRoomsWithOccupancy()
    }
  }, [isOpen])

  const fetchRoomsWithOccupancy = async () => {
    try {
      // Fetch all rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('block')
        .order('room_no')

      if (roomsError) throw roomsError

      // Fetch active occupancies
      const { data: occupancies, error: occupanciesError } = await supabase
        .from('occupancies')
        .select('room_id, resident_id')
        .eq('is_active', true)

      if (occupanciesError) throw occupanciesError

      // Count occupancies per room
      const occupancyCount = occupancies?.reduce((acc: any, occ) => {
        acc[occ.room_id] = (acc[occ.room_id] || 0) + 1
        return acc
      }, {}) || {}

      // Add occupancy info to rooms
      const roomsWithOccupancy = roomsData?.map(room => ({
        ...room,
        occupied: occupancyCount[room.id] || 0,
        available: room.capacity - (occupancyCount[room.id] || 0)
      })) || []

      setRooms(roomsWithOccupancy)
    } catch (err: any) {
      console.error('Error fetching rooms:', err)
      setError('Failed to load rooms')
    }
  }

  const handleAssign = async () => {
    if (!selectedRoom) {
      setError('Please select a room')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Get the selected room details
      const room = rooms.find(r => r.id === selectedRoom)
      if (!room) throw new Error('Room not found')

      // Calculate the fee based on room type and block
      let fee = 5500 // Default Old Block
      if (room.block === 'Executive') {
        fee = room.type === '1-bed' ? 13000 : 8000
      } else if (room.block === 'New') {
        fee = 7000
      }

      // Create occupancy record
      const { error: occupancyError } = await supabase
        .from('occupancies')
        .insert({
          resident_id: resident.id,
          room_id: selectedRoom,
          academic_year: '2024/25',
          fee_due: fee,
          move_in_date: new Date().toISOString().split('T')[0],
          is_active: true
        })

      if (occupancyError) throw occupancyError

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to assign room')
    } finally {
      setLoading(false)
    }
  }

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.room_no.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBlock = selectedBlock === 'all' || room.block === selectedBlock
    const hasSpace = room.available > 0
    return matchesSearch && matchesBlock && hasSpace
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Assign Room to {resident?.full_name}</h2>
            <p className="text-sm text-gray-600 mt-1">Select an available room for the resident</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Blocks</option>
            <option value="Executive">Executive Block</option>
            <option value="Old">Old Block</option>
            <option value="New">New Block</option>
          </select>
        </div>

        {/* Room Grid */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">
            {filteredRooms.length} rooms available
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedRoom === room.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900">{room.room_no}</h3>
                <p className="text-sm text-gray-600">{room.block} Block</p>
                <div className="mt-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: room.capacity }).map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index < room.occupied ? 'bg-gray-400' : 'bg-green-500'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {room.available} bed{room.available !== 1 ? 's' : ''} available
                  </p>
                </div>
                <p className="text-sm font-medium text-blue-600 mt-2">
                  ₵{room.block === 'Executive' ? (room.type === '1-bed' ? '13,000' : '8,000') :
                     room.block === 'New' ? '7,000' : '5,500'}/year
                </p>
              </div>
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No available rooms found. Try adjusting your filters.
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || !selectedRoom}
          >
            {loading ? 'Assigning...' : 'Assign Room'}
          </button>
        </div>
      </div>
    </div>
  )
}