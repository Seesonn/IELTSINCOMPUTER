import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { Spinner } from '../components/ui'

const rules = [
  { key: 'email', label: 'Valid email format', test: (f) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) },
  { key: 'min', label: 'Password at least 8 characters', test: (f) => f.password.length >= 8 },
]

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [focused, setFocused] = useState('')
  const [error, setError] = useState('')
  const { login, loading } = useAuthStore()
  const navigate = useNavigate()

  const checks = useMemo(() => rules.map((r) => ({ ...r, ok: r.test(form) })), [form])

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    if (error) setError('')
  }

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    if (!checks.every((c) => c.ok)) return
    const res = await login(form.email, form.password)
    if (res.success) {
      toast.success('Welcome back!')
      const { user } = useAuthStore.getState()
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard')
    } else {
      if (res.error?.toLowerCase().includes('not verified')) {
        sessionStorage.setItem('pendingEmail', form.email.trim().toLowerCase())
        navigate('/verify-otp')
        return
      }
      setError(res.error || 'Login failed')
    }
  }

  const inputStyle = (name) => ({
    width: '100%',
    padding: '11px 14px 11px 40px',
    border: `1.5px solid ${focused === name ? '#16a34a' : '#e5e5e5'}`,
    borderRadius: 8,
    fontSize: 14,
    color: '#1a1a1a',
    background: '#fff',
    outline: 'none',
    boxShadow: focused === name ? '0 0 0 3px rgba(22,163,74,0.12), 0 2px 8px rgba(0,0,0,0.04)' : '0 1px 3px rgba(0,0,0,0.02)',
    transition: 'border-color 0.18s, box-shadow 0.18s',
    boxSizing: 'border-box'})

  const iconStyle = (name) => ({
    position: 'absolute',
    left: 13,
    top: '50%',
    transform: 'translateY(-50%)',
    color: focused === name ? '#16a34a' : '#bbb',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
    transition: 'color 0.18s'})

  return (
    <div className="page-fade">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
        .login-wrap { font-family: 'Quicksand', sans-serif; }
        .login-label { display: block; font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; }
        .login-submit {
          width: 100%; padding: 13px; color: #fff; border: none;
          border-radius: 8px; font-size: 15px; font-weight: 700;
          font-family: 'Quicksand', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          letter-spacing: 0.2px;
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
        }
        .login-submit:disabled { opacity: 0.65; cursor: not-allowed; }
        .eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #bbb; display: flex; align-items: center; padding: 4px; transition: color 0.18s; }
        .eye-btn:hover { color: #16a34a; }
        .login-submit:hover:not(:disabled) { transform: translateY(-1px); }
        .login-submit:active:not(:disabled) { transform: translateY(0px); }
        .demo-box { margin-top: 14px; padding: 11px 14px; background: #fafafa; border: 1px solid #f0f0f0; border-radius: 8px; font-size: 11px; color: #aaa; text-align: center; line-height: 1.8; }
        .demo-box code { font-family: 'Courier New', monospace; color: #555; background: #f0f0f0; padding: 1px 5px; border-radius: 3px; font-size: 10.5px; }
      `}</style>

      <div className="login-wrap">

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-block',
            fontSize: 10, fontWeight: 700, letterSpacing: '1.8px',
            textTransform: 'uppercase', color: '#16a34a', marginBottom: 8}}>Welcome back</div>
          <h2 style={{
            
            fontSize: 24, fontWeight: 900,
            color: '#1a1a1a', lineHeight: 1.2, margin: '0 0 6px'}}>Login to your account</h2>
          <p style={{ fontSize: 13, color: '#999', margin: 0 }}>
            Continue your IELTS practice journey
          </p>
        </div>

        {/* Green top-border accent card */}
        <div style={{
          borderRadius: 10,
          border: '1.5px solid #f0f0f0',
          borderTop: '3px solid #16a34a',
          padding: '24px 20px',
          marginBottom: 20,
          background: '#fff'}}>
          <form onSubmit={handle}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label className="login-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle('email')}><Mail size={15} /></span>
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  style={inputStyle('email')}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <label className="login-label">Password</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle('password')}><Lock size={15} /></span>
                <input
                  type={show ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  style={{ ...inputStyle('password'), paddingRight: 40 }}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShow(s => !s)} className="eye-btn">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <Link to="/forgot-password" style={{ fontSize: 12, fontWeight: 600, color: '#CC0000', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {checks.map((r) => (
                <span key={r.key} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: r.ok ? '#22c55e' : '#bbb', transition: 'color 0.15s' }}>
                  {r.ok ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {r.label}
                </span>
              ))}
            </div>

            {error && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <XCircle size={14} color="#dc2626" />
                <span style={{ fontSize: 13, color: '#b91c1c', fontWeight: 500 }}>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="login-submit"
              style={{
                background: checks.every(c => c.ok) ? '#16a34a' : '#CC0000',
                boxShadow: checks.every(c => c.ok) ? '0 4px 16px rgba(22,163,74,0.28)' : '0 4px 16px rgba(204,0,0,0.28)',
              }}
              onMouseEnter={e => { if (!loading && checks.every(c => c.ok)) { e.target.style.background = '#15803d'; e.target.style.boxShadow = '0 6px 22px rgba(22,163,74,0.35)' } }}
              onMouseLeave={e => { if (checks.every(c => c.ok)) { e.target.style.background = '#16a34a'; e.target.style.boxShadow = '0 4px 16px rgba(22,163,74,0.28)' } else { e.target.style.background = '#CC0000'; e.target.style.boxShadow = '0 4px 16px rgba(204,0,0,0.28)' } }}
            >
              {loading ? <Spinner size={18} className="text-white" /> : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
            <span style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
            <span style={{ fontSize: 12, color: '#ccc', fontWeight: 600 }}>OR</span>
            <span style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
          </div>

          <GoogleLogin
            theme="outline"
            size="large"
            shape="rectangular"
            width="100%"
            locale="ne"
            onSuccess={async (res) => {
              if (!res.credential) return
              const result = await useAuthStore.getState().googleLogin(res.credential)
              if (result.success) {
                toast.success('Welcome back!')
                const { user } = useAuthStore.getState()
                navigate(user?.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
              } else {
                toast.error(result.error || 'Google login failed')
              }
            }}
            onError={() => toast.error('Google login failed')}
          />
        </div>

        {/* Register link */}
        <div style={{ textAlign: 'center', paddingTop: 4 }}>
          <p style={{ fontSize: 13, color: '#999', margin: 0 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#CC0000', fontWeight: 700, textDecoration: 'none' }}>
              Create one free
            </Link>
          </p>
        </div>

        {/* Demo box */}
        {/* <div className="demo-box">
          Demo · <code>demo@ieltsprep.com</code> / <code>demo123456</code>
        </div> */}

      </div>
    </div>
  )
}