import { useState, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { Spinner } from '../components/ui'

const rules = [
  { key: 'min', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { key: 'lower', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { key: 'number', label: 'One number', test: (p) => /[0-9]/.test(p) },
  { key: 'match', label: (ok) => ok ? 'Passwords match' : 'Passwords do not match', test: (p, c) => p.length > 0 && c.length > 0 && p === c },
]

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [done, setDone] = useState(false)
  const [focused, setFocused] = useState('')
  const { resetPassword, loading } = useAuthStore()

  const checks = useMemo(() => rules.map((r) => ({ ...r, ok: r.test(password, confirm) })), [password, confirm])

  const handle = async (e) => {
    e.preventDefault()
    const allOk = checks.every((c) => c.ok)
    if (!allOk) return
    const res = await resetPassword(token, password)
    if (res.success) {
      setDone(true)
      toast.success('Password reset successfully!')
    } else {
      toast.error(res.error)
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
    boxSizing: 'border-box',
  })

  const iconStyle = (name) => ({
    position: 'absolute',
    left: 13,
    top: '50%',
    transform: 'translateY(-50%)',
    color: focused === name ? '#CC0000' : '#bbb',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
    transition: 'color 0.18s',
  })

  if (done) {
    return (
      <div className="page-fade" style={{ fontFamily: "'Quicksand', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');`}</style>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{
            width: 76, height: 76, borderRadius: '50%', background: '#f0fdf4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 22px',
          }}>
            <CheckCircle size={38} style={{ color: '#22c55e' }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.3, margin: '0 0 8px' }}>Password changed</h2>
          <p style={{ fontSize: 13, color: '#888', margin: '0 auto', lineHeight: 1.7, maxWidth: 260 }}>
            Your password has been reset successfully. You can now log in with your new password.
          </p>
        </div>
        <div style={{
          borderRadius: 10, border: '1.5px solid #f0f0f0', borderTop: '3px solid #22c55e',
          padding: '22px 20px', background: '#fff',
        }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%', padding: 13, background: '#CC0000', color: '#fff', border: 'none',
              borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(204,0,0,0.28)',
            }}
          >
            Go to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-fade">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
        .rp-wrap { font-family: 'Quicksand', sans-serif; }
        .rp-label { display: block; font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; }
        .rp-submit {
          width: 100%; padding: 13px; background: #CC0000; color: #fff; border: none;
          border-radius: 8px; font-size: 15px; font-weight: 700;
          font-family: 'Quicksand', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(204,0,0,0.28); letter-spacing: 0.2px;
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
        }
        .rp-submit:hover:not(:disabled) { background: #a80000; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(204,0,0,0.35); }
        .rp-submit:active:not(:disabled) { transform: translateY(0); }
        .rp-submit:disabled { opacity: 0.65; cursor: not-allowed; }
        .eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #bbb; display: flex; align-items: center; padding: 4px; transition: color 0.18s; }
        .eye-btn:hover { color: #CC0000; }
      `}</style>

      <div className="rp-wrap">
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '1.8px',
            textTransform: 'uppercase', color: '#CC0000', marginBottom: 8,
          }}>New password</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.2, margin: '0 0 6px' }}>
            Reset your password
          </h2>
          <p style={{ fontSize: 13, color: '#999', margin: 0 }}>
            Enter your new password below.
          </p>
        </div>

        <div style={{
          borderRadius: 10, border: '1.5px solid #f0f0f0', borderTop: '3px solid #CC0000',
          padding: '24px 20px', marginBottom: 20, background: '#fff',
        }}>
          <form onSubmit={handle}>
            <div style={{ marginBottom: 16 }}>
              <label className="rp-label">New password</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle('password')}><Lock size={15} /></span>
                <input
                  type={show ? 'text' : 'password'} required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  style={{ ...inputStyle('password'), paddingRight: 40 }}
                  placeholder="••••••••"
                  minLength={8}
                />
                <button type="button" onClick={() => setShow((s) => !s)} className="eye-btn">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="rp-label">Confirm password</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle('confirm')}><Lock size={15} /></span>
                <input
                  type={show ? 'text' : 'password'} required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onFocus={() => setFocused('confirm')}
                  onBlur={() => setFocused('')}
                  style={{ ...inputStyle('confirm'), paddingRight: 40 }}
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {checks.map((r) => (
                <span key={r.key} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: r.ok ? '#22c55e' : '#bbb', transition: 'color 0.15s' }}>
                  {r.ok ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {typeof r.label === 'function' ? r.label(r.ok) : r.label}
                </span>
              ))}
            </div>

            <button type="submit" disabled={loading} className="rp-submit">
              {loading ? <Spinner size={18} className="text-white" /> : 'Reset password'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', paddingTop: 4 }}>
          <Link to="/login" style={{ fontSize: 13, fontWeight: 600, color: '#CC0000', textDecoration: 'none' }}>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
