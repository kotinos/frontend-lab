import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App.tsx'

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: ReactNode }) => <div data-testid="canvas">{children}</div>,
}))

vi.mock('./Scene.tsx', () => ({
  SceneContent: () => <div data-testid="scene" />,
}))

describe('App', () => {
  it('renders overlay copy', () => {
    render(<App />)
    expect(screen.getByText(/AeroStride One/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add to Cart/i })).toBeInTheDocument()
  })
})
