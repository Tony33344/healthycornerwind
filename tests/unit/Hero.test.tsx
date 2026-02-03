import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import Hero from '../../app/components/Hero'

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn()
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn()
}))

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, priority, quality, sizes, ...props }: any) {
    return <img 
      src={src} 
      alt={alt} 
      priority={priority ? 'true' : undefined}
      quality={quality}
      sizes={sizes}
      {...props} 
    />
  }
})

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>
  }
}))

// Mock Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>
  }
})

const mockUseTranslations = useTranslations as jest.MockedFunction<typeof useTranslations>
const mockUseParams = useParams as jest.MockedFunction<typeof useParams>

describe('Hero Component', () => {
  const mockT = jest.fn() as any

  beforeEach(() => {
    mockUseTranslations.mockReturnValue(mockT)
    mockUseParams.mockReturnValue({ locale: 'en' })
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'cta': 'Explore Services'
      }
      return translations[key] || key
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the hero section', () => {
      render(<Hero />)
      
      const heroSection = screen.getByText('healthy corner').closest('section')
      expect(heroSection).toBeInTheDocument()
    })

    it('should render the brand name', () => {
      render(<Hero />)
      
      const brandName = screen.getByText('healthy corner')
      expect(brandName).toBeInTheDocument()
      expect(brandName.tagName).toBe('H1')
    })

    it('should render the tagline', () => {
      render(<Hero />)
      
      const tagline = screen.getByText('ALPSKI ZDRAVILIŠKI KAMP')
      expect(tagline).toBeInTheDocument()
    })

    it('should render the CTA button', () => {
      render(<Hero />)
      
      const ctaButton = screen.getByText('Explore Services')
      expect(ctaButton).toBeInTheDocument()
      expect(ctaButton.tagName).toBe('A')
    })

    it('should render the logo image', () => {
      render(<Hero />)
      
      const logoImage = screen.getByAltText('healthy corner')
      expect(logoImage).toBeInTheDocument()
      expect(logoImage).toHaveAttribute('src', '/images/logo.png')
    })

    it('should render the background image', () => {
      render(<Hero />)
      
      const backgroundImage = screen.getByAltText('Healthy Corner Background')
      expect(backgroundImage).toBeInTheDocument()
      expect(backgroundImage).toHaveAttribute('src', '/images/hero-bg.jpg')
    })

    it('should render the scroll indicator', () => {
      render(<Hero />)
      
      // Look for the scroll indicator container
      const scrollIndicator = document.querySelector('.absolute.bottom-8')
      expect(scrollIndicator).toBeInTheDocument()
    })
  })

  describe('Styling and Classes', () => {
    it('should have correct CSS classes for the main section', () => {
      render(<Hero />)
      
      const heroSection = screen.getByText('healthy corner').closest('section')
      expect(heroSection).toHaveClass('relative', 'min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-neutral-900')
    })

    it('should have correct styling for the brand name', () => {
      render(<Hero />)
      
      const brandName = screen.getByText('healthy corner')
      expect(brandName).toHaveClass('text-5xl', 'md:text-7xl', 'lg:text-8xl', 'font-bold', 'mb-6', 'text-white', 'lowercase')
    })

    it('should have correct styling for the tagline', () => {
      render(<Hero />)
      
      const tagline = screen.getByText('ALPSKI ZDRAVILIŠKI KAMP')
      expect(tagline).toHaveClass('text-sm', 'md:text-base', 'text-white/90', 'mb-12', 'uppercase')
    })

    it('should have correct styling for the CTA button', () => {
      render(<Hero />)
      
      const ctaButton = screen.getByText('Explore Services')
      expect(ctaButton).toHaveClass(
        'inline-block',
        'bg-[#A4B82C]',
        'hover:bg-[#8A9824]',
        'text-white',
        'font-bold',
        'py-4',
        'px-10',
        'rounded-lg',
        'transition-all',
        'duration-300',
        'hover:scale-105'
      )
    })
  })

  describe('Internationalization', () => {
    it('should use translations for CTA text', () => {
      render(<Hero />)
      
      expect(mockUseTranslations).toHaveBeenCalledWith('hero')
      expect(mockT).toHaveBeenCalledWith('cta')
    })

    it('should generate correct href for different locales', () => {
      mockUseParams.mockReturnValue({ locale: 'sl' })
      
      render(<Hero />)
      
      const ctaButton = screen.getByText('Explore Services')
      expect(ctaButton).toHaveAttribute('href', '/sl/services')
    })

    it('should default to English locale when no locale is provided', () => {
      mockUseParams.mockReturnValue({})
      
      render(<Hero />)
      
      const ctaButton = screen.getByText('Explore Services')
      expect(ctaButton).toHaveAttribute('href', '/en/services')
    })

    it('should handle different locale values correctly', () => {
      const locales = ['en', 'sl', 'nl', 'de']
      
      locales.forEach(locale => {
        mockUseParams.mockReturnValue({ locale })
        
        render(<Hero />)
        
        const ctaButton = screen.getByText('Explore Services')
        expect(ctaButton).toHaveAttribute('href', `/${locale}/services`)
        
        // Clean up for next iteration
        document.body.innerHTML = ''
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      render(<Hero />)
      
      const logoImage = screen.getByAltText('healthy corner')
      const backgroundImage = screen.getByAltText('Healthy Corner Background')
      
      expect(logoImage).toBeInTheDocument()
      expect(backgroundImage).toBeInTheDocument()
    })

    it('should have semantic HTML structure', () => {
      render(<Hero />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('healthy corner')
      
      const link = screen.getByRole('link')
      expect(link).toHaveTextContent('Explore Services')
    })

    it('should have proper heading hierarchy', () => {
      render(<Hero />)
      
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
      expect(h1).toHaveTextContent('healthy corner')
    })
  })

  describe('Image Optimization', () => {
    it('should set priority for hero images', () => {
      render(<Hero />)
      
      const logoImage = screen.getByAltText('healthy corner')
      const backgroundImage = screen.getByAltText('Healthy Corner Background')
      
      expect(logoImage).toHaveAttribute('priority', 'true')
      expect(backgroundImage).toHaveAttribute('priority', 'true')
    })

    it('should have proper image sizing attributes', () => {
      render(<Hero />)
      
      const logoImage = screen.getByAltText('healthy corner')
      expect(logoImage).toHaveAttribute('sizes', '(max-width: 768px) 128px, 160px')
      
      const backgroundImage = screen.getByAltText('Healthy Corner Background')
      expect(backgroundImage).toHaveAttribute('sizes', '100vw')
    })

    it('should set appropriate quality for background image', () => {
      render(<Hero />)
      
      const backgroundImage = screen.getByAltText('Healthy Corner Background')
      expect(backgroundImage).toHaveAttribute('quality', '85')
    })
  })

  describe('Brand Consistency', () => {
    it('should use correct brand colors', () => {
      render(<Hero />)
      
      const ctaButton = screen.getByText('Explore Services')
      expect(ctaButton).toHaveClass('bg-[#A4B82C]', 'hover:bg-[#8A9824]')
    })

    it('should use lowercase brand name styling', () => {
      render(<Hero />)
      
      const brandName = screen.getByText('healthy corner')
      expect(brandName).toHaveClass('lowercase')
    })

    it('should use correct typography hierarchy', () => {
      render(<Hero />)
      
      const brandName = screen.getByText('healthy corner')
      const tagline = screen.getByText('ALPSKI ZDRAVILIŠKI KAMP')
      
      expect(brandName).toHaveClass('text-5xl', 'md:text-7xl', 'lg:text-8xl')
      expect(tagline).toHaveClass('text-sm', 'md:text-base')
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive text sizes', () => {
      render(<Hero />)
      
      const brandName = screen.getByText('healthy corner')
      expect(brandName).toHaveClass('text-5xl', 'md:text-7xl', 'lg:text-8xl')
      
      const tagline = screen.getByText('ALPSKI ZDRAVILIŠKI KAMP')
      expect(tagline).toHaveClass('text-sm', 'md:text-base')
    })

    it('should have responsive logo sizing', () => {
      render(<Hero />)
      
      const logoContainer = screen.getByAltText('healthy corner').parentElement
      expect(logoContainer).toHaveClass('w-32', 'h-32', 'md:w-40', 'md:h-40')
    })

    it('should have proper responsive padding and margins', () => {
      render(<Hero />)
      
      const contentContainer = screen.getByText('healthy corner').closest('.relative.z-10')
      expect(contentContainer).toHaveClass('px-4', 'py-20', 'max-w-4xl', 'mx-auto')
    })
  })

  describe('Animation and Interactions', () => {
    it('should render motion components without errors', () => {
      // Since we mocked framer-motion, this test ensures the component renders
      // without throwing errors when motion components are present
      expect(() => render(<Hero />)).not.toThrow()
    })

    it('should have hover effects on CTA button', () => {
      render(<Hero />)
      
      const ctaButton = screen.getByText('Explore Services')
      expect(ctaButton).toHaveClass('hover:bg-[#8A9824]', 'hover:scale-105')
    })
  })
})

// Test helpers for component testing
export const heroTestHelpers = {
  renderWithLocale: (locale: string = 'en') => {
    mockUseParams.mockReturnValue({ locale })
    return render(<Hero />)
  },
  
  mockTranslations: (translations: Record<string, string>) => {
    const mockT = jest.fn() as any
    mockT.mockImplementation((key: string) => translations[key] || key)
    mockUseTranslations.mockReturnValue(mockT)
  },
  
  getHeroElements: () => ({
    section: screen.getByText('healthy corner').closest('section'),
    brandName: screen.getByText('healthy corner'),
    tagline: screen.getByText('ALPSKI ZDRAVILIŠKI KAMP'),
    ctaButton: screen.getByRole('link'),
    logoImage: screen.getByAltText('healthy corner'),
    backgroundImage: screen.getByAltText('Healthy Corner Background')
  })
}
