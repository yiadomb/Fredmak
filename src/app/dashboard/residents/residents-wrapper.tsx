'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import AddResidentModal from '@/components/AddResidentModal'
import BulkAddResidentsModal from '@/components/BulkAddResidentsModal'
import AssignRoomModal from '@/components/AssignRoomModal'
import BulkAssignModal from '@/components/BulkAssignModal'
import ResidentsList from './residents-list'

export default function ResidentsWrapper() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false)
  const [selectedResident, setSelectedResident] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const handleAssignRoom = (event: CustomEvent) => {
      setSelectedResident(event.detail)
      setShowAssignModal(true)
    }

    window.addEventListener('assign-room' as any, handleAssignRoom)
    return () => window.removeEventListener('assign-room' as any, handleAssignRoom)
  }, [])

  const handleAddSuccess = () => {
    // Increment refresh key to trigger data refetch
    setRefreshKey(prev => prev + 1)
    // Also refresh the router for good measure
    router.refresh()
  }

  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Residents & Occupancies</h2>
          <p className="text-gray-600">
            Manage residents and their room assignments
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowBulkAssignModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            🏠 Bulk Assign Rooms
          </button>
          <button 
            onClick={() => setShowBulkModal(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ⬆ Bulk Import
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add New Resident
          </button>
        </div>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading residents data...</div>
        </div>
      }>
        <ResidentsList refreshKey={refreshKey} />
      </Suspense>

      <AddResidentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
      
      <BulkAddResidentsModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onSuccess={handleAddSuccess}
      />
      
      <AssignRoomModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onSuccess={handleAddSuccess}
        resident={selectedResident}
      />
      
      <BulkAssignModal
        isOpen={showBulkAssignModal}
        onClose={() => setShowBulkAssignModal(false)}
        onSuccess={handleAddSuccess}
      />
    </>
  )
}