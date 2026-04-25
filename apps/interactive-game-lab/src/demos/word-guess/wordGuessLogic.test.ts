import { describe, expect, it } from 'vitest'
import { scoreGuess } from './wordGuessLogic.ts'
import { LEN, WORDS } from './words.ts'

describe('scoreGuess', () => {
  it('marks exact matches as correct', () => {
    expect(scoreGuess('CRANE', 'CRANE').every((t) => t.state === 'correct')).toBe(true)
  })

  it('handles duplicate letters like Wordle', () => {
    const s = scoreGuess('ABBEY', 'BEBOP')
    expect(s.map((t) => t.state)).toEqual(['present', 'present', 'correct', 'absent', 'absent'])
  })

  it('consumes secret letters in order for duplicate guess letters', () => {
    const s = scoreGuess('EERIE', 'SPEED')
    expect(s.map((t) => t.state)).toEqual(['absent', 'absent', 'present', 'present', 'absent'])
  })

  it('uses only fixed-length words', () => {
    expect(WORDS.every((w) => w.length === LEN)).toBe(true)
  })
})
