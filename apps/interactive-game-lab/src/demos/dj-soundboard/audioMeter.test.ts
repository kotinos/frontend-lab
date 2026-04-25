import { describe, expect, it } from 'vitest'
import { rms } from './audioMeter.ts'

describe('audioMeter', () => {
  it('computes RMS of flat signal', () => {
    const buf = new Float32Array([1, 1, 1, 1])
    expect(rms(buf)).toBeCloseTo(1, 5)
  })

  it('returns 0 for empty buffer', () => {
    expect(rms(new Float32Array(0))).toBe(0)
  })
})
