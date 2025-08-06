'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Application {
  id: string
  full_name: string
  email: string
  phone: string
  student_id: string
  gender: string
  program: string
  level: string
  preferred_block: string
  room_type_preference?: string
  emergency_contact_name: string
  emergency_contact_phone: string
  status: 'Pending' | 'Accepted' | 'Declined' | 'Wait-list'
  submitted_at: string
  academic_year: string
  special_requirements?: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [filter, setFilter] = useState<'all' | 'Pending' | 'Accepted' | 'Declined' | 'Wait-list'>('all')
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (id: string, newStatus: Application['status']) => {
    try {
      console.log('Updating application:', { id, newStatus })
      
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'Manager' // In production, get from auth
        })
        .eq('id', id)
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Update result:', data)

      // Update local state
      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
      )
      
      // Close modal
      setSelectedApplication(null)
      
      // Refresh the applications list
      fetchApplications()
      
      alert(`Application ${newStatus.toLowerCase()} successfully!`)
    } catch (error: any) {
      console.error('Error updating application:', error)
      const errorMessage = error?.message || error?.error || 'Unknown error'
      alert(`Failed to update application status: ${errorMessage}`)
    }
  }

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter)

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-800'
      case 'Declined': return 'bg-red-100 text-red-800'
      case 'Wait-list': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Fredmak Hostel Dashboard
              </h1>
              <span className="ml-3 text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded">
                2024/25
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Manager</span>
              <a
                href="/"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View Public Site
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
          <div className="p-4">
            <div className="space-y-2">
              <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                🏠 Rooms Board
              </Link>
              <Link href="/dashboard/residents" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                👥 Residents & Occupancies
              </Link>
              <Link href="/dashboard/fees" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                💰 Fees & Payments
              </Link>
              <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-blue-50 rounded-md border-l-4 border-blue-500">
                📝 Applications Review
              </div>
              <Link href="/dashboard/maintenance" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                🔧 Maintenance
              </Link>
              <Link href="/dashboard/media" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                🖼️ Media Gallery
              </Link>
              <Link href="/dashboard/settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                ⚙️ Settings
              </Link>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Applications Review</h2>
            <p className="text-gray-600 mt-1">Review and process student accommodation applications</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(a => a.status === 'Pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(a => a.status === 'Accepted').length}
              </div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-red-600">
                {applications.filter(a => a.status === 'Declined').length}
              </div>
              <div className="text-sm text-gray-600">Declined</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow mb-4">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {(['all', 'Pending', 'Accepted', 'Declined', 'Wait-list'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      filter === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab === 'all' ? 'All Applications' : tab}
                    {tab !== 'all' && (
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100">
                        {applications.filter(a => a.status === tab).length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No applications found
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Block Preference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
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
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.full_name}
                          </div>
                          <div className="text-sm text-gray-500">{application.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.program}</div>
                        <div className="text-sm text-gray-500">Level {application.level}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.preferred_block} Block</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Full Name:</span>
                    <p className="font-medium">{selectedApplication.full_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Student ID:</span>
                    <p className="font-medium">{selectedApplication.student_id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <p className="font-medium">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Gender:</span>
                    <p className="font-medium">{selectedApplication.gender}</p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Academic Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Program:</span>
                    <p className="font-medium">{selectedApplication.program}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Level:</span>
                    <p className="font-medium">{selectedApplication.level}</p>
                  </div>
                </div>
              </div>

              {/* Accommodation Preferences */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Accommodation Preferences</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Preferred Block:</span>
                    <p className="font-medium">{selectedApplication.preferred_block}</p>
                  </div>
                  {selectedApplication.room_type_preference && (
                    <div>
                      <span className="text-gray-500">Room Type:</span>
                      <p className="font-medium">{selectedApplication.room_type_preference}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requirements */}
              {selectedApplication.special_requirements && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Special Requirements</h4>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{selectedApplication.special_requirements}</p>
                  </div>
                </div>
              )}

              {/* Emergency Contact */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Emergency Contact</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="font-medium">{selectedApplication.emergency_contact_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <p className="font-medium">{selectedApplication.emergency_contact_phone}</p>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">Current Status:</span>
                    <p className={`inline-flex ml-2 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedApplication.status)}`}>
                      {selectedApplication.status}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Submitted: {new Date(selectedApplication.submitted_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedApplication.status === 'Pending' && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'Declined')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'Wait-list')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Add to Wait-list
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'Accepted')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}