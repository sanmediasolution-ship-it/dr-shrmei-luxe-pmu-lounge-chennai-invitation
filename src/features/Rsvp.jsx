import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Minus, Plus, Send, AlertTriangle, MessageCircle } from 'lucide-react'
import Sheet from './Sheet'
import Confetti from '../components/Confetti'
import { GoldButton } from '../components/UI'
import { backendReady, submitRsvp } from '../lib/backend'
import { whatsappRsvpUrl } from '../lib/share'
import { EVENT } from '../config/site'
import { audio } from '../lib/audio'

const ATT = [
  { v: 'yes', t: 'I’LL BE THERE!' },
  { v: 'maybe', t: 'I’LL TRY MY BEST' },
  { v: 'no', t: 'CAN’T MAKE IT' },
]

export function validate(f) {
  const e = {}
  const name = f.name.trim()
  if (name.length < 2) e.name = 'Please enter your name.'
  else if (name.length > 60) e.name = 'Name is too long.'
  const digits = f.phone.replace(/[^\d]/g, '')
  const local = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits.length === 11 && digits.startsWith('0') ? digits.slice(1) : digits
  if (!/^[6-9]\d{9}$/.test(local) && !(digits.length >= 8 && digits.length <= 15 && f.phone.trim().startsWith('+') && !f.phone.trim().startsWith('+91'))) e.phone = 'Enter a valid 10-digit mobile number.'
  if (!(f.guests >= 1 && f.guests <= 10)) e.guests = 'Guests must be between 1 and 10.'
  if (!f.attendance) e.attendance = 'Please choose one.'
  return e
}

export default function Rsvp({ open, onClose }) {
  const [f, setF] = useState({ name: '', guests: 1, phone: '', attendance: 'yes' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ s: 'idle', msg: '' }) // idle | sending | ok | err | noBackend
  const [boom, setBoom] = useState(0)

  const set = (k, v) => {
    setF((o) => ({ ...o, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const check = () => {
    const e = validate(f)
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const confirm = async () => {
    if (!check()) return
    if (!backendReady) {
      setStatus({ s: 'noBackend', msg: '' })
      return
    }
    setStatus({ s: 'sending', msg: '' })
    try {
      await submitRsvp({ name: f.name.trim(), guests: f.guests, phone: f.phone.trim(), attendance: f.attendance })
      setStatus({ s: 'ok', msg: '' })
      setBoom((b) => b + 1)
      audio.sfx('celebrate')
    } catch (err) {
      setStatus({ s: 'err', msg: 'We couldn’t save your RSVP just now. Please try again, or send it on WhatsApp.' })
    }
  }

  const wa = () => {
    if (!check()) return
    window.open(whatsappRsvpUrl({ ...f, name: f.name.trim(), phone: f.phone.trim() }), '_blank', 'noopener')
  }

  return (
    <Sheet open={open} onClose={onClose} title="I’LL BE THERE!">
      {boom > 0 && <Confetti runKey={boom} />}
      {status.s === 'ok' ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
          <div className="mx-auto w-16 h-16 rounded-full border border-gold flex items-center justify-center text-gold shadow-[0_0_30px_#E87524]">
            <Check size={30} />
          </div>
          <div className="font-display gold-text fs-lg mt-5 tracking-[0.15em]">THANK YOU, {f.name.trim().split(' ')[0].toUpperCase()}</div>
          <p className="font-serif italic fs-md text-champagne/80 mt-3">Your response has been received. We can’t wait to celebrate with you on {EVENT.dateLabel}.</p>
          <div className="mt-6"><GoldButton onClick={onClose}>CLOSE</GoldButton></div>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="font-serif italic fs-md text-champagne/80 text-center">Grand Opening · {EVENT.dateLabel} · {EVENT.address}</p>

          <label className="block">
            <span className="font-display fs-xs tracking-[0.25em] text-gold">GUEST NAME</span>
            <input className={`field mt-1.5 ${errors.name ? 'err' : ''}`} value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Your full name" autoComplete="name" maxLength={60} />
            {errors.name && <span className="text-[#ff9a82] text-sm">{errors.name}</span>}
          </label>

          <div>
            <span className="font-display fs-xs tracking-[0.25em] text-gold">NUMBER OF GUESTS</span>
            <div className="mt-1.5 flex items-center justify-between rounded-xl border border-gold/45 bg-black/60 px-2 py-1.5">
              <button aria-label="Fewer guests" className="w-11 h-11 rounded-full border border-gold/50 text-gold flex items-center justify-center" onClick={() => set('guests', Math.max(1, f.guests - 1))}><Minus size={18} /></button>
              <span className="font-display gold-text fs-xl">{f.guests}</span>
              <button aria-label="More guests" className="w-11 h-11 rounded-full border border-gold/50 text-gold flex items-center justify-center" onClick={() => set('guests', Math.min(10, f.guests + 1))}><Plus size={18} /></button>
            </div>
            {errors.guests && <span className="text-[#ff9a82] text-sm">{errors.guests}</span>}
          </div>

          <label className="block">
            <span className="font-display fs-xs tracking-[0.25em] text-gold">PHONE NUMBER</span>
            <input className={`field mt-1.5 ${errors.phone ? 'err' : ''}`} value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="98765 43210" inputMode="tel" autoComplete="tel" maxLength={18} />
            {errors.phone && <span className="text-[#ff9a82] text-sm">{errors.phone}</span>}
          </label>

          <div>
            <span className="font-display fs-xs tracking-[0.25em] text-gold">ATTENDANCE</span>
            <div className="mt-1.5 grid grid-cols-1 gap-2" role="radiogroup">
              {ATT.map((a) => (
                <button key={a.v} role="radio" aria-checked={f.attendance === a.v} onClick={() => set('attendance', a.v)} className={`rounded-xl border px-4 py-3 text-left font-display tracking-[0.18em] fs-xs transition ${f.attendance === a.v ? 'border-ember bg-ember/15 text-champagne shadow-[0_0_20px_rgba(232,117,36,.35)]' : 'border-gold/35 text-champagne/60'}`}>
                  {f.attendance === a.v ? '✦ ' : ''}{a.t}
                </button>
              ))}
            </div>
          </div>

          {status.s === 'noBackend' && (
            <div className="rounded-xl border border-ember/60 bg-ember/10 p-3 flex gap-3 text-sm text-champagne">
              <AlertTriangle className="text-ember shrink-0" size={20} />
              <span>Online RSVP isn’t connected yet, so nothing was saved. Please tap <b>Send my RSVP on WhatsApp</b> below to confirm your presence.</span>
            </div>
          )}
          {status.s === 'err' && (
            <div className="rounded-xl border border-ember/60 bg-ember/10 p-3 flex gap-3 text-sm text-champagne">
              <AlertTriangle className="text-ember shrink-0" size={20} />
              <span>{status.msg}</span>
            </div>
          )}

          <GoldButton variant="solid" icon={Send} onClick={confirm} disabled={status.s === 'sending'} className="fs-xs w-full">
            {status.s === 'sending' ? 'SENDING…' : 'CONFIRM MY PRESENCE'}
          </GoldButton>
          <GoldButton icon={MessageCircle} onClick={wa} className="fs-xs w-full">
            SEND MY RSVP ON WHATSAPP
          </GoldButton>
        </div>
      )}
    </Sheet>
  )
}
