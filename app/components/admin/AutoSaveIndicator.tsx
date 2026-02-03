'use client'

import { formatLastSaved } from '../../hooks/useAutoSave'

interface AutoSaveIndicatorProps {
  isSaving: boolean
  lastSaved: Date | null
  error: Error | null
}

export default function AutoSaveIndicator({
  isSaving,
  lastSaved,
  error
}: AutoSaveIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {isSaving ? (
        <>
          <div className="w-4 h-4 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-neutral-600">Saving...</span>
        </>
      ) : error ? (
        <>
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-red-600">Save failed</span>
        </>
      ) : lastSaved ? (
        <>
          <svg className="w-4 h-4 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-neutral-600">
            Saved {formatLastSaved(lastSaved)}
          </span>
        </>
      ) : (
        <span className="text-neutral-500">Not saved yet</span>
      )}
    </div>
  )
}
