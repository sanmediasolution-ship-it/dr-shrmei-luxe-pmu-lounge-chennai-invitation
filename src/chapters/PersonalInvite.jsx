import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, RotateCcw, Upload } from 'lucide-react'
import GoldDust from '../components/GoldDust'
import { GoldFrame } from '../components/Ornaments'
import { CText } from '../components/UI'
import { MessageCircle } from 'lucide-react'
import { whatsappRsvpUrl } from '../lib/share'
import { rsvpState } from '../lib/rsvpState'
import { audio } from '../lib/audio'
import { asset, showHints } from '../lib/assets'
import { useTimers } from '../lib/hooks'
import { useStory } from '../story'
import { INVITE_IS_AI_GENERATED, SUBTITLE_TIMES, TAMIL_CUES } from '../config/site'

/** Weighted default timings across a known duration */
function autoTimes(duration) {
  const total = TAMIL_CUES.reduce((a, c) => a + c.length, 0)
  const start = duration * 0.05
  const span = duration * 0.9
  let t = start
  return TAMIL_CUES.map((c) => {
    const len = (c.length / total) * span
    const r = [t, t + len]
    t += len
    return r
  })
}

export default function PersonalInvite() {
  const after = useTimers()
  const videoRef = useRef(null)
  const voiceRef = useRef(null)
  const [localVideo, setLocalVideo] = useState(null)
  const video = localVideo || asset('shruthi-video/invitation') || asset('shruthi-video/teaser')
  const isTeaser = !localVideo && !asset('shruthi-video/invitation') && !!asset('shruthi-video/teaser')
  const poster = asset('shruthi-video/poster')
  const voice = asset('shruthi-video/voice')
  const portrait = asset('shruthi-photos/portrait')
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)
  const [cue, setCue] = useState(-1)
  const [duration, setDuration] = useState(0)

  const times = useMemo(() => SUBTITLE_TIMES || (duration ? autoTimes(duration) : null), [duration])

  const cueAt = useCallback(
    (t) => {
      if (!times) return -1
      const i = times.findIndex(([a, b]) => t >= a && t <= b + 0.4)
      return i
    },
    [times],
  )

  // soften the score while the invitation plays
  useEffect(() => {
    audio.setMusicLevel(playing ? 0.08 : 0.55, 1.5)
    return () => audio.setMusicLevel(0.8, 1.2)
  }, [playing])

  const onTime = () => {
    const el = videoRef.current || voiceRef.current
    if (el) setCue(cueAt(el.currentTime))
  }

  const play = () => {
    setEnded(false)
    setPlaying(true)
    if (video && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.muted = false
      videoRef.current.play().catch(() => {
        videoRef.current.muted = true
        videoRef.current.play().catch(() => {})
      })
    } else if (voice && voiceRef.current) {
      voiceRef.current.currentTime = 0
      voiceRef.current.play().catch(() => {})
    } else {
      // subtitle-only reading mode (no recording supplied yet)
      const lens = [4200, 6800, 3600]
      let t = 400
      lens.forEach((l, i) => {
        after(t, () => setCue(i))
        t += l
      })
      after(t, () => {
        setCue(-1)
        setPlaying(false)
        setEnded(true)
      })
    }
  }

  const finish = () => {
    setPlaying(false)
    setEnded(true)
    setCue(-1)
  }

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: 'radial-gradient(90% 60% at 50% 30%, rgba(232,117,36,.22), #090909 70%)' }}>
      <GoldDust count={36} mode="float" />
      <div className="absolute top-[7%] inset-x-0 text-center px-6 z-10">
        <CText by="letter" step={60} className="font-display fs-sm tracking-[0.4em] text-ember glow-text">
          A PERSONAL INVITATION
        </CText>
      </div>

      <div className="absolute inset-x-4 top-[11%] bottom-[25%]">
        <GoldFrame className="w-full h-full" inset={2} rounded={16}>
          <div className="absolute inset-[12px] rounded-xl overflow-hidden bg-black">
            <div className="w-full h-full" style={{ animation: playing || !video ? 'pushIn 40s linear forwards' : undefined }}>
              {video ? (
                <video
                  ref={videoRef}
                  src={video}
                  poster={poster || undefined}
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onTimeUpdate={onTime}
                  onEnded={finish}
                />
              ) : portrait ? (
                <img src={portrait} alt="Dr. Shruthi" className="w-full h-full object-cover" draggable="false" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-wine/60 to-black">
                  <div className="font-display gold-text text-center fs-lg px-6">DR. M. SHRUTHI KEERTHANA</div>
                </div>
              )}
            </div>
            {voice && !video && <audio ref={voiceRef} src={voice} onTimeUpdate={onTime} onEnded={finish} />}
            <AnimatePresence>
              {!playing && (
                <motion.button key="play" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/35" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={play}>
                  <span className="rounded-full border border-gold bg-black/55 backdrop-blur flex items-center justify-center" style={{ width: 'calc(var(--u)*20)', height: 'calc(var(--u)*20)', boxShadow: '0 0 40px rgba(232,117,36,.55)', animation: 'btnPulse 2.4s ease-in-out infinite' }}>
                    {ended ? <RotateCcw className="text-gold" strokeWidth={1.4} style={{ width: '42%', height: '42%' }} /> : <Play className="text-gold ml-1" strokeWidth={1.4} style={{ width: '42%', height: '42%' }} />}
                  </span>
                  <span className="font-display fs-xs tracking-[0.35em] text-champagne hint-glow">{ended ? 'WATCH AGAIN' : video || voice ? 'PLAY THE INVITATION' : 'READ THE INVITATION'}</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </GoldFrame>
      </div>

      {/* Tamil subtitles (exact dialogue) */}
      <div className="absolute inset-x-5 bottom-[11%] h-[13%] flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {cue >= 0 ? (
            <motion.div key={cue} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="tamil fs-md text-champagne font-medium leading-relaxed" style={{ textShadow: '0 2px 12px #000, 0 0 24px rgba(232,117,36,.45)' }}>
              {TAMIL_CUES[cue]}
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} className="font-sans fs-xs tracking-[0.3em] text-champagne/60">
              {playing ? '' : 'TAMIL SUBTITLES'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showHints && (
        <label className="absolute top-[3.2%] right-3 z-20 flex items-center gap-1 text-[10px] text-ember/80 cursor-pointer">
          <Upload size={11} /> preview my video
          <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files[0] && setLocalVideo(URL.createObjectURL(e.target.files[0]))} />
        </label>
      )}

      {(ended || cue >= 2) && (
        <div className="absolute inset-x-0 z-20 flex flex-col items-center gap-3 px-6" style={{ bottom: 'max(36px, calc(env(safe-area-inset-bottom) + 28px))' }}>
          <a href={whatsappRsvpUrl({ name: rsvpState.name, guests: rsvpState.guests, phone: '', attendance: 'yes' })} target="_blank" rel="noopener noreferrer" className="gold-btn solid fs-xs w-full max-w-[340px]">
            <MessageCircle style={{ width: '1.15em', height: '1.15em' }} strokeWidth={1.6} />
            <span>CONFIRM ON WHATSAPP</span>
          </a>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-2 text-center font-sans text-champagne/35 pointer-events-none" style={{ fontSize: 'max(9px, calc(var(--u)*2.3))', letterSpacing: '0.18em' }}>
        CREATED BY SAN MEDIA SOLUTION
      </div>
    </div>
  )
}
