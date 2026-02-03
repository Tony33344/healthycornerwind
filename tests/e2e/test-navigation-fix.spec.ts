import { test, expect } from '@playwright/test'

test('test navigation fix', async ({ page }) => {
  await page.goto('/en')
  
  // Wait for page to load
  await page.waitForTimeout(3000)
  
  // Try normal click on Services
  try {
    await page.click('text=Services')
    await page.waitForTimeout(2000)
    
    const currentUrl = page.url()
    if (currentUrl.includes('/services')) {
      console.log('✅ Normal click on Services works!')
    } else {
      console.log('❌ Normal click failed, current URL:', currentUrl)
    }
  } catch (error) {
    console.log('❌ Normal click failed with error:', error.message)
  }
})
