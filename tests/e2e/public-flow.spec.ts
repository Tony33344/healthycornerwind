import { test, expect } from '@playwright/test'

test.describe('Public User Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/en')
  })

  test('should display homepage with hero section', async ({ page }) => {
    // Check if hero section is visible
    await expect(page.locator('h1')).toContainText('healthy corner')
    
    // Check if tagline is visible (be more specific to avoid multiple matches)
    await expect(page.locator('main').getByText('ALPSKI ZDRAVILIŠKI KAMP')).toBeVisible()
    
    // Check if CTA button is visible
    await expect(page.locator('text=Explore Services')).toBeVisible()
    
    // Check if logo is visible
    await expect(page.locator('img[alt="healthy corner"]')).toBeVisible()
  })

  test('should navigate to services page', async ({ page }) => {
    // Click on services link in navigation or CTA
    await page.click('text=Explore Services')
    
    // Wait for navigation
    await page.waitForURL('**/services')
    
    // Check if services page loaded
    await expect(page.locator('h1')).toContainText('Wellness Packages')
    
    // Check if service cards are visible (use actual class or structure)
    await expect(page.locator('.bg-white.rounded-lg').first()).toBeVisible()
  })

  test('should browse services and view details', async ({ page }) => {
    // Navigate to services
    await page.goto('/en/services')
    
    // Wait for services to load
    await page.waitForSelector('.bg-white.rounded-lg')
    
    // Check if multiple services are displayed
    const serviceCards = page.locator('.bg-white.rounded-lg')
    const serviceCount = await serviceCards.count()
    expect(serviceCount).toBeGreaterThan(0)
    
    // Check service card content
    const firstCard = serviceCards.first()
    await expect(firstCard.locator('h3')).toBeVisible()
    await expect(firstCard.locator('text=€')).toBeVisible()
    await expect(firstCard.locator('button')).toContainText('Book Now')
  })

  test('should navigate to menu page', async ({ page }) => {
    // Navigate to menu
    await page.goto('/en/menu')
    
    // Check if menu page loaded
    await expect(page.locator('h1')).toContainText('Healthy Food')
    
    // Check if menu items are visible (use actual class or structure)
    await expect(page.locator('.bg-white.rounded-lg').first()).toBeVisible()
  })

  test('should browse menu items', async ({ page }) => {
    // Navigate to menu
    await page.goto('/en/menu')
    
    // Wait for menu items to load
    await page.waitForSelector('.bg-white.rounded-lg')
    
    // Check if multiple menu items are displayed
    const menuItems = page.locator('.bg-white.rounded-lg')
    const menuCount = await menuItems.count()
    expect(menuCount).toBeGreaterThan(0)
    
    // Check menu item content
    const firstItem = menuItems.first()
    await expect(firstItem.locator('h3')).toBeVisible()
    await expect(firstItem.locator('text=€')).toBeVisible()
    await expect(firstItem.locator('button')).toContainText('Add to Cart')
  })

  test('should add items to shopping cart', async ({ page }) => {
    // Navigate to menu
    await page.goto('/en/menu')
    
    // Wait for menu items
    await page.waitForSelector('[data-testid="menu-item"]')
    
    // Add first item to cart
    await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
    
    // Check if cart icon shows item count
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1')
    
    // Add another item
    await page.click('[data-testid="menu-item"]:nth-child(2) button:has-text("Add to Cart")')
    
    // Check updated cart count
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('2')
  })

  test('should view shopping cart', async ({ page }) => {
    // Navigate to menu and add items
    await page.goto('/en/menu')
    await page.waitForSelector('[data-testid="menu-item"]')
    await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
    
    // Open cart
    await page.click('[data-testid="cart-button"]')
    
    // Check if cart modal/page opens
    await expect(page.locator('[data-testid="cart-modal"]')).toBeVisible()
    
    // Check if cart items are displayed
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)
    
    // Check if total is displayed
    await expect(page.locator('[data-testid="cart-total"]')).toBeVisible()
  })

  test('should proceed to checkout', async ({ page }) => {
    // Add item to cart first
    await page.goto('/en/menu')
    await page.waitForSelector('[data-testid="menu-item"]')
    await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
    
    // Open cart and proceed to checkout
    await page.click('[data-testid="cart-button"]')
    await page.click('text=Checkout')
    
    // Check if checkout page loads
    await page.waitForURL('**/checkout')
    await expect(page.locator('h1')).toContainText('Checkout')
    
    // Check if checkout form is present
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="name"]')).toBeVisible()
  })

  test('should switch languages', async ({ page }) => {
    // Start on English page
    await page.goto('/en')
    
    // Check current language
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    
    // Switch to Slovenian
    await page.click('[data-testid="language-switcher"]')
    await page.click('text=Slovenščina')
    
    // Check if URL changed
    await page.waitForURL('**/sl')
    await expect(page.locator('html')).toHaveAttribute('lang', 'sl')
    
    // Check if content changed to Slovenian
    await expect(page.locator('text=ALPSKI ZDRAVILIŠKI KAMP')).toBeVisible()
  })

  test('should navigate to schedule page', async ({ page }) => {
    // Navigate to schedule
    await page.goto('/en/schedule')
    
    // Check if schedule page loaded
    await expect(page.locator('h1')).toContainText('Schedule')
    
    // Check if schedule items are visible
    await expect(page.locator('[data-testid="schedule-item"]').first()).toBeVisible()
  })

  test('should view schedule and book session', async ({ page }) => {
    // Navigate to schedule
    await page.goto('/en/schedule')
    
    // Wait for schedule items
    await page.waitForSelector('[data-testid="schedule-item"]')
    
    // Check schedule content
    const scheduleItems = page.locator('[data-testid="schedule-item"]')
    const scheduleCount = await scheduleItems.count()
    expect(scheduleCount).toBeGreaterThan(0)
    
    // Click book button on first available session
    await page.click('[data-testid="schedule-item"]:first-child button:has-text("Book")')
    
    // Check if booking modal or form appears
    await expect(page.locator('[data-testid="booking-modal"]')).toBeVisible()
  })

  test('should navigate to gallery', async ({ page }) => {
    // Navigate to gallery
    await page.goto('/en/gallery')
    
    // Check if gallery page loaded
    await expect(page.locator('h1')).toContainText('Gallery')
    
    // Check if gallery images are visible
    await expect(page.locator('[data-testid="gallery-image"]').first()).toBeVisible()
  })

  test('should view gallery images', async ({ page }) => {
    // Navigate to gallery
    await page.goto('/en/gallery')
    
    // Wait for images to load
    await page.waitForSelector('[data-testid="gallery-image"]')
    
    // Check if multiple images are displayed
    const galleryImages = page.locator('[data-testid="gallery-image"]')
    const imageCount = await galleryImages.count()
    expect(imageCount).toBeGreaterThan(0)
    
    // Click on first image to open lightbox
    await page.click('[data-testid="gallery-image"]:first-child')
    
    // Check if lightbox opens
    await expect(page.locator('[data-testid="lightbox"]')).toBeVisible()
  })

  test('should navigate to contact page', async ({ page }) => {
    // Navigate to contact
    await page.goto('/en/contact')
    
    // Check if contact page loaded
    await expect(page.locator('h1')).toContainText('Contact')
    
    // Check if contact form is visible
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('textarea[name="message"]')).toBeVisible()
  })

  test('should submit contact form', async ({ page }) => {
    // Navigate to contact
    await page.goto('/en/contact')
    
    // Fill out contact form
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="phone"]', '+386 31 123 456')
    await page.fill('textarea[name="message"]', 'This is a test message from E2E testing.')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Check for success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })

  test('should subscribe to newsletter', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/en')
    
    // Find newsletter signup form
    await expect(page.locator('[data-testid="newsletter-form"]')).toBeVisible()
    
    // Fill email and submit
    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button:has-text("Subscribe")')
    
    // Check for success message
    await expect(page.locator('[data-testid="newsletter-success"]')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Navigate to homepage
    await page.goto('/en')
    
    // Check if mobile menu toggle is visible
    await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible()
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-toggle"]')
    
    // Check if mobile menu is visible
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    
    // Check if navigation links are visible in mobile menu
    await expect(page.locator('[data-testid="mobile-menu"] a:has-text("Services")')).toBeVisible()
    await expect(page.locator('[data-testid="mobile-menu"] a:has-text("Menu")')).toBeVisible()
  })

  test('should handle 404 pages gracefully', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/en/non-existent-page')
    
    // Check if 404 page is displayed
    await expect(page.locator('h1')).toContainText('404')
    
    // Check if back to home link is available
    await expect(page.locator('a:has-text("Back to Home")')).toBeVisible()
  })

  test('should load pages with good performance', async ({ page }) => {
    // Navigate to homepage and measure performance
    const startTime = Date.now()
    await page.goto('/en')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    // Check if page loads within reasonable time (5 seconds)
    expect(loadTime).toBeLessThan(5000)
    
    // Check if hero image is loaded
    await expect(page.locator('img[alt="Healthy Corner Background"]')).toBeVisible()
    
    // Check if logo is loaded
    await expect(page.locator('img[alt="healthy corner"]')).toBeVisible()
  })

  test('should have proper SEO elements', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/en')
    
    // Check if title is set
    await expect(page).toHaveTitle(/healthy corner/i)
    
    // Check if meta description exists
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content')
    
    // Check if hreflang tags exist for multilingual support
    const hreflangTags = page.locator('link[hreflang]')
    const hreflangCount = await hreflangTags.count()
    expect(hreflangCount).toBeGreaterThan(0)
  })
})

