import { Suspense } from 'react'
import ResidentsList from './residents-list'
import ResidentsWrapper from './residents-wrapper'
import Link from 'next/link'

export default function ResidentsPage() {
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
              <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-blue-50 rounded-md border-l-4 border-blue-500">
                👥 Residents & Occupancies
              </div>
              <Link href="/dashboard/fees" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                💰 Fees & Payments
              </Link>
              <Link href="/dashboard/applications" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                📝 Applications Review
              </Link>
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
          <ResidentsWrapper />
        </main>
      </div>
    </div>
  )
}