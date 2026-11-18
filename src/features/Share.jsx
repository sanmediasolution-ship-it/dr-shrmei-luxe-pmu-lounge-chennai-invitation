import { useState } from 'react'
import { Copy, Camera, MessageCircle, Share2, Check } from 'lucide-react'
import Sheet from './Sheet'
import { GoldButton } from '../components/UI'
import { copyLink, inviteUrl, nativeShare, whatsappShareUrl } from '../lib/share'
import { SHARE_MESSAGE } from '../config/site'

export default function Share({ open, onClose }) {
  const [note, setNote] = useState('')
  const flash = (t) => {
    setNote(t)
    setTimeout(() => setNote(''), 3200)
  }
  const canNative = typeof navigator !== 'undefined' && !!navigator.share

  const insta = async () => {
    const ok = await copyLink()
    flash(ok ? 'Link copied — paste it in your Instagram story, post or DM.' : 'Copy the link manually: ' + inviteUrl())
    window.open('https://www.instagram.com/', '_blank', 'noopener')
  }
  const copy = async () => {
    const ok = await copyLink()
    flash(ok ? 'Invitation link copied!' : 'Couldn’t copy automatically: ' + inviteUrl())
  }

  return (
    <Sheet open={open} onClose={onClose} title="SHARE THE INVITATION">
      <p className="font-serif italic fs-md text-champagne/80 text-center whitespace-pre-line mb-5">{SHARE_MESSAGE}</p>
      <div className="flex flex-col gap-3">
        <GoldButton variant="solid" icon={MessageCircle} href={whatsappShareUrl()} className="fs-xs w-full">WHATSAPP</GoldButton>
        <GoldButton icon={Camera} onClick={insta} className="fs-xs w-full">INSTAGRAM</GoldButton>
        <GoldButton icon={Copy} onClick={copy} className="fs-xs w-full">COPY LINK</GoldButton>
        {canNative && (
          <GoldButton icon={Share2} onClick={() => nativeShare()} className="fs-xs w-full">MORE · NATIVE SHARE</GoldButton>
        )}
      </div>
      {note && (
        <div className="mt-4 rounded-xl border border-gold/50 bg-black/60 p-3 text-sm text-champagne flex gap-2 items-start">
          <Check size={18} className="text-ember shrink-0 mt-0.5" />
          <span className="break-words">{note}</span>
        </div>
      )}
    </Sheet>
  )
}
