'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface FormData {
  // Personal Information
  full_name: string
  email: string
  phone: string
  student_id: string
  gender: 'Male' | 'Female' | ''
  
  // Academic Information
  program: string
  level: string
  
  // Accommodation Preferences
  preferred_block: 'Old' | 'New' | 'Executive' | ''
  room_type_preference: string
  
  // Emergency Contact
  emergency_contact_name: string
  emergency_contact_phone: string
  emergency_contact_relationship: string
  
  // Additional
  special_requirements: string
  tenancy_agreement_accepted: boolean
}

export default function ApplyPage() {
  const [step, setStep] = useState(1)
  const [showAgreement, setShowAgreement] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    student_id: '',
    gender: '',
    program: '',
    level: '',
    preferred_block: '',
    room_type_preference: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    special_requirements: '',
    tenancy_agreement_accepted: false
  })

  const supabase = createClientComponentClient()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.full_name && formData.email && formData.phone && formData.gender
      case 2:
        return formData.student_id && formData.program && formData.level
      case 3:
        return formData.preferred_block
      case 4:
        return formData.emergency_contact_name && formData.emergency_contact_phone
      case 5:
        return formData.tenancy_agreement_accepted
      default:
        return true
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(5)) {
      alert('Please accept the tenancy agreement to proceed')
      return
    }

    setSubmitting(true)
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([{
          ...formData,
          academic_year: '2024/25',
          status: 'Pending',
          submitted_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      setSubmitted(true)
    } catch (error: any) {
      console.error('Submission error:', error)
      const errorMessage = error?.message || error?.error || 'Unknown error occurred'
      alert(`Failed to submit application: ${errorMessage}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for applying to Fredmak Hostel. We'll review your application and contact you via email within 3-5 business days.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Application Reference:</strong><br />
              {formData.email}
            </p>
          </div>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

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
              <Link href="/gallery" className="text-gray-600 hover:text-gray-900">
                Gallery
              </Link>
              <Link href="/apply" className="text-blue-600 font-medium">
                Apply
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Application Form */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Progress Bar */}
          <div className="px-8 pt-6">
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4, 5].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 5 && (
                    <div className={`w-full h-1 mx-2 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                    }`} style={{ width: '60px' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Academic Information */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Academic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program of Study *
                  </label>
                  <input
                    type="text"
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science, Business Administration"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Level *
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="100">Level 100</option>
                    <option value="200">Level 200</option>
                    <option value="300">Level 300</option>
                    <option value="400">Level 400</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Accommodation Preferences */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Accommodation Preferences</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Block *
                  </label>
                  <select
                    name="preferred_block"
                    value={formData.preferred_block}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Block</option>
                    <option value="Old">Old Block (₵5,500/year - 3 per room)</option>
                    <option value="New">New Block (₵7,000/year - 2 per room)</option>
                    <option value="Executive">Executive Block (₵8,000-13,000/year)</option>
                  </select>
                </div>

                {formData.preferred_block === 'Executive' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type Preference
                    </label>
                    <select
                      name="room_type_preference"
                      value={formData.room_type_preference}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Room Type</option>
                      <option value="single">Single Room (₵13,000/year)</option>
                      <option value="double">Double Room (₵8,000/year)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirements or Requests
                  </label>
                  <textarea
                    name="special_requirements"
                    value={formData.special_requirements}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Any medical conditions, dietary requirements, or special needs we should know about?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Emergency Contact */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Emergency Contact</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="emergency_contact_phone"
                      value={formData.emergency_contact_phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship
                    </label>
                    <input
                      type="text"
                      name="emergency_contact_relationship"
                      value={formData.emergency_contact_relationship}
                      onChange={handleInputChange}
                      placeholder="e.g., Parent, Guardian, Sibling"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Terms and Agreement */}
            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms and Agreement</h2>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Tenancy Agreement Summary</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Payment of fees must be made in full before moving in</li>
                    <li>• Room assignments are final and non-transferable</li>
                    <li>• Residents must maintain cleanliness and respect quiet hours</li>
                    <li>• No unauthorized guests after 10 PM</li>
                    <li>• Damages to property will be charged to the resident</li>
                    <li>• Management reserves the right to inspect rooms with notice</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => setShowAgreement(true)}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Full Agreement →
                  </button>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="tenancy_agreement_accepted"
                    id="agreement"
                    checked={formData.tenancy_agreement_accepted}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="agreement" className="ml-2 text-sm text-gray-700">
                    I have read and agree to the tenancy agreement and all terms and conditions *
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> By submitting this application, you confirm that all information provided is accurate and complete. False information may result in rejection of your application.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>
              )}
              
              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep(step)) {
                      setStep(step + 1)
                    } else {
                      alert('Please fill in all required fields')
                    }
                  }}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting || !formData.tenancy_agreement_accepted}
                  className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Full Agreement Modal */}
      {showAgreement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl max-h-[80vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-4">Fredmak Hostel Tenancy Agreement</h2>
            <div className="prose prose-sm text-gray-700">
              <p>This agreement is entered into between Fredmak Hostel Management (the "Landlord") and the applicant (the "Tenant").</p>
              
              <h3 className="font-semibold mt-4">1. Terms of Tenancy</h3>
              <p>The tenancy period covers one academic year as specified by the institution...</p>
              
              <h3 className="font-semibold mt-4">2. Payment Terms</h3>
              <p>Full payment must be made before occupancy. No refunds after 30 days of occupancy...</p>
              
              <h3 className="font-semibold mt-4">3. House Rules</h3>
              <p>Residents must maintain cleanliness, respect quiet hours (10 PM - 6 AM), and follow all hostel regulations...</p>
              
              <h3 className="font-semibold mt-4">4. Termination</h3>
              <p>The management reserves the right to terminate tenancy for violation of rules...</p>
            </div>
            <button
              onClick={() => setShowAgreement(false)}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}