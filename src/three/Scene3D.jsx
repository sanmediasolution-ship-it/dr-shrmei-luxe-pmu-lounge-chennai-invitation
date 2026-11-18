import { Component, lazy, Suspense, useEffect } from 'react'
import { Feather } from '../components/Ornaments'
import { hasWebGL } from '../lib/device'

const LAZY = {
  door: lazy(() => import('./DoorScene')),
  chest: lazy(() => import('./TreasureScene')),
  peacock: lazy(() => import('./PeacockScene')),
}
export const preload3D = () => Promise.all([import('./DoorScene'), import('./TreasureScene'), import('./PeacockScene')]).catch(() => {})

class Boundary extends Component {
  state = { err: false }
  static getDerivedStateFromError() {
    return { err: true }
  }
  componentDidCatch(e) {
    console.warn('3D scene failed, using fallback', e)
  }
  render() {
    return this.state.err ? this.props.fallback : this.props.children
  }
}

/* ───────────── CSS / SVG fallbacks (no WebGL) ───────────── */
function DoorFallback({ open, onOpened }) {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => onOpened && onOpened(), 3300)
    return () => clearTimeout(t)
  }, [open]) // eslint-disable-line
  const leaf = (side) => ({
    position: 'absolute',
    top: '14%',
    bottom: '10%',
    width: '34%',
    [side]: '16%',
    transformOrigin: side === 'left' ? 'left center' : 'right center',
    transform: open ? `rotateY(${side === 'left' ? -105 : 105}deg)` : 'rotateY(0)',
    transition: 'transform 3.2s cubic-bezier(.6,.05,.3,1)',
    background:
      'radial-gradient(circle at 50% 50%, #e87524 0 7%, #c9a24a 8% 13%, transparent 14%), repeating-linear-gradient(90deg, rgba(255,255,255,.04) 0 2px, transparent 2px 6px), linear-gradient(160deg,#2a0a16,#4b1428 50%,#1d0710)',
    border: '4px solid #c9a24a',
    boxShadow: 'inset 0 0 0 6px #2a0a16, inset 0 0 0 8px #c9a24a88, 0 0 30px #e8752433',
  })
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: 1100, background: '#050304' }}>
      <div
        className="absolute"
        style={{ left: '15%', right: '15%', top: '13%', bottom: '9%', background: 'radial-gradient(ellipse at 50% 50%, #fff4cc 0%, #ffbf5a 35%, #7a3a10 80%)', opacity: open ? 1 : 0.35, transition: 'opacity 2.5s', transform: open ? 'scale(1.8)' : 'none' }}
      />
      <div style={leaf('left')} />
      <div style={leaf('right')} />
    </div>
  )
}

function ChestFallback({ phase, onTap }) {
  const open = phase === 'opening' || phase === 'open' || phase === 'keyFlies'
  return (
    <div className="absolute inset-0 flex items-center justify-center" onPointerDown={onTap}>
      <div className="absolute w-[80%] aspect-square rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,200,90,.7), transparent 65%)', opacity: open ? 1 : 0.25, transition: 'opacity 1.4s' }} />
      <svg viewBox="0 0 300 240" className="relative w-[78%] overflow-visible" style={{ marginTop: '40%' }}>
        <defs>
          <linearGradient id="gch" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#f6e2a0" />
            <stop offset=".5" stopColor="#c9a24a" />
            <stop offset="1" stopColor="#8a6a22" />
          </linearGradient>
        </defs>
        <g style={{ transformOrigin: '150px 110px', transform: open ? 'rotateX(0) translateY(-48px) rotate(-8deg)' : 'none', transition: 'transform 1.8s ease' }}>
          <rect x="20" y="52" width="260" height="58" rx="8" fill="url(#gch)" stroke="#6a4a12" />
          <rect x="130" y="52" width="40" height="58" fill="#8a1c3a" />
        </g>
        <rect x="20" y="110" width="260" height="110" rx="8" fill="url(#gch)" stroke="#6a4a12" />
        <rect x="132" y="110" width="36" height="110" fill="#8a1c3a" />
        <rect x="138" y="140" width="24" height="30" rx="3" fill="#f6e2a0" />
        <circle cx="150" cy="150" r="5" fill="#c8102e" />
        <g style={{ transform: open ? 'translateY(-110px)' : 'translateY(10px)', opacity: open ? 1 : 0, transition: 'all 1.8s ease .6s' }}>
          <circle cx="150" cy="100" r="16" fill="none" stroke="#ffd86a" strokeWidth="6" />
          <rect x="146" y="116" width="8" height="46" fill="#ffd86a" />
        </g>
      </svg>
    </div>
  )
}

function PeacockFallback({ phase, onTap, onZoomed }) {
  const open = phase !== 'idle'
  useEffect(() => {
    if (phase !== 'zoom') return
    const t = setTimeout(() => onZoomed && onZoomed(), 2400)
    return () => clearTimeout(t)
  }, [phase]) // eslint-disable-line
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden" onPointerDown={onTap} style={{ background: '#070405' }}>
      <div className="absolute w-[130%] aspect-square rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,170,60,.7), transparent 62%)', opacity: open ? 1 : 0.2, transition: 'opacity 2s' }} />
      <div className="relative w-full" style={{ height: '70%', transform: phase === 'zoom' ? 'scale(5) translateY(18%)' : 'none', transition: 'transform 2.4s ease-in', transformOrigin: '50% 30%' }}>
        {Array.from({ length: 13 }, (_, i) => {
          const u = i / 12 - 0.5
          const ang = open ? u * 150 : u * 14
          return (
            <div key={i} className="absolute left-1/2 bottom-[8%] origin-bottom" style={{ width: '24%', transform: `translateX(-50%) rotate(${ang}deg)`, transition: 'transform 2.2s cubic-bezier(.3,.7,.2,1)' }}>
              <Feather className="w-full" />
            </div>
          )
        })}
        <div className="absolute left-1/2 bottom-[2%] -translate-x-1/2 w-[18%] h-[30%] rounded-[50%] bg-gradient-to-b from-[#0a7aa8] to-[#0c3f8a]" />
      </div>
    </div>
  )
}

const FALLBACK = { door: DoorFallback, chest: ChestFallback, peacock: PeacockFallback }

export function Scene3D({ kind, ...props }) {
  const FB = FALLBACK[kind]
  const Lazy = LAZY[kind]
  if (!hasWebGL()) return <FB {...props} />
  return (
    <Boundary fallback={<FB {...props} />}>
      <Suspense fallback={null}>
        <Lazy {...props} />
      </Suspense>
    </Boundary>
  )
}
