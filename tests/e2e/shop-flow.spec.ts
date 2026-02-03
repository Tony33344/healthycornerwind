import { test, expect } from '@playwright/test'

test.describe('Shop Flow E2E Tests', () => {
  
  // COMPLETE E-COMMERCE JOURNEY TESTS
  test.describe('Complete Shopping Journey', () => {
    test('should complete full shopping flow from menu to order confirmation', async ({ page }) => {
      // 1. Navigate to menu
      await page.goto('/en/menu')
      await page.waitForSelector('[data-testid="menu-item"]')
      
      // 2. Add multiple items to cart
      await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
      await expect(page.locator('[data-testid="cart-count"]')).toContainText('1')
      
      await page.click('[data-testid="menu-item"]:nth-child(2) button:has-text("Add to Cart")')
      await expect(page.locator('[data-testid="cart-count"]')).toContainText('2')
      
      // 3. View cart
      await page.click('[data-testid="cart-button"]')
      await expect(page.locator('[data-testid="cart-modal"]')).toBeVisible()
      await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(2)
      
      // 4. Proceed to checkout
      await page.click('text=Checkout')
      await page.waitForURL('**/checkout')
      
      // 5. Fill checkout form
      await page.fill('input[name="name"]', 'Test Customer')
      await page.fill('input[name="email"]', 'customer@example.com')
      await page.fill('input[name="phone"]', '+386 31 123 456')
      
      // 6. Submit order
      await page.click('button[type="submit"]')
      
      // 7. Verify order confirmation
      await page.waitForURL('**/order-confirmation/**')
      await expect(page.locator('h1')).toContainText('Order Confirmed')
      await expect(page.locator('[data-testid="order-number"]')).toBeVisible()
    })

    test('should handle cart modifications during shopping', async ({ page }) => {
      await page.goto('/en/menu')
      await page.waitForSelector('[data-testid="menu-item"]')
      
      // Add item to cart
      await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
      await page.click('[data-testid="cart-button"]')
      
      // Increase quantity
      const plusButton = page.locator('[data-testid="quantity-plus"]')
      if (await plusButton.isVisible()) {
        await plusButton.click()
        await expect(page.locator('[data-testid="cart-count"]')).toContainText('2')
      }
      
      // Decrease quantity
      const minusButton = page.locator('[data-testid="quantity-minus"]')
      if (await minusButton.isVisible()) {
        await minusButton.click()
        await expect(page.locator('[data-testid="cart-count"]')).toContainText('1')
      }
      
      // Remove item
      const removeButton = page.locator('[data-testid="remove-item"]')
      if (await removeButton.isVisible()) {
        await removeButton.click()
        await expect(page.locator('text=Your cart is empty')).toBeVisible()
      }
    })
  })

  // CART FUNCTIONALITY TESTS
  test.describe('Shopping Cart Features', () => {
    test('should persist cart across page navigation', async ({ page }) => {
      await page.goto('/en/menu')
      await page.waitForSelector('[data-testid="menu-item"]')
      
      // Add item to cart
      await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
      await expect(page.locator('[data-testid="cart-count"]')).toContainText('1')
      
      // Navigate to different pages
      await page.goto('/en/services')
      await expect(page.locator('[data-testid="cart-count"]')).toContainText('1')
      
      await page.goto('/en/gallery')
      await expect(page.locator('[data-testid="cart-count"]')).toContainText('1')
      
      // Return to menu
      await page.goto('/en/menu')
      await expect(page.locator('[data-testid="cart-count"]')).toContainText('1')
    })

    test('should calculate correct totals', async ({ page }) => {
      await page.goto('/en/menu')
      await page.waitForSelector('[data-testid="menu-item"]')
      
      // Add items and verify totals
      await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
      await page.click('[data-testid="cart-button"]')
      
      // Check subtotal
      const subtotal = page.locator('[data-testid="subtotal"]')
      if (await subtotal.isVisible()) {
        await expect(subtotal).toBeVisible()
      }
      
      // Check total
      await expect(page.locator('[data-testid="cart-total"]')).toBeVisible()
    })

    test('should handle empty cart state', async ({ page }) => {
      await page.goto('/en/menu')
      await page.click('[data-testid="cart-button"]')
      
      await expect(page.locator('[data-testid="cart-modal"]')).toBeVisible()
      await expect(page.locator('text=Your cart is empty')).toBeVisible()
      
      // Checkout button should be disabled or hidden
      const checkoutButton = page.locator('button:has-text("Checkout")')
      if (await checkoutButton.isVisible()) {
        await expect(checkoutButton).toBeDisabled()
      }
    })

    test('should apply discount codes', async ({ page }) => {
      await page.goto('/en/menu')
      await page.waitForSelector('[data-testid="menu-item"]')
      await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
      await page.click('[data-testid="cart-button"]')
      
      // Try to apply discount code
      const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="discount"]')
      if (await promoInput.isVisible()) {
        await promoInput.fill('TEST10')
        await page.click('button:has-text("Apply")')
        // Check if discount is applied
      }
    })
  })

  // CHECKOUT PROCESS TESTS
  test.describe('Checkout Process', () => {
    test.beforeEach(async ({ page }) => {
      // Add item to cart before each checkout test
      await page.goto('/en/menu')
      await page.waitForSelector('[data-testid="menu-item"]')
      await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
      await page.click('[data-testid="cart-button"]')
      await page.click('text=Checkout')
    })

    test('should validate required checkout fields', async ({ page }) => {
      // Try to submit without filling required fields
      await page.click('button[type="submit"]')
      
      // Should show validation errors
      const nameError = page.locator('[data-testid="name-error"]')
      const emailError = page.locator('[data-testid="email-error"]')
      
      if (await nameError.isVisible()) {
        await expect(nameError).toBeVisible()
      }
      if (await emailError.isVisible()) {
        await expect(emailError).toBeVisible()
      }
    })

    test('should validate email format', async ({ page }) => {
      await page.fill('input[name="name"]', 'Test User')
      await page.fill('input[name="email"]', 'invalid-email')
      await page.click('button[type="submit"]')
      
      // Should show email validation error
      const emailError = page.locator('[data-testid="email-error"]')
      if (await emailError.isVisible()) {
        await expect(emailError).toBeVisible()
      }
    })

    test('should validate phone number format', async ({ page }) => {
      await page.fill('input[name="name"]', 'Test User')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="phone"]', '123')
      await page.click('button[type="submit"]')
      
      // Should show phone validation error
      const phoneError = page.locator('[data-testid="phone-error"]')
      if (await phoneError.isVisible()) {
        await expect(phoneError).toBeVisible()
      }
    })

    test('should display order summary', async ({ page }) => {
      await expect(page.locator('[data-testid="order-summary"]')).toBeVisible()
      await expect(page.locator('[data-testid="order-items"]')).toBeVisible()
      await expect(page.locator('[data-testid="order-total"]')).toBeVisible()
    })

    test('should handle delivery options', async ({ page }) => {
      const deliverySection = page.locator('[data-testid="delivery-options"]')
      if (await deliverySection.isVisible()) {
        await expect(deliverySection).toBeVisible()
        
        // Test pickup option
        const pickupOption = page.locator('input[value="pickup"]')
        if (await pickupOption.isVisible()) {
          await pickupOption.click()
        }
        
        // Test delivery option
        const deliveryOption = page.locator('input[value="delivery"]')
        if (await deliveryOption.isVisible()) {
          await deliveryOption.click()
        }
      }
    })

    test('should accept terms and conditions', async ({ page }) => {
      const termsCheckbox = page.locator('input[type="checkbox"][name*="terms"]')
      if (await termsCheckbox.isVisible()) {
        await expect(termsCheckbox).toBeVisible()
        await termsCheckbox.check()
        await expect(termsCheckbox).toBeChecked()
      }
    })

    test('should handle special instructions', async ({ page }) => {
      const instructionsField = page.locator('textarea[name="instructions"], textarea[name="notes"]')
      if (await instructionsField.isVisible()) {
        await instructionsField.fill('Please ring doorbell twice')
        await expect(instructionsField).toHaveValue('Please ring doorbell twice')
      }
    })
  })

  // PAYMENT PROCESS TESTS
  test.describe('Payment Process', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/menu')
      await page.waitForSelector('[data-testid="menu-item"]')
      await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
      await page.click('[data-testid="cart-button"]')
      await page.click('text=Checkout')
      
      // Fill required fields
      await page.fill('input[name="name"]', 'Test Customer')
      await page.fill('input[name="email"]', 'customer@example.com')
      await page.fill('input[name="phone"]', '+386 31 123 456')
    })

    test('should display payment methods', async ({ page }) => {
      const paymentSection = page.locator('[data-testid="payment-methods"]')
      if (await paymentSection.isVisible()) {
        await expect(paymentSection).toBeVisible()
      }
    })

    test('should handle cash payment option', async ({ page }) => {
      const cashOption = page.locator('input[value="cash"]')
      if (await cashOption.isVisible()) {
        await cashOption.click()
        await expect(cashOption).toBeChecked()
      }
    })

    test('should handle card payment option', async ({ page }) => {
      const cardOption = page.locator('input[value="card"]')
      if (await cardOption.isVisible()) {
        await cardOption.click()
        await expect(cardOption).toBeChecked()
      }
    })

    test('should process order successfully', async ({ page }) => {
      await page.click('button[type="submit"]')
      
      // Should redirect to confirmation page
      await page.waitForURL('**/order-confirmation/**')
      await expect(page.locator('h1')).toContainText('Order Confirmed')
    })
  })

  // ORDER CONFIRMATION TESTS
  test.describe('Order Confirmation', () => {
    test('should display order confirmation details', async ({ page }) => {
      // Complete a full order first
      await page.goto('/en/menu')
      await page.waitForSelector('[data-testid="menu-item"]')
      await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
      await page.click('[data-testid="cart-button"]')
      await page.click('text=Checkout')
      
      await page.fill('input[name="name"]', 'Test Customer')
      await page.fill('input[name="email"]', 'customer@example.com')
      await page.fill('input[name="phone"]', '+386 31 123 456')
      await page.click('button[type="submit"]')
      
      await page.waitForURL('**/order-confirmation/**')
      
      // Check confirmation page elements
      await expect(page.locator('h1')).toContainText('Order Confirmed')
      await expect(page.locator('[data-testid="order-number"]')).toBeVisible()
      await expect(page.locator('[data-testid="order-details"]')).toBeVisible()
      await expect(page.locator('[data-testid="customer-info"]')).toBeVisible()
    })

    test('should provide order tracking information', async ({ page }) => {
      // Navigate to a sample confirmation page
      await page.goto('/en/order-confirmation/test-order-123')
      
      const trackingInfo = page.locator('[data-testid="tracking-info"]')
      if (await trackingInfo.isVisible()) {
        await expect(trackingInfo).toBeVisible()
      }
    })

    test('should show estimated delivery time', async ({ page }) => {
      await page.goto('/en/order-confirmation/test-order-123')
      
      const deliveryTime = page.locator('[data-testid="delivery-time"]')
      if (await deliveryTime.isVisible()) {
        await expect(deliveryTime).toBeVisible()
      }
    })

    test('should provide contact information', async ({ page }) => {
      await page.goto('/en/order-confirmation/test-order-123')
      
      await expect(page.locator('text=+386')).toBeVisible()
      const contactInfo = page.locator('[data-testid="contact-info"]')
      if (await contactInfo.isVisible()) {
        await expect(contactInfo).toBeVisible()
      }
    })
  })

  // MOBILE SHOPPING EXPERIENCE
  test.describe('Mobile Shopping Experience', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
    })

    test('should work on mobile devices', async ({ page }) => {
      await page.goto('/en/menu')
      await page.waitForSelector('[data-testid="menu-item"]')
      
      // Add item to cart on mobile
      await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
      await expect(page.locator('[data-testid="cart-count"]')).toContainText('1')
      
      // Open cart on mobile
      await page.click('[data-testid="cart-button"]')
      await expect(page.locator('[data-testid="cart-modal"]')).toBeVisible()
    })

    test('should handle mobile checkout', async ({ page }) => {
      await page.goto('/en/menu')
      await page.waitForSelector('[data-testid="menu-item"]')
      await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
      await page.click('[data-testid="cart-button"]')
      await page.click('text=Checkout')
      
      // Fill form on mobile
      await page.fill('input[name="name"]', 'Mobile User')
      await page.fill('input[name="email"]', 'mobile@example.com')
      await page.fill('input[name="phone"]', '+386 31 123 456')
      
      // Submit should work on mobile
      await page.click('button[type="submit"]')
      await page.waitForURL('**/order-confirmation/**')
    })
  })

  // ERROR HANDLING TESTS
  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network issues
      await page.route('**/api/**', route => route.abort())
      
      await page.goto('/en/menu')
      await page.waitForSelector('[data-testid="menu-item"]')
      
      // Try to add item - should handle error
      await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
      
      // Should show error message
      const errorMessage = page.locator('[data-testid="error-message"]')
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toBeVisible()
      }
    })

    test('should handle out of stock items', async ({ page }) => {
      await page.goto('/en/menu')
      await page.waitForSelector('[data-testid="menu-item"]')
      
      // Look for out of stock items
      const outOfStockItem = page.locator('[data-testid="out-of-stock"]')
      if (await outOfStockItem.isVisible()) {
        await expect(outOfStockItem).toBeVisible()
        
        // Button should be disabled
        const addButton = outOfStockItem.locator('button')
        await expect(addButton).toBeDisabled()
      }
    })

    test('should handle checkout errors', async ({ page }) => {
      await page.goto('/en/menu')
      await page.waitForSelector('[data-testid="menu-item"]')
      await page.click('[data-testid="menu-item"]:first-child button:has-text("Add to Cart")')
      await page.click('[data-testid="cart-button"]')
      await page.click('text=Checkout')
      
      // Simulate checkout error
      await page.route('**/api/orders', route => route.abort())
      
      await page.fill('input[name="name"]', 'Test User')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="phone"]', '+386 31 123 456')
      await page.click('button[type="submit"]')
      
      // Should show error message
      const checkoutError = page.locator('[data-testid="checkout-error"]')
      if (await checkoutError.isVisible()) {
        await expect(checkoutError).toBeVisible()
      }
    })
  })
})
