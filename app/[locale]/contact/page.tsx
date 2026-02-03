'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import ContactForm from '../../components/ContactForm'
import NewsletterForm from '../../components/NewsletterForm'

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('contact')
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleContactSuccess = () => {
    setNotification({ type: 'success', message: t('success.message') })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleContactError = (error: string) => {
    setNotification({ type: 'error', message: error })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleNewsletterSuccess = () => {
    setNotification({ type: 'success', message: 'Successfully subscribed to newsletter!' })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleNewsletterError = (error: string) => {
    setNotification({ type: 'error', message: error })
    setTimeout(() => setNotification(null), 5000)
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Global Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
            notification.type === 'success' 
              ? 'bg-lime-50 border border-lime-200 text-lime-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-700 mb-4">{t('label')}</p>
            <div className="w-16 h-1 bg-lime-500 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900">
              {t('title')}
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">{t('info.title')}</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('info.address')}</h3>
                      <p className="text-gray-600">Camp Menina, Slovenia</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('email')}</h3>
                      <p className="text-gray-600">info@healthycorner.si</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('phone')}</h3>
                      <p className="text-gray-600">+386 XX XXX XXX</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('info.hours')}</h3>
                      <p className="text-gray-600">Mon-Sun 7:00-20:00</p>
                    </div>
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('newsletter')}</h3>
                  <NewsletterForm 
                    compact={true}
                    onSuccess={handleNewsletterSuccess}
                    onError={handleNewsletterError}
                  />
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">{t('form.title')}</h2>
                <ContactForm 
                  onSuccess={handleContactSuccess}
                  onError={handleContactError}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
