// import { useEffect, useState } from 'react'
// import { sessionsApi, submissionsApi } from '../utils/api'
// import { LoadingScreen, BandBadge, SectionTag, EmptyState } from '../components/ui'
// import { formatDate, sectionColor } from '../utils/helpers'
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
//   ResponsiveContainer, Legend, ReferenceLine
// } from 'recharts'
// import { Link } from 'react-router-dom'
// import useAuthStore from '../store/authStore'

// export default function ProgressPage() {
//   const { user } = useAuthStore()
//   const [sessions, setSessions] = useState([])
//   const [writings, setWritings] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     Promise.all([sessionsApi.my(), submissionsApi.myWriting()])
//       .then(([s, w]) => { setSessions(s.data); setWritings(w.data) })
//       .finally(() => setLoading(false))
//   }, [])

//   if (loading) return <LoadingScreen message="Loading your progress…" />

//   // Build chart data by date
//   const completed = sessions.filter(s => s.status === 'completed' && s.band_score)
//   const chartData = completed.slice().reverse().map((s, i) => ({
//     name: `#${i + 1}`,
//     date: formatDate(s.started_at),
//     [s.section_type]: s.band_score,
//   }))

//   // Merge writing into chart
//   writings.filter(w => w.overall_band).slice().reverse().forEach((w, i) => {
//     const idx = chartData.findIndex(d => !d.writing)
//     if (idx >= 0) chartData[idx].writing = w.overall_band
//     else chartData.push({ name: `W${i+1}`, date: formatDate(w.submitted_at), writing: w.overall_band })
//   })

//   return (
//     <div className="animate-fade-in space-y-8">
//       <div>
//         <h1 className="text-2xl font-bold font-display text-surface-900">My Progress</h1>
//         <p className="text-surface-500 text-sm mt-1">Track your band score improvement over time.</p>
//       </div>

//       {/* Band score trend */}
//       <div className="card p-6">
//         <div className="flex items-center justify-between mb-5">
//           <h2 className="font-bold font-display text-surface-900 text-sm">Band Score Trend</h2>
//           {user?.target_band && (
//             <span className="text-xs text-surface-500">Target: Band {user.target_band}</span>
//           )}
//         </div>
//         {chartData.length > 0 ? (
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//               <XAxis dataKey="name" tick={{ fontSize: 11 }} />
//               <YAxis domain={[0, 9]} ticks={[0,1,2,3,4,5,6,7,8,9]} tick={{ fontSize: 11 }} />
//               <Tooltip
//                 formatter={(v, name) => [`Band ${v}`, name.charAt(0).toUpperCase() + name.slice(1)]}
//               />
//               <Legend />
//               {user?.target_band && (
//                 <ReferenceLine y={user.target_band} stroke="#f97316" strokeDasharray="4 4"
//                   label={{ value: `Target ${user.target_band}`, fontSize: 10, fill: '#f97316' }} />
//               )}
//               <Line type="monotone" dataKey="reading"   stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} connectNulls />
//               <Line type="monotone" dataKey="listening" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} connectNulls />
//               <Line type="monotone" dataKey="writing"   stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} connectNulls />
//               <Line type="monotone" dataKey="speaking"  stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} connectNulls />
//             </LineChart>
//           </ResponsiveContainer>
//         ) : (
//           <div className="h-48 flex items-center justify-center text-surface-400 text-sm text-center">
//             Complete practice tests to see your progress chart.
//           </div>
//         )}
//       </div>

//       {/* All sessions */}
//       <div className="card p-6">
//         <h2 className="font-bold font-display text-surface-900 mb-5 text-sm">All Practice Sessions</h2>
//         {sessions.length > 0 ? (
//           <div className="space-y-2">
//             {sessions.map((s) => (
//               <div key={s.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors">
//                 <div className="flex items-center gap-3">
//                   <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${sectionColor(s.section_type)} flex items-center justify-center text-base`}>
//                     {s.section_type === 'reading' ? '📖' : s.section_type === 'listening' ? '🎧' : s.section_type === 'writing' ? '✍️' : '🎤'}
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-surface-800 capitalize">{s.section_type} Practice</p>
//                     <p className="text-xs text-surface-400">{formatDate(s.started_at)}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   {s.correct_answers != null && s.total_questions != null && (
//                     <span className="text-xs text-surface-400">
//                       {s.correct_answers}/{s.total_questions} correct
//                     </span>
//                   )}
//                   <BandBadge band={s.band_score} size="sm" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <EmptyState icon="📊" title="No sessions yet"
//             description="Start practicing to build your progress history."
//             action={<Link to="/tests" className="btn-primary">Browse Tests</Link>} />
//         )}
//       </div>

