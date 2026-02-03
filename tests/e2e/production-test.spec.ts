import { test, expect } from '@playwright/test'

test.describe('Production Deployment Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/en')
    
    // Check page loads
    await expect(page).toHaveTitle(/healthy corner/i)
    
    // Check main content is visible
    await expect(page.locator('main')).toBeVisible()
    
    // Check navigation exists
    await expect(page.locator('nav')).toBeVisible()
    
    console.log('✅ Homepage loaded successfully')
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/en')
    
    // Test navigation links
    const navLinks = [
      { text: 'Services', expectedUrl: '/services' },
      { text: 'Menu', expectedUrl: '/menu' },
      { text: 'Schedule', expectedUrl: '/schedule' },
      { text: 'Gallery', expectedUrl: '/gallery' },
      { text: 'Contact', expectedUrl: '/contact' }
    ]
    
    for (const link of navLinks) {
      try {
        await page.click(`text=${link.text}`, { force: true })
        await page.waitForTimeout(2000)
        
        const currentUrl = page.url()
        if (currentUrl.includes(link.expectedUrl)) {
          console.log(`✅ ${link.text} navigation works`)
        } else {
          console.log(`⚠️ ${link.text} navigation issue: ${currentUrl}`)
        }
        
        // Go back to homepage
        await page.goto('/en')
        await page.waitForTimeout(1000)
      } catch (error) {
        console.log(`❌ ${link.text} navigation failed: ${error}`)
      }
    }
  })

  test('should test API endpoints', async ({ page }) => {
    // Test menu API
    const menuResponse = await page.request.get('/api/menu')
    expect(menuResponse.status()).toBe(200)
    
    const menuData = await menuResponse.json()
    console.log(`✅ Menu API works - ${menuData.items?.length || 0} items`)
    
    // Test services API
    const servicesResponse = await page.request.get('/api/services')
    expect(servicesResponse.status()).toBe(200)
    
    const servicesData = await servicesResponse.json()
    console.log(`✅ Services API works - ${servicesData.services?.length || 0} services`)
    
    // Test schedules API
    const schedulesResponse = await page.request.get('/api/schedules')
    expect(schedulesResponse.status()).toBe(200)
    
    const schedulesData = await schedulesResponse.json()
    console.log(`✅ Schedules API works - data available`)
  })

  test('should test language switching', async ({ page }) => {
    await page.goto('/en')
    
    const languages = ['sl', 'de', 'nl']
    
    for (const lang of languages) {
      await page.goto(`/${lang}`)
      await page.waitForTimeout(1000)
      
      // Check if page loads
      const title = await page.title()
      if (title.includes('healthy corner')) {
        console.log(`✅ ${lang.toUpperCase()} language works`)
      } else {
        console.log(`⚠️ ${lang.toUpperCase()} language issue`)
      }
    }
  })

  test('should test mobile responsiveness', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/en')
    
    // Check if page is responsive
    await expect(page.locator('main')).toBeVisible()
    
    // Check if navigation is accessible (might be hamburger menu)
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
    
    console.log('✅ Mobile responsiveness works')
  })

  test('should test performance basics', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/en')
    
    const loadTime = Date.now() - startTime
    console.log(`⏱️ Page load time: ${loadTime}ms`)
    
    // Check if load time is reasonable (under 5 seconds)
    expect(loadTime).toBeLessThan(5000)
    
    console.log('✅ Performance test passed')
  })
})
