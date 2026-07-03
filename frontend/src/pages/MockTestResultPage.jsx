import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { mockTestProgress } from '../utils/mockTestProgress'
import { sessionsApi, submissionsApi, mockTestApi } from '../utils/api'
import { calculateListeningBand, calculateReadingBand } from '../utils/helpers'
import { LoadingScreen } from '../components/ui'
import {
  Award, Headphones, BookOpen, Edit3, Mic,
  CheckCircle, Home, RefreshCw, TrendingUp,
} from 'lucide-react'

const MODULE_META = {
  listening: { icon: Headphones, label: 'Listening', color: '#475569', bg: '#f8fafc' },
  reading:   { icon: BookOpen,   label: 'Reading',   color: '#475569', bg: '#f8fafc' },
  writing:   { icon: Edit3,      label: 'Writing',   color: '#475569', bg: '#f8fafc' },
  speaking:  { icon: Mic,        label: 'Speaking',  color: '#475569', bg: '#f8fafc' },
}

const ORDER = ['listening', 'reading', 'writing', 'speaking']

export default function MockTestResultPage() {
  const [searchParams] = useSearchParams()
  const testId = searchParams.get('testId')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!testId) { setLoading(false); return }
    loadResults()
  }, [testId])

  const loadResults = async () => {
    const saved = mockTestProgress.get()
    const r = saved.results || {}

    // Try to fetch listening/reading session results if we only have partial data
    try {
      const sessionsRes = await sessionsApi.my()
      const sessions = sessionsRes.data || []

      for (const mod of ['listening', 'reading']) {
        if (!r[mod]?.band_score) {
          const s = sessions.find(
            sess => sess.test_id === +testId && sess.section_type === mod && sess.status === 'completed'
          )
          if (s) r[mod] = s
        }
      }
    } catch {}

    // Try to fetch writing result if missing
    if (!r.writing?.overall_band) {
      try {
        const wRes = await submissionsApi.myWriting()
        const subs = wRes.data || []
        const found = subs.find(s => s.test_id === +testId || s.test_id === testId)
        if (found) r.writing = found
      } catch {}
    }

    // Calculate band scores
    const bands = {}
    let total = 0
    let count = 0

    for (const mod of ORDER) {
      const d = r[mod]
      if (!d) continue
      let band = null
      if (mod === 'listening') {
        band = d.band_score ?? calculateListeningBand(d.correct_answers, d.total_questions)
      } else if (mod === 'reading') {
        band = d.band_score ?? calculateReadingBand(d.correct_answers, d.total_questions)
      } else if (mod === 'writing') {
        band = d.overall_band
      } else if (mod === 'speaking') {
        band = d.part_band || d.overall_band
      }
      if (band != null) {
        bands[mod] = +band
        total += +band
        count++
      }
    }

    const overall = count > 0 ? (total / count) : null

    setResults({ ...r, bands, overall, count })
    setLoading(false)

    // Submit to backend
    try {
      await mockTestApi.submit({
        test_id: +testId,
        listening_band: bands.listening,
        reading_band: bands.reading,
        writing_band: bands.writing,
        speaking_band: bands.speaking,
        listening_session_id: r.listening?.session_id,
        reading_session_id: r.reading?.session_id,
        writing_submission_id: r.writing?.id,
        speaking_submission_id: r.speaking?.band_result?.id,
      })
    } catch {}

    // Persist mock test completion for dashboard progress tracking
    const history = JSON.parse(localStorage.getItem('mockTestHistory') || '[]')
    history.unshift({ testId, overall, bands, count, completedAt: new Date().toISOString() })
    localStorage.setItem('mockTestHistory', JSON.stringify(history.slice(0, 10)))
    mockTestProgress.clear()
  }

  if (!testId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center max-w-md px-6">
          <Award size={48} className="mx-auto mb-4 text-gray-300" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">No Test Result Found</h1>
          <p className="text-sm text-gray-500 mb-6">Start a mock test from the practice books page.</p>
          <Link to="/book" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-slate-700 to-slate-600 shadow-lg">
            <Home size={16} /> Go to Practice Books
          </Link>
        </div>
      </div>
    )
  }

  if (loading) return <LoadingScreen message="Loading your mock test results…" />

  const { bands = {}, overall, count } = results || {}

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">

      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up { animation: fadeUp 0.6s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
      `}</style>

      <div className="relative max-w-lg mx-auto px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10 anim-fade-up">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-200">
            <Award size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Mock Test Complete
          </h1>
          <p className="text-sm text-gray-500">
            All 4 modules finished — here's your performance.
          </p>
        </div>

        {/* Overall band */}
        {overall != null && (
          <div className="text-center mb-10 anim-fade-up delay-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Overall Band Score</p>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-[3px] border-slate-300 bg-white shadow-md">
              <span className="text-3xl font-extrabold text-gray-900">{overall.toFixed(1)}</span>
            </div>
            {count < 4 && (
              <p className="text-xs text-amber-500 mt-2">{count} of 4 modules completed</p>
            )}
          </div>
        )}

        {/* Module breakdown */}
        <div className="space-y-3 mb-10 anim-fade-up delay-2">
          {ORDER.map(mod => {
            const meta = MODULE_META[mod]
            const Icon = meta.icon
            const band = bands[mod]
            const data = results?.[mod]

            if (!data) {
              return (
                <div key={mod} className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">
                    <Icon size={18} className="text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-400">{meta.label}</p>
                    <p className="text-xs text-gray-300">Not completed</p>
                  </div>
                </div>
              )
            }

            return (
              <div key={mod} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: meta.bg }}>
                  <Icon size={18} color={meta.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{meta.label}</p>
                  {mod === 'listening' || mod === 'reading' ? (
                    <p className="text-xs text-gray-500">
                      {data.correct_answers ?? '?'} / {data.total_questions ?? '?'} correct
                      {data.percentage != null ? ` (${Math.round(data.percentage)}%)` : ''}
                    </p>
                  ) : mod === 'writing' ? (
                    <p className="text-xs text-gray-500">
                      {data.word_count ? `${data.word_count} words` : 'Scored'}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">Speaking complete</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {band != null ? (
                    <span className="text-lg font-extrabold text-gray-900">{band.toFixed(1)}</span>
                  ) : (
                    <span className="text-sm text-gray-300">—</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 anim-fade-up delay-3">
          <Link
            to="/mock-test"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold transition-all hover:-translate-y-0.5 shadow-lg bg-gradient-to-r from-slate-700 to-slate-600"
          >
            <RefreshCw size={16} />
            Take Another Mock Test
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            <TrendingUp size={16} />
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
