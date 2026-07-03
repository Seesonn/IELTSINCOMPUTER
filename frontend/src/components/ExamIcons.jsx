export function ReadingIcon({ size = 24, color = '#002147', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 5v14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="8" x2="10" y2="8" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
      <line x1="6" y1="11" x2="10" y2="11" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
      <line x1="14" y1="8" x2="18" y2="8" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
      <line x1="14" y1="11" x2="18" y2="11" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

export function ListeningIcon({ size = 24, color = '#002147', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5 11c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5 12.5c0 2.5 2 4.5 4.5 4.5h5c2.5 0 4.5-2 4.5-4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9.5" y1="21.5" x2="14.5" y2="21.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 10v1c0 .8.6 1.4 1.4 1.4.8 0 1.4-.6 1.4-1.4v-1" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.6 10v1c0 .8-.6 1.4-1.4 1.4-.8 0-1.4-.6-1.4-1.4v-1" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 15c0 .6.4 1 1 1s1-.4 1-1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function WritingIcon({ size = 24, color = '#002147', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M17 4l4 4-11 11-5 1 1-5L17 4z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="16" y1="5" x2="20" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="13" x2="11" y2="16" stroke={color} strokeWidth="1.1" strokeLinecap="round" opacity="0.4" />
      <line x1="7" y1="14.5" x2="10" y2="17.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" opacity="0.4" />
      <line x1="9" y1="11.5" x2="12" y2="14.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" opacity="0.4" />
      <line x1="20" y1="11" x2="17" y2="14" stroke={color} strokeWidth="1.1" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

export function SpeakingIcon({ size = 24, color = '#002147', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="7" r="3.5" stroke={color} strokeWidth="1.5" />
      <path d="M5 19.5c0-3 3.1-5.5 7-5.5s7 2.5 7 5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 16L7 19h10l-1.5-3" stroke={color} strokeWidth="1.3" strokeLinejoin="round" opacity="0.35" />
      <line x1="12" y1="18.5" x2="12" y2="21" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}
