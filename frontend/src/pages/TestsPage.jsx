// // import { useEffect, useState } from 'react'
// // import { Link, useNavigate } from 'react-router-dom'
// // import { Lock, PlayCircle } from 'lucide-react'
// // import { testsApi, sessionsApi } from '../utils/api'
// // import useAuthStore from '../store/authStore'
// // import { LoadingScreen } from '../components/ui'
// // import toast from 'react-hot-toast'
// // import { cn } from '../utils/helpers'

// // const SECTIONS = [
// //   { type: 'reading',   emoji: '📖', label: 'Reading',   time: '60 min' },
// //   { type: 'listening', emoji: '🎧', label: 'Listening', time: '30 min' },
// //   { type: 'writing',   emoji: '✍️', label: 'Writing',   time: '60 min' },
// //   { type: 'speaking',  emoji: '🎤', label: 'Speaking',  time: '15 min' },
// // ]

// // export default function TestsPage() {
// //   const { user } = useAuthStore()
// //   const [tests, setTests] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [starting, setStarting] = useState(null)
// //   const navigate = useNavigate()

// //   useEffect(() => {
// //     testsApi.listAll().then(r => setTests(r.data)).finally(() => setLoading(false))
// //   }, [])

// //   const startTest = async (testId, sectionType) => {
// //     if (starting) return
// //     setStarting(`${testId}-${sectionType}`)
// //     try {
// //       await sessionsApi.start({ test_id: testId, section_type: sectionType })
// //       navigate(`/test/${testId}/${sectionType}`)
// //     } catch (err) {
// //       const msg = err.response?.data?.detail || 'Failed to start'
// //       if (msg.toLowerCase().includes('premium')) {
// //         toast.error('This test requires a Premium subscription')
// //         navigate('/pricing')
// //       } else {
// //         toast.error(msg)
// //       }
// //     } finally {
// //       setStarting(null)
// //     }
// //   }

// //   if (loading) return <LoadingScreen message="Loading practice tests…" />

// //   return (
// //     <div className="animate-fade-in space-y-8">
// //       <div>
// //         <h1 className="text-2xl font-bold font-display text-surface-900">Practice Tests</h1>
// //         <p className="text-surface-500 text-sm mt-1">Computer-based IELTS Academic practice. Select any section to begin.</p>
// //       </div>

// //       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
// //         {SECTIONS.map(({ type, emoji, label, time }) => (
// //           <div key={type} className="card p-4 text-center">
// //             <div className="text-3xl mb-2">{emoji}</div>
// //             <p className="font-semibold text-surface-900 text-sm">{label}</p>
// //             <p className="text-xs text-surface-400 mt-0.5">{time}</p>
// //           </div>
// //         ))}
// //       </div>

// //       <div className="space-y-4">
// //         {tests.map((test) => {
// //           const locked = !test.is_free && user?.plan === 'free'
// //           return (
// //             <div key={test.id} className="card p-6">
// //               <div className="flex items-center justify-between mb-5">
// //                 <div className="flex items-center gap-2">
// //                   <h3 className="font-bold text-surface-900 font-display">{test.title}</h3>
// //                   {test.is_free
// //                     ? <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">Free</span>
// //                     : <span className="badge bg-amber-50 text-amber-700 border border-amber-200"><Lock size={9} className="mr-0.5" />Premium</span>
// //                   }
// //                 </div>
// //                 {locked && <Link to="/pricing" className="btn-primary text-xs px-3 py-1.5">Upgrade Plan</Link>}
// //               </div>
// //               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
// //                 {SECTIONS.map(({ type, emoji, label, time }) => {
// //                   const key = `${test.id}-${type}`
// //                   const busy = starting === key
// //                   return (
// //                     <button key={type} onClick={() => !locked && startTest(test.id, type)}
// //                       disabled={locked || busy}
// //                       className={cn(
// //                         'relative flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all',
// //                         locked
// //                           ? 'border-surface-100 bg-surface-50 cursor-not-allowed opacity-50'
// //                           : 'border-surface-200 hover:border-brand-400 hover:bg-brand-50 active:scale-95 cursor-pointer'
// //                       )}>
// //                       <span className="text-2xl">{emoji}</span>
// //                       <div>
// //                         <p className="text-sm font-semibold text-surface-800">{label}</p>
// //                         <p className="text-[10px] text-surface-400">{time}</p>
// //                       </div>
// //                       <div className="ml-auto">
// //                         {locked
// //                           ? <Lock size={13} className="text-surface-300" />
// //                           : busy
// //                             ? <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
// //                             : <PlayCircle size={15} className="text-brand-400" />
// //                         }
// //                       </div>
// //                     </button>
// //                   )
// //                 })}
// //               </div>
// //             </div>
// //           )
// //         })}
// //         {tests.length === 0 && (
// //           <div className="card p-16 text-center text-surface-400">
// //             <p className="text-4xl mb-3">📭</p>
// //             <p className="font-medium">No tests found</p>
// //             <p className="text-sm mt-1">Run the backend seed script to populate tests.</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// import { useEffect, useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { Lock, PlayCircle } from 'lucide-react'
// import { testsApi, sessionsApi } from '../utils/api'
// import useAuthStore from '../store/authStore'
// import { LoadingScreen } from '../components/ui'
// import toast from 'react-hot-toast'
// import { cn } from '../utils/helpers'

