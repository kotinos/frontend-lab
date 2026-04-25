# Interactive Game Lab

Premium front-end showcase app with six route-based demos:

1. Word Guessing (Wordle-style)
2. Geometric Flappy Runner
3. Premium Tic-Tac-Toe
4. 2D RPG Map Explorer
5. Neon Cyberpunk Pong
6. DJ Soundboard

Built with Vite + React + Tailwind, with lazy-loaded routes and focused logic modules tested in Vitest.

## Run

```bash
npm install
npm run dev -w interactive-game-lab
```

Default server: `http://127.0.0.1:5174`

## Scripts

- `npm run dev -w interactive-game-lab` - start dev server
- `npm run test -w interactive-game-lab` - run Vitest suites
- `npm run build -w interactive-game-lab` - production build

## Demo routes

- `/word-guess`
- `/canvas-flappy`
- `/tic-tac-toe`
- `/tile-map-rpg`
- `/neon-pong`
- `/dj-soundboard`

## Architecture: 4-track delivery per demo

Each demo is implemented as four parallel tracks:

- Visual shell
- Core logic
- Motion and effects
- Tests and tooling

Logic modules are colocated under `src/demos/*` and tested independently.

## Quality gates

- `npm test` must pass at workspace root
- `npm run build` must pass for this app
- Browser smoke check for all six routes
