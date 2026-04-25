import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DemoLayout } from './layout/DemoLayout.tsx'
import { HomeCatalog } from './routes/HomeCatalog.tsx'

const WordGuessPage = lazy(() => import('./demos/word-guess/WordGuessPage.tsx'))
const FlappyPage = lazy(() => import('./demos/flappy/FlappyPage.tsx'))
const TicTacToePage = lazy(() => import('./demos/tic-tac-toe/TicTacToePage.tsx'))
const MapExplorerPage = lazy(() => import('./demos/tile-map-rpg/MapExplorerPage.tsx'))
const NeonPongPage = lazy(() => import('./demos/neon-pong/NeonPongPage.tsx'))
const DjSoundboardPage = lazy(() => import('./demos/dj-soundboard/DjSoundboardPage.tsx'))

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400">Loading demo…</div>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<DemoLayout />}>
        <Route index element={<HomeCatalog />} />
        <Route
          path="word-guess"
          element={
            <Suspense fallback={<RouteFallback />}>
              <WordGuessPage />
            </Suspense>
          }
        />
        <Route
          path="canvas-flappy"
          element={
            <Suspense fallback={<RouteFallback />}>
              <FlappyPage />
            </Suspense>
          }
        />
        <Route
          path="tic-tac-toe"
          element={
            <Suspense fallback={<RouteFallback />}>
              <TicTacToePage />
            </Suspense>
          }
        />
        <Route
          path="tile-map-rpg"
          element={
            <Suspense fallback={<RouteFallback />}>
              <MapExplorerPage />
            </Suspense>
          }
        />
        <Route
          path="neon-pong"
          element={
            <Suspense fallback={<RouteFallback />}>
              <NeonPongPage />
            </Suspense>
          }
        />
        <Route
          path="dj-soundboard"
          element={
            <Suspense fallback={<RouteFallback />}>
              <DjSoundboardPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
