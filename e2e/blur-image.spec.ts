import { test, expect } from '@playwright/test'
import path from 'path'

test.describe('Blur Image Functionality', () => {
  test('should upload and blur an image', async ({ page }) => {
    // Navigate to home page
    await page.goto('/')
    
    // Prepare a test image path
    const imagePath = path.join(__dirname, '../public/test-image.jpg')
    
    // Upload the image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(imagePath)
    
    // Adjust blur amount
    const blurSlider = page.locator('input[type="range"]')
    await blurSlider.fill('8')
    
    // Click the blur button
    await page.getByRole('button', { name: /apply blur/i }).click()
    
    // Wait for the blurred image to appear
    await page.waitForSelector('img[alt="Blurred image"]')
    
    // Check if the blurred image is visible
    const blurredImage = page.locator('img[alt="Blurred image"]')
    await expect(blurredImage).toBeVisible()
    
    // Check if download button is available
    const downloadButton = page.getByRole('button', { name: /download/i })
    await expect(downloadButton).toBeVisible()
  })
})
