// import { useLocation, useNavigate, useParams } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import { sessionsApi } from '../utils/api'
// import { BandBadge, LoadingScreen } from '../components/ui'
// import { CheckCircle, XCircle, MinusCircle, ArrowRight, Home } from 'lucide-react'
// import { cn } from '../utils/helpers'
// import { Link } from 'react-router-dom'

// export default function ResultPage() {
//   const { sessionId } = useParams()
//   const { state } = useLocation()
//   const [result, setResult] = useState(state?.result || null)
//   const [loading, setLoading] = useState(!state?.result)

//   useEffect(() => {
//     if (!result) {
//       sessionsApi.get(sessionId).then(r => setResult(r.data)).finally(() => setLoading(false))
//     }
//   }, [])

//   if (loading) return <LoadingScreen message="Loading results…" />
//   if (!result) return <div className="p-8 text-center text-surface-500">Result not found</div>

//   const correct = result.correct_answers ?? 0
//   const total = result.total_questions ?? 0
//   const pct = result.percentage ?? 0

//   return (
//     <div className="min-h-screen bg-surface-50 flex flex-col">
//       {/* Header */}
//       <div className="bg-white border-b border-surface-200 px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
//             <span className="text-white font-bold text-sm">I</span>
//           </div>
//           <span className="font-bold font-display text-surface-900">IELTSPrep</span>
//         </div>
//         <Link to="/tests" className="btn-secondary text-sm">Practice Again</Link>
//       </div>

//       <div className="max-w-4xl mx-auto w-full p-8 space-y-6 animate-fade-in">
//         {/* Score card */}
//         <div className="card p-8 text-center bg-gradient-to-br from-brand-600 to-brand-800 text-white border-0">
//           <p className="text-brand-200 text-sm mb-2 capitalize">{result.section_type} Test Complete</p>
//           <div className="text-7xl font-bold font-display mb-2">
//             {result.band_score?.toFixed(1) ?? '—'}
//           </div>
//           <p className="text-brand-200">IELTS Band Score</p>
//           <div className="flex items-center justify-center gap-6 mt-6">
//             <div className="text-center">
//               <p className="text-2xl font-bold">{correct}</p>
//               <p className="text-brand-300 text-xs">Correct</p>
//             </div>
//             <div className="w-px h-8 bg-white/20" />
//             <div className="text-center">
//               <p className="text-2xl font-bold">{total - correct}</p>
//               <p className="text-brand-300 text-xs">Incorrect</p>
//             </div>
//             <div className="w-px h-8 bg-white/20" />
//             <div className="text-center">
//               <p className="text-2xl font-bold">{pct}%</p>
//               <p className="text-brand-300 text-xs">Score</p>
//             </div>
//           </div>
//         </div>

//         {/* Performance bar */}
//         <div className="card p-6">
//           <p className="font-semibold text-surface-900 mb-4 font-display text-sm">Performance</p>
//           <div className="h-4 bg-surface-100 rounded-full overflow-hidden">
//             <div className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-1000"
//               style={{ width: `${pct}%` }} />
//           </div>
//           <div className="flex justify-between text-xs text-surface-400 mt-2">
//             <span>0%</span><span>50%</span><span>100%</span>
//           </div>
//         </div>

//         {/* Answer review */}
//         {result.answer_results?.length > 0 && (
//           <div className="card p-6">
//             <p className="font-semibold text-surface-900 mb-4 font-display text-sm">Answer Review</p>
//             <div className="space-y-3">
//               {result.answer_results.map((a) => (
//                 <div key={a.question_id}
//                   className={cn('flex items-start gap-3 p-3 rounded-xl',
//                     a.is_correct ? 'bg-emerald-50' : 'bg-red-50'
//                   )}>
//                   <div className="flex-shrink-0 mt-0.5">
//                     {a.is_correct
//                       ? <CheckCircle size={16} className="text-emerald-600" />
//                       : <XCircle size={16} className="text-red-500" />
//                     }
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <span className="text-xs font-bold text-surface-500">Q{a.question_number}</span>
//                       {a.given_answer && (
//                         <span className={cn('text-xs px-2 py-0.5 rounded font-medium',
//                           a.is_correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>
//                           Your: {a.given_answer}
//                         </span>
//                       )}
//                       {!a.is_correct && (
//                         <span className="text-xs px-2 py-0.5 rounded bg-surface-100 text-surface-600 font-medium">
//                           Correct: {a.correct_answer}
//                         </span>
//                       )}
//                     </div>
//                     {a.explanation && (
//                       <p className="text-xs text-surface-500 mt-1">{a.explanation}</p>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex gap-3">
//           <Link to="/dashboard" className="btn-secondary flex-1 justify-center">
//             <Home size={16} /> Dashboard
//           </Link>
//           <Link to="/tests" className="btn-primary flex-1 justify-center">
//             Practice Again <ArrowRight size={16} />
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { sessionsApi } from '../utils/api'
import { LoadingScreen } from '../components/ui'
import { calculateListeningBand, calculateReadingBand } from '../utils/helpers'
import { CheckCircle, XCircle, ArrowRight, Home } from 'lucide-react'
import logo from '../assets/hu.png'

