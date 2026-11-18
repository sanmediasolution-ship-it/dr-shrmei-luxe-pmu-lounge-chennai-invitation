import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Heart } from 'lucide-react'
import { GoldButton } from '../components/UI'
import { backendReady, fetchWishes, submitWish } from '../lib/backend'

/** "LEAVE YOUR BLESSINGS" — guests submit; only moderator-approved wishes float on screen */
export default function Wishes() {
  const [wishes, setWishes] = useState([])
  const [f, setF] = useState({ name: '', message: '', website: '' })
  const [err, setErr] = useState('')
  const [st, setSt] = useState('idle') // idle | sending | ok | noBackend

  useEffect(() => {
    fetchWishes().then(setWishes).catch(() => {})
  }, [])

  const send = async () => {
    setErr('')
    if (f.website) return // honeypot
    const name = f.name.trim()
    const message = f.message.trim()
    if (name.length < 2) return setErr('Please add your name.')
    if (message.length < 3) return setErr('Please write a short blessing.')
    if (message.length > 160) return setErr('Please keep it under 160 characters.')
    if (!backendReady) return setSt('noBackend')
    setSt('sending')
    try {
      await submitWish({ name, message })
      setSt('ok')
      setF({ name: '', message: '', website: '' })
    } catch {
      setSt('idle')
      setErr('We couldn’t send your blessing just now. Please try again.')
    }
  }

  return (
    <section className="px-5 py-8">
      <div className="text-center">
        <div className="font-display fs-xs tracking-[0.4em] text-ember">GOLDEN WISHES</div>
        <h3 className="font-display gold-text fs-xl mt-1 tracking-[0.12em]">LEAVE YOUR BLESSINGS</h3>
      </div>

      <div className="relative mt-5 rounded-2xl border border-gold/30 overflow-hidden" style={{ minHeight: 'calc(var(--u)*55)', background: 'radial-gradient(70% 60% at 50% 100%, rgba(232,117,36,.18), transparent), rgba(10,6,6,.6)' }}>
        {wishes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-champagne/55">
            <Heart className="text-gold/70 float-y" strokeWidth={1.2} size={34} />
            <p className="font-serif italic fs-md mt-3">Blessings from loved ones will float here. Be the first to wish her well.</p>
          </div>
        ) : (
          <div className="relative p-3 flex flex-col gap-3" style={{ minHeight: 'calc(var(--u)*55)' }}>
            {wishes.map((w, i) => (
              <motion.div
                key={w.id ?? i}
                className="max-w-[88%] rounded-2xl border border-gold/50 bg-gradient-to-br from-wine/70 to-black/70 px-4 py-2.5"
                style={{ alignSelf: i % 2 ? 'flex-end' : 'flex-start', boxShadow: '0 0 20px rgba(232,117,36,.18)' }}
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: (i % 5) * 0.4 }}
              >
                <div className="font-serif italic fs-md text-champagne leading-snug">“{w.message}”</div>
                <div className="font-display fs-xs tracking-[0.2em] text-gold mt-1">— {w.name}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {st === 'ok' ? (
        <div className="text-center mt-5 font-serif italic fs-md text-champagne">Thank you! Your blessing will appear once it has been approved. ✦</div>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          <input className="field" placeholder="Your name" value={f.name} maxLength={40} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" />
          <textarea className="field resize-none" rows={3} placeholder="Your congratulatory message…" value={f.message} maxLength={160} onChange={(e) => setF({ ...f, message: e.target.value })} />
          <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
          <div className="text-right text-xs text-champagne/40">{f.message.length}/160</div>
          {err && <div className="text-[#ff9a82] text-sm">{err}</div>}
          {st === 'noBackend' && <div className="rounded-xl border border-ember/60 bg-ember/10 p-3 text-sm text-champagne">The blessing wall isn’t switched on yet, so nothing was sent. Please try again later.</div>}
          <GoldButton icon={Send} onClick={send} disabled={st === 'sending'} className="fs-xs w-full">
            {st === 'sending' ? 'SENDING…' : 'SEND MY BLESSING'}
          </GoldButton>
        </div>
      )}
    </section>
  )
}
