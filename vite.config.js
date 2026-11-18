import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Asset manifest plugin.
 * Scans /public/assets and publishes /assets/manifest.json so the app knows
 * which of YOUR files exist (logo, photos, video, audio...). Drop a file in the
 * right folder with the right name and it is picked up automatically.
 */
function assetManifest() {
  const root = path.resolve('public/assets')
  const scan = (dir, base = '') => {
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const rel = base ? `${base}/${e.name}` : e.name
      if (e.isDirectory()) return scan(path.join(dir, e.name), rel)
      if (/^(\.|README|manifest)/i.test(e.name)) return []
      return [rel]
    })
  }
  const body = () => JSON.stringify({ generated: Date.now(), files: scan(root) })
  return {
    name: 'asset-manifest',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.split('?')[0].endsWith('/assets/manifest.json')) {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.end(body())
          return
        }
        next()
      })
    },
    generateBundle() {
      // lands in dist/assets/manifest.json (public/assets is copied alongside)
      this.emitFile({ type: 'asset', fileName: 'assets/manifest.json', source: body() })
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), assetManifest()],
  build: {
    assetsDir: 'app',
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) return 'three'
          if (id.includes('@react-three')) return 'r3f'
          if (id.includes('node_modules/gsap')) return 'gsap'
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) return 'motion'
        },
      },
    },
  },
})
