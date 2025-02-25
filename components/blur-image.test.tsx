import React from 'react'
import { render, screen } from '@/lib/test-utils'
import BlurImage from './blur-image'

// Mocking next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />
  },
}))

describe('BlurImage Component', () => {
  it('renders the image with correct props', () => {
    render(
      <BlurImage 
        src="/test-image.jpg" 
        alt="Test image" 
        width={400} 
        height={300} 
        blurAmount={10}
      />
    )
    
    const image = screen.getByAltText('Test image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveStyle('filter: blur(10px)')
  })
  
  it('applies default blur when no amount is specified', () => {
    render(
      <BlurImage 
        src="/test-image.jpg" 
        alt="Test image" 
        width={400} 
        height={300}
      />
    )
    
    const image = screen.getByAltText('Test image')
    expect(image).toHaveStyle('filter: blur(5px)')
  })
})
