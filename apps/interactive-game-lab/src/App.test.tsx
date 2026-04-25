import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './App.tsx'

describe('Interactive Game Lab', () => {
  it('renders the catalog of six demos', async () => {
    render(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(await screen.findByText('Six interactive surfaces')).toBeInTheDocument()
    expect(screen.getByText('Word Guessing')).toBeInTheDocument()
    expect(screen.getByText('Geometric Runner')).toBeInTheDocument()
    expect(screen.getByText('Premium Tic-Tac-Toe')).toBeInTheDocument()
    expect(screen.getByText('Map Explorer')).toBeInTheDocument()
    expect(screen.getByText('Neon Cyberpunk Pong')).toBeInTheDocument()
    expect(screen.getByText('DJ Soundboard')).toBeInTheDocument()
  })
})
