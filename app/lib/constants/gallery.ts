import { StaticGalleryImage, GalleryImage } from '../../types/gallery'

// Static gallery images configuration
export const STATIC_GALLERY_IMAGES: StaticGalleryImage[] = [
  {
    filename: 'DSC_4866.JPG',
    title: 'Morning Yoga Session',
    alt_text: 'Peaceful morning yoga practice in natural setting',
    category: 'yoga',
    is_featured: true
  },
  {
    filename: 'DSC_4870.JPG', 
    title: 'Wellness Facilities',
    alt_text: 'Modern wellness facilities and equipment',
    category: 'facilities',
    is_featured: false
  },
  {
    filename: 'DSC_4872.JPG',
    title: 'Ice Bath Experience',
    alt_text: 'Cold therapy ice bathing session',
    category: 'ice-bathing',
    is_featured: true
  },
  {
    filename: 'DSC_4886.JPG',
    title: 'Workshop Session',
    alt_text: 'Interactive wellness workshop in progress',
    category: 'workshops',
    is_featured: false
  },
  {
    filename: 'DSC_4890.JPG',
    title: 'Natural Environment',
    alt_text: 'Beautiful natural surroundings of the retreat',
    category: 'nature',
    is_featured: true
  },
  {
    filename: 'DSC_4906.JPG',
    title: 'Healthy Food Preparation',
    alt_text: 'Fresh, organic food being prepared',
    category: 'food',
    is_featured: false
  },
  {
    filename: 'DSC_4910.JPG',
    title: 'Ice Bathing Ritual',
    alt_text: 'Traditional ice bathing wellness practice',
    category: 'ice-bathing',
    is_featured: true
  },
  {
    filename: 'DSC_4915.JPG',
    title: 'Meditation Space',
    alt_text: 'Tranquil meditation and mindfulness area',
    category: 'yoga',
    is_featured: false
  },
  {
    filename: 'DSC_4934.JPG',
    title: 'Group Workshop',
    alt_text: 'Community wellness workshop session',
    category: 'workshops',
    is_featured: true
  },
  {
    filename: 'DSC_4986.JPG',
    title: 'Wellness Event',
    alt_text: 'Special wellness event gathering',
    category: 'events',
    is_featured: false
  },
  {
    filename: 'DSC_5027.JPG',
    title: 'Outdoor Activities',
    alt_text: 'Outdoor wellness activities in nature',
    category: 'nature',
    is_featured: true
  },
  {
    filename: 'DSC_5148.JPG',
    title: 'Nutritious Meals',
    alt_text: 'Healthy, balanced meals served at the retreat',
    category: 'food',
    is_featured: false
  },
  {
    filename: 'DSC_5157.JPG',
    title: 'Retreat Facilities',
    alt_text: 'Overview of wellness retreat facilities',
    category: 'facilities',
    is_featured: false
  }
]

// Convert static images to GalleryImage format
export const getStaticGalleryImages = (): GalleryImage[] => {
  return STATIC_GALLERY_IMAGES.map((staticImage, index) => ({
    id: `static-${index + 1}`,
    title: staticImage.title,
    description: `Experience ${staticImage.title.toLowerCase()} at Healthy Corner wellness retreat`,
    image_url: `/images/gallery/${staticImage.filename}`,
    alt_text: staticImage.alt_text,
    category: staticImage.category,
    is_featured: staticImage.is_featured,
    sort_order: index + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }))
}

// Get featured static images only
export const getFeaturedStaticImages = (): GalleryImage[] => {
  return getStaticGalleryImages().filter(image => image.is_featured)
}

// Get images by category
export const getStaticImagesByCategory = (category: string): GalleryImage[] => {
  return getStaticGalleryImages().filter(image => image.category === category)
}
