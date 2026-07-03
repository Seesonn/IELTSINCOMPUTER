import Navbar from "../pages/NavBar"
import Footer from "../components/Footer"
import { Scale, FileText, Ban, AlertTriangle, UserCheck, Mail } from "lucide-react"

const sections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content: "By accessing or using IELTSPrep, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform. We reserve the right to update these terms at any time; continued use after changes constitutes acceptance.",
  },
  {
    icon: UserCheck,
    title: "Account Responsibilities",
    content: "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must provide accurate information during registration. Accounts found to be using false information may be suspended.",
  },
  {
    icon: Ban,
    title: "Prohibited Conduct",
    content: "You agree not to: (a) use the platform for any unlawful purpose, (b) attempt to bypass scoring mechanisms or manipulate test results, (c) share account access with others, (d) copy, scrape, or redistribute platform content without authorisation, or (e) engage in any activity that disrupts the platform's operation.",
  },
  {
    icon: AlertTriangle,
    title: "Disclaimer of Warranties",
    content: "IELTSPrep provides practice materials and AI-generated scoring for educational purposes only. While we strive for accuracy, we do not guarantee that scores exactly mirror official IELTS results. The platform is provided 'as is' without warranties of any kind, either express or implied.",
  },
  {
    icon: Scale,
    title: "Limitation of Liability",
    content: "To the fullest extent permitted by law, IELTSPrep and its operators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you have paid us in the 12 months preceding the claim.",
  },
  {
    icon: Mail,
    title: "Contact & Disputes",
    content: 'Any disputes shall be governed by the laws of Nepal. For questions or concerns regarding these terms, contact us at support@ieltsincomputer.com or through our Contact page. We aim to resolve all disputes informally within 14 days.',
  },
]

export default function TermsPage() {
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
            <Scale size={24} className="text-icon" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[3px] rounded-full bg-[#CC0000]" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#CC0000]">Terms</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-400 mb-4">Last updated: January 2026</p>
          <p className="text-base text-gray-400 leading-relaxed max-w-2xl">
            These terms govern your use of IELTSPrep. By using the platform, you agree to the terms outlined below.
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
            These terms were last updated on January 2026. Registered users will be notified of material changes via email.
          </p>
        </div>
      </section>

      <Footer />

    </div>
  )
}
