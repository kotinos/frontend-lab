/** Exponential smoothing step toward `target` from `current` (0–1 blend per second-ish). */
export function damp(current: number, target: number, smooth: number, delta: number): number {
  const t = 1 - Math.pow(smooth, delta * 60)
  return current + (target - current) * t
}
