import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../pages/NavBar'
import Footer from '../components/Footer'
import { ArrowRight, CheckCircle, Clock, Star, Globe, Shield, Award, BarChart3 } from 'lucide-react'
import hu from '../assets/left.png'
import right from '../assets/right.png'
import target from '../assets/target1.png'
import { ReadingIcon, ListeningIcon, WritingIcon, SpeakingIcon } from '../components/ExamIcons'

const features = [
  { icon: ReadingIcon, title: 'Reading', color: '#002868', bg: '#eef2f7', desc: 'Full IELTS reading passages with T/F/NG, MCQ, match headings, fill-in-the-blank and all official question types.' },
  { icon: ListeningIcon, title: 'Listening', color: '#002868', bg: '#eef2f7', desc: 'Authentic audio-based practice with note completion, multiple choice, and map labelling tasks.' },
  { icon: WritingIcon, title: 'Writing', color: '#002868', bg: '#eef2f7', desc: 'AI-powered scoring across all 4 IELTS criteria — Task Achievement, Coherence, Lexical Resource, Grammar.' },
  { icon: SpeakingIcon, title: 'Speaking', color: '#002868', bg: '#eef2f7', desc: 'Record your response and receive AI band score with detailed fluency and pronunciation analysis.' },
  { icon: BarChart3, title: 'Analytics', color: '#002868', bg: '#eef2f7', desc: 'Track your progress with detailed band score analytics across all modules over time.' },
  { icon: Globe, title: 'CBT Interface', color: '#002868', bg: '#eef2f7', desc: 'Pixel-perfect simulation of the real computer-based IELTS interface used on exam day.' },
]

const stats = [
  { value: '10,000+', label: 'Students Enrolled' },
  { value: '95%', label: 'Score Improvement Rate' },
  { value: '40+', label: 'Full Practice Tests' },
  { value: '4.9★', label: 'Average Rating' },
]

const whyItems = [
  'Pay with eSewa or Khalti — no international cards needed',
  'Instant AI Writing feedback across all 4 IELTS criteria',
  'Full CBT interface matching the real IELTS computer-based test',
  'Vocabulary builder with word-starring across all passages',
  'Band score tracking and detailed progress analytics',
  'Official Cambridge-style question formats and timing',
]

const plans = [
  {
    name: 'Free',
    price: 'NPR 0',
    period: 'forever',
    badge: null,
    features: ['1 full practice tests', 'Reading & Listening only', 'Basic score report', 'Community access'],
    featured: false},
  {
    name: 'Premium',
    price: 'NPR 750',
    period: '/month',
    badge: 'Most Popular',
    features: ['All 20+ practice tests', 'AI Writing feedback', 'Full progress analytics', 'eSewa & Khalti payment', 'Email support'],
    featured: true},
  {
    name: 'Enterprise On Demand',
    price: null,
    period: '',
    badge: 'Best Value',
    features: ['Everything in Premium', 'Up to 10 premium sub-accounts', 'AI Speaking feedback', 'Unlimited submissions', 'Priority support', 'Predicted band score'],
    featured: false},
]

const testimonials = [
  { name: 'Sisan Baniya', score: '7.5', city: 'Kathmandu', text: "IELTSPrep's AI feedback was spot-on. My writing went from 6.0 to 7.5 in just 6 weeks!" },
  { name: 'Rohan Adhikari', score: '8.0', city: 'Pokhara', text: 'The CBT interface felt exactly like the real test. No surprises on exam day. Highly recommend.' },
  { name: 'Anita Thapa', score: '7.0', city: 'Biratnagar', text: 'Being able to pay with eSewa and get AI scoring was a game changer for me.' },
]

const cbtChecklist = [
  'Identical layout to official IELTS CBT',
  'Timed sections with auto-submit',
  'Highlight, annotate and flag questions',
  'Full keyboard navigation support',
  'Instant results and AI explanation',
]

const targetStats = [
  { label: 'Avg. improvement', value: '+1.2 bands' },
  { label: 'Within', value: '4 weeks' },
  { label: 'Students scored 7+', value: '68%' },
  { label: 'Satisfaction', value: '98%' },
]

