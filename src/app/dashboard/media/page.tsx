'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MediaUploadModal from '@/components/MediaUploadModal'

interface MediaItem {
  id: string
  title: string
  description?: string
  category: string
  file_type: 'image' | 'video'
  file_url: string
  created_at: string
}

export default function MediaManagementPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [setupNeeded, setSetupNeeded] = useState(false)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/media/upload')
      const result = await response.json()
      
      if (result.success) {
        setMedia(result.data || [])
      } else if (result.error?.includes('does not exist')) {
        setSetupNeeded(true)
      }
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupMediaGallery = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/media/setup', { method: 'POST' })
      const result = await response.json()
      
      if (result.success) {
        alert('Media gallery setup completed!')
        setSetupNeeded(false)
        fetchMedia()
      } else {
        alert('Setup failed: ' + result.error)
      }
    } catch (error) {
      console.error('Setup error:', error)
      alert('Failed to setup media gallery')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this media item?')) {
      try {
        const response = await fetch(`/api/media/${id}`, { method: 'DELETE' })
        const result = await response.json()
        
        if (result.success) {
          setMedia(media.filter(item => item.id !== id))
        } else {
          alert('Failed to delete: ' + result.error)
        }
      } catch (error) {
        console.error('Delete error:', error)
        alert('Failed to delete media')
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return
    if (confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      try {
        // Delete each item
        const deletePromises = selectedItems.map(id => 
          fetch(`/api/media/${id}`, { method: 'DELETE' })
        )
        await Promise.all(deletePromises)
        
        setMedia(media.filter(item => !selectedItems.includes(item.id)))
        setSelectedItems([])
      } catch (error) {
        console.error('Bulk delete error:', error)
        alert('Some items failed to delete')
      }
    }
  }

  const toggleSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
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
              <Link href="/dashboard/applications" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                📝 Applications Review
              </Link>
              <Link href="/dashboard/maintenance" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                🔧 Maintenance
              </Link>
              <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-blue-50 rounded-md border-l-4 border-blue-500">
                🖼️ Media Gallery
              </div>
              <Link href="/dashboard/settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                ⚙️ Settings
              </Link>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">
          {setupNeeded && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Setup Required</h3>
              <p className="text-yellow-800 mb-3">The media gallery needs to be initialized before use.</p>
              <button
                onClick={setupMediaGallery}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                disabled={loading}
              >
                {loading ? 'Setting up...' : 'Initialize Media Gallery'}
              </button>
            </div>
          )}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Media Gallery Management</h2>
                <p className="text-gray-600 mt-1">Upload and manage photos and videos for the public gallery</p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href="/gallery"
                  target="_blank"
                  className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  View Public Gallery
                </Link>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upload Media
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">{media.length}</div>
              <div className="text-sm text-gray-600">Total Media</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">
                {media.filter(m => m.file_type === 'image').length}
              </div>
              <div className="text-sm text-gray-600">Images</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">
                {media.filter(m => m.file_type === 'video').length}
              </div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">
                {Array.from(new Set(media.map(m => m.category))).length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>

          {/* Actions Bar */}
          {selectedItems.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex justify-between items-center">
              <span className="text-blue-700">
                {selectedItems.length} item(s) selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Delete Selected
              </button>
            </div>
          )}

          {/* Media Table */}
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading media...</p>
            </div>
          ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === media.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(media.map(m => m.id))
                        } else {
                          setSelectedItems([])
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {media.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.file_type === 'image' ? '🖼️ Image' : '🎥 Video'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {media.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No media uploaded yet</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upload First Media
                </button>
              </div>
            )}
          </div>
          )}
        </main>
      </div>

      {/* Upload Modal */}
      <MediaUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={() => {
          fetchMedia()
          setShowUploadModal(false)
        }}
      />
    </div>
  )
}