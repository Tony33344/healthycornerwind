'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { newsletterSchema, NewsletterInput } from '../../lib/validations/schemas'
import { z } from 'zod'

interface NewsletterFormProps {
  className?: string
  compact?: boolean
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function NewsletterForm({ 
  className = '', 
  compact = false,
  onSuccess,
  onError 
}: NewsletterFormProps) {
  const t = useTranslations('newsletter')
  const [formData, setFormData] = useState<NewsletterInput & { gdprConsent: boolean }>({
    email: '',
    gdprConsent: false
  })
  const [errors, setErrors] = useState<{ email?: string; gdprConsent?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateEmail = (email: string) => {
    try {
      newsletterSchema.parse({ email })
      setErrors(prev => ({ ...prev, email: undefined }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, email: error.errors[0]?.message }))
      }
    }
  }

  const handleEmailChange = (email: string) => {
    setFormData(prev => ({ ...prev, email }))
    
    // Clear success state when user starts typing again
    if (isSuccess) {
      setIsSuccess(false)
    }
    
    // Validate email on change (debounced)
    if (email.trim()) {
      setTimeout(() => validateEmail(email), 300)
    } else {
      setErrors(prev => ({ ...prev, email: undefined }))
    }
  }

  const handleConsentChange = (gdprConsent: boolean) => {
    setFormData(prev => ({ ...prev, gdprConsent }))
    if (gdprConsent) {
      setErrors(prev => ({ ...prev, gdprConsent: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate email
      const validatedData = newsletterSchema.parse({ email: formData.email })

      // Check GDPR consent
      if (!formData.gdprConsent) {
        setErrors({ gdprConsent: t('gdpr_required') })
        return
      }

      // Submit to API
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to subscribe')
      }

      // Success
      setIsSuccess(true)
      setFormData({ email: '', gdprConsent: false })
      onSuccess?.()

    } catch (error) {
      if (error instanceof z.ZodError) {
        // Validation errors
        const fieldErrors: { email?: string } = {}
        error.errors.forEach(err => {
          if (err.path[0] === 'email') {
            fieldErrors.email = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        // API or network errors
        const errorMessage = error instanceof Error ? error.message : 'Failed to subscribe'
        onError?.(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (compact) {
    return (
      <div className={`newsletter-form-compact ${className}`}>
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-4 p-3 bg-lime-50 border border-lime-200 rounded-lg text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 text-lime-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">{t('success_compact')}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={`
                  w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors
                  ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                `}
                placeholder={t('email_placeholder')}
                required
                disabled={isSubmitting}
              />
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting || !formData.gdprConsent}
              className={`
                px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-200
                ${isSubmitting || !formData.gdprConsent
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-lime-600 hover:bg-lime-700'
                }
              `}
              whileHover={!isSubmitting && formData.gdprConsent ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting && formData.gdprConsent ? { scale: 0.95 } : {}}
            >
              {isSubmitting ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                t('subscribe')
              )}
            </motion.button>
          </div>

          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600"
            >
              {errors.email}
            </motion.p>
          )}

          <label className="flex items-start gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={formData.gdprConsent}
              onChange={(e) => handleConsentChange(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-lime-600 focus:ring-lime-500"
              required
            />
            <span>
              {t('gdpr_consent')} <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.gdprConsent && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600"
            >
              {errors.gdprConsent}
            </motion.p>
          )}
        </form>
      </div>
    )
  }

  return (
    <div className={`newsletter-form ${className}`}>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 mb-2">
            {t('email')} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="newsletter-email"
            value={formData.email}
            onChange={(e) => handleEmailChange(e.target.value)}
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

        {/* GDPR Consent */}
        <div>
          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.gdprConsent}
              onChange={(e) => handleConsentChange(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-lime-600 focus:ring-lime-500"
              required
            />
            <span>
              {t('gdpr_consent')} <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.gdprConsent && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.gdprConsent}
            </motion.p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || !formData.gdprConsent}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200
            ${isSubmitting || !formData.gdprConsent
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-lime-600 hover:bg-lime-700 focus:ring-2 focus:ring-lime-500 focus:ring-offset-2'
            }
          `}
          whileHover={!isSubmitting && formData.gdprConsent ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting && formData.gdprConsent ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              {t('subscribing')}
            </div>
          ) : (
            t('subscribe')
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
