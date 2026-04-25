/**
 * SVG circle stroke-dashoffset for a progress ring (0 = full, 1 = empty).
 * `circumference` is typically 2 * PI * r.
 */
export function ringDashOffset(progress01: number, circumference: number): number {
  const p = clamp01(progress01)
  return circumference * (1 - p)
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}
