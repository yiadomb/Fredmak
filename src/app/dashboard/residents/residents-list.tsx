'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface ResidentsListProps {
  refreshKey?: number
}

export default function ResidentsList({ refreshKey }: ResidentsListProps) {
  const [residents, setResidents] = useState<any[]>([])
  const [occupancies, setOccupancies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
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

  // Group residents by their room status
  const activeResidents = residentsWithRooms.filter(r => r.currentOccupancy?.is_active)
  const inactiveResidents = residentsWithRooms.filter(r => !r.currentOccupancy?.is_active)

  return (
    <>
      {/* Search and Filter Bar */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search residents by name, email, or phone..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Blocks</option>
          <option value="Executive">Executive Block</option>
          <option value="Old">Old Block</option>
          <option value="New">New Block</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Residents</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{residentsWithRooms.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Active Residents</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">{activeResidents.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Inactive</h3>
          <p className="text-2xl font-bold text-gray-500 mt-1">{inactiveResidents.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Check-outs This Month</h3>
          <p className="text-2xl font-bold text-orange-600 mt-1">0</p>
        </div>
      </div>

      {/* Residents Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {residentsWithRooms.map((resident) => {
              const isActive = resident.currentOccupancy?.is_active
              
              return (
                <tr key={resident.id} className="hover:bg-gray-50">
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
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{resident.room.room_no}</div>
                        <div className="text-gray-500">{resident.room.block} Block</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No room assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resident.currentOccupancy ? new Date(resident.currentOccupancy.check_in_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!resident.room ? (
                      <button 
                        className="text-green-600 hover:text-green-900 mr-3"
                        onClick={() => window.dispatchEvent(new CustomEvent('assign-room', { detail: resident }))}
                      >
                        Assign Room
                      </button>
                    ) : (
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    )}
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}