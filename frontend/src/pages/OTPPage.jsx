import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Shield, RefreshCw, ArrowLeft } from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { Spinner } from '../components/ui'

export default function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])
  const { verifyOtp, resendOtp, loading, pendingEmail } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const email = sessionStorage.getItem('pendingEmail') || pendingEmail || location.state?.email || ''

  useEffect(() => {
    if (!email) navigate('/register')
  }, [email, navigate])

  useEffect(() => {
    if (!canResend && timer > 0) {
      const id = setTimeout(() => setTimer(t => t - 1), 1000)
      return () => clearTimeout(id)
    }
    if (timer === 0) setCanResend(true)
  }, [timer, canResend])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'Enter') handleSubmit(e)
  }

  const handlePaste = useCallback((e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const newOtp = [...otp]
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i]
    setOtp(newOtp)
    const nextIndex = Math.min(pasted.length, 5)
    inputRefs.current[nextIndex]?.focus()
    if (pasted.length === 6) {
      setTimeout(() => handleSubmit(e, pasted), 100)
    }
  }, [otp])

  const handleSubmit = async (e, codeOverride) => {
    if (e) e.preventDefault()
    const code = codeOverride || otp.join('')
    if (code.length !== 6) { toast.error('Please enter the full 6-digit code'); return }
    if (!email) { toast.error('Session expired. Please register again.'); navigate('/register'); return }
    const res = await verifyOtp(email, code)
    if (res.success) {
      sessionStorage.removeItem('pendingEmail')
      toast.success('Email verified! Welcome to IELTSPrep')
      navigate('/dashboard')
    } else {
      toast.error(res.error)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }

  const handleResend = async () => {
    if (!email) return
    const res = await resendOtp(email)
    if (res.success) {
      toast.success('New code sent!')
      setTimer(60)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } else {
      toast.error(res.error)
    }
  }

  if (!email) return null

  const allFilled = otp.every(d => d !== '')

  return (
    <div className="page-fade">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
        .otp-wrap { font-family: 'Quicksand', sans-serif; }
        .otp-label { display: block; font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; text-align: center; }
        .otp-input {
          width: 44px; height: 50px; text-align: center; font-size: 20px; font-weight: 700;
          border: 1.5px solid #e5e5e5; border-radius: 8px; outline: none;
          color: #1a1a1a; background: #fff;
          transition: border-color 0.18s, box-shadow 0.18s;
          font-family: 'Quicksand', sans-serif;
        }
        .otp-input:focus { border-color: #CC0000; box-shadow: 0 0 0 3px rgba(204,0,0,0.08); }
        .otp-submit {
          width: 100%; padding: 13px; background: #CC0000; color: #fff; border: none;
          border-radius: 8px; font-size: 15px; font-weight: 700;
          font-family: 'Quicksand', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(204,0,0,0.28);
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
        }
        .otp-submit:hover:not(:disabled) { background: #a80000; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(204,0,0,0.35); }
        .otp-submit:active:not(:disabled) { transform: translateY(0); }
        .otp-submit:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>

      <div className="otp-wrap">
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: '50%', background: '#fff0f0',
            marginBottom: 14
          }}>
            <Shield size={24} color="#CC0000" />
          </div>
          <h2 style={{
            fontSize: 22, fontWeight: 900,
            color: '#1a1a1a', lineHeight: 1.2, margin: '0 0 6px'
          }}>Verify your email</h2>
          <p style={{ fontSize: 13, color: '#999', margin: 0, lineHeight: 1.6 }}>
            We sent a 6-digit code to<br />
            <strong style={{ color: '#1a1a1a' }}>{email}</strong>
          </p>
        </div>

        <div style={{
          borderRadius: 10, border: '1.5px solid #f0f0f0',
          borderTop: '3px solid #CC0000', padding: '24px 20px',
          marginBottom: 16, background: '#fff'
        }}>
          <form onSubmit={handleSubmit}>
            <label className="otp-label" style={{ marginBottom: 14 }}>
              Enter verification code
            </label>
            <div
              style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}
              onPaste={handlePaste}
            >
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onFocus={e => e.target.select()}
                  className="otp-input"
                  autoFocus={i === 0}
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !allFilled}
              className="otp-submit"
              style={{ opacity: !allFilled ? 0.5 : undefined }}
            >
              {loading ? <Spinner size={18} className="text-white" /> : 'Verify Email'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center' }}>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              style={{
                background: 'none', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 600, color: '#CC0000',
                fontFamily: "'Quicksand', sans-serif", padding: 0,
              }}
            >
              <RefreshCw size={14} />
              Resend code
            </button>
          ) : (
            <p style={{ fontSize: 12, color: '#bbb', margin: 0 }}>
              Resend code in <span style={{ color: '#CC0000', fontWeight: 700 }}>{timer}s</span>
            </p>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <Link
            to="/register"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 12, color: '#999', textDecoration: 'none',
              fontFamily: "'Quicksand', sans-serif",
            }}
          >
            <ArrowLeft size={13} />
            Use a different email
          </Link>
        </div>
      </div>
    </div>
  )
}
