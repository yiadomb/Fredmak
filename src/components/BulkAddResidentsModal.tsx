'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface BulkAddResidentsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function BulkAddResidentsModal({ isOpen, onClose, onSuccess }: BulkAddResidentsModalProps) {
  const [csvData, setCsvData] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const supabase = createClientComponentClient()

  const parseCsv = (text: string) => {
    const lines = text.trim().split('\n')
    const residents = []
    
    // Skip header if it exists
    const firstLine = lines[0].toLowerCase()
    const hasHeader = firstLine.includes('name') || firstLine.includes('gender') || firstLine.includes('phone')
    const startIndex = hasHeader ? 1 : 0
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      // More robust CSV parsing that handles names with spaces
      const parts = []
      let current = ''
      let inQuotes = false
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          parts.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      
      // Don't forget the last part
      if (current) {
        parts.push(current.trim())
      }
      
      // Clean up parts - remove quotes and trim
      const cleanParts = parts.map(part => part.replace(/^["']|["']$/g, '').trim())
      
      if (cleanParts.length >= 3) {
        // Combine first and second parts if we have 4 parts (first name, last name, gender, phone)
        if (cleanParts.length === 4) {
          residents.push({
            full_name: cleanParts[0] + ' ' + cleanParts[1],
            gender: cleanParts[2],
            phone: cleanParts[3]
          })
        } else {
          residents.push({
            full_name: cleanParts[0],
            gender: cleanParts[1],
            phone: cleanParts[2]
          })
        }
      }
    }
    
    return residents
  }

  const handlePreview = () => {
    try {
      const residents = parseCsv(csvData)
      if (residents.length === 0) {
        setError('No valid data found. Please check your CSV format.')
        return
      }
      setPreview(residents)
      setShowPreview(true)
      setError('')
    } catch (err) {
      setError('Failed to parse CSV data. Please check the format.')
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const residents = showPreview ? preview : parseCsv(csvData)
      
      if (residents.length === 0) {
        throw new Error('No valid data to import')
      }

      // Validate gender values
      const validatedResidents = residents.map(r => ({
        ...r,
        gender: r.gender.toLowerCase() === 'male' || r.gender.toLowerCase() === 'm' ? 'Male' : 
                r.gender.toLowerCase() === 'female' || r.gender.toLowerCase() === 'f' ? 'Female' : r.gender
      }))

      // Insert all residents
      const { error: insertError } = await supabase
        .from('residents')
        .insert(validatedResidents)

      if (insertError) throw insertError

      // Reset form
      setCsvData('')
      setPreview([])
      setShowPreview(false)
      
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to import residents')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setCsvData(text)
      handlePreview()
    }
    reader.readAsText(file)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Bulk Add Residents</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">CSV Format Instructions:</h3>
          <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
            <p className="mb-2">Your CSV can have either:</p>
            <p className="mb-2"><strong>3 columns:</strong> Full Name, Gender, Phone</p>
            <code className="block bg-white p-2 rounded border mb-2">
              John Doe, Male, +233123456789<br/>
              Jane Smith, Female, +233987654321
            </code>
            <p className="mb-2"><strong>4 columns:</strong> First Name, Last Name, Gender, Phone</p>
            <code className="block bg-white p-2 rounded border">
              John, Doe, Male, +233123456789<br/>
              Jane, Smith, Female, +233987654321
            </code>
            <p className="mt-2 text-xs">Note: Gender can be "Male/Female" or "M/F". Names with commas should be in quotes.</p>
          </div>
        </div>

        {!showPreview ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Option 1: Paste CSV Data
              </label>
              <textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Paste your CSV data here..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Option 2: Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handlePreview}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                disabled={!csvData.trim() || loading}
              >
                Preview Import
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Preview ({preview.length} residents to import)
              </h3>
              <div className="max-h-64 overflow-y-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.map((resident, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-500">{index + 1}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{resident.full_name}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{resident.gender}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{resident.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPreview(false)
                  setPreview([])
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Back to Edit
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? `Importing ${preview.length} residents...` : `Import ${preview.length} Residents`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}