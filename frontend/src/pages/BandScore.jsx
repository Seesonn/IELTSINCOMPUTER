// import { useState } from 'react'
// import { Link } from 'react-router-dom'
// import Navbar from "../pages/NavBar"

// const tabs = ['Listening', 'Reading', 'Writing', 'Speaking']

// const listeningBands = [
//   { band: 5, marks: 16 }, { band: 6, marks: 23 },
//   { band: 7, marks: 30 }, { band: 8, marks: 35 },
// ]
// const readingAcademic = [
//   { band: 5, marks: 15 }, { band: 6, marks: 23 },
//   { band: 7, marks: 30 }, { band: 8, marks: 35 },
// ]
// const readingGeneral = [
//   { band: 5, marks: 15 }, { band: 6, marks: 23 },
//   { band: 7, marks: 34 }, { band: 8, marks: 38 },
// ]

// const BandCard = ({ band, marks, label }) => (
//   <div style={{
//     background: '#fff',
//     border: '1.5px solid #e8e8e8',
//     borderTop: '3px solid #CC0000',
//     borderRadius: 10,
//     padding: '18px 20px',
//   }}>
//     <div style={{ fontFamily: 'Merriweather, serif', fontSize: 28, fontWeight: 900, color: '#CC0000', lineHeight: 1, marginBottom: 4 }}>{band}</div>
//     <div style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>Band Score</div>
//     <div style={{ height: 1, background: '#f0f0f0', marginBottom: 10 }} />
//     <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{label} {marks}</div>
//     <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>marks out of 40</div>
//   </div>
// )

// const CriteriaItem = ({ text }) => (
//   <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', background: '#fff', border: '1.5px solid #e8e8e8', borderLeft: '3px solid #CC0000', borderRadius: 8, marginBottom: 8 }}>
//     <span style={{ fontSize: 14, color: '#1a1a1a', lineHeight: 1.6 }}>{text}</span>
//   </div>
// )

// const NoteBox = ({ label, children }) => (
//   <div style={{ background: '#fff1f1', border: '1px solid rgba(204,0,0,0.18)', borderLeft: '3px solid #CC0000', borderRadius: 8, padding: '14px 18px', fontSize: 13, color: '#555', lineHeight: 1.75, marginTop: 24 }}>
//     <strong style={{ color: '#CC0000' }}>{label}:</strong> {children}
//   </div>
// )

// const SectionLabel = ({ children }) => (
//   <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#CC0000', marginBottom: 8 }}>{children}</p>
// )

// const SectionTitle = ({ children, style = {} }) => (
//   <h3 style={{ fontFamily: 'Merriweather, serif', fontSize: 17, fontWeight: 900, color: '#1a1a1a', marginBottom: 14, ...style }}>{children}</h3>
// )

// const Desc = ({ children }) => (
//   <p style={{ fontSize: 14, color: '#444', lineHeight: 1.8, marginBottom: 14 }}>{children}</p>
// )

// export default function BandScorePage() {
//   const [active, setActive] = useState('Listening')

//   return (
//     <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: '#1a1a1a', background: '#fff', minHeight: '100vh' }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Source+Sans+3:wght@400;500;600;700&display=swap');

//         * { box-sizing: border-box; }

//         .bs-wrap {
//           font-family: 'Source Sans 3', sans-serif;
//           color: #1a1a1a;
//           max-width: 860px;
//           margin: 0 auto;
//           padding: 40px 24px;
//         }

//         .bs-tab {
//           padding: 12px 24px;
//           font-size: 14px;
//           font-weight: 700;
//           font-family: 'Source Sans 3', sans-serif;
//           cursor: pointer;
//           border: none;
//           background: none;
//           color: #999;
//           border-bottom: 2px solid transparent;
//           margin-bottom: -2px;
//           transition: color 0.18s, border-color 0.18s;
//           letter-spacing: 0.2px;
//           white-space: nowrap;
//           flex-shrink: 0;
//         }
//         .bs-tab.active { color: #CC0000; border-bottom-color: #CC0000; }
//         .bs-tab:hover:not(.active) { color: #1a1a1a; }

