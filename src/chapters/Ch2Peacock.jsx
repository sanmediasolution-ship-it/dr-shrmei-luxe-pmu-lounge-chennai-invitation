import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Hand } from 'lucide-react'
import { PalaceBackdrop } from '../components/Backdrops'
import { Scene3D } from '../three/Scene3D'
import GoldDust from '../components/GoldDust'
import { Logo } from '../components/Media'
import { ChapterTitle, ContinueBar, CText } from '../components/UI'
import { Divider } from '../components/Ornaments'
import { audio } from '../lib/audio'
import { useTimers } from '../lib/hooks'
import { useStory } from '../story'

export default function Ch2Peacock() {
  const { next } = useStory()
  const after = useTimers()
  const [ready, setReady] = useState(false)
  const [phase, setPhase] = useState('idle') // idle | open | zoom
  const [fill, setFill] = useState(false) // feather fills the screen
  const [logo, setLogo] = useState(false)
  const [done, setDone] = useState(false)
  const [burst, setBurst] = useState(0)

  const tap = () => {
    if (!ready || phase !== 'idle') return
    navigator.vibrate && navigator.vibrate(30)
    setPhase('open')
    audio.sfx('peacock')
    setBurst(1)
    after(5200, () => {
      setPhase('zoom')
      audio.sfx('whoosh')
    })
  }
  const zoomed = () => {
    setFill(true)
    audio.sfx('transform')
    after(1400, () => {
      setLogo(true)
      setBurst(2)
    })
    after(6500, () => setDone(true))
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <PalaceBackdrop variant="throne" dim={0.25} className="opacity-60" />
      <Scene3D kind="peacock" phase={phase} onTap={tap} onZoomed={zoomed} />
      <GoldDust count={60} mode="float" />
      {burst > 0 && <GoldDust key={burst} count={100} mode="burst" speed={1.3} burstKey={burst} />}

      <AnimatePresence>
        {ready && phase === 'idle' && (
          <motion.button key="prompt" className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3" style={{ top: '17%' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 1.2 }} onClick={tap}>
            <Hand className="text-ember float-y" strokeWidth={1.3} style={{ width: 'calc(var(--u)*9)', height: 'calc(var(--u)*9)' }} />
            <span className="font-display fs-md tracking-[0.3em] gold-text hint-glow">UNLOCK THE MAGIC</span>
            <span className="font-sans fs-xs tracking-[0.3em] text-champagne/50">TAP THE PEACOCK</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* the feather fills the screen and transforms into the logo */}
      <AnimatePresence>
        {fill && (
          <motion.div key="fill" className="absolute inset-0 z-30 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
            <motion.div
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{ width: '170%', aspectRatio: '1', x: '-50%', y: '-50%', background: 'radial-gradient(circle, #050b24 0 8%, #0a2a78 12% 22%, #1aa0a6 26% 34%, #1b7f6e 38% 44%, #c8a43a 48% 56%, #6a4a12 62%, #0a0505 78%)' }}
              initial={{ scale: 1.8, opacity: 0.9 }}
              animate={{ scale: logo ? 0.55 : 1.2, opacity: logo ? 0 : 1 }}
              transition={{ duration: 2.4, ease: 'easeInOut' }}
            />
            <AnimatePresence>
              {logo && (
                <motion.div key="reveal" className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'radial-gradient(circle at 50% 42%, rgba(232,117,36,0.30), #090909 70%)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }}>
                  <motion.div initial={{ scale: 0.4, opacity: 0, filter: 'blur(14px)' }} animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 2, ease: [0.2, 0.7, 0.2, 1] }}>
                    <Logo variant="mark" style={{ width: 'calc(var(--u)*62)' }} />
                  </motion.div>
                  <Divider className="my-6" />
                  <CText by="word" delay={1500} step={320} className="font-display fs-lg tracking-[0.12em] gold-text leading-snug">
                    EVERY EMPIRE BEGINS WITH A DREAM.
                  </CText>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <ChapterTitle n="02" title="THE PEACOCK’S BLESSING" onDone={() => setReady(true)} />
      <ContinueBar show={done} onClick={() => next()} />
    </div>
  )
}
