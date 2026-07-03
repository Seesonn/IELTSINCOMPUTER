import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Shield } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { Spinner } from '../components/ui'

const rules = [
  { key: 'email', label: 'Valid email format', test: (f) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) },
  { key: 'min', label: 'Password at least 8 characters', test: (f) => f.password.length >= 8 },
]

export default function AdminLoginPage() {
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
      const { user } = useAuthStore.getState()
      if (user?.role === 'admin') {
        navigate('/admin')
      } else {
        setError('This portal is for administrators only.')
      }
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
    border: `1.5px solid ${focused === name ? '#CC0000' : '#e5e5e5'}`,
    borderRadius: 8,
    fontSize: 14,
    color: '#1a1a1a',
    background: '#fff',
    outline: 'none',
    boxShadow: focused === name ? '0 0 0 3px rgba(204,0,0,0.08)' : 'none',
    transition: 'border-color 0.18s, box-shadow 0.18s',
    boxSizing: 'border-box'})

  const iconStyle = (name) => ({
    position: 'absolute',
    left: 13,
    top: '50%',
    transform: 'translateY(-50%)',
    color: focused === name ? '#CC0000' : '#bbb',
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
          width: 100%; padding: 13px; background: #CC0000; color: #fff; border: none;
          border-radius: 8px; font-size: 15px; font-weight: 700;
          font-family: 'Quicksand', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(204,0,0,0.28); letter-spacing: 0.2px;
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
        }
        .login-submit:hover:not(:disabled) { background: #a80000; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(204,0,0,0.35); }
        .login-submit:active:not(:disabled) { transform: translateY(0); }
        .login-submit:disabled { opacity: 0.65; cursor: not-allowed; }
        .eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #bbb; display: flex; align-items: center; padding: 4px; transition: color 0.18s; }
        .eye-btn:hover { color: #CC0000; }
      `}</style>

      <div className="login-wrap">

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-block',
            fontSize: 10, fontWeight: 700, letterSpacing: '1.8px',
            textTransform: 'uppercase', color: '#CC0000', marginBottom: 8}}>Admin access</div>
          <h2 style={{
            fontSize: 24, fontWeight: 900,
            color: '#1a1a1a', lineHeight: 1.2, margin: '0 0 6px'}}>Admin Login</h2>
          <p style={{ fontSize: 13, color: '#999', margin: 0 }}>
            Sign in to manage the platform
          </p>
        </div>

        {/* Red top-border accent card */}
        <div style={{
          borderRadius: 10,
          border: '1.5px solid #f0f0f0',
          borderTop: '3px solid #CC0000',
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
                  placeholder="admin@ieltsprep.com"
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

            {/* Validation checks */}
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

            <button type="submit" disabled={loading} className="login-submit">
              {loading ? <Spinner size={18} className="text-white" /> : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', paddingTop: 4 }}>
          <p style={{ fontSize: 13, color: '#999', margin: 0 }}>
            <Link to="/login" style={{ color: '#CC0000', fontWeight: 700, textDecoration: 'none' }}>
              Back to student login
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}