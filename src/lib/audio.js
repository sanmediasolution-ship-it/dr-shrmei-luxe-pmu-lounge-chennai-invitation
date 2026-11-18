/**
 * Audio manager.
 *  - Starts only after a user gesture (audio.unlock()).
 *  - Music beds:  public/assets/music/{opening,palace,chennai,celebration,personal}.mp3
 *  - SFX files:   public/assets/sound-effects/{treasure,peacock,transform,door,unlock,whoosh,crown,scissor,celebrate,sparkle,heartbeat}.mp3
 *  - Any file you don't supply is replaced by a synthesized WebAudio placeholder,
 *    so the experience is never silent. Real files always win.
 */
import { asset } from './assets'

const MUSIC = {
  opening: { root: 73.42, chord: [1, 1.5, 2, 3], bells: [2, 2.38, 3, 3.56, 4.5], rate: 2.8, bright: 650, level: 0.9 },
  palace: { root: 98, chord: [1, 1.2, 1.5, 2, 2.4], bells: [2, 2.4, 3, 3.6, 4, 4.8], rate: 1.9, bright: 1100, level: 0.9 },
  chennai: { root: 130.81, chord: [1, 1.25, 1.5, 2], bells: [2, 2.5, 3, 4, 5], rate: 1.3, bright: 2400, level: 0.9 },
  celebration: { root: 146.83, chord: [1, 1.25, 1.5, 2, 2.5], bells: [2, 2.5, 3, 4, 5, 6], rate: 0.55, bright: 3200, level: 0.9 },
  personal: { root: 110, chord: [1, 1.5, 2, 3], bells: [2, 3, 4, 5], rate: 3.4, bright: 900, level: 0.8 },
}

class AudioManager {
  constructor() {
    this.ctx = null
    this.muted = false
    this.volume = 0.75
    this.music = null
    this.hb = null
    this.subs = new Set()
  }

  subscribe(fn) {
    this.subs.add(fn)
    return () => this.subs.delete(fn)
  }
  emit() {
    this.subs.forEach((f) => f({ muted: this.muted, volume: this.volume, ready: !!this.ctx }))
  }

