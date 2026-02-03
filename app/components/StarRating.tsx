'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { StarRatingProps } from '../types/testimonial'

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  color = 'lime',
  showValue = false,
  interactive = false,
  onRatingChange
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [currentRating, setCurrentRating] = useState(rating)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const colorClasses = {
    lime: 'text-lime-500',
    yellow: 'text-yellow-500',
    orange: 'text-orange-500'
  }

  const handleStarClick = (starRating: number) => {
    if (!interactive) return
    
    setCurrentRating(starRating)
    onRatingChange?.(starRating)
  }

  const handleStarHover = (starRating: number) => {
    if (!interactive) return
    setHoverRating(starRating)
  }

  const handleMouseLeave = () => {
    if (!interactive) return
    setHoverRating(null)
  }

  const displayRating = hoverRating || currentRating
  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1
    const isFilled = starValue <= displayRating
    const isPartiallyFilled = starValue - 0.5 <= displayRating && starValue > displayRating

    return (
      <motion.button
        key={index}
        type="button"
        className={`
          relative ${sizeClasses[size]} 
          ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
          transition-transform duration-150
        `}
        onClick={() => handleStarClick(starValue)}
        onMouseEnter={() => handleStarHover(starValue)}
        onMouseLeave={handleMouseLeave}
        disabled={!interactive}
        aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
        whileHover={interactive ? { scale: 1.1 } : {}}
        whileTap={interactive ? { scale: 0.95 } : {}}
      >
        {/* Background star (empty) */}
        <svg
          className={`absolute inset-0 ${sizeClasses[size]} text-gray-300`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>

        {/* Filled star */}
        {(isFilled || isPartiallyFilled) && (
          <motion.svg
            className={`absolute inset-0 ${sizeClasses[size]} ${colorClasses[color]}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            style={{
              clipPath: isPartiallyFilled ? 'inset(0 50% 0 0)' : 'none'
            }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </motion.svg>
        )}

        {/* Hover effect for interactive stars */}
        {interactive && hoverRating && starValue <= hoverRating && (
          <motion.div
            className="absolute inset-0 bg-lime-200 rounded-full opacity-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1.2 }}
            exit={{ scale: 0 }}
          />
        )}
      </motion.button>
    )
  })

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5" role="img" aria-label={`${displayRating} out of ${maxRating} stars`}>
        {stars}
      </div>
      
      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {displayRating.toFixed(1)}/{maxRating}
        </span>
      )}
    </div>
  )
}
