import { useLocation, useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { submissionsApi } from '../utils/api'
import { LoadingScreen } from '../components/ui'
import { CheckCircle, AlertCircle, Home, ArrowRight } from 'lucide-react'
import logo from '../assets/hu.png'

const CRITERIA = [
  { key: 'task_achievement',    label: 'Task Achievement'    },
  { key: 'coherence_cohesion',  label: 'Coherence & Cohesion' },
  { key: 'lexical_resource',    label: 'Lexical Resource'     },
  { key: 'grammatical_range',   label: 'Grammatical Range'    },
]

function BandBar({ band }) {
  const pct = ((band || 0) / 9) * 100
  const color = band >= 8 ? 'bg-green-500' : band >= 7 ? 'bg-blue-500' : band >= 6 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2.5 bg-gray-100 overflow-hidden">
        <div className={`h-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-bold text-gray-900 text-sm w-8" >
        {band ? band.toFixed(1) : '—'}
      </span>
    </div>
  )
}

export default function WritingResultPage() {
  const { id } = useParams()
  const { state } = useLocation()
  const [sub, setSub] = useState(state?.submission || null)
  const [loading, setLoading] = useState(!state?.submission)

  useEffect(() => {
    if (!sub) {
      submissionsApi.getWriting(id).then(r => setSub(r.data)).finally(() => setLoading(false))
    }
  }, [])

  if (loading) return <LoadingScreen message="Loading writing feedback…" />
  if (!sub) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-sm text-gray-400">Submission not found</p>
    </div>
  )

  const feedback = sub.ai_feedback || {}
  const criteriaFeedback = feedback.feedback || {}

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col page-fade">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="IELTSPrep" className="h-8 w-auto object-contain" />
        </div>
        <Link to="/tests"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
          Practice Again
        </Link>
      </div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-5">

        {/* ── Overall band card ── */}
        <div className="bg-red-700 p-8 text-center">
          <p className="text-red-200 text-xs font-bold tracking-widest uppercase mb-4">
            Writing Test — AI Scored
          </p>
          <div className="text-7xl font-bold text-white mb-1 leading-none" >
            {sub.overall_band?.toFixed(1) ?? '—'}
          </div>
          <p className="text-red-200 text-sm mb-5">Overall Band Score</p>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-white" >{sub.word_count}</p>
              <p className="text-red-300 text-xs mt-0.5">Words</p>
            </div>
          </div>
        </div>

        {/* ── Criteria & Feedback grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Criteria breakdown */}
          <div className="bg-white border border-gray-100 p-4 sm:p-6">
            <p className="text-sm font-bold text-gray-900 mb-5" >
              Criteria Breakdown
            </p>
            <div className="space-y-5">
              {CRITERIA.map(({ key, label }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                  <BandBar band={sub[key]} />
                  {criteriaFeedback[key] && (
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">{criteriaFeedback[key]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="space-y-4">
            {feedback.strengths?.length > 0 && (
              <div className="bg-white border border-gray-100 p-5">
                <h3 className="font-bold text-green-700 mb-3 text-sm flex items-center gap-2"
                  >
                  <CheckCircle size={15} /> Strengths
                </h3>
                <ul className="space-y-2">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 mt-0.5">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {feedback.improvements?.length > 0 && (
              <div className="bg-white border border-gray-100 p-5">
                <h3 className="font-bold text-amber-700 mb-3 text-sm flex items-center gap-2"
                  >
                  <AlertCircle size={15} /> Areas to Improve
                </h3>
                <ul className="space-y-2">
                  {feedback.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-amber-500 mt-0.5">•</span>{imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {feedback.corrected_sentences?.length > 0 && (
              <div className="bg-white border border-gray-100 p-5">
                <h3 className="font-bold text-gray-700 mb-3 text-sm" >
                  Corrections
                </h3>
                <div className="space-y-3">
                  {feedback.corrected_sentences.slice(0, 3).map((c, i) => (
                    <div key={i} className="text-xs">
                      <p className="text-red-600 line-through">{c.original}</p>
                      <p className="text-green-600 font-medium mt-0.5">{c.corrected}</p>
                      {c.explanation && <p className="text-gray-400 mt-0.5 italic">{c.explanation}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Essay ── */}
        <div className="bg-white border border-gray-100 p-6">
          <p className="text-sm font-bold text-gray-900 mb-4" >
            Your Essay ({sub.word_count} words)
          </p>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4">
            {sub.essay_text}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3">
          <Link to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
            <Home size={15} /> Dashboard
          </Link>
          <Link to="/tests"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-red-700 hover:bg-red-800 transition-colors">
            Practice Again <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </div>
  )
}
