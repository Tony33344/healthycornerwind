// Testimonial types for the wellness retreat platform

export interface Testimonial {
  id: string
  name: string
  location?: string
  rating: number // 1-5 stars
  comment: string
  date: string
  avatar_url?: string
  service_category?: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface TestimonialProps {
  testimonial: Testimonial
  className?: string
  showAvatar?: boolean
  showDate?: boolean
  showLocation?: boolean
  compact?: boolean
}

export interface TestimonialListProps {
  testimonials: Testimonial[]
  maxItems?: number
  showFeaturedOnly?: boolean
  filterByCategory?: string
  className?: string
}

export interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  color?: string
  showValue?: boolean
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export interface TestimonialFormData {
  name: string
  email: string
  location?: string
  rating: number
  comment: string
  service_category?: string
}

// Static testimonials for development/fallback
export interface StaticTestimonial {
  name: string
  location: string
  rating: number
  comment: string
  service_category: string
  is_featured: boolean
}
