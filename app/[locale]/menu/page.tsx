'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import MenuCard from '../../components/MenuCard'
import MenuFilter from '../../components/MenuFilter'
import { MenuItem } from '../../types/menuItem'
import { MenuCategory } from '../../../lib/constants/brand'
import { supabase } from '../../../lib/supabase/client'

const SAMPLE_MENU: MenuItem[] = [
  {
    id: 'm1',
    name_en: 'Protein Bowl',
    name_sl: 'Beljakovinska skleda',
    name_nl: 'Eiwit Bowl',
    name_de: 'Protein Schüssel',
    description_en: 'Healthy bowl with quinoa, avocado, and roasted veggies',
    description_sl: 'Zdrava skleda s kvinojo, avokadom in pečeno zelenjavo',
    description_nl: 'Gezonde bowl met quinoa, avocado en geroosterde groente',
    description_de: 'Gesunde Bowl mit Quinoa, Avocado und geröstetem Gemüse',
    price: 9.9,
    ingredients_en: 'quinoa, avocado, veggies',
    ingredients_sl: 'kvinoja, avokado, zelenjava',
    ingredients_nl: 'quinoa, avocado, groenten',
    ingredients_de: 'Quinoa, Avocado, Gemüse',
    allergens: ['Nuts'],
    category: 'Meals',
    image_url: '/images/izbrane hrana/DSC_4870.JPG',
    stock: 12,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2',
    name_en: 'Energy Smoothie',
    name_sl: 'Energijski smoothie',
    name_nl: 'Energie Smoothie',
    name_de: 'Energie Smoothie',
    description_en: 'Banana, spinach, oat milk, and chia seeds',
    description_sl: 'Banana, špinača, ovseno mleko in chia semena',
    description_nl: 'Banaan, spinazie, havermelk en chiazaad',
    description_de: 'Banane, Spinat, Hafermilch und Chiasamen',
    price: 4.9,
    ingredients_en: 'banana, spinach, oat milk, chia',
    ingredients_sl: 'banana, špinača, ovseno mleko, chia',
    ingredients_nl: 'banaan, spinazie, havermelk, chia',
    ingredients_de: 'Banane, Spinat, Hafermilch, Chia',
    allergens: [],
    category: 'Beverages',
    image_url: '/images/izbrane hrana/DSC_4890.JPG',
    stock: 25,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3',
    name_en: 'Nut Mix Snack',
    name_sl: 'Oreščki mix',
    name_nl: 'Notenmix',
    name_de: 'Nussmix',
    description_en: 'Roasted nuts with dried fruits',
    description_sl: 'Praženi oreščki s suhim sadjem',
    description_nl: 'Geroosterde noten met gedroogd fruit',
    description_de: 'Geröstete Nüsse mit Trockenfrüchten',
    price: 3.5,
    ingredients_en: 'nuts, raisins',
    ingredients_sl: 'oreščki, rozine',
    ingredients_nl: 'noten, rozijnen',
    ingredients_de: 'Nüsse, Rosinen',
    allergens: ['Nuts'],
    category: 'Snacks',
    image_url: '/images/izbrane hrana/DSC_4866.JPG',
    stock: 50,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function MenuPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('menu')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'All'>('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch menu items from API
  useEffect(() => {
    async function fetchMenuItems() {
      try {
        setLoading(true)
        const response = await fetch(`/api/menu?locale=${params.locale}`)
        if (!response.ok) throw new Error('Failed to fetch menu items')
        
        const result = await response.json()
        const itemsData = result.items || SAMPLE_MENU
        setAllMenuItems(itemsData)
        setMenuItems(itemsData)
      } catch (err) {
        console.error('Error fetching menu items:', err)
        setError('Failed to load menu')
        // Fallback to sample data on error
        setAllMenuItems(SAMPLE_MENU)
        setMenuItems(SAMPLE_MENU)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [params.locale])

  // Filter menu items by category
  useEffect(() => {
    if (activeCategory === 'All') {
      setMenuItems(allMenuItems)
    } else {
      setMenuItems(allMenuItems.filter(item => item.category === activeCategory))
    }
  }, [activeCategory, allMenuItems])

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-700 mb-4">{t('label')}</p>
            <div className="w-16 h-1 bg-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900">{t('title')}</h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">Healthy food options made with local, organic ingredients</p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <MenuFilter selected={activeCategory} onChange={setActiveCategory} />
        </div>
      </section>

      <section className="py-12 px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            </div>
          ) : menuItems.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.map((item) => (
                <MenuCard key={item.id} item={item} locale={params.locale} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-600">No items found.</div>
          )}
        </div>
      </section>
    </main>
  )
}
