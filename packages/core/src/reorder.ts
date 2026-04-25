/**
 * Returns a new array with the item at `fromIndex` moved to `toIndex`.
 * Indices are clamped to valid range; no mutation of `items`.
 */
export function moveItemInArray<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  if (items.length === 0) {
    return []
  }
  const from = clampIndex(fromIndex, items.length)
  const to = clampIndex(toIndex, items.length)
  if (from === to) {
    return [...items]
  }
  const next = [...items]
  const [removed] = next.splice(from, 1)
  next.splice(to, 0, removed)
  return next
}

function clampIndex(index: number, length: number): number {
  if (length <= 0) return 0
  return Math.max(0, Math.min(length - 1, index))
}
