import { useEffect, useRef, useCallback } from 'react'

const DEVTOOLS_THRESHOLD = 160

export default function useAntiCheat({ onViolation, warnings, enabled = true } = {}) {
  const violationsRef = useRef(0)
  const devtoolIntervalRef = useRef(null)

  const report = useCallback((type) => {
    violationsRef.current += 1
    if (onViolation) onViolation(type, violationsRef.current)
  }, [onViolation])

  useEffect(() => {
    if (!enabled) return

    const handleContextMenu = (e) => {
      e.preventDefault()
      if (warnings) report('right-click')
    }

    const handleKeyDown = (e) => {
      const isDevTools =
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U')
      if (isDevTools) {
        e.preventDefault()
        if (warnings) report('devtools-shortcut')
      }
      if ((e.ctrlKey && ['C', 'V', 'X', 'S', 'P'].includes(e.key.toUpperCase())) ||
          (e.metaKey && ['C', 'V', 'X', 'S', 'P'].includes(e.key.toUpperCase()))) {
        if (e.key.toUpperCase() !== 'S') {
          e.preventDefault()
          if (warnings) report('copy-paste')
        }
      }
    }

    const handleCopy = (e) => { e.preventDefault(); if (warnings) report('copy') }
    const handleCut = (e) => { e.preventDefault(); if (warnings) report('cut') }
    const handlePaste = (e) => { e.preventDefault(); if (warnings) report('paste') }

    const handleVisibility = () => {
      if (document.hidden && warnings) report('tab-switch')
    }

    const handleBlur = () => {
      if (warnings) report('window-blur')
    }

    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > DEVTOOLS_THRESHOLD
      const heightThreshold = window.outerHeight - window.innerHeight > DEVTOOLS_THRESHOLD
      if (widthThreshold || heightThreshold) {
        if (warnings) report('devtools-open')
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('cut', handleCut)
    document.addEventListener('paste', handlePaste)
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('blur', handleBlur)
    devtoolIntervalRef.current = setInterval(detectDevTools, 2000)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('cut', handleCut)
      document.removeEventListener('paste', handlePaste)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('blur', handleBlur)
      if (devtoolIntervalRef.current) clearInterval(devtoolIntervalRef.current)
    }
  }, [enabled, warnings, report])

  return { violations: violationsRef.current }
}