  async unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return false
      this.ctx = new AC()
      const c = this.ctx
      this.master = c.createGain()
      this.musicBus = c.createGain()
      this.sfxBus = c.createGain()
      const comp = c.createDynamicsCompressor()
      this.musicBus.connect(this.master)
      this.sfxBus.connect(this.master)
      this.master.connect(comp)
      comp.connect(c.destination)
      const len = c.sampleRate * 2
      this.noise = c.createBuffer(1, len, c.sampleRate)
      const d = this.noise.getChannelData(0)
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
      this.applyVolume()
      document.addEventListener('visibilitychange', () => {
        if (!this.ctx) return
        if (document.hidden) this.ctx.suspend()
        else if (!this.muted) this.ctx.resume()
      })
    }
    if (this.ctx.state !== 'running') {
      try {
        await this.ctx.resume()
      } catch {
        /* ignore */
      }
    }
    this.emit()
    return true
  }

  applyVolume() {
    if (!this.ctx) return
    this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.06)
  }
  setMuted(m) {
    this.muted = m
    this.applyVolume()
    this.emit()
  }
  toggleMute() {
    this.setMuted(!this.muted)
  }
  setVolume(v) {
    this.volume = v
    if (v > 0 && this.muted) this.muted = false
    this.applyVolume()
    this.emit()
  }

  /* ───────────── music ───────────── */
  playMusic(key, { level = 1, fade = 2.2 } = {}) {
    if (!this.ctx) return
    if (this.music && this.music.key === key) return this.setMusicLevel(level, fade)
    if (this.music) this.stopTrack(this.music, fade)
    this.music = this.startTrack(key, level, fade)
  }

  setMusicLevel(level, fade = 1.2) {
    if (!this.ctx || !this.music) return
    const g = this.music.gain.gain
    const t = this.ctx.currentTime
    g.cancelScheduledValues(t)
    g.setValueAtTime(g.value, t)
    g.linearRampToValueAtTime(level, t + fade)
    this.music.level = level
  }

  stopMusic(fade = 2) {
    if (this.music) this.stopTrack(this.music, fade)
    this.music = null
  }

  startTrack(key, level, fade) {
    const c = this.ctx
    const gain = c.createGain()
    gain.gain.setValueAtTime(0, c.currentTime)
    gain.connect(this.musicBus)
    const track = { key, gain, level, stops: [] }
    const url = asset(`music/${key}`)
    if (url) {
      const el = new Audio(url)
      el.loop = true
      el.preload = 'auto'
      el.setAttribute('playsinline', '')
      const src = c.createMediaElementSource(el)
      src.connect(gain)
      el.play().catch(() => {})
      track.stops.push(() => {
        el.pause()
        src.disconnect()
      })
    } else {
      track.stops.push(this.synthBed(key, gain))
    }
    gain.gain.linearRampToValueAtTime(level, c.currentTime + fade)
    return track
  }

  stopTrack(track, fade) {
    const c = this.ctx
    const g = track.gain.gain
    g.cancelScheduledValues(c.currentTime)
    g.setValueAtTime(g.value, c.currentTime)
    g.linearRampToValueAtTime(0, c.currentTime + fade)
    setTimeout(() => {
      track.stops.forEach((s) => s())
      track.gain.disconnect()
    }, fade * 1000 + 200)
  }

  synthBed(key, dest) {
    const c = this.ctx
    const cfg = MUSIC[key] || MUSIC.palace
    const nodes = []
    const lp = c.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = cfg.bright
    lp.Q.value = 0.6
    const bus = c.createGain()
    bus.gain.value = 0.09
    lp.connect(bus)
    bus.connect(dest)
    const lfo = c.createOscillator()
    const lfoG = c.createGain()
    lfo.frequency.value = 0.07
    lfoG.gain.value = cfg.bright * 0.35
    lfo.connect(lfoG)
    lfoG.connect(lp.frequency)
    lfo.start()
    nodes.push(lfo)
    cfg.chord.forEach((r, i) => {
      ;[-6, 6].forEach((det) => {
        const o = c.createOscillator()
        o.type = i % 2 ? 'triangle' : 'sawtooth'
        o.frequency.value = cfg.root * r
        o.detune.value = det
        const g = c.createGain()
        g.gain.value = 0.35 / cfg.chord.length
        o.connect(g)
        g.connect(lp)
        o.start()
        nodes.push(o)
      })
    })
    const sub = c.createOscillator()
    const sg = c.createGain()
    sub.frequency.value = cfg.root / 2
    sg.gain.value = 0.5
    sub.connect(sg)
    sg.connect(bus)
    sub.start()
    nodes.push(sub)
    const timer = setInterval(() => {
      if (c.state !== 'running') return
      const f = cfg.root * cfg.bells[Math.floor(Math.random() * cfg.bells.length)]
      this.bell(f, 0, 0.05 + Math.random() * 0.04, dest)
    }, cfg.rate * 1000)
    return () => {
      clearInterval(timer)
      nodes.forEach((n) => {
        try {
          n.stop()
        } catch {
          /* ignore */
        }
      })
    }
  }

  /* ───────────── primitives ───────────── */
  tone({ f = 440, type = 'sine', t = 0, d = 0.5, g = 0.2, to = null, a = 0.01, dest }) {
    const c = this.ctx
    const now = c.currentTime + t
    const o = c.createOscillator()
    const e = c.createGain()
    o.type = type
    o.frequency.setValueAtTime(f, now)
    if (to) o.frequency.exponentialRampToValueAtTime(to, now + d)
    e.gain.setValueAtTime(0.0001, now)
    e.gain.exponentialRampToValueAtTime(g, now + a)
    e.gain.exponentialRampToValueAtTime(0.0001, now + d)
    o.connect(e)
    e.connect(dest || this.sfxBus)
    o.start(now)
    o.stop(now + d + 0.05)
  }
  bell(f, t = 0, g = 0.1, dest) {
    this.tone({ f, t, d: 2.4, g, a: 0.005, dest })
    this.tone({ f: f * 2.01, t, d: 1.2, g: g * 0.4, a: 0.005, dest })
    this.tone({ f: f * 3.02, t, d: 0.6, g: g * 0.2, a: 0.005, dest })
  }
  noiseBurst({ t = 0, d = 1, g = 0.2, from = 400, to = 4000, q = 1, type = 'bandpass' }) {
    const c = this.ctx
    const now = c.currentTime + t
    const s = c.createBufferSource()
    s.buffer = this.noise
    s.loop = true
    const f = c.createBiquadFilter()
    f.type = type
    f.Q.value = q
    f.frequency.setValueAtTime(from, now)
    f.frequency.exponentialRampToValueAtTime(to, now + d)
    const e = c.createGain()
    e.gain.setValueAtTime(0.0001, now)
    e.gain.exponentialRampToValueAtTime(g, now + d * 0.4)
    e.gain.exponentialRampToValueAtTime(0.0001, now + d)
    s.connect(f)
    f.connect(e)
    e.connect(this.sfxBus)
    s.start(now)
    s.stop(now + d + 0.05)
  }

  /* ───────────── heartbeat ───────────── */
  startHeartbeat() {
    if (!this.ctx || this.hb) return
    const url = asset('sound-effects/heartbeat')
    if (url) {
      const el = new Audio(url)
      el.loop = true
      const src = this.ctx.createMediaElementSource(el)
      src.connect(this.sfxBus)
      el.play().catch(() => {})
      this.hb = () => {
        el.pause()
        src.disconnect()
      }
      return
    }
    const beat = () => {
      if (this.ctx.state !== 'running') return
      this.tone({ f: 62, to: 36, d: 0.34, g: 0.75, a: 0.012 })
      this.tone({ f: 58, to: 34, d: 0.3, g: 0.5, a: 0.012, t: 0.3 })
      this.noiseBurst({ d: 0.18, g: 0.05, from: 180, to: 90, type: 'lowpass' })
    }
    beat()
    const id = setInterval(beat, 1050)
    this.hb = () => clearInterval(id)
  }
  stopHeartbeat() {
    if (this.hb) this.hb()
    this.hb = null
  }

  /* ───────────── sfx ───────────── */
  sfx(key) {
    if (!this.ctx) return
    const url = asset(`sound-effects/${key}`)
    if (url) {
      const el = new Audio(url)
      const src = this.ctx.createMediaElementSource(el)
      src.connect(this.sfxBus)
      el.play().catch(() => {})
      el.onended = () => src.disconnect()
      return
    }
    const fn = SYNTH_SFX[key]
    if (fn) fn(this)
  }
}

