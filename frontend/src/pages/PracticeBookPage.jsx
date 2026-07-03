import { Link } from 'react-router-dom'
import { Book, ChevronRight, Award, BookOpen, TrendingUp, Lock } from 'lucide-react'
import useAuthStore from '../store/authStore'
import logo from '../assets/ielts.png'

const BOOKS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Practice Book ${i + 1}`,
  subtitle: `IELTS Academic ${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 1) % 26))}`,
  tests: 4}))

const STATS = [
  { icon: Book, label: 'Total Books', value: '20', accent: '#CC0000', bg: '#fff1f1' },
  { icon: BookOpen, label: 'Tests per Book', value: '4', accent: '#1d4ed8', bg: '#eff6ff' },
  { icon: TrendingUp, label: 'Full Tests', value: '80', accent: '#7c3aed', bg: '#f5f3ff' },
  { icon: Award, label: 'Modules per Test', value: '4', accent: '#d97706', bg: '#fffbeb' },
]

export default function PracticeBookPage() {
  const { user } = useAuthStore()

  if (user?.plan === 'free') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <Lock size={28} className="text-red-700" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Premium Access Required</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Practice books are available exclusively for Premium users. Upgrade your plan to unlock all 20 books with 80 full IELTS tests.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: '#CC0000' }}
          >
            Upgrade to Premium <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');

      `}</style>

      <div className="space-y-6 sm:space-y-8 book-fade">

        {/* ── Hero ── */}
        <div className="relative  overflow-hidden" style={{ background: '#ffffff' }}>
          
          <div className="relative px-5 sm:px-7 py-5 sm:py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5">
            <div>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-1">
                CBT Practice
              </p>
              <h1
                className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight"
                
              >
                Practice Books
              </h1>
              <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
                20 comprehensive books with <span className="font-semibold text-gray-700">80 full IELTS tests</span> to master every module.
              </p>
            </div>
            <Link
              to="/book/1"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5  text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ background: '#CC0000', color: '#fff' }}
            >
              Start with Book 1 <ChevronRight size={15} />
            </Link>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map(({ icon: Icon, label, value, accent, bg }) => (
            <div key={label} className="bg-white  border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                <Icon size={16} color="#002147" />
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 text-right leading-tight max-w-[60px] sm:max-w-[70px]">
                  {label}
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none" style={{  color: accent }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Books grid ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900" >
              All Practice Books
            </h2>
            <span className="text-xs text-gray-400 font-medium">{BOOKS.length} books</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {BOOKS.map((book, idx) => {
            const covers = ['#002147', '#1a3a6b', '#2a5298', '#CC0000', '#8B0000']
            const coverColor = covers[idx % covers.length]

            return (
              <Link
                key={book.id}
                to={`/book/${book.id}`}
                className="group block"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div className="relative transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.03]" style={{ perspective: '800px' }}>
                  {/* 3D Shadow */}
                  <div className="absolute -bottom-3 left-2 right-4 h-5 bg-black/25 blur-md" style={{ transform: 'rotateX(4deg)' }} />
                  <div className="absolute -bottom-2 left-4 right-6 h-3 bg-black/10 blur-sm" />

                  {/* Page block (visible as white edges on right & bottom) */}
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-50" style={{ minHeight: 200 }}>
                    {/* Page texture lines on the edge */}
                    <div className="absolute right-0 top-3 bottom-3 w-[9px] overflow-hidden opacity-30">
                      {[0,1,2,3,4,5,6,7].map(i => (
                        <div key={i} className="w-full h-[1px] bg-gray-400" style={{ marginTop: `${12 + i * 20}px` }} />
                      ))}
                    </div>
                    <div className="absolute bottom-3 left-[7px] right-[9px] h-[9px] overflow-hidden opacity-30">
                      {[0,1,2,3,4,5].map(i => (
                        <div key={i} className="w-full h-[1px] bg-gray-400" style={{ marginTop: `${4 + i * 3}px` }} />
                      ))}
                    </div>

                    {/* Cover (overhangs top/left, pages show on right/bottom) */}
                    <div className="absolute" style={{
                      top: -6, left: -7,
                      right: 9, bottom: 9,
                      background: `linear-gradient(180deg, ${coverColor} 0%, ${coverColor}dd 100%)`,
                      zIndex: 1}}>
                      {/* Spine */}
                      <div className="absolute left-0 top-0 bottom-0 w-[10px] z-10"
                        style={{
                          background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.08) 60%, transparent 100%)'}}
                      />
                      <div className="absolute left-[10px] top-2 bottom-2 w-[1px] bg-black/10" />

                      {/* Top edge highlight */}
                      <div className="absolute left-[10px] right-0 top-0 h-[1px] bg-white/15" />
                      <div className="absolute left-[10px] right-0 bottom-0 h-[1px] bg-black/10" />

                      {/* Cover content */}
                      <div className="flex flex-col h-full" style={{ marginLeft: 3 }}>
                        {/* Top white brand band */}
                        <div className="bg-white/95 px-4 py-2.5 flex flex-col items-center justify-center" style={{ minHeight: '28%' }}>
                          <img src={logo} alt="IELTS" className="h-5 sm:h-6 w-auto object-contain" />
                          <p className="text-[7px] font-bold tracking-wider text-gray-400 mt-1">
                            PRACTICE BOOKS
                          </p>
                        </div>

                        {/* Colored accent band */}
                        <div className="h-[5px] bg-white/30" />

                        {/* Main content area */}
                        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center" style={{ minHeight: '55%' }}>
                          <span
                            className="text-4xl sm:text-5xl font-extrabold leading-none text-white drop-shadow-sm"
                            
                          >
                            {String(book.id).padStart(2, '0')}
                          </span>

                          <div className="w-8 h-[1px] my-2 bg-white/30" />

                          <p className="text-[9px] font-bold uppercase tracking-wider text-white/90">
                            IELTS Academic
                          </p>

                          <p className="text-[8px] text-white/60 mt-1 leading-relaxed max-w-[90px]">
                            {book.tests} Practice Tests with Answers
                          </p>
                        </div>

                        {/* Bottom strip */}
                        <div className="border-t border-white/20 px-4 py-1.5">
                          <p className="text-[6px] text-white/40 tracking-wider text-center">
                            ieltsprep.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
          </div>
        </div>
      </div>
    </div>
  )
}