// const SECTIONS = [
//   { type: 'reading',   emoji: '📖', label: 'Reading',   time: '60 min' },
//   { type: 'listening', emoji: '🎧', label: 'Listening', time: '30 min' },
//   { type: 'writing',   emoji: '✍️', label: 'Writing',   time: '60 min' },
//   { type: 'speaking',  emoji: '🎤', label: 'Speaking',  time: '15 min' },
// ]

// export default function TestsPage() {
//   const { user } = useAuthStore()
//   const [tests, setTests] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [starting, setStarting] = useState(null)
//   const navigate = useNavigate()

//   useEffect(() => {
//     testsApi.listAll().then(r => setTests(r.data)).finally(() => setLoading(false))
//   }, [])

//   const startTest = async (testId, sectionType) => {
//     if (starting) return
//     setStarting(`${testId}-${sectionType}`)
//     try {
//       await sessionsApi.start({ test_id: testId, section_type: sectionType })
//       navigate(`/test/${testId}/${sectionType}`)
//     } catch (err) {
//       const msg = err.response?.data?.detail || 'Failed to start'
//       if (msg.toLowerCase().includes('premium')) {
//         toast.error('This test requires a Premium subscription')
//         navigate('/pricing')
//       } else {
//         toast.error(msg)
//       }
//     } finally {
//       setStarting(null)
//     }
//   }

//   if (loading) return <LoadingScreen message="Loading practice tests…" />

//   return (
//     <div className="animate-fade-in space-y-8">
//       <div>
//         <h1 className="text-2xl font-bold font-display text-surface-900">Practice Tests</h1>
//         <p className="text-surface-500 text-sm mt-1">Computer-based IELTS Academic practice. Select any section to begin.</p>
//       </div>

//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//         {SECTIONS.map(({ type, emoji, label, time }) => (
//           <div key={type} className="card p-4 text-center">
//             <div className="text-3xl mb-2">{emoji}</div>
//             <p className="font-semibold text-surface-900 text-sm">{label}</p>
//             <p className="text-xs text-surface-400 mt-0.5">{time}</p>
//           </div>
//         ))}
//       </div>

//       <div className="space-y-4">
//         {tests.map((test) => {
//           const locked = !test.is_free && user?.plan === 'free'
//           return (
//             <div key={test.id} className="card p-6">
//               <div className="flex items-center justify-between mb-5">
//                 <div className="flex items-center gap-2">
//                   <h3 className="font-bold text-surface-900 font-display">{test.title}</h3>
//                   {test.is_free
//                     ? <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">Free</span>
//                     : <span className="badge bg-amber-50 text-amber-700 border border-amber-200"><Lock size={9} className="mr-0.5" />Premium</span>
//                   }
//                 </div>
//                 {locked && <Link to="/pricing" className="btn-primary text-xs px-3 py-1.5">Upgrade Plan</Link>}
//               </div>
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//                 {SECTIONS.map(({ type, emoji, label, time }) => {
//                   const key = `${test.id}-${type}`
//                   const busy = starting === key
//                   return (
//                     <button key={type} onClick={() => !locked && startTest(test.id, type)}
//                       disabled={locked || busy}
//                       className={cn(
//                         'relative flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all',
//                         locked
//                           ? 'border-surface-100 bg-surface-50 cursor-not-allowed opacity-50'
//                           : 'border-surface-200 hover:border-brand-400 hover:bg-brand-50 active:scale-95 cursor-pointer'
//                       )}>
//                       <span className="text-2xl">{emoji}</span>
//                       <div>
//                         <p className="text-sm font-semibold text-surface-800">{label}</p>
//                         <p className="text-[10px] text-surface-400">{time}</p>
//                       </div>
//                       <div className="ml-auto">
//                         {locked
//                           ? <Lock size={13} className="text-surface-300" />
//                           : busy
//                             ? <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
//                             : <PlayCircle size={15} className="text-brand-400" />
//                         }
//                       </div>
//                     </button>
//                   )
//                 })}
//               </div>
//             </div>
//           )
//         })}
//         {tests.length === 0 && (
//           <div className="card p-16 text-center text-surface-400">
//             <p className="text-4xl mb-3">📭</p>
//             <p className="font-medium">No tests found</p>
//             <p className="text-sm mt-1">Run the backend seed script to populate tests.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, PlayCircle } from 'lucide-react'
import { testsApi, sessionsApi } from '../utils/api'
import useAuthStore from '../store/authStore'
import { LoadingScreen } from '../components/ui'
import toast from 'react-hot-toast'
import { ReadingIcon, ListeningIcon, WritingIcon, SpeakingIcon } from '../components/ExamIcons'

