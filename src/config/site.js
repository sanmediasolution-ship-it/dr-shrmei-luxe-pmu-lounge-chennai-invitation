/**
 * ───────────────────────────────────────────────────────────────
 *  EDIT THIS FILE to change event details. Nothing else is needed.
 * ───────────────────────────────────────────────────────────────
 */
export const BRAND = {
  film: 'THE BIRTH OF A SHRMEI',
  tagline: 'A DREAM BECOMES AN ART. AN ART BECOMES AN EMPIRE.',
  finalTagline: ['A DREAM BECOMES AN ART.', 'AN ART BECOMES AN EMPIRE.', 'AN EMPIRE EXPANDS TO CHENNAI.'],
  name: 'DR. SHRMEI’S',
  line2: 'LUXE PMU LOUNGE & ACADEMY',
  city: 'CHENNAI',
  founder: 'DR. M. SHRUTHI KEERTHANA',
  designation: 'Dentist | PMU Master',
}

export const EVENT = {
  // ✅ Supplied
  dateISO: '2026-12-06',
  dateLabel: 'Sunday, 6 December 2026',
  dateUpper: '6 DECEMBER 2026',
  address: 'Mogappair West, Chennai',

  // ⏳ Fill these in when you have them (leave '' until then — nothing is invented)
  time: '', // e.g. '10:00 AM'
  venueName: '', // e.g. 'Dr. Shrmei’s Luxe PMU Lounge & Academy'
  mapsUrl: '', // paste the real Google Maps share link. Empty = searches the address above.
  contactNumber: '', // shown on the card, e.g. '+91 98765 43210'
  whatsappNumber: '919025527391', // digits only with country code, e.g. '919876543210' (RSVP via WhatsApp goes here)
  shareUrl: '', // final deployed URL, e.g. 'https://shrmei-invite.vercel.app'. Empty = current page URL.
}

export const SHARE_MESSAGE = `You’re invited to witness a beautiful new beginning!

Dr. Shrmei’s Luxe PMU Lounge & Academy is expanding to Chennai.

Join us for our Grand Opening Celebration!

Let’s celebrate this special milestone together.`

/** EXACT Tamil dialogue, split into subtitle cues (joined text equals the original). */
export const TAMIL_CUES = [
  'சென்னையில் எங்களுடைய இரண்டாவது கிளையைத் தொடங்குகிறோம்.',
  'இந்த மகிழ்ச்சியான தருணத்தில், எங்களின் Grand Opening-க்கு உங்களை நான் அன்புடன் தனிப்பட்ட முறையில் வரவேற்கிறேன்.',
  'கண்டிப்பா வந்திருந்து வாழ்த்துங்கள்!',
]

/**
 * Optional exact subtitle timing in seconds, one [start, end] per cue.
 * null = timings are spread across the video length automatically.
 * Example: [[0.8, 4.2], [4.4, 11.0], [11.2, 14.5]]
 */
export const SUBTITLE_TIMES = null

/** Set true if the invitation video/voice is AI-generated, to show a small disclosure line. */
export const INVITE_IS_AI_GENERATED = true

export function mapsLink() {
  if (EVENT.mapsUrl) return EVENT.mapsUrl
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [EVENT.venueName, EVENT.address].filter(Boolean).join(', '),
  )}`
}

export function timeLabel() {
  return EVENT.time || 'Time to be announced'
}
