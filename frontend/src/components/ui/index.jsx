import { cn } from '../../utils/helpers'
import { Loader2 } from 'lucide-react'
import { cloneElement } from 'react'

export function Spinner({ size = 20, className }) {
  return <Loader2 size={size} className={cn('animate-spin text-brand-500', className)} />
}

export function LoadingScreen({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Spinner size={32} />
      <p className="text-surface-500 text-sm">{message}</p>
    </div>
  )
}

export function BandBadge({ band, size = 'md' }) {
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1', lg: 'text-base px-4 py-1.5' }
  const colors = !band
    ? 'bg-surface-100 text-surface-400'
    : band >= 8   ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    : band >= 7   ? 'bg-blue-50 text-blue-700 border border-blue-200'
    : band >= 6   ? 'bg-amber-50 text-amber-700 border border-amber-200'
    : band >= 5   ? 'bg-orange-50 text-orange-700 border border-orange-200'
    :               'bg-red-50 text-red-700 border border-red-200'

  return (
    <span className={cn('inline-flex items-center rounded-full font-bold', sizes[size], colors)}>
      Band {band ? Number(band).toFixed(1) : '—'}
    </span>
  )
}

export function SectionTag({ type }) {
  const styles = {
    reading:   'bg-blue-50 text-blue-700',
    listening: 'bg-purple-50 text-purple-700',
    writing:   'bg-orange-50 text-orange-700',
    speaking:  'bg-emerald-50 text-emerald-700',
  }
  const icons = { reading: '📖', listening: '🎧', writing: '✍️', speaking: '🎤' }
  return (
    <span className={cn('badge gap-1', styles[type] || 'bg-surface-100 text-surface-600')}>
      {icons[type]} {type?.charAt(0).toUpperCase() + type?.slice(1)}
    </span>
  )
}

export function ProgressBar({ value, max = 100, color = 'bg-brand-500', height = 'h-2' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className={cn('w-full bg-surface-100 rounded-full overflow-hidden', height)}>
      <div
        className={cn('h-full rounded-full transition-all duration-700', color)}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-surface-800 mb-2">{title}</h3>
      <p className="text-surface-500 text-sm max-w-xs mb-6">{description}</p>
      {action}
    </div>
  )
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card p-6 w-full max-w-lg shadow-2xl animate-slide-up">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-surface-900 text-lg font-display">{title}</h3>
            <button onClick={onClose} className="btn-ghost text-surface-400 hover:text-surface-700 px-2">✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export function StatCard({ label, value, sub, icon, color = 'text-brand-600' }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="section-label mb-2">{label}</p>
          <p className={cn('text-3xl font-bold font-display', color)}>{value}</p>
          {sub && <p className="text-xs text-surface-400 mt-1">{sub}</p>}
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
    </div>
  )
}

export function StartOverlay({ onStart, onClose, moduleName = 'Test', icon }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backdropFilter: 'blur(0px)',
        WebkitBackdropFilter: 'blur(0px)',
        background: 'rgba(0, 0, 0, 0.85)',
      }}>
      <div
        className="relative text-center max-w-[320px] mx-4 w-full px-6"
        style={{ animation: 'fadeUp 0.4s ease both' }}
      >
        {onClose && (
          <button onClick={onClose} className="absolute -top-2 right-0 text-white/40 hover:text-white/80 transition-colors text-xl leading-none">✕</button>
        )}
        {icon && (
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 flex items-center justify-center rounded-full bg-black/20">
              {cloneElement(icon, { size: 80, color: '#ffffff' })}
            </div>
          </div>
        )}

        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
          {moduleName} Test
        </h3>

        <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-[260px] mx-auto">
          You have limited time. Make sure you are ready before starting.
        </p>

        <button
          onClick={onStart}
          className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-white text-xs font-bold transition-all hover:-translate-y-0.5 active:scale-[0.97]"
          style={{
            background: 'linear-gradient(135deg, #CC0000, #ff1a1a)',
            boxShadow: '0 4px 12px rgba(204, 0, 0, 0.3)',
          }}
        >
          Start
        </button>
      </div>

      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
