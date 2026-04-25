const cafes = [
  {
    name: 'Nebula Roast',
    stars: '★★★★★',
    blurb: 'Single-origin pour-overs · velvet cortados',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    lng: 13.411,
    lat: 52.523,
  },
  {
    name: 'Monochrome Lab',
    stars: '★★★★☆',
    blurb: 'Minimal space · signature charcoal latte',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
    lng: 13.392,
    lat: 52.516,
  },
  {
    name: 'Glasshouse Brew',
    stars: '★★★★★',
    blurb: 'Sunlit atrium · seasonal pastries',
    img: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80',
    lng: 13.403,
    lat: 52.53,
  },
]

const params = new URLSearchParams(window.location.search)
let token = params.get('token') ?? localStorage.getItem('mapbox-token') ?? ''

const cardsEl = document.getElementById('cards')
const tokenInput = document.getElementById('token-input')
const applyBtn = document.getElementById('apply-token')

function renderCards() {
  cardsEl.innerHTML = ''
  for (const c of cafes) {
    const el = document.createElement('article')
    el.className = 'card'
    el.innerHTML = `
      <img src="${c.img}" alt="" loading="lazy" />
      <div class="card-body">
        <div class="stars">${c.stars}</div>
        <h2>${c.name}</h2>
        <p class="meta">${c.blurb}</p>
      </div>
    `
    el.addEventListener('click', () => flyTo(c))
    cardsEl.appendChild(el)
  }
}

let map

function flyTo(c) {
  if (!map) return
  map.flyTo({ center: [c.lng, c.lat], zoom: 14, pitch: 45, essential: true })
}

function initMap() {
  if (!token || !window.mapboxgl) {
    if (!document.getElementById('map-disabled-note')) {
      const p = document.createElement('p')
      p.id = 'map-disabled-note'
      p.className = 'meta'
      p.textContent = 'Map disabled until a valid Mapbox token is applied.'
      cardsEl.prepend(p)
    }
    return
  }
  mapboxgl.accessToken = token
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [13.405, 52.52],
    zoom: 12.2,
    pitch: 38,
    bearing: -12,
  })
  map.on('load', () => {
    map.setFog({ color: 'rgb(12,14,22)', 'high-color': 'rgb(36,44,64)', 'horizon-blend': 0.08 })
    for (const c of cafes) {
      new mapboxgl.Marker({ color: '#9b7bff' }).setLngLat([c.lng, c.lat]).addTo(map)
    }
  })
}

applyBtn.addEventListener('click', () => {
  token = tokenInput.value.trim()
  if (!token) return
  localStorage.setItem('mapbox-token', token)
  window.location.reload()
})

tokenInput.value = token
renderCards()
initMap()
