const sets = {
  face: ['🙂', '😉', '😎', '🤩', '🫠'],
  hair: ['🟣', '🟤', '⚫', '🟡', '🟢'],
  acc: ['✨', '🎧', '👓', '🎀', '☕'],
}

let cat = 'face'
const state = { face: sets.face[0], hair: sets.hair[0], acc: sets.acc[0] }

const picker = document.getElementById('picker')
const tabs = document.querySelectorAll('.tab')
const faceEl = document.getElementById('layer-face')
const hairEl = document.getElementById('layer-hair')
const accEl = document.getElementById('layer-acc')

function bounce(el) {
  el.classList.remove('bounce')
  void el.offsetWidth
  el.classList.add('bounce')
}

function renderPicker() {
  picker.innerHTML = ''
  for (const sym of sets[cat]) {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'choice'
    b.textContent = sym
    b.addEventListener('click', () => {
      state[cat] = sym
      if (cat === 'face') {
        faceEl.textContent = sym
        bounce(faceEl)
      } else if (cat === 'hair') {
        hairEl.textContent = sym
        bounce(hairEl)
      } else {
        accEl.textContent = sym
        bounce(accEl)
      }
    })
    picker.appendChild(b)
  }
}

tabs.forEach((t) => {
  t.addEventListener('click', () => {
    tabs.forEach((x) => x.classList.remove('active'))
    t.classList.add('active')
    cat = t.dataset.cat
    renderPicker()
  })
})

document.getElementById('download').addEventListener('click', () => {
  if (window.confetti) {
    confetti({ particleCount: 160, spread: 78, origin: { y: 0.65 } })
  }
})

renderPicker()
