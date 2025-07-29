'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface RoomCardProps {
  roomId?: string
  roomNumber: string
  building: string
  capacity: number
  occupied: number
  price: number
  onClick?: () => void
  onCapacityUpdate?: () => void
}

export default function RoomCard({ 
  roomId,
  roomNumber, 
  building, 
  capacity, 
  occupied, 
  price,
  onClick,
  onCapacityUpdate
}: RoomCardProps) {
  const [isEditingCapacity, setIsEditingCapacity] = useState(false)
  const [newCapacity, setNewCapacity] = useState(capacity.toString())
  const [updating, setUpdating] = useState(false)
  const supabase = createClientComponentClient()
  const isFullyOccupied = occupied === capacity

  const handleCapacityUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const capacityNum = parseInt(newCapacity)
    if (isNaN(capacityNum) || capacityNum < 1 || capacityNum < occupied) {
      alert(`Capacity must be at least ${Math.max(1, occupied)}`)
      setNewCapacity(capacity.toString())
      setIsEditingCapacity(false)
      return
    }

    if (capacityNum === capacity) {
      setIsEditingCapacity(false)
      return
    }

    setUpdating(true)
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ capacity: capacityNum })
        .eq('id', roomId)

      if (error) throw error

      setIsEditingCapacity(false)
      if (onCapacityUpdate) {
        onCapacityUpdate()
      }
    } catch (error) {
      console.error('Error updating capacity:', error)
      alert('Failed to update capacity')
      setNewCapacity(capacity.toString())
    } finally {
      setUpdating(false)
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isEditingCapacity && onClick) {
      onClick()
    }
  }

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-lg">{roomNumber}</h3>
        {roomId && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsEditingCapacity(true)
              setNewCapacity(capacity.toString())
            }}
            className="text-xs text-gray-500 hover:text-blue-600"
            title="Edit capacity"
          >
            ✏️
          </button>
        )}
      </div>
      
      {/* Occupancy Indicators - Visual dots */}
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: capacity }).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index < occupied ? 'bg-green-500' : 'bg-red-500'
            }`}
            title={index < occupied ? 'Occupied' : 'Available'}
          />
        ))}
      </div>
      
      {/* Occupancy Text or Edit Form */}
      {isEditingCapacity ? (
        <form onSubmit={handleCapacityUpdate} className="text-sm" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <span>{occupied}/</span>
            <input
              type="number"
              value={newCapacity}
              onChange={(e) => setNewCapacity(e.target.value)}
              min={Math.max(1, occupied)}
              max={10}
              className="w-12 px-1 border border-gray-300 rounded text-center"
              autoFocus
              disabled={updating}
            />
            <button
              type="submit"
              className="text-green-600 hover:text-green-700"
              disabled={updating}
            >
              ✓
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditingCapacity(false)
                setNewCapacity(capacity.toString())
              }}
              className="text-red-600 hover:text-red-700"
              disabled={updating}
            >
              ✗
            </button>
          </div>
        </form>
      ) : (
        occupied > 0 && (
          <div className="text-sm text-gray-600">
            {isFullyOccupied ? (
              <span className="text-green-600 font-medium">Fully Occupied</span>
            ) : (
              <span>{occupied}/{capacity} Occupied</span>
            )}
          </div>
        )
      )}
    </div>
  )
}