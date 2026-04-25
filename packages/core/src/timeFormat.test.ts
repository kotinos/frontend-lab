import { describe, expect, it } from 'vitest'
import { formatMmSs } from './timeFormat.js'

describe('formatMmSs', () => {
  it('formats zero', () => {
    expect(formatMmSs(0)).toBe('00:00')
  })

  it('pads minutes and seconds', () => {
    expect(formatMmSs(65)).toBe('01:05')
  })

  it('handles large durations', () => {
    expect(formatMmSs(3599)).toBe('59:59')
  })

  it('floors fractional seconds', () => {
    expect(formatMmSs(9.9)).toBe('00:09')
  })

  it('returns 00:00 for negative or NaN', () => {
    expect(formatMmSs(-1)).toBe('00:00')
    expect(formatMmSs(Number.NaN)).toBe('00:00')
  })
})
