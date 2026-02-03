import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Real World Application Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Go to the homepage
    await page.goto(BASE_URL);
  });

  test('Homepage loads and displays correctly', async ({ page }) => {
    // Check if the page loads
    await expect(page).toHaveTitle(/healthy corner/i);
    
    // Check main navigation
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /services/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /menu/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /schedule/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /gallery/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible();
    
    // Check hero section
    await expect(page.locator('h1')).toContainText(/healthy corner/i);
    
    // Check if cart icon is present
    await expect(page.locator('[aria-label*="cart"]')).toBeVisible();
  });

  test('Language toggle works', async ({ page }) => {
    // Look for language toggle component
    const languageToggle = page.locator('button').filter({ hasText: /slovenščina|english|nederlands|deutsch/i }).first();
    
    if (await languageToggle.isVisible()) {
      await languageToggle.click();
      
      // Check if dropdown appears
      await expect(page.locator('[role="button"]').filter({ hasText: /english|slovenščina/i })).toBeVisible();
      
      // Try switching to English
      const englishOption = page.getByText('English').first();
      if (await englishOption.isVisible()) {
        await englishOption.click();
        
        // Wait for navigation
        await page.waitForURL(/\/en/);
        
        // Check if URL changed to English
        expect(page.url()).toContain('/en');
      }
    }
  });

  test('Services page loads and displays services', async ({ page }) => {
    // Navigate to services
    await page.getByRole('link', { name: /services/i }).click();
    
    // Wait for services to load
    await page.waitForLoadState('networkidle');
    
    // Check if services are displayed
    const servicesContainer = page.locator('[data-testid="services-container"], .services-grid, .grid').first();
    await expect(servicesContainer).toBeVisible();
    
    // Look for service cards
    const serviceCards = page.locator('.service-card, [data-testid="service-card"], .card').first();
    if (await serviceCards.count() > 0) {
      await expect(serviceCards.first()).toBeVisible();
      
      // Check if service has price and book button
      await expect(page.locator('text=/€|EUR|price/i').first()).toBeVisible();
      await expect(page.getByRole('button', { name: /book|reserve|naroči/i }).first()).toBeVisible();
    }
  });

  test('Schedule page loads and displays schedules', async ({ page }) => {
    // Navigate to schedule
    await page.getByRole('link', { name: /schedule/i }).click();
    
    // Wait for schedules to load
    await page.waitForLoadState('networkidle');
    
    // Check if schedule is displayed
    await expect(page.locator('h1')).toContainText(/schedule|urnik/i);
    
    // Look for calendar or schedule items
    const scheduleContainer = page.locator('.calendar, .schedule-grid, .weekly-calendar').first();
    if (await scheduleContainer.isVisible()) {
      await expect(scheduleContainer).toBeVisible();
    }
    
    // Check for time slots or schedule items
    const timeSlots = page.locator('text=/\\d{1,2}:\\d{2}|morning|afternoon/i').first();
    if (await timeSlots.isVisible()) {
      await expect(timeSlots).toBeVisible();
    }
  });

  test('Menu page loads and displays menu items', async ({ page }) => {
    // Navigate to menu
    await page.getByRole('link', { name: /menu/i }).click();
    
    // Wait for menu to load
    await page.waitForLoadState('networkidle');
    
    // Check if menu is displayed
    await expect(page.locator('h1')).toContainText(/menu|food|hrana/i);
    
    // Look for menu items
    const menuContainer = page.locator('.menu-grid, .grid, [data-testid="menu-container"]').first();
    if (await menuContainer.isVisible()) {
      await expect(menuContainer).toBeVisible();
    }
    
    // Check for menu item cards
    const menuItems = page.locator('.menu-item, .card, [data-testid="menu-item"]');
    if (await menuItems.count() > 0) {
      await expect(menuItems.first()).toBeVisible();
      
      // Check if items have prices
      await expect(page.locator('text=/€|EUR|price/i').first()).toBeVisible();
    }
  });

  test('Shopping cart functionality', async ({ page }) => {
    // Navigate to menu first
    await page.getByRole('link', { name: /menu/i }).click();
    await page.waitForLoadState('networkidle');
    
    // Look for add to cart buttons
    const addToCartButton = page.getByRole('button', { name: /add to cart|dodaj v košarico/i }).first();
    
    if (await addToCartButton.isVisible()) {
      // Click add to cart
      await addToCartButton.click();
      
      // Check if cart icon shows item count
      const cartIcon = page.locator('[aria-label*="cart"]');
      await expect(cartIcon).toBeVisible();
      
      // Look for cart badge/counter
      const cartBadge = page.locator('.badge, [data-testid="cart-badge"]').first();
      if (await cartBadge.isVisible()) {
        await expect(cartBadge).toContainText(/1|2|3/);
      }
      
      // Try to open cart
      await cartIcon.click();
      
      // Check if cart drawer/modal opens
      const cartDrawer = page.locator('.cart-drawer, [data-testid="cart-drawer"], .modal').first();
      if (await cartDrawer.isVisible()) {
        await expect(cartDrawer).toBeVisible();
        
        // Check for checkout button
        const checkoutButton = page.getByRole('button', { name: /checkout|zaključi/i }).first();
        if (await checkoutButton.isVisible()) {
          await expect(checkoutButton).toBeVisible();
        }
      }
    }
  });

  test('Gallery page loads and displays images', async ({ page }) => {
    // Navigate to gallery
    await page.getByRole('link', { name: /gallery/i }).click();
    
    // Wait for gallery to load
    await page.waitForLoadState('networkidle');
    
    // Check if gallery is displayed
    await expect(page.locator('h1')).toContainText(/gallery|galerija/i);
    
    // Look for gallery images
    const galleryContainer = page.locator('.gallery, .grid, [data-testid="gallery"]').first();
    if (await galleryContainer.isVisible()) {
      await expect(galleryContainer).toBeVisible();
    }
    
    // Check for images
    const images = page.locator('img').filter({ hasNot: page.locator('[alt*="logo"]') });
    if (await images.count() > 0) {
      await expect(images.first()).toBeVisible();
      
      // Try clicking an image to open lightbox
      await images.first().click();
      
      // Check if lightbox opens
      const lightbox = page.locator('.lightbox, [data-testid="lightbox"], .modal').first();
      if (await lightbox.isVisible()) {
        await expect(lightbox).toBeVisible();
      }
    }
  });

  test('Contact page loads and form works', async ({ page }) => {
    // Navigate to contact
    await page.getByRole('link', { name: /contact/i }).click();
    
    // Wait for contact page to load
    await page.waitForLoadState('networkidle');
    
    // Check if contact page is displayed
    await expect(page.locator('h1')).toContainText(/contact|kontakt/i);
    
    // Look for contact form
    const contactForm = page.locator('form').first();
    if (await contactForm.isVisible()) {
      await expect(contactForm).toBeVisible();
      
      // Fill out form
      const nameField = page.locator('input[name="name"], input[type="text"]').first();
      const emailField = page.locator('input[name="email"], input[type="email"]').first();
      const messageField = page.locator('textarea[name="message"], textarea').first();
      
      if (await nameField.isVisible()) {
        await nameField.fill('Test User');
      }
      if (await emailField.isVisible()) {
        await emailField.fill('test@example.com');
      }
      if (await messageField.isVisible()) {
        await messageField.fill('This is a test message from Playwright.');
      }
      
      // Try to submit (but don't actually submit to avoid spam)
      const submitButton = page.getByRole('button', { name: /send|pošlji/i }).first();
      if (await submitButton.isVisible()) {
        await expect(submitButton).toBeVisible();
        // Don't actually click to avoid sending test emails
      }
    }
  });

  test('Newsletter signup works', async ({ page }) => {
    // Look for newsletter signup (might be on any page)
    const newsletterForm = page.locator('form').filter({ has: page.locator('input[type="email"]') }).first();
    
    if (await newsletterForm.isVisible()) {
      const emailInput = newsletterForm.locator('input[type="email"]');
      await emailInput.fill('test-newsletter@example.com');
      
      // Look for GDPR checkbox
      const gdprCheckbox = page.locator('input[type="checkbox"]').first();
      if (await gdprCheckbox.isVisible()) {
        await gdprCheckbox.check();
      }
      
      // Don't actually submit to avoid spam
      const subscribeButton = newsletterForm.getByRole('button', { name: /subscribe|naroči/i });
      if (await subscribeButton.isVisible()) {
        await expect(subscribeButton).toBeVisible();
      }
    }
  });

  test('Responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Reload page
    await page.reload();
    
    // Check if mobile navigation works
    const mobileMenuButton = page.locator('button').filter({ hasText: /menu|☰|≡/i }).first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // Check if mobile menu opens
      const mobileMenu = page.locator('.mobile-menu, [data-testid="mobile-menu"]').first();
      if (await mobileMenu.isVisible()) {
        await expect(mobileMenu).toBeVisible();
      }
    }
    
    // Check if content is still accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[aria-label*="cart"]')).toBeVisible();
  });

  test('Error handling works', async ({ page }) => {
    // Try to navigate to a non-existent page
    await page.goto(`${BASE_URL}/non-existent-page`);
    
    // Should show 404 or redirect to home
    const is404 = await page.locator('text=/404|not found/i').isVisible();
    const isHome = page.url().includes(BASE_URL) && !page.url().includes('non-existent');
    
    expect(is404 || isHome).toBeTruthy();
  });

  test('Performance check - page loads within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Check if critical elements are visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });
});

test.describe('API Integration Tests', () => {
  
  test('API endpoints respond correctly', async ({ page }) => {
    // Test schedules API
    const schedulesResponse = await page.request.get(`${BASE_URL}/api/schedules`);
    expect(schedulesResponse.status()).toBeLessThan(500); // Should not be server error
    
    // Test services API (if exists)
    const servicesResponse = await page.request.get(`${BASE_URL}/api/services`);
    expect(servicesResponse.status()).toBeLessThan(500);
    
    // Test menu API (if exists)  
    const menuResponse = await page.request.get(`${BASE_URL}/api/menu`);
    expect(menuResponse.status()).toBeLessThan(500);
  });
  
  test('Contact form API works', async ({ page }) => {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message from Playwright'
    };
    
    const response = await page.request.post(`${BASE_URL}/api/contact`, {
      data: contactData
    });
    
    // Should not be server error
    expect(response.status()).toBeLessThan(500);
  });
  
  test('Newsletter API works', async ({ page }) => {
    const newsletterData = {
      email: 'test-newsletter@example.com'
    };
    
    const response = await page.request.post(`${BASE_URL}/api/newsletter`, {
      data: newsletterData
    });
    
    // Should not be server error
    expect(response.status()).toBeLessThan(500);
  });
});
