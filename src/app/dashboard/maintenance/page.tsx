'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

interface MaintenanceIssue {
  id: string
  room_id?: string
  block?: string
  category?: string
  description: string
  status: 'Open' | 'In Progress' | 'Resolved'
  logged_at: string
  updated_at?: string
}

export default function MaintenancePage() {
  const [issues, setIssues] = useState<MaintenanceIssue[]>([])
  const [groupedIssues, setGroupedIssues] = useState<{ [key: string]: MaintenanceIssue[] }>({})
  const [loading, setLoading] = useState(true)
  const [setupRequired, setSetupRequired] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newIssue, setNewIssue] = useState('')
  const [filter, setFilter] = useState<'all' | 'Open' | 'In Progress' | 'Resolved'>('all')

  useEffect(() => {
    fetchIssues()
  }, [])

  useEffect(() => {
    // Group issues by room number extracted from description
    const grouped: { [key: string]: MaintenanceIssue[] } = {}
    
    issues.forEach(issue => {
      // Extract room number from description (e.g., "G2", "2F1", "E103")
      const roomMatch = issue.description.match(/\b([GFSTgfst]\d+|2[FSTLfstl]\d+|E\d+)\b/i)
      const roomNumber = roomMatch ? roomMatch[1].toUpperCase() : 'Other'
      
      if (!grouped[roomNumber]) {
        grouped[roomNumber] = []
      }
      grouped[roomNumber].push(issue)
    })
    
    // Sort room numbers
    const sortedGrouped: { [key: string]: MaintenanceIssue[] } = {}
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      if (a === 'Other') return 1
      if (b === 'Other') return -1
      return a.localeCompare(b)
    })
    
    sortedKeys.forEach(key => {
      sortedGrouped[key] = grouped[key]
    })
    
    setGroupedIssues(sortedGrouped)
  }, [issues])

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_issues')
        .select('*')
        .order('logged_at', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('maintenance_issues')) {
          setSetupRequired(true)
        } else {
          console.error('Error fetching maintenance issues:', error)
        }
      } else {
        setIssues(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetup = async () => {
    try {
      const response = await fetch('/api/maintenance/setup', { method: 'POST' })
      if (response.ok) {
        setSetupRequired(false)
        fetchIssues()
      } else {
        alert('Failed to setup maintenance system')
      }
    } catch (error) {
      console.error('Setup error:', error)
      alert('Error setting up maintenance system')
    }
  }

  const handleAddIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newIssue.trim()) return
    
    try {
      const { data, error } = await supabase
        .from('maintenance_issues')
        .insert([{
          description: newIssue,
          status: 'Open',
          logged_at: new Date().toISOString()
        }])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Issue added:', data)

      // Refresh list and close form
      fetchIssues()
      setNewIssue('')
      setShowAddForm(false)
      alert('Issue logged successfully!')
    } catch (error: any) {
      console.error('Error adding issue:', error)
      const errorMessage = error?.message || error?.error || 'Unknown error'
      alert(`Failed to log issue: ${errorMessage}`)
    }
  }

  const updateIssueStatus = async (id: string, newStatus: MaintenanceIssue['status']) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_issues')
        .update({ 
          status: newStatus
        })
        .eq('id', id)
        .select()

      if (error) {
        console.error('Supabase update error:', error)
        throw error
      }

      console.log('Issue updated:', data)

      // Update local state
      setIssues(prev => 
        prev.map(issue => issue.id === id ? { ...issue, status: newStatus } : issue)
      )
      
      alert(`Issue marked as ${newStatus}`)
    } catch (error: any) {
      console.error('Error updating issue:', error)
      const errorMessage = error?.message || error?.error || 'Unknown error'
      alert(`Failed to update issue status: ${errorMessage}`)
    }
  }

  const deleteIssue = async (id: string) => {
    if (!confirm('Are you sure you want to delete this issue?')) return
    
    try {
      const { error } = await supabase
        .from('maintenance_issues')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update local state
      setIssues(prev => prev.filter(issue => issue.id !== id))
      alert('Issue deleted successfully')
    } catch (error) {
      console.error('Error deleting issue:', error)
      alert('Failed to delete issue')
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Open': return 'bg-red-100 text-red-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredIssues = filter === 'all' 
    ? issues 
    : issues.filter(issue => issue.status === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading maintenance issues...</div>
      </div>
    )
  }

  if (setupRequired) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Setup Required</h2>
            <p className="mb-4">The maintenance system needs to be initialized in your database.</p>
            <button
              onClick={handleSetup}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Initialize Maintenance System
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Fredmak Hostel Dashboard</h1>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                2024/25
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Manager</span>
              <a href="/" className="text-sm text-blue-600 hover:text-blue-800">
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
              <Link href="/dashboard/applications" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                📝 Applications Review
              </Link>
              <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-blue-50 rounded-md border-l-4 border-blue-500">
                🔧 Maintenance
              </div>
              <Link href="/dashboard/media" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                🖼️ Media Gallery
              </Link>
              <Link href="/dashboard/settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                ⚙️ Settings
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Maintenance Issues</h1>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              All ({issues.length})
            </button>
            <button
              onClick={() => setFilter('Open')}
              className={`px-4 py-2 rounded ${filter === 'Open' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Open ({issues.filter(i => i.status === 'Open').length})
            </button>
            <button
              onClick={() => setFilter('In Progress')}
              className={`px-4 py-2 rounded ${filter === 'In Progress' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              In Progress ({issues.filter(i => i.status === 'In Progress').length})
            </button>
            <button
              onClick={() => setFilter('Resolved')}
              className={`px-4 py-2 rounded ${filter === 'Resolved' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Resolved ({issues.filter(i => i.status === 'Resolved').length})
            </button>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Log New Issue
          </button>
        </div>

        {/* Add Issue Form */}
        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <form onSubmit={handleAddIssue} className="flex gap-2">
              <input
                type="text"
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
                placeholder="e.g., G2 Kitchen door sags, 2F1 Bathroom tap leaking..."
                className="flex-1 px-3 py-2 border rounded"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Log Issue
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setNewIssue('')
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </form>
            <p className="text-sm text-gray-600 mt-2">
              Include the room number in your description for automatic grouping
            </p>
          </div>
        )}
      </div>

      {/* Issues grouped by room */}
      <div className="space-y-6">
        {Object.entries(groupedIssues).map(([roomNumber, roomIssues]) => {
          // Only show rooms that have issues matching the filter
          const filteredRoomIssues = filter === 'all' 
            ? roomIssues 
            : roomIssues.filter(issue => issue.status === filter)
          
          if (filteredRoomIssues.length === 0) return null

          return (
            <div key={roomNumber} className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 text-blue-600">
                Room {roomNumber}
              </h3>
              
              <div className="space-y-2">
                {filteredRoomIssues.map(issue => (
                  <div key={issue.id} className="flex items-start justify-between p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="text-sm">{issue.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(issue.logged_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 ml-4">
                      {issue.status === 'Open' && (
                        <button
                          onClick={() => updateIssueStatus(issue.id, 'In Progress')}
                          className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Start
                        </button>
                      )}
                      {issue.status === 'In Progress' && (
                        <button
                          onClick={() => updateIssueStatus(issue.id, 'Resolved')}
                          className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Resolve
                        </button>
                      )}
                      {issue.status === 'Resolved' && (
                        <button
                          onClick={() => updateIssueStatus(issue.id, 'Open')}
                          className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Reopen
                        </button>
                      )}
                      <button
                        onClick={() => deleteIssue(issue.id)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        
        {Object.keys(groupedIssues).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No maintenance issues logged yet. Click "Log New Issue" to add one.
          </div>
        )}
      </div>
        </div>
      </div>
    </div>
  )
}