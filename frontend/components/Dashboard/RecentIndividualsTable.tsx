'use client'

import { useState } from 'react'
import { Eye, Edit, MoreVertical, Download } from 'lucide-react'
import Link from 'next/link'

interface Individual {
  id: string
  name: string
  age: number
  status: 'pending' | 'placed' | 'active' | 'inactive'
  location: string
  registeredDate: string
  priority: 'low' | 'medium' | 'high' | 'critical'
}

const mockData: Individual[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 35,
    status: 'pending',
    location: 'Downtown',
    registeredDate: '2024-11-10',
    priority: 'high',
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 28,
    status: 'placed',
    location: 'Midtown',
    registeredDate: '2024-11-09',
    priority: 'medium',
  },
  {
    id: '3',
    name: 'Michael Brown',
    age: 42,
    status: 'active',
    location: 'Eastside',
    registeredDate: '2024-11-08',
    priority: 'low',
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    age: 31,
    status: 'pending',
    location: 'Westside',
    registeredDate: '2024-11-10',
    priority: 'critical',
  },
  {
    id: '5',
    name: 'David Wilson',
    age: 55,
    status: 'placed',
    location: 'Northside',
    registeredDate: '2024-11-07',
    priority: 'medium',
  },
]

export default function RecentIndividualsTable() {
  const [individuals, setIndividuals] = useState<Individual[]>(mockData)
  const [sortField, setSortField] = useState<keyof Individual>('registeredDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const handleSort = (field: keyof Individual) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleExport = () => {
    // Export to CSV
    const csv = [
      ['Name', 'Age', 'Status', 'Location', 'Priority', 'Registered Date'],
      ...individuals.map((ind) => [
        ind.name,
        ind.age,
        ind.status,
        ind.location,
        ind.priority,
        ind.registeredDate,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'individuals.csv'
    a.click()
  }

  const filteredIndividuals = individuals.filter((ind) =>
    filterStatus === 'all' ? true : ind.status === filterStatus
  )

  const sortedIndividuals = [...filteredIndividuals].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    const direction = sortDirection === 'asc' ? 1 : -1

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * direction
    }
    return ((aVal as number) - (bVal as number)) * direction
  })

  const getStatusBadge = (status: Individual['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      placed: 'bg-green-100 text-green-800',
      active: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800',
    }
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getPriorityBadge = (priority: Individual['priority']) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    }
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${styles[priority]}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    )
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Individuals
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredIndividuals.length} individuals
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="placed">Placed</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Export */}
          <button
            onClick={handleExport}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('name')}
              >
                Name
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('age')}
              >
                Age
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Priority
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Location
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('registeredDate')}
              >
                Registered
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedIndividuals.map((individual) => (
              <tr
                key={individual.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">
                    {individual.name}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">{individual.age}</td>
                <td className="py-3 px-4">
                  {getStatusBadge(individual.status)}
                </td>
                <td className="py-3 px-4">
                  {getPriorityBadge(individual.priority)}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {individual.location}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {new Date(individual.registeredDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/dashboard/profiles/${individual.id}`}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/dashboard/profiles/${individual.id}/edit`}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="More"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <p className="text-sm text-gray-600">
          Showing {sortedIndividuals.length} of {individuals.length} results
        </p>
        <div className="flex gap-2">
          <button className="btn btn-secondary px-3 py-1 text-sm">
            Previous
          </button>
          <button className="btn btn-primary px-3 py-1 text-sm">Next</button>
        </div>
      </div>
    </div>
  )
}
