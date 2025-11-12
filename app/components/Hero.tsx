'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export default function Hero() {
  const t = useTranslations('hero')
  const params = useParams()
  const locale = (params?.locale as string) || 'en'

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-neutral-900">
      {/* Background with proper fallback */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Healthy Corner Background"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 py-20 max-w-4xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
            <Image
              src="/images/logo.png"
              alt="healthy corner"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 768px) 128px, 160px"
            />
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white lowercase"
        >
          healthy corner
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm md:text-base text-white/90 mb-12 uppercase tracking-[0.4em]"
        >
          ALPSKI ZDRAVILIŠKI KAMP
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            href={`/${locale}/services`}
            className="inline-block bg-[#A4B82C] hover:bg-[#8A9824] text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 hover:scale-105"
          >
            {t('cta')}
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-3 bg-white/80 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
