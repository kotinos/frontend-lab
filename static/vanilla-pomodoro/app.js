/** Aligns with @frontend-lab/core formatMmSs + ringDashOffset */
function formatMmSs(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '00:00'
  const whole = Math.floor(totalSeconds)
  const m = Math.floor(whole / 60)
  const s = whole % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function ringDashOffset(progress01, circumference) {
  const p = Math.min(1, Math.max(0, Number.isFinite(progress01) ? progress01 : 0))
  return circumference * (1 - p)
}

const FOCUS_SEC = 25 * 60
const BREAK_SEC = 5 * 60
const CIRC = 2 * Math.PI * 170

const body = document.body
const modeLabel = document.getElementById('mode-label')
const readout = document.getElementById('readout')
const progress = document.getElementById('progress')
const toggleBtn = document.getElementById('toggle')
const switchBtn = document.getElementById('switch')

let mode = 'focus'
let remaining = FOCUS_SEC
let running = false
let last = performance.now()
let raf = 0

function totalForMode() {
  return mode === 'focus' ? FOCUS_SEC : BREAK_SEC
}

function applyVisual() {
  body.classList.toggle('focus', mode === 'focus')
  body.classList.toggle('break', mode === 'break')
  modeLabel.textContent = mode === 'focus' ? 'Focus' : 'Break'
  const p = 1 - remaining / totalForMode()
  progress.style.strokeDashoffset = String(ringDashOffset(p, CIRC))
  readout.textContent = formatMmSs(remaining)
}

function tick(now) {
  if (!running) return
  const dt = (now - last) / 1000
  last = now
  remaining = Math.max(0, remaining - dt)
  applyVisual()
  if (remaining <= 0) {
    running = false
    toggleBtn.textContent = 'Start'
    mode = mode === 'focus' ? 'break' : 'focus'
    remaining = totalForMode()
    applyVisual()
    return
  }
  raf = requestAnimationFrame(tick)
}

toggleBtn.addEventListener('click', () => {
  running = !running
  toggleBtn.textContent = running ? 'Pause' : 'Start'
  if (running) {
    last = performance.now()
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(tick)
  } else {
    cancelAnimationFrame(raf)
  }
})

switchBtn.addEventListener('click', () => {
  running = false
  toggleBtn.textContent = 'Start'
  cancelAnimationFrame(raf)
  mode = mode === 'focus' ? 'break' : 'focus'
  remaining = totalForMode()
  applyVisual()
})

applyVisual()
