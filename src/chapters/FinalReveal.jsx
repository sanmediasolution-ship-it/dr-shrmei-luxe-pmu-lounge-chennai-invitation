import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, RotateCcw, Share2, PartyPopper } from 'lucide-react'
import GoldDust from '../components/GoldDust'
import Confetti from '../components/Confetti'
import { Logo } from '../components/Media'
import { CText, GoldButton } from '../components/UI'
import { Divider } from '../components/Ornaments'
import { asset } from '../lib/assets'
import { isLite, prefersReducedMotion } from '../lib/device'
import { audio } from '../lib/audio'
import { useTimers } from '../lib/hooks'
import { useStory } from '../story'
import { BRAND, EVENT } from '../config/site'

/** Particles that slowly assemble into the supplied logo (sampled from the real logo pixels) */
function Assemble({ onDone }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    const r = cv.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    cv.width = r.width * dpr
    cv.height = r.height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const W = r.width,
      H = r.height
    let raf, alive = true
    const src = asset('logo/logo')
    const build = (img) => {
      const off = document.createElement('canvas')
      const tw = Math.min(W * 0.78, 520)
      const th = img ? tw * (img.naturalHeight / img.naturalWidth) : tw * 0.4
      off.width = Math.round(tw)
      off.height = Math.round(th)
      const o = off.getContext('2d')
      if (img) o.drawImage(img, 0, 0, off.width, off.height)
      else {
        o.fillStyle = '#E87524'
        o.font = `600 ${off.height * 0.5}px Cinzel, serif`
        o.textAlign = 'center'
        o.textBaseline = 'middle'
        o.fillText('DR. SHRMEI’S', off.width / 2, off.height / 2)
      }
      const d = o.getImageData(0, 0, off.width, off.height).data
      const gap = isLite || prefersReducedMotion() ? 5 : 3
      const targets = []
      for (let y = 0; y < off.height; y += gap)
        for (let x = 0; x < off.width; x += gap) {
          const i = (y * off.width + x) * 4
          if (d[i + 3] > 128) targets.push({ x: x + (W - off.width) / 2, y: y + H * 0.3 - off.height / 2 + 20, c: `${d[i]},${d[i + 1]},${d[i + 2]}` })
        }
      const ps = targets.map((t) => ({ ...t, x0: Math.random() * W, y0: Math.random() * H * 1.1 - H * 0.05, d: Math.random() * 0.35, s: 0.8 + Math.random() * 1.4 }))
      const T = 4200
      const t0 = performance.now()
      const tick = (now) => {
        if (!alive) return
        const k = (now - t0) / T
        ctx.clearRect(0, 0, W, H)
        ctx.globalCompositeOperation = 'lighter'
        for (const p of ps) {
          const e = Math.min(1, Math.max(0, (k - p.d) / (1 - p.d)))
          const q = 1 - Math.pow(1 - e, 3)
          const x = p.x0 + (p.x - p.x0) * q + Math.sin(now / 500 + p.x) * (1 - q) * 6
          const y = p.y0 + (p.y - p.y0) * q
          ctx.fillStyle = e < 1 ? `rgba(255,214,120,${0.35 + e * 0.5})` : `rgba(${p.c},0.9)`
          ctx.beginPath()
          ctx.arc(x, y, p.s * (e < 1 ? 1.2 : 0.9), 0, 6.3)
          ctx.fill()
        }
        if (k < 1.15) raf = requestAnimationFrame(tick)
        else onDone && onDone()
      }
      raf = requestAnimationFrame(tick)
    }
    if (src) {
      const im = new Image()
      im.onload = () => build(im)
      im.onerror = () => build(null)
      im.src = src
    } else build(null)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
    }
  }, []) // eslint-disable-line
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />
}

export default function FinalReveal() {
  const { openModal, restart } = useStory()
  const after = useTimers()
  const [logo, setLogo] = useState(false)
  const [text, setText] = useState(false)
  const [tag, setTag] = useState(false)
  const [btns, setBtns] = useState(false)
  const [date, setDate] = useState(false)

  useEffect(() => {
    audio.playMusic('celebration', { level: 0.7, fade: 3 })
    after(4600, () => {
      setLogo(true)
      audio.sfx('transform')
    })
    after(6200, () => setText(true))
    after(9800, () => setTag(true))
    after(15500, () => setBtns(true))
    after(17200, () => {
      setDate(true)
      audio.sfx('chime')
    })
  }, []) // eslint-disable-line

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-none bg-black">
      <div className="relative min-h-full flex flex-col items-center px-5 pt-[9%] pb-12 text-center" style={{ minHeight: '100%' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(80% 50% at 50% 26%, rgba(232,117,36,.28), transparent 70%)', opacity: logo ? 1 : 0, transition: 'opacity 3s' }} />
        <GoldDust count={50} mode="float" />
        <div className="relative w-full flex justify-center" style={{ height: 'calc(var(--u)*72)' }}>
          <Assemble />
          <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: logo ? 1 : 0, scale: logo ? 1 : 0.96 }} transition={{ duration: 2 }}>
            <Logo variant="mark" style={{ width: 'calc(var(--u)*62)' }} />
          </motion.div>
        </div>

        {text && (
          <div className="relative -mt-2">
            <CText by="letter" step={60} className="font-display gold-text fs-xl tracking-[0.1em] leading-none">{BRAND.name}</CText>
            <CText by="word" step={150} delay={900} className="font-display text-champagne fs-sm tracking-[0.18em] mt-2">{BRAND.line2}</CText>
            <CText by="letter" step={150} delay={1800} className="font-display text-ember fs-md tracking-[0.5em] mt-3">{BRAND.city}</CText>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1.2 }}>
              <Divider className="my-4" />
              <div className="font-display gold-text fs-lg tracking-[0.3em]">GRAND OPENING</div>
            </motion.div>
          </div>
        )}

        {tag && (
          <div className="relative mt-6">
            {BRAND.finalTagline.map((l, i) => (
              <CText key={i} by="word" step={230} delay={i * 1600} className="font-serif italic fs-lg text-champagne/90 leading-snug">{l}</CText>
            ))}
          </div>
        )}

        {btns && (
          <motion.div className="relative mt-8 w-full flex flex-col gap-3 max-w-[340px]" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <GoldButton variant="solid" icon={PartyPopper} onClick={() => openModal('rsvp')} className="fs-xs w-full">RSVP NOW</GoldButton>
            <GoldButton icon={Share2} onClick={() => openModal('share')} className="fs-xs w-full">SHARE THIS INVITATION</GoldButton>
            <GoldButton icon={Compass} onClick={() => openModal('explore')} className="fs-xs w-full">EXPLORE THE KINGDOM</GoldButton>
          </motion.div>
        )}

        {/* the opening day — mentioned last */}
        {date && (
          <motion.div className="relative mt-9" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6 }}>
            <Confetti runKey={1} duration={5000} />
            <div className="font-display fs-xs tracking-[0.45em] text-champagne/60">SAVE THE DATE</div>
            <div className="font-display gold-text glow-text mt-2 tracking-[0.12em]" style={{ fontSize: 'max(28px, calc(var(--u)*9))' }}>{EVENT.dateUpper}</div>
            <div className="font-display text-champagne fs-sm tracking-[0.3em] mt-1">{EVENT.address.toUpperCase()}</div>
            <button onClick={restart} className="mt-8 inline-flex items-center gap-2 font-sans fs-xs tracking-[0.3em] text-champagne/40 underline underline-offset-4">
              <RotateCcw size={13} /> REPLAY THE FILM
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
