'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Service } from '../types/service'
import { formatPrice } from '../../lib/utils/helpers'
import { IMAGE_SIZES } from '../../lib/constants/brand'

interface ServiceCardProps {
  service: Service
  locale: string
  onBook?: (service: Service) => void
}

export default function ServiceCard({ service, locale, onBook }: ServiceCardProps) {
  const t = useTranslations('services')

  // Get localized name and description
  const name = service[`name_${locale}` as keyof Service] as string
  const description = service[`description_${locale}` as keyof Service] as string | null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Service Image */}
      <div className="relative h-64 bg-neutral-200">
        {service.image_url ? (
          <Image
            src={service.image_url}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <svg
              className="w-16 h-16 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {/* Category Badge */}
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
          {service.category}
        </div>
      </div>

      {/* Service Info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-neutral-900">{name}</h3>

        {description && (
          <p className="text-neutral-600 mb-4 line-clamp-2">{description}</p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-neutral-500">
          {service.duration && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{service.duration} min</span>
            </div>
          )}

          {service.capacity && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>{service.capacity} {t('capacity')}</span>
            </div>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-primary">{formatPrice(service.price)}</div>
          <button
            type="button"
            onClick={() => onBook?.(service)}
            aria-label={`${t('bookNow')} - ${name}`}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            {t('bookNow')}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
