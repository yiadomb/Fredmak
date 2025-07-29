'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Fredmak Hostel</h1>
            <nav className="flex items-center space-x-4">
              <Link href="/gallery" className="text-gray-600 hover:text-gray-900">
                Gallery
              </Link>
              {/* Staff login link - small and discrete */}
              <Link 
                href="/dashboard" 
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Staff Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Fredmak Hostel
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Quality accommodation for students with modern facilities and affordable rates
          </p>
        </div>

        {/* Main Actions for Students */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link 
            href="/apply"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Apply for Accommodation
          </Link>
          <Link 
            href="/gallery"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Hostel Gallery
          </Link>
        </div>

        {/* Room Types */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Accommodation Options
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Old Block */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Old Block</h3>
              <p className="text-gray-600 mb-4">
                Budget-friendly 3-bed rooms perfect for students
              </p>
              <div className="text-2xl font-bold text-blue-600 mb-4">₵5,500/year</div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 3 students per room</li>
                <li>• Shared facilities</li>
                <li>• 24/7 security</li>
              </ul>
            </div>

            {/* New Block */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">New Block</h3>
              <p className="text-gray-600 mb-4">
                Modern 2-bed rooms with improved facilities
              </p>
              <div className="text-2xl font-bold text-blue-600 mb-4">₵7,000/year</div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 2 students per room</li>
                <li>• Modern facilities</li>
                <li>• Study areas</li>
              </ul>
            </div>

            {/* Executive Block */}
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-yellow-400">
              <div className="bg-yellow-50 -m-6 mb-4 px-6 py-2">
                <span className="text-sm font-medium text-yellow-800">Premium</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Executive Block</h3>
              <p className="text-gray-600 mb-4">
                Premium rooms with private facilities
              </p>
              <div className="text-2xl font-bold text-blue-600 mb-2">₵8,000-13,000/year</div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 1-2 students per room</li>
                <li>• Private bathroom</li>
                <li>• Air conditioning</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 text-center text-gray-600">
          <p>For inquiries, contact the hostel administration</p>
          <p className="mt-2">Email: info@fredmakhostel.com | Phone: +233 XX XXX XXXX</p>
        </div>
      </main>
    </div>
  )
} 