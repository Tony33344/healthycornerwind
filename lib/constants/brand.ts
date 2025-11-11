/**
 * Healthy Corner Brand Constants
 * Refs: .specify/memory/constitution.md - Principle 2 (Brand Design)
 */

// ============================================================================
// BRAND COLORS
// ============================================================================
export const BRAND_COLORS = {
  primary: '#A4B82C', // Lime green
  primaryDark: '#8A9824', // Darker lime for hover states
  black: '#000000',
  white: '#FFFFFF',
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    700: '#404040',
    900: '#171717',
  },
} as const

// ============================================================================
// BRAND TYPOGRAPHY
// ============================================================================
export const BRAND_TEXT = {
  name: 'healthy corner', // ALWAYS lowercase
  tagline: 'ALPSKI ZDRAVILIŠKI KAMP', // ALWAYS uppercase
} as const

// ============================================================================
// BRAND ASSETS
// ============================================================================
export const BRAND_ASSETS = {
  logo: '/images/logo.png',
  logoBlackBg: '/images/logo-black-bg.png',
  heroBg: '/images/hero-bg.jpg',
  aboutBg: '/images/about-bg.jpg',
  brandGuide: '/images/brand-guide.png',
} as const

// ============================================================================
// SERVICE CATEGORIES
// ============================================================================
export const SERVICE_CATEGORIES = [
  'Yoga',
  'Ice Bathing',
  'Workshops',
  'Packages',
] as const

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]

// ============================================================================
// MENU CATEGORIES
// ============================================================================
export const MENU_CATEGORIES = ['Snacks', 'Meals', 'Beverages', 'Supplements'] as const

export type MenuCategory = (typeof MENU_CATEGORIES)[number]

// ============================================================================
// BOOKING STATUS
// ============================================================================
export const BOOKING_STATUS = ['pending', 'confirmed', 'cancelled', 'completed'] as const

export type BookingStatus = (typeof BOOKING_STATUS)[number]

// ============================================================================
// PAYMENT STATUS
// ============================================================================
export const PAYMENT_STATUS = ['pending', 'paid', 'refunded'] as const

export type PaymentStatus = (typeof PAYMENT_STATUS)[number]

// ============================================================================
// ORDER STATUS
// ============================================================================
export const ORDER_STATUS = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
] as const

export type OrderStatus = (typeof ORDER_STATUS)[number]

// ============================================================================
// CONTENT STATUS
// ============================================================================
export const CONTENT_STATUS = ['draft', 'published'] as const

export type ContentStatus = (typeof CONTENT_STATUS)[number]

// ============================================================================
// DAYS OF WEEK
// ============================================================================
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
] as const

// ============================================================================
// SUPPORTED LOCALES
// ============================================================================
export const LOCALES = ['sl', 'nl', 'en', 'de'] as const

export type Locale = (typeof LOCALES)[number]

export const LOCALE_NAMES = {
  sl: 'Slovenščina',
  nl: 'Nederlands',
  en: 'English',
  de: 'Deutsch',
} as const

// ============================================================================
// ALLERGENS
// ============================================================================
export const COMMON_ALLERGENS = [
  'Gluten',
  'Dairy',
  'Eggs',
  'Nuts',
  'Peanuts',
  'Soy',
  'Fish',
  'Shellfish',
  'Sesame',
] as const

// ============================================================================
// PERFORMANCE TARGETS
// ============================================================================
export const PERFORMANCE_TARGETS = {
  lcp: 2.5, // Largest Contentful Paint (seconds)
  fid: 100, // First Input Delay (milliseconds)
  cls: 0.1, // Cumulative Layout Shift
  lighthouseScore: 90, // Minimum Lighthouse score
} as const

// ============================================================================
// PAGINATION
// ============================================================================
export const PAGINATION = {
  defaultPageSize: 12,
  pageSizeOptions: [12, 24, 48],
} as const

// ============================================================================
// IMAGE SIZES
// ============================================================================
export const IMAGE_SIZES = {
  logo: { width: 160, height: 160 },
  serviceCard: { width: 400, height: 300 },
  menuCard: { width: 350, height: 250 },
  galleryThumb: { width: 300, height: 300 },
  galleryFull: { width: 1200, height: 800 },
} as const