//         .bs-tabs-row {
//           display: flex;
//           border-bottom: 2px solid #e8e8e8;
//           margin-bottom: 0;
//           overflow-x: auto;
//           -webkit-overflow-scrolling: touch;
//           scrollbar-width: none;
//         }
//         .bs-tabs-row::-webkit-scrollbar { display: none; }

//         .bs-writing-card {
//           background: #fff;
//           border: 1.5px solid #e8e8e8;
//           border-top: 3px solid #CC0000;
//           border-radius: 10px;
//           padding: 20px;
//         }

//         .bs-speaking-card {
//           background: #fff;
//           border: 1.5px solid #e8e8e8;
//           border-radius: 10px;
//           padding: 16px 18px;
//           display: flex;
//           align-items: flex-start;
//           gap: 14px;
//           transition: border-color 0.18s;
//         }
//         .bs-speaking-card:hover { border-color: rgba(204,0,0,0.35); }

//         .bs-tab-panel {
//           background: #fff;
//           border: 1.5px solid #e8e8e8;
//           border-top: none;
//           border-radius: 0 0 14px 14px;
//           padding: 32px 32px 36px;
//         }

//         .bs-hero-card {
//           background: #0f172a;
//           border-radius: 14px;
//           padding: 32px 36px;
//           margin-bottom: 44px;
//           display: grid;
//           grid-template-columns: 1fr auto;
//           align-items: center;
//           gap: 32px;
//           position: relative;
//           overflow: hidden;
//           border-left: 4px solid #CC0000;
//         }

//         .bs-hero-score-num {
//           font-family: 'Merriweather', serif;
//           font-size: 56px;
//           font-weight: 900;
//           color: #CC0000;
//           line-height: 1;
//         }

//         .bs-band-grid {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 12px;
//         }

//         .bs-writing-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 16px;
//         }

//         .bs-speaking-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 12px;
//         }

//         .bs-page-title {
//           font-family: 'Merriweather', serif;
//           font-size: 34px;
//           font-weight: 900;
//           color: #1a1a1a;
//           line-height: 1.2;
//           margin-bottom: 12px;
//         }

//         /* ── TABLET ── */
//         @media (max-width: 700px) {
//           .bs-band-grid {
//             grid-template-columns: repeat(2, 1fr);
//           }
//           .bs-writing-grid {
//             grid-template-columns: 1fr;
//           }
//           .bs-speaking-grid {
//             grid-template-columns: 1fr;
//           }
//         }

//         /* ── MOBILE ── */
//         @media (max-width: 600px) {
//           .bs-wrap {
//             padding: 24px 16px;
//           }
//           .bs-tab {
//             padding: 10px 14px;
//             font-size: 13px;
//           }
//           .bs-tab-panel {
//             padding: 20px 16px 24px;
//           }
//           .bs-hero-card {
//             grid-template-columns: 1fr;
//             padding: 22px 18px;
//             gap: 16px;
//             margin-bottom: 28px;
//             border-radius: 10px;
//           }
//           .bs-hero-score-num {
//             font-size: 40px;
//           }
//           .bs-page-title {
//             font-size: 24px;
//           }
//           .bs-band-grid {
//             grid-template-columns: repeat(2, 1fr);
//             gap: 10px;
//           }
//         }
//       `}</style>

//       <Navbar />

//       <div className="bs-wrap">

//         {/* Page header */}
//         <div style={{ marginBottom: 40 }}>
//           <SectionLabel>IELTS Guide</SectionLabel>
//           <h1 className="bs-page-title">Section Band Scores</h1>
//           <p style={{ fontSize: 15, color: '#555', lineHeight: 1.75, maxWidth: 580 }}>
//             Understand how each section of the IELTS exam is scored, what examiners look for, and what marks you need to achieve your target band.
//           </p>
//         </div>

