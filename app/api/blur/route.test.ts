import { NextRequest } from 'next/server'
import { POST } from '@/app/api/blur/route'

// Mock the supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ data: { path: 'blurred/image.jpg' } }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/blurred/image.jpg' } })
      })
    }
  }))
}))

// Mock the image processing functions
jest.mock('@/lib/image-processing', () => ({
  applyBlurToImage: jest.fn().mockResolvedValue(Buffer.from('blurred-image-data')),
}))

describe('Blur API Route', () => {
  it('should process an image and return the blurred URL', async () => {
    const formData = new FormData()
    const imageBlob = new Blob(['fake-image-data'], { type: 'image/jpeg' })
    formData.append('image', imageBlob, 'test.jpg')
    formData.append('blurAmount', '10')
    
    const request = new NextRequest('http://localhost:3000/api/blur', {
      method: 'POST',
      body: formData,
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('url')
    expect(data.url).toBe('https://example.com/blurred/image.jpg')
  })
})
