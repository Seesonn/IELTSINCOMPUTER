// import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { ArrowRight } from 'lucide-react'
// import { dashboardApi } from '../utils/api'
// import useAuthStore from '../store/authStore'
// import { LoadingScreen, StatCard, BandBadge, EmptyState } from '../components/ui'
// import { formatDate, sectionColor } from '../utils/helpers'
// import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'

// export default function DashboardPage() {
//   const { user } = useAuthStore()
//   const [stats, setStats] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     dashboardApi.stats().then(r => setStats(r.data)).finally(() => setLoading(false))
//   }, [])

//   if (loading) return <LoadingScreen message="Loading your dashboard…" />

//   const radarData = [
//     { section: 'Reading',   band: stats?.reading_avg   || 0 },
//     { section: 'Listening', band: stats?.listening_avg || 0 },
//     { section: 'Writing',   band: stats?.writing_avg   || 0 },
//     { section: 'Speaking',  band: stats?.speaking_avg  || 0 },
//   ]

//   const hour = new Date().getHours()
//   const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

//   return (
//     <div className="animate-fade-in space-y-8">
//       <div>
//         <h1 className="text-2xl font-bold font-display text-surface-900">
//           Good {greeting}, {user?.full_name?.split(' ')[0]} 👋
//         </h1>
//         <p className="text-surface-500 text-sm mt-1">
//           {user?.target_band ? `Targeting Band ${user.target_band}. Keep it up!` : 'Set a target band score in your profile.'}
//         </p>
//       </div>

//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard label="Overall Band" value={stats?.average_band?.toFixed(1) ?? '—'} icon="🎯"
//           color={stats?.average_band >= 7 ? 'text-emerald-600' : 'text-brand-600'} sub="All sections avg" />
//         <StatCard label="Tests Completed" value={stats?.completed_sessions ?? 0} icon="📝" sub="Practice sessions" />
//         <StatCard label="AI Writing" value={stats?.writing_submissions_count ?? 0} icon="✍️" sub="Submissions scored" />
//         <StatCard label="Vocabulary" value={stats?.starred_words_count ?? 0} icon="⭐" sub="Words starred" />
//       </div>

//       <div className="grid lg:grid-cols-3 gap-6">
//         <div className="card p-6">
//           <h2 className="font-bold text-surface-900 mb-4 font-display text-sm">Performance Radar</h2>
//           {stats?.average_band ? (
//             <ResponsiveContainer width="100%" height={200}>
//               <RadarChart data={radarData}>
//                 <PolarGrid stroke="#e2e8f0" />
//                 <PolarAngleAxis dataKey="section" tick={{ fontSize: 11, fill: '#64748b' }} />
//                 <Radar dataKey="band" stroke="#3578f5" fill="#3578f5" fillOpacity={0.2} strokeWidth={2} />
//                 <Tooltip formatter={(v) => [`Band ${v}`, '']} />
//               </RadarChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-48 flex items-center justify-center text-surface-400 text-sm text-center px-4">
//               Complete at least one test to see your radar chart
//             </div>
//           )}
//         </div>

