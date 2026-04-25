export type Ball = { x: number; y: number; vx: number; vy: number; r: number }
export type Paddle = { x: number; y: number; w: number; h: number }

export function paddleDeflect(ball: Ball, paddle: Paddle, side: 'left' | 'right'): Ball {
  const rel = (ball.y - (paddle.y + paddle.h / 2)) / (paddle.h / 2)
  const speed = Math.hypot(ball.vx, ball.vy) || 8
  const angle = Math.max(-1, Math.min(1, rel)) * 0.85
  const dir = side === 'left' ? 1 : -1
  const vx = dir * speed * Math.cos(angle * (Math.PI / 4))
  const vy = speed * Math.sin(angle * (Math.PI / 4))
  return { ...ball, vx, vy }
}
