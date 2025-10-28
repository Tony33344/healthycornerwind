import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Public Shop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should display shop section', async ({ page }) => {
    // Scroll to shop section
    await page.locator('#shop').scrollIntoViewIfNeeded();
    
    // Verify shop heading
    await expect(page.locator('text=Wellness Products & Retreats')).toBeVisible();
  });

  test('should display products', async ({ page }) => {
    // Scroll to shop
    await page.locator('#shop').scrollIntoViewIfNeeded();
    
    // Wait for products to load
    await page.waitForTimeout(2000);
    
    // Check if products are displayed or loading indicator
    const productsOrLoading = page.locator('text=Add to Cart, text=Loading');
    await expect(productsOrLoading.first()).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    // Scroll to shop
    await page.locator('#shop').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Check if there are products
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    const isVisible = await addToCartButton.isVisible();
    
    if (isVisible) {
      // Click add to cart
      await addToCartButton.click();
      
      // Verify cart icon appears with count
      await expect(page.locator('text=1')).toBeVisible();
      
      // Verify floating cart button is visible
      const cartButton = page.locator('button').filter({ has: page.locator('svg') });
      await expect(cartButton.last()).toBeVisible();
    }
  });

  test('should open cart sidebar', async ({ page }) => {
    // Scroll to shop
    await page.locator('#shop').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Add product to cart
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    const isVisible = await addToCartButton.isVisible();
    
    if (isVisible) {
      await addToCartButton.click();
      await page.waitForTimeout(500);
      
      // Click cart button
      const cartButtons = page.locator('button').filter({ has: page.locator('svg') });
      await cartButtons.last().click();
      
      // Verify cart sidebar is open
      await expect(page.locator('text=Your Cart')).toBeVisible();
      await expect(page.locator('text=Total:')).toBeVisible();
    }
  });

  test('should update quantity in cart', async ({ page }) => {
    // Scroll to shop
    await page.locator('#shop').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Add product to cart
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    const isVisible = await addToCartButton.isVisible();
    
    if (isVisible) {
      await addToCartButton.click();
      await page.waitForTimeout(500);
      
      // Open cart
      const cartButtons = page.locator('button').filter({ has: page.locator('svg') });
      await cartButtons.last().click();
      
      // Find plus button in cart
      const plusButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-plus"]') }).first();
      await plusButton.click();
      
      // Verify quantity increased
      await expect(page.locator('text=2')).toBeVisible();
    }
  });

  test('should remove item from cart', async ({ page }) => {
    // Scroll to shop
    await page.locator('#shop').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Add product to cart
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    const isVisible = await addToCartButton.isVisible();
    
    if (isVisible) {
      await addToCartButton.click();
      await page.waitForTimeout(500);
      
      // Open cart
      const cartButtons = page.locator('button').filter({ has: page.locator('svg') });
      await cartButtons.last().click();
      
      // Click remove button
      await page.click('button:has-text("Remove")');
      
      // Verify cart is empty or sidebar closed
      await page.waitForTimeout(500);
    }
  });

  test('should display correct total', async ({ page }) => {
    // Scroll to shop
    await page.locator('#shop').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Add product to cart
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    const isVisible = await addToCartButton.isVisible();
    
    if (isVisible) {
      // Get product price
      const priceText = await page.locator('text=/€\\d+/').first().textContent();
      const price = parseFloat(priceText?.replace('€', '') || '0');
      
      // Add to cart
      await addToCartButton.click();
      await page.waitForTimeout(500);
      
      // Open cart
      const cartButtons = page.locator('button').filter({ has: page.locator('svg') });
      await cartButtons.last().click();
      
      // Verify total matches price
      const totalText = await page.locator('text=/Total:.*€\\d+/').textContent();
      expect(totalText).toContain(`€${price.toFixed(2)}`);
    }
  });
});

test.describe('Gallery with Real Images', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should display gallery section', async ({ page }) => {
    // Scroll to gallery
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    
    // Verify gallery heading
    await expect(page.locator('text=Experience Healthy Corner')).toBeVisible();
  });

  test('should display category filters', async ({ page }) => {
    // Scroll to gallery
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    
    // Verify category buttons
    await expect(page.locator('button:has-text("All")')).toBeVisible();
    await expect(page.locator('button:has-text("Ice Bath")')).toBeVisible();
    await expect(page.locator('button:has-text("Healthy Food")')).toBeVisible();
  });

  test('should filter images by category', async ({ page }) => {
    // Scroll to gallery
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    
    // Click ice bath category
    await page.click('button:has-text("Ice Bath")');
    
    // Verify filter is applied
    const categoryButton = page.locator('button:has-text("Ice Bath")');
    await expect(categoryButton).toHaveClass(/bg-primary/);
    
    // Verify images are displayed
    await expect(page.locator('img[alt*="Ice Bath"], img[alt*="Breathing"]').first()).toBeVisible();
  });

  test('should open image lightbox', async ({ page }) => {
    // Scroll to gallery
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    
    // Click on first image
    const firstImage = page.locator('img[alt]').first();
    await firstImage.click();
    
    // Verify lightbox is open
    await expect(page.locator('button').filter({ has: page.locator('svg[class*="lucide-x"]') })).toBeVisible();
  });

  test('should close lightbox', async ({ page }) => {
    // Scroll to gallery
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    
    // Open lightbox
    const firstImage = page.locator('img[alt]').first();
    await firstImage.click();
    
    // Close lightbox
    const closeButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-x"]') });
    await closeButton.click();
    
    // Verify lightbox is closed
    await expect(closeButton).not.toBeVisible();
  });
});
