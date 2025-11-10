'use client'

import { useState } from 'react'
import { 
  MapPin, 
  Bed, 
  Heart, 
  Utensils, 
  Wifi, 
  Accessibility,
  Users,
  CheckCircle,
  Info,
  Navigation
} from 'lucide-react'
import Image from 'next/image'

interface ShelterRecommendation {
  id: string
  name: string
  photo?: string
  distance: number
  availableBeds: number
  totalBeds: number
  amenities: string[]
  matchScore: number
  matchReasons: string[]
  address: string
  rating: number
  successRate: number
  location: { lat: number; lon: number }
}

interface Props {
  shelter: ShelterRecommendation
  onReserve: (shelterId: string) => void
  onViewMap: (shelter: ShelterRecommendation) => void
}

const amenityIcons: Record<string, any> = {
  meals: Utensils,
  medical: Heart,
  wifi: Wifi,
  accessible: Accessibility,
  family: Users,
}

export default function ShelterRecommendationCard({ shelter, onReserve, onViewMap }: Props) {
  const [showExplanation, setShowExplanation] = useState(false)
  const [isReserving, setIsReserving] = useState(false)

  const handleReserve = async () => {
    setIsReserving(true)
    await onReserve(shelter.id)
    setIsReserving(false)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-orange-600 bg-orange-50'
  }

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage > 30) return 'text-green-600'
    if (percentage > 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="card hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 -mx-6 -mt-6 mb-4">
        {shelter.photo ? (
          <Image
            src={shelter.photo}
            alt={shelter.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600">
            <Bed className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        
        {/* Match Score Badge */}
        <div className={`absolute top-4 right-4 px-3 py-2 rounded-lg font-bold ${getMatchScoreColor(shelter.matchScore)}`}>
          {shelter.matchScore}% Match
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{shelter.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{shelter.distance.toFixed(1)} km away</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              ⭐ {shelter.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Available Beds</span>
          </div>
          <span className={`text-lg font-bold ${getAvailabilityColor(shelter.availableBeds, shelter.totalBeds)}`}>
            {shelter.availableBeds} / {shelter.totalBeds}
          </span>
        </div>

        {/* Amenities */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {shelter.amenities.map((amenity) => {
              const Icon = amenityIcons[amenity] || CheckCircle
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                >
                  <Icon className="w-3 h-3" />
                  <span className="capitalize">{amenity}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Match Explanation */}
        <div>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            <Info className="w-4 h-4" />
            {showExplanation ? 'Hide' : 'Show'} why recommended
          </button>
          
          {showExplanation && (
            <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2 animate-fadeIn">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                This shelter is recommended because:
              </p>
              {shelter.matchReasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-800">{reason}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-blue-200 mt-3">
                <p className="text-xs text-blue-700">
                  Success rate: <span className="font-semibold">{shelter.successRate}%</span> for similar profiles
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleReserve}
            disabled={isReserving || shelter.availableBeds === 0}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isReserving ? (
              <>
                <div className="spinner" />
                Reserving...
              </>
            ) : (
              <>
                <Bed className="w-4 h-4" />
                Reserve Bed
              </>
            )}
          </button>
          <button
            onClick={() => onViewMap(shelter)}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Map
          </button>
        </div>
      </div>
    </div>
  )
}
