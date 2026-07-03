import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

/* ── Natural lip-sync with continuous fluid motion ── */
function useLipSync(isSpeaking, isListening, speechBoundary) {
  const [mouth, setMouth] = useState(0)
  const frameRef = useRef(null)
  const lastBoundary = useRef(speechBoundary)
  const idleRef = useRef(null)

  useEffect(() => {
    if (isSpeaking) {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000
        const slow = Math.sin(elapsed * 3.7) * 0.18
        const mid = Math.sin(elapsed * 8.2) * 0.12
        const fast = Math.sin(elapsed * 15.1) * 0.06
        const jitter = (Math.random() - 0.5) * 0.05
        const boundaryHit = speechBoundary !== lastBoundary.current
        const impulse = boundaryHit ? 0.25 + Math.random() * 0.2 : 0
        if (boundaryHit) lastBoundary.current = speechBoundary
        let value = 0.35 + slow + mid + fast + jitter + impulse
        value = Math.max(0.02, Math.min(1, value))
        setMouth(value)
        frameRef.current = requestAnimationFrame(animate)
      }
      frameRef.current = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(frameRef.current)
    }

    if (isListening) {
      const twitch = () => {
        setMouth(0.04 + Math.random() * 0.1)
        idleRef.current = setTimeout(() => {
          setMouth(0)
          idleRef.current = setTimeout(twitch, 150 + Math.random() * 500)
        }, 80 + Math.random() * 120)
      }
      twitch()
      return () => { clearTimeout(idleRef.current); setMouth(0) }
    }

    setMouth(0)
    return () => {}
  }, [isSpeaking, isListening, speechBoundary])

  return mouth
}

function useSpeakingNow() {
  const [v, setV] = useState(false)
  const r = useRef(false)
  useEffect(() => {
    const c = () => {
      const a = window.speechSynthesis?.speaking || false
      if (a !== r.current) { r.current = a; setV(a) }
    }
    c(); const id = setInterval(c, 50)
    return () => clearInterval(id)
  }, [])
  return v
}

const MODEL_URL = 'https://threejs.org/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb'

/* ── Scanned realistic head ── */
function ScannedHead({ mouthOpen, blink }) {
  const { scene } = useGLTF(MODEL_URL)
  const meshRef = useRef()
  const origPos = useRef(null)
  const mv = useRef([])   // mouth vertex indices
  const uv = useRef([])   // upper eyelid indices
  const lv = useRef([])   // lower eyelid indices

  const head = useMemo(() => {
    const src = scene?.children?.find(c => c.isMesh)
    if (!src) return null
    const m = src.clone()
    m.material = m.material?.clone?.() || new THREE.MeshStandardMaterial({ color: '#e8ceb4', roughness: 0.4 })
    if (m.material) {
      m.material.roughness = 0.38
      m.material.metalness = 0.01
    }
    return m
  }, [scene])

  /* Identify mouth & eyelid vertices once model loads */
  useEffect(() => {
    if (!meshRef.current) return
    const g = meshRef.current.geometry
    const p = g.attributes.position
    if (!p) return
    const a = p.array
    origPos.current = new Float32Array(a)
    const mi = [], ui = [], li = []
    for (let i = 0; i < a.length; i += 3) {
      const x = a[i], y = a[i + 1], z = a[i + 2]
      const idx = i / 3
      // Mouth
      if (Math.abs(x) < 0.24 && y > -0.32 && y < -0.10 && z > 0.26) mi.push(idx)
      // Upper eyelids
      if (Math.abs(x) < 0.16 && y > 0.03 && y < 0.11 && z > 0.34) ui.push(idx)
      // Lower eyelids
      if (Math.abs(x) < 0.16 && y > -0.02 && y < 0.03 && z > 0.34) li.push(idx)
    }
    mv.current = mi; uv.current = ui; lv.current = li
  }, [head])

  useFrame(() => {
    if (!meshRef.current || !origPos.current) return
    const g = meshRef.current.geometry
    const p = g.attributes.position
    if (!p) return
    const a = p.array, o = origPos.current

    // Reset
    for (let i = 0; i < a.length; i++) a[i] = o[i]

    // Mouth
    if (mv.current.length && mouthOpen > 0.02) {
      for (const idx of mv.current) {
        const i = idx * 3, y = o[i + 1]
        const dist = Math.abs(y + 0.21)
        const f = Math.max(0, 1 - dist * 5)
        const d = mouthOpen * 0.13 * f
        a[i + 1] = y + (y > -0.21 ? d : -d)
        a[i + 2] = o[i + 2] + Math.max(0, d * 0.3)
      }
    }

    // Blink
    const b = blink ? 1 : 0
    if (b > 0) {
      for (const idx of uv.current) {
        const i = idx * 3
        a[i + 1] = o[i + 1] - 0.035
      }
      for (const idx of lv.current) {
        const i = idx * 3
        a[i + 1] = o[i + 1] + 0.025
      }
    }

    p.needsUpdate = true
    g.computeVertexNormals()
  })

  if (!head) return null

  return (
    <group scale={1.1}>
      <primitive ref={meshRef} object={head} />
      {/* Eyeballs */}
      <group position={[-0.083, 0.065, 0.355]}>
        <mesh><sphereGeometry args={[0.028, 20, 20]} /><meshPhysicalMaterial color="white" roughness={0} clearcoat={0.3} /></mesh>
        <mesh position={[0, 0, 0.018]}><sphereGeometry args={[0.02, 16, 16]} /><meshStandardMaterial color="#4a5d3a" roughness={0.2} /></mesh>
        <mesh position={[0, 0, 0.028]}><sphereGeometry args={[0.012, 12, 12]} /><meshStandardMaterial color="#111" /></mesh>
        <mesh position={[0.003, 0.003, 0.032]}><sphereGeometry args={[0.004, 8, 8]} /><meshStandardMaterial color="white" /></mesh>
      </group>
      <group position={[0.083, 0.065, 0.355]}>
        <mesh><sphereGeometry args={[0.028, 20, 20]} /><meshPhysicalMaterial color="white" roughness={0} clearcoat={0.3} /></mesh>
        <mesh position={[0, 0, 0.018]}><sphereGeometry args={[0.02, 16, 16]} /><meshStandardMaterial color="#4a5d3a" roughness={0.2} /></mesh>
        <mesh position={[0, 0, 0.028]}><sphereGeometry args={[0.012, 12, 12]} /><meshStandardMaterial color="#111" /></mesh>
        <mesh position={[0.003, 0.003, 0.032]}><sphereGeometry args={[0.004, 8, 8]} /><meshStandardMaterial color="white" /></mesh>
      </group>
    </group>
  )
}

