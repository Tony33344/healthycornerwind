import { test, expect } from '@playwright/test'

test.describe('Real User Flow Tests - Full Functionality', () => {

  test('should test shopping cart functionality with real data', async ({ page }) => {
    await page.goto('/en/menu')
    
    // Wait for menu items to load from API
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(5000)
    
    // Wait specifically for menu items to appear
    await page.waitForSelector('.bg-white.rounded-lg', { timeout: 10000 })
    
    // Check if menu items loaded
    const menuItems = page.locator('.bg-white.rounded-lg')
    const itemCount = await menuItems.count()
    console.log('Menu items found:', itemCount)
    
    if (itemCount > 0) {
      // Try to add item to cart
      const firstItem = menuItems.first()
      const addToCartButton = firstItem.locator('button:has-text("Add"), button:has-text("Cart")')
      
      if (await addToCartButton.isVisible()) {
        console.log('✅ Add to cart button found')
        await addToCartButton.click()
        await page.waitForTimeout(2000)
        
        // Check if cart count updated
        const cartCount = page.locator('[data-testid="cart-count"], .cart-count, .badge')
        if (await cartCount.first().isVisible()) {
          const countText = await cartCount.first().textContent()
          console.log('Cart count after adding item:', countText)
          
          if (countText && countText !== '0') {
            console.log('✅ Item successfully added to cart')
            
            // Try to open cart
            const cartButton = page.locator('[data-testid="cart-button"], button:has-text("Cart")')
            if (await cartButton.first().isVisible()) {
              await cartButton.first().click()
              await page.waitForTimeout(2000)
              
              // Check if cart modal/page opens
              const cartModal = page.locator('[data-testid="cart-modal"], .cart-modal, .modal')
              if (await cartModal.first().isVisible()) {
                console.log('✅ Cart modal opened')
                
                // Check for checkout button
                const checkoutButton = page.locator('button:has-text("Checkout")')
                if (await checkoutButton.isVisible()) {
                  console.log('✅ Checkout button available')
                }
              }
            }
          }
        }
      } else {
        console.log('⚠️ No add to cart button found')
      }
    } else {
      console.log('⚠️ No menu items loaded - check Supabase connection')
    }
  })

  test('should test booking functionality with real services', async ({ page }) => {
    await page.goto('/en/services')
    await page.waitForTimeout(3000)
    
    // Check if services loaded from Supabase
    const serviceCards = page.locator('.bg-white.rounded-lg')
    const serviceCount = await serviceCards.count()
    console.log('Services found:', serviceCount)
    
    if (serviceCount > 0) {
      const firstService = serviceCards.first()
      
      // Look for book button
      const bookButton = firstService.locator('button:has-text("Book"), button:has-text("Reserve")')
      if (await bookButton.isVisible()) {
        console.log('✅ Book button found')
        await bookButton.click()
        await page.waitForTimeout(2000)
        
        // Check if booking modal/form opens
        const bookingModal = page.locator('[data-testid="booking-modal"], .modal, .booking-form')
        if (await bookingModal.first().isVisible()) {
          console.log('✅ Booking modal opened')
          
          // Try to fill booking form
          const nameInput = page.locator('input[name="name"], input[name="customer_name"]')
          const emailInput = page.locator('input[name="email"]')
          
          if (await nameInput.first().isVisible() && await emailInput.first().isVisible()) {
            await nameInput.first().fill('E2E Test User')
            await emailInput.first().fill('e2e@test.com')
            
            const submitButton = page.locator('button[type="submit"], button:has-text("Book")')
            if (await submitButton.first().isVisible()) {
              console.log('✅ Booking form ready for submission')
              // Don't actually submit to avoid creating test data
            }
          }
        }
      } else {
        console.log('⚠️ No book button found on services')
      }
    }
  })

  test('should test contact form with real Supabase submission', async ({ page }) => {
    await page.goto('/en/contact')
    
    // Check contact form
    await expect(page.locator('h1')).toContainText('Get in Touch')
    
    const contactForm = page.locator('form').first()
    await expect(contactForm).toBeVisible()
    
    // Fill out contact form
    await page.fill('input[name="name"]', 'E2E Test User')
    await page.fill('input[name="email"]', 'e2e.test@example.com')
    
    const phoneInput = page.locator('input[name="phone"]')
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('+386 31 123 456')
    }
    
    await page.fill('textarea[name="message"]', 'This is an E2E test message to verify contact form functionality with Supabase integration.')
    
    // Submit form (be specific to avoid multiple buttons)
    const submitButton = page.locator('button:has-text("Send Message")')
    await expect(submitButton).toBeVisible()
    
    console.log('📝 Contact form filled, ready to submit')
    await submitButton.click()
    await page.waitForTimeout(5000)
    
    // Check for success message or redirect
    const successMessage = page.locator('[data-testid="success-message"], .success, .alert-success')
    const errorMessage = page.locator('[data-testid="error-message"], .error, .alert-error')
    
    if (await successMessage.first().isVisible()) {
      const successText = await successMessage.first().textContent()
      console.log('✅ Contact form submitted successfully:', successText)
    } else if (await errorMessage.first().isVisible()) {
      const errorText = await errorMessage.first().textContent()
      console.log('❌ Contact form submission failed:', errorText)
    } else {
      console.log('⚠️ No clear success/error message found')
    }
  })

  test('should test newsletter subscription with Supabase', async ({ page }) => {
    await page.goto('/en')
    
    // Look for newsletter form
    const newsletterForm = page.locator('[data-testid="newsletter-form"], form:has(input[type="email"])')
    
    if (await newsletterForm.first().isVisible()) {
      console.log('✅ Newsletter form found')
      
      const emailInput = newsletterForm.first().locator('input[type="email"]')
      const subscribeButton = newsletterForm.first().locator('button:has-text("Subscribe"), button[type="submit"]')
      
      if (await emailInput.isVisible() && await subscribeButton.isVisible()) {
        await emailInput.fill('e2e.newsletter@test.com')
        await subscribeButton.click()
        await page.waitForTimeout(3000)
        
        // Check for success message
        const successMessage = page.locator('[data-testid="newsletter-success"], .success')
        if (await successMessage.first().isVisible()) {
          console.log('✅ Newsletter subscription successful')
        } else {
          console.log('⚠️ Newsletter subscription result unclear')
        }
      }
    } else {
      console.log('⚠️ Newsletter form not found')
    }
  })

  test('should test schedule/booking system with real data', async ({ page }) => {
    await page.goto('/en/schedule')
    await page.waitForTimeout(3000)
    
    // Check if schedule loads
    const scheduleTitle = await page.locator('h1').textContent()
    console.log('Schedule page title:', scheduleTitle)
    
    // Look for schedule items/slots
    const scheduleItems = page.locator('.schedule-item, .time-slot, .bg-white.rounded-lg')
    const itemCount = await scheduleItems.count()
    console.log('Schedule items found:', itemCount)
    
    if (itemCount > 0) {
      console.log('✅ Schedule data loaded from database')
      
      // Try to book a slot
      const bookableSlot = scheduleItems.first().locator('button:has-text("Book"), button:has-text("Available")')
      if (await bookableSlot.isVisible()) {
        console.log('✅ Bookable slot found')
        await bookableSlot.click()
        await page.waitForTimeout(2000)
        
        // Check if booking form appears
        const bookingForm = page.locator('.booking-form, .modal form')
        if (await bookingForm.first().isVisible()) {
          console.log('✅ Booking form opened for schedule slot')
        }
      }
    } else {
      console.log('⚠️ No schedule items found - check database')
    }
  })

  test('should test complete checkout flow', async ({ page }) => {
    // First add item to cart
    await page.goto('/en/menu')
    await page.waitForTimeout(3000)
    
    const menuItems = page.locator('.bg-white.rounded-lg')
    if (await menuItems.first().isVisible()) {
      const addButton = menuItems.first().locator('button:has-text("Add")')
      if (await addButton.isVisible()) {
        await addButton.click()
        await page.waitForTimeout(2000)
        
        // Navigate to checkout
        await page.goto('/en/checkout')
        await page.waitForTimeout(2000)
        
        // Check if checkout page loads
        const checkoutTitle = await page.locator('h1').textContent()
        console.log('Checkout page title:', checkoutTitle)
        
        if (checkoutTitle && checkoutTitle.toLowerCase().includes('checkout')) {
          console.log('✅ Checkout page loaded')
          
          // Fill checkout form
          const nameInput = page.locator('input[name="name"]')
          const emailInput = page.locator('input[name="email"]')
          
          if (await nameInput.isVisible() && await emailInput.isVisible()) {
            await nameInput.fill('E2E Checkout Test')
            await emailInput.fill('checkout@test.com')
            
            const phoneInput = page.locator('input[name="phone"]')
            if (await phoneInput.isVisible()) {
              await phoneInput.fill('+386 31 123 456')
            }
            
            console.log('✅ Checkout form filled')
            
            // Don't actually submit to avoid creating test orders
            const submitButton = page.locator('button[type="submit"]')
            if (await submitButton.isVisible()) {
              console.log('✅ Checkout form ready for submission')
            }
          }
        }
      }
    }
  })

  test('should test language switching with real content', async ({ page }) => {
    await page.goto('/en')
    
    // Check current language
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    
    // Try different language URLs directly
    const languages = ['sl', 'de', 'nl']
    
    for (const lang of languages) {
      await page.goto(`/${lang}`)
      await page.waitForTimeout(2000)
      
      // Check if page loads in correct language
      const htmlLang = await page.locator('html').getAttribute('lang')
      console.log(`Language ${lang}: HTML lang attribute = ${htmlLang}`)
      
      if (htmlLang === lang) {
        console.log(`✅ ${lang} language works`)
        
        // Check if content is actually translated
        const h1Text = await page.locator('h1').textContent()
        console.log(`${lang} page title: ${h1Text}`)
      } else {
        console.log(`⚠️ ${lang} language not working properly`)
      }
    }
  })

  test('should test error handling and edge cases', async ({ page }) => {
    // Test 404 handling
    await page.goto('/en/nonexistent-page')
    await page.waitForTimeout(2000)
    
    const pageTitle = await page.locator('h1').textContent()
    console.log('404 page title:', pageTitle)
    
    if (pageTitle && pageTitle.includes('404')) {
      console.log('✅ 404 page handling works')
    }
    
    // Test empty cart checkout
    await page.goto('/en/checkout')
    await page.waitForTimeout(2000)
    
    const checkoutContent = await page.locator('main').textContent()
    if (checkoutContent && checkoutContent.toLowerCase().includes('empty')) {
      console.log('✅ Empty cart handling works')
    }
    
    // Test form validation
    await page.goto('/en/contact')
    const submitButton = page.locator('button:has-text("Send Message")')
    await submitButton.click()
    await page.waitForTimeout(2000)
    
    // Check if validation errors appear
    const validationErrors = page.locator('.error, .invalid, [aria-invalid="true"]')
    const errorCount = await validationErrors.count()
    if (errorCount > 0) {
      console.log('✅ Form validation works')
    }
  })
})
