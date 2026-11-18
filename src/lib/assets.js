/**
 * Asset registry. Reads /assets/manifest.json (auto-generated from public/assets)
 * so the app knows which of your files exist. Drop a file in the right folder
 * with the right name and it is used automatically — no code changes.
 *
 *   asset('logo/logo')            -> './assets/logo/logo.png'  (or null if missing)
 *   assetGroup('chennai/lounge-') -> every file starting with that prefix
 */
const BASE = import.meta.env.BASE_URL
const PREF = ['avif', 'webp', 'jpg', 'jpeg', 'png', 'svg', 'mp4', 'webm', 'mp3', 'm4a', 'ogg', 'wav']
const map = new Map()
let loaded = false

export async function loadManifest() {
  try {
    const r = await fetch(`${BASE}assets/manifest.json`, { cache: 'no-store' })
    const j = await r.json()
    const groups = {}
    j.files.forEach((f) => {
      const m = f.match(/^(.*)\.([a-z0-9]+)$/i)
      if (!m) return
      ;(groups[m[1]] ||= []).push(m[2].toLowerCase())
    })
    Object.entries(groups).forEach(([k, exts]) => {
      exts.sort((a, b) => PREF.indexOf(a) - PREF.indexOf(b))
      map.set(k, `${BASE}assets/${k}.${exts[0]}`)
    })
  } catch {
    /* no manifest = every asset falls back to its placeholder */
  }
  loaded = true
}

export const asset = (key) => map.get(key) || null
export const assetGroup = (prefix) =>
  [...map.keys()]
    .filter((k) => k.startsWith(prefix))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((k) => map.get(k))
export const manifestLoaded = () => loaded

/** Setup hints (small labels showing which file goes where) — dev, or add ?setup=1 to the URL */
export const showHints = import.meta.env.DEV || (typeof location !== 'undefined' && /[?&]setup=1/.test(location.search))

export function preloadImages(urls) {
  return Promise.all(
    urls.filter(Boolean).map(
      (u) =>
        new Promise((res) => {
          const i = new Image()
          i.onload = i.onerror = () => res()
          i.src = u
        }),
    ),
  )
}
