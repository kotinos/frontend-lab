import { NavLink, Outlet } from 'react-router-dom'

const linkBase =
  'rounded-full px-3 py-1 text-xs font-medium text-slate-300 transition hover:text-white md:text-sm'

export function DemoLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_800px_at_20%_0%,rgba(99,102,241,0.35),transparent_55%),radial-gradient(900px_600px_at_90%_20%,rgba(236,72,153,0.25),transparent_50%),linear-gradient(160deg,#020617_0%,#0b1224_45%,#020617_100%)]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <NavLink to="/" className="font-display text-sm font-semibold tracking-tight text-white md:text-base">
            Interactive Game Lab
          </NavLink>
          <nav className="flex flex-wrap items-center gap-1 md:gap-2">
            <NavLink to="/word-guess" className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 text-white' : ''}`}>
              Word
            </NavLink>
            <NavLink
              to="/canvas-flappy"
              className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 text-white' : ''}`}
            >
              Flappy
            </NavLink>
            <NavLink
              to="/tic-tac-toe"
              className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 text-white' : ''}`}
            >
              Tic-Tac-Toe
            </NavLink>
            <NavLink
              to="/tile-map-rpg"
              className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 text-white' : ''}`}
            >
              Map
            </NavLink>
            <NavLink to="/neon-pong" className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 text-white' : ''}`}>
              Pong
            </NavLink>
            <NavLink
              to="/dj-soundboard"
              className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 text-white' : ''}`}
            >
              DJ
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
