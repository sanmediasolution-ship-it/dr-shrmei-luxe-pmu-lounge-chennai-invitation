// Converts jpg/png in public/assets (except logo/) to resized .webp. Usage: npm run optimize
import sharp from 'sharp'
import { readdir, stat, unlink } from 'node:fs/promises'
import { join, extname } from 'node:path'
const root = 'public/assets'
async function walk(d) {
  for (const n of await readdir(d)) {
    const p = join(d, n)
    if ((await stat(p)).isDirectory()) { if (n !== 'logo') await walk(p); continue }
    if (!['.jpg', '.jpeg', '.png'].includes(extname(n).toLowerCase())) continue
    if (p.includes('poster')) continue
    await sharp(p).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(p.replace(/\.\w+$/, '.webp'))
    await unlink(p)
    console.log('optimized', p)
  }
}
await walk(root)
