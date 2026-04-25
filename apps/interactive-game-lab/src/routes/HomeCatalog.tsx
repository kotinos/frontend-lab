import { Link } from 'react-router-dom'

const demos = [
  {
    to: '/word-guess',
    title: 'Word Guessing',
    blurb: 'Glassmorphism grid, flip reveals, frosted keyboard.',
    tag: 'React · Tailwind',
  },
  {
    to: '/canvas-flappy',
    title: 'Geometric Runner',
    blurb: 'Canvas parallax sunset, floaty physics, particle bursts.',
    tag: 'Canvas',
  },
  {
    to: '/tic-tac-toe',
    title: 'Premium Tic-Tac-Toe',
    blurb: 'Neumorphic board, magnetic hover, neon SVG strokes.',
    tag: 'Vanilla JS',
  },
  {
    to: '/tile-map-rpg',
    title: 'Map Explorer',
    blurb: 'Top-down tiles, smooth pan and zoom, animated water.',
    tag: 'Canvas',
  },
  {
    to: '/neon-pong',
    title: 'Neon Cyberpunk Pong',
    blurb: 'CRT veil, bloom trails, shake and sparks on impact.',
    tag: 'Canvas',
  },
  {
    to: '/dj-soundboard',
    title: 'DJ Soundboard',
    blurb: 'Mesh-gradient pads, 3D press, ripples, live waveform.',
    tag: 'Web Audio',
  },
] as const

export function HomeCatalog() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-200/80">Codedex frontend lab</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">Six interactive surfaces</h1>
        <p className="max-w-2xl text-sm text-slate-300 md:text-base">
          Each route is a self-contained demo with four parallel tracks: visual shell, core logic, motion and effects, and
          tests plus tooling. Pick a card to open the experience.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {demos.map((d) => (
          <Link
            key={d.to}
            to={d.to}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_rgba(2,6,23,0.65)] transition hover:border-cyan-300/40 hover:bg-white/10"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl transition group-hover:bg-fuchsia-400/25" />
            <div className="relative space-y-3">
              <span className="inline-flex rounded-full border border-white/15 bg-slate-950/40 px-3 py-1 text-[11px] font-medium text-slate-200">
                {d.tag}
              </span>
              <h2 className="font-display text-xl font-semibold text-white">{d.title}</h2>
              <p className="text-sm text-slate-300">{d.blurb}</p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-cyan-200">
                Launch
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
