import { test, expect } from '@playwright/test'

test('debug admin login page', async ({ page }) => {
  await page.goto('/admin/login')
  
  // Debug what's actually on the page
  const h1Text = await page.locator('h1').textContent()
  console.log('H1 text:', h1Text)
  
  // Check for email input with different selectors
  const emailById = page.locator('#email')
  const emailByType = page.locator('input[type="email"]')
  const emailByName = page.locator('input[name="email"]')
  
  console.log('Email by ID visible:', await emailById.isVisible())
  console.log('Email by type visible:', await emailByType.isVisible())
  console.log('Email by name visible:', await emailByName.isVisible())
  
  // Check all inputs
  const allInputs = await page.locator('input').all()
  console.log('Number of inputs:', allInputs.length)
  
  for (let i = 0; i < allInputs.length; i++) {
    const type = await allInputs[i].getAttribute('type')
    const name = await allInputs[i].getAttribute('name')
    const id = await allInputs[i].getAttribute('id')
    console.log(`Input ${i}: type=${type}, name=${name}, id=${id}`)
  }
})
