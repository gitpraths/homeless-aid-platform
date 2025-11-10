'use client'

import { useFormContext } from 'react-hook-form'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

const commonConditions = [
  'Diabetes',
  'Hypertension',
  'Asthma',
  'Heart Disease',
  'Mental Health Issues',
  'Substance Abuse',
  'Chronic Pain',
  'Arthritis',
  'Depression',
  'Anxiety',
  'PTSD',
]

const commonDisabilities = [
  'Mobility Issues',
  'Visual Impairment',
  'Hearing Impairment',
  'Cognitive Disability',
  'Speech Impairment',
  'Chronic Illness',
]

export default function HealthAssessmentStep() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext()

  const medicalConditions = watch('medicalConditions') || []
  const disabilities = watch('disabilities') || []
  const medications = watch('medications') || []
  const [newMedication, setNewMedication] = useState('')

  const toggleCondition = (condition: string) => {
    const current = medicalConditions
    if (current.includes(condition)) {
      setValue(
        'medicalConditions',
        current.filter((c: string) => c !== condition)
      )
    } else {
      setValue('medicalConditions', [...current, condition])
    }
  }

  const toggleDisability = (disability: string) => {
    const current = disabilities
    if (current.includes(disability)) {
      setValue(
        'disabilities',
        current.filter((d: string) => d !== disability)
      )
    } else {
      setValue('disabilities', [...current, disability])
    }
  }

  const addMedication = () => {
    if (newMedication.trim()) {
      setValue('medications', [...medications, newMedication.trim()])
      setNewMedication('')
    }
  }

  const removeMedication = (index: number) => {
    setValue(
      'medications',
      medications.filter((_: string, i: number) => i !== index)
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Health Assessment
        </h2>
        <p className="text-gray-600">
          Understanding health needs helps us provide better support.
        </p>
      </div>

      {/* Health Status */}
      <div>
        <label htmlFor="healthStatus" className="label">
          Overall Health Status <span className="text-red-500">*</span>
        </label>
        <select
          id="healthStatus"
          className="input"
          {...register('healthStatus', {
            required: 'Health status is required',
          })}
        >
          <option value="">Select health status</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
          <option value="critical">Critical</option>
        </select>
        {errors.healthStatus && (
          <p className="text-red-600 text-sm mt-1">
            {errors.healthStatus.message as string}
          </p>
        )}
      </div>

      {/* Medical Conditions */}
      <div>
        <label className="label">Medical Conditions</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {commonConditions.map((condition) => (
            <button
              key={condition}
              type="button"
              onClick={() => toggleCondition(condition)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                medicalConditions.includes(condition)
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {condition}
            </button>
          ))}
        </div>
        {medicalConditions.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-900 mb-2">
              Selected Conditions ({medicalConditions.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {medicalConditions.map((condition: string) => (
                <span
                  key={condition}
                  className="px-3 py-1 bg-white text-red-700 text-sm rounded-full"
                >
                  {condition}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Medications */}
      <div>
        <label className="label">Current Medications</label>
        <div className="space-y-2 mb-3">
          {medications.map((medication: string, index: number) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg"
            >
              <span className="flex-1 text-sm text-gray-700">{medication}</span>
              <button
                type="button"
                onClick={() => removeMedication(index)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' && (e.preventDefault(), addMedication())
            }
            className="input flex-1"
            placeholder="Enter medication name"
          />
          <button
            type="button"
            onClick={addMedication}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Disabilities */}
      <div>
        <label className="label">Disabilities or Special Needs</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {commonDisabilities.map((disability) => (
            <button
              key={disability}
              type="button"
              onClick={() => toggleDisability(disability)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                disabilities.includes(disability)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {disability}
            </button>
          ))}
        </div>
      </div>

      {/* Special Needs Description */}
      <div>
        <label htmlFor="specialNeeds" className="label">
          Additional Special Needs or Notes
        </label>
        <textarea
          id="specialNeeds"
          rows={4}
          className="input"
          placeholder="Describe any additional health concerns, allergies, or special requirements..."
          {...register('specialNeeds')}
        />
        <p className="text-sm text-gray-500 mt-1">
          Include allergies, dietary restrictions, mobility aids needed, etc.
        </p>
      </div>

      {/* Emergency Contact */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-900 mb-2">Important Note</h3>
        <p className="text-sm text-yellow-800">
          If the individual has critical health conditions requiring immediate
          attention, please ensure they receive medical care before completing
          this registration.
        </p>
      </div>
    </div>
  )
}
