'use client'

import { useState, useEffect } from 'react'
import { Filter, SlidersHorizontal, Map as MapIcon, Grid, List, ArrowUpDown } from 'lucide-react'
import ShelterRecommendationCard from './ShelterRecommendationCard'
import JobRecommendationCard from './JobRecommendationCard'
import ComparisonView from './ComparisonView'
import LoadingState from './LoadingState'
import EmptyState from './EmptyState'
import toast from 'react-hot-toast'

interface Props {
  individualId: string
  type: 'shelter' | 'job' | 'training'
}

export default function RecommendationsView({ individualId, type }: Props) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compare'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  
  // Filters
  const [filters, setFilters] = useState({
    maxDistance: 10,
    minMatchScore: 0,
    amenities: [] as string[],
    availability: 'all',
  })
  
  // Sorting
  const [sortBy, setSortBy] = useState<'match' | 'distance' | 'rating'>('match')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchRecommendations()
  }, [individualId, type, filters, sortBy, sortOrder])

  const fetchRecommendations = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (type === 'shelter') {
        setRecommendations(mockShelterData)
      } else if (type === 'job') {
        setRecommendations(mockJobData)
      }
    } catch (error) {
      toast.error('Failed to load recommendations')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReserve = async (shelterId: string) => {
    toast.success('Bed reserved successfully!')
  }

  const handleApply = async (jobId: string) => {
    toast.success('Application submitted!')
  }

  const handleSave = async (itemId: string) => {
    toast.success('Saved for later')
  }

  const handleViewMap = (item: any) => {
    // Open map view
    toast.info('Opening map view...')
  }

  const toggleSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const filteredRecommendations = recommendations
    .filter(item => {
      if (filters.maxDistance && item.distance > filters.maxDistance) return false
      if (filters.minMatchScore && item.matchScore < filters.minMatchScore) return false
      if (filters.amenities.length > 0 && type === 'shelter') {
        if (!filters.amenities.every(a => item.amenities.includes(a))) return false
      }
      return true
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy === 'match') comparison = b.matchScore - a.matchScore
      else if (sortBy === 'distance') comparison = a.distance - b.distance
      else if (sortBy === 'rating') comparison = b.rating - a.rating
      
      return sortOrder === 'asc' ? -comparison : comparison
    })

  if (isLoading) {
    return <LoadingState type={type} />
  }

  if (filteredRecommendations.length === 0) {
    return <EmptyState type={type} onReset={() => setFilters({
      maxDistance: 10,
      minMatchScore: 0,
      amenities: [],
      availability: 'all',
    })} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {type === 'shelter' ? 'Shelter' : type === 'job' ? 'Job' : 'Training'} Recommendations
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredRecommendations.length} matches found
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('compare')}
            disabled={selectedItems.length < 2}
            className={`p-2 rounded-lg ${viewMode === 'compare' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'} disabled:opacity-50`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {(filters.amenities.length > 0 || filters.minMatchScore > 0) && (
            <span className="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
              {filters.amenities.length + (filters.minMatchScore > 0 ? 1 : 0)}
            </span>
          )}
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="match">Sort by Match Score</option>
          <option value="distance">Sort by Distance</option>
          <option value="rating">Sort by Rating</option>
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="btn btn-secondary flex items-center gap-2"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </button>

        <button className="btn btn-secondary flex items-center gap-2">
          <MapIcon className="w-4 h-4" />
          View on Map
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card animate-fadeIn">
          <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="label">Max Distance (km)</label>
              <input
                type="range"
                min="1"
                max="50"
                value={filters.maxDistance}
                onChange={(e) => setFilters({ ...filters, maxDistance: Number(e.target.value) })}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-1">{filters.maxDistance} km</p>
            </div>
            
            <div>
              <label className="label">Min Match Score (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minMatchScore}
                onChange={(e) => setFilters({ ...filters, minMatchScore: Number(e.target.value) })}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-1">{filters.minMatchScore}%</p>
            </div>

            {type === 'shelter' && (
              <div>
                <label className="label">Amenities</label>
                <div className="space-y-2">
                  {['meals', 'medical', 'wifi', 'accessible', 'family'].map(amenity => (
                    <label key={amenity} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, amenities: [...filters.amenities, amenity] })
                          } else {
                            setFilters({ ...filters, amenities: filters.amenities.filter(a => a !== amenity) })
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations Grid/List */}
      {viewMode === 'compare' && selectedItems.length >= 2 ? (
        <ComparisonView
          items={filteredRecommendations.filter(r => selectedItems.includes(r.id))}
          type={type}
        />
      ) : (
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredRecommendations.slice(0, 5).map((item) => (
            <div key={item.id} className="relative">
              {viewMode === 'grid' && (
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelection(item.id)}
                  className="absolute top-4 left-4 z-10 w-5 h-5 rounded"
                />
              )}
              {type === 'shelter' ? (
                <ShelterRecommendationCard
                  shelter={item}
                  onReserve={handleReserve}
                  onViewMap={handleViewMap}
                />
              ) : (
                <JobRecommendationCard
                  job={item}
                  onApply={handleApply}
                  onSave={handleSave}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Mock data
const mockShelterData = [
  {
    id: '1',
    name: 'Hope Shelter',
    distance: 2.3,
    availableBeds: 15,
    totalBeds: 50,
    amenities: ['meals', 'medical', 'wifi', 'accessible'],
    matchScore: 92,
    matchReasons: [
      'Only 2.3 km away from current location',
      'Has medical facilities (needed for health conditions)',
      'Family rooms available',
      'High success rate (87%) for similar profiles',
      'Wheelchair accessible',
    ],
    address: '123 Main St, Downtown',
    rating: 4.5,
    successRate: 87,
    location: { lat: 40.7580, lon: -73.9855 },
  },
  // Add more mock data...
]

const mockJobData = [
  {
    id: '1',
    title: 'Construction Worker',
    employer: 'BuildCo Inc.',
    salary: { min: 15, max: 22, period: 'hour' },
    distance: 3.5,
    jobType: 'full-time',
    requirements: ['Construction', 'Physical Labor', 'Safety Training'],
    matchScore: 85,
    matchReasons: [
      'Your construction skills match perfectly',
      'Close to your location (3.5 km)',
      'Competitive hourly rate',
      'No advanced education required',
      'Immediate start available',
    ],
    skillsMatched: ['Construction', 'Physical Labor'],
    skillsNeeded: ['Safety Training'],
    location: 'Downtown',
    postedDate: '2024-11-08',
  },
  // Add more mock data...
]
