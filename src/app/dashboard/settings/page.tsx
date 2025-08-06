'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

interface Settings {
  // Hostel Information
  hostel_name: string
  hostel_address: string
  hostel_phone: string
  hostel_email: string
  manager_name: string
  
  // Academic Year
  current_academic_year: string
  semester_start_date: string
  semester_end_date: string
  
  // Fee Settings
  old_building_fee: number
  new_building_fee: number
  executive_fee: number
  
  // Room Configuration
  total_old_rooms: number
  total_new_rooms: number
  total_executive_rooms: number
  
  // System Settings
  allow_online_applications: boolean
  maintenance_email_alerts: boolean
  auto_assign_rooms: boolean
  require_guarantor: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    hostel_name: 'Fredmak Hostel',
    hostel_address: '',
    hostel_phone: '',
    hostel_email: '',
    manager_name: 'Manager',
    current_academic_year: '2024/25',
    semester_start_date: '2024-09-01',
    semester_end_date: '2025-06-30',
    old_building_fee: 5500,
    new_building_fee: 7000,
    executive_fee: 8000,
    total_old_rooms: 20,
    total_new_rooms: 20,
    total_executive_rooms: 8,
    allow_online_applications: true,
    maintenance_email_alerts: false,
    auto_assign_rooms: false,
    require_guarantor: true
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'academic' | 'fees' | 'rooms' | 'system'>('general')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .single()

      if (data) {
        setSettings(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.log('No existing settings found')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert([{ id: 1, ...settings }])

      if (error) throw error
      
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
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
                {settings.current_academic_year}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{settings.manager_name}</span>
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
              <Link href="/dashboard/maintenance" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                🔧 Maintenance
              </Link>
              <Link href="/dashboard/media" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                🖼️ Media Gallery
              </Link>
              <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-blue-50 rounded-md border-l-4 border-blue-500">
                ⚙️ Settings
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">System Settings</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'general' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  General Information
                </button>
                <button
                  onClick={() => setActiveTab('academic')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'academic' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Academic Year
                </button>
                <button
                  onClick={() => setActiveTab('fees')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'fees' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Fee Structure
                </button>
                <button
                  onClick={() => setActiveTab('rooms')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'rooms' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Room Configuration
                </button>
                <button
                  onClick={() => setActiveTab('system')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'system' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  System Preferences
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow p-6">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading settings...</div>
              ) : (
                <>
                  {/* General Information Tab */}
                  {activeTab === 'general' && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold mb-4">Hostel Information</h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hostel Name
                        </label>
                        <input
                          type="text"
                          value={settings.hostel_name}
                          onChange={(e) => handleInputChange('hostel_name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <textarea
                          value={settings.hostel_address}
                          onChange={(e) => handleInputChange('hostel_address', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={settings.hostel_phone}
                            onChange={(e) => handleInputChange('hostel_phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={settings.hostel_email}
                            onChange={(e) => handleInputChange('hostel_email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Manager Name
                        </label>
                        <input
                          type="text"
                          value={settings.manager_name}
                          onChange={(e) => handleInputChange('manager_name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Academic Year Tab */}
                  {activeTab === 'academic' && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold mb-4">Academic Year Settings</h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Academic Year
                        </label>
                        <input
                          type="text"
                          value={settings.current_academic_year}
                          onChange={(e) => handleInputChange('current_academic_year', e.target.value)}
                          placeholder="e.g., 2024/25"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Semester Start Date
                          </label>
                          <input
                            type="date"
                            value={settings.semester_start_date}
                            onChange={(e) => handleInputChange('semester_start_date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Semester End Date
                          </label>
                          <input
                            type="date"
                            value={settings.semester_end_date}
                            onChange={(e) => handleInputChange('semester_end_date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fee Structure Tab */}
                  {activeTab === 'fees' && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold mb-4">Fee Structure (per semester)</h2>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Old Building Fee (₵)
                          </label>
                          <input
                            type="number"
                            value={settings.old_building_fee}
                            onChange={(e) => handleInputChange('old_building_fee', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Building Fee (₵)
                          </label>
                          <input
                            type="number"
                            value={settings.new_building_fee}
                            onChange={(e) => handleInputChange('new_building_fee', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Executive Block Fee (₵)
                          </label>
                          <input
                            type="number"
                            value={settings.executive_fee}
                            onChange={(e) => handleInputChange('executive_fee', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Room Configuration Tab */}
                  {activeTab === 'rooms' && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold mb-4">Room Configuration</h2>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Old Building Rooms
                          </label>
                          <input
                            type="number"
                            value={settings.total_old_rooms}
                            onChange={(e) => handleInputChange('total_old_rooms', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total New Building Rooms
                          </label>
                          <input
                            type="number"
                            value={settings.total_new_rooms}
                            onChange={(e) => handleInputChange('total_new_rooms', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Executive Rooms
                          </label>
                          <input
                            type="number"
                            value={settings.total_executive_rooms}
                            onChange={(e) => handleInputChange('total_executive_rooms', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                          <strong>Total Rooms:</strong> {settings.total_old_rooms + settings.total_new_rooms + settings.total_executive_rooms} rooms
                        </p>
                      </div>
                    </div>
                  )}

                  {/* System Preferences Tab */}
                  {activeTab === 'system' && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold mb-4">System Preferences</h2>
                      
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.allow_online_applications}
                            onChange={(e) => handleInputChange('allow_online_applications', e.target.checked)}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Allow Online Applications</span>
                            <p className="text-xs text-gray-500">Enable students to submit applications through the website</p>
                          </div>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.maintenance_email_alerts}
                            onChange={(e) => handleInputChange('maintenance_email_alerts', e.target.checked)}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Maintenance Email Alerts</span>
                            <p className="text-xs text-gray-500">Send email notifications for new maintenance issues</p>
                          </div>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.auto_assign_rooms}
                            onChange={(e) => handleInputChange('auto_assign_rooms', e.target.checked)}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Auto-Assign Rooms</span>
                            <p className="text-xs text-gray-500">Automatically assign rooms to accepted applicants</p>
                          </div>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.require_guarantor}
                            onChange={(e) => handleInputChange('require_guarantor', e.target.checked)}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Require Guarantor Information</span>
                            <p className="text-xs text-gray-500">Make guarantor details mandatory in applications</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}