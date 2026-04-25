import { useEffect, useRef } from 'react'
import { mountTicTacToe } from './ticTacToeVanilla.ts'

export default function TicTacToePage() {
  const host = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return
    const teardown = mountTicTacToe(el)
    return teardown
  }, [])

  return <div ref={host} />
}
