import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load the home page correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check if the title exists
    await expect(page).toHaveTitle(/Blur Generator/)
    
    // Check if the main heading exists
    const heading = page.getByRole('heading', { name: /blur generator/i, level: 1 })
    await expect(heading).toBeVisible()
    
    // Check if the file upload component exists
    const uploadButton = page.getByText(/upload image/i)
    await expect(uploadButton).toBeVisible()
  })

  test('should display error for invalid file format', async ({ page }) => {
    await page.goto('/')
    
    // Upload a text file instead of an image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is not an image'),
    })
    
    // Check if error message is displayed
    const errorMessage = page.getByText(/only image files are allowed/i)
    await expect(errorMessage).toBeVisible()
  })

  test('should toggle theme', async ({ page }) => {
    await page.goto('/')
    
    // Find and click the theme toggle button
    const themeToggle = page.getByLabel(/toggle theme/i)
    await themeToggle.click()
    
    // Check if the theme changed by looking for the dark class on the html element
    const isDarkMode = await page.$eval('html', (el) => el.classList.contains('dark'))
    expect(isDarkMode).toBeTruthy()
    
    // Toggle back to light theme
    await themeToggle.click()
    
    // Check if back to light theme
    const isLightMode = await page.$eval('html', (el) => !el.classList.contains('dark'))
    expect(isLightMode).toBeTruthy()
  })
})
