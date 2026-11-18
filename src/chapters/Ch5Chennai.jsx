import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Armchair, DoorOpen, GraduationCap, Gem, Scissors, BedDouble, Store } from 'lucide-react'
import GoldDust from '../components/GoldDust'
import Confetti from '../components/Confetti'
import { Logo, Photo, PlaceholderArt } from '../components/Media'
import { Divider, GoldFrame } from '../components/Ornaments'
import { ChapterTitle, ContinueBar, CText } from '../components/UI'
import { audio } from '../lib/audio'
import { asset } from '../lib/assets'
import { useTimers } from '../lib/hooks'
import { useStory } from '../story'
import { BRAND } from '../config/site'

/* ───────── stylised landmark vignettes (illustrations, not photographs) ───────── */
const SKY = <rect width="200" height="140" fill="url(#skyg)" />
function Art({ id }) {
  const common = { viewBox: '0 0 200 140', className: 'w-full h-full' }
  const defs = (
    <defs>
      <linearGradient id="skyg" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#2a0c18" />
        <stop offset="0.55" stopColor="#8a3a18" />
        <stop offset="1" stopColor="#e8a24a" />
      </linearGradient>
    </defs>
  )
  const ink = '#0d0707'
  switch (id) {
    case 'central':
      return (
        <svg {...common}>{defs}{SKY}
          <rect x="20" y="82" width="160" height="40" fill="#5a1c14" />
          <rect x="84" y="30" width="32" height="92" fill="#7a2a1c" />
          <path d="M84 30 L100 12 L116 30Z" fill="#3a0f0c" />
          <circle cx="100" cy="46" r="9" fill="#f6e2a0" stroke="#3a0f0c" strokeWidth="2" />
          <path d="M100 46 V40 M100 46 H105" stroke="#3a0f0c" strokeWidth="1.5" />
          {[30, 48, 66, 124, 142, 160].map((x) => <rect key={x} x={x} y="92" width="8" height="18" rx="4" fill="#f6c25a" opacity="0.85" />)}
          <rect x="0" y="122" width="200" height="18" fill={ink} />
        </svg>
      )
    case 'marina':
      return (
        <svg {...common}>{defs}{SKY}
          <circle cx="100" cy="76" r="26" fill="#ffd58a" opacity="0.95" />
          <rect x="0" y="76" width="200" height="30" fill="#7a3a1c" opacity="0.7" />
          {[84, 92, 100, 108].map((y, i) => <path key={y} d={`M0 ${y} q25 -7 50 0 t50 0 t50 0 t50 0`} stroke="#ffe2a8" strokeOpacity={0.7 - i * 0.12} fill="none" strokeWidth="1.6" />)}
          <path d="M0 112 Q100 100 200 112 V140 H0Z" fill="#c9a24a" opacity="0.8" />
        </svg>
      )
    case 'lighthouse':
      return (
        <svg {...common}>{defs}{SKY}
          <path d="M88 124 L94 34 H106 L112 124Z" fill="#f4e6bb" />
          {[48, 74, 100].map((y) => <path key={y} d={`M${92 - (y - 34) * 0.06} ${y} H${108 + (y - 34) * 0.06} v14 H${92 - (y - 34) * 0.06}Z`} fill="#c8102e" />)}
          <rect x="90" y="24" width="20" height="10" fill="#ffd58a" />
          <path d="M100 29 L190 6 V52Z" fill="#ffe9a8" opacity="0.35" />
          <path d="M92 24 L100 12 L108 24Z" fill="#3a0f0c" />
          <rect x="0" y="124" width="200" height="16" fill={ink} />
        </svg>
      )
    case 'napier':
      return (
        <svg {...common}>{defs}{SKY}
          <rect x="0" y="84" width="200" height="8" fill="#2a1410" />
          {[10, 50, 90, 130, 170].map((x) => <path key={x} d={`M${x - 20} 124 Q${x} 78 ${x + 20} 124`} stroke="#5a2a1c" strokeWidth="8" fill="none" />)}
          <rect x="0" y="116" width="200" height="24" fill="#3a1a20" opacity="0.85" />
          {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={20 + i * 30} y="76" width="2" height="8" fill="#ffd58a" />)}
        </svg>
      )
    case 'annasalai':
      return (
        <svg {...common}>{defs}{SKY}
          <path d="M70 140 L96 70 H104 L130 140Z" fill="#241014" />
          <path d="M100 138 V76" stroke="#ffd58a" strokeWidth="2" strokeDasharray="6 6" />
          {[[8, 40, 54], [34, 24, 70], [60, 36, 60]].map(([x, w, h], i) => <rect key={i} x={x} y={130 - h - 20} width={w} height={h + 20} fill="#1a0c10" />)}
          {[[140, 44, 80], [166, 30, 56]].map(([x, w, h], i) => <rect key={i} x={x} y={130 - h - 20} width={w} height={h + 20} fill="#1a0c10" />)}
          {Array.from({ length: 18 }, (_, i) => <rect key={i} x={12 + (i % 6) * 5 + (i > 11 ? 130 : i > 5 ? 28 : 0)} y={50 + Math.floor(i / 6) * 22} width="3" height="5" fill="#f6c25a" />)}
        </svg>
      )
    case 'anna':
      return (
        <svg {...common}>{defs}{SKY}
          <rect x="30" y="112" width="140" height="12" fill="#e8d5a3" />
          <rect x="50" y="64" width="100" height="48" fill="#f4e6bb" />
          {[56, 76, 96, 116, 136].map((x) => <rect key={x} x={x} y="70" width="8" height="42" fill="#c9a24a" opacity="0.65" />)}
          <path d="M44 64 H156 L100 38Z" fill="#e8d5a3" />
          <path d="M100 38 q-6 -10 0 -18 q6 8 0 18" fill="#ffb03a" />
          <rect x="0" y="124" width="200" height="16" fill={ink} />
        </svg>
      )
    case 'mgr':
      return (
        <svg {...common}>{defs}{SKY}
          <path d="M40 112 Q70 30 100 70 Q130 30 160 112Z" fill="#f4e6bb" />
          <path d="M60 112 Q76 60 100 82 Q124 60 140 112Z" fill="#c9a24a" opacity="0.7" />
          <path d="M100 70 V112" stroke="#8a6a22" />
          <rect x="30" y="112" width="140" height="10" fill="#e8d5a3" />
          <rect x="0" y="122" width="200" height="18" fill={ink} />
        </svg>
      )
    default:
      return (
        <svg {...common}>{defs}{SKY}
          {[[6, 30, 78], [34, 24, 58], [58, 28, 96], [88, 22, 70], [112, 30, 110], [144, 24, 64], [170, 26, 88]].map(([x, w, h], i) => (
            <g key={i}>
              <rect x={x} y={124 - h} width={w} height={h} fill="#1a0c10" />
              {Array.from({ length: Math.floor(h / 12) }, (_, k) => <rect key={k} x={x + 4 + (k % 2) * 9} y={124 - h + 6 + k * 12} width="4" height="5" fill="#f6c25a" opacity="0.8" />)}
            </g>
          ))}
          <rect x="0" y="124" width="200" height="16" fill={ink} />
        </svg>
      )
  }
}