//       {/* Writing history */}
//       {writings.length > 0 && (
//         <div className="card p-6">
//           <h2 className="font-bold font-display text-surface-900 mb-5 text-sm">Writing Submissions</h2>
//           <div className="space-y-2">
//             {writings.map((w) => (
//               <Link key={w.id} to={`/writing-result/${w.id}`}
//                 className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors group">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-base">
//                     ✍️
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-surface-800">Writing Task</p>
//                     <p className="text-xs text-surface-400">{w.word_count} words · {formatDate(w.submitted_at)}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="text-xs text-brand-500 group-hover:underline">View feedback →</span>
//                   <BandBadge band={w.overall_band} size="sm" />
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { sessionsApi, submissionsApi } from '../utils/api'
import { LoadingScreen } from '../components/ui'
import { formatDate } from '../utils/helpers'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine} from 'recharts'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { ReadingIcon, ListeningIcon, WritingIcon, SpeakingIcon } from '../components/ExamIcons'

const SECTIONS = {
  reading:   { icon: ReadingIcon,    bg: 'bg-blue-50',   text: 'text-blue-600',   stroke: '#3b82f6' },
  listening: { icon: ListeningIcon,  bg: 'bg-purple-50', text: 'text-purple-600', stroke: '#a855f7' },
  writing:   { icon: WritingIcon,    bg: 'bg-amber-50',  text: 'text-amber-600',  stroke: '#f97316' },
  speaking:  { icon: SpeakingIcon,   bg: 'bg-green-50',  text: 'text-green-600',  stroke: '#10b981' }}

function BandPill({ band }) {
  if (!band) return <span className="text-xs text-gray-300 font-medium">N/A</span>
  return (
    <span className="inline-block text-xs font-bold px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full">
      Band {band.toFixed(1)}
    </span>
  )
}

