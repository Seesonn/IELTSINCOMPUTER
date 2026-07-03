import { Outlet, Link } from 'react-router-dom'
import logo from '../../assets/hu.png'
import ieltsImg from '../../assets/ielts.png'
import loginBg from '../../assets/loginn.jpg'

export default function AuthLayout() {

  return (
    <div className="min-h-screen flex" style={{ background: '#f7f7f7' }}>

      {/* ── Left: Image panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden">
        {/* Blurred background image layer */}
        <div className="absolute inset-0" style={{
          background: `url(${loginBg}) center/cover no-repeat`,
          filter: 'blur(4px)',
          transform: 'scale(1.05)',
        }} />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 100%)',
        }} />
        <div className="relative z-10 flex flex-col h-full p-12">

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center items-center text-center px-6">

            {/* Logo - centered */}
            <img src={logo} alt="IELTSinComputer" style={{ height: 64, width: 'auto', marginBottom: 36, filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.7))' }} />
            <img src={ieltsImg} alt="IELTS" style={{
              maxWidth: '70%', height: 'auto', marginBottom: 36,
              filter: 'brightness(0) invert(1)',
              opacity: 0.9,
            }} />
            <h2 style={{
              fontSize: 28, fontWeight: 700, color: '#fff',
              lineHeight: 1.3, margin: '0 0 12px',
              fontFamily: "'Quicksand', sans-serif",
            }}>
              Your IELTS Success Starts Here
            </h2>
            <p style={{
              fontSize: 15, color: 'rgba(255,255,255,0.7)',
              maxWidth: 380, lineHeight: 1.7, margin: 0,
              fontFamily: "'Quicksand', sans-serif",
            }}>
              Practice with real exam-style questions, get AI-powered feedback, and track your progress to achieve your target band score.
            </p>

            {/* Stats row */}
            <div className="flex gap-10 mt-10">
              {[
                { n: '40+', l: 'Practice Tests' },
                { n: '14', l: 'Question Types' },
                { n: 'AI', l: 'Scoring' },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                    {s.n}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4, fontWeight: 500 }}>
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom text */}
          <p style={{
            textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.35)',
            fontFamily: "'Quicksand', sans-serif",
          }}>
            © {new Date().getFullYear()} IELTSinComputer · Made in Nepal
          </p>
        </div>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/">
              <img src={logo} alt="IELTSinComputer" style={{ height: 36, width: 'auto', display: 'inline-block' }} />
            </Link>
            <p style={{ marginTop: 4, fontSize: 12, color: '#888' }}>
              IELTS Computer Based Practice Platform
            </p>
          </div>

          {/* Form card */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '28px 24px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
          }}>
            <Outlet />
          </div>

          {/* Mobile footer */}
          <p className="lg:hidden" style={{
            textAlign: 'center', fontSize: 12, color: '#bbb', marginTop: 20,
          }}>
            © {new Date().getFullYear()} IELTSinComputer · Made in Nepal 🇳🇵
          </p>
        </div>
      </div>

    </div>
  )
}
