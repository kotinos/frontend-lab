import { useCallback, useRef, useState, type MouseEvent } from 'react'

export function App() {
  const ctaRef = useRef<HTMLButtonElement | null>(null)
  const [mag, setMag] = useState({ x: 0, y: 0 })

  const onMove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const el = ctaRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
    setMag({ x: dx * 10, y: dy * 10 })
  }, [])

  const onLeave = useCallback(() => setMag({ x: 0, y: 0 }), [])

  return (
    <div className="mesh-bg min-h-screen">
      <header className="sticky top-0 z-20 px-4 py-4">
        <nav className="glass-nav mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3">
          <span className="font-semibold tracking-tight text-slate-100">LumenMesh</span>
          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a className="hover:text-white" href="#product">
              Product
            </a>
            <a className="hover:text-white" href="#safety">
              Safety
            </a>
            <a className="hover:text-white" href="#pricing">
              Pricing
            </a>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Sign in
          </button>
        </nav>
      </header>
      <main className="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-24 pt-10 md:flex-row md:items-center md:justify-between">
        <section className="max-w-xl space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-200/80">Fictional AI tool</p>
          <h1 className="font-[Sora] text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            Orchestrate models with a calm, typography-first surface.
          </h1>
          <p className="text-lg text-slate-300">
            LumenMesh routes prompts, evaluates responses, and keeps your team aligned—without noisy chrome or
            gimmicks.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              ref={ctaRef}
              type="button"
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              className="magnetic relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(129,140,248,0.55)]"
              style={{ transform: `translate(${mag.x}px, ${mag.y}px)` }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-white to-fuchsia-200" />
              <span className="relative">Get Started</span>
            </button>
            <span className="text-sm text-slate-400">No credit card · demo data only</span>
          </div>
        </section>
        <section className="relative mx-auto h-[320px] w-full max-w-md md:mx-0 md:h-[420px]" aria-hidden="true">
          <div className="shape absolute inset-6 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 via-indigo-500/20 to-fuchsia-500/25 shadow-[0_40px_120px_rgba(15,23,42,0.85)]" />
          <div
            className="shape absolute -right-4 top-10 h-28 w-28 rounded-3xl border border-cyan-200/30 bg-cyan-300/20"
            style={{ animationDelay: '1.2s' }}
          />
          <div
            className="shape absolute bottom-6 left-0 h-24 w-24 rounded-full border border-fuchsia-200/30 bg-fuchsia-400/20"
            style={{ animationDelay: '0.4s' }}
          />
          <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)] opacity-70" />
        </section>
      </main>
    </div>
  )
}
