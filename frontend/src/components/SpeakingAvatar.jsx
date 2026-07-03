import { useEffect, useRef, useState, useCallback } from 'react'

/* ── Natural lip-sync with continuous fluid motion ── */
function useLipSync(isSpeaking, isListening, speechBoundary) {
  const [mouth, setMouth] = useState(0)
  const frameRef = useRef(null)
  const lastBoundary = useRef(speechBoundary)
  const idleRef = useRef(null)

  useEffect(() => {
    if (isSpeaking) {
      const startTime = Date.now()
      const boundaryRef = { current: speechBoundary }

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

/* ── Real-time speech detection ── */
function useSpeakingNow() {
  const [v, setV] = useState(false)
  const r = useRef(false)
  useEffect(() => {
    const c = () => {
      const a = window.speechSynthesis?.speaking || false
      if (a !== r.current) { r.current = a; setV(a) }
    }
    c()
    const id = setInterval(c, 50)
    return () => clearInterval(id)
  }, [])
  return v
}

export default function SpeakingAvatar({ isSpeaking, isListening, speechBoundary = 0, size = 200 }) {
  const sr = useSpeakingNow()
  const speaking = isSpeaking || sr
  const mouth = useLipSync(speaking, isListening, speechBoundary)

  /* ── Blink ── */
  const [blink, setBlink] = useState(false)
  useEffect(() => {
    const next = () => {
      setBlink(true)
      setTimeout(() => setBlink(false), 90)
      setTimeout(next, 1800 + Math.random() * 4200)
    }
    const t = setTimeout(next, 1500 + Math.random() * 3000)
    return () => clearTimeout(t)
  }, [])

  /* ── Listening micro-expressions ── */
  const [brow, setBrow] = useState(0)
  const [tilt, setTilt] = useState(0)
  const [listening, setListening] = useState(false)

  useEffect(() => {
    if (!isListening) { setBrow(0); setTilt(0); setListening(false); return }
    setListening(true); setBrow(1)
    const t1 = setTimeout(() => setBrow(0), 1400)
    const t2 = setTimeout(() => setTilt(0.6), 200)
    const t3 = setTimeout(() => setTilt(0), 1000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [isListening, speechBoundary])

  const browRaise = brow

  /* ── Head nod when speaking starts ── */
  const [speakTilt, setSpeakTilt] = useState(0)
  useEffect(() => {
    if (speaking) { setSpeakTilt(0.4); setTimeout(() => setSpeakTilt(0), 400) }
  }, [speaking])

  const totalTilt = tilt + speakTilt
  const open = mouth
  const showInner = open > 0.13

  return (
    <div className="inline-flex items-center justify-center select-none"
      style={{ width: size, height: size, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))' }}>
      <svg viewBox="0 0 200 250" className="w-full h-full"
        style={{ transform: `rotate(${totalTilt}deg)`, transition: 'transform 0.2s ease' }}>
        <defs>
          {/* ── Skin ── */}
          <radialGradient id="sg" cx="50%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#f0dccc" />
            <stop offset="35%" stopColor="#e8ceb4" />
            <stop offset="70%" stopColor="#dbb99a" />
            <stop offset="100%" stopColor="#c8a280" />
          </radialGradient>
          <radialGradient id="jawSh" cx="50%" cy="82%" r="30%">
            <stop offset="0%" stopColor="#b07a5a" stopOpacity="0.30" />
            <stop offset="50%" stopColor="#b07a5a" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#c8a280" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="chkH" cx="80%" cy="55%" r="18%">
            <stop offset="0%" stopColor="#f0dccc" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f0dccc" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="chkSh" cx="25%" cy="60%" r="22%">
            <stop offset="0%" stopColor="#b07a5a" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#b07a5a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="noseSh" cx="50%" cy="0%" r="40%">
            <stop offset="0%" stopColor="#b88966" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#b88966" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hair1" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#4a3525" />
            <stop offset="40%" stopColor="#3d2a1a" />
            <stop offset="100%" stopColor="#2d1d10" />
          </linearGradient>
          <linearGradient id="hair2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3d2a1a" stopOpacity="0" />
            <stop offset="50%" stopColor="#4a3525" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3d2a1a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="earIn" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c8a280" />
            <stop offset="100%" stopColor="#b88966" />
          </linearGradient>
          <radialGradient id="iris" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#6a7b5a" />
            <stop offset="60%" stopColor="#4a5d3a" />
            <stop offset="100%" stopColor="#2a3d20" />
          </radialGradient>
          <radialGradient id="irisGlow" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#8a9b6a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6a7b5a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="collar" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#f5f5f5" />
            <stop offset="100%" stopColor="#d8d8d8" />
          </linearGradient>
          <linearGradient id="tieG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6a3a5a" />
            <stop offset="50%" stopColor="#5a2a4a" />
            <stop offset="100%" stopColor="#4a1a3a" />
          </linearGradient>
          <linearGradient id="lipUp" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#c07a5a" />
            <stop offset="50%" stopColor="#b06a4a" />
            <stop offset="100%" stopColor="#9a5a3a" />
          </linearGradient>
          <linearGradient id="lipLow" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#8a5a4a" />
            <stop offset="100%" stopColor="#b87a5a" />
          </linearGradient>
          <filter id="sh1"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.06" /></filter>
          <filter id="sh2"><feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.10" /></filter>
          <filter id="sh3"><feDropShadow dx="0" dy="0.5" stdDeviation="0.5" floodColor="#000" floodOpacity="0.12" /></filter>
          <filter id="innerSh"><feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.25" /></filter>
          {speaking && (
            <style>{`@keyframes gp{0%,100%{opacity:0.06}50%{opacity:0.20}}.gs{animation:gp 0.5s ease-in-out infinite}`}</style>
          )}
        </defs>

        {/* ── Shoulders ── */}
        <path d="M 16 250 Q 26 224 46 209 Q 76 202 100 202 Q 124 202 154 209 Q 174 224 184 250 Z"
          fill="#c8ced6" filter="url(#sh1)" />
        {/* Collar */}
        <path d="M 46 250 Q 52 224 64 212 Q 80 204 100 204 Q 120 204 136 212 Q 148 224 154 250 Z"
          fill="url(#collar)" />
        <path d="M 62 214 L 68 220 L 74 214 Q 80 211 86 214 L 90 220 L 94 214" fill="none" stroke="#bbb" strokeWidth="0.6" opacity="0.4" />
        <path d="M 106 214 L 110 220 L 114 214 Q 120 211 126 214 L 130 220 L 136 214" fill="none" stroke="#bbb" strokeWidth="0.6" opacity="0.4" />
        {/* Tie */}
        <path d="M 94 214 L 100 220 L 106 214 L 108 250 L 92 250 Z" fill="url(#tieG)" />
        {/* Collar fold */}
        <path d="M 36 224 Q 60 208 100 204 Q 140 208 164 224" fill="none" stroke="#c0c0c0" strokeWidth="0.8" opacity="0.3" />

        {/* ── Neck ── */}
        <rect x="78" y="182" width="44" height="22" rx="5" fill="#e0c8ae" />
        <path d="M 96 192 Q 100 198 104 192" fill="none" stroke="#b07a5a" strokeWidth="0.5" opacity="0.15" />
        {/* Adam's apple */}
        <path d="M 96 198 Q 100 205 104 198" fill="none" stroke="#b88966" strokeWidth="0.5" opacity="0.12" />
        {/* Neck shadow */}
        <path d="M 78 184 Q 80 195 82 204" fill="none" stroke="#b07a5a" strokeWidth="1.5" opacity="0.06" />
        <path d="M 122 184 Q 120 195 118 204" fill="none" stroke="#b07a5a" strokeWidth="1.5" opacity="0.06" />

        {/* ── Head ── */}
        <ellipse cx="100" cy="108" rx="60" ry="74" fill="url(#sg)" filter="url(#sh1)" />
        {/* Temples shadow */}
        <ellipse cx="44" cy="100" rx="12" ry="30" fill="#b88966" opacity="0.04" />
        <ellipse cx="156" cy="100" rx="12" ry="30" fill="#b88966" opacity="0.04" />
        {/* Forehead highlight */}
        <ellipse cx="100" cy="52" rx="28" ry="18" fill="#f0dccc" opacity="0.15" />
        {/* Jawline */}
        <path d="M 40 108 Q 34 132 44 150 Q 54 170 74 179 Q 86 184 100 186 Q 114 184 126 179 Q 146 170 156 150 Q 166 132 160 108"
          fill="none" stroke="#b07a5a" strokeWidth="0.6" opacity="0.18" />
        <path d="M 100 186 L 100 190" fill="none" stroke="#b07a5a" strokeWidth="0.6" opacity="0.15" />
        {/* Chin shadow */}
        <ellipse cx="100" cy="152" rx="36" ry="20" fill="url(#jawSh)" />
        {/* Cheekbone highlights */}
        <ellipse cx="66" cy="104" rx="14" ry="12" fill="url(#chkH)" />
        <ellipse cx="134" cy="104" rx="14" ry="12" fill="url(#chkH)" />
        {/* Cheek shadows */}
        <ellipse cx="56" cy="112" rx="16" ry="14" fill="url(#chkSh)" />
        <ellipse cx="144" cy="112" rx="16" ry="14" fill="url(#chkSh)" />

        {/* ── Ears ── */}
        <g filter="url(#sh2)">
          <ellipse cx="46" cy="108" rx="7" ry="13" fill="url(#earIn)" stroke="#b88966" strokeWidth="0.4" />
          <path d="M 47 103 Q 51 108 47 113" fill="none" stroke="#b07a5a" strokeWidth="0.5" opacity="0.3" />
          <path d="M 46 99 Q 43 103 46 107" fill="none" stroke="#a06a4a" strokeWidth="0.4" opacity="0.2" />
          <ellipse cx="152" cy="108" rx="7" ry="13" fill="url(#earIn)" stroke="#b88966" strokeWidth="0.4" />
          <path d="M 151 103 Q 155 108 151 113" fill="none" stroke="#b07a5a" strokeWidth="0.5" opacity="0.3" />
          <path d="M 152 99 Q 149 103 152 107" fill="none" stroke="#a06a4a" strokeWidth="0.4" opacity="0.2" />
        </g>

        {/* ── Hair ── */}
        <g filter="url(#sh2)">
          {/* Main volume */}
          <path d="M 32 86 Q 28 44 52 28 Q 72 16 100 12 Q 128 16 148 28 Q 172 44 168 86
                   Q 164 60 158 52 Q 148 38 130 30 Q 118 24 100 22 Q 82 24 70 30
                   Q 52 38 42 52 Q 36 60 32 86 Z" fill="url(#hair1)" />
          {/* Side left */}
          <path d="M 32 86 Q 28 92 29 104 Q 30 116 36 122 Q 34 112 36 98 Q 38 88 32 86 Z" fill="url(#hair1)" />
          <path d="M 33 88 Q 30 96 31 104 Q 33 112 36 116 Q 35 108 36 98 Q 37 92 33 88 Z" fill="#4a3525" opacity="0.3" />
          {/* Side right */}
          <path d="M 168 86 Q 172 92 171 104 Q 170 116 164 122 Q 166 112 164 98 Q 162 88 168 86 Z" fill="url(#hair1)" />
          <path d="M 167 88 Q 170 96 169 104 Q 167 112 164 116 Q 165 108 164 98 Q 163 92 167 88 Z" fill="#4a3525" opacity="0.3" />
          {/* Sideburns */}
          <path d="M 38 80 Q 36 94 38 108" fill="none" stroke="#3d2a1a" strokeWidth="2.5" opacity="0.2" />
          <path d="M 162 80 Q 164 94 162 108" fill="none" stroke="#3d2a1a" strokeWidth="2.5" opacity="0.2" />
          {/* Hair strands */}
          <path d="M 60 32 Q 65 28 72 26 M 80 24 Q 88 20 96 22 M 108 20 Q 116 20 124 24 M 132 28 Q 140 32 146 36"
            fill="none" stroke="#5a4535" strokeWidth="0.4" opacity="0.3" />
          <path d="M 50 50 Q 58 44 68 42 M 130 40 Q 140 42 148 48"
            fill="none" stroke="#5a4535" strokeWidth="0.4" opacity="0.25" />
          {/* Hair shine */}
          <path d="M 64 32 Q 80 22 100 20 Q 120 22 136 32" fill="none" stroke="#5a4535" strokeWidth="0.3" opacity="0.15" />
          <path d="M 70 36 Q 90 28 110 28 Q 130 30 144 36" fill="none" stroke="#6a5545" strokeWidth="0.3" opacity="0.08" />
        </g>
        {/* Forehead hair shadow */}
        <path d="M 48 52 Q 60 48 80 44 Q 100 42 120 44 Q 140 48 152 52 Q 140 58 100 60 Q 60 58 48 52 Z"
          fill="#2d1d10" opacity="0.06" />

        {/* ── Eyebrows ── */}
        <g filter="url(#sh3)">
          <path d={`M 66 ${84 + browRaise * 2.5} Q 76 ${80 + browRaise * 2} 88 ${82 + browRaise * 2.5}`}
            fill="none" stroke="#3d2a1a" strokeWidth="1.6" strokeLinecap="round" />
          <path d={`M 67 ${83 + browRaise * 2.5} Q 76 ${79 + browRaise * 2} 87 ${81 + browRaise * 2.5}`}
            fill="none" stroke="#4d3a2a" strokeWidth="0.5" strokeLinecap="round" opacity="0.4" />
          <path d={`M 112 ${82 + browRaise * 2.5} Q 124 ${80 + browRaise * 2} ${134} ${84 + browRaise * 2.5}`}
            fill="none" stroke="#3d2a1a" strokeWidth="1.6" strokeLinecap="round" />
          <path d={`M 113 ${81 + browRaise * 2.5} Q 124 ${79 + browRaise * 2} ${133} ${83 + browRaise * 2.5}`}
            fill="none" stroke="#4d3a2a" strokeWidth="0.5" strokeLinecap="round" opacity="0.4" />
        </g>

        {/* ── Eyes ── */}
        {(() => {
          const b = blink
          /* Left eye */
          const L = <>
            {/* Eye socket shadow */}
            <ellipse cx="82" cy="95" rx="13" ry="8" fill="#b07a5a" opacity="0.04" />
            {/* Sclera */}
            <ellipse cx="82" cy="95" rx="11" ry={b ? 0.8 : 6} fill="#f5f0ea" filter="url(#sh3)" />
            {/* Under-eye bag */}
            <path d="M 71 102 Q 82 106 93 102" fill="none" stroke="#b07a5a" strokeWidth="0.5" opacity="0.08" />
            {/* Tear duct */}
            <path d="M 71 95 Q 73 93 75 95" fill="none" stroke="#b88966" strokeWidth="0.4" opacity="0.15" />
            {!b && <>
              {/* Iris */}
              <ellipse cx="82" cy="95" rx="5.2" ry="5.5" fill="url(#iris)" filter="url(#sh3)" />
              <ellipse cx="82" cy="95" rx="5" ry="5.2" fill="url(#irisGlow)" />
              {/* Pupil */}
              <circle cx="82" cy="95" r="3" fill="#1a1a1a" />
              {/* Pupil light */}
              <circle cx="83.5" cy="94" r="1" fill="#f5f0ea" opacity="0.7" />
              <circle cx="80.5" cy="96.5" r="0.4" fill="#f5f0ea" opacity="0.3" />
              {/* Upper eyelid crease */}
              <path d="M 71 89 Q 82 86 93 89" fill="none" stroke="#cda07e" strokeWidth="0.4" opacity="0.4" />
              {/* Upper lashes */}
              <path d="M 73 89 Q 78 87 82 88 M 82 88 Q 86 87 91 89 M 76 89 Q 80 86 82 87 M 82 87 Q 86 86 90 89"
                fill="none" stroke="#3d2a1a" strokeWidth="0.4" opacity="0.2" />
              {/* Lower lashes */}
              <path d="M 75 101 Q 80 103 84 102 M 84 102 Q 88 103 92 101"
                fill="none" stroke="#3d2a1a" strokeWidth="0.3" opacity="0.15" />
            </>}
          </>

          /* Right eye */
          const R = <>
            <ellipse cx="118" cy="95" rx="13" ry="8" fill="#b07a5a" opacity="0.04" />
            <ellipse cx="118" cy="95" rx="11" ry={b ? 0.8 : 6} fill="#f5f0ea" filter="url(#sh3)" />
            <path d="M 107 102 Q 118 106 129 102" fill="none" stroke="#b07a5a" strokeWidth="0.5" opacity="0.08" />
            <path d="M 129 95 Q 127 93 125 95" fill="none" stroke="#b88966" strokeWidth="0.4" opacity="0.15" />
            {!b && <>
              <ellipse cx="118" cy="95" rx="5.2" ry="5.5" fill="url(#iris)" filter="url(#sh3)" />
              <ellipse cx="118" cy="95" rx="5" ry="5.2" fill="url(#irisGlow)" />
              <circle cx="118" cy="95" r="3" fill="#1a1a1a" />
              <circle cx="119.5" cy="94" r="1" fill="#f5f0ea" opacity="0.7" />
              <circle cx="116.5" cy="96.5" r="0.4" fill="#f5f0ea" opacity="0.3" />
              <path d="M 107 89 Q 118 86 129 89" fill="none" stroke="#cda07e" strokeWidth="0.4" opacity="0.4" />
              <path d="M 109 89 Q 114 87 118 88 M 118 88 Q 122 87 127 89 M 112 89 Q 116 86 118 87 M 118 87 Q 122 86 126 89"
                fill="none" stroke="#3d2a1a" strokeWidth="0.4" opacity="0.2" />
              <path d="M 108 101 Q 112 103 116 102 M 116 102 Q 120 103 125 101"
                fill="none" stroke="#3d2a1a" strokeWidth="0.3" opacity="0.15" />
            </>}
          </>
          return <>{L}{R}</>
        })()}

        {/* ── Glasses ── */}
        <g opacity="0.4">
          {/* Frames */}
          <rect x="68" y="87" width="28" height="18" rx="4" fill="none" stroke="#4a4a5a" strokeWidth="0.8" />
          <rect x="104" y="87" width="28" height="18" rx="4" fill="none" stroke="#4a4a5a" strokeWidth="0.8" />
          {/* Bridge */}
          <path d="M 96 94 Q 100 91 104 94" fill="none" stroke="#4a4a5a" strokeWidth="0.8" />
          {/* Temples */}
          <path d="M 68 94 L 56 89" fill="none" stroke="#4a4a5a" strokeWidth="0.6" />
          <path d="M 132 94 L 144 89" fill="none" stroke="#4a4a5a" strokeWidth="0.6" />
          {/* Lens reflection */}
          <path d="M 72 92 Q 78 89 83 92" fill="none" stroke="white" strokeWidth="0.4" opacity="0.15" />
          <path d="M 108 92 Q 114 89 119 92" fill="none" stroke="white" strokeWidth="0.4" opacity="0.15" />
          <path d="M 70 94 Q 74 96 78 94" fill="none" stroke="white" strokeWidth="0.3" opacity="0.08" />
          <path d="M 106 94 Q 110 96 114 94" fill="none" stroke="white" strokeWidth="0.3" opacity="0.08" />
        </g>

        {/* ── Nose ── */}
        <g>
          {/* Bridge shadow */}
          <path d="M 94 96 Q 90 112 94 122" fill="none" stroke="url(#noseSh)" strokeWidth="3" />
          {/* Bridge line */}
          <path d="M 95 98 Q 92 112 96 122" fill="none" stroke="#b88966" strokeWidth="0.6" opacity="0.25" />
          <path d="M 105 98 Q 108 112 104 122" fill="none" stroke="#b88966" strokeWidth="0.6" opacity="0.20" />
          {/* Nose tip */}
          <path d="M 94 122 Q 100 128 106 122" fill="none" stroke="#a06a4a" strokeWidth="0.8" strokeLinecap="round" />
          <ellipse cx="100" cy="124" rx="8" ry="4" fill="#b88966" opacity="0.06" />
          {/* Nostrils */}
          <ellipse cx="95" cy="124" rx="2.5" ry="1.4" fill="#8a5a3a" opacity="0.35" />
          <ellipse cx="105" cy="124" rx="2.5" ry="1.4" fill="#8a5a3a" opacity="0.35" />
          {/* Nostril shadows */}
          <path d="M 92 124 Q 95 127 98 124" fill="none" stroke="#8a5a3a" strokeWidth="0.3" opacity="0.2" />
          <path d="M 102 124 Q 105 127 108 124" fill="none" stroke="#8a5a3a" strokeWidth="0.3" opacity="0.2" />
          {/* Nose highlight */}
          <ellipse cx="100" cy="104" rx="3" ry="6" fill="#f0dccc" opacity="0.08" />
        </g>

        {/* ── Nasolabial folds ── */}
        <path d="M 70 126 Q 72 134 76 140" fill="none" stroke="#b88966" strokeWidth="0.4" opacity="0.12" />
        <path d="M 130 126 Q 128 134 124 140" fill="none" stroke="#b88966" strokeWidth="0.4" opacity="0.12" />

        {/* ── MOUTH (oval) ── */}
        {(() => {
          const rx = 14 + open * 8
          const ry = 2 + open * 14
          return (
            <ellipse cx="100" cy={153 + open * 2} rx={rx} ry={ry}
              fill={open > 0.08 ? '#8a4a3a' : 'url(#lipUp)'}
              stroke="#7a3a2a" strokeWidth="0.6" />
          )
        })()}

        {/* ── Chin dimple ── */}
        <path d="M 96 168 Q 100 171 104 168" fill="none" stroke="#b07a5a" strokeWidth="0.3" opacity="0.08" />

        {/* ── Speaking glow ── */}
        {speaking && (
          <circle cx="100" cy="110" r="76" fill="none" stroke="#6366f1" strokeWidth="1.2" className="gs" />
        )}
      </svg>
    </div>
  )
}
