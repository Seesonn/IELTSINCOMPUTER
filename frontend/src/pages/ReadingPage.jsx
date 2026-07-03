import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { testsApi, sessionsApi, vocabApi } from '../utils/api'
import { mockTestProgress } from '../utils/mockTestProgress'
import { calculateReadingBand } from '../utils/helpers'
import { useTimer } from '../hooks/useTimer'
import { LoadingScreen, StartOverlay } from '../components/ui'
import toast from 'react-hot-toast'
import {
  Star, Flag, ChevronLeft, ChevronRight,
  Highlighter, Underline as UnderlineIcon, X,
  AlertCircle,
} from 'lucide-react'
import { ReadingIcon } from '../components/ExamIcons'
import ieltsLogo from '../assets/hu.png'

const escHtml = (t = '') =>
  t.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
   .replaceAll('"','&quot;').replaceAll("'",'&#39;')

const buildHtml = (text) => {
  if (!text) return ''
  return text.split('\n\n').filter(Boolean).map(p => `<p>${escHtml(p.trim())}</p>`).join('')
}

const fmt = (s) =>
  `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

function InlinePill({ value, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        border: focused ? '2px solid #c8102e' : '1px solid #999',
        borderRadius: 3, padding: '0px 8px', width: 180, fontSize: 15, fontWeight:600, color:'#000', outline: 'none',
        fontFamily: 'Arial, sans-serif',
      }}
      placeholder="" autoComplete="off" />
  )
}

function renderPromptWithBlanks(prompt, ans, onChange) {
  if (!prompt || !prompt.includes('___')) return null
  return prompt.split('___').map((part, i) => (
    <span key={i}>
      {part}
      {i < prompt.split('___').length - 1 && (
        <InlinePill value={ans} onChange={onChange} />
      )}
    </span>
  ))
}

function QuestionGroup({ group, answers, setAnswer, toggleMulti, passageIdx }) {
  const qType = group.question_type
  const qs = group.questions || []
  const qRange = qs.length ? `${qs[0].question_number}–${qs[qs.length-1].question_number}` : ''
  if (qType === "tfng" || qType === "true_false_ng" || qType === "yes_no_ng") {
    const opts = qType === "yes_no_ng" ? ['YES','NO','NOT GIVEN'] : ['TRUE','FALSE','NOT GIVEN']
    return (
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>Questions {qRange}</div>
        <div style={{marginBottom:12,fontSize:17,color:'#000',lineHeight:1.6}}>
          {group.instruction}
        </div>
        {group.questions.map(q => (
          <div key={q.id} style={{marginBottom:16}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:6}}>
              <span style={{fontSize:15,fontWeight:800,color:'#000',flexShrink:0,marginRight:6}}>{q.question_number}</span>
              <span style={{fontSize:17,lineHeight:1.6}}>{q.prompt}</span>
            </div>
            <div style={{marginLeft:32,display:'flex',flexDirection:'column',gap:6}}>
              {opts.map(o => (
                <label key={o} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:15,background:answers[q.id] === o ? '#c8102e' : 'transparent',padding:'4px 8px',borderRadius:4,color:answers[q.id] === o ? '#fff' : '#000'}}>
                  <input type="radio" name={q.id} value={o} checked={answers[q.id] === o}
                    onChange={() => setAnswer(q.id, answers[q.id] === o ? '' : o)}
                    style={{accentColor:'#fff',width:15,height:15}} />
                  {o}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (qType === "notes" || qType === "note_completion" || qType === "fill_in_blank" || qType === "fill_blank") {
    const items = group.questions || []
    const noteTitle = group.extra_data?.note_title || ''
    return (
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>Questions {qRange}</div>
        <div style={{marginBottom:8,fontSize:15,color:'#000'}}>
          {group.instruction}
        </div>
        {noteTitle && <div style={{fontWeight:700,fontSize:15,marginBottom:10}}>{noteTitle}</div>}
        <ul style={{paddingLeft:20,margin:0}}>
          {items.map(item => {
            const text = item.text || item.prompt || ''
            const id = item.id
            const num = item.num || item.question_number
            const parts = text.split('___')
            return (
              <li key={id} style={{marginBottom:10,fontSize:15,lineHeight:1.7}}>
                {parts.map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < parts.length - 1 && (
                      <span style={{display:'inline-flex',alignItems:'center',gap:4}}>
                        <input type="text" value={answers[id] || ''}
                          onChange={e => setAnswer(id, e.target.value)}
                          style={{border:'1px solid #999',borderRadius:3,padding:'0px 8px',width:180,fontSize:15,fontWeight:600,color:'#000',outline:'none'}}
                          placeholder={String(num)} />
                      </span>
                    )}
                  </span>
                ))}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  if (qType === "headings" || qType === "match_headings") {
    const headings = group.extra_data?.headings || []
    const romans = ['i','ii','iii','iv','v','vi','vii','viii','ix','x']
    const usedRomans = group.questions.map(q => answers[q.id]).filter(Boolean)
    const handleDragStart = (e, roman) => {
      e.dataTransfer.setData('text/plain', roman)
      e.dataTransfer.effectAllowed = 'move'
    }
    return (
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>Questions {qRange}</div>
        <div style={{marginBottom:10,fontSize:15,color:'#000'}}>{group.instruction}</div>
        <div style={{marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:6}}>List of Headings</div>
          {headings.map((h, i) => {
            const roman = romans[i]
            const used = usedRomans.includes(roman)
            return (
              <div key={i}
                draggable={!used}
                onDragStart={(e) => handleDragStart(e, roman)}
                style={{
                  display:'inline-flex',alignItems:'center',gap:6,
                  border:`1px solid ${used ? '#ccc' : '#bbb'}`,
                  borderRadius:4,padding:'5px 12px',margin:'4px 6px 4px 0',
                  fontSize:15,fontWeight:500,
                  cursor: used ? 'default' : 'grab',
                  opacity: used ? 0.35 : 1,
                  background: used ? '#f5f5f5' : '#fff',
                  userSelect:'none',
                  boxShadow: used ? 'none' : '0 1px 2px rgba(0,0,0,0.06)',
                }}>
                <span style={{
                  borderRadius:3,
                  padding:'1px 6px',fontSize:12,fontWeight:800,color:'#000',
                  flexShrink:0,
                }}>{roman}</span>
                <span>{h}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (qType === "mcq_multi") {
    return (
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Questions {qRange}</div>
        <div style={{fontSize:14,marginBottom:12}}>Choose <strong>TWO</strong> correct answers.</div>
        {group.subGroups.map(sg => {
          const key = `multi_${sg.ids[0]}_${sg.ids[1]}`
          const selected = answers[key] || []
          return (
            <div key={sg.id} style={{marginBottom:18}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:6}}>
                {sg.qRange}&nbsp;{sg.prompt}
              </div>
              {sg.options.map((opt, i) => (
                  <label key={i} style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:6,cursor:'pointer',fontSize:14,background:selected.includes(i) ? '#c8102e' : 'transparent',padding:'4px 8px',borderRadius:4,color:selected.includes(i) ? '#fff' : '#000'}}>
                    <input type="checkbox" checked={selected.includes(i)}
                      onChange={() => {
                        const key = `multi_${sg.ids[0]}_${sg.ids[1]}`
                        const current = answers[key] || []
                        if (current.includes(i)) {
                          setAnswer(key, current.filter(x => x !== i))
                        } else if (current.length < 2) {
                          setAnswer(key, [...current, i])
                        }
                      }}
                      style={{marginTop:3,accentColor:'#fff',width:15,height:15}} />
                    {opt}
                </label>
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  if (qType === "summary_completion_select") {
    const summaryText = group.extra_data?.summary_text || ''
    const parts = summaryText.split(/\[(\d+)\]/)
    const qByNum = {}
    qs.forEach(q => { qByNum[q.question_number] = q })
    const opts = Object.entries(group.extra_data?.options || {}).map(([k,v]) => ({key:k,val:v}))
    const usedKeys = new Set(Object.values(answers))
    const available = opts.filter(o => !usedKeys.has(o.key))
    const handleDrop = (qId, e) => {
      e.preventDefault()
      const k = e.dataTransfer.getData('text/plain')
      const prevQ = qs.find(x => x.id !== qId && answers[x.id] === k)
      if (prevQ) setAnswer(prevQ.id, '')
      setAnswer(qId, k)
    }
    return (
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>Questions {qRange}</div>
        <div style={{marginBottom:8,fontSize:15,color:'#000'}}>{group.instruction}</div>
        {group.extra_data?.summary_title && <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>{group.extra_data?.summary_title}</div>}
        <div style={{fontSize:14,lineHeight:2.0}}>
          {parts.map((part, i) => {
            if (i % 2 === 0) return <span key={i}>{part}</span>
            const q = qByNum[Number(part)]
            const qId = q ? q.id : `q${part}`
            const sel = answers[qId] || ''
            const selOpt = opts.find(o => o.key === sel)
            return (
              <span key={i} style={{display:'inline-flex',alignItems:'center',margin:'0 2px'}}>
                <span draggable={!!sel}
                  onDragStart={e => {if(sel){e.dataTransfer.setData('text/plain', sel);e.dataTransfer.effectAllowed='move'}}}
                  onDragOver={e => {e.preventDefault();e.dataTransfer.dropEffect='move'}}
                  onDrop={e => handleDrop(qId, e)}
                  onClick={() => {if(sel)setAnswer(qId,'')}}
                  style={{display:'inline-flex',alignItems:'center',justifyContent:'center',padding:'4px 8px',border:sel?'2px solid #c8102e':'1px dashed #aaa',borderRadius:3,background:'#fff',fontSize:13,lineHeight:0.8,fontWeight:sel?700:500,color:sel?'#c8102e':'#555',cursor:sel?'grab':'default',userSelect:sel?'none':'auto',minWidth:94,transition:'all 0.15s'}}>
                  {selOpt ? <span><span style={{fontWeight:700}}>{selOpt.key}.</span> {selOpt.val}</span> : <span style={{color:'#999',fontSize:14,fontWeight:500}}>{q.question_number}</span>}
                </span>
              </span>
            )
          })}
        </div>
        {opts.length > 0 && (
          <div style={{display:'flex',flexWrap:'wrap',gap:4,marginTop:12}}>
            {available.map(o => (
              <span key={o.key} draggable
                onDragStart={e => {e.dataTransfer.setData('text/plain', o.key);e.dataTransfer.effectAllowed='move'}}
                style={{border:'1px solid #333',borderRadius:3,padding:'3px 8px',fontSize:12,fontWeight:600,background:'#fff',cursor:'grab',userSelect:'none'}}>{o.key}. {o.val}</span>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (qType === "summary" || qType === "summary_completion") {
    const summaryText = group.extra_data?.summary_text || ''
    const parts = summaryText.split(/\[(\d+)\]/)
    const qByNum = {}
    qs.forEach(q => { qByNum[q.question_number] = q })
    return (
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>Questions {qRange}</div>
        <div style={{marginBottom:8,fontSize:15,color:'#000'}}>
          {group.instruction}
        </div>
        {group.extra_data?.summary_title && <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>{group.extra_data?.summary_title}</div>}
        <div style={{fontSize:14,lineHeight:2.0}}>
          {parts.map((part, i) => {
            if (i % 2 === 0) return <span key={i}>{part}</span>
            const q = qByNum[Number(part)]
            const qId = q ? q.id : `q${part}`
            return (
              <span key={i} style={{display:'inline-flex',alignItems:'center'}}>
                <input type="text" value={answers[qId] || ''}
                  onChange={e => setAnswer(qId, e.target.value)}
                  style={{border:'1px solid #999',borderRadius:3,padding:'0px 8px',width:234,fontSize:14,fontWeight:500,color:'#000',outline:'none',textAlign:'center',lineHeight:0.8}}
                  placeholder={part} />
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  if (qType === "multiple_choice" || qType === "choose_title") {
    return (
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>Questions {qRange}</div>
        <div style={{marginBottom:10,fontSize:15,color:'#000'}}>{group.instruction}</div>
        {group.questions.map(q => {
          const opts = group.extra_data?.[String(q.question_number)]?.options || {}
          return (
            <div key={q.id} style={{marginBottom:14}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:6,marginBottom:8}}>
                <span style={{fontSize:14,fontWeight:800,color:'#000',flexShrink:0,lineHeight:1.6}}>{q.question_number}</span>
                <span style={{fontSize:15,lineHeight:1.6}}>{q.prompt}</span>
              </div>
              <div style={{marginLeft:28,display:'flex',flexDirection:'column',gap:6}}>
                {Object.entries(opts).map(([letter, text]) => (
                  <label key={letter} style={{display:'flex',alignItems:'flex-start',gap:8,cursor:'pointer',fontSize:14,background:answers[q.id] === letter ? '#c8102e' : 'transparent',padding:'4px 8px',borderRadius:4,color:answers[q.id] === letter ? '#fff' : '#000'}}>
                    <input type="radio" name={q.id} value={letter} checked={answers[q.id] === letter}
                      onChange={() => setAnswer(q.id, answers[q.id] === letter ? '' : letter)}
                      style={{marginTop:2,accentColor:'#fff',width:15,height:15}} />
                    <strong style={{marginRight:4}}>{letter}.</strong> {text}
                  </label>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (qType === "short_answer" || qType === "sentence_completion" || qType === "flow_chart" || qType === "table_completion" || qType === "diagram_completion" || qType === "diagram_labelling") {
    const chartSteps = group.extra_data?.steps
    const tableHeaders = group.extra_data?.table_headers
    const tableRows = group.extra_data?.table_rows
    const chartTitle = group.extra_data?.chart_title
    return (
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>Questions {qRange}</div>
        <div style={{marginBottom:10,fontSize:15,color:'#000'}}>{group.instruction}</div>
        {chartTitle && <div style={{fontWeight:700,fontSize:14,marginBottom:8,fontStyle:'italic'}}>{chartTitle}</div>}
        {chartSteps && (
          <div style={{marginBottom:12,padding:'10px 14px',background:'#fff',border:'1px solid #eee',borderRadius:4,fontSize:13,lineHeight:1.8}}>
            {chartSteps.map((step, i) => {
              if (step === '↓') return <div key={i} style={{textAlign:'center',color:'#aaa',fontSize:18}}>↓</div>
              const m = step.match(/\[(\d+)\]/)
              if (m) {
                const parts = step.split(/\[\d+\]/)
                const qq = qs.find(x => x.question_number === Number(m[1]))
                return (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap',margin:'4px 0'}}>
                    {parts[0] && <span>{parts[0]}</span>}
                    <input type="text" value={qq ? (answers[qq.id] || '') : ''}
                      onChange={e => { if (qq) setAnswer(qq.id, e.target.value) }}
                      style={{border:'1px solid #999',borderRadius:3,padding:'0px 8px',width:180,fontSize:15,fontWeight:600,color:'#000',outline:'none',textAlign:'center'}}
                      placeholder={m[1]} />
                    {parts[1] && <span>{parts[1]}</span>}
                  </div>
                )
              }
              return <div key={i} style={{margin:'2px 0'}}>{step}</div>
            })}
          </div>
        )}
        {tableHeaders && tableRows && (
          <div style={{marginBottom:12,overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <thead><tr>{tableHeaders.map((h,i) => <th key={i} style={{border:'1px solid #000',padding:'6px 8px',background:'#fff',fontWeight:700,textAlign:'left'}}>{h}</th>)}</tr></thead>
              <tbody>{tableRows.map((row, ri) => (
                <tr key={ri}>{row.map((cell, ci) => {
                  const m = String(cell).match(/\[(\d+)\]/)
                  if (m) {
                    const parts = String(cell).split(/\[\d+\]/)
                    const qq = qs.find(x => x.question_number === Number(m[1]))
                    return <td key={ci} style={{border:'1px solid #000',padding:'4px 6px'}}>
                      {parts[0] && <span>{parts[0]}</span>}
                      <input type="text" value={qq ? (answers[qq.id] || '') : ''}
                        onChange={e => { if (qq) setAnswer(qq.id, e.target.value) }}
                        style={{border:'1px solid #999',borderRadius:3,padding:'0px 8px',width:180,fontSize:15,fontWeight:600,color:'#000',outline:'none',textAlign:'center'}}
                        placeholder={m[1]} />
                      {parts[1] && <span>{parts[1]}</span>}
                    </td>
                  }
                  return <td key={ci} style={{border:'1px solid #000',padding:'4px 6px'}}>{cell}</td>
                })}</tr>))}</tbody>
            </table>
          </div>
        )}
        {!chartSteps && !tableHeaders && qs.map(q => {
          const inline = renderPromptWithBlanks(q.prompt, answers[q.id], v => setAnswer(q.id, v))
          if (inline) {
            return <div key={q.id} style={{marginBottom:10,fontSize:15,lineHeight:1.7}}>
              <span style={{fontSize:14,fontWeight:800,color:'#000',marginRight:6}}>{q.question_number}</span>
              {inline}
            </div>
          }
          return (
            <div key={q.id} style={{marginBottom:10}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:6,marginBottom:6}}>
                <span style={{fontSize:14,fontWeight:800,color:'#000',flexShrink:0,lineHeight:1.6}}>{q.question_number}</span>
                <span style={{fontSize:15,lineHeight:1.6}}>{q.prompt}</span>
              </div>
              <input type="text" value={answers[q.id] || ''}
                onChange={e => setAnswer(q.id, e.target.value)}
                style={{border:'1px solid #999',borderRadius:3,padding:'4px 8px',fontSize:15,fontWeight:600,color:'#000',outline:'none',width:160,boxSizing:'border-box'}} />
            </div>
          )
        })}
      </div>
    )
  }

  if (qType === "match_features" || qType === "match_paragraph_info" || qType === "sentence_endings") {
    const categories = group.extra_data?.categories || group.extra_data?.endings || group.extra_data?.paragraphs || []
    const isParagraphs = Array.isArray(categories)
    const opts = isParagraphs ? categories.map(p => ({key:p,val:''})) : Object.entries(categories).map(([k,v]) => ({key:k,val:v}))

    if (qType === "sentence_endings") {
      const usedKeys = new Set(Object.values(answers))
      const available = opts.filter(o => !usedKeys.has(o.key))
      const handleDrop = (qId, e) => {
        e.preventDefault()
        const k = e.dataTransfer.getData('text/plain')
        const prevQ = qs.find(x => x.id !== qId && answers[x.id] === k)
        if (prevQ) setAnswer(prevQ.id, '')
        setAnswer(qId, k)
      }
      return (
        <div style={{marginBottom:24}}>
          <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>Questions {qRange}</div>
          <div style={{marginBottom:10,fontSize:15,color:'#000'}}>{group.instruction}</div>
          {qs.map(q => {
            const sel = answers[q.id] || ''
            const selOpt = opts.find(o => o.key === sel)
            return (
              <div key={q.id} style={{marginBottom:14}}>
                <div style={{fontSize:15,lineHeight:1.5}}>{q.prompt}</div>
                <div draggable={!!sel}
                  onDragStart={e => {if(sel){e.dataTransfer.setData('text/plain', sel);e.dataTransfer.effectAllowed='move'}}}
                  onDragOver={e => {e.preventDefault();e.dataTransfer.dropEffect='move'}}
                  onDrop={e => handleDrop(q.id, e)}
                  onClick={() => {if(sel)setAnswer(q.id,'')}}
                  style={{marginTop:6,padding:'6px 8px',border:sel?'2px solid #c8102e':'1px dashed #aaa',borderRadius:3,background:'#fff',fontSize:13,lineHeight:0.8,fontWeight:sel?700:500,color:sel?'#c8102e':'#555',cursor:sel?'grab':'default',userSelect:sel?'none':'auto',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}>
                  {selOpt ? <span><span style={{fontWeight:700}}>{selOpt.key}.</span> {selOpt.val}</span> : <span style={{color:'#999',fontSize:16,fontWeight:600}}>{q.question_number}</span>}
                </div>
              </div>
            )
          })}
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
        </div>
      )
    }

    return (
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>Questions {qRange}</div>
        <div style={{marginBottom:10,fontSize:15,color:'#000'}}>{group.instruction}</div>
        <table style={{width:'100%',borderCollapse:'collapse',marginBottom:12}}>
          <thead>
            <tr>
              <th style={{textAlign:'left',padding:'6px 10px',fontWeight:700,fontSize:14,border:'1px solid #333',background:'#fff'}}></th>
              {opts.map(o => (
                <th key={o.key} style={{textAlign:'center',padding:'6px 10px',fontWeight:700,fontSize:14,border:'1px solid #333',background:'#fff',width:50}}>{o.key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {qs.map(q => (
              <tr key={q.id}>
                <td style={{padding:'6px 10px',border:'1px solid #333',fontSize:14}}>
                  <span style={{fontWeight:800,marginRight:6}}>{q.question_number}</span>
                  {q.prompt}
                </td>
                {opts.map(o => (
                  <td key={o.key} style={{textAlign:'center',padding:'6px 10px',border:'1px solid #333'}}>
                    <label style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:'50%',border:answers[q.id] === o.key ? '6px solid #c8102e' : '2px solid #666',cursor:'pointer',background:'#fff',transition:'all 0.1s'}}>
                      <input type="radio" name={`match_${q.id}`} value={o.key}
                        checked={answers[q.id] === o.key}
                        onChange={() => setAnswer(q.id, o.key)}
                        style={{display:'none'}} />
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {opts.some(o => o.val) && (
          <div style={{display:'flex',flexDirection:'column',gap:3}}>
            {opts.map(o => o.val ? (
              <div key={o.key} style={{display:'flex',alignItems:'flex-start',gap:6,fontSize:13,lineHeight:1.5}}>
                <span style={{fontWeight:700,flexShrink:0}}>{o.key}.</span>
                <span style={{color:"#000"}}>{o.val}</span>
              </div>
            ) : null)}
          </div>
        )}
      </div>
    )
  }

  return null
}

export default function ReadingPage() {
  const { testId } = useParams()
  const navigate   = useNavigate()
  const [searchParams] = useSearchParams()
  const isMockTest = searchParams.get('mockTest') === '1'
  const [started, setStarted] = useState(false)

  const [section,       setSection]       = useState(null)
  const [answers,       setAnswers]       = useState({})
  const [flagged,       setFlagged]       = useState(new Set())
  const [loading,       setLoading]       = useState(true)
  const [submitting,    setSubmitting]    = useState(false)
  const [activePassage, setActivePassage] = useState(0)
  const [expandedPart, setExpandedPart] = useState(null)
  const [passageHtml,   setPassageHtml]   = useState({})
  const [selectedText,  setSelectedText]  = useState('')
  const [showModal,     setShowModal]     = useState(false)
  const [showReview,    setShowReview]    = useState(false)

  const [splitPercent,  setSplitPercent]  = useState(52)
  const [dragging,      setDragging]      = useState(false)
  const [dragOverPara,  setDragOverPara]  = useState(null)

  const handleDividerMouseDown = useCallback((e) => {
    e.preventDefault(); setDragging(true)
  }, [])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => {
      const container = document.getElementById('split-pane-container')
      if (!container) return
      const rect = container.getBoundingClientRect()
      const pct = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 30), 75)
      setSplitPercent(pct)
    }
    const onUp = () => setDragging(false)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  }, [dragging])

  const handleHeadingDrop = useCallback((e, paraIdx) => {
    e.preventDefault()
    setDragOverPara(null)
    const roman = e.dataTransfer.getData('text/plain')
    if (!roman) return
    const allGroups = section?.question_groups || []
    const mhGroup = allGroups.find(g =>
      g.passage_number === activePassage + 1 && g.question_type === 'match_headings'
    )
    if (!mhGroup) return
    const q = mhGroup.questions[paraIdx]
    if (q) setAnswers(p => ({ ...p, [q.id]: p[q.id] === roman ? '' : roman }))
  }, [section, activePassage])

  useEffect(() => {
    ;(async () => {
      try {
        const [secRes, sessRes] = await Promise.all([
          testsApi.getReading(testId),
          sessionsApi.my(),
        ])
        const data = secRes.data
        if (data.passages) {
          data.passages.sort((a, b) => a.passage_number - b.passage_number)
        }
        if (data.question_groups) {
          data.question_groups.sort((a, b) => a.order_index - b.order_index)
        }
        setSection(data)
        if (isMockTest) {
          const sid = mockTestProgress.getSessionId()
          if (sid) sessionRef.current = sid
        }
        if (!sessionRef.current) {
          const active = sessRes.data.find(
            s => s.test_id == testId && s.section_type === 'reading' && s.status === 'in_progress'
          )
          if (active) sessionRef.current = active.id
        }
      } catch {
        toast.error('Failed to load reading test')
        navigate('/tests')
      } finally { setLoading(false) }
    })()
  }, [testId])

  useEffect(() => {
    if (!section?.passages?.length) return
    setPassageHtml(section.passages.reduce((acc, p, i) => {
      acc[i] = buildHtml(p.body || ''); return acc
    }, {}))
  }, [section])

  const timerRunning = isMockTest ? !!section : (!!section && started)
  const { seconds } = useTimer(
    section?.time_limit_seconds || 3600,
    undefined,
    timerRunning
  )

  useEffect(() => {
    elapsedRef.current = (section?.time_limit_seconds || 3600) - seconds
  }, [seconds])

  const sessionRef   = useRef(null)
  const passageRef   = useRef(null)
  const bodyRef      = useRef(null)
  const selRef       = useRef(null)
  const elapsedRef   = useRef(0)

  const isLow  = seconds < 300
  const isCrit = seconds < 60

  const allGroups = section?.question_groups || []
  const passages  = section?.passages || []

  const passageGroupsFn = (pIdx) =>
    allGroups.filter(g => !g.passage_number || g.passage_number === pIdx + 1)

  const passageQs = (pIdx) =>
    passageGroupsFn(pIdx).flatMap(g => g.questions)
      .sort((a, b) => a.question_number - b.question_number)

  const totalQs  = passages.flatMap((_, i) => passageQs(i)).length
  const answered = Object.values(answers).filter(v => v && v !== '').length

  const handleAnswer = (qId, val) => setAnswers(p => ({ ...p, [qId]: val }))
  const toggleFlag   = (qId) => setFlagged(p => {
    const n = new Set(p); n.has(qId) ? n.delete(qId) : n.add(qId); return n
  })

  const clearSel = () => {
    selRef.current = null; setSelectedText(''); window.getSelection()?.removeAllRanges()
  }

  const handleMouseUp = () => {
    const sel = window.getSelection(), el = passageRef.current
    if (!sel || !el || sel.rangeCount === 0) { clearSel(); return }
    if (!el.contains(sel.anchorNode) || !el.contains(sel.focusNode)) { clearSel(); return }
    const text = sel.toString().trim()
    if (!text) { clearSel(); return }
    selRef.current = sel.getRangeAt(0).cloneRange()
    setSelectedText(text)
  }

  const applyMark = (type) => {
    const container = bodyRef.current, range = selRef.current
    if (!container || !range || !selectedText) return
    try {
      const el = document.createElement(type === 'highlight' ? 'mark' : 'span')
      if (type === 'underline') {
        el.style.cssText = 'text-decoration:underline;text-decoration-color:#CC0000;text-decoration-thickness:2px;text-underline-offset:3px;'
      } else {
        el.style.cssText = 'background:rgba(254,240,138,0.75);border-radius:2px;padding:0 1px;'
      }
      el.appendChild(range.extractContents())
      range.insertNode(el)
      setPassageHtml(p => ({ ...p, [activePassage]: container.innerHTML }))
      clearSel()
    } catch { toast.error('Could not apply — try a different selection') }
  }

  const clearAllMarks = () => {
    const c = bodyRef.current; if (!c) return
    c.querySelectorAll('mark,[style*="underline"]').forEach(el =>
      el.replaceWith(document.createTextNode(el.textContent))
    )
    c.normalize()
    setPassageHtml(p => ({ ...p, [activePassage]: c.innerHTML }))
    clearSel(); toast.success('Annotations cleared')
  }

  const starWord = async () => {
    if (!selectedText || selectedText.split(' ').length > 3) return
    try {
      await vocabApi.star({
        word: selectedText,
        context_sentence: '',
        passage_title: passages[activePassage]?.title,
      })
      toast.success(`"${selectedText}" added to vocabulary`)
      clearSel()
    } catch {}
  }

  const handleSubmit = async (auto = false) => {
    if (submitting) return
    setSubmitting(true); setShowModal(false)
    try {
      const allQuestions = section.question_groups.flatMap(g => g.questions)
      const res = await sessionsApi.submit({
        session_id: sessionRef.current,
        answers: allQuestions.map(q => ({
          question_id: q.id,
          given_answer: answers[q.id] || '',
        })),
        time_taken_seconds: elapsedRef.current,
      })
      if (res.data) {
        res.data.band_score = calculateReadingBand(res.data.correct_answers, res.data.total_questions)
      }
      if (isMockTest) {
        mockTestProgress.saveResult('reading', res.data)
        try {
          const startRes = await sessionsApi.start({ test_id: testId, section_type: 'writing' })
          mockTestProgress.setSessionId(startRes.data.id ?? startRes.data.session_id)
          navigate(`/test/${testId}/writing?mockTest=1`, { replace: true })
        } catch {
          navigate(`/mock-test-result?testId=${testId}`, { replace: true })
        }
      } else {
        navigate(`/result/${res.data.session_id}`, { state: { result: res.data } })
      }
    } catch(err) {
      const errMsg = err?.response?.data?.detail
      toast.error(typeof errMsg === 'string' ? errMsg : 'Submission failed')
      setSubmitting(false)
    }
  }

  const scrollToQ = (qId, pIdx) => {
    if (pIdx !== undefined) setActivePassage(pIdx)
    setTimeout(() => document.getElementById(`q-${qId}`)?.scrollIntoView({ behavior:'smooth', block:'center' }), 80)
  }

  if (loading) return <LoadingScreen message="Loading reading test…" />
  if (!section) return null

  const passage = passages[activePassage]
  const pGroups = passageGroupsFn(activePassage)
  const pQs     = passageQs(activePassage)

  const allQIds = allGroups.flatMap(g => {
    if (g.question_type === "mcq_multi") return g.extra_data?.subGroups?.flatMap(sg => sg.ids) || []
    return g.questions?.map(q => q.id) || []
  })

  /* ── Build question number lists per passage for bottom nav ── */
  const partNums = passages.map((_, i) => passageQs(i).map(q => q.question_number))

  return (
    <>
      {!started && !isMockTest && <StartOverlay onStart={() => setStarted(true)} moduleName="Reading" icon={<ReadingIcon size={28} color="#CC0000" />} />}
      <style>{`
        .rp-body p{margin-bottom:0;line-height:1.9;font-family:Arial,sans-serif;}
        .rp-body mark{background:rgba(254,240,138,.75);border-radius:2px;padding:0 1px;}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:#ccc;border-radius:0;}
        ::-webkit-scrollbar-track{background:#f5f5f5;}
      `}</style>

      <div style={{fontFamily:"Arial, sans-serif",height:"100vh",display:"flex",flexDirection:"column",background:"#fff",fontSize:15,color:"#000"}}>

        {/* ═══ TOP BAR  ═══ */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #ccc",padding:"0 20px",height:52,flexShrink:0,background:"#fff"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <img src={ieltsLogo} alt="IELTS" style={{height:28,width:'auto'}} />
            <span style={{fontSize:14,color:"#333",borderLeft:"1px solid #ccc",paddingLeft:12}}>Test taker ID</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            {passages.length > 1 && (
              <div style={{display:'flex',gap:2,marginRight:8}}>
                {passages.map((_, i) => (
                  <button key={i} onClick={() => setActivePassage(i)}
                    style={{
                      padding:'4px 10px', fontSize:13, fontWeight: activePassage === i ? 700 : 400,
                      border:'none', background: activePassage === i ? '#e8e8e8' : 'transparent',
                      borderRadius:3, cursor:'pointer', color:'#333',
                    }}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
            {/* Timer */}
            <span style={{fontSize:14,fontWeight:700,color: isCrit ? '#c8102e' : isLow ? '#cc6600' : '#333',fontFamily:'monospace'}}>
              {fmt(seconds)}
            </span>
            <button onClick={() => setShowReview(p => !p)}
              style={{background:'none',border:'1px solid #ccc',borderRadius:4,padding:'4px 10px',fontSize:13,cursor:'pointer',color:'#333'}}>
              Review
            </button>
            <button onClick={() => setShowModal(true)} disabled={submitting}
              style={{background:'#c8102e',color:'#fff',border:'none',borderRadius:4,padding:'5px 14px',fontSize:13,fontWeight:700,cursor:submitting?'not-allowed':'pointer',opacity:submitting?0.6:1}}>
              Submit
            </button>
            <span style={{fontSize:22,cursor:'pointer'}}>☰</span>
          </div>
        </div>

        
        <div style={{background:"#f5f5f5",border:"1px solid #ccc",padding:"4px 10px 6px",fontSize:16,flexShrink:0,margin:"16px 24px 0",borderRadius:4}}>
          <div><strong>Part {activePassage + 1}</strong></div>
          <div style={{color:"#555",fontWeight:500,fontSize:16}}>
            Read the text and answer questions {pQs.length ? `${pQs[0].question_number}–${pQs[pQs.length-1].question_number}` : ''}.
          </div>
        </div>



        {/* ═══ MAIN SPLIT PANE ═══ */}
        <div id="split-pane-container" style={{display:"flex",flex:1,overflow:"hidden",}}>

          {/* ─── LEFT: Passage ─── */}
          <div style={{width:`${splitPercent}%`,display:"flex",flexDirection:"column",borderRight:"1px solid #ccc",overflow:"hidden"}}
            className="flex lg:flex">
            {/* Annotations */}
            {selectedText && (
              <div style={{flexShrink:0,padding:'4px 16px',background:'#fff',display:'flex',alignItems:'center',gap:4,flexWrap:'wrap',minHeight:32,animation:'fadeIn 0.2s ease-in'}}>
                <span style={{fontSize:11,fontWeight:700,color:'#666',textTransform:'uppercase',letterSpacing:1,marginRight:4}}>Annotate:</span>
                <button onClick={() => applyMark('highlight')}
                  style={{display:'inline-flex',alignItems:'center',gap:3,padding:'2px 8px',fontSize:12,border:'1px solid #ccc',borderRadius:3,background:'#fff',cursor:'pointer'}}>
                  <Highlighter size={11}/>Highlight</button>
                <button onClick={() => applyMark('underline')}
                  style={{display:'inline-flex',alignItems:'center',gap:3,padding:'2px 8px',fontSize:12,border:'1px solid #ccc',borderRadius:3,background:'#fff',cursor:'pointer'}}>
                  <UnderlineIcon size={11}/>Underline</button>
                {selectedText.split(' ').length <= 3 && (
                  <button onClick={starWord}
                    style={{display:'inline-flex',alignItems:'center',gap:3,padding:'2px 8px',fontSize:12,border:'1px solid #ccc',borderRadius:3,background:'#fff',cursor:'pointer'}}>
                    <Star size={11}/>Star</button>
                )}
                <button onClick={clearAllMarks}
                  style={{display:'inline-flex',alignItems:'center',gap:3,padding:'2px 8px',fontSize:12,border:'1px solid #ccc',borderRadius:3,background:'#fff',cursor:'pointer'}}>
                  <X size={11}/>Clear</button>
              </div>
            )}

            <div style={{flex:1,overflowY:"auto",padding:"28px 32px",background:'#fff'}} ref={passageRef} onMouseUp={handleMouseUp}>
              <h2 style={{fontSize:22,fontWeight:700,marginBottom:18,marginTop:0,color:'#333'}}>{passages[activePassage]?.title}</h2>
              <div className="rp-body select-text" ref={bodyRef}
                style={{fontFamily:'Arial,sans-serif',fontSize:17,lineHeight:1.9,color:'#000'}}>
                {(() => {
                  const mhGroup = allGroups.find(g =>
                    g.passage_number === activePassage + 1 && g.question_type === 'match_headings'
                  )
                  const html = passageHtml[activePassage] || buildHtml(passages[activePassage]?.body || '')
                  const paraTags = html.match(/<p>[\s\S]*?<\/p>/g) || []
                  const romans = ['i','ii','iii','iv','v','vi','vii','viii','ix','x']
                  return paraTags.map((paraHtml, pi) => {
                    const isDropTarget = mhGroup && pi < mhGroup.questions.length
                    const q = isDropTarget ? mhGroup.questions[pi] : null
                    const selectedVal = q ? answers[q.id] : null
                    const over = dragOverPara === pi
                    return (
                      <div key={pi} style={{position:'relative',marginBottom:18}}
                        onDragOver={isDropTarget ? (e) => { e.preventDefault(); setDragOverPara(pi) } : undefined}
                        onDragLeave={isDropTarget ? () => setDragOverPara(null) : undefined}
                        onDrop={isDropTarget ? (e) => handleHeadingDrop(e, pi) : undefined}>
                        {isDropTarget && (
                          <div style={{
                            display:'flex',alignItems:'center',justifyContent:'center',
                            padding:'4px 10px',marginBottom:6,borderRadius:3,
                            border: over ? '2px solid #c8102e' : '1px dashed #aaa',
                            background: over ? '#fff8e1' : '#fff',
                            minHeight:28,fontSize:13,fontWeight:700,color: selectedVal ? '#c8102e' : '#555',cursor:'default',
                            transition:'all 0.15s',
                          }}>
                            {selectedVal ? (
                              <span style={{fontWeight:700}}>
                                {mhGroup.extra_data?.headings?.[romans.indexOf(selectedVal)] || selectedVal}
                              </span>
                            ) : (
                              <span>{q.question_number}</span>
                            )}
                          </div>
                        )}
                        <div className="rp-para"
                          dangerouslySetInnerHTML={{__html: paraHtml}}
                          style={{
                            marginBottom:0,
                            border: over && !selectedVal ? '2px dashed #c8102e' : 'none',
                            borderRadius: over && !selectedVal ? 4 : 0,
                            padding: over && !selectedVal ? '4px 8px' : 0,
                            transition: 'border 0.15s, padding 0.15s',
                          }} />
                      </div>
                    )
                  })
                })()}
              </div>
            </div>
          </div>

          {/* ─── DRAGGABLE DIVIDER ─── */}
          <div
            onMouseDown={handleDividerMouseDown}
            style={{
              width:8,display:"flex",alignItems:"center",justifyContent:"center",
              background: dragging ? '#c8102e' : '#e8e8e8',
              borderRight:"1px solid #ccc",cursor:"col-resize",flexShrink:0,
              transition: dragging ? 'none' : 'background 0.2s',
            }}
            className="hidden lg:flex">
            <div style={{width:2,height:24,background: dragging ? '#fff' : '#aaa',borderRadius:1}} />
          </div>

          {/* ─── RIGHT: Questions ─── */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}
            className="flex lg:flex">
            <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
              {pGroups.map(group => (
                <QuestionGroup key={group.id} group={group} answers={answers} setAnswer={handleAnswer} toggleFlag={toggleFlag} passageIdx={activePassage} />
              ))}
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM NAV — design.txt exact ═══ */}
        <div style={{borderTop:"1px solid #ccc",padding:"8px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",flexShrink:0,flexWrap:'wrap',gap:6}}>
          <div style={{display:"flex",flex:1,justifyContent:'space-between'}}>
            {partNums.map((nums, pIdx) => {
              const total = nums.length
              const answered = nums.filter(n => {
                const q = passageQs(pIdx).find(qq => qq.question_number === n)
                return q && answers[q.id]
              }).length
              const isExpanded = expandedPart === pIdx
              return (
                <div key={pIdx} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}
                  onClick={() => setExpandedPart(isExpanded ? null : pIdx)}>
                  <span style={{fontSize:15,fontWeight:600,color:'#333'}}>Part {pIdx + 1}</span>
                  {isExpanded ? (
                    nums.map(n => {
                      const q = passageQs(pIdx).find(qq => qq.question_number === n)
                      const ans = q ? answers[q.id] : undefined
                      return (
                        <span key={n} onClick={(e) => {
                          e.stopPropagation()
                          setActivePassage(pIdx)
                          if (q) setTimeout(() => document.getElementById(`q-${q.id}`)?.scrollIntoView({behavior:'smooth',block:'center'}), 80)
                        }}
                          style={{
                            minWidth:22,height:22,borderRadius:3,display:'inline-flex',alignItems:'center',justifyContent:'center',
                            border: "1px solid #aaa",
                            background: ans ? "#555" : "#fff",
                            color: ans ? "#fff" : "#333",
                            fontSize:11,fontWeight:600,
                            cursor:"pointer",padding:"0 2px",
                          }}>
                          {n}
                        </span>
                      )
                    })
                  ) : (
                    <span style={{fontSize:15,fontWeight:600,color:'#000'}}>{answered} of {total}</span>
                  )}
                </div>
              )
            })}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <button onClick={() => setActivePassage(p => Math.max(0, p - 1))}
              style={{background:"#333",color:"#fff",border:"none",borderRadius:4,width:32,height:32,cursor:"pointer",fontSize:22,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>❮</button>
            <button onClick={() => setActivePassage(p => Math.min(passages.length - 1, p + 1))}
              style={{background:"#333",color:"#fff",border:"none",borderRadius:4,width:32,height:32,cursor:"pointer",fontSize:22,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>❯</button>
          </div>
        </div>

        {/* ═══ REVIEW PANEL ═══ */}
        {showReview && (
          <div style={{position:'fixed',inset:0,zIndex:40,display:'flex',justifyContent:'flex-end'}} onClick={() => setShowReview(false)}>
            <div style={{background:'#fff',width:'85vw',maxWidth:360,height:'100%',borderLeft:'1px solid #ccc',display:'flex',flexDirection:'column'}} onClick={e => e.stopPropagation()}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid #ddd'}}>
                <h3 style={{fontSize:15,fontWeight:600,color:'#333'}}>Answer Review</h3>
                <button onClick={() => setShowReview(false)} style={{padding:4,cursor:'pointer',background:'none',border:'none',color:'#888',fontSize:20}}>✕</button>
              </div>
              <div style={{flex:1,overflowY:'auto',padding:'16px 20px'}}>
                {passages.map((_, pIdx) => (
                  <div key={pIdx} style={{marginBottom:16}}>
                    <p style={{fontSize:12,fontWeight:700,color:'#666',textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Passage {pIdx + 1}</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                      {passageQs(pIdx).map(q => {
                        const ans = answers[q.id]
                        return (
                          <button key={q.id} onClick={() => { setShowReview(false); scrollToQ(q.id, pIdx) }}
                            style={{
                              width:32,height:32,fontSize:12,fontWeight:700,borderRadius:4,cursor:'pointer',
                              border: flagged.has(q.id) ? '2px solid #f0ad4e' : ans ? '2px solid #555' : '1px solid #aaa',
                              background: ans ? '#555' : flagged.has(q.id) ? '#fef9e7' : '#fff',
                              color: ans ? '#fff' : '#333',
                            }}>
                            {q.question_number}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:'16px 20px',borderTop:'1px solid #ddd',background:'#fff'}}>
                <p style={{fontSize:13,color:'#666',textAlign:'center',marginBottom:8}}>{answered}/{totalQs} answered</p>
                <button onClick={() => { setShowReview(false); setShowModal(true) }}
                  style={{width:'100%',padding:'12px 0',background:'#c8102e',color:'#fff',border:'none',borderRadius:4,fontSize:15,fontWeight:700,cursor:'pointer'}}>
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SUBMIT MODAL ═══ */}
        {showModal && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
            <div style={{background:'#fff',width:'100%',maxWidth:440,padding:24,border:'1px solid #000'}}>
              <h3 style={{fontSize:18,fontWeight:700,color:'#333',marginBottom:4}}>Submit Reading Test?</h3>
              <p style={{fontSize:14,color:'#555',marginBottom:16}}>
                You've answered <strong>{answered}</strong> of <strong>{totalQs}</strong> questions.
                {answered < totalQs && <span style={{color:'#c8102e',fontWeight:600}}> {totalQs - answered} unanswered.</span>}
              </p>
              <div style={{marginBottom:20,maxHeight:160,overflowY:'auto',paddingRight:4}}>
                {passages.map((_, pIdx) => (
                  <div key={pIdx} style={{marginBottom:12}}>
                    <p style={{fontSize:11,fontWeight:700,color:'#666',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Passage {pIdx + 1}</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:2}}>
                      {passageQs(pIdx).map(q => (
                        <div key={q.id} style={{
                          width:26,height:26,fontSize:11,fontWeight:700,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          border:'1px solid #aaa',
                          background: answers[q.id] ? '#555' : '#fff',
                          color: answers[q.id] ? '#fff' : '#333',
                        }}>
                          {q.question_number}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={() => setShowModal(false)}
                  style={{flex:1,padding:'10px 0',fontSize:15,fontWeight:600,color:'#333',border:'1px solid #ccc',borderRadius:4,background:'#fff',cursor:'pointer'}}>Review Test</button>
                <button onClick={() => handleSubmit(false)} disabled={submitting}
                  style={{flex:1,padding:'10px 0',fontSize:14,fontWeight:700,color:'#fff',background:'#c8102e',border:'none',borderRadius:4,cursor:submitting?'not-allowed':'pointer',opacity:submitting?0.6:1}}>
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
