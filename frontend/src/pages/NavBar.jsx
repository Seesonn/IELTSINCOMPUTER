import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Info, MessageSquare, Home, ChevronRight, X, Menu } from 'lucide-react'
import hu from '../assets/hu.png'

const navLinks = [
  { label: 'Home',       to: '/',          icon: Home,          desc: 'Back to homepage'             },
  { label: 'Band Score', to: '/bandscore', icon: BookOpen,      desc: 'Score breakdowns & benchmarks' },
  { label: 'About',      to: '/about',     icon: Info,          desc: 'Our story from Itahari'        },
  { label: 'Contact',    to: '/contact',   icon: MessageSquare, desc: 'Report a problem or query'     },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let last = 0
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      setVisible(y < 80 || y < last)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const active = (to) => location.pathname === to

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
        .nb-font  { font-family: 'Quicksand', sans-serif !important; }
        .nb-serif { font-family: 'Quicksand', serif !important; }

        .nb-navlink {
          position: relative;
          padding-bottom: 2px;
        }
        .nb-navlink::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          background: #CC0000;
          border-radius: 2px;
          transition: width 0.22s ease;
        }
        .nb-navlink:hover::after,
        .nb-navlink.active::after { width: 100%; }

        /* hamburger morph */
        .hb span {
          display: block; width: 22px; height: 2px;
          background: #1a1a1a; border-radius: 2px;
          transition: transform 0.28s ease, opacity 0.2s, width 0.2s;
          transform-origin: center;
        }
        .hb.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hb.open span:nth-child(2) { opacity: 0; width: 0; }
        .hb.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* drawer slide */
        .nb-drawer {
          transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] border-b border-gray-200 backdrop-blur-md nb-font
        transition-all duration-500 ease-in-out
        ${visible ? 'translate-y-0' : '-translate-y-full'}
        ${scrolled ? 'shadow-[0_2px_24px_rgba(0,0,0,0.07)] bg-white/97' : 'shadow-none bg-white/95'}`}>

        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center no-underline">
            <img src={hu} alt="IELTSPrep" className="w-28 h-28 object-contain rounded-md" />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            {navLinks.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className={`nb-navlink no-underline text-sm font-medium transition-colors duration-150
                    ${active(to) ? 'text-red-600 font-bold active' : 'text-gray-500 hover:text-red-600'}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Sign In — desktop only */}
            <Link
              to="/login"
              className="hidden md:inline-block no-underline text-sm font-medium text-gray-500 px-4 py-2 rounded-lg
                hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              Sign In
            </Link>

            {/* Watch Tutorial — desktop only */}
            <button
              onClick={() => setShowVideo(true)}
              className="hidden md:inline-flex items-center gap-1.5 no-underline text-sm font-medium text-gray-500
                px-3 py-2 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors duration-150 border-none cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Watch
            </button>

            {/* CTA — desktop only */}
            <Link
              to="/register"
              className="hidden md:inline-block no-underline text-sm font-semibold text-white bg-[#CC0000]
                px-5 py-2.5 rounded-lg hover:bg-[#a80000] hover:-translate-y-px transition-all duration-150"
            >
              Get Started Free
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className={`hb md:hidden flex flex-col gap-[5px] items-center justify-center
                p-2 rounded-lg bg-transparent hover:bg-gray-100 transition-colors border-none cursor-pointer
                ${menuOpen ? 'open' : ''}`}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* ── OVERLAY ── */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[90] bg-black/35 backdrop-blur-sm transition-opacity duration-300
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* ── DRAWER ── */}
      <div className={`nb-drawer fixed top-0 right-0 bottom-0 z-[95]
        w-[min(340px,88vw)] bg-white shadow-2xl flex flex-col overflow-y-auto
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center no-underline">
            <img src={hu} alt="IELTSPrep" className="w-24 h-24 object-contain rounded-md" />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-50 flex items-center justify-center
              border-none cursor-pointer transition-colors duration-150"
          >
            <X size={17} className="text-red-600" />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 px-4 pt-5">
          <p className="text-[10px] font-bold tracking-[1.8px] uppercase text-gray-300 mb-3 pl-1">
            Navigate
          </p>

          {navLinks.map(({ label, to, icon: Icon, desc }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3.5 p-3.5 rounded-xl no-underline mb-1.5 transition-colors duration-150
                ${active(to) ? 'bg-red-50' : 'hover:bg-gray-50'}`}
            >
              {/* Icon */}
                  <Icon size={16} color={active(to) ? '#CC0000' : '#888'} />

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm m-0 leading-tight nb-font
                  ${active(to) ? 'font-bold text-red-600' : 'font-semibold text-gray-900'}`}>
                  {label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 m-0 nb-font">{desc}</p>
              </div>

              <ChevronRight size={15} color={active(to) ? '#CC0000' : '#d1d5db'} />
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mx-5 mt-5" />

        {/* CTA buttons */}
        <div className="px-5 py-5 flex flex-col gap-3">
          <button
            onClick={() => { setMenuOpen(false); setShowVideo(true) }}
            className="flex items-center justify-center gap-2 text-sm font-semibold text-red-700 bg-red-50 no-underline
              py-3.5 rounded-xl border border-red-200 hover:bg-red-100 transition-colors duration-150 nb-font w-full cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Watch Tutorial
          </button>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="block text-center text-sm font-bold text-white bg-[#CC0000] no-underline
              py-3.5 rounded-xl hover:bg-[#a80000] transition-colors duration-150 nb-font"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block text-center text-sm font-medium text-gray-700 bg-white no-underline
              py-3.5 rounded-xl border border-gray-200 hover:border-red-600 hover:text-red-600
              transition-colors duration-150 nb-font"
          >
            Sign In
          </Link>
        </div>

        {/* Drawer footer */}
        
      </div>

      {/* ── Video Modal ── */}
      {showVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4" onClick={() => setShowVideo(false)}>
          <div className="relative w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowVideo(false)} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors border-none cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <p className="text-sm font-medium">Video placeholder</p>
                <p className="text-xs mt-1">Replace with your YouTube embed URL</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}