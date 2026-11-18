import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { glowTexture } from './textures'
import { isLite } from '../lib/device'

export const approach = (cur, target, speed, dt) => {
  const d = target - cur
  const s = speed * dt
  return Math.abs(d) <= s ? target : cur + Math.sign(d) * s
}
export const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOut = (t) => 1 - Math.pow(1 - t, 3)
export const clamp01 = (v) => Math.min(1, Math.max(0, v))

/** Floating golden dust (3D points) */
export function Sparks({ count = 140, spread = [5, 4, 3], speed = 0.25, size = 0.07, opacity = 0.9, center = [0, 0, 0] }) {
  const n = isLite ? Math.round(count * 0.45) : count
  const ref = useRef()
  const tex = useMemo(() => glowTexture([[0, 'rgba(255,240,190,1)'], [0.3, 'rgba(255,200,90,0.6)'], [1, 'rgba(255,160,40,0)']]), [])
  const { positions, seeds } = useMemo(() => {
    const p = new Float32Array(n * 3)
    const s = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      p[i * 3] = (Math.random() - 0.5) * spread[0] + center[0]
      p[i * 3 + 1] = (Math.random() - 0.5) * spread[1] + center[1]
      p[i * 3 + 2] = (Math.random() - 0.5) * spread[2] + center[2]
      s[i] = Math.random() * 6.28
    }
    return { positions: p, seeds: s }
  }, [n]) // eslint-disable-line
  useFrame((st, dt) => {
    const a = ref.current.geometry.attributes.position
    const t = st.clock.elapsedTime
    for (let i = 0; i < n; i++) {
      let y = a.getY(i) + dt * speed * (0.4 + (seeds[i] % 1))
      if (y > center[1] + spread[1] / 2) y = center[1] - spread[1] / 2
      a.setY(i, y)
      a.setX(i, a.getX(i) + Math.sin(t * 0.6 + seeds[i]) * dt * 0.08)
    }
    a.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={tex} size={size} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={opacity} color="#ffd98a" />
    </points>
  )
}

/** Fit camera so a given half-width is always visible (portrait phones) */
export function useFitCamera(baseZ, halfW, extra = {}) {
  return (state) => {
    const { camera, size } = state
    const aspect = size.width / size.height
    const tan = Math.tan((camera.fov * Math.PI) / 360)
    return Math.max(baseZ, halfW / (tan * aspect)) + (extra.add || 0)
  }
}
