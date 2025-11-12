'use client'

interface AllergenIconsProps {
  allergens: string[]
  className?: string
}

const ALLERGEN_INFO: Record<string, { icon: string; label: string; color: string }> = {
  'Nuts': {
    icon: '🥜',
    label: 'Contains nuts',
    color: 'bg-orange-100 text-orange-800'
  },
  'Gluten': {
    icon: '🌾',
    label: 'Contains gluten',
    color: 'bg-yellow-100 text-yellow-800'
  },
  'Dairy': {
    icon: '🥛',
    label: 'Contains dairy',
    color: 'bg-blue-100 text-blue-800'
  },
  'Eggs': {
    icon: '🥚',
    label: 'Contains eggs',
    color: 'bg-amber-100 text-amber-800'
  },
  'Soy': {
    icon: '🫘',
    label: 'Contains soy',
    color: 'bg-green-100 text-green-800'
  },
  'Sesame': {
    icon: '🧈',
    label: 'Contains sesame',
    color: 'bg-yellow-100 text-yellow-800'
  },
  'Fish': {
    icon: '🐟',
    label: 'Contains fish',
    color: 'bg-blue-100 text-blue-800'
  },
  'Shellfish': {
    icon: '🦐',
    label: 'Contains shellfish',
    color: 'bg-red-100 text-red-800'
  }
}

export default function AllergenIcons({ allergens, className = '' }: AllergenIconsProps) {
  if (!allergens || allergens.length === 0) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <span className="text-xs text-green-600 font-medium">✓ No common allergens</span>
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {allergens.map((allergen) => {
        const info = ALLERGEN_INFO[allergen] || {
          icon: '⚠️',
          label: allergen,
          color: 'bg-gray-100 text-gray-800'
        }

        return (
          <span
            key={allergen}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${info.color}`}
            title={info.label}
          >
            <span className="text-base" role="img" aria-label={info.label}>
              {info.icon}
            </span>
            <span>{allergen}</span>
          </span>
        )
      })}
    </div>
  )
}
