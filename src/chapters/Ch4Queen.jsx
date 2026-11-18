import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Hand } from 'lucide-react'
import { PalaceBackdrop } from '../components/Backdrops'
import GoldDust from '../components/GoldDust'
import { Feather, Divider } from '../components/Ornaments'
import { ChapterTitle, ContinueBar, CText } from '../components/UI'
import { audio } from '../lib/audio'
import { asset } from '../lib/assets'
import { useTimers } from '../lib/hooks'
import { useStory } from '../story'

/** Burgundy royal-gown silhouette (used for the royal walk and when no photo is supplied) */
function QueenFigure({ className = '', style }) {
  return (
    <svg viewBox="0 0 200 420" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id="gown" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#8a1c3a" />
          <stop offset="0.5" stopColor="#4b1428" />
          <stop offset="1" stopColor="#2a0a16" />
        </linearGradient>
        <pattern id="emb" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M7 1 L10 7 L7 13 L4 7Z" fill="none" stroke="#c9a24a" strokeWidth="0.7" opacity="0.7" />
        </pattern>
      </defs>
      <ellipse cx="100" cy="52" rx="19" ry="23" fill="#0c0606" />
      <path d="M78 40 Q100 8 122 40 Q132 52 124 74 L76 74 Q68 52 78 40Z" fill="#120808" />
      <path d="M92 70 h16 v18 h-16z" fill="#0c0606" />
      <path d="M62 96 Q100 82 138 96 L150 150 Q154 190 134 214 L66 214 Q46 190 50 150Z" fill="url(#gown)" />
      <path d="M62 96 Q100 82 138 96 L150 150 Q154 190 134 214 L66 214 Q46 190 50 150Z" fill="url(#emb)" />
      <path d="M66 214 Q20 300 8 410 L192 410 Q180 300 134 214Z" fill="url(#gown)" />
      <path d="M66 214 Q20 300 8 410 L192 410 Q180 300 134 214Z" fill="url(#emb)" />
      <path d="M8 410 L192 410" stroke="#c9a24a" strokeWidth="3" />
      <path d="M12 396 Q100 384 188 396" stroke="#c9a24a" strokeWidth="1.2" fill="none" opacity="0.8" />
      <path d="M72 100 Q100 150 128 100" stroke="#c9a24a" strokeWidth="2" fill="none" />
      <path d="M80 104 Q100 134 120 104" stroke="#e87524" strokeWidth="1.2" fill="none" />
      <path d="M62 96 Q40 130 54 190" stroke="#c9a24a" strokeWidth="1.5" fill="none" opacity="0.7" />
    </svg>
  )
}

function Crown({ className = '', style }) {
  return (
    <svg viewBox="0 0 200 110" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff1b8" />
          <stop offset="0.5" stopColor="#d4af55" />
          <stop offset="1" stopColor="#8a6a22" />
        </linearGradient>
      </defs>
      <path d="M12 96 L22 34 L58 66 L100 12 L142 66 L178 34 L188 96Z" fill="url(#cg)" stroke="#fff1b8" strokeWidth="2" />
      <rect x="12" y="86" width="176" height="16" rx="5" fill="url(#cg)" stroke="#fff1b8" />
      {[22, 100, 178].map((x, i) => (
        <circle key={i} cx={x} cy={i === 1 ? 14 : 34} r="7" fill="#c8102e" stroke="#fff1b8" />
      ))}
      {[48, 74, 100, 126, 152].map((x) => (
        <circle key={x} cx={x} cy="94" r="4.5" fill="#e87524" stroke="#fff1b8" strokeWidth="0.8" />
      ))}
    </svg>
  )
}

const JEWELS = [
  { o: '52% 29%', label: 'THE ROYAL CROWN', s: 3.1 },
  { o: '50% 43%', label: 'JEWELLERY FIT FOR A QUEEN', s: 3.3 },
  { o: '34% 55%', label: 'GOLD ON EVERY WRIST', s: 3.0 },
  { o: '46% 82%', label: 'BURGUNDY VELVET · GOLD EMBROIDERY', s: 2.5 },
]

