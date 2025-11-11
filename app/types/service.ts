import { ServiceCategory } from '../../lib/constants/brand'

export interface Service {
  id: string
  name_sl: string
  name_nl: string
  name_en: string
  name_de: string
  description_sl: string | null
  description_nl: string | null
  description_en: string | null
  description_de: string | null
  price: number
  duration: number | null
  capacity: number | null
  category: ServiceCategory
  image_url: string | null
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ServiceCardProps {
  service: Service
  locale: string
}
