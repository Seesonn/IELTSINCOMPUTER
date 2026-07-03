// import { useEffect, useState } from 'react'
// import { vocabApi } from '../utils/api'
// import { LoadingScreen, EmptyState } from '../components/ui'
// import { Star, Trash2, Search } from 'lucide-react'
// import toast from 'react-hot-toast'
// import { formatDate } from '../utils/helpers'

// export default function VocabularyPage() {
//   const [words, setWords] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState('')

//   const load = () => vocabApi.list().then(r => setWords(r.data)).finally(() => setLoading(false))
//   useEffect(() => { load() }, [])

//   const unstar = async (id, word) => {
//     await vocabApi.unstar(id)
//     setWords(prev => prev.filter(w => w.id !== id))
//     toast.success(`"${word}" removed`)
//   }

//   const filtered = words.filter(w =>
//     w.word.toLowerCase().includes(search.toLowerCase()) ||
//     w.definition?.toLowerCase().includes(search.toLowerCase())
//   )

//   if (loading) return <LoadingScreen message="Loading vocabulary…" />

//   return (
//     <div className="animate-fade-in space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold font-display text-surface-900">Vocabulary Builder</h1>
//           <p className="text-surface-500 text-sm mt-1">{words.length} words starred from passages</p>
//         </div>
//       </div>

//       <div className="relative">
//         <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
//         <input value={search} onChange={e => setSearch(e.target.value)}
//           className="input pl-9 max-w-sm" placeholder="Search words…" />
//       </div>

//       {filtered.length === 0 ? (
//         <EmptyState
//           icon="⭐"
//           title="No starred words yet"
//           description="While reading passages, select a word and confirm to add it to your vocabulary list."
//         />
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filtered.map((w) => (
//             <div key={w.id} className="card p-4 hover:shadow-md transition-shadow">
//               <div className="flex items-start justify-between mb-2">
//                 <div className="flex items-center gap-2">
//                   <Star size={14} className="text-amber-400 fill-amber-400 flex-shrink-0" />
//                   <span className="font-bold text-surface-900">{w.word}</span>
//                 </div>
//                 <button onClick={() => unstar(w.id, w.word)}
//                   className="p-1 hover:bg-red-50 rounded-lg text-surface-300 hover:text-red-500 transition-colors">
//                   <Trash2 size={13} />
//                 </button>
//               </div>
//               {w.definition && <p className="text-sm text-surface-600 mb-2">{w.definition}</p>}
//               {w.context_sentence && (
//                 <p className="text-xs text-surface-400 italic border-l-2 border-surface-200 pl-2">
//                   "{w.context_sentence}"
//                 </p>
//               )}
//               <div className="mt-3 pt-3 border-t border-surface-100 flex items-center justify-between">
//                 {w.passage_title && <p className="text-xs text-brand-600 truncate">{w.passage_title}</p>}
//                 <p className="text-xs text-surface-300 ml-auto">{formatDate(w.created_at)}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

import { useEffect, useState } from 'react'
import { vocabApi } from '../utils/api'
import { LoadingScreen } from '../components/ui'
import { Star, Trash2, Search, BookOpen, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDate } from '../utils/helpers'
import BUILTIN_VOCAB from '../data/vocabulary'

export default function VocabularyPage() {
  const [starred, setStarred] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('builtin') // 'builtin' | 'starred'

  useEffect(() => {
    vocabApi.list()
      .then(r => setStarred(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const unstar = async (id, word) => {
    await vocabApi.unstar(id)
    setStarred(prev => prev.filter(w => w.id !== id))
    toast.success(`"${word}" removed`)
  }

  const query = search.toLowerCase()

  const filteredBuiltin = BUILTIN_VOCAB.filter(w =>
    w.word.toLowerCase().startsWith(query)
  )

  const filteredStarred = starred.filter(w =>
    w.word.toLowerCase().startsWith(query)
  )

  if (loading) return <LoadingScreen message="Loading vocabulary…" />

  return (
    <div className="space-y-6 page-fade" >

      {/* ── Page title ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-red-700 mb-1">Study Tools</p>
          <h1
            className="text-2xl font-bold text-gray-900"
            
          >
            Vocabulary Builder
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {BUILTIN_VOCAB.length} IELTS words · {starred.length} starred from passages
          </p>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search words, synonyms, definitions…"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-red-400 transition-colors"
        />
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-0.5 border-b border-gray-100">
        {[
          { key: 'builtin', label: `IELTS Word List`, count: filteredBuiltin.length },
          { key: 'starred', label: `My Starred Words`, count: filteredStarred.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              tab === t.key
                ? 'border-red-700 text-red-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              tab === t.key
                ? 'bg-red-50 text-red-700'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── IELTS word list tab ── */}
      {tab === 'builtin' && (
        <>
          {filteredBuiltin.length === 0 ? (
            <div className="bg-white border border-gray-100 p-12 text-center">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-sm font-semibold text-gray-700">No words match your search</p>
              <p className="text-xs text-gray-400 mt-1">Try a different keyword</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredBuiltin.map((w) => (
                <div
                  key={w.word}
                  className="bg-white border border-gray-100 p-4 hover:border-red-200 hover:shadow-sm transition-all group"
                >
                  {/* Word + synonym */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p
                        className="font-bold text-gray-900 text-sm"
                        
                      >
                        {w.word}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <ArrowRight size={10} className="text-red-400" />
                        <span className="text-xs font-semibold text-red-700">{w.synonym}</span>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={11} className="text-amber-500" />
                    </div>
                  </div>

                  {/* Definition */}
                  <p className="text-xs text-gray-500 leading-relaxed mb-2">{w.definition}</p>

                  {/* Example */}
                  <div className="border-l-2 border-red-100 pl-2">
                    <p className="text-xs text-gray-400 italic leading-relaxed">"{w.example}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Starred words tab ── */}
      {tab === 'starred' && (
        <>
          {filteredStarred.length === 0 ? (
            <div className="bg-white border border-gray-100 p-12 text-center">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Star size={20} className="text-amber-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">No starred words yet</p>
              <p className="text-xs text-gray-400">
                While reading passages, select a word and tap Star to save it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredStarred.map((w) => (
                <div
                  key={w.id}
                  className="bg-white border border-gray-100 p-4 hover:border-amber-200 hover:shadow-sm transition-all"
                >
                  {/* Word */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Star size={13} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                      <p
                        className="font-bold text-gray-900 text-sm"
                        
                      >
                        {w.word}
                      </p>
                    </div>
                    <button
                      onClick={() => unstar(w.id, w.word)}
                      className="p-1 rounded text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Definition */}
                  {w.definition && (
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">{w.definition}</p>
                  )}

                  {/* Context sentence */}
                  {w.context_sentence && (
                    <div className="border-l-2 border-amber-100 pl-2 mb-2">
                      <p className="text-xs text-gray-400 italic leading-relaxed">
                        "{w.context_sentence}"
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="pt-2.5 mt-2 border-t border-gray-50 flex items-center justify-between">
                    {w.passage_title && (
                      <p className="text-xs text-red-700 truncate font-medium">{w.passage_title}</p>
                    )}
                    <p className="text-xs text-gray-300 ml-auto">{formatDate(w.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  )
}