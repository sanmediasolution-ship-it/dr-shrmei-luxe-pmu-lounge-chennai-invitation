import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Brush, Cpu, Smile, Users, Sparkles, Gem, ScanFace, ChevronsLeftRight } from 'lucide-react'
import { Photo, PlaceholderArt } from '../components/Media'
import GoldDust from '../components/GoldDust'
import { ChapterTitle, ContinueBar, CText } from '../components/UI'
import { GoldFrame, Divider } from '../components/Ornaments'
import { audio } from '../lib/audio'
import { asset } from '../lib/assets'
import { useStory } from '../story'

const BEATS = [
  { k: 'shruthi-photos/portrait', icon: Brush, cap: 'The artist behind the art.', label: 'DR. M. SHRUTHI KEERTHANA' },
  { k: 'studio/microblading', icon: Brush, cap: 'Precision, stroke by stroke.', label: 'MICROBLADING ARTISTRY' },
  { k: 'studio/pmu-machine', icon: Cpu, cap: 'Professional PMU, mastered.', label: 'PMU MACHINE' },
  { k: 'transform', icon: ScanFace, cap: 'A brow transformation.', label: 'BEFORE & AFTER' },
  { k: 'studio/client-mirror', icon: Smile, cap: 'Smiles in the mirror.', label: 'HAPPY CLIENTS' },
  { k: 'studio/team', icon: Users, cap: 'A team that creates together.', label: 'THE TEAM' },
  { k: 'studio/atmosphere', icon: Gem, cap: 'A studio made to feel like luxury.', label: 'PREMIUM STUDIO' },
]

const CARDS = [
  { n: '01', t: 'ARTISTRY', d: 'Every stroke drawn with a dentist’s precision.' },
  { n: '02', t: 'TRUST', d: 'Careful hands. Confidence-first care.' },
  { n: '03', t: 'EMPIRE', d: 'From one studio to a growing family of studios.' },
]

