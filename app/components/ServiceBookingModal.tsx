'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { Service } from '../types/service'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional(),
  quantity: z.coerce.number().int().min(1).max(50).default(1),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function ServiceBookingModal({
  isOpen,
  onClose,
  service,
  onComplete,
}: {
  isOpen: boolean
  onClose: () => void
  service: Service | null
  onComplete?: (payload: any) => void
}) {
  const t = useTranslations('booking')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    preferred_date: '',
    preferred_time: '',
    quantity: 1,
    notes: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  useEffect(() => {
    if (!isOpen) {
      setForm({ name: '', email: '', phone: '', preferred_date: '', preferred_time: '', quantity: 1, notes: '' })
      setErrors({})
    }
  }, [isOpen])

  if (!isOpen || !service) return null

  const handleChange = (key: keyof FormData, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const parsed = schema.parse(form)
      setIsSubmitting(true)

      const res = await fetch('/api/service-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: service.id,
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone || undefined,
          preferred_date: parsed.preferred_date || undefined,
          preferred_time: parsed.preferred_time || undefined,
          quantity: parsed.quantity ?? 1,
          notes: parsed.notes || undefined,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit booking')
      }

      const data = await res.json()
      onComplete?.(data)
      onClose()
    } catch (err: any) {
      if (err?.issues) {
        const map: Partial<Record<keyof FormData, string>> = {}
        for (const issue of err.issues) {
          const field = issue.path[0] as keyof FormData
          map[field] = issue.message
        }
        setErrors(map)
      } else {
        console.error('Service booking failed', err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 bg-black/50 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              data-testid="booking-modal"
            >
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">{t('bookSession')}</h3>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-neutral-900">{service[`name_en` as keyof Service] || ''}</div>
                      <div className="text-sm text-neutral-600">
                        {service.duration ? `${service.duration} min` : ''} {service.price ? `• €${service.price}` : ''}
                      </div>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors" aria-label={t('cancel')}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">{t('name')}</label>
                    <input id="name" name="name" type="text" value={form.name} onChange={e => handleChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.name ? 'border-red-500' : 'border-neutral-300'}`}
                      placeholder={t('namePlaceholder')} />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">{t('email')}</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.email ? 'border-red-500' : 'border-neutral-300'}`}
                      placeholder={t('emailPlaceholder')} />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">{t('phone')}</label>
                    <input id="phone" name="phone" type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('phonePlaceholder')} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="preferred_date" className="block text-sm font-medium text-neutral-700 mb-1">{t('preferredDate')}</label>
                      <input id="preferred_date" name="preferred_date" type="date" value={form.preferred_date} onChange={e => handleChange('preferred_date', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>
                    <div>
                      <label htmlFor="preferred_time" className="block text-sm font-medium text-neutral-700 mb-1">{t('preferredTime')}</label>
                      <input id="preferred_time" name="preferred_time" type="time" value={form.preferred_time} onChange={e => handleChange('preferred_time', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 mb-1">{t('quantity')}</label>
                    <input id="quantity" name="quantity" type="number" min={1} max={50} value={form.quantity} onChange={e => handleChange('quantity', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1">{t('notes')}</label>
                    <textarea id="notes" name="notes" rows={3} value={form.notes} onChange={e => handleChange('notes', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder={t('notesPlaceholder')} />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
                  <p className="text-xs text-neutral-600">{t('termsNotice')}</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors" disabled={isSubmitting}>
                    {t('cancel')}
                  </button>
                  <motion.button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}}>
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
