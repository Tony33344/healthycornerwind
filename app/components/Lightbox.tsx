'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { LightboxProps } from '../types/gallery'

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious
}: LightboxProps) {
  const t = useTranslations('gallery')
  const currentImage = images[currentIndex]

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return

    switch (event.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowLeft':
        onPrevious()
        break
      case 'ArrowRight':
        onNext()
        break
    }
  }, [isOpen, onClose, onNext, onPrevious])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !currentImage) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white hover:text-lime-400 transition-colors"
          aria-label={t('close')}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPrevious()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:text-lime-400 transition-colors"
            aria-label={t('previous')}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:text-lime-400 transition-colors"
            aria-label={t('next')}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Image Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-7xl max-h-full mx-4 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <div className="relative flex-1 flex items-center justify-center">
            <Image
              src={currentImage.image_url}
              alt={currentImage.alt_text}
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain"
              priority
            />
          </div>

          {/* Image Info */}
          <div className="bg-black bg-opacity-50 text-white p-4 mt-4 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{currentImage.title}</h2>
                {currentImage.description && (
                  <p className="text-gray-300 mb-3">{currentImage.description}</p>
                )}
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-lime-500 text-xs rounded-full">
                    {t(`categories.${currentImage.category}`)}
                  </span>
                  {currentImage.is_featured && (
                    <span className="px-2 py-1 bg-yellow-500 text-xs rounded-full">
                      {t('featured')}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Image Counter */}
              {images.length > 1 && (
                <div className="text-sm text-gray-300">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => {
                    const diff = index - currentIndex
                    if (diff > 0) {
                      for (let i = 0; i < diff; i++) onNext()
                    } else if (diff < 0) {
                      for (let i = 0; i < Math.abs(diff); i++) onPrevious()
                    }
                  }}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-lime-400 scale-110'
                      : 'border-transparent hover:border-white'
                  }`}
                >
                  <Image
                    src={image.image_url}
                    alt={image.alt_text}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Loading Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-lime-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
