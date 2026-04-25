import { describe, expect, it } from 'vitest'
import { moveItemInArray } from './reorder.js'

describe('moveItemInArray', () => {
  it('returns empty array when input empty', () => {
    expect(moveItemInArray([], 0, 2)).toEqual([])
  })

  it('moves first item to end', () => {
    expect(moveItemInArray(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a'])
  })

  it('moves last item to start', () => {
    expect(moveItemInArray(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b'])
  })

  it('does not mutate original', () => {
    const original = ['x', 'y']
    const copy = moveItemInArray(original, 0, 1)
    expect(original).toEqual(['x', 'y'])
    expect(copy).toEqual(['y', 'x'])
  })

  it('clamps out-of-range indices', () => {
    expect(moveItemInArray([1, 2, 3], -99, 99)).toEqual([2, 3, 1])
  })
})
