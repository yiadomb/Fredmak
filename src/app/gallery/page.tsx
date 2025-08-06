'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MediaItem {
  id: string
  file_url: string
  title: string
  description?: string
  file_type: 'image' | 'video'
  category: string
  created_at: string
}

export default function GalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch media from API
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
      } else {
        setError(result.error || 'Failed to load media')
      }
    } catch (err) {
      console.error('Error fetching media:', err)
      setError('Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(media.map(item => item.category)))]

  // Filter media by category
  const filteredMedia = selectedCategory === 'All' 
    ? media 
    : media.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Fredmak Hostel
              </h1>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/gallery" className="text-blue-600 font-medium">
                Gallery
              </Link>
              <Link 
                href="/apply" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Apply Now
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-gray-900"
              >
                Staff Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Hostel Gallery</h2>
          <p className="text-xl">
            Take a virtual tour of our facilities and accommodations
          </p>
        </div>
      </div>

      {/* Category Filter */}
      {!loading && media.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading gallery...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchMedia}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Media Available</h3>
              <p className="text-gray-600">
                {selectedCategory === 'All' 
                  ? 'Gallery photos will be available soon. Check back later!'
                  : `No media found in the ${selectedCategory} category.`}
              </p>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View All Media
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative h-48 bg-gray-200">
                  {item.file_type === 'image' ? (
                    <img
                      src={item.file_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23999"%3EImage Not Available%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {selectedImage.file_type === 'image' ? (
              <img
                src={selectedImage.file_url}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain"
              />
            ) : (
              <video
                src={selectedImage.file_url}
                controls
                className="max-w-full max-h-[80vh]"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
              <h3 className="text-xl font-semibold mb-1">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-300">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-2xl font-bold mb-4">Ready to Join Us?</h3>
          <p className="mb-6 text-gray-300">
            Experience comfortable student living at Fredmak Hostel
          </p>
          <Link
            href="/apply"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Apply for Accommodation
          </Link>
        </div>
      </div>
    </div>
  )
}