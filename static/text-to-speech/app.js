const textEl = document.getElementById('text')
const playBtn = document.getElementById('play')
const status = document.getElementById('status')
const canvas = document.getElementById('wave')
const ctx = canvas.getContext('2d')

let speaking = false
let raf = 0
let phase = 0

function drawWave(active) {
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)
  ctx.lineWidth = 2
  ctx.strokeStyle = active ? 'rgba(80,120,220,0.85)' : 'rgba(31,27,22,0.18)'
  ctx.beginPath()
  for (let x = 0; x < w; x += 2) {
    const t = (x + phase) * 0.035
    const y = h / 2 + Math.sin(t) * (active ? 18 : 6) + Math.sin(t * 0.5) * (active ? 8 : 3)
    if (x === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

function loop() {
  phase += speaking ? 5 : 1.5
  drawWave(speaking)
  raf = requestAnimationFrame(loop)
}

function speak() {
  if (!window.speechSynthesis) {
    status.textContent = 'speechSynthesis is not available in this browser.'
    return
  }
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(textEl.value)
  utter.rate = 1
  utter.onstart = () => {
    speaking = true
    playBtn.setAttribute('aria-pressed', 'true')
    playBtn.querySelector('.label').textContent = 'Pause'
    status.textContent = 'Reading…'
  }
  utter.onend = utter.onerror = () => {
    speaking = false
    playBtn.setAttribute('aria-pressed', 'false')
    playBtn.querySelector('.label').textContent = 'Speak'
    status.textContent = 'Ready.'
  }
  window.speechSynthesis.speak(utter)
}

playBtn.addEventListener('click', () => {
  if (!window.speechSynthesis) {
    status.textContent = 'speechSynthesis is not available in this browser.'
    return
  }
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause()
    speaking = false
    playBtn.setAttribute('aria-pressed', 'false')
    playBtn.querySelector('.label').textContent = 'Resume'
    status.textContent = 'Paused.'
    return
  }
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume()
    speaking = true
    playBtn.setAttribute('aria-pressed', 'true')
    playBtn.querySelector('.label').textContent = 'Pause'
    status.textContent = 'Reading…'
    return
  }
  speak()
})

status.textContent = 'Ready.'
cancelAnimationFrame(raf)
raf = requestAnimationFrame(loop)
