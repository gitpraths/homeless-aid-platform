'use client'

import { useFormContext } from 'react-hook-form'
import { useState } from 'react'
import { Upload, File, X, CheckCircle } from 'lucide-react'

export default function DocumentsStep() {
  const { setValue, watch } = useFormContext()
  
  const [idProof, setIdProof] = useState<File | null>(null)
  const [medicalRecords, setMedicalRecords] = useState<File[]>([])
  const [otherDocuments, setOtherDocuments] = useState<File[]>([])

  const handleIdProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIdProof(file)
      setValue('documents.idProof', file)
    }
  }

  const handleMedicalRecordsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setMedicalRecords([...medicalRecords, ...files])
    setValue('documents.medicalRecords', [...medicalRecords, ...files])
  }

  const handleOtherDocumentsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setOtherDocuments([...otherDocuments, ...files])
    setValue('documents.otherDocuments', [...otherDocuments, ...files])
  }

  const removeFile = (type: 'medical' | 'other', index: number) => {
    if (type === 'medical') {
      const updated = medicalRecords.filter((_, i) => i !== index)
      setMedicalRecords(updated)
      setValue('documents.medicalRecords', updated)
    } else {
      const updated = otherDocuments.filter((_, i) => i !== index)
      setOtherDocuments(updated)
      setValue('documents.otherDocuments', updated)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Documents</h2>
        <p className="text-gray-600">
          Upload any available identification or relevant documents.
        </p>
      </div>

      {/* ID Proof */}
      <div>
        <label className="label">ID Proof (Optional)</label>
        <p className="text-sm text-gray-600 mb-3">
          Aadhaar, Voter ID, Passport, Driver's License, or any government-issued ID
        </p>
        
        {idProof ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">{idProof.name}</p>
                  <p className="text-sm text-green-700">
                    {formatFileSize(idProof.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIdProof(null)
                  setValue('documents.idProof', null)
                }}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 hover:bg-primary-50 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Click to upload ID proof
              </p>
              <p className="text-xs text-gray-500">
                PDF, JPG, PNG (max 10MB)
              </p>
            </div>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleIdProofUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Medical Records */}
      <div>
        <label className="label">Medical Records (Optional)</label>
        <p className="text-sm text-gray-600 mb-3">
          Prescriptions, medical reports, test results, etc.
        </p>
        
        {medicalRecords.length > 0 && (
          <div className="space-y-2 mb-3">
            {medicalRecords.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">{file.name}</p>
                    <p className="text-xs text-blue-700">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile('medical', index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <label className="block">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Upload medical records
            </p>
            <p className="text-xs text-gray-500">
              Multiple files allowed (PDF, JPG, PNG)
            </p>
          </div>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={handleMedicalRecordsUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Other Documents */}
      <div>
        <label className="label">Other Documents (Optional)</label>
        <p className="text-sm text-gray-600 mb-3">
          Any other relevant documents (certificates, letters, etc.)
        </p>
        
        {otherDocuments.length > 0 && (
          <div className="space-y-2 mb-3">
            {otherDocuments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">{file.name}</p>
                    <p className="text-xs text-purple-700">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile('other', index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <label className="block">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Upload other documents
            </p>
            <p className="text-xs text-gray-500">
              Multiple files allowed (PDF, JPG, PNG)
            </p>
          </div>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={handleOtherDocumentsUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Summary */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Documents Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">ID Proof:</span>
            <span className="font-medium text-gray-900">
              {idProof ? '1 file' : 'Not uploaded'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Medical Records:</span>
            <span className="font-medium text-gray-900">
              {medicalRecords.length} file(s)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Other Documents:</span>
            <span className="font-medium text-gray-900">
              {otherDocuments.length} file(s)
            </span>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-900 mb-2">Important Note</h3>
        <p className="text-sm text-yellow-800">
          All documents are optional but highly recommended. Having proper
          identification and medical records helps us provide better assistance
          and speeds up the placement process.
        </p>
      </div>
    </div>
  )
}
