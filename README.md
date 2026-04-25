# Frontend Lab

Twelve self-contained UI exercises: static HTML/CSS/JS demos, three Vite + React apps, and one A-Frame scene. Shared unit-tested helpers live in `packages/core`; vanilla demos mirror that behavior in the browser without a bundler.

## Quick start

```bash
git clone https://github.com/kotinos/frontend-lab.git
cd frontend-lab
npm install
npm test               # core + all Vite apps
npm run build          # production build: all apps
npm run dev:landing    # http://127.0.0.1:5173 - AI landing
npm run dev:three      # http://127.0.0.1:5174 - R3F product view
npm run dev:games      # http://127.0.0.1:5174 - Interactive Game Lab
```

Serve any static folder (needs network for CDNs/APIs where noted):

```bash
npx --yes serve static/css-gallery-keyframes
```

## Repo layout

| Path | What |
|------|------|
| `packages/core` | Vitest: drag reorder, Pomodoro time/ring math, pixel grid helpers |
| `static/*` | Open `index.html` or static server |
| `apps/react-vite-landing` | Vite 8, React 19, Tailwind 4 |
| `apps/three-product-showcase` | Vite 8, React Three Fiber, Drei |
| `apps/interactive-game-lab` | Vite 8, React 19, Tailwind 4, 6 game demos |
| `vr/aframe-solar-system` | A-Frame 1.5, desktop or headset |

## Demos (plan at a glance)

Each row: goal -> how to run -> main risk

| # | Demo | Run | Risk / note |
|---|------|-----|-------------|
| 1 | **CSS gallery** - masonry, glassmorphism, keyframe hovers, Unsplash | `static/css-gallery-keyframes` | Remote images; needs network |
| 2 | **React landing** - mesh hero, glass nav, magnetic CTA | `npm run dev -w react-vite-landing` | None local |
| 3 | **Todo** - neumorphism, drag-reorder, SVG ring, motion | `static/vanilla-todo` | Logic aligned with `packages/core` tests |
| 4 | **Pomodoro** - full-screen timer, SVG ring, focus/break palettes | `static/vanilla-pomodoro` | Timer drift minimal; no audio |
| 5 | **Weather** - glass UI, Chart.js, bg video, Open-Meteo | `static/weather-dashboard` | API + video CDN; chart needs JS |
| 6 | **Cafe finder** - Mapbox map + cards | `static/cafe-finder` | Requires Mapbox token (`?token=` or UI) |
| 7 | **Avatar** - tabs, bouncy layers, confetti | `static/avatar-generator` | Confetti CDN |
| 8 | **Three showcase** - GLTF duck, orbit, pointer light, overlay | `npm run dev -w three-product-showcase` | Large bundle; model over network |
| 9 | **Solar VR** - A-Frame planets, starfield, HUD | `vr/aframe-solar-system` | WebGL / texture CORS; desktop OK |
| 10 | **TTS** - editor, morph control, waveform | `static/text-to-speech` | `speechSynthesis` varies by browser |
| 11 | **Pixel maker** - grid, palette, fill, clear wipe | `static/pixel-art-maker` | None local |
| 12 | **Interactive Game Lab** - Word, Flappy, Tic-Tac-Toe, RPG Map, Neon Pong, DJ Board | `npm run dev -w interactive-game-lab` | Route-level chunks; canvas-heavy routes favor desktop GPU |

## Scripts (root `package.json`)

| Script | Purpose |
|--------|---------|
| `npm test` | `@frontend-lab/core` + landing + three + game-lab Vitest suites |
| `npm run build` | Vite build all apps |
| `npm run dev:landing` | Landing dev server |
| `npm run dev:three` | Three.js app dev server |
| `npm run dev:games` | Interactive Game Lab dev server |

## Mapbox (cafe finder)

Use `?token=YOUR_MAPBOX_TOKEN` or the token field once. Value is stored as `mapbox-token` in `localStorage`. Restrict the token by URL in the Mapbox dashboard.
