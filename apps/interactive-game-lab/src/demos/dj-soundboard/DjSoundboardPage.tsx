import { useCallback, useEffect, useRef, useState } from 'react'
import { rms } from './audioMeter.ts'

type PadSpec = { id: string; label: string; freq: number; gradient: string }

const PADS: PadSpec[] = [
  { id: 'k1', label: 'Kick', freq: 92, gradient: 'from-fuchsia-500 via-purple-500 to-cyan-400' },
  { id: 'k2', label: 'Snare', freq: 180, gradient: 'from-cyan-400 via-sky-500 to-indigo-500' },
  { id: 'k3', label: 'Hat', freq: 620, gradient: 'from-emerald-400 via-lime-300 to-cyan-500' },
  { id: 'k4', label: 'Ride', freq: 320, gradient: 'from-amber-400 via-orange-500 to-pink-500' },
  { id: 'k5', label: 'Tom', freq: 140, gradient: 'from-indigo-500 via-violet-500 to-fuchsia-500' },
  { id: 'k6', label: 'Clap', freq: 260, gradient: 'from-sky-400 via-blue-500 to-purple-600' },
]

export default function DjSoundboardPage() {
  const waveRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataRef = useRef<Float32Array | null>(null)
  const sizeRef = useRef({ w: 600, h: 160 })
  const [armed, setArmed] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [ripple, setRipple] = useState<string | null>(null)

  const ensureAudio = useCallback(async () => {
    if (ctxRef.current) return ctxRef.current
    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 1024
    analyser.smoothingTimeConstant = 0.65
    analyser.connect(ctx.destination)
    ctxRef.current = ctx
    analyserRef.current = analyser
    dataRef.current = new Float32Array(analyser.fftSize)
    setArmed(true)
    return ctx
  }, [])

  const playPad = useCallback(
    async (spec: PadSpec) => {
      const ctx = await ensureAudio()
      if (ctx.state === 'suspended') await ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = spec.freq
      gain.gain.value = 0.0001
      osc.connect(gain)
      const analyser = analyserRef.current
      if (analyser) gain.connect(analyser)
      else gain.connect(ctx.destination)

      const now = ctx.currentTime
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)
      osc.start(now)
      osc.stop(now + 0.4)

      setActive(spec.id)
      setRipple(spec.id)
      window.setTimeout(() => setActive((cur) => (cur === spec.id ? null : cur)), 120)
      window.setTimeout(() => setRipple((cur) => (cur === spec.id ? null : cur)), 520)
    },
    [ensureAudio],
  )

  useEffect(() => {
    const canvas = waveRef.current
    if (!canvas) return
    const c = canvas.getContext('2d')
    if (!c) return

    const applySize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      sizeRef.current = { w, h }
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    applySize()
    const ro = new ResizeObserver(applySize)
    ro.observe(canvas)

    let raf = 0
    const draw = () => {
      const { w, h } = sizeRef.current
      c.clearRect(0, 0, w, h)
      const analyser = analyserRef.current
      const buf = dataRef.current
      if (analyser && buf) {
        analyser.getFloatTimeDomainData(buf)
        const level = rms(buf)
        c.strokeStyle = 'rgba(148,163,184,0.35)'
        c.lineWidth = 1
        c.beginPath()
        for (let x = 0; x < w; x += 18) {
          c.moveTo(x, 0)
          c.lineTo(x, h)
        }
        c.stroke()
        c.strokeStyle = 'rgba(34,211,238,0.85)'
        c.lineWidth = 2
        c.beginPath()
        const mid = h / 2
        for (let i = 0; i < w; i++) {
          const t = (i / w) * buf.length
          const idx = Math.floor(t)
          const sample = buf[idx] ?? 0
          const y = mid + sample * mid * (1.6 + level * 3)
          if (i === 0) c.moveTo(i, y)
          else c.lineTo(i, y)
        }
        c.stroke()
        c.strokeStyle = 'rgba(244,114,182,0.55)'
        c.beginPath()
        for (let i = 0; i < w; i++) {
          const t = (i / w) * buf.length
          const idx = Math.floor(t + 8)
          const sample = buf[idx] ?? 0
          const y = mid + sample * mid * 1.1
          if (i === 0) c.moveTo(i, y)
          else c.lineTo(i, y)
        }
        c.stroke()
      } else {
        c.fillStyle = 'rgba(148,163,184,0.35)'
        c.font = '600 12px Space Grotesk, Inter, system-ui'
        c.fillText('Tap any pad to open the audio graph.', 18, h / 2)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [armed])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-200/80">Motion FX · Core logic</p>
        <h1 className="font-display mt-2 text-3xl font-semibold text-white">DJ Soundboard</h1>
        <p className="mt-2 text-sm text-slate-300">Mesh pads, 3D press, ripples, and a live waveform driven by Web Audio.</p>
      </div>

      <div className="rounded-[2rem] border border-white/12 bg-slate-950/60 p-6 shadow-[0_40px_120px_rgba(2,6,23,0.85)] backdrop-blur-2xl">
        <div className="mx-auto mb-6 h-40 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
          <canvas ref={waveRef} className="h-full w-full" />
        </div>
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-3">
          {PADS.map((p) => {
            const isActive = active === p.id
            const showRipple = ripple === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => playPad(p)}
                className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${p.gradient} p-[1px] shadow-[0_30px_90px_rgba(2,6,23,0.75)] transition ${isActive ? 'translate-y-1 scale-[0.98]' : 'hover:-translate-y-0.5'}`}
                style={{ boxShadow: isActive ? '0 0 40px rgba(34,211,238,0.45)' : undefined }}
              >
                <span className={`pad-ripple bg-white/30 ${showRipple ? 'active' : ''}`} />
                <span className="flex min-h-[120px] flex-col justify-between rounded-[calc(1.5rem-1px)] bg-slate-950/55 px-5 py-4 text-left backdrop-blur-xl">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-200/80">{p.label}</span>
                  <span className="font-display text-2xl font-semibold text-white">{p.freq} Hz</span>
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          {armed ? 'Audio armed — pads route through the analyser.' : 'First pad click unlocks AudioContext in your browser.'}
        </p>
      </div>
    </div>
  )
}
