import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { doorTexture, stoneTexture, glowTexture } from './textures'
import { approach, ease, clamp01, Sparks } from './common'
import { dprCap, isLite } from '../lib/device'

const DOOR_W = 1.6
const DOOR_H = 5.4

function Scene({ open, onOpened, onProgress }) {
  const left = useRef()
  const right = useRef()
  const glow = useRef()
  const seam = useRef()
  const light = useRef()
  const prog = useRef(0)
  const fired = useRef(false)
  const doorTex = useMemo(() => doorTexture(), [])
  const stone = useMemo(() => {
    const t = stoneTexture()
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(3, 5)
    return t
  }, [])
  const glowTex = useMemo(() => glowTexture([[0, 'rgba(255,248,214,1)'], [0.25, 'rgba(255,205,110,0.85)'], [0.6, 'rgba(232,117,36,0.35)'], [1, 'rgba(232,117,36,0)']]), [])

  useFrame((state, dt) => {
    const { camera, size, clock } = state
    prog.current = approach(prog.current, open ? 1 : 0, 0.3, dt)
    const p = prog.current
    const e = ease(p)
    if (left.current) left.current.rotation.y = e * 1.78
    if (right.current) right.current.rotation.y = -e * 1.78
    const aspect = size.width / size.height
    const tan = Math.tan((camera.fov * Math.PI) / 360)
    const fitZ = Math.max(9, 2.7 / (tan * aspect))
    const dolly = ease(clamp01((p - 0.28) / 0.72))
    camera.position.z = THREE.MathUtils.lerp(fitZ, 0.6, dolly)
    camera.position.y = THREE.MathUtils.lerp(0.4, 0.0, dolly) + Math.sin(clock.elapsedTime * 0.4) * 0.05 * (1 - p)
    camera.position.x = Math.sin(clock.elapsedTime * 0.3) * 0.08 * (1 - p)
    camera.lookAt(0, 0.2, -2)
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 1.2)
    if (glow.current) {
      glow.current.material.opacity = 0.28 + 0.12 * pulse + e * 0.7
      glow.current.scale.setScalar(6 + e * 10)
    }
    if (seam.current) seam.current.material.opacity = (0.35 + 0.35 * pulse) * (1 - e)
    if (light.current) light.current.intensity = 6 + e * 90
    onProgress && onProgress(p)
    if (p >= 0.985 && !fired.current && open) {
      fired.current = true
      onOpened && onOpened()
    }
  })

  const wallMat = <meshStandardMaterial map={stone} roughness={0.9} metalness={0.1} color="#6a5a50" />
  const gold = { color: '#c9a24a', metalness: 0.85, roughness: 0.3, emissive: '#5a3a08', emissiveIntensity: 0.45 }

  return (
    <>
      <color attach="background" args={['#050304']} />
      <fog attach="fog" args={['#050304', 9, 26]} />
      <ambientLight intensity={0.55} color="#ffd9a0" />
      <directionalLight position={[3, 5, 8]} intensity={1.1} color="#ffe2b0" />
      <pointLight ref={light} position={[0, 0.5, -3.2]} color="#ffbf5a" intensity={6} distance={30} decay={1.6} />

      {/* walls around the doorway */}
      <mesh position={[-(DOOR_W + 3.4), 0, -0.2]}>
        <boxGeometry args={[6.8, 14, 1.2]} />
        {wallMat}
      </mesh>
      <mesh position={[DOOR_W + 3.4, 0, -0.2]}>
        <boxGeometry args={[6.8, 14, 1.2]} />
        {wallMat}
      </mesh>
      <mesh position={[0, DOOR_H / 2 + 3.5, -0.2]}>
        <boxGeometry args={[DOOR_W * 2 + 0.2, 7, 1.2]} />
        {wallMat}
      </mesh>
      {/* gold frame */}
      <mesh position={[-(DOOR_W + 0.12), 0, 0.2]}>
        <boxGeometry args={[0.26, DOOR_H + 0.3, 0.5]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[DOOR_W + 0.12, 0, 0.2]}>
        <boxGeometry args={[0.26, DOOR_H + 0.3, 0.5]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0, DOOR_H / 2 + 0.1, 0.2]}>
        <boxGeometry args={[DOOR_W * 2 + 0.6, 0.34, 0.5]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      {/* arch crown jewel */}
      <mesh position={[0, DOOR_H / 2 + 0.5, 0.35]}>
        <octahedronGeometry args={[0.28]} />
        <meshStandardMaterial color="#e87524" emissive="#e87524" emissiveIntensity={1.4} metalness={0.4} roughness={0.2} />
      </mesh>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -DOOR_H / 2, -3]}>
        <planeGeometry args={[14, 22]} />
        <meshStandardMaterial color="#120a08" roughness={0.35} metalness={0.7} />
      </mesh>
      {/* corridor back wall + glow */}
      <mesh ref={glow} position={[0, 0.2, -7]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={glowTex} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.02]} ref={seam}>
        <planeGeometry args={[0.05, DOOR_H]} />
        <meshBasicMaterial color="#ffd58a" transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* doors (pivot at hinge) */}
      <group ref={left} position={[-DOOR_W, 0, 0]}>
        <mesh position={[DOOR_W / 2, 0, 0]}>
          <boxGeometry args={[DOOR_W, DOOR_H, 0.16]} />
          <meshStandardMaterial map={doorTex} emissiveMap={doorTex} emissive="#ffffff" emissiveIntensity={0.28} metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
      <group ref={right} position={[DOOR_W, 0, 0]}>
        <mesh position={[-DOOR_W / 2, 0, 0]}>
          <boxGeometry args={[DOOR_W, DOOR_H, 0.16]} />
          <meshStandardMaterial map={doorTex} emissiveMap={doorTex} emissive="#ffffff" emissiveIntensity={0.28} metalness={0.5} roughness={0.4} />
        </mesh>
      </group>

      <Sparks count={isLite ? 60 : 130} spread={[9, 8, 5]} center={[0, 0, 1.5]} speed={0.2} size={0.05} opacity={0.75} />
    </>
  )
}

export default function DoorScene({ open, onOpened }) {
  const doneRef = useRef(onOpened)
  useEffect(() => {
    doneRef.current = onOpened
  }, [onOpened])
  return (
    <Canvas
      dpr={[1, dprCap]}
      gl={{ antialias: !isLite, powerPreference: 'high-performance' }}
      camera={{ fov: 40, position: [0, 0.4, 12], near: 0.1, far: 60 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Scene open={open} onOpened={() => doneRef.current && doneRef.current()} />
    </Canvas>
  )
}
