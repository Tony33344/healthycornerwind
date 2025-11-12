'use client'

import { useTranslations } from 'next-intl'
import { MENU_CATEGORIES, MenuCategory } from '../../lib/constants/brand'

interface Props {
  selected: MenuCategory | 'All'
  onChange: (category: MenuCategory | 'All') => void
}

export default function MenuFilter({ selected, onChange }: Props) {
  const t = useTranslations('menu.categories')
  const cats: Array<MenuCategory | 'All'> = ['All', ...MENU_CATEGORIES]

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-10">
      {cats.map((c) => {
        const isSel = selected === c
        const key = c === 'All' ? 'snacks' /* fallback label */ : (c.toLowerCase() as any)
        return (
          <button
            key={String(c)}
            onClick={() => onChange(c)}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              isSel ? 'bg-primary text-white shadow scale-105' : 'bg-white text-neutral-700 hover:bg-neutral-100 shadow'
            }`}
          >
            {c === 'All' ? 'All' : t(key)}
          </button>
        )
      })}
    </div>
  )
}
