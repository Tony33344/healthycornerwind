'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ScheduleWithService, 
  TimeSlot, 
  DaySchedule, 
  WeeklyCalendarProps,
  getDayName,
  getServiceColor,
  isTimeSlotAvailable,
  getAvailableSpots
} from '../types/schedule'
import { useTranslations } from 'next-intl'
import { useRealtimeBookings } from '../lib/hooks/useRealtimeBookings'

export default function WeeklyCalendar({ 
  schedules, 
  bookings: initialBookings, 
  locale, 
  onTimeSlotClick 
}: WeeklyCalendarProps) {
  const t = useTranslations('schedule')
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [weekDays, setWeekDays] = useState<DaySchedule[]>([])
  const [isMobile, setIsMobile] = useState(false)

  // Convert schedules object to flat array if needed
  const flatSchedules: ScheduleWithService[] = Array.isArray(schedules) 
    ? schedules 
    : Object.values(schedules).flat() as ScheduleWithService[]

  // Get real-time bookings for all schedules
  const scheduleIds = flatSchedules.map(s => s.id)
  const { 
    bookings: realtimeBookings, 
    isConnected, 
    error: realtimeError,
    refreshBookings 
  } = useRealtimeBookings({
    scheduleIds,
    autoSubscribe: true
  })

  // Use real-time bookings if available, otherwise fall back to initial bookings
  const bookings = realtimeBookings.length > 0 ? realtimeBookings : initialBookings

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Generate week days and time slots
  useEffect(() => {
    const generateWeekDays = () => {
      const startOfWeek = new Date(selectedWeek)
      const day = startOfWeek.getDay()
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
      startOfWeek.setDate(diff)

      const days: DaySchedule[] = []
      
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek)
        currentDate.setDate(startOfWeek.getDate() + i)
        
        const dayOfWeek = i + 1 // 1-7 (Monday-Sunday)
        const daySchedules = flatSchedules.filter(s => s.day_of_week === dayOfWeek)
        
        const timeSlots: TimeSlot[] = daySchedules.map(schedule => {
          const availableSpots = getAvailableSpots(schedule, bookings, currentDate)
          const isAvailable = isTimeSlotAvailable(schedule, bookings, currentDate)
          
          return {
            id: schedule.id,
            time: schedule.time,
            day_of_week: dayOfWeek,
            available_spots: availableSpots,
            total_capacity: schedule.capacity,
            service: {
              id: schedule.service.id,
              name: schedule.service[`name_${locale}`] || schedule.service.name_en,
              category: schedule.service.category,
              price: schedule.service.price,
              duration: schedule.service.duration
            },
            is_booked: !isAvailable
          }
        }).sort((a, b) => a.time.localeCompare(b.time))

        days.push({
          day_of_week: dayOfWeek,
          day_name: getDayName(dayOfWeek, locale),
          time_slots: timeSlots
        })
      }
      
      setWeekDays(days)
    }

    generateWeekDays()
  }, [selectedWeek, bookings, locale, flatSchedules])

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(selectedWeek)
    const days = direction === 'prev' ? -7 : 7
    newWeek.setDate(newWeek.getDate() + days)
    setSelectedWeek(newWeek)
  }

  const formatWeekRange = () => {
    const startOfWeek = new Date(selectedWeek)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric' 
    }
    
    return `${startOfWeek.toLocaleDateString(locale, options)} - ${endOfWeek.toLocaleDateString(locale, options)}`
  }

  // Real-time connection indicator
  const ConnectionIndicator = () => (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-2 h-2 rounded-full ${
        isConnected ? 'bg-green-500' : 'bg-red-500'
      }`} />
      <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
        {isConnected ? t('live') : t('offline')}
      </span>
      {realtimeError && (
        <button
          onClick={refreshBookings}
          className="text-blue-600 hover:text-blue-700 underline"
        >
          {t('retry')}
        </button>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        {/* Mobile Header */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              {t('title')}
            </h3>
            <div className="flex items-center gap-3">
              <ConnectionIndicator />
              <div className="text-sm text-neutral-600">
                {formatWeekRange()}
              </div>
            </div>
          </div>
          
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 text-neutral-600 hover:text-primary transition-colors"
              aria-label="Previous week"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span className="text-sm font-medium text-neutral-900">
              {new Date(selectedWeek).toLocaleDateString(locale, { 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
            
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 text-neutral-600 hover:text-primary transition-colors"
              aria-label="Next week"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile List View */}
        <div className="divide-y divide-neutral-200 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {weekDays.map((day) => (
              <motion.div
                key={`${day.day_of_week}-${selectedWeek.getTime()}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4"
              >
                <h4 className="font-medium text-neutral-900 mb-3">
                  {day.day_name}
                </h4>
                {day.time_slots.length === 0 ? (
                  <p className="text-sm text-neutral-500 italic">
                    {t('noSlot')}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {day.time_slots.map((slot) => (
                      <motion.button
                        key={slot.id}
                        data-testid="schedule-item"
                        onClick={() => !slot.is_booked && onTimeSlotClick(slot)}
                        disabled={slot.is_booked}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          slot.is_booked
                            ? 'bg-neutral-50 border-neutral-200 cursor-not-allowed opacity-60'
                            : 'bg-white border-neutral-300 hover:border-primary hover:shadow-sm cursor-pointer'
                        }`}
                        whileHover={!slot.is_booked ? { scale: 1.02 } : {}}
                        whileTap={!slot.is_booked ? { scale: 0.98 } : {}}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: getServiceColor(slot.service.category) }}
                            />
                            <span className="text-sm font-medium text-neutral-900">
                              {slot.service.name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-primary">
                            {slot.time}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-600 mb-1">
                          {slot.service.duration && `${slot.service.duration} min`}
                          {slot.service.duration && slot.service.price && ' • '}
                          {slot.service.price && `€${slot.service.price}`}
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-medium ${
                            slot.is_booked ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {slot.is_booked
                              ? t('fullyBooked')
                              : `${slot.available_spots}/${slot.total_capacity} ${t('spots')}`}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // Desktop layout
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {t('title')}
            </h3>
            <p className="text-sm text-neutral-600">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ConnectionIndicator />
            <div className="text-sm text-neutral-600">
              {formatWeekRange()}
            </div>
          </div>
        </div>
        
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateWeek('prev')}
            className="px-3 py-1.5 text-sm rounded-full border border-neutral-200 text-neutral-700 hover:border-primary hover:text-primary transition-colors"
          >
            {t('previousWeek')}
          </button>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>{t('timezone')}</span>
            <span>•</span>
            <span>Europe/Ljubljana</span>
          </div>
          <button
            onClick={() => navigateWeek('next')}
            className="px-3 py-1.5 text-sm rounded-full border border-neutral-200 text-neutral-700 hover:border-primary hover:text-primary transition-colors"
          >
            {t('nextWeek')}
          </button>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="border-t border-neutral-200">
        {/* Day headers */}
        <div className="grid grid-cols-8 bg-neutral-50/60 border-b border-neutral-200">
          <div className="p-4 text-sm font-medium text-neutral-600 border-r border-neutral-200">
            {t('time')}
          </div>
          {weekDays.map((day) => (
            <div
              key={day.day_of_week}
              className="p-4 text-sm font-semibold text-neutral-900 border-r border-neutral-200 text-center"
            >
              {day.day_name}
            </div>
          ))}
        </div>

        {/* Time Slots Grid */}
        <div className="divide-y divide-neutral-100">
          {weekDays[0]?.time_slots.map((_, timeIndex) => {
            const timeSlots = weekDays
              .map((day) => day.time_slots[timeIndex])
              .filter(Boolean as unknown as (slot: TimeSlot | undefined) => slot is TimeSlot)
            const time = timeSlots[0]?.time || ''

            return (
              <motion.div
                key={time}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-8"
              >
                {/* Time Column */}
                <div className="p-4 text-sm text-neutral-700 font-medium border-r border-neutral-200">
                  {time}
                </div>

                {/* Day Columns */}
                {weekDays.map((day) => {
                  const slot = day.time_slots[timeIndex]

                  return (
                    <div
                      key={`${day.day_of_week}-${time}`}
                      className="p-2 border-r border-neutral-200 last:border-r-0"
                    >
                      {slot ? (
                        <motion.button
                          data-testid="schedule-item"
                          onClick={() => !slot.is_booked && onTimeSlotClick(slot)}
                          disabled={slot.is_booked}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            slot.is_booked
                              ? 'bg-neutral-50 cursor-not-allowed opacity-60'
                              : 'bg-white hover:bg-neutral-50 hover:border-primary border border-transparent cursor-pointer'
                          }`}
                          whileHover={!slot.is_booked ? { scale: 1.02 } : {}}
                          whileTap={!slot.is_booked ? { scale: 0.98 } : {}}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: getServiceColor(slot.service.category) }}
                            />
                            <span className="text-xs font-medium text-neutral-900 truncate">
                              {slot.service.name}
                            </span>
                          </div>

                          <div className="text-xs text-neutral-600 mb-2">
                            {slot.service.duration && `${slot.service.duration} min`}
                            {slot.service.duration && slot.service.price && ' • '}
                            {slot.service.price && `€${slot.service.price}`}
                          </div>

                          <div className={`text-xs font-medium ${
                            slot.is_booked ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {slot.is_booked
                              ? t('fullyBooked')
                              : `${slot.available_spots}/${slot.total_capacity} ${t('spots')}`}
                          </div>
                        </motion.button>
                      ) : (
                        <div className="p-3 text-center text-xs text-neutral-400 italic">
                          {t('noSlot')}
                        </div>
                      )}
                    </div>
                  )
                })}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#A4B82C' }} />
            <span className="text-neutral-700">{t('yoga')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
            <span className="text-neutral-700">{t('iceBathing')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8B5CF6' }} />
            <span className="text-neutral-700">{t('workshops')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
            <span className="text-neutral-700">{t('packages')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
