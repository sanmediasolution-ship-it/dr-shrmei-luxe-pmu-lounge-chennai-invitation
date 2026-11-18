import { BRAND, EVENT, SHARE_MESSAGE, mapsLink, timeLabel } from '../config/site'

export function inviteUrl() {
  if (EVENT.shareUrl) return EVENT.shareUrl
  const u = new URL(window.location.href)
  u.search = ''
  u.hash = ''
  return u.toString()
}

export const shareText = () =>
  `${SHARE_MESSAGE}\n\n📅 ${EVENT.dateLabel}\n📍 ${EVENT.address}\n\n${inviteUrl()}`

export const whatsappShareUrl = () => `https://wa.me/?text=${encodeURIComponent(shareText())}`

export async function nativeShare() {
  if (!navigator.share) return false
  try {
    await navigator.share({ title: `${BRAND.film} — Grand Opening`, text: SHARE_MESSAGE, url: inviteUrl() })
    return true
  } catch {
    return false
  }
}

export async function copyLink() {
  const url = inviteUrl()
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    const t = document.createElement('textarea')
    t.value = url
    t.style.position = 'fixed'
    t.style.opacity = '0'
    document.body.appendChild(t)
    t.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      /* ignore */
    }
    t.remove()
    return ok
  }
}

export function whatsappRsvpUrl({ name, guests, phone, attendance }) {
  const status = { yes: 'I’ll be there!', maybe: 'I’ll try my best to come', no: 'Sorry, I can’t make it' }[attendance]
  const msg = `Hello Dr. Shruthi! ${status}\n\nGrand Opening — Dr. Shrmei’s Luxe PMU Lounge & Academy, Chennai\n📅 ${EVENT.dateLabel}\n\n${name ? `Name: ${name}\n` : ''}Guests: ${guests}${phone && phone !== '—' ? `\nPhone: ${phone}` : ''}`
  const base = EVENT.whatsappNumber ? `https://wa.me/${EVENT.whatsappNumber}` : 'https://wa.me/'
  return `${base}?text=${encodeURIComponent(msg)}`
}

/** Download a calendar (.ics) file for the opening */
export function downloadIcs() {
  const d = EVENT.dateISO.replace(/-/g, '')
  const next = new Date(EVENT.dateISO)
  next.setDate(next.getDate() + 1)
  const dEnd = next.toISOString().slice(0, 10).replace(/-/g, '')
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Birth of a Shrmei//EN',
    'BEGIN:VEVENT',
    `UID:shrmei-grand-opening-${d}@invite`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${d}`,
    `DTEND;VALUE=DATE:${dEnd}`,
    `SUMMARY:Grand Opening — Dr. Shrmei’s Luxe PMU Lounge & Academy, Chennai`,
    `LOCATION:${EVENT.address}`,
    `DESCRIPTION:${timeLabel()}. Map: ${mapsLink()}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'Shrmei-Grand-Opening.ics'
  document.body.appendChild(a)
  a.click()
  a.remove()
}
