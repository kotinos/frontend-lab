import { useCallback, useEffect, useMemo, useState } from 'react'
import { scoreGuess, type LetterTile, type TileState } from './wordGuessLogic.ts'

import { LEN, WORDS } from './words.ts'

const ROWS = 6

type RowState = { letters: string[]; tiles: LetterTile[] | null; revealed: boolean }

function emptyRow(): RowState {
  return { letters: new Array(LEN).fill(''), tiles: null, revealed: false }
}

function tileGradient(state: TileState | null): string {
  if (state === 'correct') return 'linear-gradient(135deg,#22d3ee,#4ade80)'
  if (state === 'present') return 'linear-gradient(135deg,#fbbf24,#f97316)'
  if (state === 'absent') return 'linear-gradient(135deg,#334155,#0f172a)'
  return 'linear-gradient(135deg,#1e293b,#0f172a)'
}

export default function WordGuessPage() {
  const answer = useMemo(() => WORDS[Math.floor(Math.random() * WORDS.length)]!, [])
  const [rows, setRows] = useState<RowState[]>(() => Array.from({ length: ROWS }, () => emptyRow()))
  const [rowIndex, setRowIndex] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')

  const commitGuess = useCallback(() => {
    if (status !== 'playing') return
    const row = rows[rowIndex]
    if (!row) return
    const guess = row.letters.join('')
    if (guess.length !== LEN) return

    const tiles = scoreGuess(answer, guess)
    const nextRows = rows.map((r, i) => (i === rowIndex ? { ...r, tiles, revealed: true } : r))
    setRows(nextRows)

    if (guess === answer) {
      setStatus('won')
      return
    }
    if (rowIndex === ROWS - 1) {
      setStatus('lost')
      return
    }
    setRowIndex((x) => x + 1)
  }, [answer, rowIndex, rows, status])

  const onKey = useCallback(
    (key: string) => {
      if (status !== 'playing') return
      const upper = key.toUpperCase()
      if (upper === 'ENTER') {
        commitGuess()
        return
      }
      if (upper === 'BACKSPACE' || upper === '⌫') {
        setRows((prev) => {
          const copy = prev.map((r) => ({ ...r, letters: [...r.letters] }))
          const row = copy[rowIndex]
          if (!row || row.revealed) return prev
          let idx = -1
          for (let i = row.letters.length - 1; i >= 0; i--) {
            if (row.letters[i] !== '') {
              idx = i
              break
            }
          }
          if (idx >= 0) row.letters[idx] = ''
          return copy
        })
        return
      }
      if (!/^[A-Z]$/.test(upper) || upper.length !== 1) return
      setRows((prev) => {
        const copy = prev.map((r) => ({ ...r, letters: [...r.letters] }))
        const row = copy[rowIndex]
        if (!row || row.revealed) return prev
        const spot = row.letters.findIndex((c) => c === '')
        if (spot === -1) return prev
        row.letters[spot] = upper
        return copy
      })
    },
    [commitGuess, rowIndex, status],
  )

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onKey('ENTER')
      else if (e.key === 'Backspace') onKey('BACKSPACE')
      else if (/^[a-zA-Z]$/.test(e.key)) onKey(e.key.toUpperCase())
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [onKey])

  const keyboardRows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 pb-16 pt-4">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Visual shell · Motion FX</p>
        <h1 className="font-display mt-2 text-3xl font-semibold text-white">Glass Word Grid</h1>
        <p className="mt-2 text-sm text-slate-300">Flip reveals with gradient faces and a frosted keyboard.</p>
      </div>

      <div
        className="w-full rounded-[2rem] border border-white/15 bg-white/5 p-6 shadow-[0_40px_120px_rgba(2,6,23,0.75)] backdrop-blur-2xl"
        style={{ perspective: '1200px' }}
      >
        <div className="mx-auto flex w-full max-w-md flex-col gap-3">
          {rows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-5 gap-3">
              {Array.from({ length: LEN }).map((_, ci) => {
                const letter = row.letters[ci] ?? ''
                const tile = row.tiles?.[ci] ?? null
                const show = Boolean(row.revealed && tile)
                return (
                  <div
                    key={ci}
                    className={`word-tile aspect-square ${show ? 'reveal' : ''}`}
                    style={{ animationDelay: show ? `${ci * 70}ms` : '0ms' }}
                  >
                    <div className="word-tile-inner relative h-full w-full">
                      <div
                        className="word-tile-face absolute inset-0 flex items-center justify-center rounded-2xl border border-white/15 bg-slate-900/70 text-2xl font-semibold text-white shadow-inner"
                        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}
                      >
                        {!show ? letter : ''}
                      </div>
                      <div
                        className="word-tile-face word-tile-back absolute inset-0 flex items-center justify-center rounded-2xl border border-white/10 text-2xl font-semibold text-slate-950 shadow-[0_20px_60px_rgba(34,211,238,0.45)]"
                        style={{ backgroundImage: tile ? tileGradient(tile.state) : undefined }}
                      >
                        {show ? tile?.letter : ''}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl rounded-[2rem] border border-white/12 bg-slate-950/40 p-4 shadow-[0_30px_90px_rgba(2,6,23,0.65)] backdrop-blur-2xl">
        <div className="flex flex-col gap-2">
          {keyboardRows.map((r) => (
            <div key={r} className="flex justify-center gap-2">
              {r.split('').map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onKey(k)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(15,23,42,0.65)] transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/10 active:scale-95 md:px-4"
                >
                  {k}
                </button>
              ))}
            </div>
          ))}
          <div className="flex justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onKey('ENTER')}
              className="rounded-xl border border-white/10 bg-gradient-to-r from-cyan-400/30 to-fuchsia-400/30 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:brightness-110 active:scale-95"
            >
              Enter
            </button>
            <button
              type="button"
              onClick={() => onKey('BACKSPACE')}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/10 active:scale-95"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {status !== 'playing' && (
        <div className="rounded-2xl border border-white/15 bg-slate-900/70 px-6 py-4 text-center text-sm text-slate-200 backdrop-blur-xl">
          {status === 'won' ? 'Solved — crisp reveal.' : `Out of tries. Word was ${answer}.`}
        </div>
      )}
    </div>
  )
}


