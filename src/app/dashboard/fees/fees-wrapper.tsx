'use client'

import { useState } from 'react'
import FeesList from './fees-list'
import PaymentModal from '@/components/PaymentModal'

interface FeesWrapperProps {
  refreshKey: number
  onRefresh: () => void
}

export default function FeesWrapper({ refreshKey, onRefresh }: FeesWrapperProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedResident, setSelectedResident] = useState<any>(null)

  const handleRecordPayment = (resident: any) => {
    setSelectedResident(resident)
    setIsPaymentModalOpen(true)
  }

  return (
    <>
      <FeesList 
        refreshKey={refreshKey} 
        onRecordPayment={handleRecordPayment}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setSelectedResident(null)
        }}
        onSuccess={() => {
          setIsPaymentModalOpen(false)
          setSelectedResident(null)
          onRefresh()
        }}
        resident={selectedResident}
      />
    </>
  )
}