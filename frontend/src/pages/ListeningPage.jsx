import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { testsApi, sessionsApi } from '../utils/api'
import { mockTestProgress } from '../utils/mockTestProgress'
import { useTimer } from '../hooks/useTimer'
import { LoadingScreen, StartOverlay } from '../components/ui'
import toast from 'react-hot-toast'
import {
  Volume2, VolumeX, Play, Pause,
} from 'lucide-react'
import { calculateListeningBand } from '../utils/helpers'
import { ListeningIcon } from '../components/ExamIcons'
import huLogo from '../assets/hu.png'

const fmt = (s) => {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

function AnswerBox({ qNum, value, onChange, width = 150 }) {
  const [focused, setFocused] = useState(false)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', margin: '0 2px' }}>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: Math.min(width, window.innerWidth < 640 ? 90 : width),
          fontFamily: 'Arial, sans-serif',
          fontSize: 15,
          fontWeight: 600,
          color: '#000',
          border: focused ? '2px solid #c8102e' : '1px solid #999',
          borderRadius: 3,
          padding: '0px 8px',
          outline: 'none',
          textAlign: 'center',
          background: '#fff',
        }}
        placeholder={String(qNum)}
        autoComplete="off"
        spellCheck={false}
      />
    </span>
  )
}

/* ═══════════════════════════════════════════════════
   PARSE INLINE TEMPLATE with {N} tokens
═══════════════════════════════════════════════════ */
function InlineTemplate({ template, qMap, answers, onAnswer, widths = {} }) {
  if (!template) return null
  const lines = template.split('\n')
  return (
    <>
      {lines.map((line, li) => {
        if (line.trim() === '') return <div key={li} className="h-2" />
        const isBold = line.startsWith('**') && line.endsWith('**')
        const isHeader = line.startsWith('# ')
        const isSub = line.startsWith('## ')
        const clean = line.replace(/^\*\*|\*\*$/g, '').replace(/^#{1,2}\s*/, '')
        const parts = clean.split(/(\{\d+\})/)

        const rendered = parts.map((part, pi) => {
          const m = part.match(/^\{(\d+)\}$/)
          if (m) {
            const n = parseInt(m[1])
            const q = qMap[n]
            if (!q) return <span key={pi} className="inline-block w-24 border-b-2 border-black mx-0.5" />
            return (
              <AnswerBox
                key={pi} qNum={n}
                value={answers[q.id] || ''}
                onChange={v => onAnswer(q.id, v)}
                width={widths[n] || 150}
              />
            )
          }
          return <span key={pi}>{part}</span>
        })

        const baseS = { fontFamily: 'Open Sans, sans-serif', fontSize: 14, lineHeight: 2.4 }
        if (isHeader) return <p key={li} className="font-bold text-black mt-4 mb-1" style={{ ...baseS, fontSize: 15 }}>{rendered}</p>
        if (isSub) return <p key={li} className="font-bold text-black mt-3 mb-0.5" style={{ ...baseS, fontSize: 14 }}>{rendered}</p>
        if (isBold) return <p key={li} className="font-bold text-black mt-3 mb-0.5" style={baseS}>{rendered}</p>
        return <p key={li} className="text-black" style={baseS}>{rendered}</p>
      })}
    </>
  )
}

/* ═══════════════════════════════════════════════════
   NOTE / FORM / SUMMARY COMPLETION
   blanks INLINE where {N} tokens appear
═══════════════════════════════════════════════════ */
function NoteForm({ group, answers, onAnswer }) {
  const extra = group.extra_data || {}
  const questions = [...group.questions].sort((a, b) => a.question_number - b.question_number)
  const qMap = {}
  questions.forEach(q => { qMap[q.question_number] = q })

  if (extra.form_template) {
    return (
      <div>
        {extra.form_title && (
          <p className="font-bold text-center text-black mb-2 uppercase tracking-widest"
            style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, letterSpacing: '0.15em' }}>
            {extra.form_title}
          </p>
        )}
        {extra.form_subtitle && (
          <p className="font-bold text-center text-black mb-4" style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13 }}>
            {extra.form_subtitle}
          </p>
        )}
        <InlineTemplate template={extra.form_template} qMap={qMap} answers={answers} onAnswer={onAnswer} widths={extra.box_widths || {}} />
      </div>
    )
  }

  if (extra.sections?.length) {
    return (
      <div>
        {extra.form_title && (
          <p className="font-bold text-black uppercase tracking-widest text-center mb-3" style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, letterSpacing: '0.15em' }}>
            {extra.form_title}
          </p>
        )}
        {extra.sections.map((sec, si) => (
          <div key={si} className="mb-4 last:mb-0">
{sec.heading && (
  <p className="font-bold text-black mb-2" style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14, letterSpacing: '0.1em' }}>
    {sec.heading}
  </p>
)}
            {(sec.items || []).map((item, ii) => {
              const q = qMap[item.qNum]
              return (
                <p key={ii} className="text-black" style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14, lineHeight: 2.4 }}>
                  {item.label && <span>{item.label} </span>}
                  {q ? (
                    <AnswerBox qNum={item.qNum} value={answers[q.id] || ''} onChange={v => onAnswer(q.id, v)} width={item.width || 150} />
                  ) : null}
                  {item.suffix && <span> {item.suffix}</span>}
                </p>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {extra.note_title && (
        <p className="font-bold uppercase tracking-widest text-black text-center mb-3" style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, letterSpacing: '0.15em' }}>
          {extra.note_title}
        </p>
      )}
      {questions.map((q) => {
        const hasMarker = q.prompt?.includes('___') || q.prompt?.includes('{blank}')
        if (hasMarker) {
          const sep = q.prompt.includes('___') ? '___' : '{blank}'
          const parts = q.prompt.split(sep)
          return (
            <p key={q.id} id={`q-${q.id}`} className="text-black scroll-mt-4" style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14, lineHeight: 2.4 }}>
              {parts.map((part, pi) => (
                <span key={pi}>
                  {part}
                  {pi < parts.length - 1 && (
                    <AnswerBox qNum={q.question_number} value={answers[q.id] || ''} onChange={v => onAnswer(q.id, v)} width={extra.box_widths?.[q.question_number] || 150} />
                  )}
                </span>
              ))}
            </p>
          )
        }
        const txt = q.prompt || ''
        return (
          <p key={q.id} id={`q-${q.id}`} className="text-black scroll-mt-4" style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14, lineHeight: 2.4 }}>
            {txt}
            {txt && !txt.endsWith(':') && !txt.endsWith('.') ? ' ' : ''}
            <AnswerBox qNum={q.question_number} value={answers[q.id] || ''} onChange={v => onAnswer(q.id, v)} width={extra.box_widths?.[q.question_number] || 150} />
            {extra.suffixes?.[q.question_number] && <span> {extra.suffixes[q.question_number]}</span>}
          </p>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   TABLE COMPLETION
═══════════════════════════════════════════════════ */
function TableForm({ group, answers, onAnswer }) {
  const extra = group.extra_data || {}
  const questions = [...group.questions].sort((a, b) => a.question_number - b.question_number)
  const qMap = {}
  questions.forEach(q => { qMap[q.question_number] = q })

  if (!extra.table_headers) return <NoteForm group={group} answers={answers} onAnswer={onAnswer} />

  const resolveCell = (cell) => {
    const parts = String(cell).split(/(\{\d+\})/)
    if (parts.length === 1) return <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 14 }}>{cell}</span>
    return parts.map((part, pi) => {
      const m = part.match(/^\{(\d+)\}$/)
      if (!m) return part ? <span key={pi} style={{ fontFamily: 'Arial, sans-serif', fontSize: 14 }}>{part}</span> : null
      const n = parseInt(m[1])
      const q = qMap[n]
      if (!q) return <span key={pi} className="text-black">[{n}]</span>
      return <AnswerBox key={pi} qNum={n} value={answers[q.id] || ''} onChange={v => onAnswer(q.id, v)} width={extra.box_widths?.[n] || 120} />
    })
  }

  return (
    <div className="overflow-x-auto">
      {extra.form_title && (
        <p className="font-bold uppercase text-black text-center mb-3" style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, letterSpacing: '0.15em' }}>
          {extra.form_title}
        </p>
      )}
      <table className="w-full border-collapse" style={{ fontFamily: 'Arial, sans-serif', fontSize: 14 }}>
        <thead>
          <tr>
            {extra.table_headers.map((h, i) => (
              <th key={i} className="border border-black px-3 py-2 bg-white text-left font-bold text-black">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(extra.table_rows || []).map((row, ri) => (
            <tr key={ri} className="bg-white">
              {row.map((cell, ci) => (
                <td key={ci} className="border border-black px-3 py-2">{resolveCell(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   FLOW CHART
═══════════════════════════════════════════════════ */
function FlowChartForm({ group, answers, onAnswer }) {
  const extra = group.extra_data || {}
  const questions = [...group.questions].sort((a, b) => a.question_number - b.question_number)
  const qMap = {}
  questions.forEach(q => { qMap[q.question_number] = q })
  const categories = extra.categories || {}
  const opts = Object.entries(categories).map(([k, v]) => ({ key: k, val: v }))
  const hasOptions = opts.length > 0

  if (!extra.steps) return <NoteForm group={group} answers={answers} onAnswer={onAnswer} />

  if (hasOptions) {
    const usedKeys = new Set(Object.values(answers))
    const available = opts.filter(o => !usedKeys.has(o.key))
    const handleDrop = (qId, e) => {
      e.preventDefault()
      const k = e.dataTransfer.getData('text/plain')
      const prevQ = questions.find(x => x.id !== qId && answers[x.id] === k)
      if (prevQ) onAnswer(prevQ.id, '')
      onAnswer(qId, k)
    }
    const renderStep = (step, i) => {
      const parts = step.split(/(\{\d+\})/)
      return (
        <div key={i} className="border bg-white px-5 py-2 text-center w-full max-w-sm mx-auto"
          style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14, borderColor: '#000' }}>
          {parts.map((p, pi) => {
            const m = p.match(/^\{(\d+)\}$/)
            if (!m) return <span key={pi}>{p}</span>
            const n = parseInt(m[1])
            const q = qMap[n]
            if (!q) return <span key={pi} className="text-black">[{n}]</span>
            const sel = answers[q.id] || ''
            const selOpt = opts.find(o => o.key === sel)
            return (
              <span key={pi} style={{ display: 'inline-flex', margin: '0 4px' }}>
                <div draggable={!!sel}
                  onDragStart={e => { if (sel) { e.dataTransfer.setData('text/plain', sel); e.dataTransfer.effectAllowed = 'move' } }}
                  onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
                  onDrop={e => handleDrop(q.id, e)}
                  onClick={() => { if (sel) onAnswer(q.id, '') }}
                  style={{
                    padding: '2px 8px',
                    border: sel ? '2px solid #c8102e' : '1px dashed #aaa',
                    borderRadius: 3, background: '#fff', fontSize: 13,
                    fontWeight: sel ? 700 : 500, color: sel ? '#c8102e' : '#555',
                    cursor: sel ? 'grab' : 'default', userSelect: sel ? 'none' : 'auto',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 80, transition: 'all 0.15s'
                  }}>
                  {selOpt
                    ? <span><span style={{ fontWeight: 700 }}>{selOpt.key}.</span> {selOpt.val}</span>
                    : <span style={{ color: '#999', fontSize: 12 }}>{n}</span>}
                </div>
              </span>
            )
          })}
        </div>
      )
    }
    return (
      <div>
        {extra.chart_title && (
          <p className="font-bold uppercase text-black text-center mb-3" style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, letterSpacing: '0.15em' }}>
            {extra.chart_title}
          </p>
        )}
        <div className="flex flex-col items-center gap-0">
          {extra.steps.map((step, i) => {
            if (step === '↓' || step === '→' || step === '↑' || step === '←') {
              return <div key={i} className="text-black text-2xl leading-tight select-none">{step}</div>
            }
            return renderStep(step, i)
          })}
        </div>
        {opts.length > 0 && (
          <div style={{ marginTop: 16, borderTop: '1px solid #ddd', paddingTop: 12 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#333', marginBottom: 8, textAlign: 'center' }}>Options</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
              {available.map(o => (
                <div key={o.key} draggable
                  onDragStart={e => { e.dataTransfer.setData('text/plain', o.key); e.dataTransfer.effectAllowed = 'move' }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                    border: '1px solid #999', borderRadius: 4, background: '#fff',
                    fontSize: 13, lineHeight: 1.5, cursor: 'grab', userSelect: 'none'
                  }}>
                  <span style={{ fontWeight: 700, flexShrink: 0 }}>{o.key}.</span>
                  <span>{o.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderStep = (step, i) => {
    const parts = step.split(/(\{\d+\})/)
    return (
      <div key={i}
        className="border bg-white px-5 py-2 text-center w-full max-w-sm mx-auto"
        style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14, borderColor: '#000' }}>
        {parts.map((p, pi) => {
          const m = p.match(/^\{(\d+)\}$/)
          if (!m) return <span key={pi}>{p}</span>
          const n = parseInt(m[1])
          const q = qMap[n]
          if (!q) return <span key={pi} className="text-black">[{n}]</span>
          return <AnswerBox key={pi} qNum={n} value={answers[q.id] || ''} onChange={v => onAnswer(q.id, v)} width={110} />
        })}
      </div>
    )
  }

  return (
    <div>
      {extra.chart_title && (
        <p className="font-bold uppercase text-black text-center mb-3" style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, letterSpacing: '0.15em' }}>
          {extra.chart_title}
        </p>
      )}
      <div className="flex flex-col items-center gap-0">
        {extra.steps.map((step, i) => {
          if (step === '↓' || step === '→' || step === '↑' || step === '←') {
            return <div key={i} className="text-black text-2xl leading-tight select-none">{step}</div>
          }
          return renderStep(step, i)
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MULTIPLE CHOICE
═══════════════════════════════════════════════════ */
function MCQForm({ group, answers, onAnswer }) {
  const extra = group.extra_data || {}
  const questions = [...group.questions].sort((a, b) => a.question_number - b.question_number)
  return (
    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14 }} className="space-y-6">
      {questions.map(q => {
        const opts = extra[String(q.question_number)]?.options || {}
        const ans = answers[q.id] || ''
        return (
          <div key={q.id} id={`q-${q.id}`} className="scroll-mt-4">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#000', flexShrink: 0, lineHeight: 1.6 }}>{q.question_number}</span>
              <span style={{ fontSize: 15, lineHeight: 1.6 }}>{q.prompt}</span>
            </div>
            <div style={{ marginLeft: 28, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(opts).map(([letter, text]) => (
                <label key={letter} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 14,
                  background: ans === letter ? '#c8102e' : 'transparent',
                  padding: '4px 8px', borderRadius: 4,
                  color: ans === letter ? '#fff' : '#000',
                }}>
                  <input type="radio" name={q.id} value={letter}
                    checked={ans === letter}
                    onChange={() => onAnswer(q.id, ans === letter ? '' : letter)}
                    style={{ marginTop: 2, accentColor: '#fff', width: 15, height: 15 }} />
                  <strong style={{ marginRight: 4 }}>{letter}.</strong> {text}
                </label>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   TRUE / FALSE / NOT GIVEN  &  YES / NO / NOT GIVEN
═══════════════════════════════════════════════════ */
function TFNGForm({ group, answers, onAnswer }) {
  const questions = [...group.questions].sort((a, b) => a.question_number - b.question_number)
  const opts = group.question_type === 'yes_no_ng'
    ? ['YES', 'NO', 'NOT GIVEN']
    : ['TRUE', 'FALSE', 'NOT GIVEN']

  return (
    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14 }} className="space-y-5">
      {questions.map(q => {
        const ans = answers[q.id] || ''
        return (
          <div key={q.id} id={`q-${q.id}`} className="scroll-mt-4">
            <p className="text-black leading-relaxed mb-2">
              <strong className="mr-2">{q.question_number}.</strong> {q.prompt}
            </p>
            <div className="flex gap-2 flex-wrap ml-6">
              {opts.map(o => (
                <button key={o}
                  onClick={() => onAnswer(q.id, ans === o ? '' : o)}
                  className={`px-4 py-1.5 text-xs font-bold border-2 rounded-full transition-all ${
                    ans === o
                      ? 'bg-[#e24f4f] border-[#e24f4f] text-white'
                      : 'bg-white border-black text-black hover:border-[#e24f4f] hover:text-[#e24f4f]'
                  }`}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MATCHING FEATURES / HEADINGS
═══════════════════════════════════════════════════ */
function MatchingForm({ group, answers, onAnswer }) {
  const extra = group.extra_data || {}
  const categories = extra.categories || {}
  const questions = [...group.questions].sort((a, b) => a.question_number - b.question_number)
  const opts = Object.entries(categories).map(([k, v]) => ({ key: k, val: v }))
  const usedKeys = new Set(Object.values(answers))
  const available = opts.filter(o => !usedKeys.has(o.key))
  const handleDrop = (qId, e) => {
    e.preventDefault()
    const k = e.dataTransfer.getData('text/plain')
    const prevQ = questions.find(x => x.id !== qId && answers[x.id] === k)
    if (prevQ) onAnswer(prevQ.id, '')
    onAnswer(qId, k)
  }
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, display: 'flex', gap: 24 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {questions.map(q => {
          const sel = answers[q.id] || ''
          const selOpt = opts.find(o => o.key === sel)
          return (
            <div key={q.id} id={`q-${q.id}`} className="scroll-mt-4" style={{marginBottom:14}}>
              <p className="text-black leading-relaxed mb-2">
                <strong className="mr-2">{q.question_number}.</strong> {q.prompt}
              </p>
              <div draggable={!!sel}
                onDragStart={e => {if(sel){e.dataTransfer.setData('text/plain', sel);e.dataTransfer.effectAllowed='move'}}}
                onDragOver={e => {e.preventDefault();e.dataTransfer.dropEffect='move'}}
                onDrop={e => handleDrop(q.id, e)}
                onClick={() => {if(sel)onAnswer(q.id,'')}}
                style={{marginTop:6,padding:'6px 8px',border:sel?'2px solid #c8102e':'1px dashed #aaa',borderRadius:3,background:'#fff',fontSize:13,lineHeight:0.8,fontWeight:sel?700:500,color:sel?'#c8102e':'#555',cursor:sel?'grab':'default',userSelect:sel?'none':'auto',display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:120,transition:'all 0.15s'}}>
              {selOpt ? <span><span style={{fontWeight:700}}>{selOpt.key}.</span> {selOpt.val}</span> : <span style={{color:'#999',fontSize:14,fontWeight:500}}>{q.question_number}</span>}
            </div>
          </div>
        )
      })}
      </div>
      {opts.length > 0 && (
        <div style={{width:280,flexShrink:0,borderLeft:'1px solid #ddd',paddingLeft:16}}>
          <p style={{fontWeight:700,fontSize:13,color:'#333',marginBottom:8}}>Options</p>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            {available.map(o => (
              <div key={o.key} draggable
                onDragStart={e => {e.dataTransfer.setData('text/plain', o.key);e.dataTransfer.effectAllowed='move'}}
                style={{display:'flex',alignItems:'flex-start',gap:6,padding:'6px 8px',border:'1px solid #999',borderRadius:4,background:'#fff',fontSize:13,lineHeight:1.5,cursor:'grab',userSelect:'none'}}>
                <span style={{fontWeight:700,flexShrink:0}}>{o.key}.</span>
                <span>{o.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   DIAGRAM LABELLING / COMPLETION
═══════════════════════════════════════════════════ */
function DiagramForm({ group, answers, onAnswer }) {
  const extra = group.extra_data || {}
  const questions = [...group.questions].sort((a, b) => a.question_number - b.question_number)
  const allOpts = {}
  questions.forEach(q => {
    const qOpts = extra[String(q.question_number)]?.options || extra.categories || {}
    Object.entries(qOpts).forEach(([k, v]) => { allOpts[k] = v })
  })
  const opts = Object.entries(allOpts).map(([k, v]) => ({ key: k, val: v }))
  const hasOptions = opts.length > 0
  return (
    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14 }} className="space-y-5">
      {extra.diagram_description && (
        <div className="border border-black p-3 mb-3 bg-gray-50">
          <p className="text-sm text-black leading-relaxed">{extra.diagram_description}</p>
        </div>
      )}
      {extra.diagram_url && (
        <div className="mb-3">
          <img src={extra.diagram_url} alt="Diagram" className="max-w-full h-auto border border-black" />
        </div>
      )}
      {hasOptions ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '6px 10px', fontWeight: 700, fontSize: 14, border: '1px solid #333', background: '#fff' }}></th>
                {opts.map(o => (
                  <th key={o.key} style={{ textAlign: 'center', padding: '6px 10px', fontWeight: 700, fontSize: 14, border: '1px solid #333', background: '#fff', width: 50 }}>{o.key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {questions.map(q => (
                <tr key={q.id}>
                  <td style={{ padding: '6px 10px', border: '1px solid #333', fontSize: 14 }}>
                    <span style={{ fontWeight: 800, marginRight: 6 }}>{q.question_number}</span>
                    {extra.labels?.[String(q.question_number)] || q.prompt || ''}
                  </td>
                  {opts.map(o => (
                    <td key={o.key} style={{ textAlign: 'center', padding: '6px 10px', border: '1px solid #333' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 22, height: 22, borderRadius: '50%',
                          border: answers[q.id] === o.key ? '6px solid #c8102e' : '2px solid #666',
                          cursor: 'pointer', background: '#fff', transition: 'all 0.1s' }}>
                        <input type="radio" name={`diagram_${q.id}`} value={o.key}
                          checked={answers[q.id] === o.key}
                          onChange={() => onAnswer(q.id, o.key)}
                          style={{ display: 'none' }} />
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        questions.map(q => {
          const label = extra.labels?.[String(q.question_number)]
          const txt = label || q.prompt || ''
          const hasBlank = txt.includes('___') || txt.includes('{blank}')
          if (hasBlank) {
            const sep = txt.includes('___') ? '___' : '{blank}'
            const parts = txt.split(sep)
            return (
              <div key={q.id} id={`q-${q.id}`} className="scroll-mt-4">
                <p className="text-black leading-relaxed" style={{ lineHeight: 2.4 }}>
                  <strong className="mr-2">{q.question_number}.</strong>
                  {parts.map((part, pi) => (
                    <span key={pi}>
                      {part}
                      {pi < parts.length - 1 && (
                        <AnswerBox qNum={q.question_number} value={answers[q.id] || ''} onChange={v => onAnswer(q.id, v)} width={160} />
                      )}
                    </span>
                  ))}
                </p>
              </div>
            )
          }
          return (
            <div key={q.id} id={`q-${q.id}`} className="scroll-mt-4">
              <p className="text-black leading-relaxed mb-1.5">
                <strong className="mr-2">{q.question_number}.</strong>
                {txt}
              </p>
              <input type="text" value={answers[q.id] || ''}
                onChange={e => onAnswer(q.id, e.target.value)}
                placeholder="Type your answer here"
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  border: '2px solid #000',
                  borderRadius: 9999,
                  height: 34, padding: '0 16px', outline: 'none',
                }}
                className="w-full max-w-xs text-sm text-black bg-white transition-colors focus:border-[#e24f4f] ml-6"
                autoComplete="off" spellCheck={false}
              />
            </div>
          )
        })
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CLASSIFICATION
═══════════════════════════════════════════════════ */
function ClassificationForm({ group, answers, onAnswer }) {
  const extra = group.extra_data || {}
  const categories = extra.categories || {}
  const questions = [...group.questions].sort((a, b) => a.question_number - b.question_number)
  const opts = Object.entries(categories).map(([k, v]) => ({ key: k, val: v }))
  const usedKeys = new Set(Object.values(answers))
  const available = opts.filter(o => !usedKeys.has(o.key))
  const handleDrop = (qId, e) => {
    e.preventDefault()
    const k = e.dataTransfer.getData('text/plain')
    const prevQ = questions.find(x => x.id !== qId && answers[x.id] === k)
    if (prevQ) onAnswer(prevQ.id, '')
    onAnswer(qId, k)
  }
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 14 }} className="space-y-5">
      {questions.map(q => {
        const sel = answers[q.id] || ''
        const selOpt = opts.find(o => o.key === sel)
        return (
          <div key={q.id} id={`q-${q.id}`} className="scroll-mt-4" style={{marginBottom:14}}>
            <p className="text-black leading-relaxed mb-2">
              <strong className="mr-2">{q.question_number}.</strong> {q.prompt}
            </p>
            <div draggable={!!sel}
              onDragStart={e => {if(sel){e.dataTransfer.setData('text/plain', sel);e.dataTransfer.effectAllowed='move'}}}
              onDragOver={e => {e.preventDefault();e.dataTransfer.dropEffect='move'}}
              onDrop={e => handleDrop(q.id, e)}
              onClick={() => {if(sel)onAnswer(q.id,'')}}
              style={{marginTop:6,padding:'6px 8px',border:sel?'2px solid #c8102e':'1px dashed #aaa',borderRadius:3,background:'#fff',fontSize:13,lineHeight:0.8,fontWeight:sel?700:500,color:sel?'#c8102e':'#555',cursor:sel?'grab':'default',userSelect:sel?'none':'auto',display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:120,transition:'all 0.15s'}}>
              {selOpt ? <span><span style={{fontWeight:700}}>{selOpt.key}.</span> {selOpt.val}</span> : <span style={{color:'#999',fontSize:14,fontWeight:500}}>{q.question_number}</span>}
            </div>
          </div>
        )
      })}
      {opts.length > 0 && (
        <div style={{display:'flex',flexDirection:'column',gap:4,marginTop:8}}>
          {available.map(o => (
            <div key={o.key} draggable
              onDragStart={e => {e.dataTransfer.setData('text/plain', o.key);e.dataTransfer.effectAllowed='move'}}
              style={{display:'flex',alignItems:'flex-start',gap:6,padding:'6px 8px',border:'1px solid #999',borderRadius:4,background:'#fff',fontSize:13,lineHeight:1.5,cursor:'grab',userSelect:'none'}}>
              <span style={{fontWeight:700,flexShrink:0}}>{o.key}.</span>
              <span>{o.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SENTENCE ENDINGS (MATCH ENDINGS)
═══════════════════════════════════════════════════ */
function SentenceEndingsForm({ group, answers, onAnswer }) {
  const extra = group.extra_data || {}
  const endings = extra.endings || {}
  const questions = [...group.questions].sort((a, b) => a.question_number - b.question_number)
  const opts = Object.entries(endings).map(([k, v]) => ({ key: k, val: v }))
  const usedKeys = new Set(Object.values(answers))
  const available = opts.filter(o => !usedKeys.has(o.key))
  const handleDrop = (qId, e) => {
    e.preventDefault()
    const k = e.dataTransfer.getData('text/plain')
    const prevQ = questions.find(x => x.id !== qId && answers[x.id] === k)
    if (prevQ) onAnswer(prevQ.id, '')
    onAnswer(qId, k)
  }
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 14 }} className="space-y-5">
      {questions.map(q => {
        const sel = answers[q.id] || ''
        const selOpt = opts.find(o => o.key === sel)
        return (
          <div key={q.id} id={`q-${q.id}`} className="scroll-mt-4" style={{marginBottom:14}}>
            <p className="text-black leading-relaxed mb-2">
              <strong className="mr-2">{q.question_number}.</strong> {q.prompt}
            </p>
            <div draggable={!!sel}
              onDragStart={e => {if(sel){e.dataTransfer.setData('text/plain', sel);e.dataTransfer.effectAllowed='move'}}}
              onDragOver={e => {e.preventDefault();e.dataTransfer.dropEffect='move'}}
              onDrop={e => handleDrop(q.id, e)}
              onClick={() => {if(sel)onAnswer(q.id,'')}}
              style={{marginTop:6,padding:'6px 8px',border:sel?'2px solid #c8102e':'1px dashed #aaa',borderRadius:3,background:'#fff',fontSize:13,lineHeight:0.8,fontWeight:sel?700:500,color:sel?'#c8102e':'#555',cursor:sel?'grab':'default',userSelect:sel?'none':'auto',display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:120,transition:'all 0.15s'}}>
              {selOpt ? <span><span style={{fontWeight:700}}>{selOpt.key}.</span> {selOpt.val}</span> : <span style={{color:'#999',fontSize:14,fontWeight:500}}>{q.question_number}</span>}
            </div>
          </div>
        )
      })}
      {opts.length > 0 && (
        <div style={{display:'flex',flexDirection:'column',gap:4,marginTop:8}}>
          {available.map(o => (
            <div key={o.key} draggable
              onDragStart={e => {e.dataTransfer.setData('text/plain', o.key);e.dataTransfer.effectAllowed='move'}}
              style={{display:'flex',alignItems:'flex-start',gap:6,padding:'6px 8px',border:'1px solid #999',borderRadius:4,background:'#fff',fontSize:13,lineHeight:1.5,cursor:'grab',userSelect:'none'}}>
              <span style={{fontWeight:700,flexShrink:0}}>{o.key}.</span>
              <span>{o.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SHORT ANSWER
═══════════════════════════════════════════════════ */
function ShortAnswerForm({ group, answers, onAnswer }) {
  const questions = [...group.questions].sort((a, b) => a.question_number - b.question_number)
  return (
    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14 }} className="space-y-5">
      {questions.map(q => (
        <div key={q.id} id={`q-${q.id}`} className="scroll-mt-4 flex items-start gap-3">
          <span className="font-bold text-black flex-shrink-0">{q.question_number}.</span>
          <div className="flex-1">
            <p className="text-black leading-relaxed mb-1.5">{q.prompt}</p>
            <input type="text" value={answers[q.id] || ''}
              onChange={e => onAnswer(q.id, e.target.value)}
              placeholder="Type your answer here"
              style={{
                fontFamily: 'Open Sans, sans-serif',
                border: '2px solid #000',
                borderRadius: 9999,
                height: 34,
                padding: '0 16px',
                outline: 'none',
              }}
              className="w-full max-w-xs text-sm text-black bg-white transition-colors focus:border-[#e24f4f]"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   GROUP DISPATCHER
═══════════════════════════════════════════════════ */
function GroupRenderer({ group, answers, onAnswer }) {
  const t = group.question_type
  if (t === 'note_completion' || t === 'fill_in_blank' || t === 'summary_completion')
    return <NoteForm group={group} answers={answers} onAnswer={onAnswer} />
  if (t === 'table_completion')
    return <TableForm group={group} answers={answers} onAnswer={onAnswer} />
  if (t === 'flow_chart')
    return <FlowChartForm group={group} answers={answers} onAnswer={onAnswer} />
  if (t === 'multiple_choice')
    return <MCQForm group={group} answers={answers} onAnswer={onAnswer} />
  if (t === 'true_false_ng' || t === 'yes_no_ng')
    return <TFNGForm group={group} answers={answers} onAnswer={onAnswer} />
  if (t === 'match_features' || t === 'match_headings' || t === 'match_paragraph_info')
    return <MatchingForm group={group} answers={answers} onAnswer={onAnswer} />
  if (t === 'diagram_labelling' || t === 'diagram_completion')
    return <DiagramForm group={group} answers={answers} onAnswer={onAnswer} />
  if (t === 'classification')
    return <ClassificationForm group={group} answers={answers} onAnswer={onAnswer} />
  if (t === 'sentence_endings')
    return <SentenceEndingsForm group={group} answers={answers} onAnswer={onAnswer} />
  if (t === 'sentence_completion')
    return <NoteForm group={group} answers={answers} onAnswer={onAnswer} />
  if (t === 'fill_blank')
    return <NoteForm group={group} answers={answers} onAnswer={onAnswer} />
  return <ShortAnswerForm group={group} answers={answers} onAnswer={onAnswer} />
}

const TYPE_LABEL = {
  note_completion: 'Note Completion',
  fill_in_blank: 'Form Completion',
  table_completion: 'Table Completion',
  flow_chart: 'Flow Chart Completion',
  summary_completion: 'Summary Completion',
  multiple_choice: 'Multiple Choice',
  true_false_ng: 'True / False / Not Given',
  yes_no_ng: 'Yes / No / Not Given',
  short_answer: 'Short Answer',
  match_features: 'Matching Features',
  match_headings: 'Matching Headings',
  match_paragraph_info: 'Matching Information',
  diagram_labelling: 'Diagram Labelling',
  diagram_completion: 'Diagram Completion',
  classification: 'Classification',
  sentence_endings: 'Sentence Endings',
  sentence_completion: 'Sentence Completion',
  fill_blank: 'Fill in the Blank',
}

/* ═══════════════════════════════════════════════════
   AUDIO PLAYER — styled like reference site
═══════════════════════════════════════════════════ */
function AudioPlayer({ audioUrl, audioRef }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [showVol, setShowVol] = useState(false)

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }

  const onTimeUpdate = () => {
    if (!audioRef.current) return
    setProgress(audioRef.current.currentTime)
    setDuration(audioRef.current.duration || 0)
  }

  const seek = (e) => {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audioRef.current.currentTime = ratio * duration
  }

  const changeVolume = (e) => {
    const v = parseInt(e.target.value)
    setVolume(v)
    if (audioRef.current) {
      audioRef.current.volume = v / 100
      audioRef.current.muted = v === 0
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={toggle} disabled={!audioUrl}
        className="w-8 h-8 flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 disabled:opacity-30"
        style={{ color: '#c8102e' }}>
        {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      </button>

      <div className="flex-1 flex items-center gap-1.5 min-w-0 max-w-[200px]">
        <span className="text-[11px] font-mono text-black w-10 text-right tabular-nums flex-shrink-0">
          {fmt(Math.floor(progress))}
        </span>
        <div className="relative flex-1 h-1.5 bg-black cursor-pointer group"
          onClick={audioUrl ? seek : undefined}>
          <div className="h-full transition-all duration-100"
            style={{ width: duration ? `${(progress / duration) * 100}%` : '0%', background: '#c8102e' }} />
          {duration > 0 && (
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                left: `calc(${duration ? (progress / duration) * 100 : 0}% - 8px)`,
                borderColor: '#c8102e',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            />
          )}
        </div>
        <span className="text-[11px] font-mono text-black w-10 tabular-nums flex-shrink-0">
          {fmt(Math.floor(duration))}
        </span>
      </div>

      <div className="relative flex items-center">
        <button onClick={() => setShowVol(v => !v)}
          className="w-7 h-7 flex items-center justify-center hover:bg-black hover:text-white transition-colors rounded"
          style={{ color: volume === 0 ? '#000' : '#000' }}>
          {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        {showVol && (
          <div className="absolute top-full right-0 mt-1 z-50 flex items-center gap-2 px-3 py-2"
            style={{ background: '#fff', border: '1px solid #000', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <input type="range" min={0} max={100} value={volume} onChange={changeVolume}
              className="w-20 h-1 cursor-pointer"
              style={{ accentColor: '#c8102e' }} />
            <span className="text-[10px] text-black w-6 text-right tabular-nums">{volume}</span>
          </div>
        )}
      </div>

      {audioUrl && (
        <audio ref={audioRef} src={audioUrl}
          onTimeUpdate={onTimeUpdate} onLoadedMetadata={onTimeUpdate}
          onEnded={() => setPlaying(false)} className="hidden" />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MAIN LISTENING PAGE — authentic IELTS CBT layout
═══════════════════════════════════════════════════ */
export default function ListeningPage() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isMockTest = searchParams.get('mockTest') === '1'
  const [started, setStarted] = useState(false)
  const [section, setSection] = useState(null)
  const [answers, setAnswers] = useState({})
  const [flagged, setFlagged] = useState(new Set())
  const [activePart, setActivePart] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [expandedPart, setExpandedPart] = useState(null)
  const sessionRef = useRef(null)
  const audioRef = useRef(null)
  const elapsedRef = useRef(0)

  useEffect(() => {
    ;(async () => {
      try {
        const [secRes, sessRes] = await Promise.all([
          testsApi.getListening(testId),
          sessionsApi.my(),
        ])
        const raw = secRes.data
        const sortedGroups = [...(raw.question_groups || [])]
          .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
          .map(g => ({ ...g, questions: [...g.questions].sort((a, b) => a.question_number - b.question_number) }))
        const recordings = []
        for (const g of sortedGroups) {
          const rec = g.extra_data?.recording || 1
          const last = recordings[recordings.length - 1]
          if (!last || last.recording !== rec) {
            recordings.push({ recording: rec, groups: [g] })
          } else {
            last.groups.push(g)
          }
        }
        const sorted = { ...raw, recordings }
        setSection(sorted)
        if (isMockTest) {
          const sid = mockTestProgress.getSessionId()
          if (sid) sessionRef.current = sid
        }
        if (!sessionRef.current) {
          const active = sessRes.data.find(
            s => s.test_id == testId && s.section_type === 'listening' && s.status === 'in_progress'
          )
          if (active) sessionRef.current = active.id
        }
      } catch {
        toast.error('Failed to load listening test')
        navigate('/tests')
      } finally { setLoading(false) }
    })()
  }, [testId])

  const handleSubmit = async (auto = false) => {
    if (submitting) return
    setShowSubmitModal(false)
    setSubmitting(true)
    try {
      const allQuestions = section.recordings.flatMap(r => r.groups.flatMap(g => g.questions))
      const res = await sessionsApi.submit({
        session_id: sessionRef.current,
        answers: allQuestions.map(q => ({
          question_id: q.id,
          given_answer: answers[q.id] || '',
        })),
        time_taken_seconds: elapsedRef.current,
      })
      // Calculate realistic band score from correct answers
      if (res.data) {
        res.data.band_score = calculateListeningBand(res.data.correct_answers, res.data.total_questions)
      }
      if (isMockTest) {
        mockTestProgress.saveResult('listening', res.data)
        try {
          const startRes = await sessionsApi.start({ test_id: testId, section_type: 'reading' })
          mockTestProgress.setSessionId(startRes.data.id ?? startRes.data.session_id)
          navigate(`/test/${testId}/reading?mockTest=1`, { replace: true })
        } catch {
          navigate(`/mock-test-result?testId=${testId}`, { replace: true })
        }
      } else {
        navigate(`/result/${res.data.session_id}`, { state: { result: res.data } })
      }
    } catch (err) {
      const errMsg = err.response?.data?.detail
      toast.error(typeof errMsg === 'string' ? errMsg : 'Submission failed')
      setSubmitting(false)
    }
  }

  const { seconds } = useTimer(
    section?.time_limit_seconds || 2400,
    () => { toast('Time up! Submitting…', { icon: '⏰' }); handleSubmit(true) }
  )
  useEffect(() => { elapsedRef.current = (section?.time_limit_seconds || 2400) - seconds }, [seconds])

  const handleAnswer = (qId, val) => setAnswers(p => ({ ...p, [qId]: val }))
  const toggleFlag = (qId) => setFlagged(p => { const n = new Set(p); n.has(qId) ? n.delete(qId) : n.add(qId); return n })

  const scrollToPart = (idx) => {
    setActivePart(idx)
    const rec = section.recordings[idx]
    if (rec) {
      const firstId = rec.groups[0]?.id
      if (firstId) {
        document.getElementById(`g-${firstId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  if (loading) return <LoadingScreen message="Loading listening test…" />
  if (!section) return null

  const allQs = section.recordings.flatMap(r => r.groups.flatMap(g => g.questions))
  const totalQuestions = allQs.length
  const answered = Object.values(answers).filter(Boolean).length
  const isLow = seconds < 300
  const isCritical = seconds < 60

  return (
    <>
      {!started && !isMockTest && <StartOverlay onStart={() => setStarted(true)} moduleName="Listening" icon={<ListeningIcon size={28} color="#CC0000" />} />}
      <style>{`
        .lp-body p{margin-bottom:0;line-height:1.9;font-family:Arial,sans-serif;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-thumb{background:#ccc;border-radius:0;}
        ::-webkit-scrollbar-track{background:#f5f5f5;}
        input[type="range"]{-webkit-appearance:none;appearance:none;height:4px;background:#000;border-radius:0;outline:none;}
        input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:#c8102e;border-radius:50%;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);}
      `}</style>

      <div style={{fontFamily:"Arial, sans-serif",height:"100vh",display:"flex",flexDirection:"column",background:"#fff",fontSize:15,color:"#000"}}>

        {/* ═══ TOP BAR — matches reading ═══ */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #ccc",padding:"0 20px",height:52,flexShrink:0,background:"#fff"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <img src={huLogo} alt="IELTS" style={{height:28,width:'auto'}} />
            <span style={{fontSize:14,color:"#333",borderLeft:"1px solid #ccc",paddingLeft:12}}>Test taker ID</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            {section.recordings.length > 1 && (
              <div style={{display:'flex',gap:2,marginRight:8}}>
                {section.recordings.map((_, i) => (
                  <button key={i} onClick={() => scrollToPart(i)}
                    style={{
                      padding:'4px 10px', fontSize:13, fontWeight: activePart === i ? 700 : 400,
                      border:'none', background: activePart === i ? '#e8e8e8' : 'transparent',
                      borderRadius:3, cursor:'pointer', color:'#333',
                    }}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
            <span style={{fontSize:14,fontWeight:700,color: isCritical ? '#c8102e' : isLow ? '#cc6600' : '#333',fontFamily:'monospace'}}>
              {fmt(seconds)}
            </span>
            <button onClick={() => setShowSubmitModal(true)} disabled={submitting}
              style={{background:'#c8102e',color:'#fff',border:'none',borderRadius:4,padding:'5px 14px',fontSize:13,fontWeight:700,cursor:submitting?'not-allowed':'pointer',opacity:submitting?0.6:1}}>
              Submit
            </button>
          </div>
        </div>

        {/* ═══ PART HEADER + AUDIO PLAYER ═══ */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#f5f5f5",border:"1px solid #ccc",padding:"4px 10px 6px",fontSize:16,flexShrink:0,margin:"16px 24px 0",borderRadius:4}}>
          <div>
            <strong>Part {activePart + 1}</strong>
            <span style={{color:"#555",fontWeight:500,fontSize:16,marginLeft:8}}>
              {(() => {
                const rec = section.recordings[activePart]
                if (!rec) return ''
                const allQs = rec.groups.flatMap(g => g.questions)
                return allQs.length ? `Questions ${allQs[0].question_number}–${allQs[allQs.length-1].question_number}` : ''
              })()}
            </span>
          </div>
          <AudioPlayer audioUrl={section.audio_url} audioRef={audioRef} />
        </div>

        {!section.audio_url && (
          <div style={{flexShrink:0,margin:"8px 24px 0",padding:"6px 12px",background:'#fef3c7',border:'1px solid #fcd34d',borderRadius:4,fontSize:13,color:'#92400e'}}>
            <Volume2 size={13} style={{marginRight:6,verticalAlign:'middle'}} />
            No audio attached
          </div>
        )}

        {/* ═══ MAIN CONTENT — questions full width ═══ */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px",marginTop:8}}>
          {(() => {
            const rec = section.recordings[activePart]
            if (!rec) return null
            return rec.groups.map(group => (
              <div key={group.id}>
                <div style={{marginBottom:24}}>
                  <div style={{fontWeight:700,fontSize:18,marginBottom:4}}>
                    {TYPE_LABEL[group.question_type] || 'Questions'} — {group.questions[0]?.question_number}–{group.questions[group.questions.length-1]?.question_number}
                  </div>
                  <div style={{marginBottom:12,fontSize:15,color:'#000',lineHeight:1.6}}>
                    {group.instruction}
                  </div>
                  {group.extra_data?.context && (
                    <div style={{fontSize:14,color:'#666',marginBottom:12,fontStyle:'italic'}}>
                      {group.extra_data.context}
                    </div>
                  )}
                  <GroupRenderer group={group} answers={answers} onAnswer={handleAnswer} />
                </div>
              </div>
            ))
          })()}
        </div>

        {/* ═══ BOTTOM NAV — matches reading ═══ */}
        <div style={{borderTop:"1px solid #ccc",padding:"8px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",flexShrink:0,flexWrap:'wrap',gap:6}}>
          <div style={{display:"flex",flex:1,justifyContent:'space-between'}}>
            {section.recordings.map((rec, i) => {
              const allQs = rec.groups.flatMap(g => g.questions)
              const total = allQs.length
              const answered = allQs.filter(q => answers[q.id]).length
              const isExpanded = expandedPart === i
              return (
                <div key={i} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}
                  onClick={() => setExpandedPart(isExpanded ? null : i)}>
                  <span style={{fontSize:15,fontWeight:600,color:'#333'}}>Part {i + 1}</span>
                  {isExpanded ? (
                    allQs.map(q => (
                      <span key={q.id} onClick={(e) => {
                        e.stopPropagation()
                        scrollToPart(i)
                        setTimeout(() => document.getElementById(`q-${q.id}`)?.scrollIntoView({behavior:'smooth',block:'center'}), 80)
                      }}
                        style={{
                          minWidth:22,height:22,borderRadius:3,display:'inline-flex',alignItems:'center',justifyContent:'center',
                          border: "1px solid #aaa",
                          background: answers[q.id] ? "#555" : "#fff",
                          color: answers[q.id] ? "#fff" : "#333",
                          fontSize:11,fontWeight:600,
                          cursor:"pointer",padding:"0 2px",
                        }}>
                        {q.question_number}
                      </span>
                    ))
                  ) : (
                    <span style={{fontSize:15,fontWeight:600,color:'#000'}}>{answered} of {total}</span>
                  )}
                </div>
              )
            })}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <button onClick={() => setActivePart(p => Math.max(0, p - 1))}
              style={{background:"#333",color:"#fff",border:"none",borderRadius:4,width:32,height:32,cursor:"pointer",fontSize:22,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>❮</button>
            <button onClick={() => setActivePart(p => Math.min(section.recordings.length - 1, p + 1))}
              style={{background:"#333",color:"#fff",border:"none",borderRadius:4,width:32,height:32,cursor:"pointer",fontSize:22,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>❯</button>
          </div>
        </div>

        {/* ═══ SUBMIT MODAL — matches reading ═══ */}
        {showSubmitModal && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
            <div style={{background:'#fff',width:'100%',maxWidth:440,padding:24,border:'1px solid #000'}}>
              <h3 style={{fontSize:18,fontWeight:700,color:'#333',marginBottom:4}}>Submit Listening Test?</h3>
              <p style={{fontSize:14,color:'#555',marginBottom:16}}>
                Answered <strong>{answered}</strong> of <strong>{totalQuestions}</strong>.
                {answered < totalQuestions && (
                  <span style={{color:'#c8102e',fontWeight:700}}> {totalQuestions - answered} unanswered.</span>
                )}
              </p>
              <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:16,maxHeight:80,overflowY:'auto'}}>
                {allQs.map(q => (
                  <div key={q.id} style={{
                    minWidth:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:12,fontWeight:700,
                    background: answers[q.id] ? '#555' : '#fff',
                    color: answers[q.id] ? '#fff' : '#333',
                    border: answers[q.id] ? 'none' : '1px solid #aaa',
                  }}>
                    {q.question_number}
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={() => setShowSubmitModal(false)}
                  style={{flex:1,padding:'10px 0',background:'#fff',color:'#333',border:'1px solid #ccc',borderRadius:3,fontSize:14,fontWeight:600,cursor:'pointer'}}>
                  Review
                </button>
                <button onClick={() => handleSubmit(false)} disabled={submitting}
                  style={{flex:1,padding:'10px 0',background:'#c8102e',color:'#fff',border:'none',borderRadius:3,fontSize:14,fontWeight:700,cursor:submitting?'not-allowed':'pointer',opacity:submitting?0.6:1}}>
                  {submitting ? 'Submitting…' : 'Submit Now'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
