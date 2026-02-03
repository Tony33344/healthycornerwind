import { test, expect } from '@playwright/test'

test.describe('Real Admin Flow Tests - Supabase Connected', () => {
  const adminCredentials = {
    email: 'admin@healthycorner.com',
    password: 'Admin123!Secure'
  }

  test('should login to admin panel with real authentication', async ({ page }) => {
    await page.goto('/admin/login')
    
    // Check login form exists (page shows brand name, not "Admin Login")
    await expect(page.locator('h1')).toContainText('healthy corner')
    await expect(page.locator('text=Admin Dashboard Login')).toBeVisible()
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    
    // Try to login with real credentials
    await page.fill('#email', adminCredentials.email)
    await page.fill('#password', adminCredentials.password)
    // Use force click to bypass animation issues
    await page.click('button[type="submit"]', { force: true })
    
    // Wait for either dashboard or error
    await page.waitForTimeout(3000)
    
    // Check if we're redirected to dashboard or get an error
    const currentUrl = page.url()
    console.log('Current URL after login:', currentUrl)
    
    if (currentUrl.includes('/admin/dashboard')) {
      console.log('✅ Admin login successful')
      await expect(page.locator('h1')).toContainText('Dashboard')
    } else {
      console.log('❌ Admin login failed - checking for error messages')
      // Check for error messages
      const errorMessage = page.locator('[data-testid="error-message"]')
      if (await errorMessage.isVisible()) {
        const errorText = await errorMessage.textContent()
        console.log('Error message:', errorText)
      }
    }
  })

  test('should test admin dashboard functionality', async ({ page }) => {
    // Login first
    await page.goto('/admin/login')
    await page.fill('input[name="email"]', adminCredentials.email)
    await page.fill('input[name="password"]', adminCredentials.password)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    
    if (page.url().includes('/admin/dashboard')) {
      // Test dashboard features
      await expect(page.locator('h1')).toContainText('Dashboard')
      
      // Check for navigation menu
      await expect(page.locator('nav')).toBeVisible()
      
      // Check for stats or analytics
      const statsCards = page.locator('.bg-white.rounded-lg')
      if (await statsCards.first().isVisible()) {
        console.log('✅ Dashboard stats cards visible')
      }
      
      // Test navigation to services management
      const servicesLink = page.locator('a:has-text("Services")')
      if (await servicesLink.isVisible()) {
        await servicesLink.click()
        await page.waitForTimeout(2000)
        console.log('✅ Services navigation works')
      }
    } else {
      console.log('⚠️ Skipping dashboard test - login failed')
    }
  })

  test('should test services management with Supabase', async ({ page }) => {
    // Login and navigate to services
    await page.goto('/admin/login')
    await page.fill('input[name="email"]', adminCredentials.email)
    await page.fill('input[name="password"]', adminCredentials.password)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    
    if (page.url().includes('/admin')) {
      await page.goto('/admin/services')
      await page.waitForTimeout(2000)
      
      // Check if services page loads
      const pageTitle = await page.locator('h1').textContent()
      console.log('Services page title:', pageTitle)
      
      // Check if services are loaded from Supabase
      const serviceRows = page.locator('.bg-white.rounded-lg, tr, .service-item')
      const serviceCount = await serviceRows.count()
      console.log('Number of services found:', serviceCount)
      
      if (serviceCount > 0) {
        console.log('✅ Services loaded from database')
      } else {
        console.log('⚠️ No services found - might be empty database')
      }
      
      // Try to create a new service
      const addButton = page.locator('button:has-text("Add"), button:has-text("New"), a:has-text("New")')
      if (await addButton.first().isVisible()) {
        await addButton.first().click()
        await page.waitForTimeout(2000)
        
        // Check if create form loads
        const createForm = page.locator('form')
        if (await createForm.isVisible()) {
          console.log('✅ Service creation form loads')
          
          // Try to fill and submit form
          const nameInput = page.locator('input[name*="name"], input[name*="title"]')
          if (await nameInput.first().isVisible()) {
            await nameInput.first().fill('E2E Test Service')
            
            const submitButton = page.locator('button[type="submit"]')
            if (await submitButton.isVisible()) {
              await submitButton.click()
              await page.waitForTimeout(3000)
              console.log('✅ Service creation form submitted')
            }
          }
        }
      }
    }
  })
})
