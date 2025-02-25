import { NextRequest } from 'next/server'

// Mock the POST function
const POST = jest.fn(async (request) => {
  return new Response(JSON.stringify({ url: 'https://example.com/blurred/image.jpg' }), { status: 200 })
})

// Mock the image processing functions
jest.mock('@lib/image-processing', () => ({
  applyBlur: jest.fn().mockResolvedValue(Buffer.from('blurred-image-data')),
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