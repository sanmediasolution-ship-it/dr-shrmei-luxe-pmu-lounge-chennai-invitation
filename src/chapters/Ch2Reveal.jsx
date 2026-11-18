import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GoldDust from '../components/GoldDust'
import { PalaceBackdrop } from '../components/Backdrops'
import { Logo } from '../components/Media'
import { ContinueBar, CText } from '../components/UI'
import { Divider } from '../components/Ornaments'
import { asset } from '../lib/assets'
import { audio } from '../lib/audio'
import { useTimers } from '../lib/hooks'
import { useStory } from '../story'
import { BRAND } from '../config/site'

/** Tap to draw back the golden curtain and reveal Dr. Shruthi */
export default function Ch2Reveal() {
  const { next } = useStory()
  const after = useTimers()
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 700)
    return () => clearTimeout(t)
  }, [])
  const photo = asset('shruthi-photos/royal') || asset('shruthi-photos/portrait')

  const reveal = () => {
    if (open) return
    setOpen(true)
    audio.sfx('transform')
    after(900, () => audio.sfx('sparkle'))
    after(5200, () => setDone(true))
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <PalaceBackdrop variant="throne" />
      <GoldDust count={40} mode="float" />
      {photo && (
        <motion.img src={photo} alt={BRAND.founder} draggable="false" className="absolute inset-0 w-full h-full object-cover" initial={{ opacity: 0, scale: 1.15, filter: 'blur(30px)' }} animate={open ? { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' } : { opacity: 0.45, scale: 1.08, filter: 'blur(22px) brightness(.8)' }} transition={{ duration: 3.2, ease: 'easeOut' }} />
      )}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,.5),transparent 30%,transparent 55%,rgba(0,0,0,.9))' }} />

      <AnimatePresence>
        {ready && !open && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8" exit={{ opacity: 0, scale: 1.3 }} transition={{ duration: 1.2 }}>
            <Logo variant="emblem" className="float-y" style={{ width: 'calc(var(--u)*30)' }} />
            <CText by="word" step={180} className="font-display fs-lg text-champagne mt-6 tracking-[0.2em]">THE ONE BEHIND THE EMPIRE</CText>
            <button className="gold-btn solid fs-sm mt-8 hint-glow" onClick={reveal}>TAP TO REVEAL</button>
          </motion.div>
        )}
      </AnimatePresence>

      {open && (
        <motion.div className="absolute inset-x-0 text-center px-6" style={{ bottom: '16%' }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2, duration: 1.6 }}>
          <div className="font-sans fs-xs tracking-[0.4em] text-champagne/70">FOUNDER</div>
          <div className="font-display gold-text glow-text fs-xl tracking-[0.1em] mt-1">{BRAND.founder}</div>
          <Divider className="my-2" />
          <div className="font-serif italic text-champagne fs-md">{BRAND.designation}</div>
        </motion.div>
      )}

      <ContinueBar show={done} onClick={() => next()} />
    </div>
  )
}
