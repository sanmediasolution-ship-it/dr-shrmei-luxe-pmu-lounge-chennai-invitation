import { useEffect, useRef } from 'react'
import { Feather } from './Ornaments'

/**
 * Ancient Indian royal palace — layered SVG/CSS with volumetric light rays and pointer/tilt parallax.
 * variant: 'treasure' (stone chamber) | 'throne' (gilded hall)
 */
export function PalaceBackdrop({ variant = 'treasure', dim = 0, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const set = (x, y) => {
      el.style.setProperty('--px', x.toFixed(3))
      el.style.setProperty('--py', y.toFixed(3))
    }
    const mv = (e) => {
      const r = el.getBoundingClientRect()
      set(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2)
    }
    const or = (e) => {
      if (e.gamma == null) return
      set(Math.max(-1, Math.min(1, e.gamma / 25)), Math.max(-1, Math.min(1, (e.beta - 45) / 25)))
    }
    window.addEventListener('pointermove', mv)
    window.addEventListener('deviceorientation', or)
    return () => {
      window.removeEventListener('pointermove', mv)
      window.removeEventListener('deviceorientation', or)
    }
  }, [])
  const gold = variant === 'throne'
  const layer = (k) => ({ transform: `translate3d(calc(var(--px,0)*${k}px), calc(var(--py,0)*${k * 0.6}px), 0)` })
  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`} style={{ background: gold ? 'linear-gradient(180deg,#2a0c10 0%,#4b1428 40%,#1a0808 100%)' : 'linear-gradient(180deg,#0d0807 0%,#1a110c 55%,#070505 100%)' }}>
      {/* back wall */}
      <svg viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" style={layer(-6)}>
        <defs>
          <pattern id={`stone-${variant}`} width="40" height="22" patternUnits="userSpaceOnUse">
            <rect width="40" height="22" fill={gold ? '#3b1320' : '#1a130f'} />
            <path d="M0 0H40M0 11H40M20 11V22M0 0V11" stroke={gold ? '#c9a24a' : '#000'} strokeOpacity={gold ? 0.18 : 0.5} strokeWidth="0.8" />
          </pattern>
          <linearGradient id={`arch-${variant}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#f6e2a0" />
            <stop offset="1" stopColor="#8a6a22" />
          </linearGradient>
          <radialGradient id={`light-${variant}`} cx="50%" cy="38%" r="60%">
            <stop offset="0" stopColor="#ffbf5a" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#e87524" stopOpacity="0.28" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="360" height="640" fill={`url(#stone-${variant})`} />
        {/* three arches */}
        {[-1, 0, 1].map((i) => (
          <g key={i} transform={`translate(${180 + i * 118} 0)`}>
            <path d="M-46 420 V250 Q-46 160 0 150 Q46 160 46 250 V420 Z" fill="#070404" stroke={`url(#arch-${variant})`} strokeWidth="3" />
            <path d="M-36 420 V256 Q-36 176 0 166 Q36 176 36 256 V420" fill="none" stroke="#c9a24a" strokeOpacity="0.45" strokeWidth="1" />
            <circle cx="0" cy="140" r="5" fill="#e87524" />
          </g>
        ))}
        {/* columns */}
        {[18, 342].map((x) => (
          <g key={x}>
            <rect x={x - 15} y="0" width="30" height="640" fill={gold ? '#5a1c30' : '#241a14'} />
            <rect x={x - 15} y="0" width="30" height="640" fill="url(#arch-throne)" opacity="0.1" />
            {Array.from({ length: 14 }, (_, k) => (
              <path key={k} d={`M${x - 15} ${k * 46 + 10} q15 14 30 0`} stroke="#c9a24a" strokeOpacity="0.5" fill="none" />
            ))}
          </g>
        ))}
        <rect width="360" height="640" fill={`url(#light-${variant})`} />
        {/* floor */}
        <path d="M0 520 L360 520 L360 640 L0 640 Z" fill="#0a0605" />
        <path d="M0 520 H360" stroke="#c9a24a" strokeOpacity="0.5" />
        {Array.from({ length: 9 }, (_, k) => (
          <path key={k} d={`M180 520 L${-180 + k * 90} 640`} stroke="#c9a24a" strokeOpacity="0.1" />
        ))}
      </svg>
      {gold && (
        <div className="absolute inset-x-0 top-[2%] flex justify-center opacity-70" style={layer(-10)}>
          <Feather className="w-[28%]" />
        </div>
      )}
      {/* volumetric rays */}
      <div className="absolute inset-0 mix-blend-screen pointer-events-none" style={{ ...layer(10), opacity: 0.85 }}>
        <div className="absolute -top-[10%] left-[8%] w-[70%] h-[130%]" style={{ background: 'conic-gradient(from 160deg at 50% 0%, transparent 0 8deg, rgba(255,190,90,.30) 12deg, transparent 20deg, rgba(255,170,70,.22) 26deg, transparent 34deg, rgba(255,200,110,.26) 40deg, transparent 50deg)', animation: 'rayShift 7s ease-in-out infinite', transformOrigin: '50% 0' }} />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(120% 90% at 50% 45%, transparent 40%, rgba(0,0,0,${0.55 + dim}) 100%)` }} />
    </div>
  )
}
