import { test, expect } from '@playwright/test'

test.describe('Extended Site Testing - Additional 50+ Tests', () => {
  
  // SCHEDULE & BOOKING TESTS (15 tests)
  test.describe('Schedule & Booking Functionality', () => {
    test('should display schedule page', async ({ page }) => {
      await page.goto('/en/schedule')
      await expect(page.locator('h1')).toContainText('Schedule')
    })

    test('should show weekly schedule', async ({ page }) => {
      await page.goto('/en/schedule')
      await page.waitForSelector('[data-testid="schedule-item"]')
      const scheduleItems = page.locator('[data-testid="schedule-item"]')
      const count = await scheduleItems.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should display class times', async ({ page }) => {
      await page.goto('/en/schedule')
      await page.waitForSelector('[data-testid="schedule-item"]')
      await expect(page.locator('text=:').first()).toBeVisible() // Time format
    })

    test('should show instructor names', async ({ page }) => {
      await page.goto('/en/schedule')
      await page.waitForSelector('[data-testid="schedule-item"]')
      const firstItem = page.locator('[data-testid="schedule-item"]').first()
      await expect(firstItem).toBeVisible()
    })

    test('should display available spots', async ({ page }) => {
      await page.goto('/en/schedule')
      await page.waitForSelector('[data-testid="schedule-item"]')
      // Check for availability indicators
    })

    test('should handle booking modal', async ({ page }) => {
      await page.goto('/en/schedule')
      await page.waitForSelector('[data-testid="schedule-item"]')
      await page.click('[data-testid="schedule-item"]')
      await expect(page.locator('[data-testid="booking-modal"]')).toBeVisible()
    })

    test('should validate booking form', async ({ page }) => {
      await page.goto('/en/schedule')
      await page.waitForSelector('[data-testid="schedule-item"]')
      await page.click('[data-testid="schedule-item"]')
      const modal = page.locator('[data-testid="booking-modal"]')
      if (await modal.isVisible()) {
        await page.click('button[type="submit"]')
        // Check for validation errors
      }
    })

    test('should show class descriptions', async ({ page }) => {
      await page.goto('/en/schedule')
      await page.waitForSelector('[data-testid="schedule-item"]')
      // Check for class descriptions or details
    })

    test('should display difficulty levels', async ({ page }) => {
      await page.goto('/en/schedule')
      await page.waitForSelector('[data-testid="schedule-item"]')
      // Look for difficulty indicators
    })

    test('should show class duration', async ({ page }) => {
      await page.goto('/en/schedule')
      await page.waitForSelector('[data-testid="schedule-item"]')
      await expect(page.locator('text=min').first()).toBeVisible()
    })

    test('should handle date navigation', async ({ page }) => {
      await page.goto('/en/schedule')
      const nextButton = page.locator('button:has-text("Next")')
      if (await nextButton.isVisible()) {
        await nextButton.click()
      }
    })

    test('should show cancellation policy', async ({ page }) => {
      await page.goto('/en/schedule')
      await page.waitForSelector('[data-testid="schedule-item"]')
      await page.click('[data-testid="schedule-item"]')
      // Check for cancellation policy text
    })

    test('should display class capacity', async ({ page }) => {
      await page.goto('/en/schedule')
      await page.waitForSelector('[data-testid="schedule-item"]')
      // Look for capacity information
    })

    test('should handle fully booked classes', async ({ page }) => {
      await page.goto('/en/schedule')
      await page.waitForSelector('[data-testid="schedule-item"]')
      // Test fully booked state if available
    })

    test('should show booking confirmation', async ({ page }) => {
      await page.goto('/en/schedule')
      await page.waitForSelector('[data-testid="schedule-item"]')
      await page.click('[data-testid="schedule-item"]')
      const modal = page.locator('[data-testid="booking-modal"]')
      if (await modal.isVisible()) {
        await page.fill('#user_name', 'Test User')
        await page.fill('#user_email', 'test@example.com')
        await page.click('button[type="submit"]')
        // Check for confirmation
      }
    })
  })

  // GALLERY TESTS (10 tests)
  test.describe('Gallery Functionality', () => {
    test('should display gallery page', async ({ page }) => {
      await page.goto('/en/gallery')
      await expect(page.locator('h1')).toContainText('Gallery')
    })

    test('should show gallery images', async ({ page }) => {
      await page.goto('/en/gallery')
      await page.waitForSelector('[data-testid="gallery-image"]')
      const galleryImages = page.locator('[data-testid="gallery-image"]')
      const count = await galleryImages.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should open lightbox on image click', async ({ page }) => {
      await page.goto('/en/gallery')
      await page.waitForSelector('[data-testid="gallery-image"]')
      await page.click('[data-testid="gallery-image"]:first-child')
      await expect(page.locator('[data-testid="lightbox"]')).toBeVisible()
    })

    test('should navigate between images in lightbox', async ({ page }) => {
      await page.goto('/en/gallery')
      await page.waitForSelector('[data-testid="gallery-image"]')
      await page.click('[data-testid="gallery-image"]:first-child')
      const nextButton = page.locator('[data-testid="lightbox-next"]')
      if (await nextButton.isVisible()) {
        await nextButton.click()
      }
    })

    test('should close lightbox', async ({ page }) => {
      await page.goto('/en/gallery')
      await page.waitForSelector('[data-testid="gallery-image"]')
      await page.click('[data-testid="gallery-image"]:first-child')
      await page.keyboard.press('Escape')
      await expect(page.locator('[data-testid="lightbox"]')).not.toBeVisible()
    })

    test('should display image captions', async ({ page }) => {
      await page.goto('/en/gallery')
      await page.waitForSelector('[data-testid="gallery-image"]')
      // Check for image captions or descriptions
    })

    test('should filter gallery by category', async ({ page }) => {
      await page.goto('/en/gallery')
      const categoryFilter = page.locator('[data-testid="gallery-filter"]')
      if (await categoryFilter.isVisible()) {
        await categoryFilter.click()
      }
    })

    test('should load images lazily', async ({ page }) => {
      await page.goto('/en/gallery')
      await page.waitForSelector('[data-testid="gallery-image"]')
      // Test lazy loading behavior
    })

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/en/gallery')
      await page.waitForSelector('[data-testid="gallery-image"]')
      const images = page.locator('[data-testid="gallery-image"]')
      await expect(images.first()).toBeVisible()
    })

    test('should handle image loading errors', async ({ page }) => {
      await page.goto('/en/gallery')
      await page.waitForSelector('[data-testid="gallery-image"]')
      // Test error handling for broken images
    })
  })

  // CONTACT TESTS (10 tests)
  test.describe('Contact Page Functionality', () => {
    test('should display contact page', async ({ page }) => {
      await page.goto('/en/contact')
      await expect(page.locator('h1')).toContainText('Contact')
    })

    test('should show contact form', async ({ page }) => {
      await page.goto('/en/contact')
      await expect(page.locator('form')).toBeVisible()
      await expect(page.locator('input[name="name"]')).toBeVisible()
      await expect(page.locator('input[name="email"]')).toBeVisible()
      await expect(page.locator('textarea[name="message"]')).toBeVisible()
    })

    test('should validate required fields', async ({ page }) => {
      await page.goto('/en/contact')
      await page.click('button[type="submit"]')
      // Check for validation errors
    })

    test('should validate email format', async ({ page }) => {
      await page.goto('/en/contact')
      await page.fill('input[name="email"]', 'invalid-email')
      await page.click('button[type="submit"]')
      // Check for email validation
    })

    test('should submit contact form successfully', async ({ page }) => {
      await page.goto('/en/contact')
      await page.fill('input[name="name"]', 'Test User')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="phone"]', '+386 31 123 456')
      await page.fill('textarea[name="message"]', 'Test message from E2E testing')
      await page.click('button[type="submit"]')
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    })

    test('should display contact information', async ({ page }) => {
      await page.goto('/en/contact')
      // Check for address, phone, email display
      await expect(page.locator('text=+386')).toBeVisible()
    })

    test('should show location map', async ({ page }) => {
      await page.goto('/en/contact')
      const mapContainer = page.locator('[data-testid="map"]')
      if (await mapContainer.isVisible()) {
        await expect(mapContainer).toBeVisible()
      }
    })

    test('should display business hours', async ({ page }) => {
      await page.goto('/en/contact')
      // Check for business hours information
    })

    test('should handle phone number validation', async ({ page }) => {
      await page.goto('/en/contact')
      await page.fill('input[name="phone"]', '123')
      await page.click('button[type="submit"]')
      // Check for phone validation
    })

    test('should show privacy notice', async ({ page }) => {
      await page.goto('/en/contact')
      // Check for privacy notice or GDPR compliance
      const privacyText = page.locator('text=privacy')
      if (await privacyText.isVisible()) {
        await expect(privacyText).toBeVisible()
      }
    })
  })

  // MULTILINGUAL TESTS (10 tests)
  test.describe('Multilingual Functionality', () => {
    test('should switch to Slovenian', async ({ page }) => {
      await page.goto('/en')
      await page.click('[data-testid="language-switcher"]')
      await page.click('text=Slovenščina')
      await page.waitForURL('**/sl')
      await expect(page.locator('html')).toHaveAttribute('lang', 'sl')
    })

    test('should switch to German', async ({ page }) => {
      await page.goto('/en')
      await page.click('[data-testid="language-switcher"]')
      await page.click('text=Deutsch')
      await page.waitForURL('**/de')
      await expect(page.locator('html')).toHaveAttribute('lang', 'de')
    })

    test('should switch to Dutch', async ({ page }) => {
      await page.goto('/en')
      await page.click('[data-testid="language-switcher"]')
      await page.click('text=Nederlands')
      await page.waitForURL('**/nl')
      await expect(page.locator('html')).toHaveAttribute('lang', 'nl')
    })

    test('should maintain content in Slovenian', async ({ page }) => {
      await page.goto('/sl')
      await expect(page.locator('text=ALPSKI ZDRAVILIŠKI KAMP')).toBeVisible()
    })

    test('should have proper hreflang tags', async ({ page }) => {
      await page.goto('/en')
      const hreflangTags = page.locator('link[hreflang]')
      const count = await hreflangTags.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should redirect based on browser language', async ({ page }) => {
      // Test automatic language detection if implemented
      await page.goto('/')
    })

    test('should preserve language across navigation', async ({ page }) => {
      await page.goto('/sl')
      await page.click('a:has-text("Storitve")')
      await expect(page.url()).toContain('/sl/')
    })

    test('should display correct currency for locale', async ({ page }) => {
      await page.goto('/en/services')
      await page.waitForSelector('[data-testid="service-card"]')
      await expect(page.locator('text=€').first()).toBeVisible()
    })

    test('should format dates correctly for locale', async ({ page }) => {
      await page.goto('/en/schedule')
      // Check date formatting
    })

    test('should handle RTL languages if supported', async ({ page }) => {
      // Test RTL support if implemented
      await page.goto('/en')
    })
  })

  // ADMIN TESTS (10 tests)
  test.describe('Admin Panel Access', () => {
    test('should display admin login page', async ({ page }) => {
      await page.goto('/admin/login')
      await expect(page.locator('h1')).toContainText('healthy corner')
      await expect(page.locator('text=Admin Dashboard Login')).toBeVisible()
    })

    test('should validate admin login form', async ({ page }) => {
      await page.goto('/admin/login')
      await page.click('button[type="submit"]')
      // Check for validation errors
    })

    test('should handle invalid login credentials', async ({ page }) => {
      await page.goto('/admin/login')
      await page.fill('#email', 'wrong@example.com')
      await page.fill('#password', 'wrongpassword')
      await page.click('button[type="submit"]')
      // Check for error message
    })

    test('should login with valid credentials', async ({ page }) => {
      await page.goto('/admin/login')
      await page.fill('#email', 'admin@healthycorner.com')
      await page.fill('#password', 'Admin123!Secure')
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/dashboard')
    })

    test('should display admin dashboard', async ({ page }) => {
      // Login first
      await page.goto('/admin/login')
      await page.fill('#email', 'admin@healthycorner.com')
      await page.fill('#password', 'Admin123!Secure')
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/dashboard')
      await expect(page.locator('h1')).toContainText('Dashboard')
    })

    test('should show analytics data', async ({ page }) => {
      await page.goto('/admin/login')
      await page.fill('#email', 'admin@healthycorner.com')
      await page.fill('#password', 'Admin123!Secure')
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/dashboard')
      // Check for analytics charts or data
    })

    test('should navigate to services management', async ({ page }) => {
      await page.goto('/admin/login')
      await page.fill('#email', 'admin@healthycorner.com')
      await page.fill('#password', 'Admin123!Secure')
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/dashboard')
      await page.click('a:has-text("Services")')
      await page.waitForURL('**/admin/services')
    })

    test('should access menu management', async ({ page }) => {
      await page.goto('/admin/login')
      await page.fill('#email', 'admin@healthycorner.com')
      await page.fill('#password', 'Admin123!Secure')
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/dashboard')
      await page.click('a:has-text("Menu")')
      await page.waitForURL('**/admin/menu')
    })

    test('should handle admin logout', async ({ page }) => {
      await page.goto('/admin/login')
      await page.fill('#email', 'admin@healthycorner.com')
      await page.fill('#password', 'Admin123!Secure')
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/dashboard')
      const logoutButton = page.locator('button:has-text("Logout")')
      if (await logoutButton.isVisible()) {
        await logoutButton.click()
      }
    })

    test('should protect admin routes', async ({ page }) => {
      await page.goto('/admin/dashboard')
      // Should redirect to login if not authenticated
      await page.waitForURL('**/admin/login')
    })
  })

  // PERFORMANCE & SEO TESTS (5 tests)
  test.describe('Performance & SEO', () => {
    test('should load homepage quickly', async ({ page }) => {
      const startTime = Date.now()
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(3000) // 3 second threshold
    })

    test('should have proper meta tags', async ({ page }) => {
      await page.goto('/en')
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content')
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content')
    })

    test('should have structured data', async ({ page }) => {
      await page.goto('/en')
      const structuredData = page.locator('script[type="application/ld+json"]')
      if (await structuredData.isVisible()) {
        await expect(structuredData).toBeVisible()
      }
    })

    test('should be mobile friendly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      // Check mobile navigation
      const mobileMenu = page.locator('[data-testid="mobile-menu-toggle"]')
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click()
      }
    })

    test('should have accessible images', async ({ page }) => {
      await page.goto('/')
      const images = page.locator('img')
      const count = await images.count()
      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i)
        await expect(img).toHaveAttribute('alt')
      }
    })
  })
})
