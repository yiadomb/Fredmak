'use client'

import { useState } from 'react'
import FeesWrapper from './fees-wrapper'

export default function FeesPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fees & Payments</h1>
          <p className="text-gray-600 mt-1">Track resident payments and outstanding balances</p>
        </div>
      </div>

      <FeesWrapper refreshKey={refreshKey} onRefresh={handleRefresh} />
    </div>
  )
}