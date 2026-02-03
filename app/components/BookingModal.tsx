'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { TimeSlot, BookingModalProps, getServiceColor } from '../types/schedule'
import { z } from 'zod'

// Form validation schema
const bookingSchema = z.object({
  user_name: z.string().min(2, 'Name must be at least 2 characters'),
  user_email: z.string().email('Please enter a valid email address'),
  user_phone: z.string().optional(),
  notes: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

export default function BookingModal({ 
  isOpen, 
  onClose, 
  timeSlot, 
  onBookingComplete 
}: BookingModalProps) {
  const t = useTranslations('booking')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({})
  const [formData, setFormData] = useState<BookingFormData>({
    user_name: '',
    user_email: '',
    user_phone: '',
    notes: '',
  })

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        user_name: '',
        user_email: '',
        user_phone: '',
        notes: '',
      })
      setErrors({})
    }
  }, [isOpen])

  const validateForm = (): boolean => {
    try {
      bookingSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof BookingFormData, string>> = {}
        error.errors.forEach(err => {
          const field = err.path[0] as keyof BookingFormData
          newErrors[field] = err.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !timeSlot) return

    setIsSubmitting(true)
    
    try {
      // Calculate booking date based on selected time slot
      const bookingDate = new Date()
      const dayOfWeek = bookingDate.getDay() === 0 ? 7 : bookingDate.getDay()
      
      // Adjust to the correct day of week for the time slot
      const daysUntilSlot = (timeSlot.day_of_week - dayOfWeek + 7) % 7
      bookingDate.setDate(bookingDate.getDate() + daysUntilSlot)
      
      // Set the time
      const [hours, minutes] = timeSlot.time.split(':')
      bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      
      // NOTE: The database stores booking_date as a DATE (no time component).
      // We therefore send only the YYYY-MM-DD part to the API.
      const bookingDateStr = bookingDate.toISOString().split('T')[0]
      
      const bookingData = {
        schedule_id: timeSlot.id,
        user_name: formData.user_name,
        user_email: formData.user_email,
        user_phone: formData.user_phone || null,
        booking_date: bookingDateStr,
        notes: formData.notes || null,
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create booking')
      }

      const booking = await response.json()
      onBookingComplete(booking)
      onClose()
    } catch (error) {
      console.error('Booking error:', error)
      // You could set a general error state here
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (!timeSlot) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              data-testid="booking-modal"
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      {t('bookSession')}
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getServiceColor(timeSlot.service.category) }}
                        />
                        <span className="text-sm font-medium text-neutral-900">
                          {timeSlot.service.name}
                        </span>
                      </div>
                      <div className="text-sm text-neutral-600">
                        {timeSlot.time} • {timeSlot.service.duration && `${timeSlot.service.duration} minutes`}
                      </div>
                      <div className="text-sm text-neutral-600">
                        €{timeSlot.service.price}
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {timeSlot.available_spots} {t('spotsAvailable')}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="user_name" className="block text-sm font-medium text-neutral-700 mb-1">
                      {t('name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="user_name"
                      value={formData.user_name}
                      onChange={(e) => handleInputChange('user_name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.user_name ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      placeholder={t('namePlaceholder')}
                    />
                    {errors.user_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.user_name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="user_email" className="block text-sm font-medium text-neutral-700 mb-1">
                      {t('email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="user_email"
                      value={formData.user_email}
                      onChange={(e) => handleInputChange('user_email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.user_email ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      placeholder={t('emailPlaceholder')}
                    />
                    {errors.user_email && (
                      <p className="mt-1 text-sm text-red-600">{errors.user_email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="user_phone" className="block text-sm font-medium text-neutral-700 mb-1">
                      {t('phone')}
                    </label>
                    <input
                      type="tel"
                      id="user_phone"
                      value={formData.user_phone}
                      onChange={(e) => handleInputChange('user_phone', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('phonePlaceholder')}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1">
                      {t('notes')}
                    </label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder={t('notesPlaceholder')}
                    />
                  </div>
                </div>

                {/* Terms and Privacy */}
                <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
                  <p className="text-xs text-neutral-600">
                    {t('termsNotice')}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                    disabled={isSubmitting}
                  >
                    {t('cancel')}
                  </button>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || timeSlot.is_booked}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                    whileHover={!isSubmitting && !timeSlot.is_booked ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting && !timeSlot.is_booked ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('booking')}
                      </div>
                    ) : (
                      t('confirmBooking')
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
