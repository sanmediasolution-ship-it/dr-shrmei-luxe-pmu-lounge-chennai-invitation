import { useEffect, useRef } from 'react'
import { isLite, prefersReducedMotion } from '../lib/device'

/**
 * Lightweight 2D canvas golden particles.
 * mode: 'float' (ambient drift) | 'rise' (embers) | 'toward' (dust flying at the viewer) | 'burst' (radial burst)
 */
export default function GoldDust({ count = 70, mode = 'float', className = '', color = '232,200,120', speed = 1, burstKey = 0 }) {
  const ref = useRef(null)
  const state = useRef({ ps: [], raf: 0 })

  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    const reduced = prefersReducedMotion()
    const n = Math.round(count * (isLite ? 0.45 : 1) * (reduced ? 0.3 : 1))
    const dpr = Math.min(window.devicePixelRatio || 1, isLite ? 1 : 1.75)
    let W = 0,
      H = 0
    const resize = () => {
      const r = cv.getBoundingClientRect()
      W = r.width
      H = r.height
      cv.width = Math.max(1, W * dpr)
      cv.height = Math.max(1, H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    const spawn = (initial) => {
      const base = { tw: Math.random() * 6.28, r: 0.6 + Math.random() * 1.9, a: 0.3 + Math.random() * 0.7 }
      if (mode === 'toward') {
        const ang = Math.random() * 6.28
        return { ...base, ang, d: initial ? Math.random() : 0.02, v: 0.12 + Math.random() * 0.35 }
      }
      if (mode === 'burst') {
        const ang = Math.random() * 6.28
        const sp = (1 + Math.random() * 5.5) * speed
        return { ...base, x: W / 2, y: H / 2, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 1, life: 1, decay: 0.006 + Math.random() * 0.012 }
      }
      return {
        ...base,
        x: Math.random() * W,
        y: initial ? Math.random() * H : mode === 'rise' ? H + 10 : Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25 * speed,
        vy: (mode === 'rise' ? -0.25 - Math.random() * 0.8 : -0.05 - Math.random() * 0.25) * speed,
      }
    }
    state.current.ps = Array.from({ length: mode === 'burst' ? n * 2 : n }, () => spawn(true))

    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min(2.2, (now - last) / 16.67)
      last = now
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'
      const ps = state.current.ps
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i]
        let x, y, alpha, r
        if (mode === 'toward') {
          p.d += p.v * 0.012 * dt * speed
          if (p.d > 1) Object.assign(p, spawn(false))
          const R = p.d * p.d * Math.max(W, H) * 0.75
          x = W / 2 + Math.cos(p.ang) * R
          y = H / 2 + Math.sin(p.ang) * R
          r = p.r * (0.4 + p.d * 3.4)
          alpha = p.a * Math.sin(Math.min(1, p.d * 1.4) * Math.PI) * 0.9
        } else if (mode === 'burst') {
          p.x += p.vx * dt
          p.y += p.vy * dt
          p.vy += 0.045 * dt
          p.vx *= 0.992
          p.life -= p.decay * dt
          x = p.x
          y = p.y
          r = p.r * 1.3
          alpha = Math.max(0, p.life) * p.a
        } else {
          p.x += (p.vx + Math.sin(p.tw + now / 1800) * 0.12) * dt
          p.y += p.vy * dt
          if (p.y < -12 || p.x < -12 || p.x > W + 12) Object.assign(p, spawn(false), { y: H + 8 })
          x = p.x
          y = p.y
          r = p.r
          alpha = p.a * (0.5 + 0.5 * Math.sin(p.tw + now / 650))
        }
        if (alpha <= 0.01) continue
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2)
        g.addColorStop(0, `rgba(${color},${alpha})`)
        g.addColorStop(0.35, `rgba(${color},${alpha * 0.35})`)
        g.addColorStop(1, `rgba(${color},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, r * 3.2, 0, 6.2832)
        ctx.fill()
      }
      state.current.raf = requestAnimationFrame(tick)
    }
    state.current.raf = requestAnimationFrame(tick)
    const vis = () => {
      cancelAnimationFrame(state.current.raf)
      if (!document.hidden) {
        last = performance.now()
        state.current.raf = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', vis)
    return () => {
      cancelAnimationFrame(state.current.raf)
      document.removeEventListener('visibilitychange', vis)
      ro.disconnect()
    }
  }, [count, mode, color, speed, burstKey])

  return <canvas ref={ref} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} />
}
