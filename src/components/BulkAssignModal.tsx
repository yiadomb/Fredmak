'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface BulkAssignModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function BulkAssignModal({ isOpen, onClose, onSuccess }: BulkAssignModalProps) {
  const [unassignedResidents, setUnassignedResidents] = useState<any[]>([])
  const [availableRooms, setAvailableRooms] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedBlock, setSelectedBlock] = useState('all')

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setAssignments({})
      setError('')
      setSelectedBlock('all')
      fetchData()
    }
  }, [isOpen])

  const fetchData = async () => {
    try {
      // Fetch residents without rooms
      const { data: residents, error: residentsError } = await supabase
        .from('residents')
        .select('*')
        .order('full_name')

      if (residentsError) throw residentsError

      // Fetch active occupancies to find residents without rooms
      const { data: occupancies, error: occupanciesError } = await supabase
        .from('occupancies')
        .select('resident_id')
        .eq('is_active', true)

      if (occupanciesError) throw occupanciesError

      const occupiedResidentIds = new Set(occupancies?.map(o => o.resident_id))
      const unassigned = residents?.filter(r => !occupiedResidentIds.has(r.id)) || []
      setUnassignedResidents(unassigned)

      // Fetch rooms with availability
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('block')
        .order('room_no')

      if (roomsError) throw roomsError

      // Count occupancies per room
      const { data: roomOccupancies, error: roomOccError } = await supabase
        .from('occupancies')
        .select('room_id')
        .eq('is_active', true)

      if (roomOccError) throw roomOccError

      const occupancyCount = roomOccupancies?.reduce((acc: any, occ) => {
        acc[occ.room_id] = (acc[occ.room_id] || 0) + 1
        return acc
      }, {}) || {}

      const roomsWithAvailability = rooms?.map(room => ({
        ...room,
        occupied: occupancyCount[room.id] || 0,
        available: room.capacity - (occupancyCount[room.id] || 0)
      })).filter(room => room.available > 0) || []

      setAvailableRooms(roomsWithAvailability)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError('Failed to load data')
    }
  }

  const handleAssignRoom = (residentId: string, roomId: string) => {
    setAssignments(prev => ({
      ...prev,
      [residentId]: roomId
    }))
  }

  const handleBulkAssign = async () => {
    const assignmentList = Object.entries(assignments).filter(([_, roomId]) => roomId)
    
    if (assignmentList.length === 0) {
      setError('Please assign at least one resident to a room')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Check which residents already have active assignments
      const residentIds = assignmentList.map(([residentId, _]) => residentId)
      const { data: existingOccupancies } = await supabase
        .from('occupancies')
        .select('resident_id')
        .in('resident_id', residentIds)
        .eq('academic_year', '2024/25')
        .eq('is_active', true)

      const alreadyAssigned = new Set(existingOccupancies?.map(o => o.resident_id) || [])
      
      // Filter out residents who already have assignments
      const newAssignments = assignmentList.filter(([residentId, _]) => !alreadyAssigned.has(residentId))
      
      if (newAssignments.length === 0) {
        setError('All selected residents already have room assignments for this academic year')
        return
      }

      if (alreadyAssigned.size > 0) {
        // Don't set this as an error - it's just informational
        console.log(`${alreadyAssigned.size} residents already have rooms and were skipped.`)
      }

      // Create occupancy records only for new assignments
      const occupancyRecords = newAssignments.map(([residentId, roomId]) => {
        const room = availableRooms.find(r => r.id === roomId)
        let fee = 5500 // Default Old Block
        if (room?.block === 'Executive') {
          fee = room.type === '1-bed' ? 13000 : 8000
        } else if (room?.block === 'New') {
          fee = 7000
        }

        return {
          resident_id: residentId,
          room_id: roomId,
          academic_year: '2024/25',
          fee_due: fee,
          move_in_date: new Date().toISOString().split('T')[0],
          is_active: true
        }
      })

      const { error: insertError } = await supabase
        .from('occupancies')
        .insert(occupancyRecords)

      if (insertError) throw insertError

      // Show success message with counts
      if (alreadyAssigned.size > 0) {
        alert(`Successfully assigned ${newAssignments.length} residents to rooms. ${alreadyAssigned.size} residents were skipped because they already have room assignments.`)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to assign rooms')
    } finally {
      setLoading(false)
    }
  }

  const filteredRooms = availableRooms.filter(room => 
    selectedBlock === 'all' || room.block === selectedBlock
  )

  // Only count residents who have actually been assigned a room (not empty selections)
  const assignedCount = Object.entries(assignments).filter(([_, roomId]) => roomId && roomId !== '').length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bulk Room Assignment</h2>
            <p className="text-sm text-gray-600 mt-1">
              Assign multiple residents to rooms at once ({unassignedResidents.length} residents without rooms)
            </p>
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

        <div className="mb-4">
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
          <span className="ml-4 text-sm text-gray-600">
            {filteredRooms.reduce((sum, room) => sum + room.available, 0)} beds available
          </span>
        </div>

        <div className="mb-6 max-h-96 overflow-y-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Resident</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Assign to Room</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {unassignedResidents.map((resident) => (
                <tr key={resident.id}>
                  <td className="px-4 py-2 text-sm text-gray-900">{resident.full_name}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{resident.gender}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{resident.phone}</td>
                  <td className="px-4 py-2">
                    <select
                      value={assignments[resident.id] || ''}
                      onChange={(e) => handleAssignRoom(resident.id, e.target.value)}
                      className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        assignments[resident.id] ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select room...</option>
                      {filteredRooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.room_no} - {room.block} ({room.available} bed{room.available !== 1 ? 's' : ''})
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {assignedCount > 0 ? (
              <span className="font-medium text-blue-600">
                {assignedCount} of {unassignedResidents.length} residents selected for assignment
              </span>
            ) : (
              `${unassignedResidents.length} residents available for assignment`
            )}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleBulkAssign}
              className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
                assignedCount === 0 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={loading || assignedCount === 0}
            >
              {loading ? 'Checking and assigning...' : 
                assignedCount === 0 ? 'Select residents to assign' : `Assign ${assignedCount} Residents`
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}