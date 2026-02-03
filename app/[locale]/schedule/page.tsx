'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import WeeklyCalendar from '../../components/WeeklyCalendar'
import BookingModal from '../../components/BookingModal'
import StructuredData, { 
  generateBreadcrumbSchema, 
  generateOrganizationSchema 
} from '../../components/StructuredData'
import { 
  ScheduleWithService, 
  Booking, 
  TimeSlot
} from '../../types/schedule'

export default function SchedulePage({ params }: { params: { locale: string } }) {
  const t = useTranslations('schedule')
  const [schedules, setSchedules] = useState<ScheduleWithService[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch schedules and bookings
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch schedules
        const schedulesResponse = await fetch(`/api/schedules?locale=${params.locale}`)
        if (!schedulesResponse.ok) throw new Error('Failed to fetch schedules')
        
        const schedulesResult = await schedulesResponse.json()
        
        if (!schedulesResult.schedules) {
          throw new Error('No schedules data received from server')
        }
        
        // Convert grouped schedules to flat array if needed
        const schedulesData = schedulesResult.schedules
        const flatSchedules = Array.isArray(schedulesData) 
          ? schedulesData 
          : Object.values(schedulesData).flat()
        setSchedules(flatSchedules)

        // Fetch bookings for the current week
        const bookingsResponse = await fetch('/api/bookings')
        if (!bookingsResponse.ok) throw new Error('Failed to fetch bookings')
        
        const bookingsResult = await bookingsResponse.json()
        
        if (!bookingsResult.bookings) {
          throw new Error('No bookings data received from server')
        }
        
        setBookings(bookingsResult.bookings)
        
      } catch (err) {
        console.error('Error fetching schedule data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load schedule data')
        // No fallback data - require live connection
        setSchedules([])
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.locale])

  // Handle time slot click
  const handleTimeSlotClick = (timeSlot: TimeSlot) => {
    if (!timeSlot.is_booked) {
      setSelectedTimeSlot(timeSlot)
      setIsBookingModalOpen(true)
    }
  }

  // Handle booking completion
  const handleBookingComplete = (booking: Booking) => {
    // Refresh bookings to show updated availability
    fetch('/api/bookings')
      .then(response => response.json())
      .then(result => setBookings(result.bookings || []))
      .catch(console.error)
    
    // Close modal
    setIsBookingModalOpen(false)
    setSelectedTimeSlot(null)
    
    // TODO: Show success message
    console.log('Booking completed:', booking)
  }

  // Get timezone display
  const getTimezoneDisplay = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const cetTime = new Date().toLocaleString('en-US', { 
      timeZone: 'Europe/Ljubljana',
      timeZoneName: 'short'
    })
    return `${timezone} (CET/CEST)`
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <StructuredData data={generateOrganizationSchema()} />
      <StructuredData data={generateBreadcrumbSchema(params.locale)} />
      
      <div className="min-h-screen bg-neutral-50">
        {/* Header Section */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-700 mb-4">
                {t('label')}
              </p>
              <div className="w-16 h-1 bg-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900">
                {t('title')}
              </h1>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-4">
                {t('description')}
              </p>
              
              {/* Timezone Display */}
              <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{t('timezone')}: {getTimezoneDisplay()}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Instructions */}
        <section className="py-8 px-4 bg-white border-y border-neutral-200">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <p className="text-neutral-600">
                {t('instructions')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
              </div>
            ) : error ? (
              <div className="text-center py-24">
                <div className="text-red-600 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-red-600 mb-2">
                    {t('error.title')}
                  </h3>
                  <p className="text-neutral-600">{error}</p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <WeeklyCalendar
                  schedules={schedules}
                  bookings={bookings}
                  locale={params.locale}
                  onTimeSlotClick={handleTimeSlotClick}
                />
              </motion.div>
            )}
          </div>
        </section>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false)
            setSelectedTimeSlot(null)
          }}
          timeSlot={selectedTimeSlot}
          onBookingComplete={handleBookingComplete}
        />

        {/* Additional Information */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  {t('bookingInfo.title')}
                </h3>
                <div className="space-y-3 text-neutral-600">
                  <p>{t('bookingInfo.point1')}</p>
                  <p>{t('bookingInfo.point2')}</p>
                  <p>{t('bookingInfo.point3')}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  {t('cancellationPolicy.title')}
                </h3>
                <div className="space-y-3 text-neutral-600">
                  <p>{t('cancellationPolicy.point1')}</p>
                  <p>{t('cancellationPolicy.point2')}</p>
                  <p>{t('cancellationPolicy.point3')}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
