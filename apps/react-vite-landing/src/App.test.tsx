import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App.tsx'

describe('App', () => {
  it('renders hero and CTA', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Orchestrate models/i)
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument()
  })
})
