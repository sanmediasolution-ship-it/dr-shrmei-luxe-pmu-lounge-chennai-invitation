import * as THREE from 'three'

export function canvasTex(w, h, draw) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

const goldGrad = (g, x0, y0, x1, y1) => {
  const gr = g.createLinearGradient(x0, y0, x1, y1)
  gr.addColorStop(0, '#f6e2a0')
  gr.addColorStop(0.35, '#c9a24a')
  gr.addColorStop(0.6, '#8a6a22')
  gr.addColorStop(1, '#e8c66a')
  return gr
}

/** Ornate burgundy + gold palace door leaf */
export function doorTexture() {
  return canvasTex(512, 1024, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, w, h)
    bg.addColorStop(0, '#2a0a16')
    bg.addColorStop(0.5, '#4b1428')
    bg.addColorStop(1, '#1d0710')
    g.fillStyle = bg
    g.fillRect(0, 0, w, h)
    // wood grain
    g.globalAlpha = 0.07
    for (let i = 0; i < 160; i++) {
      g.fillStyle = i % 2 ? '#fff' : '#000'
      g.fillRect(Math.random() * w, 0, 1 + Math.random() * 2, h)
    }
    g.globalAlpha = 1
    g.strokeStyle = goldGrad(g, 0, 0, w, h)
    g.lineWidth = 14
    g.strokeRect(10, 10, w - 20, h - 20)
    g.lineWidth = 3
    g.strokeRect(34, 34, w - 68, h - 68)
    const panel = (x, y, pw, ph) => {
      g.lineWidth = 6
      g.strokeStyle = goldGrad(g, x, y, x + pw, y + ph)
      g.beginPath()
      g.roundRect(x, y, pw, ph, 18)
      g.stroke()
      g.lineWidth = 2
      g.beginPath()
      g.roundRect(x + 14, y + 14, pw - 28, ph - 28, 12)
      g.stroke()
    }
    panel(64, 64, w - 128, 250)
    panel(64, 340, w - 128, 340)
    panel(64, 706, w - 128, 254)
    // centre medallion
    const cx = w / 2,
      cy = 510
    g.save()
    g.translate(cx, cy)
    for (let i = 0; i < 16; i++) {
      g.rotate((Math.PI * 2) / 16)
      g.fillStyle = i % 2 ? '#c9a24a' : '#e87524'
      g.beginPath()
      g.ellipse(0, -92, 13, 44, 0, 0, 7)
      g.fill()
    }
    g.restore()
    ;[70, 46, 22].forEach((r, i) => {
      g.beginPath()
      g.arc(cx, cy, r, 0, 7)
      g.fillStyle = ['#2a0a16', '#c9a24a', '#e87524'][i]
      g.fill()
      g.lineWidth = 3
      g.strokeStyle = '#f6e2a0'
      g.stroke()
    })
    // studs
    g.fillStyle = goldGrad(g, 0, 0, 30, 30)
    for (let y = 60; y < h - 40; y += 58) {
      ;[26, w - 26].forEach((x) => {
        g.beginPath()
        g.arc(x, y, 7, 0, 7)
        g.fill()
      })
    }
    // upper & lower motifs
    ;[[w / 2, 190], [w / 2, 830]].forEach(([x, y]) => {
      g.save()
      g.translate(x, y)
      for (let i = 0; i < 8; i++) {
        g.rotate(Math.PI / 4)
        g.strokeStyle = '#c9a24a'
        g.lineWidth = 3
        g.beginPath()
        g.ellipse(0, -34, 10, 28, 0, 0, 7)
        g.stroke()
      }
      g.restore()
    })
  })
}

export function stoneTexture() {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#17110e'
    g.fillRect(0, 0, w, h)
    for (let y = 0; y < h; y += 64) {
      for (let x = (y / 64) % 2 ? -64 : 0; x < w; x += 128) {
        const v = 20 + Math.random() * 14
        g.fillStyle = `rgb(${v + 6},${v},${v - 4})`
        g.fillRect(x + 3, y + 3, 122, 58)
      }
    }
    g.globalAlpha = 0.12
    for (let i = 0; i < 3000; i++) {
      g.fillStyle = Math.random() > 0.5 ? '#000' : '#c9a24a'
      g.fillRect(Math.random() * w, Math.random() * h, 2, 2)
    }
  })
}