// Test utilities for E2E testing
export const e2eTestUtils = {
  // Helper to wait for cart count to update
  waitForCartCount: async (page: any, expectedCount: number) => {
    await page.waitForFunction(
      (count) => document.querySelector('[data-testid="cart-count"]')?.textContent === count.toString(),
      expectedCount
    )
  },
  
  // Helper to add multiple items to cart
  addMultipleItemsToCart: async (page: any, itemCount: number) => {
    await page.goto('/en/menu')
    await page.waitForSelector('[data-testid="menu-item"]')
    
    for (let i = 0; i < itemCount; i++) {
      await page.click(`[data-testid="menu-item"]:nth-child(${i + 1}) button:has-text("Add to Cart")`)
      await e2eTestUtils.waitForCartCount(page, i + 1)
    }
  },
  
  // Helper to switch language
  switchLanguage: async (page: any, language: 'en' | 'sl' | 'nl' | 'de') => {
    await page.click('[data-testid="language-switcher"]')
    
    const languageMap = {
      en: 'English',
      sl: 'Slovenščina', 
      nl: 'Nederlands',
      de: 'Deutsch'
    }
    
    await page.click(`text=${languageMap[language]}`)
    await page.waitForURL(`**/${language}`)
  },
  
  // Helper to fill contact form
  fillContactForm: async (page: any, data: {
    name: string
    email: string
    phone?: string
    message: string
  }) => {
    await page.fill('input[name="name"]', data.name)
    await page.fill('input[name="email"]', data.email)
    if (data.phone) {
      await page.fill('input[name="phone"]', data.phone)
    }
    await page.fill('textarea[name="message"]', data.message)
  }
}
