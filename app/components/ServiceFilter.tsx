'use client'

import { useTranslations } from 'next-intl'
import { SERVICE_CATEGORIES, ServiceCategory } from '../../lib/constants/brand'

interface ServiceFilterProps {
  selectedCategory: ServiceCategory | 'All'
  onCategoryChange: (category: ServiceCategory | 'All') => void
}

export default function ServiceFilter({
  selectedCategory,
  onCategoryChange,
}: ServiceFilterProps) {
  const t = useTranslations('services.categories')

  const categories: Array<ServiceCategory | 'All'> = ['All', ...SERVICE_CATEGORIES]
  const keyMap: Record<ServiceCategory | 'All', string> = {
    All: 'all',
    Yoga: 'yoga',
    'Ice Bathing': 'iceBathing',
    Workshops: 'workshops',
    Packages: 'packages',
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      {categories.map((category) => {
        const isSelected = selectedCategory === category
        const key = keyMap[category]

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
              isSelected
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-white text-neutral-700 hover:bg-neutral-100 shadow'
            }`}
          >
            {t(key as any)}
          </button>
        )
      })}
    </div>
  )
}
