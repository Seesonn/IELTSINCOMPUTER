import Navbar from "../pages/NavBar"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"
import { ArrowRight, Target, Zap, Globe, Shield, Heart, Award, Lightbulb } from "lucide-react"

const values = [
  { icon: Target,    title: "Accuracy First",     desc: "Every question and scoring rubric is modelled on official IELTS standards. No shortcuts." },
  { icon: Globe,     title: "Built for Nepal",     desc: "Local payments, local context, local support. We understand the Nepali student's journey." },
  { icon: Zap,       title: "Instant Feedback",    desc: "AI scoring that responds in seconds — not days. Iterate faster, improve faster." },
  { icon: Shield,    title: "Student Privacy",     desc: "Your data is yours. We never sell, share, or monetise your personal information." },
  { icon: Heart,     title: "Affordable Access",   desc: "World-class IELTS prep shouldn't cost a fortune. Our free tier is genuinely useful." },
  { icon: Award,     title: "Proven Results",      desc: "95% of consistent users see band improvement within 4 weeks. That's our north star." },
]

const milestones = [
  { year: "Day 1",  event: "Three people in Itahari — one instructor, two students — sit down with a single question: why is IELTS prep so hard to access?" },
  { year: "Week 1", event: "First rough prototype of the CBT interface built on a laptop in a small room in Itahari." },
  { year: "Month 1",event: "First 50 students join the beta — all from the instructor's own classes." },
  { year: "2025",   event: "AI Writing scorer launched — accurate within ±0.5 of official band scores." },
  { year: "2025",   event: "eSewa & Khalti payments added. 10,000+ students enrolled across Nepal." },
  { year: "2026-working",   event: "AI Speaking scorer and full CBT simulation released nationwide." },
]

