import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, BarChart2,
  CreditCard, User, LogOut, Menu, X,
  Book, Shield, History, Shuffle, Lightbulb, Star} from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import logo from '../../assets/hu.png'

const navItems = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tests',      icon: BookOpen,        label: 'Practice Tests' },
  { to: '/book',       icon: Book,            label: 'Practice Book' },
  { to: '/mock-test',  icon: Shuffle,         label: 'Mock Test' },
  { to: '/progress',   icon: BarChart2,       label: 'My Progress' },
  { to: '/vocabulary', icon: Star,            label: 'Vocabulary' },
  { to: '/pricing',    icon: CreditCard,      label: 'Pricing' },
  { to: '/profile',    icon: User,            label: 'Profile' },
  { to: '/login-history', icon: History,      label: 'Login History' },
  { to: '/resources',     icon: Lightbulb,     label: 'Resources' },
]

const adminNavItem = { to: '/admin', icon: Shield, label: 'Admin' }

const planBadge = {
  free:       'bg-gray-100 text-gray-500',
  premium:    'bg-amber-50 text-amber-600 border border-amber-200',
  enterprise: 'bg-green-50 text-green-600 border border-green-200'}

export default function MainLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* ── Logo ── */}
      <div className="px-5 py-4 border-b border-gray-100">
        <img
          src={logo}
          alt="IELTSPrep"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {[...navItems, ...(user?.role === 'admin' ? [adminNavItem] : [])].map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-red-50 text-red-700 font-semibold'
                  : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-red-600' : 'text-icon/50'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User ── */}
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.full_name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
              {user?.full_name}
            </p>
            <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded mt-0.5 ${planBadge[user?.plan || 'free']}`}>
              {user?.plan === 'premium' ? '⭐ ' : ''}
              {user?.plan === 'enterprise' ? 'ENTERPRISE' : user?.plan?.toUpperCase() || 'FREE'}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        
      `}</style>

      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/25 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — desktop */}
        <aside className="hidden lg:flex w-56 bg-white border-r border-gray-100 flex-col flex-shrink-0">
          <SidebarContent />
        </aside>

        {/* Sidebar — mobile drawer */}
        <aside
          className={`fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-100 flex flex-col z-30 transition-transform duration-200 lg:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-3 right-3 p-3 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X size={15} />
          </button>
          <SidebarContent />
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Mobile topbar */}
          <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-3 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu size={18} />
            </button>
            <img
              src={logo}
              alt="IELTSPrep"
              className="h-10 w-auto object-contain"
            />
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}