//         <div className="card p-6 lg:col-span-2">
//           <h2 className="font-bold text-surface-900 mb-5 font-display text-sm">Section Averages</h2>
//           <div className="space-y-5">
//             {[
//               { label: 'Reading',   band: stats?.reading_avg,   color: 'bg-blue-500',    emoji: '📖' },
//               { label: 'Listening', band: stats?.listening_avg, color: 'bg-purple-500',  emoji: '🎧' },
//               { label: 'Writing',   band: stats?.writing_avg,   color: 'bg-orange-500',  emoji: '✍️' },
//               { label: 'Speaking',  band: stats?.speaking_avg,  color: 'bg-emerald-500', emoji: '🎤' },
//             ].map(({ label, band, color, emoji }) => (
//               <div key={label} className="flex items-center gap-4">
//                 <span className="text-xl w-8">{emoji}</span>
//                 <div className="flex-1">
//                   <div className="flex justify-between text-sm mb-1.5">
//                     <span className="text-surface-600 font-medium">{label}</span>
//                     <span className="font-bold text-surface-900">{band ? band.toFixed(1) : '—'}</span>
//                   </div>
//                   <div className="h-1.5 bg-surface-100  overflow-hidden">
//                     <div className={`h-full  transition-all duration-700 ${color}`}
//                       style={{ width: band ? `${(band / 9) * 100}%` : '0%' }} />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="mt-6 pt-5 border-t border-surface-100">
//             <Link to="/tests" className="btn-primary w-full justify-center">
//               Start a Practice Test <ArrowRight size={16} />
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="card p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="font-bold text-surface-900 font-display text-sm">Recent Practice</h2>
//           <Link to="/progress" className="text-sm text-brand-600 hover:underline font-medium">View all →</Link>
//         </div>
//         {stats?.recent_sessions?.length > 0 ? (
//           <div className="space-y-2">
//             {stats.recent_sessions.map((s) => (
//               <div key={s.id} className="flex items-center justify-between p-3  hover:bg-surface-50 transition-colors">
//                 <div className="flex items-center gap-3">
//                   <div className={`w-9 h-9  bg-gradient-to-br ${sectionColor(s.section_type)} flex items-center justify-center text-lg`}>
//                     {s.section_type === 'reading' ? '📖' : s.section_type === 'listening' ? '🎧' : s.section_type === 'writing' ? '✍️' : '🎤'}
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-surface-900 capitalize">{s.section_type} Test</p>
//                     <p className="text-xs text-surface-400">{formatDate(s.started_at)}</p>
//                   </div>
//                 </div>
//                 <BandBadge band={s.band_score} size="sm" />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <EmptyState icon="📝" title="No sessions yet"
//             description="Complete your first test to see your history here."
//             action={<Link to="/tests" className="btn-primary">Browse Tests</Link>} />
//         )}
//       </div>
//     </div>
//   )
// }


import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, TrendingUp, Star, Award, Target, ChevronRight,
  Clock, BarChart3, Flame, Zap, RefreshCw,
  Headphones, BookOpen, Edit3, Mic} from 'lucide-react'
import { dashboardApi, sessionsApi, mockTestApi } from '../utils/api'
import useAuthStore from '../store/authStore'
import { LoadingScreen, BandBadge } from '../components/ui'
import { ReadingIcon, ListeningIcon, WritingIcon, SpeakingIcon } from '../components/ExamIcons'
import { formatDate, sectionColor, calculateListeningBand, calculateReadingBand } from '../utils/helpers'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip} from 'recharts'

/* ─── helpers ─────────────────────────────────────────────── */
const SECTION_META = {
  reading:   { icon: ReadingIcon,   color: '#002147', bg: '#eef2f7', label: 'Reading',   emoji: '📖' },
  listening: { icon: ListeningIcon, color: '#002147', bg: '#eef2f7', label: 'Listening', emoji: '🎧' },
  writing:   { icon: WritingIcon,   color: '#002147', bg: '#eef2f7', label: 'Writing',   emoji: '✍️' },
  speaking:  { icon: SpeakingIcon,  color: '#002147', bg: '#eef2f7', label: 'Speaking',  emoji: '🎤' }}

const bandColor = (b) => {
  if (!b) return '#6b7280'
  if (b >= 7.5) return '#16a34a'
  if (b >= 6.5) return '#d97706'
  return '#002147'
}

/* ─── small reusables ─────────────────────────────────────── */
function SectionIcon({ type, size = 40 }) {
  const meta = SECTION_META[type] || SECTION_META.reading
  const Icon = meta.icon
  return (
    <div
      className=" flex items-center justify-center shrink-0"
      style={{ width: size, height: size, background: meta.bg }}
    >
      <Icon size={size * 0.45} color={meta.color} />
    </div>
  )
}

function BandRing({ band }) {
  const pct = band ? (band / 9) * 100 : 0
  const r = 30, circ = 2 * Math.PI * r
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#f1f5f9" strokeWidth="6" />
      <circle
        cx="40" cy="40" r={r} fill="none"
        stroke={band ? bandColor(band) : '#e5e5e5'}
        strokeWidth="6"
        strokeDasharray={circ}
        strokeDashoffset={circ - (circ * pct) / 100}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="40" y="44" textAnchor="middle" fontSize="15" fontWeight="700"
        fill={band ? bandColor(band) : '#cbd5e1'}>
        {band ? band.toFixed(1) : '—'}
      </text>
    </svg>
  )
}

