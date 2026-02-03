'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { TestimonialProps } from '../types/testimonial'
import StarRating from './StarRating'

export default function Testimonial({
  testimonial,
  className = '',
  showAvatar = true,
  showDate = true,
  showLocation = true,
  compact = false
}: TestimonialProps) {
  const t = useTranslations('testimonials')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('sl-SI', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300
        ${compact ? 'p-4' : 'p-6'}
        ${testimonial.is_featured ? 'ring-2 ring-lime-500 ring-opacity-50' : ''}
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        {showAvatar && (
          <div className="flex-shrink-0">
            {testimonial.avatar_url ? (
              <Image
                src={testimonial.avatar_url}
                alt={`${testimonial.name} avatar`}
                width={compact ? 40 : 48}
                height={compact ? 40 : 48}
                className="rounded-full object-cover"
              />
            ) : (
              <div 
                className={`
                  ${compact ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base'}
                  bg-lime-100 text-lime-700 rounded-full flex items-center justify-center font-semibold
                `}
              >
                {getInitials(testimonial.name)}
              </div>
            )}
          </div>
        )}

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
                {testimonial.name}
              </h3>
              {showLocation && testimonial.location && (
                <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>
                  {testimonial.location}
                </p>
              )}
              {testimonial.service_category && (
                <p className={`text-lime-600 font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
                  {t(`categories.${testimonial.service_category}`)}
                </p>
              )}
            </div>

            {/* Featured Badge */}
            {testimonial.is_featured && (
              <span className="px-2 py-1 bg-lime-100 text-lime-700 text-xs font-medium rounded-full">
                {t('featured')}
              </span>
            )}
          </div>

          {/* Star Rating */}
          <div className="mt-2">
            <StarRating 
              rating={testimonial.rating} 
              size={compact ? 'sm' : 'md'}
              color="lime"
              showValue={!compact}
            />
          </div>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <blockquote className={`
          text-gray-700 italic leading-relaxed
          ${compact ? 'text-sm' : 'text-base'}
        `}>
          &ldquo;{testimonial.comment}&rdquo;
        </blockquote>
      </div>

      {/* Footer */}
      {showDate && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <time dateTime={testimonial.date}>
            {formatDate(testimonial.date)}
          </time>
          
          {/* Rating Summary */}
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-lime-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{testimonial.rating}/5</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Testimonial List Component
export function TestimonialList({
  testimonials,
  maxItems,
  showFeaturedOnly = false,
  filterByCategory,
  className = ''
}: {
  testimonials: TestimonialProps['testimonial'][]
  maxItems?: number
  showFeaturedOnly?: boolean
  filterByCategory?: string
  className?: string
}) {
  const t = useTranslations('testimonials')

  // Filter testimonials
  let filteredTestimonials = testimonials

  if (showFeaturedOnly) {
    filteredTestimonials = filteredTestimonials.filter(t => t.is_featured)
  }

  if (filterByCategory) {
    filteredTestimonials = filteredTestimonials.filter(t => t.service_category === filterByCategory)
  }

  // Limit results
  if (maxItems) {
    filteredTestimonials = filteredTestimonials.slice(0, maxItems)
  }

  if (filteredTestimonials.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{t('no_testimonials')}</p>
      </div>
    )
  }

  return (
    <div className={`grid gap-6 ${className}`}>
      {filteredTestimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Testimonial testimonial={testimonial} />
        </motion.div>
      ))}
    </div>
  )
}
