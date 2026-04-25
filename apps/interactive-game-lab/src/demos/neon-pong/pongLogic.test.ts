import { describe, expect, it } from 'vitest'
import { paddleDeflect, type Ball, type Paddle } from './pongLogic.ts'

describe('pongLogic', () => {
  it('deflects horizontally toward center when hitting left paddle', () => {
    const ball: Ball = { x: 24, y: 232, vx: -6, vy: 0, r: 6 }
    const paddle: Paddle = { x: 12, y: 180, w: 12, h: 60 }
    const next = paddleDeflect(ball, paddle, 'left')
    expect(next.vx).toBeGreaterThan(0)
    expect(Math.abs(next.vy)).toBeGreaterThan(0)
  })
})
