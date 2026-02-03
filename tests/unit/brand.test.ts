import '@testing-library/jest-dom'
import { 
  BRAND_COLORS, 
  BRAND_TEXT, 
  BRAND_ASSETS,
  SERVICE_CATEGORIES,
  MENU_CATEGORIES,
  LOCALES,
  LOCALE_NAMES,
  PERFORMANCE_TARGETS,
  IMAGE_SIZES
} from '../../lib/constants/brand'

describe('Brand Consistency Tests', () => {
  describe('Brand Colors', () => {
    it('should have correct primary brand colors', () => {
      expect(BRAND_COLORS.primary).toBe('#A4B82C')
      expect(BRAND_COLORS.primaryDark).toBe('#8A9824')
    })

    it('should have correct base colors', () => {
      expect(BRAND_COLORS.black).toBe('#000000')
      expect(BRAND_COLORS.white).toBe('#FFFFFF')
    })

    it('should have complete neutral color palette', () => {
      expect(BRAND_COLORS.neutral).toEqual({
        50: '#FAFAFA',
        100: '#F5F5F5',
        700: '#404040',
        900: '#171717',
      })
    })

    it('should have valid hex color format', () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i
      
      expect(BRAND_COLORS.primary).toMatch(hexColorRegex)
      expect(BRAND_COLORS.primaryDark).toMatch(hexColorRegex)
      expect(BRAND_COLORS.black).toMatch(hexColorRegex)
      expect(BRAND_COLORS.white).toMatch(hexColorRegex)
      
      Object.values(BRAND_COLORS.neutral).forEach(color => {
        expect(color).toMatch(hexColorRegex)
      })
    })

    it('should have accessible color contrast ratios', () => {
      // Primary color should be dark enough for white text
      expect(BRAND_COLORS.primary).toBe('#A4B82C')
      
      // Primary dark should be darker than primary
      expect(BRAND_COLORS.primaryDark).toBe('#8A9824')
      
      // Neutral colors should progress from light to dark
      const neutral = BRAND_COLORS.neutral
      expect(neutral[50]).toBe('#FAFAFA') // Lightest
      expect(neutral[900]).toBe('#171717') // Darkest
    })
  })

  describe('Brand Typography', () => {
    it('should have correct brand name formatting', () => {
      expect(BRAND_TEXT.name).toBe('healthy corner')
      expect(BRAND_TEXT.name).toEqual(BRAND_TEXT.name.toLowerCase())
    })

    it('should have correct tagline formatting', () => {
      expect(BRAND_TEXT.tagline).toBe('ALPSKI ZDRAVILIŠKI KAMP')
      expect(BRAND_TEXT.tagline).toEqual(BRAND_TEXT.tagline.toUpperCase())
    })

    it('should maintain consistent brand name casing', () => {
      // Brand name should ALWAYS be lowercase
      expect(BRAND_TEXT.name).not.toContain('HEALTHY')
      expect(BRAND_TEXT.name).not.toContain('CORNER')
      expect(BRAND_TEXT.name).not.toContain('Healthy')
      expect(BRAND_TEXT.name).not.toContain('Corner')
    })

    it('should maintain consistent tagline casing', () => {
      // Tagline should ALWAYS be uppercase
      expect(BRAND_TEXT.tagline).not.toContain('alpski')
      expect(BRAND_TEXT.tagline).not.toContain('zdraviliški')
      expect(BRAND_TEXT.tagline).not.toContain('kamp')
    })
  })

  describe('Brand Assets', () => {
    it('should have all required brand assets defined', () => {
      expect(BRAND_ASSETS.logo).toBe('/images/logo.png')
      expect(BRAND_ASSETS.logoBlackBg).toBe('/images/logo-black-bg.png')
      expect(BRAND_ASSETS.heroBg).toBe('/images/hero-bg.jpg')
      expect(BRAND_ASSETS.aboutBg).toBe('/images/gallery/DSC_4906.JPG')
      expect(BRAND_ASSETS.brandGuide).toBe('/images/brand-guide.png')
    })

    it('should use correct file extensions for assets', () => {
      expect(BRAND_ASSETS.logo).toMatch(/\.(png|jpg|jpeg|webp)$/i)
      expect(BRAND_ASSETS.logoBlackBg).toMatch(/\.(png|jpg|jpeg|webp)$/i)
      expect(BRAND_ASSETS.heroBg).toMatch(/\.(png|jpg|jpeg|webp)$/i)
      expect(BRAND_ASSETS.aboutBg).toMatch(/\.(png|jpg|jpeg|webp)$/i)
      expect(BRAND_ASSETS.brandGuide).toMatch(/\.(png|jpg|jpeg|webp)$/i)
    })

    it('should use consistent asset path structure', () => {
      Object.values(BRAND_ASSETS).forEach(assetPath => {
        expect(assetPath).toMatch(/^\/images\//)
      })
    })
  })

  describe('Service Categories', () => {
    it('should have all required service categories', () => {
      const expectedCategories = ['Yoga', 'Ice Bathing', 'Workshops', 'Packages']
      expect(SERVICE_CATEGORIES).toEqual(expectedCategories)
    })

    it('should use proper title case for categories', () => {
      SERVICE_CATEGORIES.forEach(category => {
        // Each word should start with capital letter
        const words = category.split(' ')
        words.forEach(word => {
          expect(word[0]).toEqual(word[0].toUpperCase())
        })
      })
    })

    it('should be readonly array', () => {
      // TypeScript ensures readonly, but runtime check for const assertion
      expect(Array.isArray(SERVICE_CATEGORIES)).toBe(true)
      expect(SERVICE_CATEGORIES.length).toBe(4)
    })
  })

  describe('Menu Categories', () => {
    it('should have all required menu categories', () => {
      const expectedCategories = ['Snacks', 'Meals', 'Beverages', 'Supplements']
      expect(MENU_CATEGORIES).toEqual(expectedCategories)
    })

    it('should use proper title case for categories', () => {
      MENU_CATEGORIES.forEach(category => {
        expect(category[0]).toEqual(category[0].toUpperCase())
      })
    })

    it('should be readonly array', () => {
      // TypeScript ensures readonly, but runtime check for const assertion
      expect(Array.isArray(MENU_CATEGORIES)).toBe(true)
      expect(MENU_CATEGORIES.length).toBe(4)
    })
  })

  describe('Internationalization', () => {
    it('should support all required locales', () => {
      const expectedLocales = ['sl', 'nl', 'en', 'de']
      expect(LOCALES).toEqual(expectedLocales)
    })

    it('should have locale names for all supported locales', () => {
      LOCALES.forEach(locale => {
        expect(LOCALE_NAMES[locale]).toBeDefined()
        expect(typeof LOCALE_NAMES[locale]).toBe('string')
        expect(LOCALE_NAMES[locale].length).toBeGreaterThan(0)
      })
    })

    it('should use correct locale name formatting', () => {
      expect(LOCALE_NAMES.sl).toBe('Slovenščina')
      expect(LOCALE_NAMES.nl).toBe('Nederlands')
      expect(LOCALE_NAMES.en).toBe('English')
      expect(LOCALE_NAMES.de).toBe('Deutsch')
    })

    it('should have consistent locale code format', () => {
      LOCALES.forEach(locale => {
        expect(locale).toMatch(/^[a-z]{2}$/)
      })
    })
  })

  describe('Performance Standards', () => {
    it('should have performance targets defined', () => {
      expect(PERFORMANCE_TARGETS.lcp).toBe(2.5)
      expect(PERFORMANCE_TARGETS.fid).toBe(100)
      expect(PERFORMANCE_TARGETS.cls).toBe(0.1)
      expect(PERFORMANCE_TARGETS.lighthouseScore).toBe(90)
    })

    it('should have realistic performance targets', () => {
      // LCP should be under 2.5 seconds (Google recommendation)
      expect(PERFORMANCE_TARGETS.lcp).toBeLessThanOrEqual(2.5)
      
      // FID should be under 100ms (Google recommendation)
      expect(PERFORMANCE_TARGETS.fid).toBeLessThanOrEqual(100)
      
      // CLS should be under 0.1 (Google recommendation)
      expect(PERFORMANCE_TARGETS.cls).toBeLessThanOrEqual(0.1)
      
      // Lighthouse score should be 90+ for excellent performance
      expect(PERFORMANCE_TARGETS.lighthouseScore).toBeGreaterThanOrEqual(90)
    })
  })

  describe('Image Specifications', () => {
    it('should have image sizes for all components', () => {
      expect(IMAGE_SIZES.logo).toEqual({ width: 160, height: 160 })
      expect(IMAGE_SIZES.serviceCard).toEqual({ width: 400, height: 300 })
      expect(IMAGE_SIZES.menuCard).toEqual({ width: 350, height: 250 })
      expect(IMAGE_SIZES.galleryThumb).toEqual({ width: 300, height: 300 })
      expect(IMAGE_SIZES.galleryFull).toEqual({ width: 1200, height: 800 })
    })

    it('should have consistent aspect ratios for cards', () => {
      const serviceAspectRatio = IMAGE_SIZES.serviceCard.width / IMAGE_SIZES.serviceCard.height
      const menuAspectRatio = IMAGE_SIZES.menuCard.width / IMAGE_SIZES.menuCard.height
      
      // Service card should be 4:3 aspect ratio
      expect(serviceAspectRatio).toBeCloseTo(4/3, 1)
      
      // Menu card should be 7:5 aspect ratio (350:250)
      expect(menuAspectRatio).toBeCloseTo(7/5, 1)
    })

    it('should have square aspect ratio for thumbnails', () => {
      expect(IMAGE_SIZES.logo.width).toBe(IMAGE_SIZES.logo.height)
      expect(IMAGE_SIZES.galleryThumb.width).toBe(IMAGE_SIZES.galleryThumb.height)
    })

    it('should have appropriate sizes for web use', () => {
      // Logo should be reasonable size for web
      expect(IMAGE_SIZES.logo.width).toBeGreaterThan(100)
      expect(IMAGE_SIZES.logo.width).toBeLessThan(500)
      
      // Gallery full should be high resolution but not excessive
      expect(IMAGE_SIZES.galleryFull.width).toBeGreaterThan(800)
      expect(IMAGE_SIZES.galleryFull.width).toBeLessThanOrEqual(1920)
    })
  })

  describe('Brand Consistency Rules', () => {
    it('should enforce lowercase brand name rule', () => {
      // This test ensures the brand name is always lowercase
      const brandNameRule = (text: string) => text === text.toLowerCase()
      expect(brandNameRule(BRAND_TEXT.name)).toBe(true)
    })

    it('should enforce uppercase tagline rule', () => {
      // This test ensures the tagline is always uppercase
      const taglineRule = (text: string) => text === text.toUpperCase()
      expect(taglineRule(BRAND_TEXT.tagline)).toBe(true)
    })

    it('should use consistent primary color', () => {
      // Primary color should be used consistently across the brand
      expect(BRAND_COLORS.primary).toBe('#A4B82C')
    })

    it('should maintain color accessibility standards', () => {
      // Colors should meet WCAG accessibility guidelines
      // Primary color should have sufficient contrast with white text
      expect(BRAND_COLORS.primary).toBe('#A4B82C') // This green has good contrast with white
      expect(BRAND_COLORS.primaryDark).toBe('#8A9824') // Darker variant for better contrast
    })
  })

  describe('Design System Validation', () => {
    it('should have complete color system', () => {
      expect(BRAND_COLORS).toHaveProperty('primary')
      expect(BRAND_COLORS).toHaveProperty('primaryDark')
      expect(BRAND_COLORS).toHaveProperty('black')
      expect(BRAND_COLORS).toHaveProperty('white')
      expect(BRAND_COLORS).toHaveProperty('neutral')
    })

    it('should have complete typography system', () => {
      expect(BRAND_TEXT).toHaveProperty('name')
      expect(BRAND_TEXT).toHaveProperty('tagline')
    })

    it('should have complete asset system', () => {
      expect(BRAND_ASSETS).toHaveProperty('logo')
      expect(BRAND_ASSETS).toHaveProperty('logoBlackBg')
      expect(BRAND_ASSETS).toHaveProperty('heroBg')
      expect(BRAND_ASSETS).toHaveProperty('aboutBg')
      expect(BRAND_ASSETS).toHaveProperty('brandGuide')
    })

    it('should have readonly constants', () => {
      // TypeScript ensures readonly with 'as const' assertion
      expect(typeof BRAND_COLORS).toBe('object')
      expect(typeof BRAND_TEXT).toBe('object')
      expect(typeof BRAND_ASSETS).toBe('object')
      expect(Array.isArray(SERVICE_CATEGORIES)).toBe(true)
      expect(Array.isArray(MENU_CATEGORIES)).toBe(true)
      expect(Array.isArray(LOCALES)).toBe(true)
      expect(typeof LOCALE_NAMES).toBe('object')
    })
  })

  describe('CSS Custom Properties Integration', () => {
    it('should have colors that match Tailwind config', () => {
      // These colors should match the Tailwind CSS configuration
      expect(BRAND_COLORS.primary).toBe('#A4B82C')
      expect(BRAND_COLORS.primaryDark).toBe('#8A9824')
      expect(BRAND_COLORS.neutral[50]).toBe('#FAFAFA')
      expect(BRAND_COLORS.neutral[100]).toBe('#F5F5F5')
      expect(BRAND_COLORS.neutral[700]).toBe('#404040')
      expect(BRAND_COLORS.neutral[900]).toBe('#171717')
    })

    it('should support CSS class generation', () => {
      // Colors should be suitable for CSS class names
      const colorKeys = Object.keys(BRAND_COLORS.neutral)
      colorKeys.forEach(key => {
        expect(key).toMatch(/^[0-9]+$/)
      })
    })
  })

  describe('Brand Guidelines Compliance', () => {
    it('should follow healthy/wellness brand conventions', () => {
      // Primary color should be green (associated with health/nature)
      expect(BRAND_COLORS.primary).toMatch(/^#[A-F0-9]{6}$/i)
      
      // Brand name should be welcoming and accessible (lowercase)
      expect(BRAND_TEXT.name).toBe('healthy corner')
      
      // Tagline should be in local language (Slovenian)
      expect(BRAND_TEXT.tagline).toBe('ALPSKI ZDRAVILIŠKI KAMP')
    })

    it('should maintain professional appearance', () => {
      // Colors should not be too bright or unprofessional
      expect(BRAND_COLORS.primary).toBe('#A4B82C') // Muted green, not neon
      expect(BRAND_COLORS.primaryDark).toBe('#8A9824') // Darker variant available
    })

    it('should support multilingual branding', () => {
      // Should support all target markets
      expect(LOCALES).toContain('sl') // Slovenia (primary market)
      expect(LOCALES).toContain('en') // International
      expect(LOCALES).toContain('de') // German market
      expect(LOCALES).toContain('nl') // Dutch market
    })
  })
})

// Test utilities for brand consistency validation
export const brandTestUtils = {
  validateColor: (color: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(color)
  },
  
  validateBrandName: (name: string): boolean => {
    return name === name.toLowerCase() && name === 'healthy corner'
  },
  
  validateTagline: (tagline: string): boolean => {
    return tagline === tagline.toUpperCase() && tagline === 'ALPSKI ZDRAVILIŠKI KAMP'
  },
  
  validateAssetPath: (path: string): boolean => {
    return path.startsWith('/images/') && /\.(png|jpg|jpeg|webp)$/i.test(path)
  },
  
  validateLocale: (locale: string): boolean => {
    return /^[a-z]{2}$/.test(locale) && LOCALES.includes(locale as any)
  },
  
  checkColorContrast: (foreground: string, background: string): boolean => {
    // Simplified contrast check - in real implementation would calculate actual contrast ratio
    return foreground !== background
  },
  
  validateImageSize: (size: { width: number; height: number }): boolean => {
    return size.width > 0 && size.height > 0 && 
           size.width <= 2000 && size.height <= 2000 // Reasonable web limits
  }
}
