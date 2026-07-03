import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { mockTestApi } from '../utils/api'
import { LoadingScreen } from '../components/ui'
import {
  Award, Headphones, BookOpen, Edit3, Mic,
  ArrowLeft, BarChart3,
} from 'lucide-react'

const ICONS = { listening: Headphones, reading: BookOpen, writing: Edit3, speaking: Mic }

export default function MockTestHistoryPage() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mockTestApi.my()
      .then(r => setTests(r.data || []))
      .catch(() => {
        const local = JSON.parse(localStorage.getItem('mockTestHistory') || '[]')
        setTests(local)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen message="Loading mock test history…" />

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-md shadow-slate-200">
            <Award size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Mock Test History</h1>
            <p className="text-xs text-gray-500">{tests.length} test{tests.length !== 1 ? 's' : ''} completed</p>
          </div>
        </div>
        <Link to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-20">
          <BarChart3 size={40} className="mx-auto mb-4 text-gray-200" />
          <p className="text-sm text-gray-400 mb-4">No mock tests completed yet.</p>
          <Link to="/mock-test"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg bg-gradient-to-r from-slate-700 to-slate-600">
            Start a Mock Test
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map((mt) => {
            const overall = mt.overall_band ?? mt.overall
            const num = mt.mock_test_number
            return (
              <div key={mt.id ?? mt.testId} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-gray-900">
                      {num ? `Mock Test #${num}` : 'Mock Test'}
                    </p>
                    {mt.test_title && (
                      <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                        {mt.test_title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {overall != null && (
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Overall</p>
                        <p className="text-lg font-extrabold text-gray-900">{overall.toFixed(1)}</p>
                      </div>
                    )}
                    {mt.completed_at && (
                      <span className="text-[11px] text-gray-400 whitespace-nowrap">
                        {new Date(mt.completed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['listening','reading','writing','speaking'].map(mod => {
                    const band = mt[`${mod}_band`] ?? mt.bands?.[mod]
                    const Icon = ICONS[mod]
                    return (
                      <div key={mod} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <Icon size={15} className="text-gray-400" />
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{mod}</span>
                        <span className="text-base font-extrabold text-gray-900">{band != null ? band.toFixed(1) : '—'}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
