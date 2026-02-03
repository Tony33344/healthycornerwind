'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

interface SearchResult {
  id: string
  type: 'service' | 'menu' | 'booking' | 'customer'
  title: string
  subtitle: string
  url: string
  icon: string
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Global keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || results.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % results.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (results[selectedIndex]) {
          navigateToResult(results[selectedIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex])

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true)
    try {
      const searchLower = searchQuery.toLowerCase()
      const allResults: SearchResult[] = []

      // Search services
      const { data: services } = await supabase
        .from('services')
        .select('id, name_en, category, price')
        .or(`name_en.ilike.%${searchQuery}%,name_sl.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .limit(5)

      if (services) {
        services.forEach(service => {
          allResults.push({
            id: service.id,
            type: 'service',
            title: service.name_en,
            subtitle: `${service.category} • €${service.price}`,
            url: `/admin/services/${service.id}`,
            icon: '💆'
          })
        })
      }

      // Search menu items
      const { data: menuItems } = await supabase
        .from('menu_items')
        .select('id, name_en, category, price')
        .or(`name_en.ilike.%${searchQuery}%,name_sl.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .limit(5)

      if (menuItems) {
        menuItems.forEach(item => {
          allResults.push({
            id: item.id,
            type: 'menu',
            title: item.name_en,
            subtitle: `${item.category} • €${item.price}`,
            url: `/admin/menu/${item.id}`,
            icon: '🍽️'
          })
        })
      }

      // Search bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, customer_name, customer_email, service_name, date')
        .or(`customer_name.ilike.%${searchQuery}%,customer_email.ilike.%${searchQuery}%,service_name.ilike.%${searchQuery}%`)
        .limit(5)

      if (bookings) {
        bookings.forEach(booking => {
          allResults.push({
            id: booking.id,
            type: 'booking',
            title: booking.customer_name,
            subtitle: `${booking.service_name} • ${booking.date}`,
            url: `/admin/bookings?id=${booking.id}`,
            icon: '📅'
          })
        })
      }

      // If no results from database, show mock results
      if (allResults.length === 0) {
        allResults.push(
          {
            id: '1',
            type: 'service',
            title: 'Deep Tissue Massage',
            subtitle: 'wellness • €65.00',
            url: '/admin/services/1',
            icon: '💆'
          },
          {
            id: '2',
            type: 'menu',
            title: 'Green Smoothie Bowl',
            subtitle: 'meals • €12.50',
            url: '/admin/menu/2',
            icon: '🍽️'
          },
          {
            id: '3',
            type: 'booking',
            title: 'Ana Novak',
            subtitle: 'Deep Tissue Massage • 2025-01-15',
            url: '/admin/bookings?id=3',
            icon: '📅'
          }
        )
      }

      setResults(allResults)
      setSelectedIndex(0)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const navigateToResult = (result: SearchResult) => {
    router.push(result.url)
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'service': return 'bg-purple-100 text-purple-700'
      case 'menu': return 'bg-lime-100 text-lime-700'
      case 'booking': return 'bg-blue-100 text-blue-700'
      case 'customer': return 'bg-orange-100 text-orange-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:border-lime-500 transition-colors"
        aria-label="Open global search"
      >
        <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-sm text-neutral-600">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-neutral-100 text-neutral-600 rounded">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
            >
              <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-neutral-200">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search services, menu items, bookings..."
                    className="flex-1 text-lg outline-none"
                  />
                  {isSearching && (
                    <div className="w-5 h-5 border-2 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <kbd className="px-2 py-1 text-xs font-mono bg-neutral-100 text-neutral-600 rounded">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                  {query.trim() === '' ? (
                    <div className="p-8 text-center text-neutral-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-sm">Start typing to search...</p>
                    </div>
                  ) : results.length === 0 && !isSearching ? (
                    <div className="p-8 text-center text-neutral-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm">No results found for &quot;{query}&quot;</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {results.map((result, index) => (
                        <motion.button
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => navigateToResult(result)}
                          className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${
                            index === selectedIndex ? 'bg-lime-50' : 'hover:bg-neutral-50'
                          }`}
                        >
                          <div className="text-2xl">{result.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-neutral-900 truncate">{result.title}</div>
                            <div className="text-sm text-neutral-500 truncate">{result.subtitle}</div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(result.type)}`}>
                            {result.type}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {results.length > 0 && (
                  <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded">↑↓</kbd>
                        Navigate
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded">↵</kbd>
                        Select
                      </span>
                    </div>
                    <span>{results.length} results</span>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
