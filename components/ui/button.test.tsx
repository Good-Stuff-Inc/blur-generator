import React from 'react'
import { render, screen } from '@/lib/test-utils'
import { Button } from './button'
import userEvent from '@testing-library/user-event'

describe('Button component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    
    await userEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeDisabled()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="outline">Outline Button</Button>)
    expect(screen.getByRole('button', { name: /outline button/i })).toHaveClass('border')
    
    rerender(<Button variant="destructive">Destructive Button</Button>)
    expect(screen.getByRole('button', { name: /destructive button/i })).toHaveClass('bg-destructive')
  })
})