//         {/* Overall hero card */}
//         <div className="bs-hero-card">
//           <div style={{ position: 'absolute', right: -50, top: -50, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.91)' }} />
         
//           <div style={{ position: 'relative', zIndex: 1 }}>
//             <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(254, 243, 243, 0.78)', marginBottom: 10 }}>Overall Band Score</p>
//             <p style={{ fontFamily: 'Merriweather, serif', fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 10, lineHeight: 1.3 }}>Average of all four sections</p>
//             <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
//               Your overall band score is the mean of your Listening, Reading, Writing, and Speaking scores — rounded to the nearest whole or half band. Scores range from 1 (non-user) to 9 (expert user).
//             </p>
//           </div>
//           <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', flexShrink: 0 }}>
//             <div className="bs-hero-score-num">1–9</div>
//             <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(171, 25, 25, 0.59)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: 6 }}>Band Scale</div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bs-tabs-row">
//           {tabs.map(t => (
//             <button key={t} className={`bs-tab${active === t ? ' active' : ''}`} onClick={() => setActive(t)}>{t}</button>
//           ))}
//         </div>

//         {/* Tab panel */}
//         <div className="bs-tab-panel">

//           {/* ── LISTENING ── */}
//           {active === 'Listening' && (
//             <div>
//               <Desc>The IELTS Listening test contains 40 questions. Each correct answer is awarded 1 mark. Scores out of 40 are converted to the IELTS 9-band scale. Scores are reported in whole and half bands.</Desc>
//               <Desc>Here are the average number of marks scored at different levels of the IELTS scale in the Listening section. The precise number of marks needed to achieve these band scores will vary slightly from test version to test version.</Desc>
//               <div style={{ height: 1, background: '#f0f0f0', margin: '20px 0' }} />
//               <SectionLabel>Marks out of 40</SectionLabel>
//               <SectionTitle>Listening score benchmarks</SectionTitle>
//               <div className="bs-band-grid">
//                 {listeningBands.map(({ band, marks }) => (
//                   <BandCard key={band} band={band} marks={marks} label="Listening" />
//                 ))}
//               </div>
//               <NoteBox label="Note">The precise number of marks needed to achieve these band scores will vary slightly from test version to test version.</NoteBox>
//             </div>
//           )}

//           {/* ── READING ── */}
//           {active === 'Reading' && (
//             <div>
//               <Desc>The IELTS Reading test contains 40 questions. Each correct answer is awarded 1 mark. Scores out of 40 are converted to the IELTS 9-band scale. Scores are reported in whole and half bands.</Desc>
//               <Desc>The IELTS Academic and General Training Reading tests are graded on the same scale. The Academic Reading test may contain texts which feature more difficult vocabulary or greater complexity of style. It is usual that a greater number of questions must be answered correctly on a General Training Reading test to secure a given band score.</Desc>
//               <Desc>Here are the average number of marks scored at different levels of the IELTS scale in Academic Reading, and General Training Reading sections.</Desc>
//               <div style={{ height: 1, background: '#f0f0f0', margin: '20px 0' }} />
//               <SectionLabel>Marks out of 40 — Academic</SectionLabel>
//               <SectionTitle>Academic reading benchmarks</SectionTitle>
//               <div className="bs-band-grid" style={{ marginBottom: 32 }}>
//                 {readingAcademic.map(({ band, marks }) => (
//                   <BandCard key={band} band={band} marks={marks} label="Reading" />
//                 ))}
//               </div>
//               <SectionLabel>Marks out of 40 — General Training</SectionLabel>
//               <SectionTitle>General Training reading benchmarks</SectionTitle>
//               <div className="bs-band-grid">
//                 {readingGeneral.map(({ band, marks }) => (
//                   <BandCard key={band} band={band} marks={marks} label="Reading" />
//                 ))}
//               </div>
//               <NoteBox label="Note">The precise number of marks needed to achieve these band scores will vary slightly from test version to test version.</NoteBox>
//             </div>
//           )}

