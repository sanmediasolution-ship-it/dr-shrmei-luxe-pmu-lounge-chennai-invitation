import { useState } from 'react'
import { MessageCircle, Minus, Plus } from 'lucide-react'
import GoldDust from '../components/GoldDust'
import { GoldButton } from '../components/UI'
import { whatsappRsvpUrl } from '../lib/share'
import { rsvpState } from '../lib/rsvpState'
import { useStory } from '../story'

/** Guest count → opens WhatsApp to the host's number with a pre-filled message (never claims "sent") */
export default function RsvpStage() {
  const { next } = useStory()
  const [name, setName] = useState('')
  const [guests, setGuests] = useState(1)
  const [err, setErr] = useState('')
  const [opened, setOpened] = useState(false)

  rsvpState.name = name.trim()
  rsvpState.guests = guests
  const url = whatsappRsvpUrl({ name: name.trim(), guests, phone: '', attendance: 'yes' })
  const send = (e) => {
    if (name.trim().length < 2) {
      e.preventDefault()
      setErr('Please enter your name.')
      return
    }
    setErr('')
    setOpened(true)
  }

  return (
    <div className="absolute inset-0 overflow-y-auto scrollbar-none" style={{ background: 'radial-gradient(80% 50% at 50% 20%, rgba(232,117,36,.22), transparent 70%), #090909' }}>
      <GoldDust count={30} mode="rise" />
      <div className="relative min-h-full flex flex-col justify-center px-6 py-20">
        <div className="text-center">
          <div className="font-display fs-xs tracking-[0.4em] text-ember">RSVP</div>
          <h2 className="font-display gold-text fs-xl tracking-[0.12em] mt-1">I’LL BE THERE!</h2>
          <p className="font-serif italic text-champagne/80 fs-md mt-2">Tell us how many will join, and your reply goes straight to Dr. Shruthi on WhatsApp.</p>
        </div>
        <div className="mt-7 flex flex-col gap-4">
          <input className="field" placeholder="Your name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          <div className="rounded-xl border border-gold/40 px-4 py-3 flex items-center justify-between">
            <span className="font-display fs-xs tracking-[0.25em] text-champagne">NUMBER OF GUESTS</span>
            <div className="flex items-center gap-4">
              <button aria-label="fewer" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="w-9 h-9 rounded-full border border-gold/60 text-gold flex items-center justify-center"><Minus size={16} /></button>
              <span className="font-display gold-text fs-xl w-6 text-center">{guests}</span>
              <button aria-label="more" onClick={() => setGuests((g) => Math.min(10, g + 1))} className="w-9 h-9 rounded-full border border-gold/60 text-gold flex items-center justify-center"><Plus size={16} /></button>
            </div>
          </div>
          {err && <div className="text-[#ff9a82] text-sm">{err}</div>}
          <a href={url} target="_blank" rel="noopener noreferrer" onClick={send} className="gold-btn solid fs-xs w-full"><MessageCircle style={{ width: '1.15em', height: '1.15em' }} strokeWidth={1.6} /><span>SEND MY RSVP ON WHATSAPP</span></a>
          {opened && <div className="text-center text-champagne/70 text-sm">WhatsApp opened — press Send there to confirm your RSVP.</div>}
          <GoldButton onClick={() => next()} className="fs-xs w-full">{opened ? 'WATCH THE INVITATION VIDEO ›' : 'SKIP TO THE INVITATION VIDEO ›'}</GoldButton>
        </div>
      </div>
    </div>
  )
}
