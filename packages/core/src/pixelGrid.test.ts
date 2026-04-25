import { describe, expect, it } from 'vitest'
import { clearGrid, serializeGrid } from './pixelGrid.js'

describe('serializeGrid', () => {
  it('serializes rows with pipe separator', () => {
    const g = ['#', null, null, '#']
    expect(serializeGrid(g, 2)).toBe('#.|.#')
  })

  it('returns empty for invalid width', () => {
    expect(serializeGrid(['#'], 0)).toBe('')
  })
})

describe('clearGrid', () => {
  it('creates null-filled array', () => {
    expect(clearGrid(3)).toEqual([null, null, null])
  })
})
