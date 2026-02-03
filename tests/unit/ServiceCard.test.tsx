import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useTranslations } from 'next-intl'
import ServiceCard from '../../app/components/ServiceCard'
import { Service } from '../../app/types/service'

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn()
}))

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, fill, className, sizes, ...props }: any) {
    return <img 
      src={src} 
      alt={alt} 
      className={className}
      sizes={sizes}
      data-fill={fill ? 'true' : undefined}
      {...props} 
    />
  }
})

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, whileInView, viewport, whileHover, transition, className, ...props }: any) => 
      <div className={className} data-testid="motion-div" {...props}>{children}</div>
  }
}))

// Mock formatPrice helper
jest.mock('../../lib/utils/helpers', () => ({
  formatPrice: jest.fn((price: number) => `€${price.toFixed(2)}`)
}))

// Mock brand constants
jest.mock('../../lib/constants/brand', () => ({
  IMAGE_SIZES: {
    service: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }
}))

const mockUseTranslations = useTranslations as jest.MockedFunction<typeof useTranslations>

describe('ServiceCard Component', () => {
  const mockT = jest.fn() as any
  
  const mockService: Service = {
    id: 'service-1',
    name_sl: 'Jutranjo joga',
    name_nl: 'Ochtend yoga',
    name_en: 'Morning Yoga',
    name_de: 'Morgen Yoga',
    description_sl: 'Sproščujoča jutranjo joga za začetek dneva',
    description_nl: 'Ontspannende ochtendyoga om de dag te beginnen',
    description_en: 'Relaxing morning yoga to start your day',
    description_de: 'Entspannende Morgenyoga für den Tagesstart',
    price: 25.00,
    duration: 60,
    capacity: 12,
    category: 'Yoga' as any,
    image_url: '/images/morning-yoga.jpg',
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: null
  }

  beforeEach(() => {
    mockUseTranslations.mockReturnValue(mockT)
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'capacity': 'people',
        'bookNow': 'Book Now'
      }
      return translations[key] || key
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the service card', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const serviceCard = screen.getByText('Morning Yoga').closest('div')
      expect(serviceCard).toBeInTheDocument()
    })

    it('should render service name in correct locale', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      expect(screen.getByText('Morning Yoga')).toBeInTheDocument()
      
      render(<ServiceCard service={mockService} locale="sl" />)
      expect(screen.getByText('Jutranjo joga')).toBeInTheDocument()
      
      render(<ServiceCard service={mockService} locale="nl" />)
      expect(screen.getByText('Ochtend yoga')).toBeInTheDocument()
      
      render(<ServiceCard service={mockService} locale="de" />)
      expect(screen.getByText('Morgen Yoga')).toBeInTheDocument()
    })

    it('should render service description in correct locale', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      expect(screen.getByText('Relaxing morning yoga to start your day')).toBeInTheDocument()
      
      render(<ServiceCard service={mockService} locale="sl" />)
      expect(screen.getByText('Sproščujoča jutranjo joga za začetek dneva')).toBeInTheDocument()
    })

    it('should render service image when image_url is provided', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const image = screen.getByAltText('Morning Yoga')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/images/morning-yoga.jpg')
    })

    it('should render placeholder when no image_url is provided', () => {
      const serviceWithoutImage = { ...mockService, image_url: null }
      render(<ServiceCard service={serviceWithoutImage} locale="en" />)
      
      const placeholder = document.querySelector('.bg-neutral-100')
      expect(placeholder).toBeInTheDocument()
      
      const placeholderIcon = document.querySelector('svg')
      expect(placeholderIcon).toBeInTheDocument()
    })

    it('should render category badge', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const categoryBadge = screen.getByText('Yoga')
      expect(categoryBadge).toBeInTheDocument()
    })

    it('should render price', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const price = screen.getByText('€25.00')
      expect(price).toBeInTheDocument()
    })

    it('should render book now button', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const bookButton = screen.getByText('Book Now')
      expect(bookButton).toBeInTheDocument()
      expect(bookButton.tagName).toBe('BUTTON')
    })
  })

  describe('Service Meta Information', () => {
    it('should render duration when provided', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const duration = screen.getByText('60 min')
      expect(duration).toBeInTheDocument()
    })

    it('should render capacity when provided', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const capacity = screen.getByText('12 people')
      expect(capacity).toBeInTheDocument()
    })

    it('should not render duration when not provided', () => {
      const serviceWithoutDuration = { ...mockService, duration: null }
      render(<ServiceCard service={serviceWithoutDuration} locale="en" />)
      
      expect(screen.queryByText(/min/)).not.toBeInTheDocument()
    })

    it('should not render capacity when not provided', () => {
      const serviceWithoutCapacity = { ...mockService, capacity: null }
      render(<ServiceCard service={serviceWithoutCapacity} locale="en" />)
      
      expect(screen.queryByText(/people/)).not.toBeInTheDocument()
    })

    it('should not render description when not provided', () => {
      const serviceWithoutDescription = { 
        ...mockService, 
        description_en: null,
        description_sl: null,
        description_nl: null,
        description_de: null
      }
      render(<ServiceCard service={serviceWithoutDescription} locale="en" />)
      
      expect(screen.queryByText(/Relaxing/)).not.toBeInTheDocument()
    })
  })

  describe('Styling and Classes', () => {
    it('should have correct CSS classes for the card', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const card = screen.getByTestId('motion-div')
      expect(card).toHaveClass(
        'bg-white',
        'rounded-lg',
        'overflow-hidden',
        'shadow-lg',
        'hover:shadow-2xl',
        'transition-shadow',
        'duration-300'
      )
    })

    it('should have correct styling for service name', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const serviceName = screen.getByText('Morning Yoga')
      expect(serviceName).toHaveClass('text-2xl', 'font-bold', 'mb-2', 'text-neutral-900')
    })

    it('should have correct styling for description', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const description = screen.getByText('Relaxing morning yoga to start your day')
      expect(description).toHaveClass('text-neutral-600', 'mb-4', 'line-clamp-2')
    })

    it('should have correct styling for price', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const price = screen.getByText('€25.00')
      expect(price).toHaveClass('text-3xl', 'font-bold', 'text-primary')
    })

    it('should have correct styling for book button', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const bookButton = screen.getByText('Book Now')
      expect(bookButton).toHaveClass(
        'bg-primary',
        'hover:bg-primary-dark',
        'text-white',
        'font-bold',
        'py-2',
        'px-6',
        'rounded-lg',
        'transition-colors',
        'duration-300'
      )
    })

    it('should have correct styling for category badge', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const categoryBadge = screen.getByText('Yoga')
      expect(categoryBadge).toHaveClass(
        'absolute',
        'top-4',
        'right-4',
        'bg-primary',
        'text-white',
        'px-3',
        'py-1',
        'rounded-full',
        'text-sm',
        'font-bold'
      )
    })
  })

  describe('Image Handling', () => {
    it('should set correct image attributes', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const image = screen.getByAltText('Morning Yoga')
      expect(image).toHaveAttribute('data-fill', 'true')
      expect(image).toHaveAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw')
      expect(image).toHaveClass('object-cover')
    })

    it('should have correct image container styling', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const imageContainer = screen.getByAltText('Morning Yoga').parentElement
      expect(imageContainer).toHaveClass('relative', 'h-64', 'bg-neutral-200')
    })

    it('should render placeholder with correct styling when no image', () => {
      const serviceWithoutImage = { ...mockService, image_url: null }
      render(<ServiceCard service={serviceWithoutImage} locale="en" />)
      
      const placeholder = document.querySelector('.bg-neutral-100')
      expect(placeholder).toHaveClass(
        'absolute',
        'inset-0',
        'flex',
        'items-center',
        'justify-center',
        'bg-neutral-100'
      )
      
      const icon = placeholder?.querySelector('svg')
      expect(icon).toHaveClass('w-16', 'h-16', 'text-neutral-400')
    })
  })

  describe('Internationalization', () => {
    it('should use translations for capacity text', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      expect(mockUseTranslations).toHaveBeenCalledWith('services')
      expect(mockT).toHaveBeenCalledWith('capacity')
    })

    it('should use translations for book button text', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      expect(mockT).toHaveBeenCalledWith('bookNow')
    })

    it('should handle different locales correctly', () => {
      const locales = ['en', 'sl', 'nl', 'de']
      const expectedNames = ['Morning Yoga', 'Jutranjo joga', 'Ochtend yoga', 'Morgen Yoga']
      
      locales.forEach((locale, index) => {
        render(<ServiceCard service={mockService} locale={locale} />)
        expect(screen.getByText(expectedNames[index])).toBeInTheDocument()
        
        // Clean up for next iteration
        document.body.innerHTML = ''
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper alt text for service image', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const image = screen.getByAltText('Morning Yoga')
      expect(image).toBeInTheDocument()
    })

    it('should have semantic HTML structure', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('Morning Yoga')
      
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Book Now')
    })

    it('should have proper heading hierarchy', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const h3 = screen.getByRole('heading', { level: 3 })
      expect(h3).toBeInTheDocument()
      expect(h3).toHaveTextContent('Morning Yoga')
    })
  })

  describe('Brand Consistency', () => {
    it('should use primary brand color for category badge', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const categoryBadge = screen.getByText('Yoga')
      expect(categoryBadge).toHaveClass('bg-primary', 'text-white')
    })

    it('should use primary brand color for price', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const price = screen.getByText('€25.00')
      expect(price).toHaveClass('text-primary')
    })

    it('should use primary brand colors for CTA button', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const button = screen.getByText('Book Now')
      expect(button).toHaveClass('bg-primary', 'hover:bg-primary-dark')
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive image sizing', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const image = screen.getByAltText('Morning Yoga')
      expect(image).toHaveAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw')
    })

    it('should have proper responsive layout classes', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const imageContainer = screen.getByAltText('Morning Yoga').parentElement
      expect(imageContainer).toHaveClass('h-64')
      
      const contentContainer = screen.getByText('Morning Yoga').parentElement
      expect(contentContainer).toHaveClass('p-6')
    })
  })

  describe('Animation and Interactions', () => {
    it('should render motion components without errors', () => {
      // Since we mocked framer-motion, this test ensures the component renders
      // without throwing errors when motion components are present
      expect(() => render(<ServiceCard service={mockService} locale="en" />)).not.toThrow()
    })

    it('should have hover effects', () => {
      render(<ServiceCard service={mockService} locale="en" />)
      
      const card = screen.getByTestId('motion-div')
      expect(card).toHaveClass('hover:shadow-2xl')
      
      const button = screen.getByText('Book Now')
      expect(button).toHaveClass('hover:bg-primary-dark')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing optional fields gracefully', () => {
      const minimalService: Service = {
        ...mockService,
        description_en: null,
        description_sl: null,
        description_nl: null,
        description_de: null,
        duration: null,
        capacity: null,
        image_url: null
      }
      
      expect(() => render(<ServiceCard service={minimalService} locale="en" />)).not.toThrow()
      
      expect(screen.getByText('Morning Yoga')).toBeInTheDocument()
      expect(screen.getByText('€25.00')).toBeInTheDocument()
      expect(screen.getByText('Book Now')).toBeInTheDocument()
    })

    it('should handle zero price', () => {
      const freeService = { ...mockService, price: 0 }
      render(<ServiceCard service={freeService} locale="en" />)
      
      expect(screen.getByText('€0.00')).toBeInTheDocument()
    })

    it('should handle very long service names', () => {
      const longNameService = { 
        ...mockService, 
        name_en: 'Very Long Service Name That Should Still Display Properly'
      }
      render(<ServiceCard service={longNameService} locale="en" />)
      
      expect(screen.getByText('Very Long Service Name That Should Still Display Properly')).toBeInTheDocument()
    })
  })
})

// Test helpers for ServiceCard testing
export const serviceCardTestHelpers = {
  createMockService: (overrides: Partial<Service> = {}): Service => ({
    id: 'test-service',
    name_sl: 'Test Storitev',
    name_nl: 'Test Service',
    name_en: 'Test Service',
    name_de: 'Test Service',
    description_sl: 'Test opis',
    description_nl: 'Test beschrijving',
    description_en: 'Test description',
    description_de: 'Test Beschreibung',
    price: 25.00,
    duration: 60,
    capacity: 10,
    category: 'Yoga' as any,
    image_url: '/test-image.jpg',
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: null,
    ...overrides
  }),
  
  renderWithLocale: (service: Service, locale: string = 'en') => {
    return render(<ServiceCard service={service} locale={locale} />)
  },
  
  getServiceCardElements: () => ({
    card: screen.getByText(/test service/i).closest('div'),
    name: screen.getByRole('heading', { level: 3 }),
    price: screen.getByText(/€/),
    button: screen.getByRole('button'),
    image: screen.queryByRole('img'),
    category: screen.getByText(/yoga/i)
  })
}
