'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Gallery from '../../components/Gallery'
import Lightbox from '../../components/Lightbox'
import { GalleryImage, GalleryFilter } from '../../types/gallery'
import { getStaticGalleryImages } from '../../lib/constants/gallery'

export default function GalleryPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('gallery')
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [filter, setFilter] = useState<GalleryFilter>({})

  // Initialize with static images
  useEffect(() => {
    const staticImages = getStaticGalleryImages()
    setGalleryImages(staticImages)
  }, [])

  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedImageIndex(index)
    setIsLightboxOpen(true)
  }

  const handleLightboxClose = () => {
    setIsLightboxOpen(false)
  }

  const handleNext = () => {
    setSelectedImageIndex((prev) => 
      prev < galleryImages.length - 1 ? prev + 1 : 0
    )
  }

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => 
      prev > 0 ? prev - 1 : galleryImages.length - 1
    )
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
            <div className="w-16 h-1 bg-lime-500 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900">
              {t('title')}
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Component */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <Gallery
            images={galleryImages}
            onImageClick={handleImageClick}
            filter={filter}
            className="gallery-page"
          />
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        images={galleryImages}
        currentIndex={selectedImageIndex}
        isOpen={isLightboxOpen}
        onClose={handleLightboxClose}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </main>
  )
}