//           {/* ── WRITING ── */}
//           {active === 'Writing' && (
//             <div>
//               <Desc>Examiners use assessment criteria to award a score for each of the following four criteria:</Desc>
//               <div style={{ marginBottom: 20 }}>
//                 {['Task achievement (for task 1) and task response (for task 2)', 'Coherence and cohesion', 'Lexical resource', 'Grammatical range and accuracy'].map(item => (
//                   <CriteriaItem key={item} text={item} />
//                 ))}
//               </div>
//               <Desc>Each task is assessed independently. The criteria are weighted equally and the score on the task is the average. The assessment of Task 2 carries more weight in marking than Task 1.</Desc>
//               <div style={{ height: 1, background: '#f0f0f0', margin: '20px 0' }} />
//               <div className="bs-writing-grid">
//                 {[
//                   {
//                     title: 'Task 1 — Academic',
//                     sub: 'Min. 150 words',
//                     items: ['Accurately describe and summarise visual data', 'Select and report the main features', 'Make relevant comparisons where appropriate'],
//                   },
//                   {
//                     title: 'Task 2 — Essay',
//                     sub: 'Min. 250 words · Carries more weight',
//                     items: ['Present a well-developed argument or position', 'Support main ideas with evidence and examples', 'Consider opposing views and respond to them'],
//                   },
//                 ].map(({ title, sub, items }) => (
//                   <div key={title} className="bs-writing-card">
//                     <p style={{ fontFamily: 'Merriweather, serif', fontSize: 15, fontWeight: 900, color: '#1a1a1a', marginBottom: 4 }}>{title}</p>
//                     <p style={{ fontSize: 11, fontWeight: 700, color: '#CC0000', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>{sub}</p>
//                     {items.map(i => (
//                       <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
//                         <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#CC0000', flexShrink: 0, marginTop: 7 }} />
//                         <span style={{ fontSize: 13, color: '#444', lineHeight: 1.65 }}>{i}</span>
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//               <NoteBox label="Important">Task 2 carries more weight than Task 1 in the final Writing band score calculation.</NoteBox>
//             </div>
//           )}

//           {/* ── SPEAKING ── */}
//           {active === 'Speaking' && (
//             <div>
//               <Desc>Examiners use assessment criteria to award a score for each of the following four areas:</Desc>
//               <div style={{ marginBottom: 20 }}>
//                 {['Fluency and coherence', 'Lexical resource', 'Grammatical range and accuracy', 'Pronunciation'].map(item => (
//                   <CriteriaItem key={item} text={item} />
//                 ))}
//               </div>
//               <Desc>The Speaking test is a face-to-face interview with a certified IELTS examiner, lasting 11–14 minutes. It consists of three parts: an introduction and interview, a long turn (individual task), and a two-way discussion.</Desc>
//               <div style={{ height: 1, background: '#f0f0f0', margin: '20px 0' }} />
//               <SectionLabel>Criteria breakdown</SectionLabel>
//               <SectionTitle>What each criterion assesses</SectionTitle>
//               <div className="bs-speaking-grid">
//                 {[
//                   { title: 'Fluency & Coherence', desc: 'Ability to speak at length without noticeable effort, use of cohesive devices, and logical sequencing of ideas.' },
//                   { title: 'Lexical Resource', desc: 'Range, accuracy, and appropriacy of vocabulary. Ability to paraphrase effectively when needed.' },
//                   { title: 'Grammatical Range & Accuracy', desc: 'Variety and accuracy of grammatical structures. Both simple and complex sentences used effectively.' },
//                   { title: 'Pronunciation', desc: 'Clarity of speech, use of features of connected speech, intonation, stress patterns, and intelligibility.' },
//                 ].map(({ title, desc }) => (
//                   <div key={title} className="bs-speaking-card">
//                     <div style={{ width: 38, height: 38, background: '#fff1f1', border: '1.5px solid rgba(204,0,0,0.2)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                       <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2.5px solid #CC0000' }} />
//                     </div>
//                     <div>
//                       <p style={{ fontFamily: 'Merriweather, serif', fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 5 }}>{title}</p>
//                       <p style={{ fontSize: 12, color: '#666', lineHeight: 1.65 }}>{desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <NoteBox label="Tip">The Speaking test is identical for both Academic and General Training IELTS. Practice speaking at length on unfamiliar topics to build fluency and coherence.</NoteBox>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   )
// }

