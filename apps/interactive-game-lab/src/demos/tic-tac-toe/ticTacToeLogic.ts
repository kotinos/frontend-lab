export type Player = 'X' | 'O'
export type Cell = Player | null

const LINES: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export function emptyBoard(): Cell[] {
  return new Array<Cell>(9).fill(null)
}

export function checkWinner(board: Cell[]): Player | null {
  for (const [a, b, c] of LINES) {
    const x = board[a]
    if (x && x === board[b] && x === board[c]) return x
  }
  return null
}

export function winningLine(board: Cell[]): number[] | null {
  for (const [a, b, c] of LINES) {
    const x = board[a]
    if (x && x === board[b] && x === board[c]) return [a, b, c]
  }
  return null
}

export function applyMove(board: Cell[], index: number, player: Player): void {
  if (board[index] !== null) throw new Error('cell occupied')
  board[index] = player
}
