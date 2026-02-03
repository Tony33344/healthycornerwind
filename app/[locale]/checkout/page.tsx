'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '../../context/CartContext'
import CheckoutForm from '../../components/CheckoutForm'

export default function CheckoutPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('checkout')
  const router = useRouter()
  const { cart } = useCart()
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleCheckoutSuccess = (orderNumber: string) => {
    setNotification({ 
      type: 'success', 
      message: t('success.message', { orderNumber }) 
    })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleCheckoutError = (error: string) => {
    setNotification({ type: 'error', message: error })
    setTimeout(() => setNotification(null), 5000)
  }

  // Redirect if cart is empty
  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('empty_cart')}</h1>
          <p className="text-gray-600 mb-6">{t('empty_cart_description')}</p>
          <Link
            href="/menu"
            className="inline-flex items-center px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
          >
            {t('browse_menu')}
          </Link>
        </div>
      </main>
    )
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
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-700 mb-4">{t('label')}</p>
            <div className="w-16 h-1 bg-lime-500 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900">
              {t('title')}
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-lime-600 transition-colors">
              {t('breadcrumb.home')}
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/menu" className="hover:text-lime-600 transition-colors">
              {t('breadcrumb.menu')}
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{t('breadcrumb.checkout')}</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CheckoutForm 
              onSuccess={handleCheckoutSuccess}
              onError={handleCheckoutError}
            />
          </motion.div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>{t('security_notice')}</span>
          </div>
        </div>
      </section>
    </main>
  )
}
