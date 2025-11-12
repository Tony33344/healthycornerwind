'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { MenuItem } from '../types/menuItem'
import { formatPrice, truncate } from '../../lib/utils/helpers'
import AllergenIcons from './AllergenIcons'

interface Props {
  item: MenuItem
  locale: string
}

export default function MenuCard({ item, locale }: Props) {
  const t = useTranslations('menu')
  const [showNutrition, setShowNutrition] = useState(false)
  const name = item[`name_${locale}` as keyof MenuItem] as string
  const description = (item[`description_${locale}` as keyof MenuItem] as string | null) || ''
  const ingredients = (item[`ingredients_${locale}` as keyof MenuItem] as string | null) || ''

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-52 bg-neutral-200">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-neutral-400">{t('title')}</div>
        )}
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
          {item.category}
        </div>
        {item.stock !== undefined && item.stock < 5 && item.stock > 0 && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
            Only {item.stock} left
          </div>
        )}
        {item.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-neutral-900 mb-1">{name}</h3>
        {description && <p className="text-neutral-600 mb-3 line-clamp-2">{truncate(description, 120)}</p>}
        
        {/* Allergen Icons */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="mb-3">
            <AllergenIcons allergens={item.allergens} />
          </div>
        )}

        {/* Ingredients */}
        {ingredients && (
          <div className="mb-3">
            <button
              onClick={() => setShowNutrition(!showNutrition)}
              className="text-sm text-neutral-600 hover:text-primary flex items-center gap-1"
            >
              <svg className={`w-4 h-4 transition-transform ${showNutrition ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Ingredients
            </button>
            {showNutrition && (
              <div className="mt-2 text-sm text-neutral-600 bg-neutral-50 p-3 rounded">
                <p className="font-medium mb-1">Ingredients:</p>
                <p>{ingredients}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">{formatPrice(item.price)}</div>
          <button 
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={item.stock === 0}
          >
            {item.stock === 0 ? 'Out of Stock' : t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  )
}
