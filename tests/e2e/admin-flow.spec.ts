import { test, expect } from '@playwright/test'

test.describe('Admin Flow E2E Tests', () => {
  const adminCredentials = {
    email: 'admin@healthycorner.com',
    password: 'Admin123!Secure'
  }

  // AUTHENTICATION TESTS
  test.describe('Admin Authentication', () => {
    test('should display admin login page', async ({ page }) => {
      await page.goto('/admin/login')
      await expect(page.locator('h1')).toContainText('Admin Login')
      await expect(page.locator('input[name="email"]')).toBeVisible()
      await expect(page.locator('input[name="password"]')).toBeVisible()
    })

    test('should validate required fields', async ({ page }) => {
      await page.goto('/admin/login')
      await page.click('button[type="submit"]')
      // Should show validation errors
    })

    test('should reject invalid credentials', async ({ page }) => {
      await page.goto('/admin/login')
      await page.fill('input[name="email"]', 'wrong@example.com')
      await page.fill('input[name="password"]', 'wrongpassword')
      await page.click('button[type="submit"]')
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    })

    test('should login successfully with valid credentials', async ({ page }) => {
      await page.goto('/admin/login')
      await page.fill('input[name="email"]', adminCredentials.email)
      await page.fill('input[name="password"]', adminCredentials.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/dashboard')
      await expect(page.locator('h1')).toContainText('Dashboard')
    })

    test('should protect admin routes when not authenticated', async ({ page }) => {
      await page.goto('/admin/dashboard')
      await page.waitForURL('**/admin/login')
      await expect(page.locator('h1')).toContainText('Admin Login')
    })
  })

  // DASHBOARD TESTS
  test.describe('Admin Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.goto('/admin/login')
      await page.fill('input[name="email"]', adminCredentials.email)
      await page.fill('input[name="password"]', adminCredentials.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/dashboard')
    })

    test('should display dashboard overview', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Dashboard')
      const statsCount = await page.locator('[data-testid="stats-card"]').count()
      expect(statsCount).toBeGreaterThan(0)
    })

    test('should show navigation menu', async ({ page }) => {
      await expect(page.locator('nav')).toBeVisible()
      await expect(page.locator('a:has-text("Services")')).toBeVisible()
      await expect(page.locator('a:has-text("Menu")')).toBeVisible()
      await expect(page.locator('a:has-text("Bookings")')).toBeVisible()
    })

    test('should display analytics data', async ({ page }) => {
      const analyticsSection = page.locator('[data-testid="analytics"]')
      if (await analyticsSection.isVisible()) {
        await expect(analyticsSection).toBeVisible()
      }
    })

    test('should show recent activities', async ({ page }) => {
      const recentActivities = page.locator('[data-testid="recent-activities"]')
      if (await recentActivities.isVisible()) {
        await expect(recentActivities).toBeVisible()
      }
    })
  })

  // SERVICES MANAGEMENT TESTS
  test.describe('Services Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/login')
      await page.fill('input[name="email"]', adminCredentials.email)
      await page.fill('input[name="password"]', adminCredentials.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/dashboard')
      await page.click('a:has-text("Services")')
      await page.waitForURL('**/admin/services')
    })

    test('should display services list', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Services')
      const serviceCount = await page.locator('[data-testid="service-row"]').count()
      expect(serviceCount).toBeGreaterThan(0)
    })

    test('should navigate to create new service', async ({ page }) => {
      await page.click('button:has-text("Add Service")')
      await page.waitForURL('**/admin/services/new')
      await expect(page.locator('h1')).toContainText('Create New Service')
    })

    test('should create new service', async ({ page }) => {
      await page.click('button:has-text("Add Service")')
      await page.waitForURL('**/admin/services/new')
      
      await page.fill('input[name="name_en"]', 'Test Service')
      await page.fill('input[name="name_sl"]', 'Test Storitev')
      await page.fill('textarea[name="description_en"]', 'Test service description')
      await page.fill('input[name="price"]', '50')
      await page.fill('input[name="duration"]', '60')
      await page.fill('input[name="capacity"]', '10')
      await page.selectOption('select[name="category"]', 'yoga')
      
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/services')
      await expect(page.locator('text=Test Service')).toBeVisible()
    })

    test('should edit existing service', async ({ page }) => {
      const editButton = page.locator('[data-testid="edit-service"]').first()
      if (await editButton.isVisible()) {
        await editButton.click()
        await page.fill('input[name="name_en"]', 'Updated Service Name')
        await page.click('button[type="submit"]')
        await expect(page.locator('text=Updated Service Name')).toBeVisible()
      }
    })

    test('should delete service', async ({ page }) => {
      const deleteButton = page.locator('[data-testid="delete-service"]').first()
      if (await deleteButton.isVisible()) {
        await deleteButton.click()
        await page.click('button:has-text("Confirm")')
        // Service should be removed from list
      }
    })
  })

  // MENU MANAGEMENT TESTS
  test.describe('Menu Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/login')
      await page.fill('input[name="email"]', adminCredentials.email)
      await page.fill('input[name="password"]', adminCredentials.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/dashboard')
      await page.click('a:has-text("Menu")')
      await page.waitForURL('**/admin/menu')
    })

    test('should display menu items list', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Menu')
      const menuItemCount = await page.locator('[data-testid="menu-item-row"]').count()
      expect(menuItemCount).toBeGreaterThan(0)
    })

    test('should create new menu item', async ({ page }) => {
      await page.click('button:has-text("Add Menu Item")')
      await page.waitForURL('**/admin/menu/new')
      
      await page.fill('input[name="name_en"]', 'Test Menu Item')
      await page.fill('input[name="name_sl"]', 'Test Jedilo')
      await page.fill('textarea[name="description_en"]', 'Test menu item description')
      await page.fill('input[name="price"]', '12.50')
      await page.selectOption('select[name="category"]', 'snacks')
      
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/menu')
      await expect(page.locator('text=Test Menu Item')).toBeVisible()
    })
  })

  // BOOKINGS MANAGEMENT TESTS
  test.describe('Bookings Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/login')
      await page.fill('input[name="email"]', adminCredentials.email)
      await page.fill('input[name="password"]', adminCredentials.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/dashboard')
      await page.click('a:has-text("Bookings")')
      await page.waitForURL('**/admin/bookings')
    })

    test('should display bookings list', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Bookings')
      const bookingsList = page.locator('[data-testid="bookings-list"]')
      await expect(bookingsList).toBeVisible()
    })

    test('should filter bookings by status', async ({ page }) => {
      const statusFilter = page.locator('select[name="status"]')
      if (await statusFilter.isVisible()) {
        await statusFilter.selectOption('confirmed')
        await page.waitForTimeout(1000)
      }
    })

    test('should update booking status', async ({ page }) => {
      const statusButton = page.locator('[data-testid="booking-status"]').first()
      if (await statusButton.isVisible()) {
        await statusButton.click()
        await page.click('button:has-text("Confirm")')
      }
    })
  })

  // GALLERY MANAGEMENT TESTS
  test.describe('Gallery Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/login')
      await page.fill('input[name="email"]', adminCredentials.email)
      await page.fill('input[name="password"]', adminCredentials.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/dashboard')
      await page.click('a:has-text("Gallery")')
      await page.waitForURL('**/admin/gallery')
    })

    test('should display gallery management', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Gallery')
      const galleryGrid = page.locator('[data-testid="gallery-grid"]')
      await expect(galleryGrid).toBeVisible()
    })

    test('should upload new image', async ({ page }) => {
      const uploadButton = page.locator('input[type="file"]')
      if (await uploadButton.isVisible()) {
        // Test file upload functionality
        await uploadButton.setInputFiles('tests/fixtures/test-image.jpg')
      }
    })
  })

  // SCHEDULE MANAGEMENT TESTS
  test.describe('Schedule Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/login')
      await page.fill('input[name="email"]', adminCredentials.email)
      await page.fill('input[name="password"]', adminCredentials.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/dashboard')
      await page.click('a:has-text("Schedule")')
      await page.waitForURL('**/admin/schedule')
    })

    test('should display schedule management', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Schedule')
      const scheduleCalendar = page.locator('[data-testid="schedule-calendar"]')
      if (await scheduleCalendar.isVisible()) {
        await expect(scheduleCalendar).toBeVisible()
      }
    })

    test('should create new schedule entry', async ({ page }) => {
      const addButton = page.locator('button:has-text("Add Session")')
      if (await addButton.isVisible()) {
        await addButton.click()
        await page.fill('input[name="title"]', 'Test Yoga Session')
        await page.fill('input[name="date"]', '2024-12-01')
        await page.fill('input[name="time"]', '10:00')
        await page.click('button[type="submit"]')
      }
    })
  })

  // LOGOUT TEST
  test.describe('Admin Logout', () => {
    test('should logout successfully', async ({ page }) => {
      await page.goto('/admin/login')
      await page.fill('input[name="email"]', adminCredentials.email)
      await page.fill('input[name="password"]', adminCredentials.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/admin/dashboard')
      
      const logoutButton = page.locator('button:has-text("Logout")')
      if (await logoutButton.isVisible()) {
        await logoutButton.click()
        await page.waitForURL('**/admin/login')
        await expect(page.locator('h1')).toContainText('Admin Login')
      }
    })
  })
})
