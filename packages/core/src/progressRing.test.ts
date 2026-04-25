import { describe, expect, it } from 'vitest'
import { ringDashOffset } from './progressRing.js'

describe('ringDashOffset', () => {
  const c = 100

  it('full progress hides no stroke', () => {
    expect(ringDashOffset(1, c)).toBe(0)
  })

  it('zero progress shows full offset', () => {
    expect(ringDashOffset(0, c)).toBe(c)
  })

  it('half progress', () => {
    expect(ringDashOffset(0.5, c)).toBe(50)
  })

  it('clamps out of range', () => {
    expect(ringDashOffset(2, c)).toBe(0)
    expect(ringDashOffset(-1, c)).toBe(c)
  })
})
