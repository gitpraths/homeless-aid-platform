'use client'

import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  status: 'pending' | 'in_progress' | 'completed'
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with John Doe',
    description: 'Check shelter placement status',
    priority: 'high',
    dueDate: '2024-11-11',
    status: 'pending',
  },
  {
    id: '2',
    title: 'Complete needs assessment',
    description: 'For Jane Smith',
    priority: 'medium',
    dueDate: '2024-11-12',
    status: 'in_progress',
  },
  {
    id: '3',
    title: 'Update contact information',
    description: 'Michael Brown - new phone number',
    priority: 'low',
    dueDate: '2024-11-13',
    status: 'pending',
  },
  {
    id: '4',
    title: 'Schedule job interview',
    description: 'Sarah Johnson at Hope Center',
    priority: 'high',
    dueDate: '2024-11-11',
    status: 'pending',
  },
]

export default function PendingTasksList() {
  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      low: 'text-gray-600',
      medium: 'text-yellow-600',
      high: 'text-red-600',
    }
    return colors[priority]
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    if (priority === 'high') return <AlertCircle className="w-4 h-4" />
    if (priority === 'medium') return <Clock className="w-4 h-4" />
    return <CheckCircle className="w-4 h-4" />
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Pending Tasks</h2>
        <span className="px-2 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded-full">
          {mockTasks.filter((t) => t.status === 'pending').length} pending
        </span>
      </div>

      <div className="space-y-3">
        {mockTasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer ${
              task.status === 'completed'
                ? 'border-green-200 bg-green-50'
                : isOverdue(task.dueDate)
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1 ${getPriorityColor(task.priority)}`}>
                {getPriorityIcon(task.priority)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2 py-1 rounded-full font-medium ${
                      isOverdue(task.dueDate)
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full font-medium ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary w-full mt-4">View All Tasks</button>
    </div>
  )
}
