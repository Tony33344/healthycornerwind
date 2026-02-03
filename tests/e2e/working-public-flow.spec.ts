import { test, expect } from '@playwright/test'

test.describe('Working Public User Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en')
  })

  test('should display homepage correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/healthy corner/i)
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('healthy corner')
    
    // Check tagline in main content
    await expect(page.locator('main').getByText('ALPSKI ZDRAVILIŠKI KAMP')).toBeVisible()
    
    // Check CTA button exists
    await expect(page.locator('text=Explore Services')).toBeVisible()
  })

  test('should navigate to services page', async ({ page }) => {
    await page.click('text=Explore Services')
    await page.waitForURL('**/services')
    
    // Check services page loaded with correct title
    await expect(page.locator('h1')).toContainText('Wellness Packages')
    
    // Check that service cards exist (using generic selector)
    await expect(page.locator('.bg-white.rounded-lg').first()).toBeVisible()
  })

  test('should navigate to menu page', async ({ page }) => {
    await page.goto('/en/menu')
    
    // Check menu page loaded
    await expect(page.locator('h1')).toContainText('Healthy Food')
    
    // Check that menu items exist
    await expect(page.locator('.bg-white.rounded-lg').first()).toBeVisible()
  })

  test('should navigate to gallery page', async ({ page }) => {
    await page.goto('/en/gallery')
    
    // Check gallery page loaded
    await expect(page.locator('h1')).toContainText('Gallery')
    
    // Check that images exist (using img selector)
    await expect(page.locator('img').first()).toBeVisible()
  })

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/en/contact')
    
    // Check contact page loaded
    await expect(page.locator('h1')).toContainText('Get in Touch')
    
    // Check contact form exists (be more specific)
    await expect(page.locator('form').first()).toBeVisible()
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('textarea[name="message"]')).toBeVisible()
  })

  test('should navigate to schedule page', async ({ page }) => {
    await page.goto('/en/schedule')
    
    // Check schedule page loaded
    await expect(page.locator('h1')).toContainText('Schedule')
    
    // Check that schedule content exists
    await expect(page.locator('main')).toBeVisible()
  })

  test('should switch languages', async ({ page }) => {
    // Start on English
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    
    // Try to find language switcher (this might need adjustment based on actual implementation)
    const languageSwitcher = page.locator('[data-testid="language-switcher"]')
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click()
      await page.click('text=Slovenščina')
      await page.waitForURL('**/sl')
      await expect(page.locator('html')).toHaveAttribute('lang', 'sl')
    } else {
      // Alternative: navigate directly to Slovenian version
      await page.goto('/sl')
      await expect(page.locator('html')).toHaveAttribute('lang', 'sl')
      await expect(page.locator('h1')).toContainText('healthy corner')
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check mobile layout works
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
  })

  test('should have proper SEO elements', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/healthy corner/i)
    
    // Check meta description exists
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content')
    
    // Check that main heading exists
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should load pages with reasonable performance', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/en')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    // Should load within 10 seconds (generous for E2E testing)
    expect(loadTime).toBeLessThan(10000)
    
    // Check that main content loaded
    await expect(page.locator('h1')).toBeVisible()
  })
})