function StatCard({ label, value, sub, color = 'text-gray-900' }) {
  return (
    <div className="bg-white border border-gray-100 p-5 flex flex-col gap-1">
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className={`text-2xl font-bold ${color}`} >{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

export default function ProgressPage() {
  const { user } = useAuthStore()
  const [sessions, setSessions] = useState([])
  const [writings, setWritings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([sessionsApi.my(), submissionsApi.myWriting()])
      .then(([s, w]) => { setSessions(s.data); setWritings(w.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen message="Loading your progress…" />

  const completed = sessions.filter(s => s.status === 'completed' && s.band_score)
  const chartData = completed.slice().reverse().map((s, i) => ({
    name: `#${i + 1}`,
    date: formatDate(s.started_at),
    [s.section_type]: s.band_score}))
  writings.filter(w => w.overall_band).slice().reverse().forEach((w, i) => {
    const idx = chartData.findIndex(d => !d.writing)
    if (idx >= 0) chartData[idx].writing = w.overall_band
    else chartData.push({ name: `W${i + 1}`, date: formatDate(w.submitted_at), writing: w.overall_band })
  })

  // Summary stats
  const avgBand = completed.length
    ? (completed.reduce((s, x) => s + x.band_score, 0) / completed.length).toFixed(1)
    : '—'
  const bestBand = completed.length
    ? Math.max(...completed.map(x => x.band_score)).toFixed(1)
    : '—'
  const totalTests = sessions.length
  const totalWritings = writings.length

  return (
    <div className="space-y-6 page-fade" >

      {/* ── Page title ── */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-red-700 mb-1">Analytics</p>
        <h1 className="text-2xl font-bold text-gray-900" >
          My Progress
        </h1>
        <p className="text-sm text-gray-400 mt-1">Track your band score improvement over time.</p>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Average Band"   value={avgBand}             sub="across all tests"     color="text-red-700" />
        <StatCard label="Best Band"      value={bestBand}            sub="personal best"        color="text-green-600" />
        <StatCard label="Tests Taken"    value={totalTests}          sub="practice sessions" />
        <StatCard label="Writing Tasks"  value={totalWritings}       sub="submissions" />
      </div>

      {/* ── Band score trend ── */}
      <div className="bg-white border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-icon" />
            <h2 className="text-sm font-bold text-gray-900" >
              Band Score Trend
            </h2>
          </div>
          {user?.target_band && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
              <span className="w-2 h-0.5 bg-red-500 inline-block" />
              Target: Band {user.target_band}
            </div>
          )}
        </div>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#9ca3af', }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 9]}
                ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                tick={{ fontSize: 11, fill: '#9ca3af', }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  border: '1px solid #f0f0f0',
                  borderRadius: 8,
                  fontSize: 12,
                  
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)'}}
                formatter={(v, name) => [`Band ${v}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                labelStyle={{ color: '#6b7280', marginBottom: 4 }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: 12,
                  
                  paddingTop: 16}}
              />
              {user?.target_band && (
                <ReferenceLine
                  y={user.target_band}
                  stroke="#CC0000"
                  strokeDasharray="5 4"
                  strokeWidth={1.5}
                  label={{ value: `Target ${user.target_band}`, fontSize: 10, fill: '#CC0000', dx: 8 }}
                />
              )}
              {Object.entries(SECTIONS).map(([key, { stroke }]) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={stroke}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-52 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">📈</div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">No data yet</p>
              <p className="text-xs text-gray-400 mt-0.5">Complete practice tests to see your chart.</p>
            </div>
            <Link
              to="/tests"
              className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-700 hover:bg-red-800 transition-colors"
            >
              Start Practicing <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* ── All sessions ── */}
      <div className="bg-white border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900" >
            All Practice Sessions
          </h2>
          <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
            {sessions.length} total
          </span>
        </div>

        {sessions.length > 0 ? (
          <div className="flex flex-col">
            {sessions.map((s) => {
              const sec = SECTIONS[s.section_type] || {}
              const Icon = sec.icon
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2"
                >
                  <div className="flex items-center gap-3">
                    {Icon
                      ? <Icon size={16} className={`${sec.text || 'text-gray-500'} shrink-0`} />
                      : <span className="text-sm shrink-0">{sec.emoji || '📝'}</span>
                    }
                    <div>
                      <p className="text-sm font-semibold text-gray-800 capitalize">
                        {s.section_type} Practice
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(s.started_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {s.correct_answers != null && s.total_questions != null && (
                      <span className="text-xs text-gray-400 hidden sm:block">
                        {s.correct_answers}/{s.total_questions} correct
                      </span>
                    )}
                    <BandPill band={s.band_score} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">📊</div>
            <p className="text-sm font-semibold text-gray-700 mb-1">No sessions yet</p>
            <p className="text-xs text-gray-400 mb-4">Start practicing to build your progress history.</p>
            <Link
              to="/tests"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-700 hover:bg-red-800 transition-colors"
            >
              Browse Tests <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* ── Writing history ── */}
      {writings.length > 0 && (
        <div className="bg-white border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900" >
              Writing Submissions
            </h2>
            <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
              {writings.length} total
            </span>
          </div>
          <div className="flex flex-col">
            {writings.map((w) => (
              <Link
                key={w.id}
                to={`/writing-result/${w.id}`}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2 group"
              >
                <div className="flex items-center gap-3">
                  <WritingIcon size={16} className="text-amber-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Writing Task</p>
                    <p className="text-xs text-gray-400">
                      {w.word_count} words · {formatDate(w.submitted_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-red-700 group-hover:underline hidden sm:flex items-center gap-1">
                    View feedback <ArrowRight size={11} />
                  </span>
                  <BandPill band={w.overall_band} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}