import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@healthycorner.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);
  });

  test('should login successfully', async ({ page }) => {
    // Fill in login form
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for navigation to admin dashboard
    await page.waitForURL(`${BASE_URL}/admin`);
    
    // Verify we're on the admin page
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });

  test('should display bookings tab', async ({ page }) => {
    // Login first
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`);
    
    // Check bookings tab is visible and active
    const bookingsTab = page.locator('button:has-text("Bookings")');
    await expect(bookingsTab).toBeVisible();
    
    // Verify bookings content is displayed
    await expect(page.locator('text=Total Bookings')).toBeVisible();
  });

  test('should navigate to media manager', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`);
    
    // Click media manager button
    await page.click('button:has-text("Media Manager")');
    
    // Verify navigation
    await page.waitForURL(`${BASE_URL}/admin/media`);
    await expect(page.locator('h1')).toContainText('Media Manager');
  });
});

test.describe('Media Manager', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to media manager
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`);
    await page.goto(`${BASE_URL}/admin/media`);
  });

  test('should display media stats', async ({ page }) => {
    // Check for stats cards
    await expect(page.locator('text=Total Images')).toBeVisible();
    await expect(page.locator('text=Published')).toBeVisible();
    await expect(page.locator('text=Draft')).toBeVisible();
  });

  test('should open upload modal', async ({ page }) => {
    // Click upload button
    await page.click('button:has-text("Upload Image")');
    
    // Verify modal is open
    await expect(page.locator('text=Upload Image').nth(1)).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    // Click on a category filter
    await page.click('button:has-text("Ice Bath")');
    
    // Verify filter is applied (button should be highlighted)
    const categoryButton = page.locator('button:has-text("Ice Bath")');
    await expect(categoryButton).toHaveClass(/bg-primary/);
  });
});

test.describe('Product Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to admin
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`);
  });

  test('should display products tab', async ({ page }) => {
    // Click products tab
    await page.click('button:has-text("Products")');
    
    // Verify products content
    await expect(page.locator('text=Product Management')).toBeVisible();
    await expect(page.locator('button:has-text("Add Product")' )).toBeVisible();
  });

  test('should open add product modal', async ({ page }) => {
    // Navigate to products tab
    await page.click('button:has-text("Products")');
    
    // Click add product button
    await page.click('button:has-text("Add Product")');
    
    // Verify modal is open
    await expect(page.locator('text=Add Product').nth(1)).toBeVisible();
    await expect(page.locator('input[placeholder*="name"]')).toBeVisible();
  });

  test('should create a new product', async ({ page }) => {
    // Navigate to products tab
    await page.click('button:has-text("Products")');
    
    // Open add product modal
    await page.click('button:has-text("Add Product")');
    
    // Fill in product details
    await page.fill('input[type="text"]', 'Test Product');
    await page.fill('textarea', 'Test description');
    await page.fill('input[type="number"]', '99.99');
    
    // Select category
    await page.selectOption('select', 'workshop');
    
    // Save product
    await page.click('button:has-text("Save")');
    
    // Verify product was created (modal should close)
    await expect(page.locator('text=Add Product').nth(1)).not.toBeVisible();
  });
});

test.describe('Order Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`);
  });

  test('should display orders tab', async ({ page }) => {
    // Click orders tab
    await page.click('button:has-text("Orders")');
    
    // Verify orders content or empty state
    const ordersSection = page.locator('text=No orders yet, text=HC-');
    await expect(ordersSection.first()).toBeVisible();
  });

  test('should update order status', async ({ page }) => {
    // Navigate to orders tab
    await page.click('button:has-text("Orders")');
    
    // Check if there are any orders
    const orderExists = await page.locator('select').first().isVisible();
    
    if (orderExists) {
      // Get current status
      const statusSelect = page.locator('select').first();
      
      // Change status
      await statusSelect.selectOption('confirmed');
      
      // Wait for update (page should refresh or show success)
      await page.waitForTimeout(1000);
      
      // Verify status was updated
      await expect(statusSelect).toHaveValue('confirmed');
    }
  });
});
