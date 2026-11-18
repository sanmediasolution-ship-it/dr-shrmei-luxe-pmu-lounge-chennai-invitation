import { useId } from 'react'

/** Peacock-feather ornament (SVG). Used on the card & frames. */
export function Feather({ className = '', style, rotate = 0, flip = false, colors = ['#C9A24A', '#E87524', '#4B1428'] }) {
  const id = useId().replace(/:/g, '')
  const barbs = Array.from({ length: 30 }, (_, i) => i)
  return (
    <svg viewBox="0 0 120 300" className={className} style={{ transform: `rotate(${rotate}deg) scaleX(${flip ? -1 : 1})`, ...style }} fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`e${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#0b2f78" />
          <stop offset="0.45" stopColor="#127c8c" />
          <stop offset="0.75" stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[1]} />
        </radialGradient>
      </defs>
      <path d="M60 296 C58 220 62 150 60 60" stroke={colors[0]} strokeWidth="1.6" />
      {barbs.map((i) => {
        const y = 270 - i * 7.2
        const w = i < 10 ? 10 + i * 2.2 : 32 + Math.sin((i - 10) / 20 * Math.PI) * 18
        return (
          <g key={i} stroke={i % 3 === 0 ? colors[1] : colors[0]} strokeWidth="0.7" opacity="0.8">
            <path d={`M60 ${y} q${-w * 0.6} ${-w * 0.3} ${-w} ${-w * 0.7}`} />
            <path d={`M60 ${y} q${w * 0.6} ${-w * 0.3} ${w} ${-w * 0.7}`} />
          </g>
        )
      })}
      <ellipse cx="60" cy="66" rx="30" ry="44" fill={`url(#e${id})`} stroke={colors[0]} strokeWidth="1.2" />
      <ellipse cx="60" cy="66" rx="19" ry="29" fill="#0b2f78" stroke={colors[0]} strokeWidth="0.8" />
      <ellipse cx="60" cy="66" rx="9" ry="16" fill="#060b26" />
      <ellipse cx="57" cy="58" rx="2.4" ry="4.5" fill="#fff" opacity="0.5" />
    </svg>
  )
}

/** Ornamental gold corner */
export function Corner({ className = '', style }) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} fill="none" stroke="#C9A24A" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 76 V20 Q4 4 20 4 H76" />
      <path d="M12 76 V24 Q12 12 24 12 H76" strokeWidth="0.8" opacity="0.7" />
      <circle cx="20" cy="20" r="3.2" fill="#E87524" stroke="none" />
      <path d="M30 4 q4 10 14 10 M4 30 q10 4 10 14" strokeWidth="1" />
      <path d="M22 22 q12 2 18 12 M22 22 q2 12 12 18" strokeWidth="0.8" opacity="0.8" />
    </svg>
  )
}

/** Four-corner antique gold frame, children inside */
export function GoldFrame({ children, className = '', inset = 10, rounded = 14 }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute pointer-events-none" style={{ inset, border: '1px solid rgba(201,162,74,0.85)', borderRadius: rounded, boxShadow: '0 0 24px rgba(232,117,36,0.25), inset 0 0 24px rgba(201,162,74,0.12)' }} />
      <div className="absolute pointer-events-none" style={{ inset: inset + 5, border: '1px solid rgba(201,162,74,0.35)', borderRadius: rounded - 4 }} />
      <Corner className="absolute w-12 h-12" style={{ top: inset - 6, left: inset - 6 }} />
      <Corner className="absolute w-12 h-12" style={{ top: inset - 6, right: inset - 6, transform: 'scaleX(-1)' }} />
      <Corner className="absolute w-12 h-12" style={{ bottom: inset - 6, left: inset - 6, transform: 'scaleY(-1)' }} />
      <Corner className="absolute w-12 h-12" style={{ bottom: inset - 6, right: inset - 6, transform: 'scale(-1,-1)' }} />
      {children}
    </div>
  )
}

export function Divider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
      <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 0 L9 5 L14 7 L9 9 L7 14 L5 9 L0 7 L5 5Z" fill="#E87524" /></svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
    </div>
  )
}
