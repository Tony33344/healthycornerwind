'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { 
  GalleryImage, 
  GalleryProps, 
  GalleryFilter, 
  GalleryCategory,
  MasonryConfig 
} from '../types/gallery'
import { supabase } from '../../lib/supabase/client'
import { getStaticGalleryImages } from '../lib/constants/gallery'

const MASONRY_CONFIG: MasonryConfig = {
  columns: {
    mobile: 1,
    tablet: 2,
    desktop: 3
  },
  gap: 16
}

const GALLERY_CATEGORIES: GalleryCategory[] = [
  'yoga',
  'ice-bathing', 
  'workshops',
  'facilities',
  'food',
  'nature',
  'events'
]

export default function Gallery({ 
  images: initialImages = [], 
  onImageClick,
  filter = {},
  className = ''
}: GalleryProps) {
  const t = useTranslations('gallery')
  const [images, setImages] = useState<GalleryImage[]>(initialImages)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>(filter)

  // Fetch images from Supabase with static fallback
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try to fetch from Supabase first
        let query = supabase
          .from('gallery_images')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false })

        // Apply filters
        if (activeFilter.category) {
          query = query.eq('category', activeFilter.category)
        }
        if (activeFilter.featured !== undefined) {
          query = query.eq('is_featured', activeFilter.featured)
        }
        if (activeFilter.search) {
          query = query.or(`title.ilike.%${activeFilter.search}%,description.ilike.%${activeFilter.search}%`)
        }

        const { data, error: fetchError } = await query

        if (fetchError || !data || data.length === 0) {
          // Fallback to static images
          console.log('Using static gallery images as fallback')
          const staticImages = getStaticGalleryImages()
          setImages(staticImages)
        } else {
          // Combine Supabase images with static images
          const staticImages = getStaticGalleryImages()
          const combinedImages = [...data, ...staticImages]
          setImages(combinedImages)
        }
      } catch (err) {
        console.error('Gallery fetch error:', err)
        // Use static images as fallback
        const staticImages = getStaticGalleryImages()
        setImages(staticImages)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [activeFilter])

  // Filter images based on current filter
  const filteredImages = useMemo(() => {
    return images.filter(image => {
      if (activeFilter.category && image.category !== activeFilter.category) {
        return false
      }
      if (activeFilter.featured !== undefined && image.is_featured !== activeFilter.featured) {
        return false
      }
      if (activeFilter.search) {
        const searchLower = activeFilter.search.toLowerCase()
        return (
          image.title.toLowerCase().includes(searchLower) ||
          image.description?.toLowerCase().includes(searchLower) ||
          image.alt_text.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }, [images, activeFilter])

  // Organize images into masonry columns
  const masonryColumns = useMemo(() => {
    const columns: GalleryImage[][] = Array.from(
      { length: MASONRY_CONFIG.columns.desktop }, 
      () => []
    )
    
    filteredImages.forEach((image, index) => {
      const columnIndex = index % MASONRY_CONFIG.columns.desktop
      columns[columnIndex].push(image)
    })
    
    return columns
  }, [filteredImages])

  const handleFilterChange = (newFilter: Partial<GalleryFilter>) => {
    setActiveFilter(prev => ({ ...prev, ...newFilter }))
  }

  const clearFilters = () => {
    setActiveFilter({})
  }

  if (loading && images.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
        >
          {t('retry')}
        </button>
      </div>
    )
  }

  return (
    <div className={`gallery ${className}`}>
      {/* Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={clearFilters}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              Object.keys(activeFilter).length === 0
                ? 'bg-lime-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('all')}
          </button>
          
          {GALLERY_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleFilterChange({ category: activeFilter.category === category ? undefined : category })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter.category === category
                  ? 'bg-lime-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={activeFilter.featured || false}
              onChange={(e) => handleFilterChange({ featured: e.target.checked ? true : undefined })}
              className="rounded border-gray-300 text-lime-500 focus:ring-lime-500"
            />
            <span className="text-sm text-gray-700">{t('featured_only')}</span>
          </label>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {t('showing_results', { count: filteredImages.length, total: images.length })}
        </p>
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {masonryColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-4">
            <AnimatePresence>
              {column.map((image, imageIndex) => {
                const globalIndex = filteredImages.findIndex(img => img.id === image.id)
                return (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: imageIndex * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => onImageClick?.(image, globalIndex)}
                  >
                    <div className="relative overflow-hidden rounded-lg bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                      <Image
                        src={image.image_url}
                        alt={image.alt_text}
                        width={400}
                        height={300}
                        className="w-full h-auto object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                        <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                          {image.description && (
                            <p className="text-sm opacity-90">{image.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-1 bg-lime-500 text-xs rounded-full">
                              {t(`categories.${image.category}`)}
                            </span>
                            {image.is_featured && (
                              <span className="px-2 py-1 bg-yellow-500 text-xs rounded-full">
                                {t('featured')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_images')}</h3>
          <p className="text-gray-600 mb-4">{t('no_images_description')}</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
          >
            {t('clear_filters')}
          </button>
        </div>
      )}
    </div>
  )
}