export default function LandingPage() {
  const [typedText, setTypedText] = useState('')
  const [typingDone, setTypingDone] = useState(false)
  const [scoreVisible, setScoreVisible] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const fullText = `The bar chart illustrates the proportion of households living in owner-occupied and rented accommodation in England and Wales across four selected years between 1918 and 2011. Overall, there is a clear and sustained rise in home ownership, which eventually becomes the dominant form of housing tenure, while renting declines in parallel.

  In 1918, only 23% of households owned their homes, whereas the vast majority relied on rented accommodation, mainly in the private sector. By 1953, the figure for owner-occupation had increased modestly to 32%. This upward trend then accelerated significantly, reaching 58% in 1981, a pivotal point at which ownership overtook renting as the most common tenure type. The proportion continued to grow, peaking at around 69% in 2001. However, this pattern experienced a slight reversal, falling to 65% in 2011, marking the first decline in nearly a century.
  
  This long-term shift can largely be attributed to post-war government policies that promoted home ownership, particularly the introduction of right-to-buy schemes in the 1980s. Nonetheless, the minor decline in the final year may indicate increasing affordability challenges and rising property prices, which could be gradually reshaping housing trends.`

  const typingRef = useRef(null)
  const indexRef = useRef(0)
  const textBoxRef = useRef(null)

  useEffect(() => {
    const delay = setTimeout(() => {
      typingRef.current = setInterval(() => {
        if (indexRef.current < fullText.length) {
          indexRef.current++
          const next = fullText.slice(0, indexRef.current)
          setTypedText(next)
          if (textBoxRef.current) {
            textBoxRef.current.scrollTop = textBoxRef.current.scrollHeight
          }
        } else {
          clearInterval(typingRef.current)
          setTypingDone(true)
          setTimeout(() => setScoreVisible(true), 600)
        }
      }, 18)
    }, 800)
    return () => { clearTimeout(delay); clearInterval(typingRef.current) }
  }, [])

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen overflow-x-hidden">
      <Navbar />

      <section className="relative min-h-screen flex items-center overflow-hidden bg-red-50">
        <div className="absolute inset-0 bg-pattern pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-red-50/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-red-100/40 blur-3xl pointer-events-none" />
        <img
          src="https://imgs.search.brave.com/D24OAmWmagi-kQGunJe3DWOYRqYHMEjJp0NVWDA_bBk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDgv/NTA2LzM3OS9zbWFs/bC95b3VuZy1mZW1h/bGUtc3R1ZGVudC11/c2luZy1sYXB0b3At/aW4tY2xhc3Nyb29t/LXdpdGgtZ3JvdXAt/b2Ytc3R1ZGVudHMt/aW4tYmFja2dyb3Vu/ZC1waG90by5qcGc"
          alt="Student studying"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-red-50/35 to-red-100/5" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-700" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-icon mb-4 anim-fade-up">
              Nepal's #1 AI-Powered IELTS Practice Platform
            </p>
            <h1
              className="text-[clamp(1.75rem,8vw,3.5rem)] sm:text-5xl lg:text-6xl leading-tight font-bold text-gray-900 mb-5 tracking-tight break-words anim-fade-up delay-1"
              style={{ textShadow: '0 2px 0 rgba(255,255,255,0.82)' }}
            >
              Master{' '}
              <span style={{ fontFamily: '"Dancing Script", cursive', color: '#b30000', display: 'inline-block', transform: 'rotate(-2deg)', fontSize: '1.22em' }}>
                IELTS.
              </span>
              <br />
              <span style={{ color: '#b30000', textDecoration: 'underline', textDecorationThickness: '2px', textUnderlineOffset: '8px', textDecorationColor: 'rgba(204,0,0,0.35)' }}>
                Score Higher.
              </span>
              <br />
              Study{' '}
              <span style={{ fontFamily: '"Dancing Script", cursive', fontSize: '1.18em', display: 'inline-block', transform: 'rotate(-1deg)' }}>
                Smarter.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-500 leading-relaxed mb-9 max-w-md anim-fade-up delay-2">
              Nepal's most realistic computer-based IELTS practice platform — with instant AI scoring for Writing and Speaking. Pay with eSewa or Khalti.
            </p>
            <div className="flex gap-3 flex-wrap anim-fade-up delay-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-7 py-3.5 rounded-lg text-sm font-bold transition-all hover:-translate-y-0.5"
              >
                Start Free Practice <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white text-gray-900 border border-gray-200 px-7 py-3.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
            <div className="flex gap-6 mt-9 flex-wrap anim-fade-up delay-4">
              {[
                { icon: Clock, text: 'Free forever plan' },
                { icon: Shield, text: 'eSewa & Khalti' },
                { icon: Star, text: '4.9★ rated' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Icon size={14} color="#002147" /> {text}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block relative">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-2xl">
              <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
                <span className="ml-2 text-xs text-gray-400 font-mono">Writing Task 1</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <Clock size={12} color="#002147" />
                  <span className="text-xs font-bold font-mono text-red-700">58:42</span>
                </div>
              </div>
              <div className="p-5 pb-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">Task 1 — Academic</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
                  </p>
                  <div className="mt-3.5 bg-slate-50 rounded-md p-3 border border-gray-200">
                    {[['1918', 23], ['1953', 32], ['1981', 58], ['2011', 65]].map(([yr, pct]) => (
                      <div key={yr} className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-gray-400 w-7">{yr}</span>
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                          <div className="h-full bg-red-700 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-7">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">Your Response</p>
                  <div
                    ref={textBoxRef}
                    className="flex-1 bg-white rounded-md p-3 text-xs text-gray-900 leading-relaxed min-h-40 max-h-52 overflow-y-auto overflow-x-hidden scroll-smooth transition-all"
                    style={{ border: `1px solid ${typingDone ? '#CC0000' : 'rgba(204,0,0,0.35)'}` }}
                  >
                    {typedText}
                    <span
                      className="inline-block w-0.5 h-[1em] ml-px align-text-bottom"
                      style={{
                        background: typingDone ? 'transparent' : '#CC0000',
                        animation: !typingDone ? 'blink 0.7s step-end infinite' : 'none'}}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs transition-colors" style={{ color: typingDone ? '#CC0000' : '#aaa' }}>
                      Word count: {typedText.split(' ').filter(Boolean).length}
                    </span>
                    <span className="text-xs text-red-700">
                      {typingDone ? '✓ 150+ words' : '150+ words'}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="mx-4 mb-4 overflow-hidden transition-all duration-700"
                style={{ maxHeight: scoreVisible ? 200 : 0, opacity: scoreVisible ? 1 : 0 }}
              >
                <div className="bg-white border border-red-200 p-3.5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-700" />
                    <span className="text-xs text-gray-600 font-semibold uppercase tracking-widest">AI Scoring Complete</span>
                    <div className="ml-auto bg-red-700 text-white px-2.5 py-0.5 rounded-full text-xs font-black">Band 9</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Task Achievement', score: 9 },
                      { label: 'Coherence & Cohesion', score: 9 },
                      { label: 'Lexical Resource', score: 9 },
                      { label: 'Grammar Range', score: 9 },
                    ].map(({ label, score }) => (
                      <div key={label} className="bg-red-50 border border-red-100 rounded-md p-2 text-center">
                        <div className="text-lg font-black text-red-700 leading-none" >{score}</div>
                        <div className="text-gray-500 mt-1 leading-tight" style={{ fontSize: 9 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-red-700">
        <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 text-center">
          {stats.map(({ value, label }) => (
            <div key={label} className="py-4">
              <p className="text-2xl font-bold text-white" >{value}</p>
              <p className="text-xs text-red-200 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern pointer-events-none" />
        <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-red-50/30 blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-14 anim-fade-up">
            <p className="text-xs font-bold tracking-widest uppercase text-red-700 mb-2.5">What We Offer</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3" >
              Everything you need to ace IELTS
            </h2>
            <p className="text-base text-gray-500 leading-relaxed max-w-xl mx-auto">
              A complete, realistic computer-based IELTS platform built specifically for Nepali students.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, color, bg, desc }, i) => (
              <div
                key={title}
                className="p-7 border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-default anim-fade-up"
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <Icon size={18} color={color} className="mb-4" />
                <h3 className="text-base font-bold text-gray-900 mb-2" >{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-red-50/40 blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
          <div className="anim-fade-up">
            <p className="text-xs font-bold tracking-widest uppercase text-red-700 mb-2.5">Real CBT Experience</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 anim-fade-up delay-1" >
              Practice on an interface that feels like the real test
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-7 anim-fade-up delay-2">
              No surprises on exam day. Our CBT interface mirrors the official IELTS computer-based test — from the timer and navigation to the reading pane and answer input.
            </p>

            <div className="flex flex-col gap-3 anim-fade-up delay-3">
              {cbtChecklist.map(item => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2 bg-red-700 shrink-0 rounded-sm" />
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 mt-6 bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg text-sm font-bold transition-colors anim-fade-up delay-4"
            >
              Try a Free Test <ArrowRight size={15} />
            </Link>
          </div>

          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg anim-fade-up delay-2">
            <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
              <span className="ml-2 text-xs text-gray-400 font-mono">Reading — Passage 2 / 3</span>
              <div className="ml-auto text-xs text-red-700 font-bold font-mono">32:18</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="p-4 border-r border-gray-100 text-xs text-gray-500 leading-relaxed h-60 overflow-y-auto">
                <p className="mb-2"><strong className="text-gray-900">The Impact of Urbanisation</strong></p>
                <p>
                  Rapid urbanisation has fundamentally altered the structure of human societies across the globe.{' '}
                  <span className="bg-red-100 text-red-800 px-0.5 rounded-sm">Cities now house more than half of the world's population</span>,
                  a milestone reached in 2008 according to United Nations data...
                </p>
                <p className="mt-2">The consequences of this demographic shift are wide-ranging, affecting everything from economic productivity to environmental sustainability...</p>
              </div>
              <div className="p-4 bg-gray-50">
                <p className="text-xs text-gray-400 mb-3 uppercase tracking-widest font-semibold">Questions 14–18</p>
                {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt, i) => (
                  <div key={opt} className="mb-2.5">
                    <p className="text-xs text-gray-500 mb-1">Q{14 + i}. Cities hold over 50% of world population.</p>
                    <div className="flex gap-1.5">
                      {['TRUE', 'FALSE', 'NOT GIVEN'].map(o => (
                        <div
                          key={o}
                          className="px-2 py-0.5 rounded text-xs font-semibold cursor-pointer"
                          style={{
                            border: `1px solid ${o === opt && i === 0 ? '#CC0000' : '#e5e5e5'}`,
                            background: o === opt && i === 0 ? '#fff1f1' : '#fff',
                            color: o === opt && i === 0 ? '#CC0000' : '#999'}}
                        >
                          {o}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      
      <section className="py-20 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-red-50/30 blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
          <div className="anim-fade-up">
            <p className="text-xs font-bold tracking-widest uppercase text-red-700 mb-2.5">Why IELTSPrep?</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-7" >
              Built for Nepali IELTS candidates
            </h2>
            <div className="flex flex-col">
              {whyItems.map((text) => (
                <div key={text} className="flex items-center gap-4 py-3.5 border-b border-gray-100">
                  <div className="w-0.5 h-9 bg-red-700 shrink-0" />
                  <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-xl border border-red-100 relative overflow-hidden anim-fade-up delay-2">
            <img src={target} alt="target" className="w-10 h-10 mb-4 object-contain" />
            <h3 className="text-2xl font-bold mb-3" >Target Band 7.0+</h3>
            <p className="text-sm text-zinc-500 leading-relaxed mb-7">
              Students who practice consistently on IELTSPrep report an average band improvement of{' '}
              <strong className="text-gray-900">0.5–1.5 bands</strong> within just 4 weeks.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-7">
              {targetStats.map(({ label, value }) => (
                <div key={label} className="bg-white rounded-lg p-3 border border-red-50">
                  <p className="text-xs text-zinc-400 mb-1">{label}</p>
                  <p className="text-base font-bold text-gray-900" >{value}</p>
                </div>
              ))}
            </div>
            <Link
              to="/register"
              className="block bg-red-700 hover:bg-red-800 text-white py-3 rounded-lg text-sm font-bold text-center transition-colors"
            >
              Start Practicing Now
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-red-50/30 blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12 anim-fade-up">
            <p className="text-xs font-bold tracking-widest uppercase text-red-700 mb-2.5">Student Stories</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900" >
              What our students say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, score, city, text }, i) => (
              <div key={name} className="bg-white border border-gray-100 p-7 break-words anim-fade-up"
                   style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} color="#002147" fill="#002868" />)}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-5 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-sm font-bold text-red-700" >
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">{city} · Band {score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-red-50/30 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-12 anim-fade-up">
            <p className="text-xs font-bold tracking-widest uppercase text-red-700 mb-2.5">Simple Pricing</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2.5" >
              Affordable for every student
            </h2>
            <p className="text-sm text-gray-500">Pay with eSewa or Khalti. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(({ name, price, period, badge, features: pf, featured }, i) => (
              <div
                key={name}
                className="p-8 relative bg-white anim-fade-up"
                style={{ border: featured ? '2px solid #002868' : '1px solid #e5e5e5', animationDelay: `${0.1 + i * 0.08}s` }}
              >
                {badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-700 text-white px-4 py-0.5 rounded-full text-xs font-bold whitespace-nowrap">
                    {badge}
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2" >{name}</h3>
                <div className="mb-1">
                  {price ? (
                    <>
                      <span className="text-3xl font-bold" style={{ color: featured ? '#002868' : '#1a1a1a'}}>{price}</span>
                      <span className="text-sm text-gray-400 font-normal"> {period}</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-gray-500">Custom Pricing</span>
                  )}
                </div>
                <div className="h-px bg-gray-100 my-5" />
                <ul className="flex flex-col gap-2.5 mb-6">
                  {pf.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-500">
                      <CheckCircle size={15} color="#002147" /> {f}
                    </li>
                  ))}
                </ul>
                {name === 'Enterprise On Demand' ? (
                  <a
                    href="https://wa.me/9779815366153?text=Hi%2C%20I%27m%20interested%20in%20the%20Enterprise%20On%20Demand%20plan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    style={{ background: '#25D366', color: '#fff' }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Let's Discuss
                  </a>
                ) : (
                  <Link
                    to="/register"
                    className="block text-center py-3 rounded-lg text-sm font-bold transition-colors"
                    style={{
                      background: featured ? '#002868' : 'transparent',
                      color: featured ? '#fff' : '#002868',
                      border: featured ? 'none' : '1.5px solid #002868'}}
                  >
                    Get Started
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-red-50 py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-100/40 blur-3xl pointer-events-none" />
        <img
          src={hu}
          alt="Student left"
          className="absolute left-5 bottom-0 w-44 max-w-[20vw] opacity-90 pointer-events-none hidden sm:block"
        />
        <img
          src={right}
          alt="Student right"
          className="absolute right-5 bottom-0 w-44 max-w-[20vw] opacity-90 pointer-events-none hidden sm:block"
        />
        <div className="relative max-w-xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 anim-fade-up" >
            Ready to achieve your target band score?
          </h2>
          <p className="text-base text-zinc-500 mb-8 leading-relaxed anim-fade-up delay-1">
            Join 10,000+ Nepali students already practicing on IELTSPrep. Start free today.
          </p>
          <div className="flex gap-3 justify-center flex-wrap anim-fade-up delay-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-7 py-3.5 rounded-lg text-sm font-bold transition-colors"
            >
              Start Free Practice <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white text-gray-900 border border-gray-200 px-7 py-3.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={() => setShowVideo(true)}
              className="inline-flex items-center gap-2 bg-white text-red-700 border-2 border-red-200 px-7 py-3.5 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Watch Tutorial
            </button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowVideo(false)}>
          <div className="relative w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowVideo(false)} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <p className="text-sm font-medium">Video placeholder</p>
                <p className="text-xs mt-1">Replace with your YouTube embed URL</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
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
        .anim-fade-up   { animation: fadeUp 0.6s ease both; }
        .anim-fade-in   { animation: fadeIn 0.5s ease both; }
        .anim-scale-in  { animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .anim-slide-down { animation: slideDown 0.3s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .bg-pattern {
          background-image: radial-gradient(rgba(204,0,0,0.04) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        * { margin:0; padding:0; box-sizing:border-box; }
      `}</style>
    </div>
  )
}
