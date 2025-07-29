'use client'

import { useState } from 'react'

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [error, setError] = useState('')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(message) // Also log to browser console
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const setupDatabase = async () => {
    setIsLoading(true)
    setError('')
    setLogs([])
    addLog('🔄 Starting database setup...')

    try {
      addLog('📡 Connecting to API...')
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      addLog(`📊 API Response Status: ${response.status}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      addLog(`📋 API Response: ${JSON.stringify(result)}`)

      if (result.success) {
        addLog('✅ Database setup completed successfully!')
        addLog(`📊 Created all tables and seeded ${result.roomsCount || 48} rooms`)
        addLog('🏠 Room breakdown:')
        if (result.details) {
          addLog(`   - Old Block: ${result.details.oldBlock} rooms`)
          addLog(`   - New Block: ${result.details.newBlock} rooms`) 
          addLog(`   - Executive: ${result.details.executive} rooms`)
        }
        setSetupComplete(true)
      } else {
        throw new Error(result.error || 'Setup failed - no error message')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Setup failed'
      setError(errorMessage)
      addLog(`❌ Setup failed: ${errorMessage}`)
      console.error('Setup error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fredmak Hostel Dashboard Setup
          </h1>
          <p className="text-gray-600 mb-8">
            Initialize your hostel management system database with all the necessary tables and room data.
          </p>

          {!setupComplete ? (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">What this will do:</h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• Create all database tables (rooms, residents, payments, etc.)</li>
                  <li>• Seed room data for all 48 rooms across 3 buildings</li>
                  <li>• Set up fee matrix (Old: ₵5,500, New: ₵7,000, Executive: ₵8,000-13,000)</li>
                  <li>• Configure academic year settings (default: 2024/25)</li>
                </ul>
              </div>

              <button
                onClick={setupDatabase}
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isLoading ? '⏳ Setting up database...' : '🚀 Initialize Database'}
              </button>

              {/* Debug info */}
              <div className="mt-4 text-sm text-gray-500">
                <p>Current URL: {window.location.href}</p>
                <p>API URL: /api/setup</p>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Setup Complete! 🎉</h3>
              <p className="text-green-800 mb-4">
                Your hostel management system is ready to use. All 48 rooms have been created in your database.
              </p>
              <a
                href="/"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors mr-3"
              >
                Go to Homepage
              </a>
              <a
                href="/dashboard"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-red-900 font-medium">Setup Error</h4>
              <p className="text-red-800 mt-1">{error}</p>
              <button
                onClick={() => {
                  setError('')
                  setLogs([])
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Clear error and try again
              </button>
            </div>
          )}

          {logs.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Setup Log:</h4>
              <div className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm font-mono max-h-64 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}