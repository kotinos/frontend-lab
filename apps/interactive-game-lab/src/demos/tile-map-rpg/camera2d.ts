export type Camera2D = { cx: number; cy: number; scale: number }

export function screenToWorld(
  sx: number,
  sy: number,
  cam: Camera2D,
  viewW: number,
  viewH: number,
): { wx: number; wy: number } {
  const ox = viewW / 2
  const oy = viewH / 2
  return {
    wx: cam.cx + (sx - ox) / cam.scale,
    wy: cam.cy + (sy - oy) / cam.scale,
  }
}

export function worldToScreen(
  wx: number,
  wy: number,
  cam: Camera2D,
  viewW: number,
  viewH: number,
): { sx: number; sy: number } {
  const ox = viewW / 2
  const oy = viewH / 2
  return {
    sx: ox + (wx - cam.cx) * cam.scale,
    sy: oy + (wy - cam.cy) * cam.scale,
  }
}
