import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { goldPlateTexture, glowTexture, rayTexture } from './textures'
import { approach, ease, easeOut, clamp01, Sparks } from './common'
import { dprCap, isLite } from '../lib/device'

const GOLD = { color: '#d4af55', metalness: 0.75, roughness: 0.32, emissive: '#4a2e06', emissiveIntensity: 0.5 }

/** Golden treasure chest. `amt` is a ref: {unlock, open, items, key} each 0..1 */
export function Chest({ amt, onTap, position = [0, 0, 0], scale = 1, rotationY = 0, interactive = true }) {
  const plate = useMemo(() => goldPlateTexture(), [])
  const glowTex = useMemo(() => glowTexture([[0, 'rgba(255,250,220,1)'], [0.3, 'rgba(255,205,100,0.7)'], [1, 'rgba(255,160,40,0)']]), [])
  const ray = useMemo(() => rayTexture(), [])
  const lid = useRef()
  const lock = useRef()
  const gem = useRef()
  const inner = useRef()
  const light = useRef()
  const rays = useRef([])
  const items = useRef([])
  const keyG = useRef()
  const flash = useRef()
  const aura = useRef()
  const root = useRef()

  const itemDefs = useMemo(
    () => [
      { type: 'pen', x: -0.55, z: 0.1, rz: 0.35, delay: 0.0, h: 1.15 },
      { type: 'pen', x: 0.5, z: 0.05, rz: -0.4, delay: 0.1, h: 1.3 },
      { type: 'pen', x: -0.15, z: -0.2, rz: 0.1, delay: 0.2, h: 1.0 },
      { type: 'bottle', x: -0.78, z: 0.25, rz: 0, delay: 0.15, h: 0.62, c: '#8a1c3a' },
      { type: 'bottle', x: 0.8, z: 0.2, rz: 0, delay: 0.25, h: 0.58, c: '#e87524' },
      { type: 'blade', x: 0.2, z: 0.3, rz: -0.9, delay: 0.3, h: 0.9 },
    ],
    [],
  )

  useFrame((state) => {
    const a = amt.current
    const t = state.clock.elapsedTime
    const open = ease(a.open)
    if (lid.current) lid.current.rotation.x = -open * 1.95
    if (lock.current) {
      lock.current.position.y = 0.6 - clamp01(a.unlock - 0.4) * 0.4 * (a.open > 0.02 ? 1 : 0)
      lock.current.position.x = Math.sin(t * 60) * 0.012 * (a.unlock > 0 && a.unlock < 1 ? 1 : 0)
    }
    if (gem.current) gem.current.material.emissiveIntensity = 0.8 + a.unlock * 2.4 + Math.sin(t * 3) * 0.2
    if (inner.current) inner.current.material.opacity = open
    if (light.current) light.current.intensity = open * 14
    if (flash.current) {
      const f = Math.max(0, 1 - Math.abs(a.open - 0.45) * 6)
      flash.current.material.opacity = f
      flash.current.scale.setScalar(1 + f * 6)
    }
    rays.current.forEach((r, i) => {
      if (!r) return
      r.material.opacity = open * (0.5 + 0.18 * Math.sin(t * 1.5 + i))
      r.scale.y = 0.4 + open * 1.1
    })
    if (aura.current) {
      const idle = (1 - a.unlock) * (interactive ? 1 : 0)
      aura.current.material.opacity = idle * (0.25 + 0.2 * Math.sin(t * 2.4))
      aura.current.scale.setScalar(3.4 + Math.sin(t * 2.4) * 0.25)
    }
    const it = a.items
    items.current.forEach((g, i) => {
      if (!g) return
      const d = itemDefs[i]
      const p = easeOut(clamp01((it - d.delay) / (1 - d.delay)))
      g.position.y = 0.8 + p * d.h + Math.sin(t * 1.3 + i) * 0.04 * p
      g.rotation.y = t * 0.6 + i
      g.scale.setScalar(p)
    })
    if (keyG.current) {
      const k = a.key
      const rise = easeOut(clamp01(a.items * 1.1))
      const fly = ease(k)
      const tx = -3.4,
        ty = 3.4,
        tz = 2.2
      keyG.current.position.set(THREE.MathUtils.lerp(0, tx, fly), THREE.MathUtils.lerp(0.9 + rise * 1.9 + Math.sin(t * 1.6) * 0.06, ty, fly), THREE.MathUtils.lerp(0.1, tz, fly))
      keyG.current.rotation.y = t * 1.4
      keyG.current.rotation.z = fly * 0.9
      keyG.current.scale.setScalar(rise * (1.25 - fly * 0.85))
    }
  })

  const body = [1.72, 0.82, 1.12]
  return (
    <group ref={root} position={position} scale={scale} rotation={[0, rotationY, 0]}>
      {/* base */}
      <mesh position={[0, 0.41, 0]}>
        <boxGeometry args={body} />
        <meshStandardMaterial map={plate} {...GOLD} />
      </mesh>
      {/* corner posts + bands */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => (
        <mesh key={i} position={[x * 0.86, 0.42, z * 0.56]}>
          <boxGeometry args={[0.14, 0.86, 0.14]} />
          <meshStandardMaterial color="#8a1c3a" metalness={0.5} roughness={0.35} emissive="#2a0610" emissiveIntensity={0.6} />
        </mesh>
      ))}
      {[-0.45, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.42, 0]}>
          <boxGeometry args={[0.1, 0.86, 1.16]} />
          <meshStandardMaterial color="#f0d684" metalness={0.9} roughness={0.25} emissive="#5a3a08" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* glowing interior */}
      <mesh ref={inner} position={[0, 0.84, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 0.92]} />
        <meshBasicMaterial map={glowTex} color="#fff0b0" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* lid (pivot at back edge) */}
      <group ref={lid} position={[0, 0.82, -0.56]}>
        <mesh position={[0, 0.17, 0.56]}>
          <boxGeometry args={[1.78, 0.34, 1.16]} />
          <meshStandardMaterial map={plate} {...GOLD} />
        </mesh>
        <mesh position={[0, 0.38, 0.56]}>
          <boxGeometry args={[1.5, 0.12, 0.9]} />
          <meshStandardMaterial map={plate} {...GOLD} />
        </mesh>
        {[-0.45, 0.45].map((x) => (
          <mesh key={x} position={[x, 0.2, 0.56]}>
            <boxGeometry args={[0.1, 0.4, 1.2]} />
            <meshStandardMaterial color="#f0d684" metalness={0.9} roughness={0.25} emissive="#5a3a08" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>
      {/* lock */}
      <group ref={lock} position={[0, 0.6, 0.6]}>
        <mesh>
          <boxGeometry args={[0.3, 0.38, 0.07]} />
          <meshStandardMaterial color="#f0d684" metalness={0.9} roughness={0.2} emissive="#7a5010" emissiveIntensity={0.6} />
        </mesh>
        <mesh ref={gem} position={[0, 0.02, 0.06]}>
          <octahedronGeometry args={[0.075]} />
          <meshStandardMaterial color="#c8102e" emissive="#ff3b30" emissiveIntensity={1} metalness={0.3} roughness={0.15} />
        </mesh>
      </group>
      {/* tap aura */}
      <mesh ref={aura} position={[0, 0.5, 0.9]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={glowTex} color="#ffb84a" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight ref={light} position={[0, 1.2, 0.1]} color="#ffcf6a" intensity={0} distance={12} decay={1.4} />
      {/* god rays */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (rays.current[i] = el)} position={[0, 0.84 + 1.7, 0]} rotation={[0, (i * Math.PI) / 3, 0]}>
          <planeGeometry args={[2.6, 3.4]} />
          <meshBasicMaterial map={ray} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh ref={flash} position={[0, 1.1, 0.5]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={glowTex} color="#fff6d0" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* PMU master kit rising out of the chest */}
      {itemDefs.map((d, i) => (
        <group key={i} ref={(el) => (items.current[i] = el)} position={[d.x, 0.8, d.z]} rotation={[0, 0, d.rz]} scale={0}>
          {d.type === 'pen' && (
            <group>
              <mesh>
                <cylinderGeometry args={[0.04, 0.045, 0.62, 14]} />
                <meshStandardMaterial color="#0e0e0e" metalness={0.8} roughness={0.25} />
              </mesh>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.046, 0.046, 0.12, 14]} />
                <meshStandardMaterial {...GOLD} />
              </mesh>
              <mesh position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.04, 0.2, 12]} />
                <meshStandardMaterial color="#e8e8ee" metalness={0.95} roughness={0.15} />
              </mesh>
            </group>
          )}
          {d.type === 'bottle' && (
            <group>
              <mesh>
                <cylinderGeometry args={[0.1, 0.11, 0.24, 18]} />
                <meshStandardMaterial color={d.c} emissive={d.c} emissiveIntensity={0.45} metalness={0.3} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.17, 0]}>
                <cylinderGeometry args={[0.065, 0.065, 0.1, 14]} />
                <meshStandardMaterial {...GOLD} />
              </mesh>
            </group>
          )}
          {d.type === 'blade' && (
            <group>
              <mesh>
                <boxGeometry args={[0.03, 0.55, 0.012]} />
                <meshStandardMaterial color="#eef0f6" metalness={1} roughness={0.12} />
              </mesh>
              <mesh position={[0, -0.34, 0]}>
                <boxGeometry args={[0.07, 0.16, 0.05]} />
                <meshStandardMaterial {...GOLD} />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* the golden key */}
      <group ref={keyG} scale={0}>
        <mesh position={[0, 0.34, 0]}>
          <torusGeometry args={[0.17, 0.045, 14, 32]} />
          <meshStandardMaterial color="#ffd86a" metalness={0.9} roughness={0.2} emissive="#ffaa22" emissiveIntensity={1.1} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.66, 12]} />
          <meshStandardMaterial color="#ffd86a" metalness={0.9} roughness={0.2} emissive="#ffaa22" emissiveIntensity={1} />
        </mesh>
        {[-0.25, -0.17, -0.09].map((y, i) => (
          <mesh key={i} position={[0.07 + (i % 2) * 0.03, y, 0]}>
            <boxGeometry args={[0.13, 0.04, 0.05]} />
            <meshStandardMaterial color="#ffd86a" metalness={0.9} roughness={0.2} emissive="#ffaa22" emissiveIntensity={1} />
          </mesh>
        ))}
        <pointLight color="#ffc04a" intensity={3} distance={5} />
      </group>

      {/* invisible, generous tap target */}
      {interactive && (
        <mesh position={[0, 0.9, 0.2]} onPointerDown={(e) => { e.stopPropagation(); onTap && onTap() }}>
          <boxGeometry args={[3.4, 2.4, 2.2]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  )
}

function Scene({ phase, onTap }) {
  const amt = useRef({ unlock: 0, open: 0, items: 0, key: 0 })
  useFrame((state, dt) => {
    const a = amt.current
    const p = phase
    a.unlock = approach(a.unlock, p === 'idle' ? 0 : 1, 1.2, dt)
    a.open = approach(a.open, p === 'opening' || p === 'open' || p === 'keyFlies' ? 1 : 0, 0.55, dt)
    a.items = approach(a.items, p === 'open' || p === 'keyFlies' ? 1 : 0, 0.45, dt)
    a.key = approach(a.key, p === 'keyFlies' ? 1 : 0, 0.55, dt)
    const { camera, size, clock } = state
    const aspect = size.width / size.height
    const tan = Math.tan((camera.fov * Math.PI) / 360)
    const z = Math.max(8, 2.3 / (tan * aspect))
    camera.position.set(Math.sin(clock.elapsedTime * 0.3) * 0.15, 1.1 + ease(a.open) * 0.3, z - ease(a.open) * 0.8)
    camera.lookAt(0, 0.35 + a.items * 0.5, 0)
  })
  return (
    <>
      <ambientLight intensity={0.7} color="#ffd9a0" />
      <directionalLight position={[3, 6, 6]} intensity={1.5} color="#ffe6b8" />
      <directionalLight position={[-4, 2, 3]} intensity={0.5} color="#e87524" />
      <Chest amt={amt} onTap={onTap} position={[0, -1.7, 0]} scale={1.05} />
      <Sparks count={120} spread={[6, 6, 4]} center={[0, 0.5, 0]} speed={0.18} size={0.06} opacity={0.7} />
    </>
  )
}

export default function TreasureScene({ phase, onTap }) {
  const tapRef = useRef(onTap)
  useEffect(() => {
    tapRef.current = onTap
  }, [onTap])
  return (
    <Canvas
      dpr={[1, dprCap]}
      gl={{ antialias: !isLite, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 40, position: [0, 1.2, 9], near: 0.1, far: 60 }}
      style={{ position: 'absolute', inset: 0, touchAction: 'manipulation' }}
    >
      <Scene phase={phase} onTap={() => tapRef.current && tapRef.current()} />
    </Canvas>
  )
}
