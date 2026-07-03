import { useState, useEffect } from 'react'
import { authApi } from '../utils/api'
import { LoadingScreen } from '../components/ui'
import {
  Smartphone, Monitor, Globe, Clock,
  MapPin, Fingerprint, AlertTriangle, CheckCircle, XCircle,
} from 'lucide-react'

const STATUS_META = {
  success:    { icon: CheckCircle, label: 'Success',    className: 'text-green-600 bg-green-50 border-green-200' },
  failed:     { icon: XCircle,     label: 'Failed',     className: 'text-red-600 bg-red-50 border-red-200' },
  suspicious: { icon: AlertTriangle, label: 'Suspicious', className: 'text-amber-600 bg-amber-50 border-amber-200' },
  active:     { icon: Clock,       label: 'Active',     className: 'text-green-700 bg-green-50 border-green-300' },
}

const deviceIcon = (deviceName) => {
  const name = (deviceName || '').toLowerCase()
  if (name.includes('iphone') || name.includes('android')) return Smartphone
  if (name.includes('ipad') || name.includes('tablet')) return Monitor
  if (name.includes('mac') || name.includes('windows')) return Monitor
  return Globe
}

export default function LoginHistoryPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authApi.loginHistory()
      .then(r => setRecords(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen message="Loading login history…" />

  const activeDevice = records.find(r => r.id === 0)
  const historyRecords = records.filter(r => r.id !== 0)

  const formatTime = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  }

  const DeviceRow = (r) => {
    const StatusIcon = (STATUS_META[r.login_status] || STATUS_META.success).icon
    const statusLabel = (STATUS_META[r.login_status] || STATUS_META.success).label
    const statusClass = (STATUS_META[r.login_status] || STATUS_META.success).className
    const Icon = deviceIcon(r.device_name)
    const location = [r.city, r.country].filter(Boolean).join(', ') || null
    const isActive = r.id === 0

    return (
      <div className="flex items-start gap-4">
        {/* Device icon */}
        <div className="relative shrink-0 mt-0.5">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? 'bg-green-100' : 'bg-icon-light'}`}>
            <Icon size={16} className={isActive ? 'text-green-700' : 'text-icon'} />
          </div>
          {isActive && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full animate-pulse" />
          )}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900 truncate">
              {r.device_name || 'Unknown Device'}
            </span>
            {r.login_status === 'success' && r.id !== 0 ? (
              <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                {formatTime(r.login_time)}
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusClass}`}>
                <StatusIcon size={10} />
                {statusLabel}
              </span>
            )}
            {isActive && (
              <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Current session</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
            {r.os_name && (
              <span className="flex items-center gap-1">
                <Monitor size={11} className="text-icon/50" />
                {r.os_name}
              </span>
            )}
            {r.browser_name && (
              <span className="flex items-center gap-1">
                <Globe size={11} className="text-icon/50" />
                {r.browser_name}{r.browser_version ? ` ${r.browser_version}` : ''}
              </span>
            )}
            {r.ip_address && (
              <span className="font-mono">{r.ip_address}</span>
            )}
            {location && (
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-icon/50" />
                {location}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 page-fade">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ── Header ── */}
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-green-700 mb-1">
            Security
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            Devices & Login History
          </h1>
        </div>

        {/* ── Active Device ── */}
        {activeDevice && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Smartphone size={15} className="text-green-600" />
              Active Device
            </h2>
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 p-5 rounded-xl shadow-sm shadow-green-100/60">
              <DeviceRow {...activeDevice} />
            </div>
          </div>
        )}

        {/* ── Login History ── */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Fingerprint size={15} className="text-green-600" />
            Login History
            <span className="text-xs font-normal text-gray-400">Last 10 logins</span>
          </h2>

          {historyRecords.length === 0 ? (
            <div className="bg-white border border-gray-100 p-16 text-center">
              <Fingerprint size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-semibold text-gray-700">No login history yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Your login attempts will appear here after you sign in.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 divide-y divide-gray-50">
              {historyRecords.map(r => (
                <div key={r.id} className="px-5 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                  <DeviceRow {...r} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
