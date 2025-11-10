import { Search, RefreshCw } from 'lucide-react'

interface Props {
  type: 'shelter' | 'job' | 'training'
  onReset: () => void
}

export default function EmptyState({ type, onReset }: Props) {
  const messages = {
    shelter: {
      title: 'No Shelters Found',
      description: 'No shelters match your current filters. Try adjusting your search criteria.',
    },
    job: {
      title: 'No Jobs Found',
      description: 'No job opportunities match your profile. Try expanding your search.',
    },
    training: {
      title: 'No Training Programs Found',
      description: 'No training programs match your criteria. Try different filters.',
    },
  }

  const message = messages[type]

  return (
    <div className="card text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {message.title}
        </h3>
        <p className="text-gray-600 mb-6">
          {message.description}
        </p>
        <button
          onClick={onReset}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reset Filters
        </button>
      </div>
    </div>
  )
}
