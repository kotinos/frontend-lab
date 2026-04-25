import { useEffect, useRef } from 'react'
import { paddleDeflect, type Ball, type Paddle } from './pongLogic.ts'

type Trail = { x: number; y: number; a: number }

export default function NeonPongPage() {
  const host = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const shell = host.current
    if (!canvas || !shell) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const ball: Ball = { x: 400, y: 260, vx: 360, vy: 140, r: 9 }
    const left: Paddle = { x: 26, y: 220, w: 14, h: 110 }
    const right: Paddle = { x: 0, y: 240, w: 14, h: 110 }
    const trail: Trail[] = []
    const sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = []
    let scoreL = 0
    let scoreR = 0
    let shakeT = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      right.x = w - 40
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const resetBall = (w: number, h: number, dir: number) => {
      ball.x = w / 2
      ball.y = h / 2
      ball.vx = dir * 360
      ball.vy = 120 + Math.random() * 80
    }

    const sparkBurst = (x: number, y: number) => {
      for (let i = 0; i < 18; i++) {
        const a = (Math.PI * 2 * i) / 18
        const sp = 220 + Math.random() * 160
        sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1 })
      }
    }

    const hitPaddle = (paddle: Paddle, side: 'left' | 'right') => {
      const def = paddleDeflect(ball, paddle, side)
      Object.assign(ball, def)
      sparkBurst(side === 'left' ? paddle.x + paddle.w + ball.r : paddle.x - ball.r, ball.y)
      shakeT = 0.22
      shell.style.animation = 'none'
      requestAnimationFrame(() => {
        shell.style.animation = 'pong-shake 0.22s ease'
      })
    }

    let last = performance.now()
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000)
      last = now
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (shakeT > 0) shakeT -= dt

      ball.x += ball.vx * dt
      ball.y += ball.vy * dt

      if (ball.y < ball.r) {
        ball.y = ball.r
        ball.vy *= -1
      } else if (ball.y > h - ball.r) {
        ball.y = h - ball.r
        ball.vy *= -1
      }

      const aiSpeed = 320 * dt
      const target = ball.y - right.h / 2
      right.y += Math.max(-aiSpeed, Math.min(aiSpeed, target - right.y))

      const leftRect = { x: left.x, y: left.y, w: left.w, h: left.h }
      const rightRect = { x: right.x, y: right.y, w: right.w, h: right.h }

      if (ball.vx < 0 && ball.x - ball.r < leftRect.x + leftRect.w && ball.x > leftRect.x) {
        if (ball.y > leftRect.y && ball.y < leftRect.y + leftRect.h) {
          ball.x = leftRect.x + leftRect.w + ball.r
          hitPaddle({ ...left, y: leftRect.y }, 'left')
        }
      } else if (ball.vx > 0 && ball.x + ball.r > rightRect.x && ball.x < rightRect.x + rightRect.w) {
        if (ball.y > rightRect.y && ball.y < rightRect.y + rightRect.h) {
          ball.x = rightRect.x - ball.r
          hitPaddle({ ...right, y: rightRect.y }, 'right')
        }
      }

      if (ball.x < -40) {
        scoreR += 1
        resetBall(w, h, 1)
      } else if (ball.x > w + 40) {
        scoreL += 1
        resetBall(w, h, -1)
      }

      trail.push({ x: ball.x, y: ball.y, a: 0.55 })
      while (trail.length > 42) trail.shift()
      for (const t of trail) t.a *= 0.96

      for (const s of sparks) {
        s.x += s.vx * dt
        s.y += s.vy * dt
        s.life -= dt * 1.4
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        if (sparks[i].life <= 0) sparks.splice(i, 1)
      }

      const ox = shakeT > 0 ? (Math.random() - 0.5) * 10 : 0
      const oy = shakeT > 0 ? (Math.random() - 0.5) * 8 : 0
      ctx.save()
      ctx.translate(ox, oy)
      ctx.clearRect(-20, -20, w + 40, h + 40)
      ctx.fillStyle = '#000000'
      ctx.fillRect(-20, -20, w + 40, h + 40)

      ctx.save()
      ctx.shadowColor = 'rgba(255,255,255,0.95)'
      ctx.shadowBlur = 32
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'
      ctx.lineWidth = 4
      ctx.strokeRect(leftRect.x, leftRect.y, leftRect.w, leftRect.h)
      ctx.strokeRect(rightRect.x, rightRect.y, rightRect.w, rightRect.h)
      for (const t of trail) {
        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${t.a * 0.35})`
        ctx.arc(t.x, t.y, ball.r * 0.9, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.beginPath()
      ctx.fillStyle = '#ffffff'
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      for (const s of sparks) {
        ctx.fillStyle = `rgba(125,211,252,${Math.max(0, s.life)})`
        ctx.fillRect(s.x, s.y, 3, 3)
      }

      ctx.fillStyle = 'rgba(248,250,252,0.85)'
      ctx.font = '600 14px Space Grotesk, Inter, system-ui'
      ctx.fillText(`${scoreL}   neon   ${scoreR}`, w / 2 - 70, 32)
      ctx.restore()

      raf = requestAnimationFrame(step)
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const ny = e.clientY - rect.top - left.h / 2
      left.y = Math.max(12, Math.min(rect.height - left.h - 12, ny))
    }
    canvas.addEventListener('pointermove', onMove)

    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Motion FX · Visual shell</p>
        <h1 className="font-display mt-2 text-3xl font-semibold text-white">Neon Pong</h1>
        <p className="mt-2 text-sm text-slate-300">Bloom strokes, fading trail, sparks and shake on paddle hits.</p>
      </div>
      <div
        ref={host}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_40px_120px_rgba(2,6,23,0.85)]"
        style={{ animation: 'none' }}
      >
        <canvas ref={canvasRef} className="h-[520px] w-full bg-black" style={{ filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.55))' }} />
        <div className="crt-overlay absolute inset-0" />
      </div>
      <style>{`@keyframes pong-shake {0%{transform:translate(0,0)}25%{transform:translate(3px,-2px)}50%{transform:translate(-4px,2px)}75%{transform:translate(2px,3px)}100%{transform:translate(0,0)}}`}</style>
    </div>
  )
}
