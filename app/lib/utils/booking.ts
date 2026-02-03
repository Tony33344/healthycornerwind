import { Booking, Schedule, ScheduleWithService } from '../../types/schedule'

/**
 * Check if a user has an existing booking at the same time
 */
export function hasBookingConflict(
  existingBookings: Booking[],
  newSchedule: Schedule,
  newDate: string,
  userId?: string
): boolean {
  if (!userId) return false

  return existingBookings.some(booking => {
    // Skip if booking is cancelled
    if (booking.status === 'cancelled') return false
    
    // Check if it's the same user
    if (booking.user_id !== userId) return false
    
    // Check if it's the same date
    if (booking.booking_date !== newDate) return false
    
    // Get the schedule for the existing booking to check time conflicts
    // This would need to be implemented with schedule lookup
    // For now, we'll check if it's the same schedule
    return booking.schedule_id === newSchedule.id
  })
}

/**
 * Check if a time slot is at capacity
 */
export function isAtCapacity(
  schedule: Schedule,
  existingBookings: Booking[],
  selectedDate: string
): boolean {
  const activeBookings = existingBookings.filter(booking => 
    booking.schedule_id === schedule.id &&
    booking.booking_date === selectedDate &&
    booking.status !== 'cancelled'
  )
  
  return activeBookings.length >= schedule.capacity
}

/**
 * Get available spots for a schedule
 */
export function getAvailableSpots(
  schedule: Schedule,
  existingBookings: Booking[],
  selectedDate: string
): number {
  const activeBookings = existingBookings.filter(booking => 
    booking.schedule_id === schedule.id &&
    booking.booking_date === selectedDate &&
    booking.status !== 'cancelled'
  )
  
  return Math.max(0, schedule.capacity - activeBookings.length)
}

/**
 * Validate booking request
 */
export function validateBookingRequest(
  schedule: Schedule,
  existingBookings: Booking[],
  selectedDate: string,
  userId?: string
): { isValid: boolean; error?: string; type?: 'capacity' | 'conflict' | 'schedule' } {
  // Check if schedule exists and is active
  if (!schedule.is_active) {
    return {
      isValid: false,
      error: 'This schedule is no longer active',
      type: 'schedule'
    }
  }

  // Check capacity
  if (isAtCapacity(schedule, existingBookings, selectedDate)) {
    return {
      isValid: false,
      error: 'This time slot is fully booked',
      type: 'capacity'
    }
  }

  // Check for user conflicts (if userId is provided)
  if (userId && hasBookingConflict(existingBookings, schedule, selectedDate, userId)) {
    return {
      isValid: false,
      error: 'You already have a booking at this time',
      type: 'conflict'
    }
  }

  // Check if the date is in the future
  const bookingDate = new Date(selectedDate)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const bookingDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate())
  
  if (bookingDay < today) {
    return {
      isValid: false,
      error: 'Cannot book for past dates',
      type: 'schedule'
    }
  }

  // Check if booking is too far in advance (e.g., more than 3 months)
  const maxAdvanceDate = new Date()
  maxAdvanceDate.setMonth(maxAdvanceDate.getMonth() + 3)
  
  if (bookingDate > maxAdvanceDate) {
    return {
      isValid: false,
      error: 'Bookings can only be made up to 3 months in advance',
      type: 'schedule'
    }
  }

  return { isValid: true }
}

/**
 * Get conflicting bookings for a user
 */
export function getUserConflicts(
  bookings: Booking[],
  userId: string,
  startDate: string,
  endDate: string
): Booking[] {
  return bookings.filter(booking => 
    booking.user_id === userId &&
    booking.status !== 'cancelled' &&
    booking.booking_date >= startDate &&
    booking.booking_date <= endDate
  )
}

/**
 * Check if a user can cancel a booking
 */
export function canCancelBooking(
  booking: Booking,
  schedule: Schedule,
  now: Date = new Date()
): { canCancel: boolean; reason?: string } {
  // Cannot cancel if already cancelled
  if (booking.status === 'cancelled') {
    return { canCancel: false, reason: 'Booking is already cancelled' }
  }

  // Cannot cancel if already completed
  if (booking.status === 'completed') {
    return { canCancel: false, reason: 'Booking is already completed' }
  }

  const bookingDate = new Date(booking.booking_date)
  const [hours, minutes] = schedule.time.split(':')
  bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

  // Check if booking is too soon (e.g., less than 2 hours before)
  const twoHoursBefore = new Date(bookingDate.getTime() - 2 * 60 * 60 * 1000)
  
  if (now > twoHoursBefore) {
    return { 
      canCancel: false, 
      reason: 'Bookings must be cancelled at least 2 hours before the scheduled time' 
    }
  }

  return { canCancel: true }
}

/**
 * Generate booking confirmation number
 */
export function generateBookingNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `HC-${timestamp.slice(-8)}-${random}`
}

/**
 * Format booking time for display
 */
export function formatBookingTime(
  bookingDate: string,
  time: string,
  locale: string = 'en'
): string {
  const date = new Date(bookingDate)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  const formattedDate = date.toLocaleDateString(locale, options)
  return `${formattedDate} at ${time}`
}

/**
 * Get booking status color
 */
export function getBookingStatusColor(status: Booking['status']): string {
  switch (status) {
    case 'pending':
      return '#F59E0B' // amber
    case 'confirmed':
      return '#10B981' // green
    case 'cancelled':
      return '#EF4444' // red
    case 'completed':
      return '#6B7280' // gray
    default:
      return '#6B7280'
  }
}

/**
 * Check if booking can be confirmed
 */
export function canConfirmBooking(booking: Booking): boolean {
  return booking.status === 'pending'
}

/**
 * Check if booking can be modified
 */
export function canModifyBooking(
  booking: Booking,
  schedule: Schedule,
  now: Date = new Date()
): boolean {
  // Cannot modify if cancelled or completed
  if (booking.status === 'cancelled' || booking.status === 'completed') {
    return false
  }

  const bookingDate = new Date(booking.booking_date)
  const [hours, minutes] = schedule.time.split(':')
  bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

  // Cannot modify if less than 24 hours before
  const oneDayBefore = new Date(bookingDate.getTime() - 24 * 60 * 60 * 1000)
  
  return now < oneDayBefore
}

/**
 * Calculate booking statistics
 */
export function calculateBookingStats(
  bookings: Booking[],
  schedules: Schedule[]
): {
  totalBookings: number
  confirmedBookings: number
  cancelledBookings: number
  completedBookings: number
  averageOccupancy: number
  mostPopularService: string | null
} {
  const totalBookings = bookings.length
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length
  const completedBookings = bookings.filter(b => b.status === 'completed').length

  // Calculate average occupancy
  const occupancyRates = schedules.map(schedule => {
    const scheduleBookings = bookings.filter(b => 
      b.schedule_id === schedule.id && 
      b.status !== 'cancelled'
    )
    return scheduleBookings.length / schedule.capacity
  })
  
  const averageOccupancy = occupancyRates.length > 0
    ? occupancyRates.reduce((sum, rate) => sum + rate, 0) / occupancyRates.length
    : 0

  // Find most popular service (would need service data)
  const mostPopularService = null // Placeholder

  return {
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    completedBookings,
    averageOccupancy,
    mostPopularService,
  }
}
