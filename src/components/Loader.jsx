import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { asset, loadManifest, preloadImages } from '../lib/assets'
import { preload3D } from '../three/Scene3D'
import { Logo } from './Media'
import GoldDust from './GoldDust'

/** Premium loading screen with real progress (manifest, fonts, logo, 3D chunks, key images) */
export default function Loader({ onDone }) {
  const [p, setP] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    const start = performance.now()
    const steps = { manifest: 0, fonts: 0, three: 0, images: 0 }
    const upd = () => alive && setP((steps.manifest + steps.fonts + steps.three + steps.images) / 4)
    const done = (k) => {
      steps[k] = 1
      upd()
    }
    const fontsP = (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 3500))]) : Promise.resolve()).then(() => done('fonts'))
    const threeP = Promise.race([preload3D(), new Promise((r) => setTimeout(r, 9000))]).then(() => done('three'))
    const manP = loadManifest().then(async () => {
      done('manifest')
      await preloadImages([asset('logo/logo'), asset('logo/emblem'), asset('shruthi-photos/light-1'), asset('shruthi-photos/portrait')])
      done('images')
    })
    Promise.all([fontsP, threeP, manP]).then(() => {
      const wait = Math.max(0, 1800 - (performance.now() - start))
      setTimeout(() => alive && setReady(true), wait)
    })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (ready) {
      setP(1)
      const t = setTimeout(onDone, 700)
      return () => clearTimeout(t)
    }
  }, [ready]) // eslint-disable-line

  const R = 52
  const C = 2 * Math.PI * R
  return (
    <motion.div className="absolute inset-0 z-[80] bg-ink flex flex-col items-center justify-center" initial={{ opacity: 1 }} animate={{ opacity: ready ? 0 : 1 }} transition={{ duration: 0.7, delay: 0.1 }}>
      <GoldDust count={40} mode="float" />
      <div className="relative" style={{ width: 'calc(var(--u)*34)', height: 'calc(var(--u)*34)' }}>
        <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(201,162,74,0.18)" strokeWidth="1.5" />
          <circle cx="60" cy="60" r={R} fill="none" stroke="url(#lg)" strokeWidth="2" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - Math.max(0.04, p))} style={{ transition: 'stroke-dashoffset .5s ease' }} />
          <defs>
            <linearGradient id="lg" x1="0" x2="1">
              <stop offset="0" stopColor="#E8D5A3" />
              <stop offset="1" stopColor="#E87524" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-[16%] flex items-center justify-center" style={{ animation: 'heartbeat 2.4s ease-in-out infinite' }}>
          {asset('logo/emblem') ? <Logo variant="emblem" className="w-full" /> : <div className="w-3 h-3 rounded-full bg-gold shadow-[0_0_24px_#E87524]" />}
        </div>
      </div>
      <div className="font-display fs-xs tracking-[0.45em] text-gold mt-8">LOADING THE KINGDOM</div>
      <div className="font-sans fs-xs text-champagne/40 mt-2 tracking-widest">{Math.round(p * 100)}%</div>
    </motion.div>
  )
}
