import { describe, expect, it } from 'vitest'
import { rectsOverlap, type Rect } from './flappyLogic.ts'

describe('flappyLogic', () => {
  it('detects overlap', () => {
    const a: Rect = { x: 0, y: 0, w: 10, h: 10 }
    const b: Rect = { x: 5, y: 5, w: 10, h: 10 }
    expect(rectsOverlap(a, b)).toBe(true)
  })

  it('returns false when separated', () => {
    const a: Rect = { x: 0, y: 0, w: 10, h: 10 }
    const b: Rect = { x: 20, y: 20, w: 10, h: 10 }
    expect(rectsOverlap(a, b)).toBe(false)
  })
})
