export type TileState = 'correct' | 'present' | 'absent'

export type LetterTile = { letter: string; state: TileState }

export function scoreGuess(secret: string, guess: string): LetterTile[] {
  const secretU = secret.toUpperCase()
  const guessU = guess.toUpperCase()
  const n = secretU.length
  const tiles: LetterTile[] = guessU.split('').map((letter) => ({ letter, state: 'absent' }))
  const usedSecret = new Array<boolean>(n).fill(false)

  for (let i = 0; i < n; i++) {
    if (guessU[i] === secretU[i]) {
      tiles[i] = { letter: guessU[i], state: 'correct' }
      usedSecret[i] = true
    }
  }

  for (let i = 0; i < n; i++) {
    if (tiles[i].state === 'correct') continue
    const ch = guessU[i]
    const j = secretU.split('').findIndex((c, si) => !usedSecret[si] && c === ch)
    if (j !== -1) {
      tiles[i] = { letter: ch, state: 'present' }
      usedSecret[j] = true
    }
  }

  return tiles
}
