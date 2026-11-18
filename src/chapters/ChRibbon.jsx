import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Scissors } from 'lucide-react'
import Confetti from '../components/Confetti'
import GoldDust from '../components/GoldDust'
import { Logo } from '../components/Media'
import { ContinueBar, CText } from '../components/UI'
import { Ribbon } from './Ch5Chennai'
import { asset } from '../lib/assets'
import { audio } from '../lib/audio'
import { useTimers } from '../lib/hooks'
import { useStory } from '../story'

/** Tap to cut the ribbon — the grand opening photo is revealed with confetti */
export default function ChRibbon() {
  const { next } = useStory()
  const after = useTimers()
  const [ready, setReady] = useState(false)
  const [cut, setCut] = useState(false)
  const [boom, setBoom] = useState(0)
  const [done, setDone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 700)
    return () => clearTimeout(t)
  }, [])
  const photo = asset('shruthi-photos/ribbon-cutting')

  const doCut = () => {
    if (cut) return
    setCut(true)
    navigator.vibrate && navigator.vibrate([20, 40, 60])
    audio.sfx('scissor')
    after(900, () => {
      audio.sfx('celebrate')
      setBoom(1)
    })
    after(5200, () => setDone(true))
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {photo ? (
        <motion.img src={photo} alt="Grand opening" draggable="false" className="absolute inset-0 w-full h-full object-cover" initial={{ opacity: 0.2, scale: 1.12 }} animate={{ opacity: cut ? 1 : 0.5, scale: cut ? 1 : 1.12 }} transition={{ duration: cut ? 3 : 1.6 }} style={{ filter: cut ? 'none' : 'blur(4px) brightness(.85)' }} />
      ) : (
        <div className="absolute inset-0" style={{ background: 'radial-gradient(80% 60% at 50% 45%, rgba(232,117,36,.3), #090909)' }} />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,.55),transparent 28%,transparent 55%,rgba(0,0,0,.85))' }} />
      <GoldDust count={30} mode="float" />
      {boom > 0 && <Confetti runKey={boom} duration={5000} />}

      {ready && !cut && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="absolute top-[16%] inset-x-0 text-center px-6">
            <div className="font-display fs-xs tracking-[0.4em] text-ember">THE MOMENT HAS COME</div>
            <div className="font-serif italic fs-lg text-champagne mt-2">Cut the ribbon. Open the doors.</div>
          </div>
          <div className="relative w-full" style={{ height: 'calc(var(--u)*22)' }}>
            <Ribbon className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,.6)]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-[26%] opacity-90"><Logo variant="emblem" /></div></div>
          </div>
          <div className="absolute bottom-[14%] inset-x-0 flex justify-center">
            <button className="gold-btn solid fs-sm hint-glow" onClick={doCut}><Scissors size={18} /> CUT THE RIBBON</button>
          </div>
        </div>
      )}

      {cut && (
        <motion.div className="absolute inset-x-0 text-center px-6" style={{ bottom: '18%' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 1.4 }}>
          <CText by="word" step={260} delay={1800} className="font-display gold-text glow-text fs-xl tracking-[0.12em]">NOW EXPANDING TO CHENNAI</CText>
          <div className="font-serif italic text-champagne fs-md mt-2">Our second branch. A new milestone.</div>
        </motion.div>
      )}

      <ContinueBar show={done} onClick={() => next()} label="THE INVITATION" />
    </div>
  )
}
