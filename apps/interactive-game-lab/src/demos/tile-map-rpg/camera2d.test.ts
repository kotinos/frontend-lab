import { describe, expect, it } from 'vitest'
import { screenToWorld, worldToScreen, type Camera2D } from './camera2d.ts'

describe('camera2d', () => {
  const cam: Camera2D = { cx: 100, cy: 50, scale: 2 }
  const w = 800
  const h = 600

  it('roundtrips center', () => {
    const world = screenToWorld(400, 300, cam, w, h)
    const back = worldToScreen(world.wx, world.wy, cam, w, h)
    expect(back.sx).toBeCloseTo(400, 5)
    expect(back.sy).toBeCloseTo(300, 5)
  })

  it('scales distance from center', () => {
    const a = screenToWorld(400, 300, cam, w, h)
    const b = screenToWorld(500, 300, cam, w, h)
    expect(b.wx - a.wx).toBeCloseTo(50, 5)
  })
})
