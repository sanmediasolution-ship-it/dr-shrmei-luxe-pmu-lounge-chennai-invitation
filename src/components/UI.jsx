import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { audio } from '../lib/audio'
import { CHAPTERS, STAGES, useStory } from '../story'

/** Cinematic text reveal — letter by letter (Latin) or word by word (Tamil / long lines) */
export function CText({ children, delay = 0, by = 'letter', step, className = '', as: Tag = 'div', style }) {
  const text = String(children)
  const parts = by === 'letter' ? [...text] : text.split(/(\s+)/)
  const s = step ?? (by === 'letter' ? 55 : 140)
  let i = 0
  return (
    <Tag className={className} style={style} aria-label={text}>
      {parts.map((p, k) => {
        if (/^\s+$/.test(p)) return <span key={k}>{p}</span>
        const idx = i++
        return (
          <span key={k} className="reveal-span" aria-hidden="true" style={{ '--i': idx, '--d': `${delay}ms`, '--step': `${s}ms` }}>
            {p}
          </span>
        )
      })}
    </Tag>
  )
}

export function GoldButton({ children, onClick, variant = '', size = '', className = '', icon: Icon, disabled, type = 'button', href, target }) {
  const cls = `gold-btn ${variant} ${size} ${className}`
  const content = (
    <>
      {Icon && <Icon style={{ width: '1.15em', height: '1.15em' }} strokeWidth={1.6} />}
      <span>{children}</span>
    </>
  )
  const handle = (e) => {
    audio.sfx('tap')
    onClick && onClick(e)
  }
  if (href)
    return (
      <a href={href} target={target || '_blank'} rel="noopener noreferrer" className={cls} onClick={() => audio.sfx('tap')}>
        {content}
      </a>
    )
  return (
    <button type={type} className={cls} onClick={handle} disabled={disabled}>
      {content}
    </button>
  )
}

/** Sound ON/OFF + volume */
export function SoundControl() {
  const [st, setSt] = useState({ muted: false, volume: audio.volume, ready: false })
  const [open, setOpen] = useState(false)
  useEffect(() => audio.subscribe(setSt), [])
  return (
    <div className="flex items-center gap-2">
      <AnimatePresence>
        {open && (
          <motion.input
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'calc(var(--u)*22)' }}
            exit={{ opacity: 0, width: 0 }}
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={st.muted ? 0 : st.volume}
            onChange={(e) => audio.setVolume(parseFloat(e.target.value))}
            aria-label="Volume"
            className="accent-[#E87524] h-1"
          />
        )}
      </AnimatePresence>
      <button
        onClick={() => {
          audio.toggleMute()
        }}
        onDoubleClick={() => setOpen((o) => !o)}
        onContextMenu={(e) => {
          e.preventDefault()
          setOpen((o) => !o)
        }}
        className="flex items-center gap-1.5 rounded-full border border-gold/50 bg-black/55 backdrop-blur px-3 py-1.5 text-champagne fs-xs font-display tracking-[0.18em]"
        aria-label={st.muted ? 'Sound off. Tap to turn sound on' : 'Sound on. Tap to turn sound off'}
      >
        {st.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        <span>{st.muted ? 'SOUND OFF' : 'SOUND ON'}</span>
      </button>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full border border-gold/40 bg-black/55 backdrop-blur w-7 h-7 flex items-center justify-center text-gold"
        aria-label="Volume slider"
      >
        <span className="block w-3 h-3 rounded-full" style={{ background: `conic-gradient(#C9A24A ${st.muted ? 0 : st.volume * 360}deg, #3a2a10 0)` }} />
      </button>
    </div>
  )
}

/** Top HUD: chapter label, progress, sound */
export function Hud() {
  const { stage } = useStory()
  if (stage === 'intro') {
    return (
      <div className="absolute top-0 inset-x-0 z-50 flex justify-end p-3" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <SoundControl />
      </div>
    )
  }
  const idx = CHAPTERS.findIndex((c) => c.id === stage)
  const dots = [...CHAPTERS.map((c) => c.id), 'rsvp', 'invite']
  const cur = dots.indexOf(stage)
  return (
    <div className="absolute top-0 inset-x-0 z-50 pointer-events-none" style={{ paddingTop: 'max(10px, env(safe-area-inset-top))' }}>
      <div className="flex gap-1 px-3">
        {dots.map((d, i) => (
          <div key={d} className="h-[3px] flex-1 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold to-ember transition-all duration-700" style={{ width: i < cur ? '100%' : i === cur ? '55%' : '0%' }} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-3 pt-2 pointer-events-auto">
        <div className="font-display fs-xs tracking-[0.25em] text-gold/80">{idx >= 0 ? `CHAPTER ${CHAPTERS[idx].n}` : stage === 'rsvp' ? 'RSVP' : 'A PERSONAL INVITATION'}</div>
        <SoundControl />
      </div>
    </div>
  )
}

/** Full-screen cinematic chapter title card */
export function ChapterTitle({ n, title, onDone, ms = 3200 }) {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false)
      onDone && onDone()
    }, ms)
    return () => clearTimeout(t)
  }, [ms]) // eslint-disable-line
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 z-[45] flex flex-col items-center justify-center bg-black/80 text-center px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          onClick={() => {
            setShow(false)
            onDone && onDone()
          }}
        >
          <CText by="letter" className="font-display fs-sm tracking-[0.5em] text-ember glow-text" step={90}>{`CHAPTER ${n}`}</CText>
          <div className="w-16 h-px bg-gold/70 my-4 origin-center" style={{ animation: 'rise 1.2s 0.5s both' }} />
          <CText by="word" delay={600} className="font-display fs-xl gold-text leading-tight" step={260}>
            {title}
          </CText>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Next/continue button anchored to the bottom */
export function ContinueBar({ show, onClick, label = 'CONTINUE THE STORY' }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-x-0 bottom-0 z-40 flex justify-center"
          style={{ paddingBottom: 'max(22px, env(safe-area-inset-bottom))' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <button className="gold-btn fs-xs" onClick={() => { audio.sfx('tap'); onClick() }}>
            {label} ›
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Gold flash used between chapters */
export function GoldFlash({ k }) {
  return (
    <motion.div
      key={k}
      className="absolute inset-0 z-[60] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.5, times: [0, 0.35, 0.55, 1], ease: 'easeInOut' }}
      style={{ background: 'radial-gradient(circle at 50% 55%, #fff1c2 0%, #E8A93A 28%, #7a3a10 62%, #090909 100%)' }}
    />
  )
}