const SYNTH_SFX = {
  tap: (a) => a.tone({ f: 1250, d: 0.07, g: 0.05 }),
  chime: (a) => a.bell(880, 0, 0.09),
  door: (a) => {
    a.noiseBurst({ d: 3.2, g: 0.5, from: 90, to: 320, type: 'lowpass' })
    a.tone({ f: 56, to: 38, d: 3.2, g: 0.35, type: 'sawtooth', a: 0.4 })
    a.tone({ f: 190, to: 120, d: 1.8, g: 0.05, type: 'sawtooth', a: 0.3, t: 0.3 })
    a.tone({ f: 48, d: 1.4, g: 0.6, t: 2.4 })
  },
  unlock: (a) => {
    a.tone({ f: 900, d: 0.06, g: 0.1, type: 'square' })
    a.tone({ f: 640, d: 0.08, g: 0.1, type: 'square', t: 0.2 })
    a.noiseBurst({ d: 0.12, g: 0.12, from: 2500, to: 6000, t: 0.2, type: 'highpass' })
    a.bell(1568, 0.45, 0.07)
  },
  treasure: (a) => {
    ;[523, 659, 784, 1047, 1319, 1568, 2093].forEach((f, i) => a.bell(f, i * 0.1, 0.07))
    a.noiseBurst({ d: 1.8, g: 0.28, from: 600, to: 7000 })
    a.tone({ f: 120, to: 260, d: 2.2, g: 0.2, a: 0.8, type: 'triangle' })
  },
  peacock: (a) => {
    for (let i = 0; i < 12; i++) a.bell(1200 + Math.random() * 2400, i * 0.16, 0.04)
    ;[220, 277.2, 329.6, 440].forEach((f) => a.tone({ f, d: 3.4, g: 0.07, a: 1.2, type: 'triangle' }))
    a.noiseBurst({ d: 2.4, g: 0.12, from: 2000, to: 9000, type: 'highpass' })
  },
  transform: (a) => {
    a.tone({ f: 90, to: 900, d: 2.4, g: 0.1, type: 'sawtooth', a: 1.4 })
    a.noiseBurst({ d: 2.2, g: 0.3, from: 300, to: 8000 })
    ;[392, 523, 659, 784, 1047].forEach((f, i) => a.bell(f, 1.4 + i * 0.08, 0.09))
    a.tone({ f: 52, d: 1.8, g: 0.55, t: 2.2 })
  },
  whoosh: (a) => a.noiseBurst({ d: 1.3, g: 0.28, from: 300, to: 5500 }),
  sparkle: (a) => {
    for (let i = 0; i < 4; i++) a.bell(1500 + Math.random() * 2200, i * 0.07, 0.04)
  },
  crown: (a) => {
    ;[1318, 1046, 880, 659].forEach((f, i) => a.bell(f, i * 0.22, 0.08))
    a.tone({ f: 70, to: 40, d: 1.4, g: 0.5, t: 0.9 })
    a.noiseBurst({ d: 1.2, g: 0.12, from: 4000, to: 9000, t: 0.8, type: 'highpass' })
  },
  scissor: (a) => {
    a.noiseBurst({ d: 0.12, g: 0.25, from: 3000, to: 9000, type: 'highpass' })
    a.noiseBurst({ d: 0.1, g: 0.25, from: 3500, to: 9500, type: 'highpass', t: 0.13 })
  },
  celebrate: (a) => {
    ;[261.6, 329.6, 392, 523.3].forEach((f) => a.tone({ f, d: 1.8, g: 0.12, type: 'triangle', a: 0.02 }))
    a.noiseBurst({ d: 1.4, g: 0.3, from: 1500, to: 9000, type: 'highpass' })
    ;[1046, 1318, 1568, 2093].forEach((f, i) => a.bell(f, 0.2 + i * 0.12, 0.07))
    a.tone({ f: 60, to: 38, d: 0.9, g: 0.6 })
  },
}

export const audio = new AudioManager()
