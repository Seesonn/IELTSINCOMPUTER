import { useEffect, useState, useRef } from 'react'
import { paymentsApi, subscriptionApi } from '../utils/api'
import useAuthStore from '../store/authStore'
import { LoadingScreen } from '../components/ui'
import { CheckCircle, Upload, Clock, AlertCircle, Image, X } from 'lucide-react'
import toast from 'react-hot-toast'
import esewaLogo from '../assets/esewa.jpg'
import khaltiLogo from '../assets/khalti.jpg'

const GATEWAYS = {
  esewa: {
    label: 'eSewa',
    color: '#60a040',
    bg: '#f0fae8',
    border: '#c8e6b9',
    textColor: '#2e7d32',
    qrLabel: 'Scan with eSewa app',
    instructions: ['Open eSewa app', 'Scan this QR code', 'Enter amount and pay', 'Take a screenshot of confirmation'],
  },
  khalti: {
    label: 'Khalti',
    color: '#6c3096',
    bg: '#f5edfc',
    border: '#d4bce8',
    textColor: '#6c3096',
    qrLabel: 'Scan with Khalti app',
    instructions: ['Open Khalti app', 'Scan this QR code', 'Enter amount and pay', 'Take a screenshot of confirmation'],
  },
}

export default function PricingPage() {
  const { user } = useAuthStore()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedGateway, setSelectedGateway] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const fileRef = useRef(null)

  // Subscription request status
  const [myRequest, setMyRequest] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    paymentsApi.plans().then(r => setPlans(r.data)).finally(() => setLoading(false))
    loadMyRequest()
  }, [])

  const loadMyRequest = async () => {
    try {
      const r = await subscriptionApi.myRequests()
      if (r.data?.length) setMyRequest(r.data[0])
    } catch {}
  }

  const handleGatewayClick = (gateway, plan) => {
    setSelectedGateway(gateway)
    setSelectedPlan(plan)
  }

  const closePanel = () => {
    setSelectedGateway(null)
    setSelectedPlan(null)
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const r = await subscriptionApi.uploadScreenshot(file, selectedGateway, selectedPlan?.plan_type)
      toast.success('Screenshot uploaded! Awaiting admin approval.')
      loadMyRequest()
      closePanel()
    } catch (err) {
      const data = err.response?.data
      const status = err.response?.status
      let msg = `Upload failed (${status || 'network error'})`
      if (data?.detail) {
        msg = typeof data.detail === 'string' ? data.detail
            : Array.isArray(data.detail) ? data.detail.map(d => d.msg || d.message || JSON.stringify(d)).join('; ')
            : JSON.stringify(data.detail)
      } else if (data?.message) {
        msg = data.message
      }
      toast.error(msg)
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  if (loading) return <LoadingScreen message="Loading plans…" />

  const planOrder = { free: 0, premium: 1, enterprise: 2 }
  const sorted = [...plans].sort((a, b) => (planOrder[a.plan_type] ?? 9) - (planOrder[b.plan_type] ?? 9))

  const trustItems = [
    { icon: '●', label: 'Secure Payment',  sub: 'SSL Encrypted' },
    { icon: '●', label: 'Nepal Payment',  sub: 'eSewa & Khalti' },
    { icon: '●', label: 'Instant Access',  sub: 'After payment' },
    { icon: '●', label: 'Support',         sub: 'team@ieltsincomputer.com' },
  ]

  return (
    <div className="space-y-10 page-fade" >

      {/* ── Header ── */}
      <div className="text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-red-700 mb-2">Simple Pricing</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Plan
        </h1>
        <p className="text-sm text-gray-500">
          Pay securely with eSewa or Khalti
        </p>
        {user?.plan !== 'free' && (
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-full px-4 py-1.5 text-xs font-semibold mt-4">
            <CheckCircle size={13} />
            You're on the <span className="capitalize">{user?.plan}</span> plan
          </div>
        )}
      </div>

      {/* ── Plans grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {sorted.map((plan) => {
          const isCurrent = user?.plan === plan.plan_type
          const isPremium = plan.plan_type === 'premium'
          const isFree    = plan.plan_type === 'free'
          const isEnterprise = plan.plan_type === 'enterprise'
          const features  = Array.isArray(plan.features) ? plan.features : []

          return (
            <div
              key={plan.id}
              className={`bg-white flex flex-col relative ${
                isPremium
                  ? 'border-2 border-red-700'
                  : 'border border-gray-200'
              }`}
            >
              {isPremium && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-700 text-white text-xs font-bold px-4 py-0.5 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className={`p-7 flex flex-col flex-1 ${isPremium ? 'pt-8' : ''}`}>
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">
                    {plan.name}
                  </h2>
                  <div className="flex items-baseline gap-1">
                    {isEnterprise && plan.price_npr === 0 ? (
                      <span className="text-xl font-bold text-gray-700">Custom Pricing</span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold"
                          style={{ color: isPremium ? '#CC0000' : '#111827'}}
                        >
                          {plan.price_npr === 0
                            ? 'Free'
                            : `NPR ${(plan.price_npr / 100).toLocaleString('en-NP')}`}
                        </span>
                        {plan.price_npr > 0 && (
                          <span className="text-gray-400 text-sm">/month</span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="h-px bg-gray-100 mb-5" />

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
                      <CheckCircle size={14} color="#CC0000" className="flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="w-full text-center py-2.5 px-4 rounded-lg text-sm font-semibold bg-gray-100 text-gray-400 cursor-default">
                    ✓ Current Plan
                  </div>
                ) : isFree ? (
                  <div className="w-full text-center py-2.5 px-4 rounded-lg text-sm font-semibold border border-gray-200 text-gray-400 cursor-default">
                    Free Forever
                  </div>
                ) : isEnterprise ? (
                  <a
                    href="https://wa.me/9779815366153?text=Hi%2C%20I%27m%20interested%20in%20the%20Enterprise%20On%20Demand%20plan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold text-white transition-colors"
                    style={{background:'#25D366'}}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Let's Discuss</span>
                  </a>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleGatewayClick('esewa', plan)}
                      className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 text-white text-sm font-bold transition-colors active:scale-95"
                      style={{background:'#60a040'}}
                    >
                      <svg viewBox="0 0 60 20" width="44" height="15">
                        <rect width="60" height="20" rx="4" fill="white" opacity="0.2" />
                        <circle cx="10" cy="10" r="5" fill="white" opacity="0.9" />
                        <path d="M8 7h4l-2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <text x="30" y="13" textAnchor="middle" fill="white" fontSize="9" fontFamily="Arial,sans-serif" fontWeight="700">eSewa</text>
                      </svg>
                      <span>Pay with eSewa</span>
                    </button>
                    <button
                      onClick={() => handleGatewayClick('khalti', plan)}
                      className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 text-white text-sm font-bold transition-colors active:scale-95"
                      style={{background:'#6c3096'}}
                    >
                      <svg viewBox="0 0 60 20" width="44" height="15">
                        <rect width="60" height="20" rx="4" fill="white" opacity="0.2" />
                        <circle cx="10" cy="10" r="6" fill="white" opacity="0.85" />
                        <text x="10" y="13" textAnchor="middle" fill="#6c3096" fontSize="10" fontFamily="Arial,sans-serif" fontWeight="900">K</text>
                        <text x="30" y="13" textAnchor="middle" fill="white" fontSize="9" fontFamily="Arial,sans-serif" fontWeight="700">Khalti</text>
                      </svg>
                      <span>Pay with Khalti</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Gateway Payment Panel ── */}
      {selectedGateway && selectedPlan && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-2 rounded-lg overflow-hidden"
            style={{
              borderColor: GATEWAYS[selectedGateway].border,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4"
              style={{ background: GATEWAYS[selectedGateway].bg }}
            >
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Pay with {GATEWAYS[selectedGateway].label}
                </h3>
                <p className="text-xs mt-0.5"
                  style={{ color: GATEWAYS[selectedGateway].textColor }}
                >
                  {selectedPlan.name} — NPR {(selectedPlan.price_npr / 100).toLocaleString('en-NP')}
                </p>
              </div>
              <button
                onClick={closePanel}
                className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8 items-start">

                {/* QR Code */}
                <div className="text-center">
                  <div className="inline-block bg-white rounded-lg overflow-hidden"
                    style={{ border: `2px solid ${GATEWAYS[selectedGateway].border}` }}
                  >
                    <img
                      src={selectedGateway === 'esewa' ? esewaLogo : khaltiLogo}
                      alt={GATEWAYS[selectedGateway].label}
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    {GATEWAYS[selectedGateway].qrLabel}
                  </p>

                  {/* Instructions */}
                  <ul className="mt-4 space-y-1.5 text-left">
                    {GATEWAYS[selectedGateway].instructions.map((step, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ background: GATEWAYS[selectedGateway].color }}
                        >
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Upload Screenshot */}
                <div>
                  {myRequest && myRequest.status === 'pending' ? (
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={18} className="text-amber-600" />
                        <span className="text-sm font-bold text-amber-800">Pending Review</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        You already have a pending request. Wait for admin approval.
                      </p>
                    </div>
                  ) : myRequest && myRequest.status === 'approved' ? (
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={18} className="text-green-600" />
                        <span className="text-sm font-bold text-green-800">Approved ✓</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Your account has been upgraded successfully.
                      </p>
                    </div>
                  ) : myRequest && myRequest.status === 'rejected' ? (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={18} className="text-red-600" />
                        <span className="text-sm font-bold text-red-800">Rejected ✗</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        Your previous request was rejected. You can upload a new screenshot.
                      </p>
                      <button
                        onClick={() => setMyRequest(null)}
                        className="text-xs font-semibold text-red-700 underline"
                      >
                        Upload new screenshot
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Image size={32} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Upload Payment Screenshot
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        After paying via {GATEWAYS[selectedGateway].label}, upload the screenshot here.
                      </p>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/png,image/jpeg,image/gif,image/webp"
                        onChange={handleUpload}
                        className="hidden"
                        id="screenshot-upload"
                      />
                      <label
                        htmlFor="screenshot-upload"
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white cursor-pointer transition-all active:scale-95 ${
                          uploading ? 'opacity-60 cursor-wait' : 'hover:opacity-90'
                        }`}
                        style={{ background: GATEWAYS[selectedGateway].color }}
                      >
                        {uploading ? (
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Upload size={14} />
                        )}
                        {uploading ? 'Uploading…' : 'Choose Screenshot'}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Show existing request status if no panel open ── */}
      {!selectedGateway && myRequest && myRequest.status === 'pending' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-4 flex items-center gap-3">
            <Clock size={18} className="text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Your subscription request is pending
              </p>
              <p className="text-xs text-amber-600">
                {myRequest.gateway && `Paid via ${myRequest.gateway} · `}Waiting for admin approval
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Trust signals ── */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-100 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {trustItems.map(({ icon, label, sub }) => (
              <div key={label}>
                <div className="text-2xl mb-1.5">{icon}</div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}