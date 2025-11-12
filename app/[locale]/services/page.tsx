'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import ServiceCard from '../../components/ServiceCard'
import ServiceFilter from '../../components/ServiceFilter'
import { Service } from '../../types/service'
import { ServiceCategory } from '../../../lib/constants/brand'
import { supabase } from '../../../lib/supabase/client'

// Sample data for development (will be replaced with Supabase data)
const SAMPLE_SERVICES: Service[] = [
  {
    id: '1',
    name_en: 'Morning Yoga Session',
    name_sl: 'Jutranja joga',
    name_nl: 'Ochtend Yoga Sessie',
    name_de: 'Morgen Yoga Sitzung',
    description_en: 'Start your day with energizing yoga in the fresh mountain air',
    description_sl: 'Začnite dan z energizirajoče jogo v svežem gorskem zraku',
    description_nl: 'Begin je dag met energieke yoga in de frisse berglucht',
    description_de: 'Beginnen Sie Ihren Tag mit energiegeladener Yoga in frischer Bergluft',
    price: 25.00,
    duration: 60,
    capacity: 15,
    category: 'Yoga',
    image_url: '/images/gallery/DSC_4866.JPG',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  },
  {
    id: '2',
    name_en: 'Ice Bathing Experience',
    name_sl: 'Izkušnja ledene kopeli',
    name_nl: 'IJsbad Ervaring',
    name_de: 'Eisbad Erfahrung',
    description_en: 'Rejuvenating cold therapy session with breathing exercises',
    description_sl: 'Pomlajevalna terapija s hladom z dihalnimi vajami',
    description_nl: 'Verjongende koudetherapie sessie met ademhalingsoefeningen',
    description_de: 'Verjüngende Kältetherapie-Sitzung mit Atemübungen',
    price: 35.00,
    duration: 45,
    capacity: 8,
    category: 'Ice Bathing',
    image_url: '/images/icebath breathing/DSC_4910.JPG',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  },
  {
    id: '3',
    name_en: 'Wellness Workshop',
    name_sl: 'Wellness delavnica',
    name_nl: 'Wellness Workshop',
    name_de: 'Wellness Workshop',
    description_en: 'Learn holistic wellness practices and mindfulness techniques',
    description_sl: 'Naučite se holističnih praks dobrega počutja in tehnik pozornosti',
    description_nl: 'Leer holistische wellness praktijken en mindfulness technieken',
    description_de: 'Lernen Sie ganzheitliche Wellness-Praktiken und Achtsamkeitstechniken',
    price: 40.00,
    duration: 90,
    capacity: 12,
    category: 'Workshops',
    image_url: '/images/gallery/DSC_4867.JPG',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  },
  {
    id: '4',
    name_en: 'Weekend Wellness Package',
    name_sl: 'Vikend wellness paket',
    name_nl: 'Weekend Wellness Pakket',
    name_de: 'Wochenend-Wellness-Paket',
    description_en: 'Complete 2-day retreat with yoga, ice bathing, and healthy meals',
    description_sl: 'Popoln 2-dnevni retreat z jogo, ledeno kopeljo in zdravo prehrano',
    description_nl: 'Compleet 2-daags retreat met yoga, ijsbaden en gezonde maaltijden',
    description_de: 'Kompletter 2-Tage-Retreat mit Yoga, Eisbaden und gesunden Mahlzeiten',
    price: 199.00,
    duration: null,
    capacity: 10,
    category: 'Packages',
    image_url: '/images/gallery/DSC_4868.JPG',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  },
]

export default function ServicesPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('services')
  const [services, setServices] = useState<Service[]>([])
  const [allServices, setAllServices] = useState<Service[]>([])
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch services from API
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true)
        const response = await fetch(`/api/services?locale=${params.locale}`)
        if (!response.ok) throw new Error('Failed to fetch services')
        
        const result = await response.json()
        const servicesData = result.services || SAMPLE_SERVICES
        setAllServices(servicesData)
        setServices(servicesData)
      } catch (err) {
        console.error('Error fetching services:', err)
        setError('Failed to load services')
        // Fallback to sample data on error
        setAllServices(SAMPLE_SERVICES)
        setServices(SAMPLE_SERVICES)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [params.locale])

  // Filter services based on selected category
  useEffect(() => {
    if (activeCategory === 'All') {
      setServices(allServices)
    } else {
      setServices(allServices.filter(s => s.category === activeCategory))
    }
  }, [activeCategory, allServices])

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-700 mb-4">
              {t('label')}
            </p>
            <div className="w-16 h-1 bg-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900">
              {t('title')}
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Discover our wellness services designed to rejuvenate your body and mind
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <ServiceFilter
            selectedCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} locale={params.locale} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-neutral-600">No services found in this category</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
