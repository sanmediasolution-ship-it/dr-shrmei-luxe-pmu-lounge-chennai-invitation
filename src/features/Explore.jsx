import { useState } from 'react'
import { motion } from 'framer-motion'
import { Armchair, BedDouble, Fingerprint, GraduationCap, Sparkles } from 'lucide-react'
import Sheet from './Sheet'
import { Logo } from '../components/Media'
import { Divider } from '../components/Ornaments'
import { asset, assetGroup } from '../lib/assets'
import { BRAND } from '../config/site'
import { audio } from '../lib/audio'

const TABS = [
  { id: 'lounge', label: 'PMU LOUNGE', icon: Sparkles, prefix: 'chennai/lounge-' },
  { id: 'academy', label: 'ACADEMY', icon: GraduationCap, prefix: 'chennai/academy-' },
  { id: 'rooms', label: 'TREATMENT ROOMS', icon: BedDouble, prefix: 'chennai/treatment-' },
  { id: 'reception', label: 'RECEPTION', icon: Armchair, prefix: 'chennai/reception-' },
  { id: 'brand', label: 'BRAND IDENTITY', icon: Fingerprint },
]
const PALETTE = [
  ['Premium Black', '#090909'],
  ['Antique Gold', '#C9A24A'],
  ['Luxury Orange', '#E87524'],
  ['Burgundy', '#4B1428'],
  ['Champagne Gold', '#E8D5A3'],
]

function Gallery({ tab }) {
  const imgs = assetGroup(tab.prefix)
  if (!imgs.length) {
    return (
      <div className="rounded-2xl border border-gold/40 overflow-hidden aspect-[4/5] flex flex-col items-center justify-center text-center px-8" style={{ background: 'radial-gradient(70% 55% at 50% 38%, rgba(232,117,36,.25), transparent 70%), linear-gradient(160deg,#2a0c18,#0c0707)' }}>
        <tab.icon className="text-gold float-y" strokeWidth={1} style={{ width: 'calc(var(--u)*16)', height: 'calc(var(--u)*16)' }} />
        <div className="font-display fs-sm tracking-[0.3em] text-champagne mt-4">{tab.label}</div>
        <p className="font-serif italic fs-md text-champagne/65 mt-2">Being unveiled soon — photographs of the new Chennai space will appear here.</p>
      </div>
    )
  }
  return (
    <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-5 px-5">
      {imgs.map((src, i) => (
        <motion.div key={src} className="snap-center shrink-0 w-[86%] aspect-[4/5] rounded-2xl overflow-hidden border border-gold/60" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
          <img src={src} alt={`${tab.label} ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" draggable="false" />
        </motion.div>
      ))}
    </div>
  )
}

function Brand() {
  return (
    <div className="text-center">
      <Logo variant="mark" className="mx-auto" style={{ width: 'calc(var(--u)*50)' }} />
      <Divider className="my-4" />
      <div className="font-display gold-text fs-lg tracking-[0.12em]">{BRAND.name}</div>
      <div className="font-display fs-xs tracking-[0.25em] text-champagne">{BRAND.line2}</div>
      <div className="font-display fs-xs tracking-[0.5em] text-ember mt-1">{BRAND.city}</div>
      <div className="grid grid-cols-5 gap-2 mt-6">
        {PALETTE.map(([n, c]) => (
          <div key={c} className="text-center">
            <div className="aspect-square rounded-xl border border-gold/40" style={{ background: c }} />
            <div className="mt-1 text-[9px] leading-tight text-champagne/70">{n}</div>
            <div className="text-[9px] text-champagne/40">{c}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-gold/30 p-4">
        <div className="font-display gold-text fs-xl">Aa</div>
        <div className="font-display text-xs tracking-[0.2em] text-champagne/70">Cinzel · headings</div>
        <div className="font-serif italic text-champagne/80 mt-1">Cormorant Garamond · storytelling</div>
        <div className="font-sans text-sm text-champagne/70 mt-1">Jost · body text</div>
        <div className="tamil text-sm text-champagne/70 mt-1">Noto Sans Tamil · தமிழ் வசனம்</div>
      </div>
      <p className="font-serif italic fs-md text-champagne/75 mt-5">“A dream becomes an art. An art becomes an empire.”</p>
    </div>
  )
}

export default function Explore({ open, onClose }) {
  const [tab, setTab] = useState('lounge')
  const cur = TABS.find((t) => t.id === tab)
  return (
    <Sheet open={open} onClose={onClose} title="EXPLORE THE KINGDOM" tall>
      <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-5 px-5 pb-3 sticky top-0 z-10" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => { audio.sfx('tap'); setTab(t.id) }} className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3.5 py-2 font-display fs-xs tracking-[0.15em] transition ${tab === t.id ? 'border-ember bg-ember/20 text-champagne' : 'border-gold/35 text-champagne/55 bg-black/50'}`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>
      <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-2">
        {cur.id === 'brand' ? <Brand /> : <Gallery tab={cur} />}
      </motion.div>
    </Sheet>
  )
}
