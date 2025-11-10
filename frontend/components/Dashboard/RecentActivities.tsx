'use client'

import { UserPlus, Home, Briefcase, CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface Activity {
  id: string
  type: 'registration' | 'placement' | 'job_match' | 'assessment' | 'alert'
  title: string
  description: string
  timestamp: Date
  user?: string
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'registration',
    title: 'New individual registered',
    description: 'John Doe added to the system',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    user: 'You',
  },
  {
    id: '2',
    type: 'placement',
    title: 'Shelter placement successful',
    description: 'Jane Smith placed at Hope Shelter',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    user: 'Sarah Johnson',
  },
  {
    id: '3',
    type: 'job_match',
    title: 'Job match found',
    description: '3 new job matches for Michael Brown',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: 'System',
  },
  {
    id: '4',
    type: 'assessment',
    title: 'Needs assessment completed',
    description: 'Risk assessment for David Wilson',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    user: 'You',
  },
  {
    id: '5',
    type: 'alert',
    title: 'Follow-up required',
    description: 'Sarah Johnson - medication refill needed',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    user: 'System',
  },
]

export default function RecentActivities() {
  const getActivityIcon = (type: Activity['type']) => {
    const icons = {
      registration: <UserPlus className="w-5 h-5" />,
      placement: <Home className="w-5 h-5" />,
      job_match: <Briefcase className="w-5 h-5" />,
      assessment: <CheckCircle className="w-5 h-5" />,
      alert: <AlertCircle className="w-5 h-5" />,
    }
    return icons[type]
  }

  const getActivityColor = (type: Activity['type']) => {
    const colors = {
      registration: 'bg-blue-50 text-blue-600',
      placement: 'bg-green-50 text-green-600',
      job_match: 'bg-purple-50 text-purple-600',
      assessment: 'bg-yellow-50 text-yellow-600',
      alert: 'bg-red-50 text-red-600',
    }
    return colors[type]
  }

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
  }

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 pb-4 border-b last:border-0 animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{getTimeAgo(activity.timestamp)}</span>
                    {activity.user && (
                      <>
                        <span>•</span>
                        <span>{activity.user}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
