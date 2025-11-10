'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Layout/Navbar'
import Sidebar from '@/components/Layout/Sidebar'
import ProfileFormWizard from '@/components/Forms/ProfileFormWizard'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AddIndividualPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Navbar />
        
        <main className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/dashboard/volunteer"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Register New Individual
            </h1>
            <p className="text-gray-600">
              Complete the form below to register a new homeless individual in the system.
            </p>
          </div>

          {/* Form Wizard */}
          <ProfileFormWizard />
        </main>
      </div>
    </div>
  )
}
