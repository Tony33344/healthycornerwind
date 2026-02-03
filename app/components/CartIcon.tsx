'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { CartIconProps } from '../types/cart'

export default function CartIcon({ 
  className = '', 
  showBadge = true, 
  onClick 
}: CartIconProps) {
  const { getItemCount, isLoading } = useCart()
  const itemCount = getItemCount()

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative p-2 text-gray-700 hover:text-lime-600 transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 rounded-lg
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={isLoading}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      {/* Cart Icon */}
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" 
        />
      </svg>

      {/* Item Count Badge */}
      <AnimatePresence>
        {showBadge && itemCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30 
            }}
            className="absolute -top-1 -right-1 bg-lime-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Indicator */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-4 h-4 border-2 border-lime-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </motion.button>
  )
}

// Compact version for mobile/small spaces
export function CartIconCompact({ 
  className = '', 
  showBadge = true, 
  onClick 
}: CartIconProps) {
  const { getItemCount, isLoading } = useCart()
  const itemCount = getItemCount()

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative p-1 text-gray-700 hover:text-lime-600 transition-colors duration-200
        focus:outline-none focus:ring-1 focus:ring-lime-500 rounded
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      disabled={isLoading}
      aria-label={`Cart (${itemCount})`}
    >
      {/* Simplified Cart Icon */}
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2.5} 
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" 
        />
      </svg>

      {/* Compact Badge */}
      <AnimatePresence>
        {showBadge && itemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-0.5 -right-0.5 bg-lime-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
          >
            {itemCount > 9 ? '9+' : itemCount}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// Cart icon with text label
export function CartIconWithLabel({ 
  className = '', 
  showBadge = true, 
  onClick,
  label = 'Cart'
}: CartIconProps & { label?: string }) {
  const { getItemCount, getTotalPrice, isLoading } = useCart()
  const itemCount = getItemCount()
  const totalPrice = getTotalPrice()

  return (
    <motion.button
      onClick={onClick}
      className={`
        flex items-center gap-2 p-2 text-gray-700 hover:text-lime-600 transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 rounded-lg
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading}
      aria-label={`${label} with ${itemCount} items, total €${totalPrice.toFixed(2)}`}
    >
      <div className="relative">
        {/* Cart Icon */}
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" 
          />
        </svg>

        {/* Small Badge */}
        <AnimatePresence>
          {showBadge && itemCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-lime-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
            >
              {itemCount > 9 ? '9+' : itemCount}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Label and Price */}
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">{label}</span>
        {totalPrice > 0 && (
          <span className="text-xs text-gray-500">
            €{totalPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <motion.div
          className="w-3 h-3 border border-lime-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
    </motion.button>
  )
}

// Floating action button style cart icon
export function CartIconFAB({ 
  className = '', 
  showBadge = true, 
  onClick 
}: CartIconProps) {
  const { getItemCount, isLoading } = useCart()
  const itemCount = getItemCount()

  return (
    <motion.button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 w-14 h-14 bg-lime-500 hover:bg-lime-600 text-white rounded-full shadow-lg
        focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2
        flex items-center justify-center z-40
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      disabled={isLoading}
      aria-label={`Floating cart button with ${itemCount} items`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Cart Icon */}
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" 
        />
      </svg>

      {/* Badge */}
      <AnimatePresence>
        {showBadge && itemCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[24px] h-6 flex items-center justify-center px-1"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-lime-600 rounded-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </motion.button>
  )
}
