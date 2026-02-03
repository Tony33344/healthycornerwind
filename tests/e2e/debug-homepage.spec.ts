import { test, expect } from '@playwright/test'

test('debug homepage content', async ({ page }) => {
  await page.goto('/en')
  
  // Debug what's actually on the page
  const h1Text = await page.locator('h1').textContent()
  console.log('H1 text:', h1Text)
  
  const allH1s = await page.locator('h1').all()
  console.log('Number of H1s:', allH1s.length)
  
  for (let i = 0; i < allH1s.length; i++) {
    const text = await allH1s[i].textContent()
    console.log(`H1 ${i}:`, text)
  }
  
  // Check if page loaded successfully
  await expect(page).toHaveTitle(/healthy corner/i)
})
