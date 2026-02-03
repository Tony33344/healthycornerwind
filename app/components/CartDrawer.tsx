'use client'

import { Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useCart } from '../context/CartContext'
import { CartDrawerProps } from '../types/cart'
import { formatCartForDisplay } from '../lib/utils/cart'

export default function CartDrawer({ isOpen, onClose, className = '' }: CartDrawerProps) {
  const t = useTranslations('cart')
  const { cart, removeItem, updateQuantity, clearCart, isLoading } = useCart()
  
  const formattedCart = cart ? formatCartForDisplay(cart) : null

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleCheckout = () => {
    onClose()
    // Navigation to checkout will be handled by the Link component
  }

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

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`
              fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50
              flex flex-col ${className}
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('title')} ({formattedCart?.total_items || 0})
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg"
                aria-label={t('close')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                /* Loading State */
                <div className="flex items-center justify-center h-32">
                  <motion.div
                    className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : !formattedCart || formattedCart.items.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center h-64 px-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('empty')}</h3>
                  <p className="text-gray-600 text-center mb-6">{t('empty_description')}</p>
                  <Link
                    href="/menu"
                    onClick={onClose}
                    className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
                  >
                    {t('browse_menu')}
                  </Link>
                </div>
              ) : (
                /* Cart Items */
                <div className="p-4 space-y-4">
                  <AnimatePresence>
                    {formattedCart.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        {/* Item Image */}
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-600 truncate">{item.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-medium text-lime-600">{item.formatted_price}</span>
                            <span className="text-xs text-gray-500">×{item.quantity}</span>
                          </div>
                          
                          {/* Allergens */}
                          {item.allergens && item.allergens.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.allergens.slice(0, 3).map((allergen, i) => (
                                <span key={i} className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                                  {allergen}
                                </span>
                              ))}
                              {item.allergens.length > 3 && (
                                <span className="text-xs text-gray-500">+{item.allergens.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                              aria-label={t('decrease_quantity')}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                              aria-label={t('increase_quantity')}
                              disabled={item.max_quantity ? item.quantity >= item.max_quantity : false}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-600 hover:text-red-800 transition-colors"
                            aria-label={t('remove_item')}
                          >
                            {t('remove')}
                          </button>

                          {/* Item Total */}
                          <div className="text-sm font-semibold text-gray-900">
                            {item.formatted_total}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Clear Cart Button */}
                  {formattedCart.items.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={clearCart}
                      className="w-full text-sm text-red-600 hover:text-red-800 transition-colors py-2"
                    >
                      {t('clear_cart')}
                    </motion.button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {formattedCart && formattedCart.items.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-900">{t('subtotal')}</span>
                  <span className="text-lg font-bold text-gray-900">{formattedCart.formatted_total}</span>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={handleCheckout}
                  className="w-full bg-lime-500 text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-lime-600 transition-colors flex items-center justify-center gap-2"
                >
                  <span>{t('checkout')}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                {/* Continue Shopping */}
                <Link
                  href="/menu"
                  onClick={onClose}
                  className="w-full text-center py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                >
                  {t('continue_shopping')}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
