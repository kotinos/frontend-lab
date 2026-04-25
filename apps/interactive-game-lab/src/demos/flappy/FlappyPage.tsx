import { useEffect, useRef } from 'react'
import { rectsOverlap, type Rect } from './flappyLogic.ts'

type Particle = { x: number; y: number; vx: number; vy: number; life: number; hue: number }

export default function FlappyPage() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let last = performance.now()
    let score = 0
    let alive = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const bird: Rect & { vy: number } = { x: 120, y: 220, w: 34, h: 28, vy: 0 }
    const gravity = 1650
    const flap = -520
    const pipes: { x: number; gapY: number; passed: boolean }[] = []
    const particles: Particle[] = []
    let spawnTimer = 0
    let bgShift = 0

    const spawnPipe = () => {
      const gapY = 140 + Math.random() * (canvas.clientHeight - 280)
      pipes.push({ x: canvas.clientWidth + 40, gapY, passed: false })
    }

    const burst = (x: number, y: number) => {
      for (let i = 0; i < 36; i++) {
        const a = (Math.PI * 2 * i) / 36
        const sp = 120 + Math.random() * 180
        particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          hue: 20 + Math.random() * 40,
        })
      }
    }

    const onDown = () => {
      if (!alive) {
        alive = true
        score = 0
        pipes.length = 0
        bird.y = canvas.clientHeight * 0.45
        bird.vy = flap * 0.4
        particles.length = 0
        return
      }
      bird.vy = flap
    }

    window.addEventListener('pointerdown', onDown)

    const step = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      const w = canvas.clientWidth
      const h = canvas.clientHeight

      bgShift += dt * 28

      if (alive) {
        bird.vy += gravity * dt
        bird.y += bird.vy * dt

        spawnTimer -= dt
        if (spawnTimer <= 0) {
          spawnPipe()
          spawnTimer = 1.45 + Math.random() * 0.35
        }

        for (const p of pipes) {
          p.x -= 210 * dt
          const top: Rect = { x: p.x, y: -10, w: 72, h: p.gapY - 90 }
          const bottom: Rect = { x: p.x, y: p.gapY + 90, w: 72, h: h + 20 }
          if (rectsOverlap(bird, top) || rectsOverlap(bird, bottom) || bird.y < -20 || bird.y > h - bird.h + 20) {
            alive = false
            burst(bird.x + bird.w / 2, bird.y + bird.h / 2)
          }
          if (!p.passed && p.x + 72 < bird.x) {
            p.passed = true
            score += 1
          }
        }
        while (pipes.length && pipes[0].x < -120) pipes.shift()
      }

      for (const q of particles) {
        q.x += q.vx * dt
        q.y += q.vy * dt
        q.vy += 420 * dt
        q.life -= dt * 1.1
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].life <= 0) particles.splice(i, 1)
      }

      // sky layers
      const g1 = ctx.createLinearGradient(0, 0, w, h)
      g1.addColorStop(0, '#0f172a')
      g1.addColorStop(0.45, '#312e81')
      g1.addColorStop(1, '#fb7185')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h)

      // parallax hills
      ctx.save()
      ctx.globalAlpha = 0.35
      ctx.fillStyle = '#1e1b4b'
      for (let i = 0; i < 6; i++) {
        const bx = ((i * 260 - (bgShift * 0.25)) % (w + 300)) - 150
        ctx.beginPath()
        ctx.ellipse(bx, h * 0.72, 180, 90, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      ctx.save()
      ctx.globalAlpha = 0.45
      ctx.fillStyle = '#0ea5e9'
      for (let i = 0; i < 5; i++) {
        const bx = ((i * 320 - (bgShift * 0.55)) % (w + 360)) - 180
        ctx.beginPath()
        ctx.ellipse(bx, h * 0.78, 220, 110, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      // pipes
      for (const p of pipes) {
        ctx.fillStyle = 'rgba(15,23,42,0.85)'
        ctx.strokeStyle = 'rgba(148,163,184,0.35)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(p.x, 0, 72, p.gapY - 90, 14)
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.roundRect(p.x, p.gapY + 90, 72, h - (p.gapY + 90), 14)
        ctx.fill()
        ctx.stroke()
      }

      // bird diamond
      ctx.save()
      ctx.translate(bird.x + bird.w / 2, bird.y + bird.h / 2)
      ctx.rotate(Math.min(0.9, Math.max(-0.6, bird.vy * 0.0012)))
      ctx.fillStyle = '#e2e8f0'
      ctx.shadowColor = 'rgba(56,189,248,0.9)'
      ctx.shadowBlur = 28
      ctx.beginPath()
      ctx.moveTo(18, 0)
      ctx.lineTo(0, 12)
      ctx.lineTo(-18, 0)
      ctx.lineTo(0, -12)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      for (const q of particles) {
        ctx.fillStyle = `hsla(${q.hue},95%,62%,${Math.max(0, q.life)})`
        ctx.fillRect(q.x, q.y, 4, 4)
      }

      ctx.fillStyle = 'rgba(15,23,42,0.55)'
      ctx.strokeStyle = 'rgba(148,163,184,0.35)'
      ctx.lineWidth = 1
      ctx.font = '600 14px Space Grotesk, Inter, system-ui'
      ctx.textBaseline = 'middle'
      const label = alive ? `Score ${score}` : 'Tap to restart'
      const tw = ctx.measureText(label).width
      const padX = 18
      const boxW = tw + padX * 2
      const boxH = 40
      const bx = w - boxW - 18
      const by = 18
      ctx.beginPath()
      ctx.roundRect(bx, by, boxW, boxH, 999)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#e2e8f0'
      ctx.fillText(label, bx + padX, by + boxH / 2)

      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-200/80">Core logic · Motion FX</p>
        <h1 className="font-display mt-2 text-3xl font-semibold text-white">Geometric Runner</h1>
        <p className="mt-2 text-sm text-slate-300">Canvas parallax, soft lighting, burst particles on crash.</p>
      </div>
      <canvas ref={ref} className="h-[560px] w-full rounded-[2rem] border border-white/10 bg-slate-950 shadow-[0_40px_120px_rgba(2,6,23,0.85)]" />
    </div>
  )
}
