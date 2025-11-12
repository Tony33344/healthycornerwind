'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { BRAND_TEXT, BRAND_ASSETS } from '../../lib/constants/brand'

export default function Hero() {
  const t = useTranslations('hero')
  const params = useParams() as { locale?: string }
  const locale = params?.locale || 'en'
  const [imageError, setImageError] = useState(false)

  return (
    <section className="relative min-h-screen bg-neutral-900 flex items-center justify-center overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        {!imageError ? (
          <Image
            src={BRAND_ASSETS.heroBg}
            alt="Camp Menina Wellness Retreat Background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-12"
          >
            <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
              <Image
                src={BRAND_ASSETS.logo}
                alt="healthy corner logo"
                fill
                priority
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 160px, 192px"
              />
            </div>
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="brand-name text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-white drop-shadow-lg"
          >
            {BRAND_TEXT.name}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="brand-tagline text-base md:text-lg text-neutral-200 mb-12 tracking-[0.4em] drop-shadow-md"
          >
            {BRAND_TEXT.tagline}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 md:py-5 md:px-10 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              {t('cta')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-7 h-12 border-2 border-white/80 rounded-full flex items-start justify-center p-2 backdrop-blur-sm bg-black/20"
        >
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-3 bg-white rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
