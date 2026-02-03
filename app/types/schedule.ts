import { ServiceCategory } from '../../lib/constants/brand'

export interface Schedule {
  id: string
  service_id: string
  day_of_week: number // 1-7 (Monday-Sunday)
  time: string // HH:MM format
  capacity: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ScheduleWithService extends Schedule {
  service: {
    id: string
    name_sl: string
    name_nl: string
    name_en: string
    name_de: string
    category: ServiceCategory
    duration: number | null
    price: number
    image_url: string | null
  }
}

export interface Booking {
  id: string
  schedule_id: string
  user_id: string
  user_name: string
  user_email: string
  user_phone: string | null
  booking_date: string // ISO date string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface BookingWithSchedule extends Booking {
  schedule: ScheduleWithService
}

export interface TimeSlot {
  id: string
  time: string
  day_of_week: number
  available_spots: number
  total_capacity: number
  service: {
    id: string
    name: string
    category: ServiceCategory
    price: number
    duration: number | null
  }
  is_booked: boolean
}

export interface WeeklyCalendarProps {
  schedules: ScheduleWithService[]
  bookings: Booking[]
  locale: string
  onTimeSlotClick: (slot: TimeSlot) => void
}

export interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  timeSlot: TimeSlot | null
  onBookingComplete: (booking: Booking) => void
}

export interface DaySchedule {
  day_of_week: number
  day_name: string
  time_slots: TimeSlot[]
}

// Helper function to get day name by day of week number
export function getDayName(dayOfWeek: number, locale: string = 'en'): string {
  const days = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    sl: ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'],
    nl: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
    de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  }
  
  const index = ((dayOfWeek % 7) + 7) % 7
  return days[locale as keyof typeof days]?.[index] || days.en[index]
}

// Helper function to get service category color
export function getServiceColor(category: ServiceCategory): string {
  const colors = {
    'Yoga': '#A4B82C',
    'Ice Bathing': '#3B82F6', 
    'Workshops': '#8B5CF6',
    'Packages': '#F59E0B'
  }
  
  return colors[category] || '#6B7280'
}

// Helper function to check if a time slot is available
export function isTimeSlotAvailable(
  schedule: ScheduleWithService,
  bookings: Booking[],
  selectedDate: Date
): boolean {
  const dateStr = selectedDate.toISOString().split('T')[0]
  const dayOfWeek = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay() // Convert to 1-7 (Mon-Sun)
  
  // Check if schedule is for this day
  if (schedule.day_of_week !== dayOfWeek) {
    return false
  }
  
  // Count existing bookings for this schedule and date
  const bookingCount = bookings.filter(booking => 
    booking.schedule_id === schedule.id && 
    booking.booking_date === dateStr &&
    booking.status !== 'cancelled'
  ).length
  
  return bookingCount < schedule.capacity
}

// Helper function to calculate available spots
export function getAvailableSpots(
  schedule: ScheduleWithService,
  bookings: Booking[],
  selectedDate: Date
): number {
  const dateStr = selectedDate.toISOString().split('T')[0]
  const dayOfWeek = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay()
  
  if (schedule.day_of_week !== dayOfWeek) {
    return 0
  }
  
  const bookingCount = bookings.filter(booking => 
    booking.schedule_id === schedule.id && 
    booking.booking_date === dateStr &&
    booking.status !== 'cancelled'
  ).length
  
  return Math.max(0, schedule.capacity - bookingCount)
}
