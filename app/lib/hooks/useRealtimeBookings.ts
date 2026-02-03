'use client'

import { useEffect, useState, useRef } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabase/client'
import { Booking } from '../../types/schedule'

interface UseRealtimeBookingsOptions {
  scheduleIds?: string[]
  autoSubscribe?: boolean
}

interface UseRealtimeBookingsReturn {
  bookings: Booking[]
  isConnected: boolean
  error: string | null
  refreshBookings: () => Promise<void>
  subscribe: () => void
  unsubscribe: () => void
}

export function useRealtimeBookings({
  scheduleIds = [],
  autoSubscribe = true
}: UseRealtimeBookingsOptions = {}): UseRealtimeBookingsReturn {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  // Fetch initial bookings
  const fetchBookings = async () => {
    try {
      setError(null)
      let query = supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      // Filter by schedule IDs if provided
      if (scheduleIds.length > 0) {
        query = query.in('schedule_id', scheduleIds)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        console.error('Error fetching bookings:', fetchError)
        setError(fetchError.message)
        return
      }

      setBookings(data || [])
    } catch (err) {
      console.error('Unexpected error fetching bookings:', err)
      setError('Failed to fetch bookings')
    }
  }

  // Subscribe to real-time updates
  const subscribe = () => {
    if (channelRef.current) {
      console.log('Already subscribed to bookings')
      return
    }

    try {
      const channelName = scheduleIds.length > 0 
        ? `bookings:${scheduleIds.join(',')}` 
        : 'bookings:all'

      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings',
            filter: scheduleIds.length > 0 
              ? `schedule_id=in.(${scheduleIds.join(',')})` 
              : undefined
          },
          (payload) => {
            console.log('Booking change received:', payload)
            
            switch (payload.eventType) {
              case 'INSERT':
                setBookings(prev => {
                  // Check if this booking already exists (prevent duplicates)
                  if (prev.some(b => b.id === payload.new.id)) {
                    return prev
                  }
                  return [payload.new as Booking, ...prev]
                })
                break
                
              case 'UPDATE':
                setBookings(prev => 
                  prev.map(booking => 
                    booking.id === payload.new.id 
                      ? payload.new as Booking 
                      : booking
                  )
                )
                break
                
              case 'DELETE':
                setBookings(prev => 
                  prev.filter(booking => booking.id !== payload.old.id)
                )
                break
            }
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status)
          if (status === 'SUBSCRIBED') {
            setIsConnected(true)
            setError(null)
          } else if (status === 'CHANNEL_ERROR') {
            setIsConnected(false)
            setError('Connection error')
          } else if (status === 'TIMED_OUT') {
            setIsConnected(false)
            setError('Connection timeout')
          }
        })

      channelRef.current = channel
    } catch (err) {
      console.error('Error setting up subscription:', err)
      setError('Failed to setup real-time connection')
      setIsConnected(false)
    }
  }

  // Unsubscribe from real-time updates
  const unsubscribe = () => {
    if (channelRef.current) {
      console.log('Unsubscribing from bookings')
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
      setIsConnected(false)
    }
  }

  // Refresh bookings manually
  const refreshBookings = async () => {
    await fetchBookings()
  }

  // Initial setup and cleanup
  useEffect(() => {
    if (autoSubscribe) {
      fetchBookings()
      subscribe()
    }

    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleIds.join(','), autoSubscribe])

  // Handle connection state changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, optionally reduce activity
        console.log('Page hidden, maintaining subscription')
      } else {
        // Page is visible, ensure we're connected
        if (!isConnected && autoSubscribe) {
          console.log('Page visible, reconnecting')
          subscribe()
        }
      }
    }

    const handleOnline = () => {
      console.log('Back online, reconnecting')
      if (autoSubscribe) {
        subscribe()
      }
    }

    const handleOffline = () => {
      console.log('Offline, connection lost')
      setIsConnected(false)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, autoSubscribe])

  return {
    bookings,
    isConnected,
    error,
    refreshBookings,
    subscribe,
    unsubscribe
  }
}

// Hook for specific schedule bookings
export function useScheduleBookings(scheduleId: string) {
  return useRealtimeBookings({
    scheduleIds: [scheduleId],
    autoSubscribe: true
  })
}

// Hook for multiple schedule bookings
export function useMultipleScheduleBookings(scheduleIds: string[]) {
  return useRealtimeBookings({
    scheduleIds,
    autoSubscribe: true
  })
}
