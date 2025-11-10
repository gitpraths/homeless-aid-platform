'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Layout/Navbar'
import { Users, Home, Briefcase, TrendingUp, MapPin, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalIndividuals: 0,
    activeShelters: 0,
    jobPlacements: 0,
    volunteersActive: 0,
  })

  useEffect(() => {
    // Mock data - replace with actual API call
    setStats({
      totalIndividuals: 1247,
      activeShelters: 45,
      jobPlacements: 89,
      volunteersActive: 156,
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Total Individuals"
            value={stats.totalIndividuals.toLocaleString()}
            change="+12%"
            changeType="positive"
          />
          <StatCard
            icon={<Home className="w-6 h-6" />}
            title="Active Shelters"
            value={stats.activeShelters.toString()}
            change="+3"
            changeType="positive"
          />
          <StatCard
            icon={<Briefcase className="w-6 h-6" />}
            title="Job Placements"
            value={stats.jobPlacements.toString()}
            change="+8%"
            changeType="positive"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Active Volunteers"
            value={stats.volunteersActive.toString()}
            change="+5%"
            changeType="positive"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <QuickActionCard
            icon={<Users className="w-8 h-8" />}
            title="Add New Individual"
            description="Register a new homeless individual"
            href="/dashboard/add-individual"
            color="primary"
          />
          <QuickActionCard
            icon={<MapPin className="w-8 h-8" />}
            title="Find Shelter"
            description="Search for available shelters"
            href="/dashboard/shelters"
            color="secondary"
          />
          <QuickActionCard
            icon={<Briefcase className="w-8 h-8" />}
            title="Job Matching"
            description="Match individuals with jobs"
            href="/dashboard/jobs"
            color="primary"
          />
        </div>

        {/* Recent Activity & Alerts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <ActivityItem
                title="New individual registered"
                description="John Doe added to the system"
                time="5 minutes ago"
              />
              <ActivityItem
                title="Shelter placement successful"
                description="Jane Smith placed at Hope Shelter"
                time="1 hour ago"
              />
              <ActivityItem
                title="Job match found"
                description="3 new job matches for Michael Brown"
                time="2 hours ago"
              />
            </div>
          </div>

          {/* Alerts */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Alerts & Notifications
            </h2>
            <div className="space-y-4">
              <AlertItem
                type="warning"
                title="Shelter capacity low"
                description="Downtown Shelter at 95% capacity"
              />
              <AlertItem
                type="info"
                title="New volunteer registered"
                description="Sarah Johnson joined as a volunteer"
              />
              <AlertItem
                type="success"
                title="Monthly goal achieved"
                description="100 individuals helped this month"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, title, value, change, changeType }: {
  icon: React.ReactNode
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
          {icon}
        </div>
        <span className={`text-sm font-medium ${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function QuickActionCard({ icon, title, description, href, color }: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  color: 'primary' | 'secondary'
}) {
  return (
    <Link href={href} className="card hover:shadow-lg transition-shadow group">
      <div className={`p-3 rounded-lg inline-block mb-4 ${
        color === 'primary' ? 'bg-primary-50 text-primary-600' : 'bg-secondary-50 text-secondary-600'
      } group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  )
}

function ActivityItem({ title, description, time }: {
  title: string
  description: string
  time: string
}) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b last:border-0">
      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  )
}

function AlertItem({ type, title, description }: {
  type: 'warning' | 'info' | 'success'
  title: string
  description: string
}) {
  const colors = {
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  }

  return (
    <div className={`p-4 rounded-lg border ${colors[type]}`}>
      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  )
}