import { useState } from 'react'
import Navbar from "../pages/NavBar"
import Footer from "../components/Footer"

const tabs = ['Listening', 'Reading', 'Writing', 'Speaking']

const listeningBands = [
  { band: 5, marks: 16 }, { band: 6, marks: 23 },
  { band: 7, marks: 30 }, { band: 8, marks: 35 },
]
const readingAcademic = [
  { band: 5, marks: 15 }, { band: 6, marks: 23 },
  { band: 7, marks: 30 }, { band: 8, marks: 35 },
]
const readingGeneral = [
  { band: 5, marks: 15 }, { band: 6, marks: 23 },
  { band: 7, marks: 34 }, { band: 8, marks: 38 },
]

const BandCard = ({ band, marks, label }) => (
  <div className="bg-white border border-gray-100 border-t-[3px] border-t-[#CC0000] rounded-xl p-4 sm:p-5
    hover:border-red-100 hover:shadow-[0_4px_16px_rgba(204,0,0,0.06)] transition-all duration-300">
    <div className="font-serif text-3xl font-black text-[#CC0000] leading-none mb-1">{band}</div>
    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Band Score</div>
    <div className="h-px bg-gray-100 mb-3" />
    <div className="text-sm font-semibold text-gray-900">{label} {marks}</div>
    <div className="text-xs text-gray-400 mt-1">marks out of 40</div>
  </div>
)

const CriteriaItem = ({ text }) => (
  <div className="flex items-start gap-3.5 px-4 py-3.5 bg-white border border-gray-100 rounded-xl mb-2.5 hover:border-red-100 hover:shadow-[0_2px_12px_rgba(204,0,0,0.04)] transition-all duration-200">
    <div className="w-1.5 h-1.5 rounded-full bg-[#CC0000] shrink-0 mt-1.5" />
    <span className="text-sm text-gray-600 leading-relaxed">{text}</span>
  </div>
)

const NoteBox = ({ label, children }) => (
  <div className="bg-gradient-to-br from-red-50 to-orange-50/60 border border-red-100/70 border-l-[3px] border-l-[#CC0000] rounded-xl px-5 py-4 text-sm text-gray-500 leading-relaxed mt-6">
    <strong className="text-[#CC0000]">{label}:</strong> {children}
  </div>
)

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 mb-3">
    <span className="w-6 h-[3px] rounded-full bg-[#CC0000]" />
    <p className="text-[11px] font-bold tracking-[1.8px] uppercase text-[#CC0000]">{children}</p>
  </div>
)

const SectionTitle = ({ children }) => (
  <h3 className="font-serif text-lg font-black text-gray-900 mb-4 leading-snug">{children}</h3>
)

const Desc = ({ children }) => (
  <p className="text-sm text-gray-600 leading-relaxed mb-4">{children}</p>
)

