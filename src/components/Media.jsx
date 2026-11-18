import { asset, showHints } from '../lib/assets'

/** Logo — uses YOUR supplied files in /public/assets/logo (never a generated substitute). */
export function Logo({ variant = 'mark', className = '', style, glow = true }) {
  const key = { mark: 'logo/logo', emblem: 'logo/emblem', full: 'logo/logo-full' }[variant]
  const src = asset(key) || asset('logo/logo') || asset('logo/emblem')
  if (!src) {
    return (
      <div className={`text-center font-display gold-text tracking-[0.2em] ${className}`} style={style}>
        DR. SHRMEI’S
        {showHints && <div className="text-[10px] text-champagne/50 mt-1">add /assets/logo/logo.png</div>}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt="Dr. Shrmei"
      draggable="false"
      className={className}
      style={{ filter: glow ? 'drop-shadow(0 0 22px rgba(232,117,36,0.45))' : undefined, ...style }}
    />
  )
}

/** Elegant placeholder shown while a real photo hasn't been supplied yet. */
export function PlaceholderArt({ icon: Icon, label, hint, className = '' }) {
  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={{
        background:
          'radial-gradient(70% 55% at 50% 38%, rgba(232,117,36,0.28), transparent 70%), linear-gradient(160deg, #2a0c18 0%, #120709 55%, #090909 100%)',
      }}
    >
      <div className="absolute inset-3 rounded-[14px] border border-gold/30 pointer-events-none" />
      <div className="absolute inset-5 rounded-[10px] border border-gold/15 pointer-events-none" />
      {Icon && (
        <div className="relative float-y">
          <div className="absolute inset-0 blur-2xl bg-ember/30 rounded-full" />
          <Icon className="relative text-gold" strokeWidth={1} style={{ width: 'calc(var(--u)*16)', height: 'calc(var(--u)*16)' }} />
        </div>
      )}
      {label && <p className="font-display fs-xs tracking-[0.28em] text-champagne/80 mt-4 text-center px-6">{label}</p>}
      {showHints && hint && <p className="fs-xs text-ember/80 mt-2 px-6 text-center font-sans">▸ {hint}</p>}
    </div>
  )
}

/** Photo from /public/assets (by key, no extension) or a placeholder. */
export function Photo({ k, alt = '', className = '', imgClass = '', fallback, style, position = 'center' }) {
  const src = asset(k)
  if (!src) return fallback || <PlaceholderArt hint={`add /assets/${k}.webp`} className={className} />
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable="false"
      className={`w-full h-full object-cover ${imgClass}`}
      style={{ objectPosition: position, ...style }}
    />
  )
}
