'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Order } from '../../../types/cart'
import { formatOrderForDisplay, getOrderStatusInfo } from '../../../lib/utils/order'

interface OrderConfirmationPageProps {
  params: { 
    locale: string
    id: string 
  }
}

export default function OrderConfirmationPage({ params: { locale, id } }: OrderConfirmationPageProps) {
  const t = useTranslations('order_confirmation')
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // TODO: Fetch order from API
        // const response = await fetch(`/api/orders/${id}`)
        // if (!response.ok) throw new Error('Order not found')
        // const orderData = await response.json()
        
        // Mock order data for now
        const mockOrder: Order = {
          id: '1',
          order_number: id,
          customer: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+386 40 123 456'
          },
          items: [
            {
              id: '1',
              menu_item_id: '1',
              name: 'Healthy Bowl',
              price: 12.50,
              quantity: 2,
              category: 'Meals',
              added_at: new Date().toISOString()
            }
          ],
          delivery: {
            type: 'pickup',
            date: new Date().toISOString().split('T')[0],
            time: '12:00',
            notes: ''
          },
          payment: {
            method: 'cash'
          },
          status: 'pending',
          total_items: 2,
          total_price: 25.00,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        setOrder(mockOrder)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('order_not_found')}</h1>
          <p className="text-gray-600 mb-6">{error || t('order_not_found_description')}</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
          >
            {t('back_to_home')}
          </Link>
        </div>
      </main>
    )
  }

  const formattedOrder = formatOrderForDisplay(order)
  const statusInfo = getOrderStatusInfo(order.status)

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">
              {t('title')}
            </h1>
            <p className="text-xl text-neutral-600 mb-2">
              {t('subtitle')}
            </p>
            <p className="text-lg font-semibold text-lime-600">
              {t('order_number')}: {order.order_number}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Order Details */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full bg-${statusInfo.color}-500`} />
              <div>
                <h3 className="text-lg font-semibold">{t('status')}: {statusInfo.label}</h3>
                <p className="text-gray-600">{statusInfo.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Customer Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">{t('customer_info')}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('name')}</p>
                <p className="font-medium">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('email')}</p>
                <p className="font-medium">{order.customer.email}</p>
              </div>
              {order.customer.phone && (
                <div>
                  <p className="text-sm text-gray-600">{t('phone')}</p>
                  <p className="font-medium">{order.customer.phone}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Delivery Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">{t('delivery_info')}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('type')}</p>
                <p className="font-medium">
                  {order.delivery.type === 'pickup' ? t('pickup') : t('delivery')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('date_time')}</p>
                <p className="font-medium">
                  {formattedOrder.delivery_date} at {order.delivery.time}
                </p>
              </div>
              {order.delivery.notes && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">{t('notes')}</p>
                  <p className="font-medium">{order.delivery.notes}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">{t('order_items')}</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {t('quantity')}: {item.quantity} × €{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                <p className="text-lg font-bold">{t('total')}</p>
                <p className="text-lg font-bold text-lime-600">€{order.total_price.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">{t('payment_info')}</h3>
            <p className="font-medium">
              {order.payment.method === 'cash' && t('cash')}
              {order.payment.method === 'card' && t('card')}
              {order.payment.method === 'bank_transfer' && t('bank_transfer')}
            </p>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-lime-50 border border-lime-200 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-lime-800">{t('next_steps')}</h3>
            <ul className="space-y-2 text-lime-700">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('step_1')}
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('step_2')}
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('step_3')}
              </li>
            </ul>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/menu"
              className="px-6 py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors text-center font-semibold"
            >
              {t('order_again')}
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center font-semibold"
            >
              {t('back_to_home')}
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
