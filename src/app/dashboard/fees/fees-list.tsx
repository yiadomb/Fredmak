'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface FeesListProps {
  refreshKey?: number
  onRecordPayment: (resident: any) => void
}

export default function FeesList({ refreshKey, onRecordPayment }: FeesListProps) {
  const [residents, setResidents] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchData()
  }, [refreshKey])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch residents with active occupancies and room info
      const { data: occupanciesData, error: occupanciesError } = await supabase
        .from('occupancies')
        .select(`
          *,
          residents (*),
          rooms (*)
        `)
        .eq('is_active', true)
        .eq('academic_year', '2024/25')

      if (occupanciesError) throw occupanciesError

      // Fetch all payments for the academic year
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('academic_year', '2024/25')
        .order('paid_at', { ascending: false })

      if (paymentsError) throw paymentsError

      setResidents(occupanciesData || [])
      setPayments(paymentsData || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Calculate payment summary for each resident
  const residentsWithPayments = residents.map(occupancy => {
    const residentPayments = payments.filter(p => p.resident_id === occupancy.resident_id)
    const totalPaid = residentPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0)
    const balance = occupancy.fee_due - totalPaid

    return {
      ...occupancy,
      resident: occupancy.residents,
      room: occupancy.rooms,
      totalPaid,
      balance,
      payments: residentPayments,
      status: balance <= 0 ? 'paid' : balance < occupancy.fee_due ? 'partial' : 'unpaid'
    }
  })

  // Filter residents
  const filteredResidents = residentsWithPayments.filter(r => {
    const matchesSearch = searchTerm === '' || 
      r.resident?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.room?.room_no?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  // Sort by balance (highest debt first)
  const sortedResidents = [...filteredResidents].sort((a, b) => b.balance - a.balance)

  // Calculate totals
  const totalExpected = residentsWithPayments.reduce((sum, r) => sum + r.fee_due, 0)
  const totalCollected = residentsWithPayments.reduce((sum, r) => sum + r.totalPaid, 0)
  const totalOutstanding = totalExpected - totalCollected

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading payment data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-medium">Error loading payment data</p>
        <p className="text-sm mt-1">Details: {error}</p>
      </div>
    )
  }

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Expected</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ₵{totalExpected.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Collected</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">
            ₵{totalCollected.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Outstanding</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">
            ₵{totalOutstanding.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Collection Rate</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="paid">Fully Paid</option>
          <option value="partial">Partial Payment</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {/* Residents Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-xs text-gray-600">💡 Tip: Double-click on any resident to record a payment</p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resident
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fee Due
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResidents.map((record) => (
              <tr 
                key={record.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onDoubleClick={() => onRecordPayment(record)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {record.resident?.full_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {record.resident?.student_id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.room?.room_no}</div>
                  <div className="text-sm text-gray-500">{record.room?.block} Block</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₵{record.fee_due.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₵{record.totalPaid.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    record.balance > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    ₵{Math.abs(record.balance).toLocaleString()}
                    {record.balance < 0 && ' (Overpaid)'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.status === 'paid' ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  ) : record.status === 'partial' ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Partial
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Unpaid
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}