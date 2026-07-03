import { useState } from 'react'
import { BookOpen, Headphones, Edit3, Mic } from 'lucide-react'
import BookletView from '../components/BookletView'
import ReadingBooklet from '../components/ReadingBooklet'
import ListeningBooklet from '../components/ListeningBooklet'
import WritingBooklet from '../components/WritingBooklet'
import SpeakingBooklet from '../components/SpeakingBooklet'

const TABS = [
  { key: 'reading',   icon: BookOpen,   label: 'Reading' },
  { key: 'listening', icon: Headphones, label: 'Listening' },
  { key: 'writing',   icon: Edit3,      label: 'Writing' },
  { key: 'speaking',  icon: Mic,        label: 'Speaking' },
]

const BOOKLETS = {
  reading:   { component: ReadingBooklet,   filename: 'ielts-reading-guide.pdf',   title: 'IELTS Reading Guide' },
  listening: { component: ListeningBooklet,  filename: 'ielts-listening-guide.pdf', title: 'IELTS Listening Guide' },
  writing:   { component: WritingBooklet,    filename: 'ielts-writing-guide.pdf',   title: 'IELTS Writing Guide' },
  speaking:  { component: SpeakingBooklet,   filename: 'ielts-speaking-guide.pdf',  title: 'IELTS Speaking Guide' },
}

export default function ResourcePage() {
  const [tab, setTab] = useState('reading')
  const [pageN, setPageN] = useState({ reading: 1, listening: 1, writing: 1, speaking: 1 })

  const handleTabChange = (key) => {
    setTab(key)
    setPageN(prev => ({ ...prev, [key]: prev[key] || 1 }))
  }

  const BookletComp = BOOKLETS[tab]?.component
  const filename = BOOKLETS[tab]?.filename
  const bookletTitle = BOOKLETS[tab]?.title

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center gap-3 mb-6">
        
        <div>
          <h1 className="text-lg font-bold text-gray-900">IELTS Tips & Resources</h1>
          <p className="text-xs text-gray-500">Expert strategies for every module</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 border-b border-gray-300">
        {TABS.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all whitespace-nowrap border border-b-0 border-gray-300 ${
              tab === key
                ? 'bg-white text-gray-900 border-t-2 border-t-gray-900 -mb-px'
                : 'bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-white'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <BookletView
        page={pageN[tab]}
        setPage={(p) => setPageN(prev => ({ ...prev, [tab]: p }))}
        downloadFilename={filename}
        title={bookletTitle}
      >
        <BookletComp page={pageN[tab]} />
      </BookletView>
    </div>
  )
}
