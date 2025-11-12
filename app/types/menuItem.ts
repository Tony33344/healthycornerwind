import { MenuCategory } from '../../lib/constants/brand'

export interface MenuItem {
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
  ingredients_sl: string | null
  ingredients_nl: string | null
  ingredients_en: string | null
  ingredients_de: string | null
  allergens: string[]
  category: MenuCategory
  image_url: string | null
  stock: number
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}
