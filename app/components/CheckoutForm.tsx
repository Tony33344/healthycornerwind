'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'
import { CheckoutFormData } from '../types/cart'
import { createOrderFromCart, generateOrderNumber, validateOrder } from '../lib/utils/order'

interface CheckoutFormProps {
  onSuccess?: (orderNumber: string) => void
  onError?: (error: string) => void
  className?: string
}

export default function CheckoutForm({ onSuccess, onError, className = '' }: CheckoutFormProps) {
  const t = useTranslations('checkout')
  const router = useRouter()
  const { cart, clearCart } = useCart()
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    customer: {
      name: '',
      email: '',
      phone: ''
    },
    delivery: {
      type: 'pickup',
      date: '',
      time: '',
      notes: ''
    },
    payment: {
      method: 'cash'
    }
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (section: keyof CheckoutFormData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    
    // Clear error when user starts typing
    const errorKey = `${section}.${field}`
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.customer.name.trim()) {
      newErrors['customer.name'] = t('errors.name_required')
    }
    
    if (!formData.customer.email.trim()) {
      newErrors['customer.email'] = t('errors.email_required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer.email)) {
      newErrors['customer.email'] = t('errors.email_invalid')
    }
    
    if (!formData.delivery.date) {
      newErrors['delivery.date'] = t('errors.date_required')
    }
    
    if (!formData.delivery.time) {
      newErrors['delivery.time'] = t('errors.time_required')
    }
    
    if (formData.delivery.type === 'delivery' && !formData.delivery.address?.street) {
      newErrors['delivery.address'] = t('errors.address_required')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cart || cart.items.length === 0) {
      onError?.(t('errors.empty_cart'))
      return
    }
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const orderNumber = generateOrderNumber()
      const orderData = createOrderFromCart(cart, formData, orderNumber)
      
      // Validate order
      const validation = validateOrder(orderData)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }
      
      // TODO: Submit order to API
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Clear cart and redirect
      clearCart()
      onSuccess?.(orderNumber)
      router.push(`/order-confirmation/${orderNumber}`)
      
    } catch (error) {
      console.error('Checkout error:', error)
      onError?.(error instanceof Error ? error.message : t('errors.checkout_failed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{t('empty_cart')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-8 ${className}`}>
      {/* Customer Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{t('customer_info')}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('name')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.customer.name}
              onChange={(e) => handleInputChange('customer', 'name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 ${
                errors['customer.name'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('name_placeholder')}
              required
            />
            {errors['customer.name'] && (
              <p className="mt-1 text-sm text-red-600">{errors['customer.name']}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('email')} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.customer.email}
              onChange={(e) => handleInputChange('customer', 'email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 ${
                errors['customer.email'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('email_placeholder')}
              required
            />
            {errors['customer.email'] && (
              <p className="mt-1 text-sm text-red-600">{errors['customer.email']}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('phone')}
            </label>
            <input
              type="tel"
              value={formData.customer.phone}
              onChange={(e) => handleInputChange('customer', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
              placeholder={t('phone_placeholder')}
            />
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{t('delivery_info')}</h3>
        
        {/* Delivery Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('delivery_type')}</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="pickup"
                checked={formData.delivery.type === 'pickup'}
                onChange={(e) => handleInputChange('delivery', 'type', e.target.value)}
                className="mr-2 text-lime-500 focus:ring-lime-500"
              />
              {t('pickup')}
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="delivery"
                checked={formData.delivery.type === 'delivery'}
                onChange={(e) => handleInputChange('delivery', 'type', e.target.value)}
                className="mr-2 text-lime-500 focus:ring-lime-500"
              />
              {t('delivery')}
            </label>
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('date')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.delivery.date}
              onChange={(e) => handleInputChange('delivery', 'date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 ${
                errors['delivery.date'] ? 'border-red-500' : 'border-gray-300'
              }`}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            {errors['delivery.date'] && (
              <p className="mt-1 text-sm text-red-600">{errors['delivery.date']}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('time')} <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.delivery.time}
              onChange={(e) => handleInputChange('delivery', 'time', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 ${
                errors['delivery.time'] ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">{t('select_time')}</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
            </select>
            {errors['delivery.time'] && (
              <p className="mt-1 text-sm text-red-600">{errors['delivery.time']}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('notes')}</label>
          <textarea
            value={formData.delivery.notes}
            onChange={(e) => handleInputChange('delivery', 'notes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
            rows={3}
            placeholder={t('notes_placeholder')}
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{t('payment_method')}</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="cash"
              checked={formData.payment.method === 'cash'}
              onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
              className="mr-2 text-lime-500 focus:ring-lime-500"
            />
            {t('cash')}
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="card"
              checked={formData.payment.method === 'card'}
              onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
              className="mr-2 text-lime-500 focus:ring-lime-500"
            />
            {t('card')}
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="bank_transfer"
              checked={formData.payment.method === 'bank_transfer'}
              onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
              className="mr-2 text-lime-500 focus:ring-lime-500"
            />
            {t('bank_transfer')}
          </label>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{t('order_summary')}</h3>
        <div className="space-y-2">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.quantity}x {item.name}</span>
              <span>€{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 font-semibold flex justify-between">
            <span>{t('total')}</span>
            <span>€{cart.total_price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
          isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-lime-600 hover:bg-lime-700 focus:ring-2 focus:ring-lime-500'
        }`}
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
            {t('processing')}
          </div>
        ) : (
          t('place_order')
        )}
      </motion.button>
    </form>
  )
}
