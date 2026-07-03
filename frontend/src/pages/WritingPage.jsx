import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { testsApi, submissionsApi, sessionsApi } from '../utils/api'
import { mockTestProgress } from '../utils/mockTestProgress'
import { useTimer } from '../hooks/useTimer'
import { LoadingScreen, StartOverlay } from '../components/ui'
import toast from 'react-hot-toast'
import { wordCount } from '../utils/helpers'
import logo from '../assets/hu.png'
import defaultWritingImg from '../assets/defaultwriting.png'

const fmt = (s) => {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

export default function WritingPage() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isMockTest = searchParams.get('mockTest') === '1'
  const [started, setStarted] = useState(false)
  const [section, setSection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTask, setActiveTask] = useState(0)
  const [essays, setEssays] = useState({})
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const sessionRef = useRef(null)
  const elapsedRef = useRef(0)
  const textareaRef = useRef(null)

  const [loadError, setLoadError] = useState(null)
  const [splitPercent, setSplitPercent] = useState(45)
  const [dragging, setDragging] = useState(false)

  const handleDividerMouseDown = useCallback((e) => {
    e.preventDefault(); setDragging(true)
  }, [])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => {
      const container = document.getElementById('writing-split-container')
      if (!container) return
      const rect = container.getBoundingClientRect()
      const pct = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 25), 65)
      setSplitPercent(pct)
    }
    const onUp = () => setDragging(false)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  }, [dragging])

  useEffect(() => {
    const load = async () => {
      try {
        const [secRes, sessRes] = await Promise.all([
          testsApi.getWriting(testId),
          sessionsApi.my(),
        ])
        setSection(secRes.data)
        if (isMockTest) {
          const sid = mockTestProgress.getSessionId()
          if (sid) sessionRef.current = sid
        }
        if (!sessionRef.current) {
          const active = sessRes.data.find(
            s => s.test_id == testId && s.section_type === 'writing' && s.status === 'in_progress'
          )
          if (active) sessionRef.current = active.id
        }
      } catch (err) {
        const detail = err?.response?.data?.detail || err.message || 'Unknown error'
        setLoadError(detail)
        if (!isMockTest) {
          toast.error('Failed to load writing test')
          navigate('/tests')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [testId])

  const handleSubmit = async (auto = false) => {
    if (submitting) return
    const task = section?.writing_tasks?.[activeTask]
    const essay = essays[task?.id] || ''
    setShowSubmitModal(false)

    if (auto && essay.length < 50) {
      toast.dismiss('scoring')
      if (isMockTest) {
        const isLastTask = activeTask >= section.writing_tasks.length - 1
        mockTestProgress.saveResult('writing', { overall_band: 0 })
        if (isLastTask) {
          try {
            const startRes = await sessionsApi.start({ test_id: testId, section_type: 'speaking' })
            mockTestProgress.setSessionId(startRes.data.id ?? startRes.data.session_id)
            navigate(`/test/${testId}/speaking?mockTest=1`, { replace: true })
          } catch {
            navigate(`/mock-test-result?testId=${testId}`, { replace: true })
          }
        } else {
          setActiveTask(p => p + 1)
        }
      } else {
        navigate('/tests', { replace: true })
      }
      return
    }

    setSubmitting(true)
    toast.loading('Scoring your essay with AI…', { id: 'scoring' })
    try {
      const res = await submissionsApi.submitWriting({
        task_id: task.id,
        session_id: sessionRef.current,
        essay_text: essay,
        time_taken_seconds: elapsedRef.current,
      })
      toast.dismiss('scoring')
      toast.success('Essay scored!')

      const isLastTask = activeTask >= section.writing_tasks.length - 1
      if (isMockTest) {
        mockTestProgress.saveResult('writing', res.data)
        if (isLastTask) {
          try {
            const startRes = await sessionsApi.start({ test_id: testId, section_type: 'speaking' })
            mockTestProgress.setSessionId(startRes.data.id ?? startRes.data.session_id)
            navigate(`/test/${testId}/speaking?mockTest=1`, { replace: true })
          } catch {
            navigate(`/mock-test-result?testId=${testId}`, { replace: true })
          }
        } else {
          setActiveTask(p => p + 1)
          setSubmitting(false)
        }
      } else {
        navigate(`/writing-result/${res.data.id}`, { state: { submission: res.data } })
      }
    } catch (err) {
      toast.dismiss('scoring')
      const errMsg = err.response?.data?.detail
      if (isMockTest) {
        mockTestProgress.saveResult('writing', { overall_band: 0, error: typeof errMsg === 'string' ? errMsg : 'Submission failed' })
        if (activeTask >= section.writing_tasks.length - 1) {
          try {
            const startRes = await sessionsApi.start({ test_id: testId, section_type: 'speaking' })
            mockTestProgress.setSessionId(startRes.data.id ?? startRes.data.session_id)
            navigate(`/test/${testId}/speaking?mockTest=1`, { replace: true })
          } catch {
            navigate(`/mock-test-result?testId=${testId}`, { replace: true })
          }
        } else {
          setActiveTask(p => p + 1)
          setSubmitting(false)
        }
      } else {
        toast.error(typeof errMsg === 'string' ? errMsg : 'Submission failed')
        setSubmitting(false)
      }
    }
  }

  const timerRunning = isMockTest ? !!section : (!!section && started)
  const { seconds } = useTimer(
    section?.time_limit_seconds || 3600,
    () => { toast('Time up! Submitting…', { icon: '⏰' }); handleSubmit(true) },
    timerRunning
  )

  useEffect(() => {
    elapsedRef.current = (section?.time_limit_seconds || 3600) - seconds
  }, [seconds])

  if (loading) return <LoadingScreen message="Loading writing test…" />
  if (!section) {
    if (isMockTest) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center max-w-md px-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Could not load Writing test</h2>
            <p className="text-sm text-gray-500 mb-2">{typeof loadError === 'string' ? loadError : 'No writing data available for this test.'}</p>
            <p className="text-xs text-gray-400 mb-6">Test ID: {testId}</p>
            <button onClick={() => navigate('/mock-test-result' + (testId ? `?testId=${testId}` : ''), { replace: true })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold"
              style={{ background: '#CC0000' }}>
              Skip to Results
            </button>
          </div>
        </div>
      )
    }
    return null
  }

  const task = section.writing_tasks?.[activeTask]
  const essay = essays[task?.id] || ''
  const wc = wordCount(essay)
  const minWords = task?.min_words || 150
  const pct = Math.min(100, (wc / minWords) * 100)
  const isLow = seconds < 300
  const isCritical = seconds < 60
  const wcOk = wc >= minWords
  const wcNear = wc >= minWords * 0.8

  return (
    <>
      {!started && !isMockTest && <StartOverlay onStart={() => setStarted(true)} moduleName="Writing" />}
      <div style={{fontFamily:"Arial, sans-serif",height:"100vh",display:"flex",flexDirection:"column",background:"#fff",fontSize:15,color:"#000"}}>

        {/* ═══ TOP BAR ═══ */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #ccc",padding:"0 20px",height:52,flexShrink:0,background:"#fff"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <img src={logo} alt="IELTS" style={{height:28,width:'auto'}} />
            <span style={{fontSize:14,color:"#333",borderLeft:"1px solid #ccc",paddingLeft:12}}>Test taker ID</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <span style={{fontSize:14,fontWeight:700,color: isCritical ? '#c8102e' : isLow ? '#cc6600' : '#333',fontFamily:'monospace'}}>
              {fmt(seconds)}
            </span>
            <button onClick={() => setShowSubmitModal(true)} disabled={submitting}
              style={{background:'#c8102e',color:'#fff',border:'none',borderRadius:4,padding:'5px 14px',fontSize:13,fontWeight:700,cursor:submitting?'not-allowed':'pointer',opacity:submitting?0.6:1}}>
              Submit
            </button>
          </div>
        </div>

        {/* ═══ INFO BAR ═══ */}
        <div style={{background:"#f5f5f5",border:"1px solid #ccc",padding:"6px 12px 8px",fontSize:16,flexShrink:0,margin:"16px 24px 0",borderRadius:4}}>
          <div><strong>Part {task?.task_number}</strong></div>
          <div style={{color:"#555",fontWeight:500}}>
            You should spend about {task?.task_type === 'task2' ? 40 : 20} minutes on this task. Write at least {task?.min_words || 150} words.
          </div>
        </div>

        {/* ═══ MAIN SPLIT PANE ═══ */}
        <div id="writing-split-container" style={{display:"flex",flex:1,overflow:"hidden"}}>

          {/* ─── LEFT: Task prompt ─── */}
          <div style={{width:`${splitPercent}%`,display:"flex",flexDirection:"column",borderRight:"1px solid #ccc",overflow:"hidden",background:"#fff"}}>

            {/* Prompt body */}
            <div style={{flex:1,overflowY:"auto",padding:"28px 32px",background:"#fff"}}>

              <div style={{fontSize:19,lineHeight:1.9,color:'#000',whiteSpace:'pre-wrap'}}>{task?.prompt}</div>

              {task?.task_type === 'task1' && (
                <img
                  src={task?.image_url || defaultWritingImg}
                  alt="Task visual"
                  style={{width:'100%',marginTop:20}}
                  onError={(e) => { e.target.src = defaultWritingImg }}
                />
              )}

              {task?.sample_answer && (
                <details className="group" style={{marginTop:20}}>
                  <summary style={{fontSize:13,color:'#333',cursor:'pointer',fontWeight:600}}>
                    View sample answer
                  </summary>
                  <div style={{marginTop:8,padding:12,border:'1px solid #ddd',background:'#fff',fontSize:13,lineHeight:1.7,color:'#333'}}>
                    {task.sample_answer}
                  </div>
                </details>
              )}

              {section.writing_tasks?.length > 1 && (
                <div style={{display:'flex',justifyContent:'space-between',marginTop:20}}>
                  <button disabled={activeTask === 0}
                    onClick={() => setActiveTask(p => p - 1)}
                    style={{fontSize:12,color:'#333',cursor:activeTask===0?'not-allowed':'pointer',fontWeight:600,background:'none',border:'none',opacity:activeTask===0?0.3:1}}>
                    Previous
                  </button>
                  <button disabled={activeTask === section.writing_tasks.length - 1}
                    onClick={() => setActiveTask(p => p + 1)}
                    style={{fontSize:12,color:'#333',cursor:activeTask===section.writing_tasks.length-1?'not-allowed':'pointer',fontWeight:600,background:'none',border:'none',opacity:activeTask===section.writing_tasks.length-1?0.3:1}}>
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ─── DRAGGABLE DIVIDER ─── */}
          <div onMouseDown={handleDividerMouseDown}
            style={{
              width:8,display:"flex",alignItems:"center",justifyContent:"center",
              background: dragging ? '#c8102e' : '#e8e8e8',
              borderRight:"1px solid #ccc",cursor:"col-resize",flexShrink:0,
              transition: dragging ? 'none' : 'background 0.2s',
            }}>
            <div style={{width:2,height:24,background:dragging?'#fff':'#aaa',borderRadius:1}} />
          </div>

          {/* ─── RIGHT: Essay area ─── */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#fff"}}>

            <div style={{flex:1,overflow:'hidden',padding:'20px 24px 8px',background:'#fff'}}>
              <textarea ref={textareaRef} value={essay}
                onChange={e => setEssays(prev => ({ ...prev, [task.id]: e.target.value }))}
                placeholder={`Begin your ${task?.task_type === 'task1' ? 'report' : 'essay'} here…`}
                style={{
                  width:'100%',height:'100%',resize:'none',padding:16,
                  fontFamily:'Arial, sans-serif',fontSize:14,lineHeight:1.7,
                  border:'1px solid #ccc',borderRadius:4,
                  background:'#fff',color:'#000',outline:'none',
                }}
                spellCheck />
            </div>

            <div style={{flexShrink:0,display:'flex',alignItems:'center',justifyContent:'flex-end',gap:8,padding:'0 24px 12px'}}>
              <span style={{fontSize:12,fontWeight:700,color:'#000'}}>
                {wc} words
              </span>
              <span style={{fontSize:12,fontWeight:700,color:'#000'}}>/ min {minWords}</span>
            </div>
          </div>
        </div>

        {/* ═══ SUBMIT MODAL ═══ */}
        {showSubmitModal && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
            <div style={{background:'#fff',width:'100%',maxWidth:400,padding:24,border:'1px solid #000'}}>
              <p style={{fontSize:18,fontWeight:700,color:'#333',marginBottom:4}}>Submit Writing Test?</p>
              <p style={{fontSize:14,color:'#555',marginBottom:16}}>
                Task {task?.task_number} · {' '}
                <span style={{fontWeight:700,color: wcOk ? '#16a34a' : '#dc2626'}}>
                  {wc} words
                </span>
                {!wcOk && (
                  <span style={{color:'#dc2626',fontWeight:600}}> (minimum {minWords} — {minWords - wc} short)</span>
                )}
              </p>

              {section.writing_tasks?.length > 1 && (
                <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
                  {section.writing_tasks.map((t, i) => {
                    const tw = wordCount(essays[t.id] || '')
                    const done = tw >= t.min_words
                    return (
                      <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 12px',border:'1px solid #ccc'}}>
                        <span style={{fontWeight:600,fontSize:12,color:'#333'}}>Task {t.task_number}</span>
                        <span style={{fontWeight:600,fontSize:12,color: done ? '#16a34a' : '#dc2626'}}>
                          {tw} / {t.min_words} words {done ? '✓' : '✗'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              <div style={{display:'flex',alignItems:'flex-start',gap:8,padding:12,border:'1px solid #ccc',marginBottom:20,background:'#fff'}}>
                <p style={{fontSize:12,color:'#555'}}>
                  Your essay will be scored on Task Achievement, Coherence, Lexical Resource, and Grammar.
                </p>
              </div>

              <div style={{display:'flex',gap:8}}>
                <button onClick={() => setShowSubmitModal(false)}
                  style={{flex:1,padding:'10px 0',fontSize:14,fontWeight:600,color:'#333',border:'1px solid #ccc',borderRadius:4,background:'#fff',cursor:'pointer'}}>
                  Continue Writing
                </button>
                <button onClick={() => handleSubmit(false)} disabled={submitting}
                  style={{flex:1,padding:'10px 0',fontSize:14,fontWeight:700,color:'#fff',background:'#c8102e',border:'none',borderRadius:4,cursor:submitting?'not-allowed':'pointer',opacity:submitting?0.6:1}}>
                  {submitting ? 'Submitting…' : 'Submit Now'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ BOTTOM NAV ═══ */}
        <div style={{borderTop:"1px solid #ccc",padding:"8px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",flexShrink:0,flexWrap:'wrap',gap:6}}>
          <div style={{display:"flex",flex:1,justifyContent:'space-between'}}>
            {section.writing_tasks?.map((t, i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}
                onClick={() => setActiveTask(i)}>
                <span style={{fontSize:15,fontWeight:600,color:'#333'}}>Part {t.task_number}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <button onClick={() => setActiveTask(p => Math.max(0, p - 1))}
              style={{background:"#333",color:"#fff",border:"none",borderRadius:4,width:32,height:32,cursor:activeTask===0?'not-allowed':'pointer',fontSize:22,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",opacity:activeTask===0?0.3:1}}>❮</button>
            <button onClick={() => setActiveTask(p => Math.min(section.writing_tasks.length - 1, p + 1))}
              style={{background:"#333",color:"#fff",border:"none",borderRadius:4,width:32,height:32,cursor:activeTask===section.writing_tasks.length-1?'not-allowed':'pointer',fontSize:22,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",opacity:activeTask===section.writing_tasks.length-1?0.3:1}}>❯</button>
          </div>
        </div>

        <style>{`
          details > summary { list-style: none; }
          details > summary::-webkit-details-marker { display: none; }
          ::-webkit-scrollbar{width:5px;}
          ::-webkit-scrollbar-thumb{background:#ccc;border-radius:0;}
          ::-webkit-scrollbar-track{background:#f5f5f5;}
        `}</style>
      </div>
    </>
  )
}
