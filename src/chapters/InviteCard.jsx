import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, CalendarPlus, Clock, MapPin, Navigation, Phone, PartyPopper, Share2 } from 'lucide-react'
import GoldDust from '../components/GoldDust'
import Confetti from '../components/Confetti'
import { Logo } from '../components/Media'
import { Corner, Divider, Feather } from '../components/Ornaments'
import { ContinueBar, GoldButton } from '../components/UI'
import Wishes from '../features/Wishes'
import { BRAND, EVENT, mapsLink, timeLabel } from '../config/site'
import { downloadIcs } from '../lib/share'
import { showHints } from '../lib/assets'
import { audio } from '../lib/audio'
import { useStory } from '../story'

function Row({ icon: Icon, label, value, pending, hint }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gold/20 last:border-0">
      <div className="w-9 h-9 rounded-full border border-gold/50 flex items-center justify-center text-gold shrink-0"><Icon size={17} strokeWidth={1.5} /></div>
      <div className="text-left">
        <div className="font-display fs-xs tracking-[0.25em] text-ember">{label}</div>
        <div className={`fs-md mt-0.5 ${pending ? 'font-serif italic text-champagne/55' : 'font-serif text-champagne'}`}>{value}</div>
        {pending && showHints && <div className="text-[10px] text-ember/70">▸ {hint}</div>}
      </div>
    </div>
  )
}

