import { Suspense } from 'react'
import RoomsBoard from './rooms-board'

export default function DashboardPage() {
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
              <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-blue-50 rounded-md border-l-4 border-blue-500">
                🏠 Rooms Board
              </div>
              <a href="/dashboard/residents" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                👥 Residents & Occupancies
              </a>
              <a href="/dashboard/fees" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                💰 Fees & Payments
              </a>
              <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 rounded-md cursor-not-allowed">
                📝 Applications Review
              </div>
              <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 rounded-md cursor-not-allowed">
                🔧 Maintenance
              </div>
              <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 rounded-md cursor-not-allowed">
                ⚙️ Settings
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Rooms Board</h2>
            <p className="text-gray-600">
              Manage room assignments and track occupancy across all buildings
            </p>
          </div>

          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading rooms data...</div>
            </div>
          }>
            <RoomsBoard />
          </Suspense>
        </main>
      </div>
    </div>
  )
}