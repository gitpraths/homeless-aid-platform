'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { 
  User, 
  Briefcase, 
  Heart, 
  Target, 
  FileText, 
  Check,
  Save,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import BasicInformationStep from './Steps/BasicInformationStep'
import BackgroundStep from './Steps/BackgroundStep'
import HealthAssessmentStep from './Steps/HealthAssessmentStep'
import NeedsAssessmentStep from './Steps/NeedsAssessmentStep'
import DocumentsStep from './Steps/DocumentsStep'

interface FormData {
  // Basic Information
  name: string
  age: number
  gender: string
  contact?: string
  photo?: File
  location: { lat: number; lon: number }
  
  // Background
  education: string
  workHistory: string
  skills: string[]
  familyStatus: string
  dependents: number
  previousAddresses: string[]
  
  // Health Assessment
  healthStatus: string
  medicalConditions: string[]
  medications: string[]
  disabilities: string[]
  specialNeeds: string
  
  // Needs Assessment
  immediateNeeds: string[]
  longTermGoals: string[]
  preferences: string
  constraints: string
  
  // Documents
  documents: {
    idProof?: File
    medicalRecords?: File[]
    otherDocuments?: File[]
  }
}

const steps = [
  { id: 1, name: 'Basic Info', icon: User, component: BasicInformationStep },
  { id: 2, name: 'Background', icon: Briefcase, component: BackgroundStep },
  { id: 3, name: 'Health', icon: Heart, component: HealthAssessmentStep },
  { id: 4, name: 'Needs', icon: Target, component: NeedsAssessmentStep },
  { id: 5, name: 'Documents', icon: FileText, component: DocumentsStep },
]

const DRAFT_KEY = 'individual_profile_draft'
const AUTO_SAVE_INTERVAL = 30000 // 30 seconds

export default function ProfileFormWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const methods = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      skills: [],
      previousAddresses: [],
      medicalConditions: [],
      medications: [],
      disabilities: [],
      immediateNeeds: [],
      longTermGoals: [],
      documents: {},
    },
  })

  const { handleSubmit, watch, reset } = methods

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY)
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft)
        reset(parsedDraft.data)
        setCurrentStep(parsedDraft.step)
        setLastSaved(new Date(parsedDraft.timestamp))
        toast.success('Draft loaded')
      } catch (error) {
        console.error('Failed to load draft:', error)
      }
    }
  }, [reset])

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft()
    }, AUTO_SAVE_INTERVAL)

    return () => clearInterval(interval)
  }, [watch])

  // Save draft to localStorage
  const saveDraft = () => {
    const formData = watch()
    const draft = {
      data: formData,
      step: currentStep,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    setLastSaved(new Date())
  }

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    setLastSaved(null)
  }

  // Handle step navigation
  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step)
      saveDraft()
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      saveDraft()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Replace with actual API call
      console.log('Submitting form:', data)
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      toast.success('Individual registered successfully!')
      clearDraft()
      router.push('/dashboard/volunteer')
    } catch (error) {
      toast.error('Failed to register individual')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentStepComponent = steps[currentStep - 1].component
  const progress = (currentStep / steps.length) * 100

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="card mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                Step {currentStep} of {steps.length}
              </h3>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white scale-110'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </button>
                  <span
                    className={`text-xs font-medium text-center ${
                      isActive ? 'text-primary-600' : 'text-gray-600'
                    }`}
                  >
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute w-full h-0.5 bg-gray-200 top-6 left-1/2 -z-10" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Auto-save indicator */}
        {lastSaved && (
          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            <button
              type="button"
              onClick={saveDraft}
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
          </div>
        )}

        {/* Current Step Content */}
        <div className="card mb-6">
          <CurrentStepComponent />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={previousStep}
            disabled={currentStep === 1}
            className="btn btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveDraft}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Draft
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary flex items-center gap-2 min-w-[150px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Submit
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