const LANDMARKS = [
  { id: 'central', name: 'CHENNAI CENTRAL', sub: 'Railway Station' },
  { id: 'marina', name: 'MARINA BEACH', sub: 'The golden shoreline' },
  { id: 'lighthouse', name: 'CHENNAI LIGHTHOUSE', sub: 'Beacon of the coast' },
  { id: 'napier', name: 'NAPIER BRIDGE', sub: 'Over the Cooum' },
  { id: 'annasalai', name: 'ANNA SALAI', sub: 'The city’s great avenue' },
  { id: 'anna', name: 'ANNA MEMORIAL', sub: '' },
  { id: 'mgr', name: 'MGR MEMORIAL', sub: '' },
  { id: 'sky', name: 'CHENNAI SKYLINE', sub: 'A city of new beginnings' },
]

const ROOMS = [
  { k: 'chennai/entrance', icon: DoorOpen, label: 'PREMIUM ENTRANCE' },
  { k: 'chennai/interior', icon: Gem, label: 'LUXURIOUS INTERIOR' },
  { k: 'chennai/signage', icon: Store, label: 'BRAND SIGNAGE' },
  { k: 'chennai/reception', icon: Armchair, label: 'RECEPTION AREA' },
  { k: 'chennai/treatment-1', icon: BedDouble, label: 'PMU TREATMENT ROOMS' },
  { k: 'chennai/academy-1', icon: GraduationCap, label: 'ACADEMY TRAINING SPACE' },
]

