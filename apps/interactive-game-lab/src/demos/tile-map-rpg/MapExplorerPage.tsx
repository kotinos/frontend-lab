import { useEffect, useRef } from 'react'
import { worldToScreen, type Camera2D } from './camera2d.ts'

const TILE = 48
const MAP_W = 48
const MAP_H = 32

function terrainAt(tx: number, ty: number): 'water' | 'grass' | 'stone' {
  const n = Math.sin(tx * 0.21) * Math.cos(ty * 0.17)
  if (n > 0.55) return 'water'
  if (n < -0.35) return 'stone'
  return 'grass'
}

export default function MapExplorerPage() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const miniRef = useRef<HTMLCanvasElement | null>(null)
  const camRef = useRef<Camera2D>({ cx: MAP_W * TILE * 0.45, cy: MAP_H * TILE * 0.45, scale: 0.9 })
  const drag = useRef<{ active: boolean; sx: number; sy: number; cx: number; cy: number; scale: number } | null>(null)

  useEffect(() => {
    const canvas = ref.current
    const mini = miniRef.current
    if (!canvas || !mini) return
    const ctx = canvas.getContext('2d')
    const mctx = mini.getContext('2d')
    if (!ctx || !mctx) return

    let raf = 0
    let t0 = performance.now()

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

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const sx = e.clientX - rect.left
      const sy = e.clientY - rect.top
      const prev = camRef.current
      const factor = Math.exp(-e.deltaY * 0.0015)
      const nextScale = Math.min(2.4, Math.max(0.45, prev.scale * factor))
      const next: Camera2D = { ...prev, scale: nextScale }
      const after = worldToScreen(next.cx, next.cy, next, rect.width, rect.height)
      const dwx = (sx - after.sx) / nextScale
      const dwy = (sy - after.sy) / nextScale
      camRef.current = { cx: next.cx + dwx, cy: next.cy + dwy, scale: next.scale }
    }

    const onDown = (e: PointerEvent) => {
      const c = camRef.current
      drag.current = { active: true, sx: e.clientX, sy: e.clientY, cx: c.cx, cy: c.cy, scale: c.scale }
      canvas.setPointerCapture(e.pointerId)
    }
    const onUp = (e: PointerEvent) => {
      if (drag.current?.active && canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId)
      }
      drag.current = null
    }
    const onMove = (e: PointerEvent) => {
      const d = drag.current
      if (!d?.active) return
      const dx = e.clientX - d.sx
      const dy = e.clientY - d.sy
      camRef.current = { cx: d.cx - dx / d.scale, cy: d.cy - dy / d.scale, scale: d.scale }
    }

    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointermove', onMove)

    const draw = (now: number) => {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const cam = camRef.current
      const t = (now - t0) / 1000
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#020617'
      ctx.fillRect(0, 0, w, h)

      const startTx = Math.floor(cam.cx / TILE - w / (2 * TILE * cam.scale)) - 2
      const endTx = Math.ceil(cam.cx / TILE + w / (2 * TILE * cam.scale)) + 2
      const startTy = Math.floor(cam.cy / TILE - h / (2 * TILE * cam.scale)) - 2
      const endTy = Math.ceil(cam.cy / TILE + h / (2 * TILE * cam.scale)) + 2

      for (let ty = startTy; ty <= endTy; ty++) {
        for (let tx = startTx; tx <= endTx; tx++) {
          if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) continue
          const kind = terrainAt(tx, ty)
          const worldX = tx * TILE
          const worldY = ty * TILE
          const p1 = worldToScreen(worldX, worldY, cam, w, h)
          const p2 = worldToScreen(worldX + TILE, worldY + TILE, cam, w, h)
          const rw = p2.sx - p1.sx
          const rh = p2.sy - p1.sy
          if (kind === 'water') {
            const wave = 0.12 + 0.08 * Math.sin(t * 2.2 + tx * 0.4 + ty * 0.35)
            ctx.fillStyle = `rgba(14,165,233,${0.45 + wave})`
          } else if (kind === 'stone') {
            ctx.fillStyle = '#1f2937'
          } else {
            ctx.fillStyle = '#14532d'
          }
          ctx.fillRect(p1.sx, p1.sy, rw + 1, rh + 1)
        }
      }

      ctx.save()
      ctx.globalAlpha = 0.35
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 97 + t * 40) % (w + 40)) - 20
        const sy = ((i * 53 + Math.sin(t + i) * 18) % h)
        ctx.fillStyle = '#a5b4fc'
        ctx.beginPath()
        ctx.arc(sx, sy, 2 + (i % 3), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      const mw = mini.width
      const mh = mini.height
      mctx.clearRect(0, 0, mw, mh)
      mctx.fillStyle = 'rgba(15,23,42,0.85)'
      mctx.fillRect(0, 0, mw, mh)
      mctx.strokeStyle = 'rgba(148,163,184,0.45)'
      mctx.strokeRect(0.5, 0.5, mw - 1, mh - 1)
      const px = (cam.cx / (MAP_W * TILE)) * mw
      const py = (cam.cy / (MAP_H * TILE)) * mh
      mctx.fillStyle = 'rgba(34,211,238,0.85)'
      mctx.fillRect(px - 8, py - 6, 16, 12)

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/80">Core logic · Motion FX</p>
        <h1 className="font-display mt-2 text-3xl font-semibold text-white">Tile Map Explorer</h1>
        <p className="mt-2 text-sm text-slate-300">Drag to pan, scroll to zoom, animated water and motes.</p>
      </div>
      <div className="relative">
        <canvas ref={ref} className="h-[560px] w-full rounded-[2rem] border border-white/10 bg-slate-950 shadow-[0_40px_120px_rgba(2,6,23,0.85)]" />
        <div className="pointer-events-none absolute right-4 top-4 w-64 rounded-2xl border border-white/15 bg-slate-950/55 p-4 text-xs text-slate-100 shadow-[0_20px_80px_rgba(2,6,23,0.75)] backdrop-blur-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-200/80">Party sheet</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            <span className="text-slate-400">Focus</span>
            <span className="text-right font-semibold text-white">Aurae</span>
            <span className="text-slate-400">Resolve</span>
            <span className="text-right font-semibold text-emerald-200">92</span>
            <span className="text-slate-400">Spirit</span>
            <span className="text-right font-semibold text-indigo-200">74</span>
          </div>
          <canvas ref={miniRef} width={220} height={120} className="mt-3 w-full rounded-xl border border-white/10 bg-slate-900/70" />
        </div>
      </div>
    </div>
  )
}