/* ─── main component ──────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      dashboardApi.stats(),
      sessionsApi.my(),
      mockTestApi.my().catch(() => ({ data: [] })),
    ]).then(([s, sess, mockRes]) => {
      const data = s.data
      const sessions = sess.data || []
      const mockTestsFromApi = mockRes?.data || []

      // Recalculate listening/reading averages using frontend band conversion
      const modules = { listening: [], reading: [], writing: [], speaking: [] }
      for (const session of sessions) {
        if (session.status !== 'completed') continue
        const m = session.section_type
        if (!modules[m]) continue
        if (m === 'listening' && session.correct_answers != null && session.total_questions > 0) {
          modules.listening.push(calculateListeningBand(session.correct_answers, session.total_questions))
        } else if (m === 'reading' && session.correct_answers != null && session.total_questions > 0) {
          modules.reading.push(calculateReadingBand(session.correct_answers, session.total_questions))
        } else if (session.band_score != null) {
          modules[m].push(session.band_score)
        }
      }

      const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null
      data.listening_avg = avg(modules.listening)
      data.reading_avg = avg(modules.reading)
      data.writing_avg = avg(modules.writing)
      data.speaking_avg = avg(modules.speaking)

      // Recalculate overall average from recalculated section averages
      const allAvgs = [data.listening_avg, data.reading_avg, data.writing_avg, data.speaking_avg].filter(v => v != null)
      data.average_band = allAvgs.length ? allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length : null

      setStats(data)
      setMockTestsFromApi(mockTestsFromApi)
    }).finally(() => setLoading(false))
  }, [])

  const [mockTestsFromApi, setMockTestsFromApi] = useState([])
  const localMockTests = JSON.parse(localStorage.getItem('mockTestHistory') || '[]')
  const mockTests = mockTestsFromApi.length > 0 ? mockTestsFromApi : localMockTests

  if (loading) return <LoadingScreen message="Loading your dashboard…" />

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.full_name?.split(' ')[0] || 'there'

  const radarData = [
    { section: 'Reading',   band: stats?.reading_avg   || 0 },
    { section: 'Listening', band: stats?.listening_avg || 0 },
    { section: 'Writing',   band: stats?.writing_avg   || 0 },
    { section: 'Speaking',  band: stats?.speaking_avg  || 0 },
  ]

  const sectionBands = [
    { key: 'reading',   band: stats?.reading_avg },
    { key: 'listening', band: stats?.listening_avg },
    { key: 'writing',   band: stats?.writing_avg },
    { key: 'speaking',  band: stats?.speaking_avg },
  ]

  const overallBand = stats?.average_band

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col page-fade"
    >
      {/* ── font import ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        .band-bar-fill { transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 page-fade">

        {/* ════════════════════ HERO GREETING ════════════════════ */}
        <div className="relative  overflow-hidden" style={{ background: '#ffffff' }}>
          {/* subtle red accent bar */}
          


          <div className="relative px-5 sm:px-7 py-5 sm:py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-1">{greeting}</p>
              <h1
                className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight"
                
              >
                {firstName}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 ${
                  user?.plan === 'premium' ? 'bg-red-50 text-red-700 border border-red-200' :
                  user?.plan === 'enterprise' ? 'bg-green-50 text-green-700 border border-green-200' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {user?.plan === 'premium' ? '⭐ ' : ''}
                  {user?.plan?.toUpperCase() || 'FREE'} PLAN
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                {user?.target_band
                  ? <>Targeting <span className="text-white font-semibold">Band {user.target_band}</span>. Keep pushing — you're making progress.</>
                  : 'Set a target band score in your profile to get personalised insights.'}
              </p>
            </div>

            {/* overall band ring */}
            <div className="flex items-center gap-5 shrink-0">
              <div className="text-center">
                <BandRing band={overallBand} />
                <p className="text-xs text-slate-400 mt-1">Overall Band</p>
              </div>
              {user?.target_band && overallBand && (
                <div className="hidden xs:block">
                  <div className="text-xs text-slate-400 mb-1">Progress to target</div>
                  <div className="w-24 sm:w-32 h-1.5 bg-slate-700  overflow-hidden">
                    <div
                      className="h-full  band-bar-fill"
                      style={{
                        width: `${Math.min((overallBand / user.target_band) * 100, 100)}%`,
                        background: '#002147'}}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {overallBand?.toFixed(1)} / {user.target_band}
                  </p>
                </div>
              )}
              <Link
                to="/tests"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5  text-sm font-bold transition-all hover:-translate-y-0.5"
                style={{ background: '#CC0000', color: '#fff' }}
              >
                Practice Now <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* ════════════════════ STAT CARDS ════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              icon: Target, label: 'Overall Band',
              value: overallBand ? overallBand.toFixed(1) : '—',
              sub: 'All sections avg',
              accent: '#002147', bg: '#eef2f7'},
            {
              icon: Flame, label: 'Tests Completed',
              value: stats?.completed_sessions ?? 0,
              sub: 'Practice sessions',
              accent: '#002147', bg: '#eef2f7'},
            {
              icon: Zap, label: 'AI Writing',
              value: stats?.writing_submissions_count ?? 0,
              sub: 'Submissions scored',
              accent: '#002147', bg: '#eef2f7'},
            {
              icon: Star, label: 'Vocabulary',
              value: stats?.starred_words_count ?? 0,
              sub: 'Words starred',
              accent: '#002147', bg: '#eef2f7'},
          ].map(({ icon: Icon, label, value, sub, accent, bg }) => (
            <div key={label} className="bg-white  border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                <Icon size={16} color={accent} />
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 text-right leading-tight max-w-[60px] sm:max-w-[70px]">{label}</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-red-700 leading-none">
                {value}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-1 sm:mt-1.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* ════════════════════ MOCK TESTS ════════════════════ */}
        {mockTests.length > 0 && (
          <div className="bg-white border border-gray-100 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
                  <Award size={16} color="#002147" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Mock Tests Completed: <span className="text-red-700">{mockTests.length}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/mock-test-history"
                  className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
                >
                  View All
                </Link>
                <Link
                  to="/mock-test"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: '#CC0000' }}
                >
                  <RefreshCw size={13} /> New Mock Test
                </Link>
              </div>
            </div>
            {/* Latest mock test individual scores */}
            {(() => {
              const mt = mockTests[0]
              const overall = mt.overall_band ?? mt.overall
              return (
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-gray-900">Latest Mock Test</p>
                    <div className="flex items-center gap-3">
                      {overall != null && (
                        <span className="text-sm font-extrabold text-gray-900">
                          Overall: {overall.toFixed(1)}
                        </span>
                      )}
                      {mt.completed_at && (
                        <span className="text-[11px] text-gray-400">
                          {new Date(mt.completed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['listening','reading','writing','speaking'].map(mod => {
                      const band = mt[`${mod}_band`] ?? mt.bands?.[mod]
                      const icons = { listening: Headphones, reading: BookOpen, writing: Edit3, speaking: Mic }
                      const Icon = icons[mod]
                      return (
                        <div key={mod} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white border border-gray-100">
                          <Icon size={14} className="text-gray-400" />
                          <span className="text-[11px] font-semibold text-gray-500 capitalize">{mod}</span>
                          <span className="text-sm font-extrabold text-gray-900">{band != null ? band.toFixed(1) : '—'}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ════════════════════ MIDDLE ROW ════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* ── Radar chart ── */}
        <div className="bg-white  border border-gray-100 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-gray-900" >
                Performance Radar
              </h2>
              <BarChart3 size={15} color="#002147" />
            </div>
            <p className="text-xs text-gray-400 mb-4">All 4 IELTS sections</p>

            {stats?.average_band ? (
              <ResponsiveContainer width="100%" height={210}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis
                    dataKey="section"
                    tick={{ fontSize: 11, fill: '#94a3b8'}}
                  />
                  <Radar
                    dataKey="band" stroke="#002147" fill="#002147" fillOpacity={0.12} strokeWidth={2}
                  />
                  <Tooltip
                    formatter={v => [`Band ${v}`, '']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #f0f0f0' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex flex-col items-center justify-center text-gray-300 gap-3">
                <BarChart3 size={36} />
                <p className="text-xs text-gray-400 text-center px-4">
                  Complete at least one test to see your radar chart
                </p>
              </div>
            )}
          </div>

          {/* ── Section bands ── */}
          <div className="md:col-span-2 bg-white  border border-gray-100 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-gray-900" >
                Section Averages
              </h2>
              <TrendingUp size={15} color="#002147" />
            </div>
            <p className="text-xs text-gray-400 mb-6">Your average band score per module</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {sectionBands.map(({ key, band }) => {
                const meta = SECTION_META[key]
                const Icon = meta.icon
                const pct = band ? (band / 9) * 100 : 0
                return (
                  <div key={key} className="flex items-center gap-4">
                    <Icon size={17} color={meta.color} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-semibold text-gray-700">{meta.label}</span>
                        <span
                          className="text-sm font-bold"
                          style={{  color: band ? bandColor(band) : '#cbd5e1' }}
                        >
                          {band ? band.toFixed(1) : '—'}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100  overflow-hidden">
                        <div
                          className="h-full  band-bar-fill"
                          style={{ width: `${pct}%`, background: meta.color }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {band ? `${pct.toFixed(0)}% of Band 9` : 'No data yet'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <Link
                to="/tests"
                className="w-full flex items-center justify-center gap-2 py-3  text-sm font-bold transition-all hover:-translate-y-0.5"
                style={{ background: '#CC0000', color: '#fff' }}
              >
                Start a Practice Test <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* ════════════════════ QUICK START ════════════════════ */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900" >
              Practice by Module
            </h2>
            <Link to="/tests" className="text-xs text-icon font-semibold hover:underline flex items-center gap-1">
              All tests <ChevronRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {Object.entries(SECTION_META).map(([key, meta]) => {
              const Icon = meta.icon
              const band = stats?.[`${key}_avg`]
              return (
                <Link
                  key={key}
                  to="/tests"
                  className="bg-white border border-gray-100  p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <Icon size={17} color={meta.color} className="mb-3" />
                  <p className="text-sm font-bold text-gray-900 mb-0.5" >
                    {meta.label}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    {band ? `Avg. Band ${band.toFixed(1)}` : 'Not attempted'}
                  </p>
                  <div
                    className="inline-flex items-center gap-1 text-xs font-semibold"
                    style={{ color: meta.color }}
                  >
                    Practice <ArrowRight size={11} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* ════════════════════ RECENT SESSIONS ════════════════════ */}
        <div className="bg-white  border border-gray-100 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-gray-900" >
                Recent Practice
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Your last test sessions</p>
            </div>
            <Link to="/progress" className="text-xs text-icon font-semibold hover:underline flex items-center gap-1">
              View all <ChevronRight size={13} />
            </Link>
          </div>

          {stats?.recent_sessions?.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {stats.recent_sessions.map((s) => {
                const meta = SECTION_META[s.section_type] || SECTION_META.reading
                const Icon = meta.icon
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between py-3.5 hover:bg-gray-50 -mx-2 px-2  transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon size={16} color={meta.color} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{s.section_type} Test</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock size={11} color="#94a3b8" />
                          <span className="text-xs text-gray-400">{formatDate(s.started_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {s.band_score && (
                        <div className="text-right">
                          <p
                            className="text-lg font-bold leading-none"
                            style={{  color: bandColor(s.band_score) }}
                          >
                            {s.band_score?.toFixed(1)}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">Band Score</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* ── empty state ── */
            <div className="py-12 flex flex-col items-center text-center gap-4">
              <ReadingIcon size={24} color="#002147" />
              <div>
                <p className="text-sm font-bold text-gray-900" >
                  No sessions yet
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Complete your first practice test to track your progress and band scores here.
                </p>
              </div>
              <Link
                to="/tests"
                className="inline-flex items-center gap-2 px-5 py-2.5  text-sm font-bold transition-all hover:-translate-y-0.5"
                style={{ background: '#CC0000', color: '#fff' }}
              >
                Browse Tests <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>

        {/* ════════════════════ MOTIVATIONAL BANNER ════════════════════ */}
        {user?.target_band && (
          <div
            className="relative  overflow-hidden px-5 sm:px-7 py-5 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: '#fff1f1', border: '1px solid #ffd9d9' }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-700" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Award size={16} color="#002147" />
                <span className="text-xs font-bold text-red-700 uppercase tracking-widest">Your Goal</span>
              </div>
              <h3 className="text-base font-bold text-gray-900" >
                Target Band {user.target_band}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Students who practice daily improve by <strong className="text-gray-700">0.5–1.5 bands</strong> within 4 weeks.
              </p>
            </div>
            <Link
              to="/tests"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5  text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ background: '#CC0000', color: '#fff' }}
            >
              Practice Now <ArrowRight size={15} />
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}