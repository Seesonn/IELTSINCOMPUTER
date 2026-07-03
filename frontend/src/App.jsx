import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'
import { authApi } from './utils/api'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Layout
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'
import TestLayout from './components/layout/TestLayout'

// Pages
import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import OTPPage        from './pages/OTPPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage  from './pages/DashboardPage'
import TestsPage      from './pages/TestsPage'
import ReadingPage    from './pages/ReadingPage'
import ListeningPage  from './pages/ListeningPage'
import WritingPage    from './pages/WritingPage'
import SpeakingPage   from './pages/SpeakingPage'
import ResultPage     from './pages/ResultPage'
import WritingResultPage from './pages/WritingResultPage'
import VocabularyPage from './pages/VocabularyPage'
import PricingPage    from './pages/PricingPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'
import ProfilePage    from './pages/ProfilePage'
import ProgressPage   from './pages/ProgressPage'
import PracticeBookPage from './pages/PracticeBookPage'
import PracticeTestPage from './pages/PracticeTestPage'
import MockTestPage from './pages/MockTestPage'
import MockTestResultPage from './pages/MockTestResultPage'
import MockTestHistoryPage from './pages/MockTestHistoryPage'
import BandScore from './pages/BandScore'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import HelpCenterPage from './pages/HelpCenterPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import LoginHistoryPage from './pages/LoginHistoryPage'
import ResourcePage from './pages/ResourcePage'
import NotFoundPage from './pages/NotFoundPage'

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-red-700 rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading…</p>
      </div>
    </div>
  )
}

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  const initDone = useAuthStore((s) => s.initDone)
  if (!initDone) return null
  return token ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const initDone = useAuthStore((s) => s.initDone)
  if (!initDone) return null
  if (!token) return <Navigate to="/login" replace />
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function PublicOnly({ children }) {
  const token = useAuthStore((s) => s.token)
  const initDone = useAuthStore((s) => s.initDone)
  if (!initDone) return null
  return !token ? children : <Navigate to="/dashboard" replace />
}

export default function App() {
  const init = useAuthStore((s) => s.init)
  const initDone = useAuthStore((s) => s.initDone)
  const token = useAuthStore((s) => s.token)
  useEffect(() => { init() }, [init])

  useEffect(() => {
    if (!token) return
    const check = () => {
      if (!localStorage.getItem('token')) return
      authApi.me().catch(() => {})
    }
    window.addEventListener('focus', check)
    const interval = setInterval(check, 2000)
    return () => {
      window.removeEventListener('focus', check)
      clearInterval(interval)
    }
  }, [token])

  if (!initDone) return <LoadingScreen />

  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
       <Route path="/bandscore" element={<BandScore />}/> 
       <Route path="/about" element={<AboutPage/>} />
       <Route path="/contact" element={<ContactPage />} />
       <Route path="/help" element={<HelpCenterPage />} />
       <Route path="/privacy" element={<PrivacyPage />} />
       <Route path="/terms" element={<TermsPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login"              element={<PublicOnly><LoginPage /></PublicOnly>} />
        <Route path="/register"           element={<PublicOnly><RegisterPage /></PublicOnly>} />
        <Route path="/verify-otp"         element={<PublicOnly><OTPPage /></PublicOnly>} />
        <Route path="/forgot-password"    element={<PublicOnly><ForgotPasswordPage /></PublicOnly>} />
        <Route path="/reset-password/:token" element={<PublicOnly><ResetPasswordPage /></PublicOnly>} />
        <Route path="/admin/login"        element={<PublicOnly><AdminLoginPage /></PublicOnly>} />
      </Route>

      {/* Payment callbacks */}
      <Route path="/payment/success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
      <Route path="/payment/failure" element={<PrivateRoute><PaymentFailure /></PrivateRoute>} />

      {/* Full-screen test pages (no nav) */}
      <Route element={<TestLayout />}>
        <Route path="/test/:testId/reading"   element={<PrivateRoute><ReadingPage /></PrivateRoute>} />
        <Route path="/test/:testId/listening" element={<PrivateRoute><ListeningPage /></PrivateRoute>} />
        <Route path="/test/:testId/writing"   element={<PrivateRoute><WritingPage /></PrivateRoute>} />
        <Route path="/test/:testId/speaking"  element={<PrivateRoute><SpeakingPage /></PrivateRoute>} />
        <Route path="/result/:sessionId"      element={<PrivateRoute><ResultPage /></PrivateRoute>} />
        <Route path="/writing-result/:id"     element={<PrivateRoute><WritingResultPage /></PrivateRoute>} />
      </Route>

      {/* App pages with sidebar nav */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="/dashboard"   element={<DashboardPage />} />
        <Route path="/tests"       element={<TestsPage />} />
        <Route path="/book"        element={<PracticeBookPage />} />
        <Route path="/book/:bookId" element={<PracticeTestPage />} />
        <Route path="/mock-test"   element={<MockTestPage />} />
        <Route path="/mock-test-result" element={<MockTestResultPage />} />
        <Route path="/mock-test-history" element={<MockTestHistoryPage />} />
        <Route path="/progress"    element={<ProgressPage />} />
        <Route path="/vocabulary"  element={<VocabularyPage />} />
        <Route path="/pricing"     element={<PricingPage />} />
        <Route path="/admin"       element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/profile"     element={<ProfilePage />} />
        <Route path="/login-history" element={<LoginHistoryPage />} />
        <Route path="/resources" element={<ResourcePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  )
}
