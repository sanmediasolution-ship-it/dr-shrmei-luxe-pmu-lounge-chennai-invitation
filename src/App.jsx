import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import { StoryCtx, STAGES } from './story'
import Stage from './components/Stage'
import Loader from './components/Loader'
import { GoldFlash, Hud } from './components/UI'
import { audio } from './lib/audio'
import Intro from './chapters/Intro'
import Ch1Treasure from './chapters/Ch1Treasure'
import Ch2Reveal from './chapters/Ch2Reveal'
import ChRibbon from './chapters/ChRibbon'
import RsvpStage from './chapters/RsvpStage'
import PersonalInvite from './chapters/PersonalInvite'
import InviteCard from './chapters/InviteCard'
import Rsvp from './features/Rsvp'
import Explore from './features/Explore'

const VIEWS = { intro: Intro, ch1: Ch1Treasure, reveal: Ch2Reveal, ribbon: ChRibbon, card: InviteCard, rsvp: RsvpStage, invite: PersonalInvite }
const MUSIC = { ch1: ['opening', 1], reveal: ['palace', 1], ribbon: ['celebration', 0.9], card: ['celebration', 0.8], rsvp: ['personal', 0.7], invite: ['personal', 0.9] }

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [stage, setStage] = useState(() => { const s = new URLSearchParams(location.search).get('stage'); return STAGES.includes(s) ? s : 'intro' })
  const [flash, setFlash] = useState(0)
  const [modal, setModal] = useState(null)

  const goTo = useCallback((s) => {
    setFlash((k) => k + 1)
    setTimeout(() => setStage(s), 550)
  }, [])
  const next = useCallback(() => {
    setStage((cur) => cur) // keep identity stable
    setFlash((k) => k + 1)
    setTimeout(() => setStage((cur) => STAGES[Math.min(STAGES.indexOf(cur) + 1, STAGES.length - 1)]), 550)
  }, [])
  const restart = useCallback(() => {
    audio.stopMusic(1)
    setFlash((k) => k + 1)
    setTimeout(() => setStage('ch1'), 550)
  }, [])

  useEffect(() => {
    const m = MUSIC[stage]
    if (m) audio.playMusic(m[0], { level: m[1] })
  }, [stage])

  const ctx = useMemo(() => ({ stage, goTo, next, restart, modal, openModal: setModal, closeModal: () => setModal(null) }), [stage, goTo, next, restart, modal])
  const View = VIEWS[stage]

  return (
    <StoryCtx.Provider value={ctx}>
      <Stage>
        {!loaded ? (
          <Loader onDone={() => setLoaded(true)} />
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div key={stage} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                <View />
              </motion.div>
            </AnimatePresence>
            <Hud />
            {flash > 0 && <GoldFlash k={flash} />}
            {stage !== 'intro' && (
              <button aria-label="Explore the Kingdom" onClick={() => setModal('explore')} className="absolute z-50 w-11 h-11 rounded-full border border-gold/70 bg-black/60 backdrop-blur text-gold flex items-center justify-center" style={{ right: 12, bottom: 88 }}>
                <Compass size={20} strokeWidth={1.4} />
              </button>
            )}
            <Rsvp open={modal === 'rsvp'} onClose={() => setModal(null)} />
            <Explore open={modal === 'explore'} onClose={() => setModal(null)} />
          </>
        )}
      </Stage>
    </StoryCtx.Provider>
  )
}
