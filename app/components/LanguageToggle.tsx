'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

const languages: Language[] = [
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
]

interface LanguageToggleProps {
  className?: string
  variant?: 'dropdown' | 'buttons' | 'compact'
  showFlags?: boolean
  showNativeNames?: boolean
}

export default function LanguageToggle({ 
  className = '', 
  variant = 'dropdown',
  showFlags = true,
  showNativeNames = true
}: LanguageToggleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return

    startTransition(() => {
      // Replace the locale in the current pathname
      const segments = pathname.split('/')
      segments[1] = newLocale
      const newPathname = segments.join('/')
      
      router.push(newPathname)
      setIsOpen(false)
    })
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {languages.map((language) => (
          <motion.button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            disabled={isPending}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${language.code === locale 
                ? 'bg-lime-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            whileHover={!isPending ? { scale: 1.05 } : {}}
            whileTap={!isPending ? { scale: 0.95 } : {}}
          >
            {showFlags && <span className="mr-1">{language.flag}</span>}
            {showNativeNames ? language.nativeName : language.code.toUpperCase()}
          </motion.button>
        ))}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <motion.button
          data-testid="language-switcher"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isPending}
          className={`
            flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 
            hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100
            ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          whileHover={!isPending ? { scale: 1.02 } : {}}
        >
          {showFlags && <span>{currentLanguage.flag}</span>}
          <span>{currentLanguage.code.toUpperCase()}</span>
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]"
              >
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    disabled={isPending}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                      hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg
                      ${language.code === locale ? 'bg-lime-50 text-lime-700' : 'text-gray-700'}
                      ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {showFlags && <span>{language.flag}</span>}
                    <span>{showNativeNames ? language.nativeName : language.name}</span>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <motion.button
        data-testid="language-switcher"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`
          flex items-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-lg
          text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2
          ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileHover={!isPending ? { scale: 1.02 } : {}}
        whileTap={!isPending ? { scale: 0.98 } : {}}
      >
        {showFlags && <span className="text-lg">{currentLanguage.flag}</span>}
        <span>{showNativeNames ? currentLanguage.nativeName : currentLanguage.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        
        {isPending && (
          <motion.div
            className="w-4 h-4 border-2 border-lime-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-full"
            >
              {languages.map((language, index) => (
                <motion.button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  disabled={isPending}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-sm text-left
                    hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg
                    ${language.code === locale ? 'bg-lime-50 text-lime-700 font-medium' : 'text-gray-700'}
                    ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {showFlags && <span className="text-lg">{language.flag}</span>}
                  <div className="flex flex-col">
                    <span className="font-medium">{showNativeNames ? language.nativeName : language.name}</span>
                    <span className="text-xs text-gray-500">{language.name}</span>
                  </div>
                  {language.code === locale && (
                    <svg className="w-4 h-4 text-lime-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook to get current language info
export function useCurrentLanguage(): Language {
  const locale = useLocale()
  return languages.find(lang => lang.code === locale) || languages[0]
}

// Hook to get all available languages
export function useAvailableLanguages(): Language[] {
  return languages
}
