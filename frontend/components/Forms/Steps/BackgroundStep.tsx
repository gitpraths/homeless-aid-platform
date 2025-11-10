'use client'

import { useFormContext } from 'react-hook-form'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

const skillOptions = [
  'Construction',
  'Cooking',
  'Cleaning',
  'Retail',
  'Customer Service',
  'Warehouse',
  'Driving',
  'Computer Skills',
  'Carpentry',
  'Painting',
  'Plumbing',
  'Electrical',
  'Landscaping',
  'Security',
  'Janitorial',
]

export default function BackgroundStep() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext()

  const skills = watch('skills') || []
  const previousAddresses = watch('previousAddresses') || []
  const [newAddress, setNewAddress] = useState('')

  const toggleSkill = (skill: string) => {
    const currentSkills = skills
    if (currentSkills.includes(skill)) {
      setValue(
        'skills',
        currentSkills.filter((s: string) => s !== skill)
      )
    } else {
      setValue('skills', [...currentSkills, skill])
    }
  }

  const addAddress = () => {
    if (newAddress.trim()) {
      setValue('previousAddresses', [...previousAddresses, newAddress.trim()])
      setNewAddress('')
    }
  }

  const removeAddress = (index: number) => {
    setValue(
      'previousAddresses',
      previousAddresses.filter((_: string, i: number) => i !== index)
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Background</h2>
        <p className="text-gray-600">
          Tell us about their education, work history, and family situation.
        </p>
      </div>

      {/* Education Level */}
      <div>
        <label htmlFor="education" className="label">
          Education Level <span className="text-red-500">*</span>
        </label>
        <select
          id="education"
          className="input"
          {...register('education', { required: 'Education level is required' })}
        >
          <option value="">Select education level</option>
          <option value="no-formal">No Formal Education</option>
          <option value="primary">Primary School</option>
          <option value="secondary">Secondary School</option>
          <option value="high-school">High School/GED</option>
          <option value="some-college">Some College</option>
          <option value="associate">Associate Degree</option>
          <option value="bachelor">Bachelor's Degree</option>
          <option value="graduate">Graduate Degree</option>
        </select>
        {errors.education && (
          <p className="text-red-600 text-sm mt-1">
            {errors.education.message as string}
          </p>
        )}
      </div>

      {/* Work History */}
      <div>
        <label htmlFor="workHistory" className="label">
          Work History
        </label>
        <textarea
          id="workHistory"
          rows={4}
          className="input"
          placeholder="Describe previous jobs and work experience..."
          {...register('workHistory')}
        />
        <p className="text-sm text-gray-500 mt-1">
          Include job titles, companies, and duration
        </p>
      </div>

      {/* Skills */}
      <div>
        <label className="label">Skills</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {skillOptions.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                skills.includes(skill)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
        {skills.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">
              Selected Skills ({skills.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-white text-blue-700 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Family Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="familyStatus" className="label">
            Family Status
          </label>
          <select id="familyStatus" className="input" {...register('familyStatus')}>
            <option value="">Select status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
            <option value="separated">Separated</option>
          </select>
        </div>

        <div>
          <label htmlFor="dependents" className="label">
            Number of Dependents
          </label>
          <input
            id="dependents"
            type="number"
            min="0"
            className="input"
            placeholder="0"
            {...register('dependents', {
              min: { value: 0, message: 'Cannot be negative' },
            })}
          />
        </div>
      </div>

      {/* Previous Addresses */}
      <div>
        <label className="label">Previous Addresses</label>
        <div className="space-y-2 mb-3">
          {previousAddresses.map((address: string, index: number) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
            >
              <span className="flex-1 text-sm text-gray-700">{address}</span>
              <button
                type="button"
                onClick={() => removeAddress(index)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAddress())}
            className="input flex-1"
            placeholder="Enter previous address"
          />
          <button
            type="button"
            onClick={addAddress}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
