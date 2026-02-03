'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

interface AutoSaveOptions {
  onSave: (data: any) => Promise<void>
  interval?: number // milliseconds, default 30000 (30s)
  enabled?: boolean
  debounce?: number // milliseconds to wait after last change
}

interface AutoSaveState {
  isSaving: boolean
  lastSaved: Date | null
  error: Error | null
}

export function useAutoSave<T>(
  data: T,
  options: AutoSaveOptions
): AutoSaveState {
  const {
    onSave,
    interval = 30000, // 30 seconds
    enabled = true,
    debounce = 2000 // 2 seconds
  } = options

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const dataRef = useRef<T>(data)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hasChangesRef = useRef(false)

  // Update data reference when data changes
  useEffect(() => {
    const hasChanged = JSON.stringify(dataRef.current) !== JSON.stringify(data)
    if (hasChanged) {
      dataRef.current = data
      hasChangesRef.current = true
      
      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Set new debounce timer for immediate save after user stops typing
      if (enabled && debounce > 0) {
        debounceTimerRef.current = setTimeout(() => {
          performSave()
        }, debounce)
      }
    }
  }, [data, enabled, debounce])

  const performSave = useCallback(async () => {
    if (!hasChangesRef.current || isSaving) return

    setIsSaving(true)
    setError(null)

    try {
      await onSave(dataRef.current)
      setLastSaved(new Date())
      hasChangesRef.current = false
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Save failed'))
      console.error('Auto-save error:', err)
    } finally {
      setIsSaving(false)
    }
  }, [isSaving, onSave])

  // Set up interval-based auto-save
  useEffect(() => {
    if (!enabled) return

    timerRef.current = setInterval(() => {
      if (hasChangesRef.current && !isSaving) {
        performSave()
      }
    }, interval)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [enabled, interval, isSaving, performSave])

  // Save on unmount if there are unsaved changes
  useEffect(() => {
    return () => {
      if (hasChangesRef.current && !isSaving) {
        // Fire and forget - component is unmounting
        onSave(dataRef.current).catch(console.error)
      }
    }
  }, [])

  return {
    isSaving,
    lastSaved,
    error
  }
}

// Format last saved time for display
export function formatLastSaved(lastSaved: Date | null): string {
  if (!lastSaved) return 'Never saved'

  const now = new Date()
  const diffMs = now.getTime() - lastSaved.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)

  if (diffSec < 10) return 'Just now'
  if (diffSec < 60) return `${diffSec} seconds ago`
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
  
  return lastSaved.toLocaleString()
}

