import Navbar from "../pages/NavBar"
import Footer from "../components/Footer"
import { Shield, Lock, Eye, Trash2, Database, Mail } from "lucide-react"

const sections = [
  {
    icon: Eye,
    title: "Information We Collect",
    content: "When you create an account, we collect your name, email address, and hashed password. During test attempts, we store your responses, scores, and progress data to provide personalised feedback. We do not collect sensitive personal data unless you voluntarily provide it.",
  },
  {
    icon: Database,
    title: "How We Use Your Data",
    content: "Your data is used solely to operate and improve the platform: authenticate your account, score your practice tests, track your progress, and send essential service notifications. We never sell or share your personal information with third parties for marketing purposes.",
  },
  {
    icon: Lock,
    title: "Data Security",
    content: "We implement industry-standard security measures including AES-256 encryption for data at rest, TLS 1.3 for data in transit, and bcrypt hashing for passwords. Access to production data is restricted to authorised personnel only.",
  },
  {
    icon: Trash2,
    title: "Data Retention & Deletion",
    content: "We retain your account data for as long as your account is active. You may request account deletion at any time by contacting us. Upon deletion, all personal data is permanently removed within 30 days, except where we are legally required to retain it.",
  },
  {
    icon: Eye,
    title: "Cookies",
    content: "We use essential cookies for authentication and session management. No tracking or advertising cookies are used. You can control cookie settings through your browser, though disabling essential cookies may affect platform functionality.",
  },
  {
    icon: Mail,
    title: "Contact Us",
    content: 'If you have questions about this policy or wish to exercise your data rights, email us at support@ieltsincomputer.com or visit our Contact page. We respond to all privacy inquiries within 72 hours.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Quicksand', serif !important; }
        .font-sans  { font-family: 'Quicksand', sans-serif !important; }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up { animation: fadeUp 0.6s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }

        .bg-pattern {
          background-image: radial-gradient(rgba(204,0,0,0.04) 1px, transparent 1px);
          background-size: 32px 32px;
        }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden max-w-4xl mx-auto px-6 pt-20 sm:pt-28 pb-10 sm:pb-14">
        <div className="absolute inset-0 bg-pattern pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-red-50/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-red-50/40 blur-3xl pointer-events-none" />

        <div className="relative anim-fade-up">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-50 to-red-100/60 border border-red-100 flex items-center justify-center mb-5">
            <Shield size={24} className="text-icon" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[3px] rounded-full bg-[#CC0000]" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#CC0000]">Privacy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400 mb-4">Last updated: January 2026</p>
          <p className="text-base text-gray-400 leading-relaxed max-w-2xl">
            Your privacy matters to us. This policy explains what data we collect, how we use it, and your rights regarding your personal information on IELTSPrep.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 pb-28 sm:pb-36">
        <div className="space-y-6 anim-fade-up delay-1">
          {sections.map(({ icon: Icon, title, content }) => (
            <div key={title}
              className="flex items-start gap-4 sm:gap-5 p-5 sm:p-6 rounded-xl bg-white border border-gray-100
                hover:border-red-100 hover:shadow-[0_4px_20px_rgba(204,0,0,0.04)] transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-50 to-red-100/60 border border-red-100
                flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={18} className="text-icon" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 p-5 rounded-xl bg-gray-50 border border-gray-100 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            This policy may be updated periodically. We will notify registered users of any material changes via email.
          </p>
        </div>
      </section>

      <Footer />

    </div>
  )
}
