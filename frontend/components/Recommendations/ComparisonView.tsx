import { CheckCircle, X, MapPin, DollarSign, Bed } from 'lucide-react'

interface Props {
  items: any[]
  type: 'shelter' | 'job' | 'training'
}

export default function ComparisonView({ items, type }: Props) {
  if (items.length < 2) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-600">Select at least 2 items to compare</p>
      </div>
    )
  }

  const features = type === 'shelter'
    ? ['Match Score', 'Distance', 'Available Beds', 'Rating', 'Amenities']
    : ['Match Score', 'Distance', 'Salary', 'Job Type', 'Skills Match']

  return (
    <div className="card overflow-x-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Compare {type === 'shelter' ? 'Shelters' : 'Jobs'}
      </h3>
      
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Feature</th>
            {items.map((item) => (
              <th key={item.id} className="text-left py-3 px-4 font-semibold text-gray-900">
                {item.name || item.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Match Score */}
          <tr className="border-b hover:bg-gray-50">
            <td className="py-3 px-4 font-medium text-gray-700">Match Score</td>
            {items.map((item) => (
              <td key={item.id} className="py-3 px-4">
                <span className={`px-3 py-1 rounded-full font-bold ${
                  item.matchScore >= 80 ? 'bg-green-100 text-green-700' :
                  item.matchScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {item.matchScore}%
                </span>
              </td>
            ))}
          </tr>

          {/* Distance */}
          <tr className="border-b hover:bg-gray-50">
            <td className="py-3 px-4 font-medium text-gray-700">Distance</td>
            {items.map((item) => (
              <td key={item.id} className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{item.distance.toFixed(1)} km</span>
                </div>
              </td>
            ))}
          </tr>

          {type === 'shelter' ? (
            <>
              {/* Available Beds */}
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-700">Available Beds</td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4 text-gray-400" />
                      <span className={item.availableBeds > 10 ? 'text-green-600 font-semibold' : 'text-orange-600 font-semibold'}>
                        {item.availableBeds} / {item.totalBeds}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-700">Rating</td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-4">
                    <span>⭐ {item.rating.toFixed(1)}</span>
                  </td>
                ))}
              </tr>

              {/* Amenities */}
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-700">Amenities</td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {item.amenities.slice(0, 3).map((amenity: string) => (
                        <span key={amenity} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded capitalize">
                          {amenity}
                        </span>
                      ))}
                      {item.amenities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{item.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </>
          ) : (
            <>
              {/* Salary */}
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-700">Salary</td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">
                        ${item.salary.min}-${item.salary.max}/{item.salary.period}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Job Type */}
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-700">Job Type</td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-4">
                    <span className="capitalize">{item.jobType}</span>
                  </td>
                ))}
              </tr>

              {/* Skills Match */}
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-700">Skills Match</td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-4">
                    <span className="font-semibold text-green-600">
                      {item.skillsMatched.length} / {item.requirements.length}
                    </span>
                  </td>
                ))}
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}
