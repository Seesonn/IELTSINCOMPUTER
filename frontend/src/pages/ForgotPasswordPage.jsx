import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { Spinner } from '../components/ui'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [focused, setFocused] = useState('')
  const { forgotPassword, loading } = useAuthStore()

  const handle = async (e) => {
    e.preventDefault()
    const res = await forgotPassword(email)
    if (res.success) {
      setSent(true)
      toast.success('Reset link sent if the account exists.')
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

  return (
    <div className="page-fade">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
        .fw-wrap { font-family: 'Quicksand', sans-serif; }
        .fw-label { display: block; font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; }
        .fw-submit {
          width: 100%; padding: 13px; background: #CC0000; color: #fff; border: none;
          border-radius: 8px; font-size: 15px; font-weight: 700;
          font-family: 'Quicksand', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(204,0,0,0.28); letter-spacing: 0.2px;
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
        }
        .fw-submit:hover:not(:disabled) { background: #a80000; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(204,0,0,0.35); }
        .fw-submit:active:not(:disabled) { transform: translateY(0); }
        .fw-submit:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>

      <div className="fw-wrap">
        {sent ? (
          <>
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
              <div style={{
                width: 76, height: 76, borderRadius: '50%', background: '#fef2f2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 22px',
              }}>
                <Mail size={38} style={{ color: '#CC0000' }} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.3, margin: '0 0 8px' }}>Check your inbox</h2>
              <p style={{ fontSize: 13, color: '#888', margin: '0 auto', lineHeight: 1.7, maxWidth: 260 }}>
                If an account exists, we've sent a password reset link.
              </p>
            </div>
            <div style={{
              borderRadius: 10, border: '1.5px solid #f0f0f0', borderTop: '3px solid #22c55e',
              padding: '22px 20px', background: '#fff',
            }}>
              <button
                onClick={handle}
                style={{
                  width: '100%', padding: 13, background: '#CC0000', color: '#fff', border: 'none',
                  borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(204,0,0,0.28)',
                  marginBottom: 10,
                }}
              >
                Resend email
              </button>
              <Link to="/login" style={{ fontSize: 13, fontWeight: 600, color: '#CC0000', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{
                display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '1.8px',
                textTransform: 'uppercase', color: '#CC0000', marginBottom: 8,
              }}>Reset password</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.2, margin: '0 0 6px' }}>
                Forgot your password?
              </h2>
              <p style={{ fontSize: 13, color: '#999', margin: 0 }}>
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <div style={{
              borderRadius: 10, border: '1.5px solid #f0f0f0', borderTop: '3px solid #CC0000',
              padding: '24px 20px', marginBottom: 20, background: '#fff',
            }}>
              <form onSubmit={handle}>
                <div style={{ marginBottom: 20 }}>
                  <label className="fw-label">Email address</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconStyle('email')}><Mail size={15} /></span>
                    <input
                      type="email" required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      style={inputStyle('email')}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="fw-submit">
                  {loading ? <Spinner size={18} className="text-white" /> : 'Send reset link'}
                </button>
              </form>
            </div>

            <div style={{ textAlign: 'center', paddingTop: 4 }}>
              <Link to="/login" style={{ fontSize: 13, fontWeight: 600, color: '#CC0000', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
