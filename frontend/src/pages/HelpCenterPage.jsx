import { useState } from 'react'
import Navbar from "../pages/NavBar"
import Footer from "../components/Footer"
import { Search, ChevronDown, BookOpen, FileText, MessageSquare, Shield, HelpCircle, ExternalLink } from "lucide-react"

const faqs = [
  {
    q: "How do I start a practice test?",
    a: "Sign in to your account, go to the Tests page from the dashboard, and choose Reading, Listening, Writing, or Speaking. Each test simulates the real IELTS computer-based experience.",
  },
  {
    q: "How is the AI scoring calculated?",
    a: "Our AI scoring engine analyses your responses against official IELTS band descriptors. For Writing and Speaking, it evaluates task achievement, coherence, lexical resource, and grammatical range.",
  },
  {
    q: "Can I retake a test?",
    a: "Yes, you can retake any practice test as many times as you like. Each attempt is scored independently so you can track your progress over time.",
  },
  {
    q: "How do I view my results?",
    a: "After completing a test, your results appear immediately. You can also revisit past results anytime from the Progress page in your dashboard.",
  },
  {
    q: "Is there a mobile app?",
    a: "Not yet, but the platform is fully responsive and works on all modern mobile browsers. You can practise on your phone or tablet.",
  },
  {
    q: "How do I reset my password?",
    a: "Click 'Sign In', then select 'Forgot password'. Enter your registered email and we'll send you a reset link within a few minutes.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept eSewa, Khalti, and major credit/debit cards. All transactions are processed securely.",
  },
  {
    q: "How do I contact support?",
    a: "Visit our Contact page or email support@ieltsincomputer.com. We typically respond within 24 hours on weekdays.",
  },
]

const guides = [
  { icon: BookOpen,     title: "Getting Started",     desc: "Create your account, choose a plan, and take your first test in under 5 minutes." },
  { icon: FileText,     title: "Test Interface Guide", desc: "Learn how to navigate the computer-based test interface, highlight text, and manage time." },
  { icon: MessageSquare, title: "Writing & Speaking Tips", desc: "Understand what examiners look for and how to maximise your score." },
  { icon: Shield,       title: "Account & Billing",    desc: "Manage your subscription, update profile details, and view payment history." },
]

export default function HelpCenterPage() {
  const [search, setSearch] = useState('')
  const [openIndex, setOpenIndex] = useState(null)

  const filtered = faqs.filter(
    f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  )

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
      `}</style>

      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden max-w-4xl mx-auto px-6 pt-20 sm:pt-28 pb-10 sm:pb-14 text-center">
        <div className="absolute inset-0 bg-pattern pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-red-50/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-red-50/40 blur-3xl pointer-events-none" />

        <div className="relative anim-fade-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[3px] rounded-full bg-[#CC0000]" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#CC0000]">Help Center</span>
            <span className="w-8 h-[3px] rounded-full bg-[#CC0000]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-3">
            How can we help you?
          </h1>
          <p className="text-base text-gray-400 leading-relaxed max-w-lg mx-auto mb-8">
            Find answers to common questions and learn how to get the most out of IELTSPrep.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto anim-fade-up delay-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search frequently asked questions..."
            className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl outline-none
              focus:border-[#CC0000] focus:ring-[3px] focus:ring-red-50 transition-all duration-200
              placeholder:text-gray-300"
          />
        </div>
      </section>

      {/* Guides */}
      <section className="max-w-4xl mx-auto px-6 pb-12 anim-fade-up delay-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {guides.map(({ icon: Icon, title, desc }) => (
            <div key={title}
              className="p-5 rounded-xl bg-white border border-gray-100 hover:border-red-100
                hover:shadow-[0_4px_20px_rgba(204,0,0,0.06)] transition-all duration-300">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-50 to-red-100/60 border border-red-100
                flex items-center justify-center mb-3">
                <Icon size={16} className="text-icon" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-28 sm:pb-36 anim-fade-up delay-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-6 h-[3px] rounded-full bg-[#CC0000]" />
          <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#CC0000]">FAQ</span>
          <span className="w-6 h-[3px] rounded-full bg-[#CC0000]" />
        </div>
        <h2 className="font-serif text-2xl font-black text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-10">No results found for "{search}"</p>
          ) : (
            filtered.map((item, i) => {
              const isOpen = openIndex === i
              return (
                <div key={i}
                  className={`rounded-xl border transition-all duration-200 cursor-pointer
                    ${isOpen ? 'border-red-100 bg-red-50/30 shadow-[0_2px_12px_rgba(204,0,0,0.05)]' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left bg-transparent border-none cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-gray-900 leading-snug">{item.q}</span>
                    <ChevronDown size={16}
                      className={`shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                      <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Still stuck */}
        <div className="mt-10 p-6 rounded-xl bg-gradient-to-br from-red-50 to-orange-50/60 border border-red-100/70 text-center">
          <p className="text-sm font-bold text-gray-900 mb-1">Still stuck?</p>
          <p className="text-sm text-gray-500 mb-4">Can't find what you're looking for? Reach out to our team.</p>
          <a href="/contact"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#CC0000] bg-white border-2 border-[#CC0000]/20
              px-5 py-2.5 rounded-xl hover:bg-red-50 hover:border-[#CC0000]/40 transition-all duration-200 no-underline">
            Contact Support <ExternalLink size={14} />
          </a>
        </div>
      </section>

      <Footer />

    </div>
  )
}
