import { useEffect, useRef } from 'react'
import { isLite, prefersReducedMotion } from '../lib/device'

const COLORS = ['#C9A24A', '#E8D5A3', '#E87524', '#4B1428', '#f6e2a0', '#8a1c3a']

/** Golden confetti. Mount it (or change `runKey`) to fire. */
export default function Confetti({ runKey = 0, duration = 6000, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    const r = cv.getBoundingClientRect()
    const W = r.width,
      H = r.height
    cv.width = W * dpr
    cv.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const reduced = prefersReducedMotion()
    const total = Math.round((isLite ? 90 : 190) * (reduced ? 0.4 : 1))
    const ps = []
    const mk = (burst) => ({
      x: burst ? W / 2 + (Math.random() - 0.5) * W * 0.3 : Math.random() * W,
      y: burst ? H * 0.55 : -20 - Math.random() * H * 0.4,
      vx: burst ? (Math.random() - 0.5) * 11 : (Math.random() - 0.5) * 2,
      vy: burst ? -6 - Math.random() * 9 : 1.5 + Math.random() * 3,
      w: 5 + Math.random() * 7,
      h: 3 + Math.random() * 6,
      rot: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 0.3,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() < 0.3 ? 1 : 0,
      sw: Math.random() * 6.28,
    })
    for (let i = 0; i < total * 0.45; i++) ps.push(mk(true))
    const start = performance.now()
    let raf,
      last = start
    const tick = (now) => {
      const dt = Math.min(2.2, (now - last) / 16.67)
      last = now
      const el = now - start
      ctx.clearRect(0, 0, W, H)
      if (el < duration * 0.45 && ps.length < total) for (let i = 0; i < 4; i++) ps.push(mk(false))
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]
        p.vy += 0.09 * dt
        p.vx *= 0.995
        p.x += (p.vx + Math.sin(p.sw + now / 400) * 0.6) * dt
        p.y += p.vy * dt
        p.rot += p.vr * dt
        if (p.y > H + 30) {
          ps.splice(i, 1)
          continue
        }
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.scale(1, Math.abs(Math.cos(p.sw + now / 300)) * 0.8 + 0.2)
        ctx.fillStyle = p.c
        if (p.shape) {
          ctx.beginPath()
          ctx.arc(0, 0, p.w / 2.2, 0, 6.28)
          ctx.fill()
        } else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }
      if (el < duration && ps.length) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, W, H)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [runKey, duration])
  return <canvas ref={ref} className={`absolute inset-0 w-full h-full pointer-events-none z-40 ${className}`} />
}