export default function ResultPage() {
  const { sessionId } = useParams()
  const { state } = useLocation()
  const [result, setResult] = useState(state?.result || null)
  const [loading, setLoading] = useState(!state?.result)

  useEffect(() => {
    if (!result) {
      sessionsApi.get(sessionId).then(r => setResult(r.data)).finally(() => setLoading(false))
    }
  }, [])

  if (loading) return <LoadingScreen message="Loading results…" />
  if (!result) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-sm text-gray-400">Result not found</p>
    </div>
  )

  const correct = result.correct_answers ?? 0
  const total   = result.total_questions ?? 0
  const pct     = result.percentage ?? 0

  const displayBand = useMemo(() => {
    if (result.band_score != null) return result.band_score
    if (result.section_type === 'listening') return calculateListeningBand(correct, total)
    if (result.section_type === 'reading') return calculateReadingBand(correct, total)
    return null
  }, [result])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col page-fade">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="IELTSPrep" className="h-8 w-auto object-contain" />
        </div>
        <Link
          to="/tests"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Practice Again
        </Link>
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 space-y-5">

        {/* ── Score card ── */}
        <div className="bg-red-700 p-8 text-center">
          <p className="text-red-200 text-xs font-bold tracking-widest uppercase mb-4 capitalize">
            {result.section_type} Test Complete
          </p>
          <div
            className="text-7xl font-bold text-white mb-1 leading-none"
            
          >
            {displayBand?.toFixed(1) ?? '—'}
          </div>
          <p className="text-red-200 text-sm mb-7">IELTS Band Score</p>

          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{correct}</p>
              <p className="text-red-200 text-xs mt-1">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{total}</p>
              <p className="text-red-200 text-xs mt-1">Total Questions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{pct}%</p>
              <p className="text-red-200 text-xs mt-1">Accuracy</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{total - correct}</p>
              <p className="text-red-300 text-xs mt-0.5">Incorrect</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{pct}%</p>
              <p className="text-red-300 text-xs mt-0.5">Score</p>
            </div>
          </div>
        </div>

        {/* ── Performance bar ── */}
        <div className="bg-white border border-gray-100 p-6">
          <p
            className="text-sm font-bold text-gray-900 mb-4"
            
          >
            Performance
          </p>
          <div className="h-2 bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-red-700 transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* ── Answer review ── */}
        {result.answer_results?.length > 0 && (
          <div className="bg-white border border-gray-100 p-6">
            <p
              className="text-sm font-bold text-gray-900 mb-4"
              
            >
              Answer Review
            </p>
            <div className="flex flex-col gap-2">
              {result.answer_results.map((a) => (
                <div
                  key={a.question_id}
                  className={`flex items-start gap-3 p-3 ${
                    a.is_correct ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {a.is_correct
                      ? <CheckCircle size={15} className="text-green-600" />
                      : <XCircle size={15} className="text-red-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-gray-400">
                        Q{a.question_number}
                      </span>
                      {a.given_answer && (
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          a.is_correct
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          Your: {a.given_answer}
                        </span>
                      )}
                      {!a.is_correct && (
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold">
                          Correct: {a.correct_answer}
                        </span>
                      )}
                    </div>
                    {a.explanation && (
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {a.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex gap-3">
          <Link
            to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Home size={15} /> Dashboard
          </Link>
          <Link
            to="/tests"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-red-700 hover:bg-red-800 transition-colors"
          >
            Practice Again <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </div>
  )
}