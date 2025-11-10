'use client'

import { useState } from 'react'
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock,
  CheckCircle,
  Info,
  Bookmark,
  ExternalLink
} from 'lucide-react'

interface JobRecommendation {
  id: string
  title: string
  employer: string
  logo?: string
  salary: { min: number; max: number; period: string }
  distance: number
  jobType: string
  requirements: string[]
  matchScore: number
  matchReasons: string[]
  skillsMatched: string[]
  skillsNeeded: string[]
  location: string
  postedDate: string
}

interface Props {
  job: JobRecommendation
  onApply: (jobId: string) => void
  onSave: (jobId: string) => void
}

export default function JobRecommendationCard({ job, onApply, onSave }: Props) {
  const [showExplanation, setShowExplanation] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleApply = async () => {
    setIsApplying(true)
    await onApply(job.id)
    setIsApplying(false)
  }

  const handleSave = async () => {
    setIsSaved(!isSaved)
    await onSave(job.id)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-orange-600 bg-orange-50'
  }

  const formatSalary = () => {
    const { min, max, period } = job.salary
    if (min === max) return `$${min.toLocaleString()}/${period}`
    return `$${min.toLocaleString()} - $${max.toLocaleString()}/${period}`
  }

  return (
    <div className="card hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Logo */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            {job.logo ? (
              <img src={job.logo} alt={job.employer} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Briefcase className="w-6 h-6 text-white" />
            )}
          </div>
          
          {/* Title & Employer */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.employer}</p>
          </div>
        </div>

        {/* Match Score */}
        <div className={`px-3 py-1 rounded-lg font-bold text-sm ${getMatchScoreColor(job.matchScore)}`}>
          {job.matchScore}%
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium">{formatSalary()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{job.distance.toFixed(1)} km away</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="capitalize">{job.jobType}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Briefcase className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
      </div>

      {/* Skills Match */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Skills Match</p>
          <span className="text-xs text-gray-500">
            {job.skillsMatched.length} of {job.requirements.length} required
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {job.skillsMatched.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium"
            >
              ✓ {skill}
            </span>
          ))}
          {job.skillsNeeded.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Match Explanation */}
      <div className="mb-4">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <Info className="w-4 h-4" />
          {showExplanation ? 'Hide' : 'Show'} why recommended
        </button>
        
        {showExplanation && (
          <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-2 animate-fadeIn">
            <p className="text-sm font-semibold text-purple-900 mb-2">
              This job is recommended because:
            </p>
            {job.matchReasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-purple-800">{reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          disabled={isApplying}
          className="btn btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {isApplying ? (
            <>
              <div className="spinner" />
              Applying...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4" />
              Apply Now
            </>
          )}
        </button>
        <button
          onClick={handleSave}
          className={`btn ${isSaved ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  )
}