/** Before / after slider (real photos if supplied, tasteful illustration otherwise) */
function BeforeAfter() {
  const [x, setX] = useState(50)
  const ref = useRef(null)
  const drag = useRef(false)
  const move = useCallback((e) => {
    const r = ref.current.getBoundingClientRect()
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left
    setX(Math.max(4, Math.min(96, (cx / r.width) * 100)))
  }, [])
  const before = asset('studio/before')
  const after = asset('studio/after')
  const Brow = ({ full }) => (
    <svg viewBox="0 0 300 180" className="absolute inset-0 w-full h-full">
      <rect width="300" height="180" fill="#2a1410" />
      <ellipse cx="150" cy="150" rx="120" ry="70" fill="#d9a07a" opacity="0.35" />
      <path d="M40 100 Q110 40 260 84" stroke="#2b140c" strokeWidth={full ? 20 : 5} strokeLinecap="round" fill="none" opacity={full ? 0.95 : 0.5} strokeDasharray={full ? '0' : '3 14'} />
      {full && <path d="M44 98 Q110 48 252 84" stroke="#4a2415" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" />}
    </svg>
  )
  return (
    <div
      ref={ref}
      className="relative w-full h-full overflow-hidden select-none touch-none"
      onPointerDown={(e) => {
        drag.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        move(e)
      }}
      onPointerMove={(e) => drag.current && move(e)}
      onPointerUp={() => (drag.current = false)}
    >
      <div className="absolute inset-0">{after ? <img src={after} alt="After" className="w-full h-full object-cover" /> : <Brow full />}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}>
        {before ? <img src={before} alt="Before" className="w-full h-full object-cover" /> : <Brow />}
      </div>
      <div className="absolute top-0 bottom-0 w-px bg-gold shadow-[0_0_14px_#E87524]" style={{ left: `${x}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-black/80 border border-gold flex items-center justify-center text-gold">
          <ChevronsLeftRight size={18} />
        </div>
      </div>
      <span className="absolute left-3 bottom-3 font-display fs-xs tracking-[0.2em] text-champagne bg-black/60 px-2 py-1 rounded">BEFORE</span>
      <span className="absolute right-3 bottom-3 font-display fs-xs tracking-[0.2em] text-champagne bg-black/60 px-2 py-1 rounded">AFTER</span>
    </div>
  )
}

export default function Ch3Empire() {
  const { next } = useStory()
  const [ready, setReady] = useState(false)
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState('reel') // reel | cards
  const [shown, setShown] = useState([])
  const [paused, setPaused] = useState(false)
  const DUR = 3800

  useEffect(() => {
    if (!ready || phase !== 'reel' || paused) return
    const t = setTimeout(() => {
      if (i >= BEATS.length - 1) {
        audio.sfx('whoosh')
        setPhase('cards')
      } else {
        setI((v) => v + 1)
        audio.sfx('sparkle')
      }
    }, DUR)
    return () => clearTimeout(t)
  }, [i, ready, phase, paused])

  const cardTap = (n) => {
    if (shown.includes(n)) return
    audio.sfx('chime')
    setShown((s) => [...s, n])
  }
  const allShown = shown.length === CARDS.length

  const b = BEATS[i]
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 60% at 50% 30%, rgba(232,117,36,.22), transparent 70%), linear-gradient(180deg,#14090b,#090909)' }} />
      <GoldDust count={40} mode="float" />

      {phase === 'reel' && ready && (
        <div className="absolute inset-0 pt-16">
          {/* story-style progress */}
          <div className="absolute top-14 inset-x-4 flex gap-1 z-30">
            {BEATS.map((_, k) => (
              <div key={k} className="h-[2px] flex-1 bg-white/20 rounded overflow-hidden">
                <div key={k === i ? `${i}-${paused}` : k} className="h-full bg-champagne" style={{ width: k < i ? '100%' : '0%', animation: k === i && !paused ? `fillbar ${DUR}ms linear forwards` : undefined }} />
              </div>
            ))}
          </div>
          <style>{`@keyframes fillbar{from{width:0}to{width:100%}}`}</style>
          <AnimatePresence mode="wait">
            <motion.div key={i} className="absolute inset-x-4 top-[11%] bottom-[22%]" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.9 }}>
              <GoldFrame className="w-full h-full" inset={4} rounded={16}>
                <div className="absolute inset-[14px] rounded-xl overflow-hidden bg-black" onClick={() => setPaused((p) => !p)}>
                  {b.k === 'transform' ? (
                    <BeforeAfter />
                  ) : (
                    <div className="w-full h-full" style={{ animation: 'kenburns 6s ease-out forwards' }}>
                      <Photo k={b.k} alt={b.label} fallback={<PlaceholderArt icon={b.icon} label={b.label} hint={`add /assets/${b.k}.webp`} />} />
                    </div>
                  )}
                </div>
              </GoldFrame>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div key={`c${i}`} className="absolute inset-x-0 bottom-[11%] text-center px-6" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              <div className="font-display fs-xs tracking-[0.35em] text-ember mb-2">{b.label}</div>
              <div className="font-serif italic fs-lg text-champagne">{b.cap}</div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-3 flex justify-center">
            <button className="font-sans fs-xs tracking-[0.3em] text-champagne/50 underline-offset-4 underline" onClick={() => { setPhase('cards'); audio.sfx('whoosh') }}>
              SKIP ›
            </button>
          </div>
          {/* tap zones */}
          <button aria-label="Previous" className="absolute left-0 top-[12%] bottom-[24%] w-[18%] z-20" onClick={() => setI((v) => Math.max(0, v - 1))} />
          <button aria-label="Next" className="absolute right-0 top-[12%] bottom-[24%] w-[18%] z-20" onClick={() => (i >= BEATS.length - 1 ? setPhase('cards') : setI((v) => v + 1))} />
        </div>
      )}

      {phase === 'cards' && (
        <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-5 pt-14" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
          <CText by="word" step={380} className="font-display fs-xl gold-text text-center leading-tight">
            CREATING BEAUTY.
          </CText>
          <CText by="word" step={380} delay={900} className="font-display fs-xl gold-text text-center leading-tight">
            BUILDING CONFIDENCE.
          </CText>
          <Divider className="my-5" />
          <div className="w-full flex flex-col gap-3">
            {CARDS.map((c, k) => (
              <motion.button key={c.n} onClick={() => cardTap(c.n)} className="relative w-full text-left rounded-2xl border border-gold/70 overflow-hidden px-4 py-3.5" style={{ background: 'linear-gradient(135deg, rgba(75,20,40,.9), rgba(12,8,8,.92))', boxShadow: '0 0 26px rgba(232,117,36,.18), inset 0 0 20px rgba(201,162,74,.1)' }} initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.2 + k * 0.5, type: 'spring', stiffness: 90, damping: 14 }}>
                <div className="flex items-center gap-4">
                  <div className="font-display gold-text fs-2xl leading-none">{c.n}</div>
                  <div className="flex-1">
                    <div className="font-display fs-md tracking-[0.28em] text-champagne">{c.t}</div>
                    <AnimatePresence>
                      {shown.includes(c.n) ? (
                        <motion.div key="d" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="font-serif italic fs-md text-champagne/80 overflow-hidden">
                          {c.d}
                        </motion.div>
                      ) : (
                        <div className="font-sans fs-xs tracking-[0.25em] text-ember hint-glow mt-0.5">TAP TO REVEAL</div>
                      )}
                    </AnimatePresence>
                  </div>
                  <Sparkles className="text-gold" size={20} />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <ChapterTitle n="03" title="THE BIRTH OF HER EMPIRE" onDone={() => setReady(true)} />
      <ContinueBar show={phase === 'cards' && allShown} onClick={() => next()} />
      {phase === 'cards' && !allShown && (
        <div className="absolute inset-x-0 bottom-5 text-center font-sans fs-xs tracking-[0.3em] text-champagne/45">TAP EACH CARD</div>
      )}
    </div>
  )
}
