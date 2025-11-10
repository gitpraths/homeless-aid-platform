'use client'

import { useState } from 'react'
import { MapPin, Home, Briefcase, GraduationCap, Navigation } from 'lucide-react'

// Mock data for resources
const mockResources = [
  { id: '1', name: 'Hope Shelter', type: 'shelter', lat: 40.7580, lon: -73.9855, available: 15 },
  { id: '2', name: 'Community Haven', type: 'shelter', lat: 40.7489, lon: -73.9680, available: 8 },
  { id: '3', name: 'Employment Center', type: 'job', lat: 40.7282, lon: -73.9942, available: 12 },
  { id: '4', name: 'Skills Training', type: 'training', lat: 40.7614, lon: -73.9776, available: 20 },
]

export default function ResourceMap() {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedResource, setSelectedResource] = useState<string | null>(null)

  const getResourceIcon = (type: string) => {
    const icons = {
      shelter: <Home className="w-4 h-4" />,
      job: <Briefcase className="w-4 h-4" />,
      training: <GraduationCap className="w-4 h-4" />,
    }
    return icons[type as keyof typeof icons] || <MapPin className="w-4 h-4" />
  }

  const getResourceColor = (type: string) => {
    const colors = {
      shelter: 'bg-blue-500',
      job: 'bg-green-500',
      training: 'bg-purple-500',
    }
    return colors[type as keyof typeof colors] || 'bg-gray-500'
  }

  const filteredResources = selectedType === 'all'
    ? mockResources
    : mockResources.filter((r) => r.type === selectedType)

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedType === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Resources
        </button>
        <button
          onClick={() => setSelectedType('shelter')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedType === 'shelter'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Shelters
        </button>
        <button
          onClick={() => setSelectedType('job')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedType === 'job'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Jobs
        </button>
        <button
          onClick={() => setSelectedType('training')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedType === 'training'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Training
        </button>
      </div>

      {/* Map Placeholder */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
        {/* This would be replaced with actual Google Maps component */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Map will be displayed here</p>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredResources.length} resources
            </p>
          </div>
        </div>

        {/* Resource Markers (simulated) */}
        {filteredResources.map((resource, index) => (
          <div
            key={resource.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + (index % 2) * 30}%`,
            }}
            onClick={() => setSelectedResource(resource.id)}
          >
            <div className={`w-8 h-8 ${getResourceColor(resource.type)} rounded-full flex items-center justify-center text-white shadow-lg`}>
              {getResourceIcon(resource.type)}
            </div>
            {selectedResource === resource.id && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl p-3 w-48 z-10">
                <h4 className="font-semibold text-gray-900 mb-1">{resource.name}</h4>
                <p className="text-sm text-gray-600 mb-2 capitalize">{resource.type}</p>
                <p className="text-xs text-green-600 font-medium">
                  {resource.available} spots available
                </p>
                <button className="btn btn-primary w-full mt-2 text-xs py-1">
                  Get Directions
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resource List */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedResource(resource.id)}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 ${getResourceColor(resource.type)} rounded-lg text-white`}>
                {getResourceIcon(resource.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{resource.name}</h3>
                <p className="text-sm text-gray-600 capitalize mb-2">{resource.type}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-medium">
                    {resource.available} available
                  </span>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                    <Navigation className="w-4 h-4" />
                    Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
