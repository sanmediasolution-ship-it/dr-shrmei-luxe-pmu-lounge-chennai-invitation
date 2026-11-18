export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Low-end heuristic -> lighter particles, lower pixel ratio */
export const isLite = (() => {
  if (typeof navigator === 'undefined') return false
  const mem = navigator.deviceMemory
  const cores = navigator.hardwareConcurrency
  const save = navigator.connection && navigator.connection.saveData
  return !!(save || (mem && mem <= 2) || (cores && cores <= 2))
})()

let _gl
export function hasWebGL() {
  if (_gl !== undefined) return _gl
  try {
    const c = document.createElement('canvas')
    _gl = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    _gl = false
  }
  return _gl
}

export const dprCap = isLite ? 1.25 : 2

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
