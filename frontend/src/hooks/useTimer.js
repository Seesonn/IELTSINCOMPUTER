import { useState, useEffect, useRef } from 'react'

export function useTimer(initialSeconds, onExpire, running = true) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const ref = useRef(null)
  const initRef = useRef(initialSeconds)

  useEffect(() => {
    if (!running) {
      setSeconds(initRef.current)
      clearInterval(ref.current)
      return
    }
    setSeconds(initRef.current)
    ref.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(ref.current)
          onExpire?.()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [running])

  const stop = () => clearInterval(ref.current)
  const elapsed = initRef.current - seconds

  return { seconds, elapsed, stop }
}