export default function Ch4Queen() {
  const { next } = useStory()
  const after = useTimers()
  const royal = asset('shruthi-photos/royal')
  const [ready, setReady] = useState(false)
  const [step, setStep] = useState('walk') // walk | jewels | throne | crowned
  const [j, setJ] = useState(0)
  const [crown, setCrown] = useState(false)
  const [burst, setBurst] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!ready) return
    audio.sfx('whoosh')
    after(5200, () => {
      setStep(royal ? 'jewels' : 'throne')
      audio.sfx('sparkle')
    })
  }, [ready]) // eslint-disable-line

  useEffect(() => {
    if (step !== 'jewels') return
    const t = setInterval(() => {
      setJ((v) => {
        if (v >= JEWELS.length - 1) {
          clearInterval(t)
          setStep('throne')
          audio.sfx('whoosh')
          return v
        }
        audio.sfx('sparkle')
        return v + 1
      })
    }, 2300)
    return () => clearInterval(t)
  }, [step])

  const doCrown = () => {
    if (crown) return
    setCrown(true)
    navigator.vibrate && navigator.vibrate(40)
    audio.sfx('crown')
    after(1900, () => {
      setStep('crowned')
      setBurst((b) => b + 1)
    })
    after(7000, () => setDone(true))
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <PalaceBackdrop variant="throne" />
      <GoldDust count={60} mode="float" />

      {/* royal walk */}
      <AnimatePresence>
        {ready && step === 'walk' && (
          <motion.div key="walk" className="absolute inset-0 flex items-end justify-center" exit={{ opacity: 0, transition: { duration: 0.8 } }}>
            <motion.div className="origin-bottom" initial={{ scale: 0.34, y: -60, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ duration: 5, ease: [0.3, 0.1, 0.3, 1] }} style={{ width: '58%' }}>
              <motion.div animate={{ rotate: [-1.2, 1.2, -1.2], y: [0, -6, 0] }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '50% 100%' }}>
                <QueenFigure className="w-full drop-shadow-[0_0_30px_rgba(232,117,36,0.45)]" />
              </motion.div>
            </motion.div>
            <div className="absolute inset-x-0 top-[22%] text-center">
              <CText by="letter" step={70} className="font-display fs-md tracking-[0.3em] text-champagne glow-text">
                THE QUEEN ARRIVES
              </CText>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* jewellery close-ups: zooms into regions of the supplied royal photograph */}
      <AnimatePresence>
        {royal && step === 'jewels' && (
          <motion.div key="jewels" className="absolute inset-0 bg-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8 } }}>
            <AnimatePresence mode="wait">
              <motion.div key={j} className="absolute inset-0 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
                <motion.img src={royal} alt="" draggable="false" className="absolute inset-0 w-full h-full object-cover" style={{ transformOrigin: JEWELS[j].o }} initial={{ scale: JEWELS[j].s * 0.8 }} animate={{ scale: JEWELS[j].s }} transition={{ duration: 2.4, ease: 'easeOut' }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 55% at 50% 50%, transparent 40%, rgba(0,0,0,.65))' }} />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-[12%] text-center px-6">
              <AnimatePresence mode="wait">
                <motion.div key={j} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-display fs-sm tracking-[0.3em] text-champagne glow-text">
                  {JEWELS[j].label}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* the throne */}
      <AnimatePresence>
        {(step === 'throne' || step === 'crowned') && (
          <motion.div key="throne" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }}>
            {royal ? (
              <motion.img src={royal} alt="Dr. Shruthi on the peacock throne" draggable="false" className="absolute inset-0 w-full h-full object-cover" initial={{ scale: 1.25 }} animate={{ scale: 1.0 }} transition={{ duration: 6, ease: 'easeOut' }} style={{ transformOrigin: '50% 35%' }} />
            ) : (
              <div className="absolute inset-0 flex items-end justify-center pb-[8%]">
                <Feather className="absolute w-[80%] top-[8%] opacity-80" />
                <QueenFigure className="relative w-[52%]" />
              </div>
            )}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.55) 0%, transparent 22%, transparent 60%, rgba(0,0,0,.8) 100%)' }} />

            {/* crown descends */}
            <AnimatePresence>
              {crown && step === 'throne' && (
                <motion.div key="crown" className="absolute left-1/2 z-10" style={{ width: '26%', x: '-50%' }} initial={{ top: '-12%', opacity: 0, scale: 1.6 }} animate={{ top: royal ? '22.5%' : '28%', opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease: [0.3, 0.1, 0.2, 1] }}>
                  <Crown className="w-full drop-shadow-[0_0_28px_rgba(255,200,90,0.95)]" />
                </motion.div>
              )}
            </AnimatePresence>
            {step === 'crowned' && (
              <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0.95 }} animate={{ opacity: 0 }} transition={{ duration: 1.6 }} style={{ background: 'radial-gradient(circle at 50% 30%, #fff4c8, transparent 60%)' }} />
            )}

            <AnimatePresence>
              {step === 'throne' && !crown && (
                <motion.div key="seat" className="absolute inset-x-0 bottom-[16%] flex flex-col items-center gap-3 px-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 1.8 }}>
                  <div className="font-serif italic fs-lg text-champagne glow-text">She takes her seat on the royal throne.</div>
                  <button className="mt-2 flex flex-col items-center gap-2" onClick={doCrown}>
                    <Hand className="text-ember float-y" strokeWidth={1.3} style={{ width: 'calc(var(--u)*8)', height: 'calc(var(--u)*8)' }} />
                    <span className="font-display fs-md tracking-[0.3em] gold-text hint-glow">TAP TO CROWN HER</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {step === 'crowned' && (
              <motion.div className="absolute inset-x-0 bottom-[14%] text-center px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}>
                <CText by="word" step={420} delay={700} className="font-display fs-lg tracking-[0.1em] gold-text leading-snug">
                  HER VISION.
                </CText>
                <CText by="word" step={420} delay={1700} className="font-display fs-lg tracking-[0.1em] gold-text leading-snug">
                  HER KINGDOM.
                </CText>
                <CText by="word" step={420} delay={2700} className="font-display fs-lg tracking-[0.1em] gold-text leading-snug">
                  HER EMPIRE.
                </CText>
                <Divider className="mt-4" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {burst > 0 && <GoldDust key={burst} count={120} mode="burst" speed={1.4} burstKey={burst} />}

      <ChapterTitle n="04" title="THE QUEEN OF HER KINGDOM" onDone={() => setReady(true)} />
      <ContinueBar show={done} onClick={() => next()} />
    </div>
  )
}
