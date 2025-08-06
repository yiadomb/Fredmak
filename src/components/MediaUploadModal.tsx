'use client'

import { useState } from 'react'

interface MediaUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: () => void
}

export default function MediaUploadModal({ isOpen, onClose, onUploadSuccess }: MediaUploadModalProps) {
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Rooms',
    file: null as File | null
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image or video file (JPEG, PNG, GIF, WebP, MP4, or WebM)')
        return
      }
      // Validate file size (max 50MB for Supabase free tier)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB')
        return
      }
      setFormData({ ...formData, file })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.file || !formData.title) {
      alert('Please provide a title and select a file to upload')
      return
    }

    setUploading(true)
    try {
      // Create form data for upload
      const uploadData = new FormData()
      uploadData.append('file', formData.file)
      uploadData.append('title', formData.title)
      uploadData.append('description', formData.description || '')
      uploadData.append('category', formData.category)

      // Upload to API
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: uploadData
      })

      const result = await response.json()

      if (result.success) {
        alert('Media uploaded successfully!')
        onUploadSuccess()
        onClose()
        // Reset form
        setFormData({ title: '', description: '', category: 'Rooms', file: null })
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload media')
    } finally {
      setUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Upload Media</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={uploading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploading}
            >
              <option value="Rooms">Rooms</option>
              <option value="Facilities">Facilities</option>
              <option value="Building">Building</option>
              <option value="Events">Events</option>
              <option value="Campus">Campus</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File * (Images or Videos, max 50MB)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={uploading}
            />
            {formData.file && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)}MB)
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={uploading}
            >
              {uploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}