import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { testsApi, sessionsApi } from '../utils/api'
import useAuthStore from '../store/authStore'
import { mockTestProgress } from '../utils/mockTestProgress'
import toast from 'react-hot-toast'
import { Shuffle, ArrowRight, RefreshCw, Clock, AlertCircle, Loader, Play } from 'lucide-react'

const MODULES = [
  { label: 'Listening', time: '30 min', bg: '#f8fafc' },
  { label: 'Reading',   time: '60 min', bg: '#f8fafc' },
  { label: 'Writing',   time: '60 min', bg: '#f8fafc' },
  { label: 'Speaking',  time: '15 min', bg: '#f8fafc' },
]

export default function MockTestPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)

  useEffect(() => {
    testsApi.listAll()
      .then(r => setTests(r.data))
      .catch(() => toast.error('Failed to load tests'))
      .finally(() => setLoading(false))
  }, [])

  const pickTest = () => {
    if (tests.length === 0) return
    const available = tests.filter(t => t.is_free || user?.plan !== 'free')
    if (available.length === 0) {
      toast.error('Mock tests require a Premium subscription')
      navigate('/pricing')
      return
    }
    setSelectedTest(available[Math.floor(Math.random() * available.length)])
  }

  const startTest = async () => {
    if (starting || !selectedTest) return
    setStarting(true)

    mockTestProgress.init(selectedTest.id)

    try {
      const startRes = await sessionsApi.start({ test_id: selectedTest.id, section_type: 'listening' })
      mockTestProgress.setSessionId(startRes.data.id ?? startRes.data.session_id)
      navigate(`/test/${selectedTest.id}/listening?mockTest=1`)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to start'
      if (msg.toLowerCase().includes('premium')) {
        toast.error('Mock tests require a Premium subscription')
        navigate('/pricing')
      } else {
        toast.error(msg)
      }
      mockTestProgress.clear()
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader size={24} className="animate-spin text-slate-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">

      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        .anim-fade-up   { animation: fadeUp 0.6s ease both; }
        .anim-scale-in  { animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
      `}</style>

      {!selectedTest ? (
        <div className="relative max-w-md mx-auto px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 anim-fade-up">
            Full Mock Test
          </h1>
          <p className="text-sm text-gray-500 mb-6 anim-fade-up delay-1">
            All 4 modules — Listening, Reading, Writing, Speaking — back to back.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8 anim-fade-up delay-2">
            {MODULES.map(({ label, time, bg }) => (
              <div key={label} className="rounded-xl p-4 border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                style={{ background: bg }}>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">{label}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock size={10} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400">{time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={pickTest}
            disabled={tests.length === 0}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-white text-sm font-bold transition-all active:scale-95 shadow-lg hover:shadow-xl hover:-translate-y-0.5 mx-auto disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-red-600 to-red-500"
          >
            {tests.length === 0 ? (
              <><AlertCircle size={18} /> No tests available</>
            ) : (
              <><Shuffle size={18} /> Pick a Test &amp; Start <ArrowRight size={16} /></>
            )}
          </button>

          <p className="text-xs text-gray-400 mt-5 anim-fade-up delay-3">
            ~2h 45min total · <span className="font-semibold text-gray-500">{tests.length}</span> tests available
            {user?.plan === 'free' && (
              <span> · <span className="font-semibold text-slate-600">{tests.filter(t => t.is_free).length} free</span></span>
            )}
          </p>
        </div>
      ) : (
        <div className="relative max-w-md mx-auto px-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 anim-fade-up">
            {selectedTest.title}
          </h1>
          <p className="text-xs text-gray-400 mb-6 anim-fade-up delay-1">
            {selectedTest.test_type?.toUpperCase()} · {tests.length} tests available
          </p>

          {/* Module order */}
          <div className="space-y-2 mb-8 anim-fade-up delay-2">
            {MODULES.map(({ label, time, bg }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-white shadow-sm"
                style={{ background: bg }}>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <span className="text-[10px] text-gray-400 font-medium">{time}</span>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="text-left bg-white border border-gray-100 rounded-xl px-5 py-4 mb-8 anim-fade-up delay-2 shadow-sm">
            <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Instructions</p>
            <ul className="space-y-2">
              {[
                'Answer all questions within the time limit.',
                'You cannot pause or go back once a module ends.',
                'Complete all 4 modules in one session.',
                'Your overall band is calculated from all modules.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={startTest}
            disabled={starting}
            className="inline-flex items-center justify-center gap-2.5 px-10 py-3.5 rounded-xl text-white text-sm font-bold transition-all active:scale-95 shadow-lg hover:shadow-xl hover:-translate-y-0.5 mx-auto disabled:opacity-50 disabled:cursor-not-allowed w-full bg-gradient-to-r from-red-600 to-red-500"
          >
            {starting ? (
              <><RefreshCw size={18} className="animate-spin" /> Starting…</>
            ) : (
              <><Play size={18} /> Begin Mock Test</>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
