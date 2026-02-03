import { test, expect } from '@playwright/test'

test.describe('Admin Bookings Management (local bypass)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')
    await page.fill('#email', 'admin@healthycorner.com')
    await page.fill('#password', 'Admin123!Secure')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/admin/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('navigate to bookings page and see table or empty state', async ({ page }) => {
    await page.goto('/admin/bookings')
    const title = page.locator('[data-testid="admin-bookings-title"]')
    await expect(title).toBeVisible()

    const table = page.locator('[data-testid="bookings-table"]')
    const empty = page.locator('[data-testid="empty-state"]')

    await expect(Promise.race([
      table.first().isVisible(),
      empty.first().isVisible()
    ])).resolves.toBeTruthy()
  })

  test('optionally update a pending booking to confirmed (if any)', async ({ page }) => {
    await page.goto('/admin/bookings')
    const pendingConfirmBtn = page.locator('button[title="Confirm"]')
    if (await pendingConfirmBtn.first().isVisible()) {
      await pendingConfirmBtn.first().click()
      // status pill should change to confirmed
      const statusPill = page.locator('span.rounded-full', { hasText: 'confirmed' }).first()
      await expect(statusPill).toBeVisible({ timeout: 5000 })
    } else {
      test.skip(true, 'No pending booking found to confirm')
    }
  })

  test('logout clears admin session', async ({ page }) => {
    await page.goto('/admin/dashboard')
    const logout = page.locator('button:has-text("Sign Out")')
    await logout.click()
    await page.waitForURL('**/admin/login')
    await expect(page.locator('text=Admin Dashboard Login')).toBeVisible()
  })
})
