const COLS = 16
const ROWS = 16
const colors = ['#ff5f8a', '#ffc857', '#7cf4ff', '#9b7bff', '#58ffa9', '#ffffff', '#2b3448']

/** Mirrors @frontend-lab/core clearGrid */
function clearGrid(length) {
  return Array.from({ length }, () => null)
}

let grid = clearGrid(COLS * ROWS)
let tool = 'pen'
let color = colors[0]

const paletteEl = document.getElementById('palette')
const gridEl = document.getElementById('grid')
const clearBtn = document.getElementById('clear')

for (const c of colors) {
  const b = document.createElement('button')
  b.type = 'button'
  b.className = 'swatch' + (c === color ? ' on' : '')
  b.style.background = c
  b.addEventListener('click', () => {
    color = c
    paletteEl.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('on', s === b))
  })
  paletteEl.appendChild(b)
}

function paintCell(i, v) {
  grid = grid.map((cell, idx) => (idx === i ? v : cell))
}

function render() {
  gridEl.innerHTML = ''
  for (let i = 0; i < grid.length; i += 1) {
    const cell = document.createElement('button')
    cell.type = 'button'
    cell.className = 'cell'
    cell.style.background = grid[i] ?? 'var(--cell)'
    cell.addEventListener('click', () => {
      if (tool === 'pen') paintCell(i, color)
      else if (tool === 'erase') paintCell(i, null)
      else if (tool === 'fill') {
        const orig = grid[i]
        if (orig === color) return
        const next = [...grid]
        const stack = [i]
        while (stack.length) {
          const cur = stack.pop()
          if (next[cur] !== orig) continue
          next[cur] = color
          const x = cur % COLS
          const y = Math.floor(cur / COLS)
          if (x > 0) stack.push(cur - 1)
          if (x < COLS - 1) stack.push(cur + 1)
          if (y > 0) stack.push(cur - COLS)
          if (y < ROWS - 1) stack.push(cur + COLS)
        }
        grid = next
      }
      render()
    })
    gridEl.appendChild(cell)
  }
}

document.querySelectorAll('.tool').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tool').forEach((b) => {
      b.classList.toggle('active', b === btn)
      b.setAttribute('aria-pressed', String(b === btn))
    })
    tool = btn.dataset.tool
  })
})

clearBtn.addEventListener('click', () => {
  gridEl.classList.add('wiping')
  window.setTimeout(() => {
    grid = clearGrid(COLS * ROWS)
    render()
    gridEl.classList.remove('wiping')
  }, 380)
})

render()
