const LAT = 52.52
const LON = 13.405

const videos = {
  clear: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  rain: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  snow: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  clouds: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
}

const bg = document.getElementById('bg')
const conditionEl = document.getElementById('condition')
const tempEl = document.getElementById('temp')
const daysEl = document.getElementById('days')
const body = document.body

function mapCode(code) {
  if (code === 0 || code === 1) return 'clear'
  if (code >= 51 && code <= 67) return 'rain'
  if (code >= 71 && code <= 77) return 'snow'
  return 'clouds'
}

async function load() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&daily=weathercode,temperature_2m_max&timezone=auto&hourly=temperature_2m`
  const res = await fetch(url)
  if (!res.ok) throw new Error('weather')
  return res.json()
}

function setVideo(key) {
  const src = videos[key] ?? videos.clouds
  if (bg.getAttribute('data-src') !== src) {
    bg.src = src
    bg.setAttribute('data-src', src)
    body.dataset.weather = key
  }
}

function buildChart(hourly) {
  const labels = hourly.time.slice(0, 24).map((t) => t.slice(11, 16))
  const data = hourly.temperature_2m.slice(0, 24)
  const ctx = document.getElementById('chart')
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '°C',
          data,
          borderColor: 'rgba(160, 210, 255, 0.95)',
          backgroundColor: 'rgba(120, 180, 255, 0.12)',
          tension: 0.35,
          fill: true,
          pointRadius: 0,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#c8d4f0', maxTicksLimit: 8 }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y: { ticks: { color: '#c8d4f0' }, grid: { color: 'rgba(255,255,255,0.06)' } },
      },
    },
  })
}

async function main() {
  const data = await load()
  const cw = data.current_weather
  const wcode = cw.weathercode
  const bucket = mapCode(wcode)
  setVideo(bucket)
  tempEl.textContent = `${Math.round(cw.temperature)}°`
  conditionEl.textContent = `Code ${wcode} · Wind ${cw.windspeed} km/h`

  const daily = data.daily
  daysEl.innerHTML = ''
  for (let i = 0; i < 5; i += 1) {
    const day = document.createElement('article')
    day.className = 'day'
    const date = new Date(daily.time[i])
    day.innerHTML = `<h3>${date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</h3><p>${Math.round(
      daily.temperature_2m_max[i],
    )}° · code ${daily.weathercode[i]}</p>`
    daysEl.appendChild(day)
  }

  buildChart(data.hourly)
}

main().catch(() => {
  conditionEl.textContent = 'Offline sample data'
  tempEl.textContent = '18°'
  setVideo('clouds')
  daysEl.innerHTML = Array.from({ length: 5 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return `<article class="day"><h3>${d.toLocaleDateString(undefined, { weekday: 'short' })}</h3><p>${17 + i}°</p></article>`
  }).join('')
})
