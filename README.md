# THE BIRTH OF A SHRMEI — Chennai Grand Opening invitation

React + Vite + R3F + Framer Motion + Tailwind. Deploy: `npm i && npm run build` → Vercel (framework: Vite, output `dist`).

## Fill in event details — `src/config/site.js`
`EVENT.time`, `venueName`, `mapsUrl`, `contactNumber`, `whatsappNumber`, `shareUrl` (empty = shown honestly as "to be announced"; nothing is invented).
Date (6 Dec 2026) and address (Mogappair West, Chennai) are already set.

## Replace assets — drop files in `public/assets/` (auto-detected, no code change)
- `logo/` logo.png, emblem.png, logo-full.png
- `shruthi-photos/` light-1, light-2, portrait, royal, ribbon-cutting (.webp/.jpg/.png)
- `shruthi-video/` **invitation.mp4** (her real Tamil to-camera message) and optional `voice.mp3`; teaser.mp4 is the fallback
- `chennai/` entrance, interior, signage, reception, treatment-1, academy-1 … (real branch photos)
- `studio/` before, after, and studio photos; `pmu-tools/`, `treasure/`, `peacock/`
- `music/` opening, palace, chennai, celebration, personal (.mp3); `sound-effects/` door, unlock, treasure, peacock, transform, whoosh, sparkle, crown, scissor, celebrate, chime, tap, heartbeat
Missing audio falls back to synthesized placeholders. Add `?setup=1` to the URL to see hints for missing files. `npm run optimize` converts images to webp.

## RSVP & Golden Wishes (Supabase)
Run `supabase/schema.sql`, copy `.env.example` to `.env`, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (also in Vercel env vars). Wishes appear only after you set `approved = true`. Without keys the site says so honestly; WhatsApp RSVP still works once `whatsappNumber` is set.