/* ── Scene ── */
function Scene({ mouthOpen, blink }) {
  const group = useRef()
  const t = useRef(0)

  useFrame((_, delta) => {
    t.current += delta
    if (!group.current) return
    group.current.rotation.y = Math.sin(t.current * 0.25) * 0.04
    group.current.position.y = Math.sin(t.current * 0.4) * 0.004
  })

  return (
    <group ref={group}>
      <ScannedHead mouthOpen={mouthOpen} blink={blink} />
      <pointLight position={[-1, 0.3, 1]} intensity={0.4} color="#c8d8ff" />
      <pointLight position={[1, -0.2, 0.6]} intensity={0.2} color="#ffe0c0" />
      {/* Top hair piece */}
      <mesh position={[0, 0.41, -0.02]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
        <meshStandardMaterial color="#3d2a1a" roughness={0.9} />
      </mesh>
    </group>
  )
}

/* ── Main ── */
export default function SpeakingAvatar3D({ isSpeaking, isListening, speechBoundary = 0, size = 220 }) {
  const sr = useSpeakingNow()
  const speaking = isSpeaking || sr
  const mouthOpen = useLipSync(speaking, isListening, speechBoundary)

  const [blink, setBlink] = useState(false)
  useEffect(() => {
    const next = () => {
      setBlink(true); setTimeout(() => setBlink(false), 80)
      setTimeout(next, 1800 + Math.random() * 4200)
    }
    const t = setTimeout(next, 1500 + Math.random() * 3000)
    return () => clearTimeout(t)
  }, [])

  useGLTF.preload(MODEL_URL)

  return (
    <div style={{ width: size, height: size, cursor: 'default' }}>
      <Canvas
        camera={{ position: [0, 0.02, 0.85], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[0.4, 0.8, 1]} intensity={0.8} />
        <directionalLight position={[-0.6, 0.3, 0.8]} intensity={0.3} />
        <hemisphereLight args={['#ffe0d0', '#7090b0', 0.35]} />
        <Scene mouthOpen={mouthOpen} blink={blink} />
      </Canvas>
    </div>
  )
}
