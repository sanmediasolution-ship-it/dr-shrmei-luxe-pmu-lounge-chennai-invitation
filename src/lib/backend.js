/**
 * Supabase REST client (no SDK = smaller bundle).
 * Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example, supabase/schema.sql).
 * If they are not set, `backendReady` is false and the UI says so honestly —
 * it never shows a fake "success".
 */
const URL_ = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const backendReady = !!(URL_ && KEY)

const headers = (extra = {}) => ({
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  ...extra,
})

async function insert(table, row) {
  if (!backendReady) throw new Error('NOT_CONFIGURED')
  const res = await fetch(`${URL_}/rest/v1/${table}`, {
    method: 'POST',
    headers: headers({ Prefer: 'return=minimal' }),
    body: JSON.stringify(row),
  })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
}

export const submitRsvp = (row) => insert('rsvps', row)
export const submitWish = (row) => insert('wishes', { ...row, approved: false })

export async function fetchWishes() {
  if (!backendReady) return []
  const res = await fetch(
    `${URL_}/rest/v1/wishes?approved=eq.true&select=id,name,message&order=created_at.desc&limit=30`,
    { headers: headers() },
  )
  if (!res.ok) return []
  return res.json()
}