export default function AboutPage() {
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
            @keyframes fadeIn {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
            @keyframes scaleIn {
              0% { opacity: 0; transform: scale(0.85); }
              100% { opacity: 1; transform: scale(1); }
            }
            @keyframes slideDown {
              0% { opacity: 0; transform: translateY(-8px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse-dot {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 1; }
            }
    
            .anim-fade-up   { animation: fadeUp 0.6s ease both; }
            .anim-fade-in   { animation: fadeIn 0.5s ease both; }
            .anim-scale-in  { animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
            .anim-slide-down { animation: slideDown 0.3s ease both; }
            .anim-pulse-dot  { animation: pulse-dot 2s ease infinite; }
            .anim-ping-dot   { animation: ping-dot 1.5s ease infinite; }
    
            @keyframes pulse-dot {
              0%, 100% { opacity: 0.4; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.15); }
            }
            @keyframes ping-dot {
              0% { transform: scale(1); opacity: 0.5; }
              75%, 100% { transform: scale(2.2); opacity: 0; }
            }
    
            .delay-1 { animation-delay: 0.1s; }
            .delay-2 { animation-delay: 0.2s; }
            .delay-3 { animation-delay: 0.3s; }
    
            .bg-pattern {
              background-image: radial-gradient(rgba(204,0,0,0.04) 1px, transparent 1px);
              background-size: 32px 32px;
            }
          `}</style>
    
          <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-pattern pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-red-50/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-red-50/40 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-20 sm:pt-28 pb-16 sm:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <div className="anim-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[3px] rounded-full bg-[#CC0000]" />
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#CC0000]">Our Story</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
              Born in Itahari.<br />
              <span className="text-[#CC0000] italic">Built for every</span><br />
              student in Nepal.
            </h1>
            <p className="text-base text-gray-500 leading-relaxed mb-5 max-w-md">
              IELTSPrep didn't start in a fancy office or a tech hub. It started in <strong className="text-gray-700">Itahari</strong> — with three people sharing one frustration.
            </p>
            <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-md">
              An IELTS instructor and two of his own students asked a simple question: <em>"Why does great IELTS prep have to be so expensive and inaccessible?"</em> The answer they built is what you're using today.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-[#CC0000] text-white px-6 py-3.5 rounded-lg text-sm font-bold hover:bg-[#a80000] transition-colors duration-200"
            >
              Start Free Practice <ArrowRight size={15} />
            </Link>
          </div>

          {/* Right — image + floating cards */}
          <div className="anim-fade-up delay-1 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80"
                alt="Students and instructor collaborating"
                className="w-full h-72 sm:h-96 object-cover object-center"
              />
            </div>
            {/* Floating origin card */}
            <div className="absolute -bottom-5 -left-4 sm:-left-8 bg-white border border-gray-100 rounded-xl shadow-xl px-5 py-4 max-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb size={14} color="#CC0000" />
                <span className="text-[10px] font-bold text-[#CC0000] uppercase tracking-wider">Origin</span>
              </div>
              <div className="font-serif text-sm font-black text-gray-900 leading-snug">Itahari, Sunsari</div>
              <div className="text-xs text-gray-400 mt-0.5">1 instructor · 2 students</div>
            </div>
            {/* Floating badge */}
            {/* <div className="absolute -top-4 -right-3 sm:-right-6 bg-[#CC0000] text-white rounded-xl shadow-xl px-4 py-3 text-center">
              <div className="font-serif text-2xl font-black leading-none">10k+</div>
              <div className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-80">Students</div>
            </div> */}
          </div>
        </div>
      </section>

      {/* ── MISSION STRIP ── */}
      <section className="bg-[#CC0000] py-5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-serif text-white text-lg sm:text-xl font-bold italic">
            "Three people from Itahari decided that every Nepali student deserves a fair shot at Band 7+."
          </p>
        </div>
      </section>

      {/* ── FOUNDING STORY ── */}
      <section className="bg-white py-16 sm:py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          <div className="fade-3">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-[3px] rounded-full bg-[#CC0000]" />
              <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#CC0000]">How It Started</p>
            </div>
            <h2 className="font-serif text-3xl font-black text-gray-900 mb-6 leading-snug">
              A classroom in Itahari.<br />A problem worth solving.
            </h2>

            {/* Founder cards */}
            <div className="space-y-4 mb-8">
              {/* Instructor */}
              <div className="flex items-start gap-4 border border-gray-100 border-l-4 border-l-[#CC0000] rounded-xl p-5">
                <div className="w-11 h-11 rounded-full bg-red-50 border-2 border-[#CC0000] flex items-center justify-center shrink-0">
                  <span className="font-serif text-base font-black text-[#CC0000]">G</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#CC0000] uppercase tracking-wider mb-0.5">The Instructor</div>
                  <p className="text-sm font-bold text-gray-900 mb-1">The one who saw the gap</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    An experienced IELTS instructor in Itahari who watched talented students fail not because of ability — but because quality practice material was out of reach.
                  </p>
                </div>
              </div>

              {/* Student 1 */}
              <div className="flex items-start gap-4 border border-gray-100 border-l-4 border-l-[#CC0000] rounded-xl p-5">
                <div className="w-11 h-11 rounded-full bg-red-50 border-2 border-[#CC0000] flex items-center justify-center shrink-0">
                  <span className="font-serif text-base font-black text-[#CC0000]">S</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#CC0000] uppercase tracking-wider mb-0.5">Student · Co-founder</div>
                  <p className="text-sm font-bold text-gray-900 mb-1">The one who built it</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    A tech-minded student who turned the instructor's vision into code — building the first version of the CBT interface from scratch on a laptop in Itahari.
                  </p>
                </div>
              </div>

              {/* Student 2 */}
              <div className="flex items-start gap-4 border border-gray-100 border-l-4 border-l-[#CC0000] rounded-xl p-5">
                <div className="w-11 h-11 rounded-full bg-red-50 border-2 border-[#CC0000] flex items-center justify-center shrink-0">
                  <span className="font-serif text-base font-black text-[#CC0000]">B</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#CC0000] uppercase tracking-wider mb-0.5">Student · Co-founder</div>
                  <p className="text-sm font-bold text-gray-900 mb-1">The one who felt the pain</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    A student who had personally struggled to find affordable, realistic IELTS practice — and became the voice of every student IELTSPrep was built to serve.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=700&q=80"
              alt="Student at computer practicing IELTS"
              className="rounded-2xl shadow-xl w-full h-64 sm:h-80 lg:h-[460px] object-cover object-center"
            />
            <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white border border-gray-100 rounded-xl shadow-lg px-5 py-4">
              <div className="font-serif text-2xl font-black text-[#CC0000]">95%</div>
              <div className="text-xs text-gray-500 font-semibold mt-1 leading-snug">score improvement<br/>within 4 weeks</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="bg-gray-50 py-16 sm:py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-6 h-[3px] rounded-full bg-[#CC0000]" />
              <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#CC0000]">Our Journey</p>
              <span className="w-6 h-[3px] rounded-full bg-[#CC0000]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-gray-900">
              From three people to Nepal's #1 IELTS platform
            </h2>
          </div>
          <div className="border-l-2 border-gray-200 ml-4 space-y-8">
            {milestones.map(({ year, event }) => (
              <div key={year} className="timeline-item">
                <span className="inline-block text-[11px] font-bold text-[#CC0000] uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded mb-1">{year}</span>
                <p className="text-sm text-gray-600 leading-relaxed">{event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="bg-white py-16 sm:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-6 h-[3px] rounded-full bg-[#CC0000]" />
              <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#CC0000]">What We Stand For</p>
              <span className="w-6 h-[3px] rounded-full bg-[#CC0000]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-gray-900">Our core values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group border border-gray-100 rounded-xl p-6 hover:border-red-100 hover:shadow-[0_4px_20px_rgba(204,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-50 to-red-100/60 border border-red-100 flex items-center justify-center mb-4">
                  <Icon size={17} className="text-icon" />
                </div>
                <h3 className="font-serif text-base font-black text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEPAL SECTION ── */}
      <section className="bg-gray-50 py-16 sm:py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-[3px] rounded-full bg-[#CC0000]" />
              <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#CC0000]">Made in Nepal 🇳🇵</p>
            </div>
            <h2 className="font-serif text-3xl font-black text-gray-900 mb-5 leading-snug">
              Designed around the<br />Nepali student experience
            </h2>
            <p className="text-base text-gray-500 leading-relaxed mb-4">
              Most IELTS platforms are built for UK or Australian students. They assume international credit cards, fast internet, and expensive coaching centres. We don't.
            </p>
            <p className="text-base text-gray-500 leading-relaxed mb-6">
              IELTSPrep is built by Nepali people, for Nepali students — from Itahari to Kathmandu, Pokhara to Biratnagar — with eSewa & Khalti payments and pricing that reflects local realities.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Cities reached",  value: "60+"    },
                { label: "Avg. band gain",  value: "+1.2"   },
                { label: "Tests completed", value: "80k+"   },
                { label: "Free users",      value: "4,000+" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="font-serif text-2xl font-black text-[#CC0000]">{value}</div>
                  <div className="text-xs text-gray-500 font-semibold mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80"
              alt="Students in Nepal"
              className="rounded-2xl shadow-xl w-full h-64 sm:h-80 object-cover object-center"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-[#fff2f2] to-white py-16 sm:py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-6 h-[3px] rounded-full bg-[#CC0000]" />
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#CC0000]">Join Us</p>
            <span className="w-6 h-[3px] rounded-full bg-[#CC0000]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-gray-900 mb-4 leading-tight">
            Ready to reach your target band?
          </h2>
          <p className="text-base text-gray-500 leading-relaxed mb-8">
            Join 10,000+ Nepali students already practicing on IELTSPrep. It's free to start — no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-[#CC0000] text-white px-7 py-4 rounded-lg text-sm font-bold hover:bg-[#a80000] transition-colors duration-200"
            >
              Start Free Practice <ArrowRight size={15} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-200 px-7 py-4 rounded-lg text-sm font-medium hover:border-gray-300 transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  )

}