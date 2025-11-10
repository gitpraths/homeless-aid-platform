'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Layout/Navbar'
import Sidebar from '@/components/Layout/Sidebar'
import RecommendationsView from '@/components/Recommendations/RecommendationsView'
import { ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'

export default function RecommendationsPage() {
  const params = useParams()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'shelter' | 'job' | 'training'>('shelter')
  
  const individualId = params.id as string

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Navbar />
        
        <main className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href={`/dashboard/profiles/${individualId}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AI Recommendations
                </h1>
                <p className="text-gray-600">
                  Personalized matches based on profile and needs
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('shelter')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'shelter'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Shelters
            </button>
            <button
              onClick={() => setActiveTab('job')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'job'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'training'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Training
            </button>
          </div>

          {/* Recommendations */}
          <RecommendationsView individualId={individualId} type={activeTab} />
        </main>
      </div>
    </div>
  )
}
