export type PixelCell = string | null

/** Serialize grid to compact string for persistence tests. */
export function serializeGrid(cells: readonly PixelCell[], width: number): string {
  if (width <= 0 || cells.length === 0) return ''
  const rows: string[] = []
  for (let i = 0; i < cells.length; i += width) {
    const chunk = cells.slice(i, i + width).map((c) => (c === null ? '.' : c)).join('')
    rows.push(chunk)
  }
  return rows.join('|')
}

export function clearGrid(length: number): PixelCell[] {
  return Array.from({ length }, () => null)
}
