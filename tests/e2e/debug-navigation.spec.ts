import { test, expect } from '@playwright/test'

test('debug navigation issue', async ({ page }) => {
  await page.goto('/en')
  
  // Wait for page to load
  await page.waitForTimeout(3000)
  
  // Check what's intercepting clicks
  const servicesLink = page.locator('text=Services').first()
  
  console.log('Services link found:', await servicesLink.count())
  
  // Try to get the bounding box
  const box = await servicesLink.boundingBox()
  console.log('Services link position:', box)
  
  // Check what element is at that position
  if (box) {
    const elementAtPosition = await page.locator(`xpath=//*[contains(@class, "pt-16")]`).all()
    console.log('Elements with pt-16:', elementAtPosition.length)
    
    for (let i = 0; i < elementAtPosition.length; i++) {
      const className = await elementAtPosition[i].getAttribute('class')
      console.log(`pt-16 element ${i}:`, className)
    }
  }
  
  // Try force click
  try {
    await servicesLink.click({ force: true })
    console.log('Force click succeeded')
  } catch (error) {
    console.log('Force click failed:', error.message)
  }
})