const SECTIONS = [
  { type: 'reading',   icon: ReadingIcon,   label: 'Reading',   time: '60 min', bg: 'bg-icon-light', text: 'text-icon' },
  { type: 'listening', icon: ListeningIcon, label: 'Listening', time: '30 min', bg: 'bg-icon-light', text: 'text-icon' },
  { type: 'writing',   icon: WritingIcon,   label: 'Writing',   time: '60 min', bg: 'bg-icon-light', text: 'text-icon' },
  { type: 'speaking',  icon: SpeakingIcon,  label: 'Speaking',  time: '15 min', bg: 'bg-icon-light', text: 'text-icon' },
]

export default function TestsPage() {
  const { user } = useAuthStore()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    testsApi.listAll().then(r => setTests(r.data)).finally(() => setLoading(false))
  }, [])

  const startTest = async (testId, sectionType) => {
    if (starting) return
    setStarting(`${testId}-${sectionType}`)
    try {
      await sessionsApi.start({ test_id: testId, section_type: sectionType })
      navigate(`/test/${testId}/${sectionType}`)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to start'
      if (msg.toLowerCase().includes('premium')) {
        toast.error('This test requires a Premium subscription')
        navigate('/pricing')
      } else {
        toast.error(msg)
      }
    } finally {
      setStarting(null)
    }
  }

  if (loading) return <LoadingScreen message="Loading practice tests…" />

  return (
    <div
      className="space-y-6 page-fade"
      
    >

      {/* ── Page title ── */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-icon mb-1">
          CBT Practice
        </p>
        <h1
          className="text-2xl font-bold text-gray-900"
          
        >
          Practice Tests
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Computer-based IELTS Academic practice. Select any section to begin.
        </p>
      </div>

      {/* ── Section overview ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SECTIONS.map(({ type, icon: Icon, label, time, bg, text }) => (
          <div
            key={type}
            className="bg-white border border-gray-100 p-4 flex items-center gap-3"
          >
            <Icon size={16} className={text} />
            <div>
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              <p className="text-xs text-gray-400">{time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tests list ── */}
      <div className="space-y-4">

        {tests.length === 0 && (
          <div className="bg-white border border-gray-100 p-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm font-semibold text-gray-700">No tests found</p>
            <p className="text-xs text-gray-400 mt-1">
              Run the backend seed script to populate tests.
            </p>
          </div>
        )}

        {tests.map((test) => {
          const locked = !test.is_free && user?.plan === 'free'
          return (
            <div key={test.id} className="bg-white border border-gray-100">

              {/* ── Test header ── */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <h3
                    className="font-bold text-gray-900 text-sm"
                    
                  >
                    {test.title}
                  </h3>
                  {test.is_free ? (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                      Free
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      <Lock size={9} /> Premium
                    </span>
                  )}
                </div>
                {locked && (
                  <Link
                    to="/pricing"
                    className="text-xs font-bold text-white bg-red-700 hover:bg-red-800 transition-colors px-3 py-1.5 rounded-lg"
                  >
                    Upgrade Plan
                  </Link>
                )}
              </div>

              {/* ── Section buttons ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
                {SECTIONS.map(({ type, icon: Icon, label, time, bg, text }) => {
                  const key  = `${test.id}-${type}`
                  const busy = starting === key

                  return (
                    <button
                      key={type}
                      onClick={() => !locked && startTest(test.id, type)}
                      disabled={locked || busy}
                      className={`group flex items-center gap-3 p-4 text-left transition-all duration-150 ${
                        locked
                          ? 'cursor-not-allowed opacity-40 bg-white'
                          : 'cursor-pointer hover:bg-gray-50 active:scale-[0.98]'
                      }`}
                    >
                      {/* Icon */}
                      {busy ? (
                        <div className="w-4 h-4 border-2 border-icon/30 border-t-icon rounded-full animate-spin shrink-0" />
                      ) : locked ? (
                        <Lock size={14} className="text-icon/40 shrink-0" />
                      ) : (
                        <Icon size={16} className={text} />
                      )}

                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold text-gray-900"
                          
                        >
                          {label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
                      </div>

                      {/* Arrow */}
                      {!locked && !busy && (
                        <PlayCircle
                          size={15}
                          className="text-icon/40 group-hover:text-icon transition-colors flex-shrink-0"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  )
}