import { useNavigate } from 'react-router-dom'
import { X, Clock } from 'lucide-react'
import { formatTime, cn } from '../../utils/helpers'

export default function TestHeader({ title, section, seconds, onSubmit, submitting }) {
  const navigate = useNavigate()
  const warn = seconds > 0 && seconds < 300

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-surface-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { if (window.confirm('Exit test? Progress will be lost.')) navigate('/tests') }}
            className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500"
          >
            <X size={18} />
          </button>
          <div>
            <p className="font-bold text-surface-900 text-sm font-display">{title}</p>
            <p className="text-xs text-surface-400 capitalize">{section} section</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-bold',
            warn ? 'bg-red-50 text-red-600 timer-warning' : 'bg-surface-100 text-surface-700'
          )}>
            <Clock size={13} />
            {formatTime(seconds)}
          </div>
          <button onClick={onSubmit} disabled={submitting} className="btn-primary py-1.5 text-sm">
            {submitting
              ? <><div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Submitting…</>
              : 'Submit Test'
            }
          </button>
        </div>
      </div>
    </div>
  )
}
