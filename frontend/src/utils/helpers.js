import clsx from 'clsx'

export const cn = (...args) => clsx(...args)

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const formatBand = (band) => {
  if (band === null || band === undefined) return '—'
  return Number(band).toFixed(1)
}

export const bandColor = (band) => {
  if (!band) return 'text-surface-400'
  if (band >= 8)   return 'text-emerald-600'
  if (band >= 7)   return 'text-blue-600'
  if (band >= 6)   return 'text-amber-600'
  if (band >= 5)   return 'text-orange-600'
  return 'text-red-600'
}

export const bandBg = (band) => {
  if (!band) return 'bg-surface-100 text-surface-500'
  if (band >= 8)   return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (band >= 7)   return 'bg-blue-50 text-blue-700 border-blue-200'
  if (band >= 6)   return 'bg-amber-50 text-amber-700 border-amber-200'
  if (band >= 5)   return 'bg-orange-50 text-orange-700 border-orange-200'
  return 'bg-red-50 text-red-700 border-red-200'
}

export const sectionIcon = (type) => {
  const icons = {
    reading:   '📖',
    listening: '🎧',
    writing:   '✍️',
    speaking:  '🎤',
  }
  return icons[type] || '📝'
}

export const sectionColor = (type) => {
  const colors = {
    reading:   'from-blue-500 to-blue-600',
    listening: 'from-purple-500 to-purple-600',
    writing:   'from-orange-500 to-amber-500',
    speaking:  'from-emerald-500 to-teal-500',
  }
  return colors[type] || 'from-brand-500 to-brand-600'
}

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export const formatNPR = (paisa) => {
  if (!paisa) return 'Free'
  const rupees = paisa / 100
  return `NPR ${rupees.toLocaleString('en-NP')}`
}

export const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length

/* ─── IELTS Band Score Conversion Tables (from BandScore page) ─── */
const LISTENING_BAND = [
  [40, 9.0], [35, 8.0], [30, 7.0], [23, 6.0], [16, 5.0],
  [9, 4.0], [2, 3.0],
]

const READING_ACADEMIC_BAND = [
  [40, 9.0], [35, 8.0], [30, 7.0], [23, 6.0], [15, 5.0],
  [8, 4.0], [1, 3.0],
]

const READING_GENERAL_BAND = [
  [40, 9.0], [38, 8.0], [34, 7.0], [23, 6.0], [15, 5.0],
  [8, 4.0], [1, 3.0],
]

const _lookupBand = (raw, table) => {
  for (const [threshold, band] of table) {
    if (raw >= threshold) return band
  }
  return 0
}

export const calculateListeningBand = (correct, total) => {
  const raw = Math.min(correct, total)
  return _lookupBand(raw, LISTENING_BAND)
}

export const calculateReadingBand = (correct, total, testType = 'academic') => {
  const raw = Math.min(correct, total)
  const table = testType === 'general' ? READING_GENERAL_BAND : READING_ACADEMIC_BAND
  return _lookupBand(raw, table)
}
