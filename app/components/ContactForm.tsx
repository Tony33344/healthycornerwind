'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { contactFormSchema, ContactFormInput } from '../../lib/validations/schemas'
import { z } from 'zod'

interface ContactFormProps {
  className?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function ContactForm({ 
  className = '', 
  onSuccess,
  onError 
}: ContactFormProps) {
  const t = useTranslations('contact')
  const [formData, setFormData] = useState<ContactFormInput>({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [errors, setErrors] = useState<Partial<ContactFormInput>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateField = (name: keyof ContactFormInput, value: string) => {
    try {
      const fieldSchema = contactFormSchema.shape[name]
      fieldSchema.parse(value)
      setErrors(prev => ({ ...prev, [name]: undefined }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [name]: error.errors[0]?.message }))
      }
    }
  }

  const handleInputChange = (name: keyof ContactFormInput, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear success state when user starts typing again
    if (isSuccess) {
      setIsSuccess(false)
    }
    
    // Validate field on change (debounced)
    if (value.trim()) {
      setTimeout(() => validateField(name, value), 300)
    } else {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate all fields
      const validatedData = contactFormSchema.parse(formData)

      // Submit to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      // Success
      setIsSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      onSuccess?.()

    } catch (error) {
      if (error instanceof z.ZodError) {
        // Validation errors
        const fieldErrors: Partial<ContactFormInput> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ContactFormInput] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        // API or network errors
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
        onError?.(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`contact-form ${className}`}>
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-lime-50 border border-lime-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex-shrink-0"
              >
                <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <div>
                <h3 className="text-lime-800 font-semibold">{t('success.title')}</h3>
                <p className="text-lime-700 text-sm">{t('success.message')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('name')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors
              ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            `}
            placeholder={t('name_placeholder')}
            required
            disabled={isSubmitting}
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.name}
            </motion.p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {t('email')} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors
              ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            `}
            placeholder={t('email_placeholder')}
            required
            disabled={isSubmitting}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.email}
            </motion.p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            {t('phone')}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors
              ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            `}
            placeholder={t('phone_placeholder')}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.phone}
            </motion.p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            {t('message')} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors resize-vertical
              ${errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            `}
            placeholder={t('message_placeholder')}
            required
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.message ? (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600"
              >
                {errors.message}
              </motion.p>
            ) : (
              <div />
            )}
            <span className="text-xs text-gray-500">
              {formData.message.length}/1000
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-lime-600 hover:bg-lime-700 focus:ring-2 focus:ring-lime-500 focus:ring-offset-2'
            }
          `}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              {t('sending')}
            </div>
          ) : (
            t('send')
          )}
        </motion.button>

        {/* Privacy Notice */}
        <p className="text-xs text-gray-600 text-center">
          {t('privacy_notice')}
        </p>
      </form>
    </div>
  )
}
