import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Droplets, Feather, PenTool, Hand } from 'lucide-react'
import { PalaceBackdrop } from '../components/Backdrops'
import { Scene3D } from '../three/Scene3D'
import GoldDust from '../components/GoldDust'
import { ChapterTitle, ContinueBar, CText } from '../components/UI'
import { audio } from '../lib/audio'
import { asset } from '../lib/assets'
import { useTimers } from '../lib/hooks'
import { useStory } from '../story'

const KIT = [
  { k: 'pmu-tools/microblading', icon: Feather, label: 'MICROBLADING TOOLS' },
  { k: 'pmu-tools/pigments', icon: Droplets, label: 'PIGMENTS' },
  { k: 'pmu-tools/pens', icon: PenTool, label: 'PRECISION PENS' },
]

export default function Ch1Treasure() {
  const { next } = useStory()
  const after = useTimers()
  const [ready, setReady] = useState(false)
  const [phase, setPhase] = useState('idle') // idle | unlocking | opening | open | keyFlies
  const [burst, setBurst] = useState(0)
  const [kit, setKit] = useState(false)
  const [smile, setSmile] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 900)
    return () => clearTimeout(t)
  }, [])

  const tap = () => {
    if (!ready || phase !== 'idle') return
    navigator.vibrate && navigator.vibrate(25)
    setPhase('unlocking')
    audio.sfx('unlock')
    after(1000, () => {
      setPhase('opening')
      audio.sfx('treasure')
      setBurst((b) => b + 1)
    })
    after(3300, () => {
      setPhase('open')
      setKit(true)
    })
    after(7600, () => {
      setPhase('keyFlies')
      audio.sfx('sparkle')
    })
    after(9300, () => {
      setSmile(true)
      audio.sfx('chime')
    })
    after(11800, () => setDone(true))
  }

  const light1 = asset('shruthi-photos/light-1')
  const portrait = asset('shruthi-photos/portrait')

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <PalaceBackdrop variant="treasure" />

      {/* Dr. Shruthi enters the chamber (supplied photographs, blended into the light) */}
      <motion.div className="absolute left-[-6%] bottom-0 w-[86%] h-[78%] pointer-events-none" initial={{ x: '-70%', opacity: 0 }} animate={{ x: ready ? 0 : '-70%', opacity: ready ? 1 : 0 }} transition={{ duration: 3.6, ease: [0.2, 0.6, 0.2, 1] }}>
        {light1 && (
          <motion.img src={light1} alt="" draggable="false" className="absolute inset-0 w-full h-full object-cover mix-blend-screen" style={{ maskImage: 'linear-gradient(90deg,#000 55%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,#000 55%,transparent)' }} animate={{ opacity: smile && portrait ? 0 : 0.85 }} transition={{ duration: 1.6 }} />
        )}
        {portrait && (
          <motion.img src={portrait} alt="Dr. Shruthi smiling" draggable="false" className="absolute inset-0 w-full h-full object-cover mix-blend-screen" style={{ maskImage: 'linear-gradient(90deg,#000 55%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,#000 55%,transparent)' }} initial={{ opacity: 0 }} animate={{ opacity: smile ? 0.95 : 0 }} transition={{ duration: 1.6 }} />
        )}
      </motion.div>

      <GoldDust count={55} mode="float" />
      <Scene3D kind="chest" phase={phase} onTap={tap} />
      {burst > 0 && <GoldDust key={burst} count={90} mode="burst" speed={1.2} burstKey={burst} />}

      {/* prompt */}
      <AnimatePresence>
        {ready && phase === 'idle' && (
          <motion.button key="prompt" className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3" style={{ top: '25%' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 1.2 }} onClick={tap}>
            <Hand className="text-ember float-y" strokeWidth={1.3} style={{ width: 'calc(var(--u)*9)', height: 'calc(var(--u)*9)' }} />
          </motion.button>
        )}
      </AnimatePresence>



      <ContinueBar show={done} onClick={() => next()} />
    </div>
  )
}
