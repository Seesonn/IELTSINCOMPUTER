import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Target } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { Spinner } from '../components/ui'

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', target_band: '' })
  const [focused, setFocused] = useState('')
  const { register, loading } = useAuthStore()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    const payload = {
      ...form,
      email: form.email.trim().toLowerCase(),
      full_name: form.full_name.trim(),
      target_band: form.target_band ? parseFloat(form.target_band) : null,
    }
    const res = await register(payload)
    if (res.success) {
      toast.success('Account created! Check your email for the verification code.')
      sessionStorage.setItem('pendingEmail', payload.email)
      navigate('/verify-otp')
    } else {
      toast.error(res.error)
    }
  }

  const f = (key) => ({
    value: form[key],
    onChange: e => setForm(p => ({ ...p, [key]: e.target.value }))})

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
        .reg-wrap { font-family: 'Quicksand', sans-serif; }
        .reg-label { display: block; font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; }
        .reg-label span { font-weight: 400; color: #bbb; }
        .reg-submit {
          width: 100%; padding: 13px; background: #CC0000; color: #fff; border: none;
          border-radius: 8px; font-size: 15px; font-weight: 700;
          font-family: 'Quicksand', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(204,0,0,0.28); letter-spacing: 0.2px;
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
        }
        .reg-submit:hover:not(:disabled) { background: #a80000; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(204,0,0,0.35); }
        .reg-submit:active:not(:disabled) { transform: translateY(0); }
        .reg-submit:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>

      <div className="reg-wrap">

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '1.8px',
            textTransform: 'uppercase', color: '#CC0000', marginBottom: 8}}>Get started</div>
          <h2 style={{
            
            fontSize: 24, fontWeight: 900,
            color: '#1a1a1a', lineHeight: 1.2, margin: '0 0 6px'}}>Create your account</h2>
          <p style={{ fontSize: 13, color: '#999', margin: 0 }}>
            Start practicing IELTS for free today
          </p>
        </div>

        {/* Red top-border card */}
        <div style={{
          borderRadius: 10,
          border: '1.5px solid #f0f0f0',
          borderTop: '3px solid #CC0000',
          padding: '24px 20px',
          marginBottom: 16,
          background: '#fff'}}>
          <form onSubmit={handle}>

            {/* Full Name */}
            <div style={{ marginBottom: 16 }}>
              <label className="reg-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle('full_name')}><User size={15} /></span>
                <input
                  type="text" required {...f('full_name')}
                  onFocus={() => setFocused('full_name')}
                  onBlur={() => setFocused('')}
                  style={inputStyle('full_name')}
                  placeholder=" Your Name"
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label className="reg-label">Email</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle('email')}><Mail size={15} /></span>
                <input
                  type="email" required {...f('email')}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  style={inputStyle('email')}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label className="reg-label">Password</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle('password')}><Lock size={15} /></span>
                <input
                  type="password" required {...f('password')}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  style={inputStyle('password')}
                  placeholder="Min. 8 characters"
                />
              </div>
            </div>

            {/* Target Band */}
            <div style={{ marginBottom: 20 }}>
              <label className="reg-label">
                Target Band Score <span>(optional)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle('target_band')}><Target size={15} /></span>
                <select
                  {...f('target_band')}
                  onFocus={() => setFocused('target_band')}
                  onBlur={() => setFocused('')}
                  style={{ ...inputStyle('target_band'), appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="">Select target</option>
                  {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="reg-submit">
              {loading ? <Spinner size={18} className="text-white" /> : 'Create Free Account'}
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
                toast.success('Account created!')
                const { user } = useAuthStore.getState()
                navigate('/dashboard', { replace: true })
              } else {
                toast.error(result.error || 'Google sign up failed')
              }
            }}
            onError={() => toast.error('Google sign up failed')}
          />
        </div>

        {/* Terms */}
        <p style={{ fontSize: 11, color: '#bbb', textAlign: 'center', margin: '0 0 16px' }}>
          By creating an account, you agree to our{' '}
          <Link to="/terms" style={{ color: '#CC0000', textDecoration: 'none' }}>Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" style={{ color: '#CC0000', textDecoration: 'none' }}>Privacy Policy</Link>.
        </p>

        {/* Sign in link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#999', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#CC0000', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}