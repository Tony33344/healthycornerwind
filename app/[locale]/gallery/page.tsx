'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

const GALLERY_IMAGES = [
  { src: '/images/gallery/DSC_4866.JPG', alt: 'Camp Menina Wellness' },
  { src: '/images/gallery/DSC_4870.JPG', alt: 'Healthy Food' },
  { src: '/images/gallery/DSC_4872.JPG', alt: 'Nature Setting' },
  { src: '/images/gallery/DSC_4886.JPG', alt: 'Wellness Activities' },
  { src: '/images/gallery/DSC_4890.JPG', alt: 'Healthy Beverages' },
  { src: '/images/gallery/DSC_4906.JPG', alt: 'Mountain Views' },
  { src: '/images/gallery/DSC_4910.JPG', alt: 'Ice Bathing' },
  { src: '/images/gallery/DSC_4915.JPG', alt: 'Retreat Atmosphere' },
  { src: '/images/gallery/DSC_4934.JPG', alt: 'Wellness Experience' },
  { src: '/images/gallery/DSC_4986.JPG', alt: 'Nature Connection' },
  { src: '/images/gallery/DSC_5027.JPG', alt: 'Alpine Setting' },
  { src: '/images/gallery/DSC_5148.JPG', alt: 'Wellness Journey' },
  { src: '/images/gallery/DSC_5157.JPG', alt: 'Peaceful Retreat' },
]

const ICE_BATH_IMAGES = [
  '/images/icebath breathing/DSC_4867.JPG',
  '/images/icebath breathing/DSC_4868.JPG',
  '/images/icebath breathing/DSC_4886.JPG',
  '/images/icebath breathing/DSC_4906.JPG',
  '/images/icebath breathing/DSC_4910.JPG',
  '/images/icebath breathing/DSC_4934.JPG',
  '/images/icebath breathing/DSC_4986.JPG',
]

const FOOD_IMAGES = [
  '/images/izbrane hrana/DSC_4866.JPG',
  '/images/izbrane hrana/DSC_4870.JPG',
  '/images/izbrane hrana/DSC_4872.JPG',
  '/images/izbrane hrana/DSC_4886.JPG',
  '/images/izbrane hrana/DSC_4890.JPG',
  '/images/izbrane hrana/DSC_4906.JPG',
]

export default function GalleryPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('gallery')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'icebath' | 'food'>('all')

  const allImages = [...GALLERY_IMAGES]
  const displayImages = 
    activeTab === 'icebath' ? ICE_BATH_IMAGES.map((src, i) => ({ src, alt: `Ice Bath ${i + 1}` })) :
    activeTab === 'food' ? FOOD_IMAGES.map((src, i) => ({ src, alt: `Healthy Food ${i + 1}` })) :
    allImages

  const handlePrevious = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1)
    }
  }

  const handleNext = () => {
    if (selectedImage !== null && selectedImage < displayImages.length - 1) {
      setSelectedImage(selectedImage + 1)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-700 mb-4">{t('label')}</p>
            <div className="w-16 h-1 bg-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900">
              {t('title')}
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {t('allPhotos')} ({GALLERY_IMAGES.length})
            </button>
            <button
              onClick={() => setActiveTab('icebath')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'icebath'
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {t('iceBathing')} ({ICE_BATH_IMAGES.length})
            </button>
            <button
              onClick={() => setActiveTab('food')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'food'
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {t('healthyFood')} ({FOOD_IMAGES.length})
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayImages.map((image, index) => (
              <motion.div
                key={image.src}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative aspect-square overflow-hidden rounded-lg bg-neutral-200 cursor-pointer group"
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                    />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Button */}
            {selectedImage > 0 && (
              <button
                className="absolute left-4 text-white hover:text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
              >
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next Button */}
            {selectedImage < displayImages.length - 1 && (
              <button
                className="absolute right-4 text-white hover:text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
              >
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Image */}
            <motion.div
              key={selectedImage}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative w-full h-full max-w-5xl max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={displayImages[selectedImage].src}
                alt={displayImages[selectedImage].alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {selectedImage + 1} / {displayImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
