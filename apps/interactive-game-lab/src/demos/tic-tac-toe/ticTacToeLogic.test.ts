import { describe, expect, it } from 'vitest'
import { applyMove, checkWinner, emptyBoard, winningLine } from './ticTacToeLogic.ts'

describe('ticTacToeLogic', () => {
  it('detects row win', () => {
    const b = emptyBoard()
    applyMove(b, 0, 'X')
    applyMove(b, 3, 'O')
    applyMove(b, 1, 'X')
    applyMove(b, 4, 'O')
    applyMove(b, 2, 'X')
    expect(checkWinner(b)).toBe('X')
    expect(winningLine(b)).toEqual([0, 1, 2])
  })

  it('detects diagonal', () => {
    const b = emptyBoard()
    applyMove(b, 0, 'O')
    applyMove(b, 1, 'X')
    applyMove(b, 4, 'O')
    applyMove(b, 2, 'X')
    applyMove(b, 8, 'O')
    expect(checkWinner(b)).toBe('O')
    expect(winningLine(b)).toEqual([0, 4, 8])
  })

  it('returns null when no winner', () => {
    expect(checkWinner(emptyBoard())).toBeNull()
  })
})
