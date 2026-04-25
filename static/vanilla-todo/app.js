/**
 * Mirrors packages/core/src/reorder.ts — keep behavior aligned with unit tests.
 */
function moveItemInArray(items, fromIndex, toIndex) {
  if (items.length === 0) return []
  const clamp = (i) => Math.max(0, Math.min(items.length - 1, i))
  const from = clamp(fromIndex)
  const to = clamp(toIndex)
  if (from === to) return [...items]
  const next = [...items]
  const [removed] = next.splice(from, 1)
  next.splice(to, 0, removed)
  return next
}

const listEl = document.getElementById('list')
const formEl = document.getElementById('add-form')
const inputEl = document.getElementById('task-input')
const pctEl = document.getElementById('pct')
const ringFg = document.querySelector('.ring-fg')

const CIRC = 2 * Math.PI * 52

/** @type {{ id: string, text: string, done: boolean }[]} */
let tasks = load()

function load() {
  try {
    const raw = localStorage.getItem('flab-todo')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function save() {
  localStorage.setItem('flab-todo', JSON.stringify(tasks))
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function render() {
  listEl.innerHTML = ''
  for (const t of tasks) {
    const li = document.createElement('li')
    li.className = 'item neu raised'
    li.dataset.id = t.id
    li.draggable = true
    li.innerHTML = `
      <span class="handle" aria-hidden="true"></span>
      <span class="label"></span>
      <button type="button" class="toggle ${t.done ? 'on' : ''}" aria-pressed="${t.done}" aria-label="Toggle done">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
      </button>
      <button type="button" class="del" aria-label="Delete">✕</button>
    `
    li.querySelector('.label').textContent = t.text
    li.addEventListener('click', (e) => {
      const tgt = /** @type {HTMLElement} */ (e.target)
      if (tgt.closest('.del')) {
        removeTask(t.id, li)
        return
      }
      if (tgt.closest('.toggle')) {
        t.done = !t.done
        save()
        tgt.closest('.toggle').classList.toggle('on', t.done)
        tgt.closest('.toggle').setAttribute('aria-pressed', String(t.done))
        li.classList.toggle('done', t.done)
        updateRing()
      }
    })
    bindDrag(li, t.id)
    if (t.done) li.classList.add('done')
    listEl.appendChild(li)
  }
  updateRing()
}

function updateRing() {
  const total = tasks.length
  const done = tasks.filter((x) => x.done).length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  pctEl.textContent = String(pct)
  const offset = CIRC * (1 - pct / 100)
  ringFg.style.strokeDashoffset = String(offset)
}

function removeTask(id, li) {
  li.classList.add('exit')
  li.addEventListener(
    'animationend',
    () => {
      tasks = tasks.filter((x) => x.id !== id)
      save()
      render()
    },
    { once: true },
  )
}

let dragId = null

function bindDrag(li, id) {
  li.addEventListener('dragstart', (e) => {
    dragId = id
    li.classList.add('dragging')
    e.dataTransfer?.setData('text/plain', id)
  })
  li.addEventListener('dragend', () => {
    dragId = null
    li.classList.remove('dragging')
  })
  li.addEventListener('dragover', (e) => {
    e.preventDefault()
  })
  li.addEventListener('drop', (e) => {
    e.preventDefault()
    const targetId = li.dataset.id
    if (!dragId || !targetId || dragId === targetId) return
    const from = tasks.findIndex((x) => x.id === dragId)
    const to = tasks.findIndex((x) => x.id === targetId)
    if (from < 0 || to < 0) return
    tasks = moveItemInArray(tasks, from, to)
    save()
    render()
  })
}

formEl.addEventListener('submit', (e) => {
  e.preventDefault()
  const text = inputEl.value.trim()
  if (!text) return
  tasks = [...tasks, { id: uid(), text, done: false }]
  inputEl.value = ''
  save()
  render()
})

render()
