'use client'

import { useFormContext } from 'react-hook-form'

const immediateNeedsOptions = [
  'Shelter',
  'Food',
  'Medical Care',
  'Clothing',
  'Transportation',
  'Phone',
  'ID/Documents',
  'Hygiene Items',
  'Emergency Cash',
]

const longTermGoalsOptions = [
  'Permanent Housing',
  'Employment',
  'Job Training',
  'Education',
  'Healthcare Access',
  'Mental Health Support',
  'Substance Abuse Treatment',
  'Family Reunification',
  'Legal Assistance',
]

export default function NeedsAssessmentStep() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext()

  const immediateNeeds = watch('immediateNeeds') || []
  const longTermGoals = watch('longTermGoals') || []

  const toggleImmediateNeed = (need: string) => {
    const current = immediateNeeds
    if (current.includes(need)) {
      setValue(
        'immediateNeeds',
        current.filter((n: string) => n !== need)
      )
    } else {
      setValue('immediateNeeds', [...current, need])
    }
  }

  const toggleLongTermGoal = (goal: string) => {
    const current = longTermGoals
    if (current.includes(goal)) {
      setValue(
        'longTermGoals',
        current.filter((g: string) => g !== goal)
      )
    } else {
      setValue('longTermGoals', [...current, goal])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Needs Assessment
        </h2>
        <p className="text-gray-600">
          Help us understand their immediate needs and long-term goals.
        </p>
      </div>

      {/* Immediate Needs */}
      <div>
        <label className="label">
          Immediate Needs <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Select all that apply (at least one required)
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {immediateNeedsOptions.map((need) => (
            <button
              key={need}
              type="button"
              onClick={() => toggleImmediateNeed(need)}
              className={`p-4 rounded-lg text-sm font-medium transition-all border-2 ${
                immediateNeeds.includes(need)
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
              }`}
            >
              {need}
            </button>
          ))}
        </div>
        {immediateNeeds.length === 0 && (
          <p className="text-red-600 text-sm mt-2">
            Please select at least one immediate need
          </p>
        )}
        {immediateNeeds.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-900">
              {immediateNeeds.length} immediate need(s) selected
            </p>
          </div>
        )}
      </div>

      {/* Long-term Goals */}
      <div>
        <label className="label">Long-term Goals</label>
        <p className="text-sm text-gray-600 mb-3">
          Select all that apply
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {longTermGoalsOptions.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => toggleLongTermGoal(goal)}
              className={`p-4 rounded-lg text-sm font-medium transition-all border-2 ${
                longTermGoals.includes(goal)
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
        {longTermGoals.length > 0 && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900">
              {longTermGoals.length} long-term goal(s) selected
            </p>
          </div>
        )}
      </div>

      {/* Preferences */}
      <div>
        <label htmlFor="preferences" className="label">
          Preferences
        </label>
        <textarea
          id="preferences"
          rows={4}
          className="input"
          placeholder="Any specific preferences for shelter, job type, location, etc..."
          {...register('preferences')}
        />
        <p className="text-sm text-gray-500 mt-1">
          Include location preferences, work schedule preferences, dietary needs, etc.
        </p>
      </div>

      {/* Constraints */}
      <div>
        <label htmlFor="constraints" className="label">
          Constraints or Limitations
        </label>
        <textarea
          id="constraints"
          rows={4}
          className="input"
          placeholder="Any constraints that might affect placement or services..."
          {...register('constraints')}
        />
        <p className="text-sm text-gray-500 mt-1">
          Include transportation limitations, time constraints, legal restrictions, etc.
        </p>
      </div>

      {/* Priority Assessment */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Priority Assessment</h3>
        <p className="text-sm text-blue-800 mb-3">
          Based on the selected needs, the system will automatically calculate a
          priority score to help with resource allocation.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-900">Immediate Needs:</span>
            <span className="ml-2 text-blue-700">{immediateNeeds.length}</span>
          </div>
          <div>
            <span className="font-medium text-blue-900">Long-term Goals:</span>
            <span className="ml-2 text-blue-700">{longTermGoals.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
