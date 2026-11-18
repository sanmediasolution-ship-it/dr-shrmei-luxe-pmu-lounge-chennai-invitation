import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { featherTexture, glowTexture } from './textures'
import { approach, ease, easeOut, clamp01, Sparks } from './common'
import { Chest } from './TreasureScene'
import { dprCap, isLite } from '../lib/device'

const L = 2.6 // feather length
const BASE = [0, 0.85, -0.45] // fan pivot (relative to bird root)
const ROOT_Y = -1.5

function Fan({ st, count, len, width, tex, zBase, spreadMul = 1, tilt = 0 }) {
  const gs = useRef([])
  const items = useMemo(() => Array.from({ length: count }, (_, i) => ({ u: (i / (count - 1)) * 2 - 1, z: zBase + (i % 2) * 0.012 - Math.abs(i / (count - 1) * 2 - 1) * 0.01 })), [count, zBase])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const s = ease(st.current.spread)
    items.forEach((it, i) => {
      const g = gs.current[i]
      if (!g) return
      const ang = THREE.MathUtils.lerp(it.u * 0.09, it.u * 1.2 * spreadMul, s)
      g.rotation.z = -ang + Math.sin(t * 1.4 + i * 0.7) * (0.008 + 0.014 * s)
      g.rotation.x = tilt
    })
  })
  return (
    <>
      {items.map((it, i) => (
        <group key={i} ref={(el) => (gs.current[i] = el)} position={[0, 0, it.z]}>
          <mesh position={[0, len / 2, 0]}>
            <planeGeometry args={[width, len]} />
            <meshStandardMaterial map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={0.5} alphaTest={0.3} side={THREE.DoubleSide} roughness={0.6} metalness={0.2} />
          </mesh>
        </group>
      ))}
    </>
  )
}

function Bird({ st }) {
  const root = useRef()
  const fan = useRef()
  const head = useRef()
  const tex1 = useMemo(() => featherTexture(0), [])
  const tex2 = useMemo(() => featherTexture(1), [])
  const neckGeo = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 1.05, 0.45), new THREE.Vector3(0, 1.45, 0.62), new THREE.Vector3(0, 1.9, 0.58), new THREE.Vector3(0, 2.2, 0.5)])
    return new THREE.TubeGeometry(c, 20, 0.1, 10, false)
  }, [])
  const blue = { color: '#0c5aa6', emissive: '#041f46', emissiveIntensity: 0.9, metalness: 0.45, roughness: 0.35 }
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const a = st.current
    const turn = ease(a.turn)
    const sp = ease(a.spread)
    const appear = easeOut(a.appear)
    root.current.rotation.y = THREE.MathUtils.lerp(1.05, 0, turn) + Math.sin(t * 0.5) * 0.03 * (1 - turn)
    root.current.scale.setScalar(0.001 + appear)
    root.current.position.y = ROOT_Y + (1 - appear) * -0.6
    fan.current.rotation.x = THREE.MathUtils.lerp(-1.38, -0.04, sp)
    fan.current.position.y = BASE[1]
    head.current.rotation.x = Math.sin(t * 1.1) * 0.05 + 0.06
    head.current.rotation.y = Math.sin(t * 0.7) * 0.18 * (1 - turn)
  })
  return (
    <group ref={root} position={[0, ROOT_Y, 0]}>
      {/* body */}
      <mesh position={[0, 0.8, 0]} scale={[0.78, 0.72, 1.1]}>
        <sphereGeometry args={[0.6, 24, 18]} />
        <meshStandardMaterial {...blue} />
      </mesh>
      <mesh position={[0, 1.08, 0.42]} scale={[0.7, 0.9, 0.8]}>
        <sphereGeometry args={[0.38, 20, 16]} />
        <meshStandardMaterial color="#0a7aa8" emissive="#053a55" emissiveIntensity={0.9} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh geometry={neckGeo}>
        <meshStandardMaterial color="#0a6fc0" emissive="#052a5a" emissiveIntensity={1} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* head */}
      <group ref={head} position={[0, 2.26, 0.5]}>
        <mesh>
          <sphereGeometry args={[0.15, 16, 14]} />
          <meshStandardMaterial {...blue} />
        </mesh>
        <mesh position={[0, -0.01, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.045, 0.2, 10]} />
          <meshStandardMaterial color="#d8b24a" metalness={0.7} roughness={0.3} emissive="#5a3a08" emissiveIntensity={0.4} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.09, 0.03, 0.07]}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshStandardMaterial color="#050505" emissive="#ffffff" emissiveIntensity={0.15} />
          </mesh>
        ))}
        {Array.from({ length: 7 }, (_, i) => {
          const a = (i - 3) * 0.2
          return (
            <group key={i} rotation={[0, 0, -a]} position={[0, 0.12, -0.02]}>
              <mesh position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.006, 0.006, 0.24, 5]} />
                <meshStandardMaterial color="#1a6a5a" />
              </mesh>
              <mesh position={[0, 0.25, 0]}>
                <sphereGeometry args={[0.027, 8, 6]} />
                <meshStandardMaterial color="#12a0a8" emissive="#0a6a70" emissiveIntensity={1} />
              </mesh>
            </group>
          )
        })}
      </group>
      {/* legs */}
      {[-0.17, 0.17].map((x) => (
        <mesh key={x} position={[x, 0.22, 0.1]}>
          <cylinderGeometry args={[0.028, 0.036, 0.6, 8]} />
          <meshStandardMaterial color="#8a6a3a" />
        </mesh>
      ))}
      {/* tail fan */}
      <group ref={fan} position={BASE}>
        <Fan st={st} count={isLite ? 21 : 31} len={L} width={0.74} tex={tex1} zBase={0} />
        <Fan st={st} count={isLite ? 13 : 19} len={L * 0.66} width={0.6} tex={tex2} zBase={0.06} spreadMul={0.92} />
        {/* train tail trailing on the floor when closed */}
        <mesh position={[0, 0.1, 0.01]}>
          <circleGeometry args={[0.18, 16]} />
          <meshStandardMaterial color="#0d4a8a" emissive="#041f46" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  )
}