export default function BandScorePage() {
  const [active, setActive] = useState('Listening')

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Quicksand', serif !important; }
        .font-sans { font-family: 'Quicksand', sans-serif !important; }

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-28 sm:pb-36">

        {/* Hero */}
        <section className="relative overflow-hidden mb-10">
          <div className="absolute inset-0 bg-pattern pointer-events-none" />
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-red-50/60 blur-3xl pointer-events-none" />

          <div className="relative anim-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[3px] rounded-full bg-[#CC0000]" />
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#CC0000]">IELTS Guide</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-3">
              Section Band Scores
            </h1>
            <p className="text-base text-gray-400 leading-relaxed max-w-xl">
              Understand how each section of the IELTS exam is scored, what examiners look for, and what marks you need to achieve your target band.
            </p>
          </div>
        </section>

        {/* Overall hero card */}
        <div className="anim-fade-up delay-1 bg-white border border-gray-200/80 rounded-2xl px-6 sm:px-9 py-8 mb-10 grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-6 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-shadow duration-300">
          {/* decorative circles */}


          <div className="relative z-10">
            <p className="text-[10px] font-bold tracking-[2px] uppercase text-gray-400 mb-3">Overall Band Score</p>
            <p className="font-serif text-xl sm:text-2xl font-black text-gray-900 mb-3 leading-snug">
              Average of all four sections
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your overall band score is the mean of your Listening, Reading, Writing, and Speaking scores — rounded to the nearest whole or half band. Scores range from 1 (non-user) to 9 (expert user).
            </p>
          </div>

          <div className="relative z-10 text-center flex-shrink-0">
            <div className="font-serif text-5xl sm:text-6xl font-black text-[#CC0000] leading-none">1–9</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Band Scale</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="anim-fade-up delay-1 flex border-b-2 border-gray-200 mb-0 overflow-x-auto scrollbar-none -webkit-overflow-scrolling-touch">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-5 sm:px-6 py-3 text-sm font-bold shrink-0 border-b-2 -mb-0.5 transition-colors duration-150 whitespace-nowrap
                ${active === t
                  ? 'text-[#CC0000] border-[#CC0000]'
                  : 'text-gray-400 border-transparent hover:text-gray-800'
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab panel */}
        <div className="anim-fade-up delay-2 bg-white border border-gray-200 border-t-0 rounded-b-2xl px-4 sm:px-8 py-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)]">

          {/* ── LISTENING ── */}
          {active === 'Listening' && (
            <div>
              <Desc>The IELTS Listening test contains 40 questions. Each correct answer is awarded 1 mark. Scores out of 40 are converted to the IELTS 9-band scale. Scores are reported in whole and half bands.</Desc>
              <Desc>Here are the average number of marks scored at different levels of the IELTS scale in the Listening section. The precise number of marks needed to achieve these band scores will vary slightly from test version to test version.</Desc>
              <div className="h-px bg-gray-100 my-5" />
              <SectionLabel>Marks out of 40</SectionLabel>
              <SectionTitle>Listening score benchmarks</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {listeningBands.map(({ band, marks }) => (
                  <BandCard key={band} band={band} marks={marks} label="Listening" />
                ))}
              </div>
              <NoteBox label="Note">The precise number of marks needed to achieve these band scores will vary slightly from test version to test version.</NoteBox>
            </div>
          )}

          {/* ── READING ── */}
          {active === 'Reading' && (
            <div>
              <Desc>The IELTS Reading test contains 40 questions. Each correct answer is awarded 1 mark. Scores out of 40 are converted to the IELTS 9-band scale. Scores are reported in whole and half bands.</Desc>
              <Desc>The IELTS Academic and General Training Reading tests are graded on the same scale. The Academic Reading test may contain texts which feature more difficult vocabulary or greater complexity of style. It is usual that a greater number of questions must be answered correctly on a General Training Reading test to secure a given band score.</Desc>
              <Desc>Here are the average number of marks scored at different levels of the IELTS scale in Academic Reading, and General Training Reading sections.</Desc>
              <div className="h-px bg-gray-100 my-5" />
              <SectionLabel>Marks out of 40 — Academic</SectionLabel>
              <SectionTitle>Academic reading benchmarks</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {readingAcademic.map(({ band, marks }) => (
                  <BandCard key={band} band={band} marks={marks} label="Reading" />
                ))}
              </div>
              <SectionLabel>Marks out of 40 — General Training</SectionLabel>
              <SectionTitle>General Training reading benchmarks</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {readingGeneral.map(({ band, marks }) => (
                  <BandCard key={band} band={band} marks={marks} label="Reading" />
                ))}
              </div>
              <NoteBox label="Note">The precise number of marks needed to achieve these band scores will vary slightly from test version to test version.</NoteBox>
            </div>
          )}

          {/* ── WRITING ── */}
          {active === 'Writing' && (
            <div>
              <Desc>Examiners use assessment criteria to award a score for each of the following four criteria:</Desc>
              <div className="mb-5">
                {['Task achievement (for task 1) and task response (for task 2)', 'Coherence and cohesion', 'Lexical resource', 'Grammatical range and accuracy'].map(item => (
                  <CriteriaItem key={item} text={item} />
                ))}
              </div>
              <Desc>Each task is assessed independently. The criteria are weighted equally and the score on the task is the average. The assessment of Task 2 carries more weight in marking than Task 1.</Desc>
              <div className="h-px bg-gray-100 my-5" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Task 1 — Academic',
                    sub: 'Min. 150 words',
                    items: ['Accurately describe and summarise visual data', 'Select and report the main features', 'Make relevant comparisons where appropriate'],
                  },
                  {
                    title: 'Task 2 — Essay',
                    sub: 'Min. 250 words · Carries more weight',
                    items: ['Present a well-developed argument or position', 'Support main ideas with evidence and examples', 'Consider opposing views and respond to them'],
                  },
                ].map(({ title, sub, items }) => (
                  <div key={title} className="bg-white border border-gray-100 border-t-[3px] border-t-[#CC0000] rounded-xl p-5 hover:border-red-100 hover:shadow-[0_4px_20px_rgba(204,0,0,0.04)] transition-all duration-300">
                    <p className="font-serif text-base font-black text-gray-900 mb-1">{title}</p>
                    <p className="text-[11px] font-bold text-[#CC0000] uppercase tracking-wide mb-4">{sub}</p>
                    {items.map(i => (
                      <div key={i} className="flex items-start gap-2.5 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#CC0000] shrink-0 mt-2" />
                        <span className="text-sm text-gray-600 leading-relaxed">{i}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <NoteBox label="Important">Task 2 carries more weight than Task 1 in the final Writing band score calculation.</NoteBox>
            </div>
          )}

          {/* ── SPEAKING ── */}
          {active === 'Speaking' && (
            <div>
              <Desc>Examiners use assessment criteria to award a score for each of the following four areas:</Desc>
              <div className="mb-5">
                {['Fluency and coherence', 'Lexical resource', 'Grammatical range and accuracy', 'Pronunciation'].map(item => (
                  <CriteriaItem key={item} text={item} />
                ))}
              </div>
              <Desc>The Speaking test is a face-to-face interview with a certified IELTS examiner, lasting 11–14 minutes. It consists of three parts: an introduction and interview, a long turn (individual task), and a two-way discussion.</Desc>
              <div className="h-px bg-gray-100 my-5" />
              <SectionLabel>Criteria breakdown</SectionLabel>
              <SectionTitle>What each criterion assesses</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Fluency & Coherence', desc: 'Ability to speak at length without noticeable effort, use of cohesive devices, and logical sequencing of ideas.' },
                  { title: 'Lexical Resource', desc: 'Range, accuracy, and appropriacy of vocabulary. Ability to paraphrase effectively when needed.' },
                  { title: 'Grammatical Range & Accuracy', desc: 'Variety and accuracy of grammatical structures. Both simple and complex sentences used effectively.' },
                  { title: 'Pronunciation', desc: 'Clarity of speech, use of features of connected speech, intonation, stress patterns, and intelligibility.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-4 hover:border-red-100 hover:shadow-[0_4px_16px_rgba(204,0,0,0.04)] transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-50 to-red-100/60 border border-red-100 flex items-center justify-center shrink-0">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[#CC0000]" />
                    </div>
                    <div>
                      <p className="font-serif text-sm font-bold text-gray-900 mb-1.5">{title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <NoteBox label="Tip">The Speaking test is identical for both Academic and General Training IELTS. Practice speaking at length on unfamiliar topics to build fluency and coherence.</NoteBox>
            </div>
          )}

        </div>
      </div>

      <Footer />

    </div>
  )
}