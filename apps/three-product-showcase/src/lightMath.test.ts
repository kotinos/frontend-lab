import { describe, expect, it } from 'vitest'
import { damp } from './lightMath.ts'

describe('damp', () => {
  it('moves toward target', () => {
    expect(damp(0, 10, 0.9, 1 / 60)).toBeGreaterThan(0)
    expect(damp(0, 10, 0.9, 1 / 60)).toBeLessThan(10)
  })

  it('reaches target when already equal', () => {
    expect(damp(5, 5, 0.9, 1 / 60)).toBe(5)
  })
})