/** Gold plate with embossed lines (chest) */
export function goldPlateTexture() {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = goldGrad(g, 0, 0, w, h)
    g.fillRect(0, 0, w, h)
    g.globalAlpha = 0.28
    g.strokeStyle = '#4b2e08'
    g.lineWidth = 3
    for (let i = 1; i < 5; i++) {
      g.strokeRect(i * 26, i * 26, w - i * 52, h - i * 52)
    }
    g.globalAlpha = 0.3
    for (let r = 30; r < 220; r += 34) {
      g.beginPath()
      g.arc(w / 2, h / 2, r, 0, 7)
      g.stroke()
    }
    g.globalAlpha = 0.12
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = Math.random() > 0.5 ? '#fff' : '#000'
      g.fillRect(Math.random() * w, Math.random() * h, 2, 2)
    }
  })
}

export function glowTexture(stops) {
  return canvasTex(256, 256, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
    stops.forEach(([o, c]) => gr.addColorStop(o, c))
    g.fillStyle = gr
    g.fillRect(0, 0, w, h)
  })
}

/** Soft vertical light-ray strip (additive) */
export function rayTexture() {
  return canvasTex(128, 512, (g, w, h) => {
    const v = g.createLinearGradient(0, h, 0, 0)
    v.addColorStop(0, 'rgba(255,222,140,0.95)')
    v.addColorStop(0.5, 'rgba(255,190,90,0.45)')
    v.addColorStop(1, 'rgba(255,160,60,0)')
    g.fillStyle = v
    g.fillRect(0, 0, w, h)
    g.globalCompositeOperation = 'destination-in'
    const hz = g.createLinearGradient(0, 0, w, 0)
    hz.addColorStop(0, 'rgba(0,0,0,0)')
    hz.addColorStop(0.5, 'rgba(0,0,0,1)')
    hz.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = hz
    g.fillRect(0, 0, w, h)
  })
}

/** Realistic-ish peacock plume with "eye" */
export function featherTexture(tone = 0) {
  return canvasTex(256, 640, (g, w, h) => {
    const cx = w / 2
    const eyeY = 172
    const shaft = (y) => cx + Math.sin(y / 90) * 1.2
    // half-width profile
    const hw = (y) => {
      if (y < 40) return 0
      if (y < 300) return 108 * Math.sqrt(Math.max(0, 1 - ((y - 176) / 136) ** 2))
      return 16 + 92 * Math.pow(1 - (y - 300) / 340, 1.7)
    }
    g.lineCap = 'round'
    for (let y = 40; y < 640; y += 1.15) {
      const wdt = hw(y)
      if (wdt < 2) continue
      const t = (y - 40) / 600
      for (const side of [-1, 1]) {
        const len = wdt * (0.9 + Math.random() * 0.2)
        const lift = 10 + len * 0.3
        const gr = g.createLinearGradient(shaft(y), y, shaft(y) + side * len, y - lift)
        const base = tone ? ['#2f7a3a', '#c8a43a', '#e87524'] : ['#1f6b4a', '#b88a2c', '#d89a3a']
        gr.addColorStop(0, base[0])
        gr.addColorStop(0.55, base[1])
        gr.addColorStop(1, base[2])
        g.strokeStyle = gr
        g.globalAlpha = 0.75 + Math.random() * 0.25
        g.lineWidth = 1.5
        g.beginPath()
        g.moveTo(shaft(y), y)
        g.quadraticCurveTo(shaft(y) + side * len * 0.55, y - lift * 0.25, shaft(y) + side * len, y - lift)
        g.stroke()
      }
      void t
    }
    g.globalAlpha = 1
    g.strokeStyle = '#d8b24a'
    g.lineWidth = 3
    g.beginPath()
    g.moveTo(cx, 636)
    g.lineTo(cx, 60)
    g.stroke()
    // eye rings
    const ell = (rx, ry, c, glow) => {
      g.beginPath()
      g.ellipse(cx, eyeY, rx, ry, 0, 0, 7)
      g.fillStyle = c
      if (glow) {
        g.shadowColor = glow
        g.shadowBlur = 14
      }
      g.fill()
      g.shadowBlur = 0
    }
    ell(64, 82, '#b8872a', '#f6e2a0')
    ell(54, 70, '#1b7f6e')
    ell(44, 58, '#1aa0a6')
    ell(34, 46, '#0e4fa0')
    ell(22, 32, '#0a2a78')
    ell(11, 18, '#050b24')
    g.fillStyle = 'rgba(255,255,255,0.55)'
    g.beginPath()
    g.ellipse(cx - 8, eyeY - 14, 3, 7, -0.3, 0, 7)
    g.fill()
  })
}
