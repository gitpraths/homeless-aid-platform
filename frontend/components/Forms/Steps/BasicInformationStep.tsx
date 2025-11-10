'use client'

import { useFormContext } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Camera, MapPin, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BasicInformationStep() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext()

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isCapturingLocation, setIsCapturingLocation] = useState(false)
  const location = watch('location')

  // Auto-capture GPS location on mount
  useEffect(() => {
    if (!location) {
      captureLocation()
    }
  }, [])

  const captureLocation = () => {
    setIsCapturingLocation(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('location', {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
          toast.success('Location captured')
          setIsCapturingLocation(false)
        },
        (error) => {
          toast.error('Failed to capture location')
          console.error(error)
          setIsCapturingLocation(false)
        }
      )
    } else {
      toast.error('Geolocation not supported')
      setIsCapturingLocation(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('photo', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600">
          Let's start with the essential details about the individual.
        </p>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="label">Photo (Optional)</label>
        <div className="flex items-center gap-4">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-24 h-24 rounded-lg object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div>
            <label className="btn btn-secondary cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG or GIF (max 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="label">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          className="input"
          placeholder="Enter full name"
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">
            {errors.name.message as string}
          </p>
        )}
      </div>

      {/* Age and Gender */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="age" className="label">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            id="age"
            type="number"
            className="input"
            placeholder="Enter age"
            {...register('age', {
              required: 'Age is required',
              min: { value: 0, message: 'Age must be positive' },
              max: { value: 120, message: 'Invalid age' },
            })}
          />
          {errors.age && (
            <p className="text-red-600 text-sm mt-1">
              {errors.age.message as string}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="label">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            className="input"
            {...register('gender', { required: 'Gender is required' })}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          {errors.gender && (
            <p className="text-red-600 text-sm mt-1">
              {errors.gender.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Contact */}
      <div>
        <label htmlFor="contact" className="label">
          Contact Number (Optional)
        </label>
        <input
          id="contact"
          type="tel"
          className="input"
          placeholder="Enter phone number"
          {...register('contact', {
            pattern: {
              value: /^[\d\s\-\+\(\)]+$/,
              message: 'Invalid phone number',
            },
          })}
        />
        {errors.contact && (
          <p className="text-red-600 text-sm mt-1">
            {errors.contact.message as string}
          </p>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="label">
          Current Location <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4">
          {location ? (
            <div className="flex-1 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-900 mb-1">
                Location Captured
              </p>
              <p className="text-xs text-green-700">
                Lat: {location.lat.toFixed(6)}, Lon: {location.lon.toFixed(6)}
              </p>
            </div>
          ) : (
            <div className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">No location captured yet</p>
            </div>
          )}
          <button
            type="button"
            onClick={captureLocation}
            disabled={isCapturingLocation}
            className="btn btn-primary flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            {isCapturingLocation ? 'Capturing...' : 'Capture GPS'}
          </button>
        </div>
        {!location && (
          <p className="text-red-600 text-sm mt-1">Location is required</p>
        )}
      </div>
    </div>
  )
}
