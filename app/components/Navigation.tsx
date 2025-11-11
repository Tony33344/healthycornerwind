'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { BRAND_TEXT } from '../../lib/constants/brand'

export default function Navigation() {
  const t = useTranslations('nav')
  const params = useParams()
  const locale = params.locale as string

  const navItems = [
    { key: 'home', href: `/${locale}` },
    { key: 'services', href: `/${locale}/services` },
    { key: 'menu', href: `/${locale}/menu` },
    { key: 'schedule', href: `/${locale}/schedule` },
    { key: 'gallery', href: `/${locale}/gallery` },
    { key: 'contact', href: `/${locale}/contact` },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">h</span>
            </div>
            <span className="brand-name text-xl font-bold text-neutral-900">
              {BRAND_TEXT.name}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-neutral-700 hover:text-primary font-medium transition-colors duration-200"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <Link
              href="/sl"
              className={`px-3 py-1 rounded ${locale === 'sl' ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              SL
            </Link>
            <Link
              href="/nl"
              className={`px-3 py-1 rounded ${locale === 'nl' ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              NL
            </Link>
            <Link
              href="/en"
              className={`px-3 py-1 rounded ${locale === 'en' ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              EN
            </Link>
            <Link
              href="/de"
              className={`px-3 py-1 rounded ${locale === 'de' ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              DE
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
