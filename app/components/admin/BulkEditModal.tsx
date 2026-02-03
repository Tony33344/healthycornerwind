'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { bulkUpdate } from '../../lib/utils/crud'

interface BulkEditField {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'checkbox' | 'date'
  options?: Array<{ value: string; label: string }>
  placeholder?: string
}

interface BulkEditModalProps {
  isOpen: boolean
  onClose: () => void
  table: string
  selectedIds: (string | number)[]
  fields: BulkEditField[]
  onSuccess?: () => void
}

export default function BulkEditModal({
  isOpen,
  onClose,
  table,
  selectedIds,
  fields,
  onSuccess
}: BulkEditModalProps) {
  const [updates, setUpdates] = useState<Record<string, any>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFieldChange = (key: string, value: any) => {
    setUpdates(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (Object.keys(updates).length === 0) {
      setError('Please select at least one field to update')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await bulkUpdate(table, selectedIds, updates)

      if (result.success) {
        onSuccess?.()
        onClose()
        setUpdates({})
      } else {
        setError(result.error || 'Failed to update records')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Bulk edit error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    setUpdates({})
    setError(null)
    onClose()
  }

  const renderField = (field: BulkEditField) => {
    const value = updates[field.key]

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
          />
        )

      case 'number':
        return (
          <input
            type="number"
            step="any"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value))}
            placeholder={field.placeholder}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
          />
        )

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
          >
            <option value="">Select...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
              className="w-4 h-4 text-lime-500 border-neutral-300 rounded focus:ring-lime-500"
            />
            <label className="ml-2 text-sm text-neutral-600">
              {field.placeholder || 'Enable'}
            </label>
          </div>
        )

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
          />
        )

      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Bulk Edit</h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    Update {selectedIds.length} selected {selectedIds.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                  >
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">Error</p>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                )}

                <div className="space-y-4">
                  <p className="text-sm text-neutral-600">
                    Select which fields you want to update. Only filled fields will be updated.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map((field) => (
                      <div key={field.key} className={field.type === 'checkbox' ? 'md:col-span-2' : ''}>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          {field.label}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-lime-50 border border-lime-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-lime-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-lime-800">
                      <p className="font-medium">Changes will be applied to:</p>
                      <ul className="mt-2 list-disc list-inside space-y-1">
                        <li>{selectedIds.length} {table} records</li>
                        <li>{Object.keys(updates).length} field{Object.keys(updates).length !== 1 ? 's' : ''} will be updated</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isProcessing}
                    className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing || Object.keys(updates).length === 0}
                    className="px-6 py-2 bg-lime-500 text-white hover:bg-lime-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Update {selectedIds.length} {selectedIds.length === 1 ? 'Item' : 'Items'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
