'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from '@/components/Layout/Sidebar'
import Navbar from '@/components/Layout/Navbar'
import StatsCard from '@/components/Dashboard/StatsCard'
import RecentIndividualsTable from '@/components/Dashboard/RecentIndividualsTable'
import ResourceMap from '@/components/Maps/ResourceMap'
import PendingTasksList from '@/components/Dashboard/PendingTasksList'
import RecentActivities from '@/components/Dashboard/RecentActivities'
import { Users, CheckCircle, TrendingUp, Clock, UserPlus, Map as MapIcon, FileText } from 'lucide-react'
import Link from 'next/link'
import { io, Socket } from 'socket.io-client'
import toast from 'react-hot-toast'

export default function VolunteerDashboard() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [stats, setStats] = useState({
    totalRegistered: 0,
    pendingPlacements: 0,
    successRate: 0,
    pendingTasks: 0,
  })

  // Initialize WebSocket for real-time updates
  useEffect(() => {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000'
    const newSocket = io(WS_URL)

    newSocket.on('connect', () => {
      console.log('Connected to real-time updates')
    })

    newSocket.on('stats_update', (data: any) => {
      setStats(data)
      toast.success('Stats updated')
    })

    newSocket.on('new_individual', (data: any) => {
      toast.success(`New individual registered: ${data.name}`)
      // Refresh stats
      fetchStats()
    })

    newSocket.on('placement_success', (data: any) => {
      toast.success(`Placement successful: ${data.name}`)
      fetchStats()
    })

    setSocket(newSocket)

    // Initial data fetch
    fetchStats()

    return () => {
      newSocket.close()
    }
  }, [])

  const fetchStats = async () => {
    // Mock data - replace with actual API call
    setStats({
      totalRegistered: 1247,
      pendingPlacements: 34,
      successRate: 87.5,
      pendingTasks: 12,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Navbar */}
        <Navbar />

        <main className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Volunteer Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.name || 'Volunteer'}! Here's your overview.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Registered"
              value={stats.totalRegistered.toLocaleString()}
              change="+12% from last month"
              changeType="positive"
              icon={Users}
              color="primary"
            />
            <StatsCard
              title="Pending Placements"
              value={stats.pendingPlacements}
              change={`${stats.pendingPlacements} awaiting`}
              changeType="neutral"
              icon={Clock}
              color="warning"
            />
            <StatsCard
              title="Success Rate"
              value={`${stats.successRate}%`}
              change="+3.2% improvement"
              changeType="positive"
              icon={CheckCircle}
              color="success"
            />
            <StatsCard
              title="Pending Tasks"
              value={stats.pendingTasks}
              change="Due this week"
              changeType="neutral"
              icon={TrendingUp}
              color="secondary"
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              href="/dashboard/add-individual"
              className="card hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-50 text-primary-600 rounded-lg group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add New Individual</h3>
                  <p className="text-sm text-gray-600">Register a new person</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/map"
              className="card hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                  <MapIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">View Map</h3>
                  <p className="text-sm text-gray-600">See nearby resources</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/reports"
              className="card hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Generate Report</h3>
                  <p className="text-sm text-gray-600">Export your data</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activities - 2 columns */}
            <div className="lg:col-span-2">
              <RecentActivities />
            </div>

            {/* Pending Tasks - 1 column */}
            <div>
              <PendingTasksList />
            </div>
          </div>

          {/* Recent Individuals Table */}
          <div className="mb-8">
            <RecentIndividualsTable />
          </div>

          {/* Resource Map */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Nearby Resources</h2>
            <ResourceMap />
          </div>
        </main>
      </div>
    </div>
  )
}