function Scene({ phase, onZoomed }) {
  const st = useRef({ appear: 0, turn: 0, spread: 0, zoom: 0 })
  const glowTex = useMemo(() => glowTexture([[0, 'rgba(255,230,150,1)'], [0.35, 'rgba(255,160,50,0.65)'], [0.7, 'rgba(232,117,36,0.25)'], [1, 'rgba(232,117,36,0)']]), [])
  const glow = useRef()
  const light = useRef()
  const chestAmt = useRef({ unlock: 1, open: 1, items: 0.0, key: 0 })
  const zoomedFired = useRef(false)

  useFrame((state, dt) => {
    const a = st.current
    a.appear = approach(a.appear, 1, 0.55, dt)
    const go = phase !== 'idle'
    a.turn = approach(a.turn, go ? 1 : 0, 0.5, dt)
    a.spread = approach(a.spread, go && a.turn > 0.55 ? 1 : 0, 0.42, dt)
    a.zoom = approach(a.zoom, phase === 'zoom' ? 1 : 0, 0.4, dt)
    const { camera, size, clock } = state
    const aspect = size.width / size.height
    const tan = Math.tan((camera.fov * Math.PI) / 360)
    const fitZ = Math.max(8.5, 2.95 / (tan * aspect))
    const z = ease(a.zoom)
    const t = clock.elapsedTime
    // target: eye of the centre feather (world)
    const eye = new THREE.Vector3(0, ROOT_Y + BASE[1] + L * 0.73, BASE[2] + 0.1)
    const home = new THREE.Vector3(Math.sin(t * 0.25) * 0.15, 0.7, fitZ)
    const near = new THREE.Vector3(0, eye.y, eye.z + 0.52)
    camera.position.lerpVectors(home, near, z)
    const lookHome = new THREE.Vector3(0, 0.45, 0)
    camera.lookAt(lookHome.lerp(eye, z))
    const sp = ease(a.spread)
    if (glow.current) {
      glow.current.material.opacity = 0.18 + sp * 0.85
      glow.current.scale.setScalar(7 + sp * 7)
    }
    if (light.current) light.current.intensity = 6 + sp * 30
    if (a.zoom > 0.97 && !zoomedFired.current && phase === 'zoom') {
      zoomedFired.current = true
      onZoomed && onZoomed()
    }
  })

  return (
    <>
      <color attach="background" args={['#070405']} />
      <fog attach="fog" args={['#070405', 12, 30]} />
      <ambientLight intensity={0.8} color="#ffd9a0" />
      <directionalLight position={[2, 5, 8]} intensity={1.6} color="#ffe6b8" />
      <pointLight ref={light} position={[0, 1.4, 2.2]} color="#ff9a30" intensity={6} distance={18} decay={1.3} />
      <mesh ref={glow} position={[0, 0.9, -1.6]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={glowTex} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* palace floor sheen */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, ROOT_Y, -2]}>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#1a0c08" roughness={0.35} metalness={0.7} />
      </mesh>
      <Bird st={st} />
      <Chest amt={chestAmt} position={[-1.15, ROOT_Y, 2.2]} scale={0.62} rotationY={0.55} interactive={false} />
      <Sparks count={150} spread={[8, 8, 5]} center={[0, 1, 0]} speed={0.22} size={0.06} opacity={0.8} />
    </>
  )
}

export default function PeacockScene({ phase, onTap, onZoomed }) {
  const zRef = useRef(onZoomed)
  const tRef = useRef(onTap)
  useEffect(() => {
    zRef.current = onZoomed
    tRef.current = onTap
  }, [onZoomed, onTap])
  return (
    <Canvas
      dpr={[1, dprCap]}
      gl={{ antialias: !isLite, powerPreference: 'high-performance' }}
      camera={{ fov: 42, position: [0, 0.7, 11], near: 0.05, far: 60 }}
      style={{ position: 'absolute', inset: 0, touchAction: 'manipulation' }}
      onPointerDown={() => tRef.current && tRef.current()}
    >
      <Scene phase={phase} onZoomed={() => zRef.current && zRef.current()} />
    </Canvas>
  )
}
