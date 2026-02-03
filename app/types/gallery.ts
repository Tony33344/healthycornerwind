// Gallery types for the wellness retreat platform

export interface GalleryImage {
  id: string
  title: string
  description?: string
  image_url: string
  alt_text: string
  category: GalleryCategory
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type GalleryCategory = 
  | 'yoga'
  | 'ice-bathing'
  | 'workshops'
  | 'facilities'
  | 'food'
  | 'nature'
  | 'events'

export interface GalleryFilter {
  category?: GalleryCategory
  featured?: boolean
  search?: string
}

export interface GalleryProps {
  images: GalleryImage[]
  onImageClick?: (image: GalleryImage, index: number) => void
  filter?: GalleryFilter
  className?: string
}

export interface LightboxProps {
  images: GalleryImage[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

// Static gallery images configuration
export interface StaticGalleryImage {
  filename: string
  title: string
  alt_text: string
  category: GalleryCategory
  is_featured: boolean
}

// Masonry grid configuration
export interface MasonryConfig {
  columns: {
    mobile: number
    tablet: number
    desktop: number
  }
  gap: number
}
