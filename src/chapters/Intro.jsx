import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Scene3D } from '../three/Scene3D'
import GoldDust from '../components/GoldDust'
import { CText } from '../components/UI'
import { audio } from '../lib/audio'
import { useTimers } from '../lib/hooks'
import { useStory } from '../story'
import { BRAND } from '../config/site'

/** Black screen → golden particle → "YOU ARE INVITED TO WITNESS…" → heartbeat → royal door → ENTER THE KINGDOM */
export default function Intro() {
  const { next } = useStory()
  const after = useTimers()
  const [step, setStep] = useState('gate') // gate | text | door | opening
  const [open, setOpen] = useState(false)

  const begin = async () => {
    if (step !== 'gate') return
    await audio.unlock() // audio starts only after the guest's first touch
    audio.startHeartbeat()
    navigator.vibrate && navigator.vibrate([30, 90, 30])
    setStep('text')
    after(5600, () => setStep((s) => (s === 'text' ? 'door' : s)))
  }

  const enter = () => {
    if (step === 'opening') return
    audio.stopHeartbeat()
    audio.sfx('door')
    audio.playMusic('opening', { level: 0.95, fade: 3.5 })
    setStep('opening')
    setOpen(true)
  }

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* 3D royal doors (mounted once the guest has begun) */}
      {step !== 'gate' && (
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: step === 'text' ? 0 : 1 }} transition={{ duration: 2.2 }}>
          <Scene3D kind="door" open={open} onOpened={() => next('ch1')} />
        </motion.div>
      )}

      {step === 'opening' && <GoldDust count={110} mode="toward" speed={1.6} />}
      {step === 'door' && <GoldDust count={26} mode="float" />}

      {/* gate: a single golden particle */}
      <AnimatePresence>
        {step === 'gate' && (
          <motion.button
            key="gate"
            className="absolute inset-0 flex flex-col items-center justify-center bg-black"
            onClick={begin}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            aria-label="Touch the light to begin"
          >
            <motion.span
              className="block rounded-full"
              style={{ width: 10, height: 10, background: 'radial-gradient(circle,#fff6d0,#E8B84A 55%,#E87524)', boxShadow: '0 0 24px 8px rgba(232,150,50,.55), 0 0 80px 24px rgba(232,117,36,.25)' }}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: [1, 1.5, 1] }}
              transition={{ opacity: { duration: 2.2 }, scale: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } }}
            />
            <motion.div className="mt-14 text-center px-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 1.6 }}>
              <div className="font-display fs-xs tracking-[0.5em] text-gold hint-glow">TOUCH THE LIGHT</div>
              <div className="font-sans fs-xs text-champagne/40 tracking-[0.25em] mt-3">TURN YOUR SOUND ON · BEST ON PHONE</div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* invitation line + heartbeat pulse */}
      <AnimatePresence>
        {step === 'text' && (
          <motion.div key="text" className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" exit={{ opacity: 0, transition: { duration: 1.2 } }}>
            <span className="block rounded-full mb-12" style={{ width: 9, height: 9, background: 'radial-gradient(circle,#fff6d0,#E8B84A 55%,#E87524)', boxShadow: '0 0 24px 8px rgba(232,150,50,.5)', animation: 'heartbeat 1.05s ease-in-out infinite' }} />
            <CText by="letter" step={85} delay={500} className="font-display fs-lg tracking-[0.18em] gold-text leading-snug">
              YOU ARE INVITED
            </CText>
            <CText by="letter" step={85} delay={1900} className="font-display fs-lg tracking-[0.18em] gold-text leading-snug">
              TO WITNESS…
            </CText>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ENTER */}
      <AnimatePresence>
        {step === 'door' && (
          <motion.div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-4" style={{ paddingBottom: 'max(56px, env(safe-area-inset-bottom))' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.6 } }} transition={{ delay: 1.2, duration: 1.4 }}>
            <div className="font-display fs-xs tracking-[0.4em] text-champagne/70">{BRAND.film}</div>
            <button className="gold-btn fs-sm" onClick={enter}>
              ENTER THE KINGDOM
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
