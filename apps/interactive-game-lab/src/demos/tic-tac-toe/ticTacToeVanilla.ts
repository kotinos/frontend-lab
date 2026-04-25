import { applyMove, checkWinner, emptyBoard, winningLine, type Cell, type Player } from './ticTacToeLogic.ts'

export function mountTicTacToe(root: HTMLElement): () => void {
  root.innerHTML = ''
  root.className =
    'relative mx-auto w-full max-w-xl rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-8 shadow-[0_40px_120px_rgba(2,6,23,0.85)]'

  const title = document.createElement('p')
  title.className = 'text-center text-xs uppercase tracking-[0.35em] text-cyan-200/80'
  title.textContent = 'Visual shell · Motion FX'
  const h1 = document.createElement('h1')
  h1.className = 'mt-2 text-center font-display text-3xl font-semibold text-white'
  h1.textContent = 'Neon Tic-Tac-Toe'
  const sub = document.createElement('p')
  sub.className = 'mt-2 text-center text-sm text-slate-300'
  sub.textContent = 'Magnetic cells, SVG stroke marks, glowing win line.'

  const boardEl = document.createElement('div')
  boardEl.className = 'mt-8 grid grid-cols-3 gap-4'

  const svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svgOverlay.setAttribute('class', 'pointer-events-none absolute inset-0')
  svgOverlay.style.opacity = '0'

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  line.setAttribute('stroke', 'url(#winGrad)')
  line.setAttribute('stroke-width', '10')
  line.setAttribute('stroke-linecap', 'round')
  line.style.filter = 'drop-shadow(0 0 18px rgba(34,211,238,0.9))'

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
  grad.setAttribute('id', 'winGrad')
  grad.setAttribute('x1', '0%')
  grad.setAttribute('y1', '0%')
  grad.setAttribute('x2', '100%')
  grad.setAttribute('y2', '0%')
  const s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  s1.setAttribute('offset', '0%')
  s1.setAttribute('stop-color', '#22d3ee')
  const s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  s2.setAttribute('offset', '100%')
  s2.setAttribute('stop-color', '#e879f9')
  grad.append(s1, s2)
  defs.append(grad)
  svgOverlay.append(defs, line)

  const wrap = document.createElement('div')
  wrap.className = 'relative'
  wrap.append(boardEl, svgOverlay)

  const status = document.createElement('div')
  status.className = 'mt-6 text-center text-sm text-slate-200'

  const resetBtn = document.createElement('button')
  resetBtn.type = 'button'
  resetBtn.textContent = 'Reset board'
  resetBtn.className =
    'mx-auto mt-4 flex rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/10'

  root.append(title, h1, sub, wrap, status, resetBtn)

  let board: Cell[] = emptyBoard()
  let turn: Player = 'X'
  let locked = false

  const cells: HTMLButtonElement[] = []

  const cellCenter = (index: number) => {
    const el = cells[index]
    const r = el.getBoundingClientRect()
    const br = boardEl.getBoundingClientRect()
    return { x: r.left - br.left + r.width / 2, y: r.top - br.top + r.height / 2 }
  }

  const drawWinLine = (indices: number[]) => {
    const [a, , c] = indices
    const p1 = cellCenter(a)
    const p2 = cellCenter(c)
    line.setAttribute('x1', `${p1.x}`)
    line.setAttribute('y1', `${p1.y}`)
    line.setAttribute('x2', `${p2.x}`)
    line.setAttribute('y2', `${p2.y}`)
    line.style.strokeDasharray = '240'
    line.style.strokeDashoffset = '240'
    svgOverlay.style.opacity = '1'
    requestAnimationFrame(() => {
      line.style.transition = 'stroke-dashoffset 0.7s ease'
      line.style.strokeDashoffset = '0'
    })
  }

  const markSvg = (player: Player) => {
    const ns = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(ns, 'svg')
    svg.setAttribute('viewBox', '0 0 100 100')
    svg.setAttribute('class', 'h-16 w-16')
    if (player === 'X') {
      svg.style.filter = 'drop-shadow(0 0 14px rgba(34,211,238,0.95))'
      const p = document.createElementNS(ns, 'path')
      p.setAttribute('d', 'M18 18 L82 82 M82 18 L18 82')
      p.setAttribute('fill', 'none')
      p.setAttribute('stroke', '#67e8f9')
      p.setAttribute('stroke-width', '10')
      p.setAttribute('stroke-linecap', 'round')
      p.style.strokeDasharray = '200'
      p.style.strokeDashoffset = '200'
      svg.append(p)
      requestAnimationFrame(() => {
        p.style.transition = 'stroke-dashoffset 0.55s ease'
        p.style.strokeDashoffset = '0'
      })
    } else {
      svg.style.filter = 'drop-shadow(0 0 14px rgba(244,114,182,0.95))'
      const c = document.createElementNS(ns, 'circle')
      c.setAttribute('cx', '50')
      c.setAttribute('cy', '50')
      c.setAttribute('r', '30')
      c.setAttribute('fill', 'none')
      c.setAttribute('stroke', '#f472b6')
      c.setAttribute('stroke-width', '8')
      const len = 2 * Math.PI * 30
      c.style.strokeDasharray = `${len}`
      c.style.strokeDashoffset = `${len}`
      svg.append(c)
      requestAnimationFrame(() => {
        c.style.transition = 'stroke-dashoffset 0.65s ease'
        c.style.strokeDashoffset = '0'
      })
    }
    return svg
  }

  const refresh = () => {
    if (!locked) {
      status.textContent = `${turn} to play`
      return
    }
    const w = checkWinner(board)
    if (w) status.textContent = `${w} sealed the line.`
    else status.textContent = 'Draw — board is full.'
  }

  const reset = () => {
    board = emptyBoard()
    turn = 'X'
    locked = false
    svgOverlay.style.opacity = '0'
    line.style.strokeDashoffset = '240'
    cells.forEach((btn, i) => {
      btn.innerHTML = ''
      btn.dataset.occupied = 'false'
      btn.style.transform = 'translate(0px,0px)'
    })
    refresh()
  }

  for (let i = 0; i < 9; i++) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className =
      'group relative flex aspect-square items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/90 shadow-[12px_12px_28px_rgba(2,6,23,0.85),-10px_-10px_24px_rgba(148,163,184,0.08)] transition will-change-transform'
    btn.dataset.occupied = 'false'

    const onMove = (ev: PointerEvent) => {
      if (btn.dataset.occupied === 'true' || locked) return
      const r = btn.getBoundingClientRect()
      const dx = (ev.clientX - (r.left + r.width / 2)) / (r.width / 2)
      const dy = (ev.clientY - (r.top + r.height / 2)) / (r.height / 2)
      btn.style.transform = `translate(${dx * 8}px, ${dy * 8}px)`
    }
    const onLeave = () => {
      btn.style.transform = 'translate(0px,0px)'
    }

    btn.addEventListener('pointermove', onMove)
    btn.addEventListener('pointerleave', onLeave)
    btn.addEventListener(
      'click',
      () => {
        if (locked || board[i]) return
        applyMove(board, i, turn)
        btn.append(markSvg(turn))
        btn.dataset.occupied = 'true'
        const w = checkWinner(board)
        if (w) {
          locked = true
          const wl = winningLine(board)
          if (wl) drawWinLine(wl)
        } else if (board.every(Boolean)) {
          locked = true
        } else {
          turn = turn === 'X' ? 'O' : 'X'
        }
        refresh()
      },
      { passive: true },
    )

    boardEl.append(btn)
    cells.push(btn)
  }

  resetBtn.addEventListener('click', reset)
  reset()

  return () => {
    root.innerHTML = ''
  }
}