export default function InviteCard() {
  const { next, openModal } = useStory()
  useEffect(() => {
    audio.sfx('celebrate')
  }, [])

  const venue = [EVENT.venueName, EVENT.address].filter(Boolean).join('\n')

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-none" style={{ background: '#090909', perspective: 1400 }}>
      <GoldDust count={40} mode="rise" color="255,200,110" />
      <Confetti runKey={1} duration={5000} />
      <div className="h-14" />

      {/* ───── the card ───── */}
      <div className="px-4 relative">
        <div className="matte relative rounded-[22px] overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(201,162,74,.9), 0 0 0 7px #090909, 0 0 0 8px rgba(201,162,74,.4), 0 20px 80px rgba(232,117,36,.25)' }}>
          {/* top panel */}
          <motion.div className="relative px-6 pt-10 pb-6 text-center" style={{ background: 'radial-gradient(80% 60% at 50% 0%, rgba(75,20,40,.75), transparent 75%)' }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4 }}>
            <Corner className="absolute top-3 left-3 w-14 h-14" />
            <Corner className="absolute top-3 right-3 w-14 h-14" style={{ transform: 'scaleX(-1)' }} />
            <Feather className="absolute top-6 left-2 w-12 opacity-80" rotate={-18} />
            <Feather className="absolute top-6 right-2 w-12 opacity-80" rotate={18} flip />
            <Logo variant="emblem" className="mx-auto" style={{ width: 'calc(var(--u)*22)' }} />
            <div className="font-display fs-xs tracking-[0.35em] text-champagne/80 mt-5">YOU ARE CORDIALLY INVITED</div>
            <Divider className="my-3" />
            <h1 className="font-display gold-text leading-none tracking-[0.08em]" style={{ fontSize: 'max(30px, calc(var(--u)*10))' }}>{BRAND.name}</h1>
            <div className="font-display text-champagne fs-sm tracking-[0.18em] mt-2">{BRAND.line2}</div>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="h-px w-10 bg-gold" />
              <span className="font-display text-ember fs-md tracking-[0.55em]">{BRAND.city}</span>
              <span className="h-px w-10 bg-gold" />
            </div>
            <div className="mt-6 inline-block rounded-full px-5 py-2 border border-gold/80" style={{ background: 'linear-gradient(180deg,#6a1c38,#4B1428)', boxShadow: '0 0 24px rgba(232,117,36,.35)' }}>
              <span className="font-display fs-xs tracking-[0.3em] text-champagne">GRAND OPENING CELEBRATION</span>
            </div>
          </motion.div>

          {/* bottom panel: unfolds */}
          <motion.div className="relative px-6 pb-8 pt-5" style={{ transformOrigin: 'top', borderTop: '1px solid rgba(201,162,74,.5)', background: 'linear-gradient(180deg, rgba(20,8,12,.95), rgba(9,9,9,.4))' }} initial={{ rotateX: -92, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ delay: 1.1, duration: 1.8, ease: [0.2, 0.7, 0.2, 1] }}>
            <div className="text-center">
              <div className="font-sans fs-xs tracking-[0.4em] text-champagne/50">FOUNDER</div>
              <div className="font-display gold-text fs-lg tracking-[0.1em] mt-1">{BRAND.founder}</div>
              <div className="font-serif italic text-champagne/80 fs-md">{BRAND.designation}</div>
            </div>
            <Divider className="my-4" />
            <Row icon={CalendarDays} label="OPENING DATE" value={EVENT.dateLabel} />
            <Row icon={Clock} label="OPENING TIME" value={timeLabel()} pending={!EVENT.time} hint="set EVENT.time in src/config/site.js" />
            <Row icon={MapPin} label="VENUE" value={<span className="whitespace-pre-line">{venue}</span>} />
            <Row icon={Phone} label="CONTACT" value={EVENT.contactNumber || 'To be shared soon'} pending={!EVENT.contactNumber} hint="set EVENT.contactNumber in src/config/site.js" />
            <div className="mt-5 flex flex-col gap-3">
              <GoldButton variant="solid" icon={PartyPopper} onClick={() => next()} className="fs-xs w-full">I’LL BE THERE!</GoldButton>
              <GoldButton icon={CalendarPlus} size="sm" onClick={downloadIcs} className="fs-xs w-full">ADD TO CALENDAR</GoldButton>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ───── location card ───── */}
      <motion.section className="px-4 mt-8" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9 }}>
        <div className="rounded-3xl border border-gold/60 overflow-hidden relative" style={{ background: 'linear-gradient(160deg,#1b0a12,#0c0808)', boxShadow: '0 0 40px rgba(232,117,36,.2)' }}>
          <div className="relative h-44 overflow-hidden" style={{ background: 'radial-gradient(60% 80% at 50% 60%, rgba(232,117,36,.28), transparent), #120a0b' }}>
            <svg viewBox="0 0 360 180" className="absolute inset-0 w-full h-full opacity-60">
              {Array.from({ length: 9 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 22 + 6} H360`} stroke="#C9A24A" strokeOpacity="0.14" />)}
              {Array.from({ length: 17 }, (_, i) => <path key={`v${i}`} d={`M${i * 22 + 6} 0 V180`} stroke="#C9A24A" strokeOpacity="0.14" />)}
              <path d="M-10 140 Q120 110 190 90 T380 40" stroke="#E87524" strokeOpacity="0.55" strokeWidth="6" fill="none" />
              <path d="M60 -10 Q110 90 150 190" stroke="#E8D5A3" strokeOpacity="0.28" strokeWidth="4" fill="none" />
            </svg>
            <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2">
              <span className="absolute -inset-4 rounded-full border-2 border-ember" style={{ animation: 'pinPulse 2s ease-out infinite' }} />
              <span className="absolute -inset-4 rounded-full border-2 border-ember" style={{ animation: 'pinPulse 2s ease-out 1s infinite' }} />
              <MapPin className="relative text-ember drop-shadow-[0_0_14px_#E87524]" fill="#E87524" fillOpacity="0.25" strokeWidth={1.6} style={{ width: 'calc(var(--u)*12)', height: 'calc(var(--u)*12)', animation: 'floatY 2.4s ease-in-out infinite' }} />
            </div>
          </div>
          <div className="p-5 text-center">
            <div className="font-display fs-xs tracking-[0.4em] text-ember">FIND US</div>
            <div className="font-display gold-text fs-lg tracking-[0.1em] mt-1">{EVENT.address.toUpperCase()}</div>
            <div className="font-serif italic text-champagne/70 fs-md mt-1">{BRAND.line2.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase())}</div>
            <div className="mt-4"><GoldButton variant="solid" icon={Navigation} href={mapsLink()} className="fs-xs w-full">TAKE ME TO CHENNAI</GoldButton></div>
          </div>
        </div>
      </motion.section>

      <Wishes />

      <div className="px-4 pb-32 text-center">
        <GoldButton onClick={() => next()} className="fs-xs">CONFIRM MY PRESENCE ›</GoldButton>
      </div>
    </div>
  )
}