export function Ribbon({ className = '' }) {
  return (
    <svg viewBox="0 0 360 80" className={className} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="rb" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ff9a3c" />
          <stop offset="0.5" stopColor="#e87524" />
          <stop offset="1" stopColor="#b84a10" />
        </linearGradient>
      </defs>
      <path d="M0 18 Q90 8 180 18 T360 18 V62 Q270 72 180 62 T0 62Z" fill="url(#rb)" />
      <path d="M0 22 Q90 12 180 22 T360 22" stroke="#ffd9a0" strokeOpacity="0.6" fill="none" />
    </svg>
  )
}

export default function Ch5Chennai() {
  const { next } = useStory()
  const after = useTimers()
  const [ready, setReady] = useState(false)
  const [step, setStep] = useState('aerial') // aerial | building | tour | ribbon | celebrate | map
  const [li, setLi] = useState(0)
  const [cut, setCut] = useState(false)
  const [confetti, setConfetti] = useState(0)
  const [done, setDone] = useState(false)
  const [room, setRoom] = useState(0)
  const scroller = useRef(null)
  const ribbonPhoto = asset('shruthi-photos/ribbon-cutting')

  useEffect(() => {
    if (!ready) return
    audio.sfx('whoosh')
  }, [ready])

  useEffect(() => {
    if (!ready || step !== 'aerial') return
    const t = setInterval(() => {
      setLi((v) => {
        if (v >= LANDMARKS.length - 1) {
          clearInterval(t)
          setStep('building')
          audio.sfx('whoosh')
          return v
        }
        audio.sfx('sparkle')
        return v + 1
      })
    }, 2100)
    return () => clearInterval(t)
  }, [ready, step])

  const doCut = () => {
    if (cut) return
    setCut(true)
    navigator.vibrate && navigator.vibrate([20, 40, 60])
    audio.sfx('scissor')
    after(900, () => {
      audio.sfx('celebrate')
      audio.playMusic('celebration', { level: 0.9, fade: 2.5 })
      setConfetti(1)
      setStep('celebrate')
    })
    after(5200, () => setStep('map'))
    after(9500, () => setDone(true))
  }

  const onTourScroll = (e) => {
    const el = e.currentTarget
    setRoom(Math.round(el.scrollLeft / (el.clientWidth * 0.78)))
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      {/* ───── aerial drone sequence ───── */}
      <AnimatePresence>
        {ready && step === 'aerial' && (
          <motion.div key="aerial" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8 } }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#1a0a14 0%,#5a2418 45%,#e8883a 100%)' }} />
            <motion.div className="absolute inset-x-0 bottom-0 h-[46%] flex" initial={{ x: 0 }} animate={{ x: '-50%' }} transition={{ duration: 18, ease: 'linear' }} style={{ width: '200%' }}>
              {[0, 1].map((k) => (
                <svg key={k} viewBox="0 0 400 160" preserveAspectRatio="none" className="w-1/2 h-full">
                  {Array.from({ length: 22 }, (_, i) => {
                    const h = 40 + ((i * 53) % 90)
                    return <rect key={i} x={i * 18} y={160 - h} width="15" height={h} fill={i % 3 ? '#1a0c10' : '#2a1018'} />
                  })}
                </svg>
              ))}
            </motion.div>
            <GoldDust count={34} mode="float" />
            <div className="absolute top-[13%] inset-x-0 text-center">
              <div className="font-display fs-xs tracking-[0.5em] text-ember">DRONE VIEW</div>
              <CText by="letter" step={100} className="font-display fs-2xl gold-text mt-1 tracking-[0.15em]">
                CHENNAI
              </CText>
              <div className="font-sans fs-xs text-champagne/60 tracking-[0.3em] mt-1">13.08°N · 80.27°E</div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={li} className="absolute inset-x-6 top-[30%]" initial={{ opacity: 0, scale: 1.12, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.8 }}>
                <GoldFrame inset={2} rounded={14}>
                  <div className="aspect-[10/7] m-3 rounded-lg overflow-hidden border border-gold/40">
                    <Art id={LANDMARKS[li].id} />
                  </div>
                </GoldFrame>
                <div className="text-center mt-4">
                  <div className="font-display fs-md tracking-[0.25em] text-champagne glow-text">{LANDMARKS[li].name}</div>
                  {LANDMARKS[li].sub && <div className="font-serif italic fs-md text-champagne/70">{LANDMARKS[li].sub}</div>}
                </div>
              </motion.div>
            </AnimatePresence>
            <button className="absolute bottom-6 inset-x-0 text-center font-sans fs-xs tracking-[0.3em] text-champagne/50 underline underline-offset-4" onClick={() => { setStep('building'); audio.sfx('whoosh') }}>
              SKIP ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───── building reveal ───── */}
      <AnimatePresence>
        {step === 'building' && <BuildingReveal key="b" onNext={() => { setStep('tour'); audio.sfx('whoosh') }} />}
      </AnimatePresence>

      {/* ───── interior tour ───── */}
      <AnimatePresence>
        {step === 'tour' && (
          <motion.div key="tour" className="absolute inset-0 pt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }} style={{ background: 'radial-gradient(90% 55% at 50% 30%, rgba(232,117,36,.2), transparent), #090909' }}>
            <GoldDust count={30} mode="float" />
            <div className="text-center mt-4">
              <div className="font-display fs-xs tracking-[0.45em] text-ember">STEP INSIDE</div>
              <CText by="word" step={300} className="font-display fs-xl gold-text mt-1">THE NEW KINGDOM</CText>
            </div>
            <div ref={scroller} onScroll={onTourScroll} className="absolute inset-x-0 top-[24%] bottom-[22%] flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none px-[11%]">
              {ROOMS.map((r, i) => (
                <div key={r.k} className="snap-center shrink-0 w-[78%] h-full">
                  <GoldFrame className="w-full h-full" inset={2} rounded={16}>
                    <div className="absolute inset-3 rounded-xl overflow-hidden">
                      <Photo k={r.k} alt={r.label} fallback={<PlaceholderArt icon={r.icon} label={r.label} hint={`add /assets/${r.k}.webp`} />} />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-center bg-gradient-to-t from-black/85 to-transparent">
                        <span className="font-display fs-xs tracking-[0.22em] text-champagne">{r.label}</span>
                      </div>
                    </div>
                  </GoldFrame>
                </div>
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-[16%] flex justify-center gap-1.5">
              {ROOMS.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === room ? 'w-6 bg-ember' : 'w-1.5 bg-gold/40'}`} />)}
            </div>
            <div className="absolute inset-x-0 bottom-0 flex justify-center" style={{ paddingBottom: 'max(22px, env(safe-area-inset-bottom))' }}>
              <button className="gold-btn fs-xs" onClick={() => { audio.sfx('tap'); setStep('ribbon') }}>
                TO THE GRAND OPENING ›
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───── ribbon cutting ───── */}
      {(step === 'ribbon' || step === 'celebrate' || step === 'map') && (
        <motion.div className="absolute inset-0 bg-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          {/* celebration photograph (supplied) sits under the ribbon and is revealed when it is cut */}
          {ribbonPhoto && (
            <motion.img src={ribbonPhoto} alt="Grand opening celebration" draggable="false" className="absolute inset-0 w-full h-full object-cover" initial={{ opacity: 0.0, scale: 1.12 }} animate={{ opacity: cut ? 1 : 0.28, scale: cut ? 1 : 1.12 }} transition={{ duration: cut ? 3 : 1.6 }} style={{ filter: cut ? 'none' : 'blur(3px) brightness(.7)' }} />
          )}
          {!ribbonPhoto && <div className="absolute inset-0" style={{ background: 'radial-gradient(80% 60% at 50% 45%, rgba(232,117,36,.3), #090909)' }} />}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,.55),transparent 28%,transparent 55%,rgba(0,0,0,.85))' }} />

          {step === 'ribbon' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="absolute top-[16%] inset-x-0 text-center px-6">
                <div className="font-display fs-xs tracking-[0.4em] text-ember">THE MOMENT HAS COME</div>
                <div className="font-serif italic fs-lg text-champagne mt-2">Cut the ribbon. Open the doors.</div>
              </div>
              <div className="relative w-full" style={{ height: 'calc(var(--u)*22)' }}>
                {/* left & right halves */}
                <motion.div className="absolute inset-0 origin-left" style={{ clipPath: 'inset(0 50% 0 0)' }} animate={cut ? { rotate: 24, y: 120, opacity: 0 } : { rotate: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: 'easeIn' }}>
                  <Ribbon className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,.6)]" />
                </motion.div>
                <motion.div className="absolute inset-0 origin-right" style={{ clipPath: 'inset(0 0 0 50%)' }} animate={cut ? { rotate: -24, y: 120, opacity: 0 } : { rotate: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: 'easeIn' }}>
                  <Ribbon className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,.6)]" />
                </motion.div>
                {!cut && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[26%] opacity-90"><Logo variant="emblem" /></div>
                  </div>
                )}
                <motion.div className="absolute top-1/2 text-champagne" style={{ marginTop: 'calc(var(--u)*-6)' }} initial={{ left: '-12%' }} animate={{ left: cut ? '50%' : '-12%', rotate: cut ? [0, -18, 0, -18, 0] : 0 }} transition={{ left: { duration: 0.7 }, rotate: { duration: 0.8, delay: 0.5 } }}>
                  <Scissors strokeWidth={1.4} className="drop-shadow-[0_0_14px_#E87524]" style={{ width: 'calc(var(--u)*12)', height: 'calc(var(--u)*12)', transform: 'translateX(-50%) rotate(-90deg)' }} />
                </motion.div>
              </div>
              <div className="absolute bottom-[14%] inset-x-0 flex justify-center">
                <button className="gold-btn solid fs-sm" onClick={doCut} disabled={cut}>
                  <Scissors size={18} /> CUT THE RIBBON
                </button>
              </div>
            </div>
          )}

          {(step === 'celebrate' || step === 'map') && (
            <>
              <GoldDust count={60} mode="rise" color="255,210,120" />
              <AnimatePresence mode="wait">
                {step === 'celebrate' && (
                  <motion.div key="cel" className="absolute inset-x-0 bottom-[12%] text-center px-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8 } }}>
                    <CText by="word" step={300} delay={700} className="font-display fs-xl gold-text leading-tight glow-text">
                      NOW EXPANDING TO CHENNAI
                    </CText>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1.2 }} className="font-serif italic fs-lg text-champagne mt-3">
                      OUR SECOND BRANCH. A NEW MILESTONE.
                    </motion.div>
                  </motion.div>
                )}
                {step === 'map' && <MapPin key="map" />}
              </AnimatePresence>
            </>
          )}
          {confetti > 0 && <Confetti runKey={confetti} duration={7000} />}
        </motion.div>
      )}

      <ChapterTitle n="05" title="THE CHENNAI EXPANSION" onDone={() => setReady(true)} />
      <ContinueBar show={done} onClick={() => next()} label="THE PERSONAL INVITATION" />
    </div>
  )
}

function BuildingReveal({ onNext }) {
  const after = useTimers()
  const [lit, setLit] = useState(false)
  useEffect(() => {
    after(1800, () => { setLit(true); audio.sfx('chime') })
    after(7200, onNext)
  }, []) // eslint-disable-line
  return (
    <motion.div className="absolute inset-0 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8 } }} transition={{ duration: 1 }} style={{ background: 'linear-gradient(180deg,#14080f 0%,#4a1a1a 60%,#c9742a 100%)' }}>
      <motion.div className="absolute inset-0" initial={{ scale: 1.4, y: '10%' }} animate={{ scale: 1, y: 0 }} transition={{ duration: 6, ease: 'easeOut' }}>
        <svg viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
          <rect x="0" y="560" width="360" height="80" fill="#0a0606" />
          {[[0, 70, 300], [286, 74, 360]].map(([x, w, h], i) => (
            <rect key={i} x={x} y={560 - h} width={w} height={h} fill="#1a0c10" />
          ))}
          <rect x="40" y="170" width="280" height="390" fill="#1b1114" stroke="#c9a24a" strokeOpacity="0.5" />
          {Array.from({ length: 5 }, (_, r) =>
            Array.from({ length: 6 }, (_, c) => (
              <rect key={`${r}-${c}`} x={58 + c * 44} y={196 + r * 34} width="30" height="22" fill={lit ? '#ffd58a' : '#2a1a18'} opacity={lit ? 0.85 : 1} style={{ transition: `fill 1.2s ${(r + c) * 0.12}s, opacity 1s` }} />
            )),
          )}
          <rect x="40" y="376" width="280" height="184" fill="#0f0a0b" />
          <rect x="120" y="410" width="120" height="150" fill={lit ? '#ffcf7a' : '#1a1210'} style={{ transition: 'fill 1.6s 1s' }} />
          <rect x="120" y="410" width="120" height="150" fill="none" stroke="#c9a24a" strokeWidth="3" />
          <path d="M180 410 V560" stroke="#c9a24a" strokeWidth="2" />
          <rect x="30" y="388" width="300" height="10" fill="#c9a24a" />
        </svg>
      </motion.div>
      {/* signage */}
      <motion.div className="absolute inset-x-[7%] top-[24%] rounded-md border border-gold/70 bg-black/80 backdrop-blur-sm text-center px-3 py-4" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1.4 }} style={{ boxShadow: lit ? '0 0 50px rgba(232,117,36,.65), inset 0 0 30px rgba(232,117,36,.18)' : 'none', transition: 'box-shadow 1.4s' }}>
        <Logo variant="emblem" className="mx-auto" style={{ width: 'calc(var(--u)*18)' }} />
        <div className="font-display gold-text fs-lg tracking-[0.1em] mt-2 leading-none">{BRAND.name}</div>
        <div className="font-display fs-xs tracking-[0.2em] text-champagne mt-1.5">{BRAND.line2}</div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="h-px w-8 bg-gold" />
          <span className="font-display fs-xs tracking-[0.5em] text-ember">{BRAND.city}</span>
          <span className="h-px w-8 bg-gold" />
        </div>
      </motion.div>
      <div className="absolute inset-x-0 bottom-[8%] text-center">
        <CText by="word" step={300} delay={2400} className="font-serif italic fs-lg text-champagne glow-text">
          A new address for beauty.
        </CText>
      </div>
      <button className="absolute bottom-4 inset-x-0 text-center font-sans fs-xs tracking-[0.3em] text-champagne/50 underline underline-offset-4" onClick={onNext}>
        SKIP ›
      </button>
    </motion.div>
  )
}

function MapPin() {
  return (
    <motion.div className="absolute inset-x-5 bottom-[9%]" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
      <div className="rounded-3xl border border-gold/70 bg-black/75 backdrop-blur-md p-4 text-center" style={{ boxShadow: '0 0 40px rgba(232,117,36,.3)' }}>
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full">
            {Array.from({ length: 11 }, (_, r) => Array.from({ length: 20 }, (_, c) => <circle key={`${r}${c}`} cx={10 + c * 16} cy={10 + r * 16} r="1.1" fill="#c9a24a" opacity="0.28" />))}
            <path d="M92 128 Q170 20 252 52" stroke="#E87524" strokeWidth="2" strokeDasharray="5 6" fill="none">
              <animate attributeName="stroke-dashoffset" from="0" to="-44" dur="2s" repeatCount="indefinite" />
            </path>
            <circle cx="92" cy="128" r="5" fill="#E8D5A3" />
            <text x="92" y="150" textAnchor="middle" fill="#E8D5A3" fontSize="10" fontFamily="Cinzel" letterSpacing="2">COIMBATORE</text>
          </svg>
          <div className="absolute" style={{ left: `${(252 / 320) * 100}%`, top: `${(52 / 180) * 100}%`, transform: 'translate(-50%,-50%)' }}>
            <span className="absolute inset-0 -m-3 rounded-full border-2 border-ember" style={{ animation: 'pinPulse 1.8s ease-out infinite' }} />
            <span className="absolute inset-0 -m-3 rounded-full border-2 border-ember" style={{ animation: 'pinPulse 1.8s ease-out .9s infinite' }} />
            <span className="relative block w-3.5 h-3.5 rounded-full bg-ember shadow-[0_0_18px_#E87524]" />
          </div>
          <div className="absolute font-display tracking-[0.3em] text-ember glow-text fs-xs" style={{ left: `${(252 / 320) * 100}%`, top: `${(52 / 180) * 100 - 14}%`, transform: 'translateX(-50%)' }}>
            CHENNAI
          </div>
        </div>
        <Divider className="my-3" />
        <div className="font-display fs-sm tracking-[0.2em] text-champagne">COIMBATORE · OUR HOME</div>
        <div className="font-display fs-md gold-text tracking-[0.2em] mt-1">CHENNAI · SECOND BRANCH</div>
      </div>
    </motion.div>
  )
}
