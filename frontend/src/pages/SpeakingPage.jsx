import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { testsApi, submissionsApi, sessionsApi } from '../utils/api'
import { mockTestProgress } from '../utils/mockTestProgress'
import { useTimer } from '../hooks/useTimer'
import { LoadingScreen, StartOverlay } from '../components/ui'
import SpeakingAvatar from '../components/SpeakingAvatar'
import { SpeakingIcon } from '../components/ExamIcons'
import toast from 'react-hot-toast'
import {
  Mic, MicOff, Clock, Send, ChevronRight,
  RefreshCw, Keyboard, Radio, Sparkles, BookOpen,
  Volume2, Play, Award, CheckCircle,
} from 'lucide-react'

const fmt = (s) => {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

/* ═══════════════════════════════════════════════════
   PART 1 — TOPIC & QUESTION BANKS
════════════════════════════════════════════════════ */
const PART1_TOPICS = {
  Hometown: [
    'Where is your hometown?',
    'What do you like most about your hometown?',
    'Has your hometown changed much since you were a child?',
    'Would you recommend visiting your hometown to tourists?',
    'What kind of jobs do people in your hometown do?',
  ],
  'Work or Study': [
    'Do you work or are you a student?',
    'What do you enjoy most about your work or studies?',
    'What are your future career goals?',
    'Why did you choose this field?',
    'What skills are most important in your job or study?',
  ],
  Friends: [
    'Do you prefer spending time with a few close friends or many acquaintances?',
    'What do you usually do with your friends?',
    'How important are friends to you?',
    'Have you made any new friends recently?',
    'What qualities do you value most in a friend?',
  ],
  Technology: [
    'How often do you use technology in your daily life?',
    'What is your favorite piece of technology?',
    'Do you think technology makes life easier or more complicated?',
    'How has technology changed the way people communicate?',
    'What technology would you like to see invented?',
  ],
  Travel: [
    'Do you enjoy traveling?',
    'What is the best place you have ever visited?',
    'Where would you like to travel in the future?',
    'Do you prefer traveling alone or with others?',
    'What do you usually pack when you travel?',
  ],
  Hobbies: [
    'What do you do in your free time?',
    'How long have you had this hobby?',
    'Why do you enjoy it?',
    'Do you prefer indoor or outdoor hobbies?',
    'Is there a new hobby you would like to try?',
  ],
  Books: [
    'Do you enjoy reading?',
    'What kind of books do you prefer?',
    'What was the last book you read?',
    'Do you prefer physical books or e-books?',
    'How often do you read?',
  ],
  Food: [
    'What is your favorite food?',
    'Do you enjoy cooking?',
    'What is a typical meal in your country?',
    'Have you tried food from other countries?',
    'Do you prefer eating at home or eating out?',
  ],
  Music: [
    'Do you like music?',
    'What kind of music do you listen to?',
    'Who is your favorite musician or band?',
    'Do you play any musical instruments?',
    'How does music make you feel?',
  ],
  'Daily Routine': [
    'What is your typical daily routine?',
    'Do you prefer mornings or evenings?',
    'Has your routine changed recently?',
    'What is the busiest part of your day?',
    'Do you think having a routine is important?',
  ],
  Shopping: [
    'Do you enjoy shopping?',
    'How often do you go shopping?',
    'Do you prefer online shopping or in-store shopping?',
    'What was the last thing you bought?',
    'Do you think people spend too much money shopping?',
  ],
  Sports: [
    'Do you play any sports?',
    'What sports do you enjoy watching?',
    'Why is sport important?',
    'Did you play sports as a child?',
    'What is the most popular sport in your country?',
  ],
}

const PART1_TOPIC_KEYS = Object.keys(PART1_TOPICS)

/* ═══════════════════════════════════════════════════
   PART 2 — CUE CARDS
════════════════════════════════════════════════════ */
const CUECARDS = [
  {
    title: 'Describe a memorable gift you received.',
    bullets: ['what it was', 'who gave it to you', 'when you received it'],
    explain: 'explain why it was memorable',
    topic: 'gifts',
  },
  {
    title: 'Describe a place you have visited that left a strong impression on you.',
    bullets: ['where it is', 'when you went there', 'what you saw and did there'],
    explain: 'explain why it left a strong impression on you',
    topic: 'travel',
  },
  {
    title: 'Describe a person who has influenced you greatly.',
    bullets: ['who this person is', 'how you know them', 'what qualities they have'],
    explain: 'explain how they have influenced you',
    topic: 'people',
  },
  {
    title: 'Describe a skill you would like to learn.',
    bullets: ['what the skill is', 'why you want to learn it', 'how you plan to learn it'],
    explain: 'explain how this skill could benefit your life',
    topic: 'skills',
  },
  {
    title: 'Describe a happy event from your childhood.',
    bullets: ['what the event was', 'when it happened', 'who was with you'],
    explain: 'explain why it made you so happy',
    topic: 'childhood',
  },
  {
    title: 'Describe a movie or book that you found inspiring.',
    bullets: ['what it was about', 'when you saw or read it', 'who recommended it to you'],
    explain: 'explain why it inspired you',
    topic: 'media',
  },
  {
    title: 'Describe a challenging experience you overcame.',
    bullets: ['what the challenge was', 'when it happened', 'how you dealt with it'],
    explain: 'explain what you learned from it',
    topic: 'challenges',
  },
  {
    title: 'Describe a tradition in your country.',
    bullets: ['what the tradition is', 'when it takes place', 'how people celebrate it'],
    explain: 'explain why this tradition is important',
    topic: 'traditions',
  },
  {
    title: 'Describe a piece of technology you find very useful.',
    bullets: ['what it is', 'how you use it', 'why you find it useful'],
    explain: 'explain how it has changed the way you live or work',
    topic: 'technology',
  },
  {
    title: 'Describe a goal you have set for yourself.',
    bullets: ['what the goal is', 'why you set it', 'how you plan to achieve it'],
    explain: 'explain how achieving this goal will affect your life',
    topic: 'goals',
  },
]

/* ═══════════════════════════════════════════════════
   PART 3 — DISCUSSION QUESTION GENERATOR
════════════════════════════════════════════════════ */
const PART3_GENERATORS = {
  gifts: [
    'Why do people give gifts in your culture?',
    'Do you think the value of a gift matters?',
    'How has gift-giving changed compared to the past?',
    'Should parents give children gifts as rewards?',
    'What role does gift-giving play in building relationships?',
    'Do you think people spend too much money on gifts these days?',
    'How do commercial celebrations affect the meaning of gift-giving?',
  ],
  travel: [
    'Why do people feel the need to travel?',
    'Has tourism changed the way we experience places?',
    'How has technology changed travel?',
    'What are the environmental impacts of tourism?',
    'Do you think travel broadens the mind?',
    'How do you see the future of travel evolving?',
    'Should governments do more to protect tourist sites?',
  ],
  people: [
    'What qualities make someone a good role model?',
    'How have role models changed in modern society?',
    'Do celebrities have a responsibility to be good role models?',
    'Why do some people have more influence than others?',
    'How does social media affect the way people influence each other?',
    'Is it important for children to have role models?',
    'Can someone you have never met still influence you greatly?',
  ],
  skills: [
    'Why is lifelong learning important in today\'s world?',
    'Which skills are most valuable in the modern economy?',
    'How has education changed in recent years?',
    'Should governments provide free skills training?',
    'What is the role of traditional education versus self-learning?',
    'How do you think learning will change in the future?',
    'Is it better to have many skills or to be an expert in one?',
  ],
  childhood: [
    'How has childhood changed compared to previous generations?',
    'What factors contribute to a happy childhood?',
    'Do you think children today have too much pressure?',
    'How important is play in a child\'s development?',
    'What role do parents and teachers play in shaping childhood?',
    'How does technology affect modern childhood?',
    'Should childhood be completely carefree?',
  ],
  media: [
    'How does media influence public opinion?',
    'Has the internet changed how we consume media?',
    'Do films and books have a responsibility to educate?',
    'Why do people connect emotionally with stories?',
    'How has streaming changed the entertainment industry?',
    'What impact does media have on young people?',
    'Do you think traditional media will eventually disappear?',
  ],
  challenges: [
    'Why is it important to face challenges?',
    'How do people from different cultures deal with adversity?',
    'Has the nature of challenges changed in modern society?',
    'What role does resilience play in success?',
    'Should schools teach children how to handle failure?',
    'How do social and economic factors affect the challenges people face?',
    'Can challenges ever be beneficial for personal growth?',
  ],
  traditions: [
    'Why are traditions important to society?',
    'How have traditions changed over time?',
    'Should people hold on to traditions or embrace change?',
    'What role do traditions play in national identity?',
    'Do you think globalization threatens local traditions?',
    'How can young people be encouraged to preserve traditions?',
    'Can new traditions be as meaningful as old ones?',
  ],
  technology: [
    'How has technology changed the way we communicate?',
    'Is technology making people more or less connected?',
    'What are the drawbacks of relying too much on technology?',
    'How do you think technology will evolve in the next decade?',
    'Should there be limits on technological development?',
    'How does technology affect employment?',
    'Do you think technology improves quality of life overall?',
  ],
  goals: [
    'Why is goal-setting important for personal development?',
    'How do people\'s goals change at different stages of life?',
    'Should parents set goals for their children?',
    'Is ambition always a positive trait?',
    'How does society influence the goals people set?',
    'What is more important — achieving a goal or the journey toward it?',
    'Do you think people are too focused on long-term goals?',
  ],
}

const DEFAULT_PART3 = [
  'How has this topic become more important in modern society?',
  'What are the differences between how younger and older people view this?',
  'How do you think this will change in the future?',
  'What impact does this have on society as a whole?',
  'Do you think governments should be more involved in this area?',
  'Why do people have different opinions on this subject?',
  'What can individuals do to make a positive difference in this area?',
]

/* ═══════════════════════════════════════════════════
   SIMPLE BAND ESTIMATOR (client-side fallback)
════════════════════════════════════════════════════ */
const estimateBand = (answers) => {
  if (!answers || answers.length === 0) return { overall: 0, details: {} }
  const allText = answers.map(a => a.text).join(' ')
  const words = allText.split(/\s+/).filter(Boolean)
  const totalWords = words.length
  const totalTime = answers.reduce((s, a) => s + (a.duration || 1), 0)
  const wpm = totalTime > 0 ? (totalWords / totalTime) * 60 : 0

  // Fluency: based on words per minute (ideal 120-150)
  const fluency = Math.min(9, Math.max(1, Math.round((wpm / 130) * 7 + 2)))

  // Lexical resource: based on unique word ratio
  const unique = new Set(words.map(w => w.toLowerCase()))
  const lexical = Math.min(9, Math.max(1, Math.round((unique.size / Math.max(totalWords, 1)) * 15 + 1)))

  // Grammatical range: based on average answer length (proxy)
  const avgLen = totalWords / Math.max(answers.length, 1)
  const grammar = Math.min(9, Math.max(1, Math.round((avgLen / 40) * 5 + 3)))

  // Pronunciation: placeholder (cannot truly assess without audio)
  const pronunciation = Math.min(9, Math.max(1, Math.round((fluency + lexical) / 2)))

  // Coherence: based on answer completeness (ratio of answers with >20 words)
  const complete = answers.filter(a => wordCount(a.text) > 20).length
  const coherence = Math.min(9, Math.max(1, Math.round((complete / Math.max(answers.length, 1)) * 5 + 3)))

  const overall = Math.round(((fluency + lexical + grammar + pronunciation + coherence) / 5) * 2) / 2

  return {
    overall,
    details: { fluency, lexical, grammar, pronunciation, coherence, wpm: Math.round(wpm), totalWords },
  }
}

const wordCount = (t) => (t || '').trim().split(/\s+/).filter(Boolean).length

/* ═══════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════ */
export default function SpeakingPage() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isMockTest = searchParams.get('mockTest') === '1'
  const [started, setStarted] = useState(isMockTest)
  const [section, setSection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const sessionRef = useRef(null)
  const elapsedRef = useRef(0)

  /* ── State Machine ── */
  const [phase, setPhase] = useState('intro') // intro | part1 | part2-prep | part2-speak | part2-followup | part3 | complete
  const [step, setStep] = useState(0)
  const [recording, setRecording] = useState(false)
  const [awaitingRecording, setAwaitingRecording] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [timerLabel, setTimerLabel] = useState('')
  const [speechBoundary, setSpeechBoundary] = useState(0)
  const speechBoundaryRef = useRef(0)

  /* ── Test Data ── */
  const [examData, setExamData] = useState(null)
  const [answers, setAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const currentAnswerRef = useRef('')
  const [part2Cue, setPart2Cue] = useState(null)
  const [phaseTimes, setPhaseTimes] = useState({})

  /* ── Refs ── */
  const recognitionRef = useRef(null)
  const utteranceRef = useRef(null)
  const lastSpeechRef = useRef(Date.now())
  const silenceRef = useRef(null)
  const currentAnswerRefInternal = useRef('')
  const phaseStartRef = useRef(Date.now())
  const recordingRef = useRef(false)
  const restartingRef = useRef(false)
  const finalizedIndicesRef = useRef(new Set())
  const interimLastUpdate = useRef(0)
  const advancePhaseRef = useRef(null)
  const startStepRef = useRef(null)
  const handleUserDoneRef = useRef(null)

  /* ── Init exam data ── */
  useEffect(() => {
    if (!section || examData) return
    // Select random Part 1 topics
    const shuffled = [...PART1_TOPIC_KEYS].sort(() => Math.random() - 0.5)
    const selectedTopics = shuffled.slice(0, 3 + Math.floor(Math.random() * 2))
    const part1Qs = selectedTopics.flatMap(t => {
      const questions = PART1_TOPICS[t]
      const count = 3 + Math.floor(Math.random() * 2)
      const shuffledQs = [...questions].sort(() => Math.random() - 0.5)
      return shuffledQs.slice(0, Math.min(count, shuffledQs.length)).map(q => ({ topic: t, text: q }))
    })

    // Select random Part 2 cue card
    const cue = [...CUECARDS].sort(() => Math.random() - 0.5)[0]
    setPart2Cue(cue)

    // Generate Part 3 questions
    const part3Pool = PART3_GENERATORS[cue.topic] || DEFAULT_PART3
    const part3Qs = [...part3Pool].sort(() => Math.random() - 0.5).slice(0, 5 + Math.floor(Math.random() * 3))

    setExamData({ part1: part1Qs, part2: cue, part3: part3Qs })
  }, [section])

  /* ── Load section data ── */
  useEffect(() => {
    ;(async () => {
      try {
        const [secRes, sessRes] = await Promise.all([
          testsApi.getSpeaking(testId),
          sessionsApi.my(),
        ])
        setSection(secRes.data)
        if (isMockTest) {
          const sid = mockTestProgress.getSessionId()
          if (sid) sessionRef.current = sid
        }
        if (!sessionRef.current) {
          const active = sessRes.data.find(
            s => s.test_id == testId && s.section_type === 'speaking' && s.status === 'in_progress'
          )
          if (active) sessionRef.current = active.id
        }
      } catch (err) {
        const detail = err?.response?.data?.detail || err.message || 'Unknown error'
        setLoadError(detail)
        if (!isMockTest) {
          toast.error('Failed to load speaking test')
          navigate('/tests')
        }
      } finally { setLoading(false) }
    })()
  }, [testId])

  /* ── Auto-start intro after init ── */
  useEffect(() => {
    if (!examData || phase !== 'intro') return
    const t = setTimeout(() => startStepRef.current?.('intro', 0), 1500)
    return () => clearTimeout(t)
  }, [examData, phase])

  const allPart1 = useMemo(() => examData?.part1 || [], [examData])
  const part1Remaining = useMemo(() => {
    const answered = answers.filter(a => a.part === 'part1').length
    return allPart1.length - answered
  }, [answers, allPart1])

  /* ═══════════════════════════════════════════════════
     STEP ENGINE
  ════════════════════════════════════════════════════ */
  const getIntroTexts = () => [
    'Good morning or afternoon. My name is IELTS Examiner AI. Can you tell me your full name, please?',
    'Thank you. Can I see your identification, please?',
    'Thank you. Now, in the first part of the test, I\'d like to ask you some questions about yourself.',
  ]

  const getStepLabel = (ph, st) => {
    if (ph === 'intro') return getIntroTexts()[st] || ''
    if (ph === 'part1' && examData) return examData.part1[st]?.text || ''
    if (ph === 'part2-prep') return 'Now I am going to give you a topic. I\'d like you to talk about it for one to two minutes. Before you talk, you will have one minute to prepare.'
    if (ph === 'part2-speak') return 'You may begin speaking now.'
    if (ph === 'part2-followup') return 'Would you like to add anything else?'
    if (ph === 'part3' && examData) return examData.part3[st] || ''
    return ''
  }

  const getPhaseTitle = () => {
    if (phase === 'intro') return 'Introduction & ID Check'
    if (phase === 'part1') return `Part 1: Interview (Q${step + 1} of ${allPart1.length})`
    if (phase === 'part2-prep') return 'Part 2: Long Turn — Preparation'
    if (phase === 'part2-speak') return 'Part 2: Long Turn — Speaking'
    if (phase === 'part2-followup') return 'Part 2: Follow-up'
    if (phase === 'part3') return `Part 3: Discussion (Q${step + 1} of ${examData?.part3?.length || 0})`
    return ''
  }

  const introCount = 3

  // Warm up speech synthesis voices on mount (fixes Chrome silent TTS bug)
  useEffect(() => {
    const init = () => window.speechSynthesis?.getVoices()
    init()
    window.speechSynthesis?.addEventListener('voiceschanged', init)
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', init)
  }, [])

  const startStep = (ph, st) => {
    const label = ph === 'intro' ? getIntroTexts()[st] : getStepLabel(ph, st)
    if (!label) { advancePhaseRef.current?.(); return }

    setIsReading(true)

    if (!window.speechSynthesis) {
      setIsReading(false)
      setTimeout(() => handleUserDoneRef.current?.(ph, st), 500)
      return
    }

    window.speechSynthesis.cancel()
    utteranceRef.current = null

    const utterance = new SpeechSynthesisUtterance(label)
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    utterance.volume = 1
    let finished = false
    const done = () => {
      if (finished) return
      finished = true
      utteranceRef.current = null
      setIsReading(false)
      speechBoundaryRef.current = 0
      setSpeechBoundary(0)
      if (ph !== 'part2-prep') {
        setAwaitingRecording(true)
      }
    }
    utterance.onboundary = (e) => {
      if (e.name !== 'word') return
      speechBoundaryRef.current++
      setSpeechBoundary(speechBoundaryRef.current)
    }
    utterance.onend = done
    utterance.onerror = done
    const wordCount = label.split(/\s+/).length
    const safetyMs = Math.max(3000, wordCount * 200)
    const safetyTimer = setTimeout(done, safetyMs)
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }
  startStepRef.current = startStep

  const advancePhase = () => {
    window.speechSynthesis?.cancel()
    stopRecording()
    if (phase === 'intro') {
      setPhase('part1')
      setStep(0)
      setTimeout(() => startStepRef.current?.('part1', 0), 800)
    } else if (phase === 'part1') {
      setPhase('part2-prep')
      setStep(0)
      setTimeout(() => startStepRef.current?.('part2-prep', 0), 800)
    } else if (phase === 'part2-speak' || phase === 'part2-followup') {
      setPhase('part3')
      setStep(0)
      setTimeout(() => startStepRef.current?.('part3', 0), 800)
    } else if (phase === 'part3') {
      finishTest()
    }
  }
  advancePhaseRef.current = advancePhase

  const handleUserDone = (ph, st) => {
    const manualInput = document.getElementById('examiner-input')
    const manualText = manualInput?.value?.trim() || ''
    const speechText = currentAnswerRef.current.trim()
    const combined = speechText
      ? (manualText ? speechText + ' ' + manualText : speechText)
      : manualText

    if (combined) {
      setAnswers(prev => [...prev, {
        part: ph,
        step: st,
        text: combined,
        duration: Math.round((Date.now() - phaseStartRef.current) / 1000),
        topic: ph === 'part1' ? examData?.part1[st]?.topic : undefined,
      }])
      setCurrentAnswer('')
      currentAnswerRef.current = ''
      if (manualInput) manualInput.value = ''
    }

    if (ph === 'intro') {
      const next = st + 1
      if (next < introCount) {
        setStep(next)
        setTimeout(() => startStepRef.current?.('intro', next), 600)
      } else {
        advancePhaseRef.current?.()
      }
    } else if (ph === 'part1') {
      const next = st + 1
      if (next < (examData?.part1?.length || 0)) {
        setStep(next)
        setTimeout(() => startStepRef.current?.('part1', next), 600)
      } else {
        advancePhaseRef.current?.()
      }
    } else if (ph === 'part2-followup') {
      advancePhaseRef.current?.()
    } else if (ph === 'part3') {
      const next = st + 1
      if (next < (examData?.part3?.length || 0)) {
        setStep(next)
        setTimeout(() => startStepRef.current?.('part3', next), 600)
      } else {
        advancePhaseRef.current?.()
      }
    }
  }
  handleUserDoneRef.current = handleUserDone

  /* ═══════════════════════════════════════════════════
     SPEECH RECOGNITION
  ════════════════════════════════════════════════════ */
  const startRecording = useCallback((ph, st) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      toast('Speech recognition not available. Type your response.', { icon: '⌨️' })
      return
    }

    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 5

    recognition.onresult = (e) => {
      lastSpeechRef.current = Date.now()
      let latestInterim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          if (!finalizedIndicesRef.current.has(i)) {
            finalizedIndicesRef.current.add(i)
            currentAnswerRefInternal.current += ' ' + e.results[i][0].transcript.trim()
            currentAnswerRef.current = currentAnswerRefInternal.current.trim()
            setCurrentAnswer(currentAnswerRefInternal.current.trim())
          }
        } else {
          latestInterim = e.results[i][0].transcript
        }
      }
      const now = Date.now()
      if (now - interimLastUpdate.current > 150) {
        interimLastUpdate.current = now
        setInterimTranscript(latestInterim)
      }
    }

    recognition.onend = () => {
      if (recognitionRef.current !== recognition) return
      if (recordingRef.current) {
        try { recognition.start() } catch {
          recordingRef.current = false
          setRecording(false)
        }
        return
      }
      setRecording(false)
      setInterimTranscript('')
    }

    recognition.onerror = (e) => {
      if (recognitionRef.current !== recognition) return
      if (e.error === 'no-speech' || e.error === 'aborted') return
      if (recordingRef.current) {
        try { recognition.start() } catch {
          recordingRef.current = false
          setRecording(false)
        }
        return
      }
      toast.error('Microphone unavailable. Type your response instead.')
      setRecording(false)
    }

    recognitionRef.current = recognition
    recordingRef.current = true
    setRecording(true)
    lastSpeechRef.current = Date.now()
    phaseStartRef.current = Date.now()
    currentAnswerRefInternal.current = ''
    finalizedIndicesRef.current = new Set()
    interimLastUpdate.current = 0

    try { recognition.start() } catch {
      recordingRef.current = false
      setRecording(false)
      toast.error('Could not access microphone. Type your response instead.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    recordingRef.current = false
    recognitionRef.current?.stop()
    clearTimeout(silenceRef.current)
    setRecording(false)
    setInterimTranscript('')
  }, [])

  /* ── Silence detection (4s, minimum 5s of recording) ── */
  useEffect(() => {
    if (!recording) return
    const started = Date.now()
    const check = () => {
      if (Date.now() - started < 5000) {
        silenceRef.current = setTimeout(check, 1000)
        return
      }
      if (Date.now() - lastSpeechRef.current > 4000) {
        const ph = phase
        const st = step
        stopRecording()
        handleUserDoneRef.current?.(ph, st)
      } else {
        silenceRef.current = setTimeout(check, 500)
      }
    }
    silenceRef.current = setTimeout(check, 4000)
    return () => clearTimeout(silenceRef.current)
  }, [recording, phase, step])

  /* ── Part 2 prep timer ── */
  const [prepRemaining, setPrepRemaining] = useState(60)
  useEffect(() => {
    if (phase !== 'part2-prep') return
    setPrepRemaining(60)
    const t = setInterval(() => {
      setPrepRemaining(p => {
        if (p <= 1) {
          clearInterval(t)
          return 0
        }
        return p - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [phase])

  /* ── Auto-start speaking after prep ── */
  useEffect(() => {
    if (phase !== 'part2-prep' || prepRemaining > 0) return
    // Prep done, start speaking phase
    setPhase('part2-speak')
    setStep(0)
    setAwaitingRecording(true)
    setTimeout(() => {
      setIsReading(true)
      const msg = 'You may begin speaking now.'
      if (!window.speechSynthesis) {
        setIsReading(false)
        return
      }
      const utterance = new SpeechSynthesisUtterance(msg)
      utterance.rate = 0.85
      let finished = false
      const done = () => {
        if (finished) return
        finished = true
        setIsReading(false)
      }
      utterance.onend = done
      utterance.onerror = done
      const safetyTimer = setTimeout(done, 5000)
      window.speechSynthesis.speak(utterance)
    }, 500)
  }, [prepRemaining, phase])

  /* ── Part 2 max time (2 min) ── */
  const [part2Seconds, setPart2Seconds] = useState(0)
  useEffect(() => {
    if (phase !== 'part2-speak' && phase !== 'part2-followup') {
      setPart2Seconds(0)
      return
    }
    const t = setInterval(() => setPart2Seconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  /* ── Part 2 auto-stop after 2 min ── */
  useEffect(() => {
    if (phase === 'part2-speak' && part2Seconds >= 120) {
      stopRecording()
      if (currentAnswerRef.current.trim()) {
        setAnswers(prev => [...prev, {
          part: 'part2-speak',
          step: 0,
          text: currentAnswerRef.current.trim(),
          duration: 120,
        }])
        setCurrentAnswer('')
        currentAnswerRef.current = ''
      }
      setPhase('part2-followup')
      setStep(0)
      setTimeout(() => startStepRef.current?.('part2-followup', 0), 800)
    }
  }, [phase, part2Seconds])

  /* ── Submit manual intro answer ── */
  const handleManualNext = () => {
    const input = document.getElementById('examiner-input')
    const val = input?.value?.trim()
    if (!val && phase === 'intro' && step < introCount - 1) {
      setStep(s => s + 1)
      setTimeout(() => startStepRef.current?.('intro', step + 1), 400)
      return
    }
    if (phase === 'intro') {
      if (val) {
        setAnswers(prev => [...prev, { part: 'intro', step, text: val }])
      }
      if (step < introCount - 1) {
        setStep(s => s + 1)
        setTimeout(() => startStepRef.current?.('intro', step + 1), 400)
      } else {
        advancePhaseRef.current?.()
      }
      if (input) input.value = ''
    }
  }

  /* ═══════════════════════════════════════════════════
     FINISH TEST
  ════════════════════════════════════════════════════ */
  const finishTest = useCallback(async () => {
    setPhase('complete')
    // Estimate band score
    const allAnswers = [...answers]
    if (currentAnswerRef.current.trim()) {
      allAnswers.push({
        part: phase,
        step,
        text: currentAnswerRef.current.trim(),
        duration: Math.round((Date.now() - phaseStartRef.current) / 1000),
      })
    }

    const bandResult = estimateBand(allAnswers)
    setExamData(prev => ({ ...prev, bandResult, allAnswers }))

    // Submit to backend if possible
    if (sessionRef.current && part2Cue) {
      try {
        const transcript = allAnswers.map(a => a.text).join('\n')
        await submissionsApi.submitSpeaking({
          speaking_part_id: section?.speaking_parts?.[0]?.id,
          session_id: sessionRef.current,
          transcript,
          time_taken_seconds: Math.round((Date.now() - (phaseStartRef.current || Date.now())) / 1000),
        })
      } catch {}
    }

    if (isMockTest) {
      mockTestProgress.saveResult('speaking', { overall_band: bandResult.overall, band_result: bandResult })
      navigate(`/mock-test-result?testId=${testId}`, { replace: true })
    }
  }, [answers, phase, step, section, part2Cue])

  /* ═══════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════ */
  if (loading) return <LoadingScreen message="Loading speaking test…" />
  if (!section && isMockTest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-icon-light">
            <Mic size={28} className="text-icon" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Could not load Speaking test</h2>
          <p className="text-xs text-gray-400 mb-6">Test ID: {testId}</p>
          <button onClick={() => navigate('/mock-test-result' + (testId ? `?testId=${testId}` : ''), { replace: true })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold"
            style={{ background: '#CC0000' }}>
            View Results
          </button>
        </div>
      </div>
    )
  }
  if (!section) return null

  const cue = part2Cue
  const bandResult = examData?.bandResult
  const allAnswers = examData?.allAnswers || answers

  const elapsedTotal = phase === 'complete' ? 0 : Math.round((Date.now() - phaseStartRef.current) / 1000)

  return (
    <>
      {!started && !isMockTest && <StartOverlay onStart={() => setStarted(true)} moduleName="Speaking" icon={<SpeakingIcon size={28} color="#CC0000" />} />}
      <div className="min-h-screen bg-gray-50 flex flex-col">

      <style>{`
        @keyframes fadeIn { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }
        .exam-fade { animation: fadeIn 0.5s ease both; }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .pulse-dot { animation: pulse-dot 1.5s ease-in-out infinite; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
      `}</style>

      {/* ═══════════════════════════════
         TOP BAR — IELTS CBT style
      ════════════════════════════════ */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <img src="src/assets/hu.png" alt="IELTSPrep" className="h-6 w-auto object-contain" onError={(e) => e.target.style.display = 'none'} />
          <span className="h-4 w-px bg-gray-200" />
          <span className="text-xs font-semibold text-gray-700 tracking-wide">Speaking Test</span>
        </div>
        <div className="flex items-center gap-5">
          {phase !== 'complete' && phase !== 'intro' && (
            <span className="text-xs font-mono text-gray-500 tabular-nums">{fmt(elapsedTotal)}</span>
          )}
          {phase !== 'complete' && (
            <div className="flex items-center gap-1.5">
              {recording ? (
                <><span className="w-2 h-2 rounded-full bg-red-600 pulse-dot inline-block" /><span className="text-[11px] font-semibold text-red-600 uppercase tracking-wider">REC</span></>
              ) : isReading ? (
                <><Volume2 size={13} className="text-gray-400" /><span className="text-[11px] font-medium text-gray-400">Listening</span></>
              ) : (
                <span className="text-[11px] font-medium text-gray-300">—</span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ═══════════════════════════════
         MAIN CONTENT
      ════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">

        {/* ── COMPLETE / RESULTS ── */}
        {phase === 'complete' && bandResult && (
          <div className="max-w-xl mx-auto px-6 py-10 exam-fade">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center">
                <Award size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Speaking Test Complete</h1>
              <p className="text-sm text-gray-500">That is the end of the IELTS Speaking test.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center mb-6">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Estimated Band Score</p>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-[3px] border-gray-900 bg-white">
                <span className="text-3xl font-extrabold text-gray-900">{bandResult.overall.toFixed(1)}</span>
              </div>
              <div className="grid grid-cols-5 gap-2 mt-6 max-w-sm mx-auto">
                {[
                  { label: 'Fluency', val: bandResult.details.fluency },
                  { label: 'Lexical', val: bandResult.details.lexical },
                  { label: 'Grammar', val: bandResult.details.grammar },
                  { label: 'Pronunc.', val: bandResult.details.pronunciation },
                  { label: 'Coherence', val: bandResult.details.coherence },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <p className="text-[10px] font-semibold text-gray-400">{item.label}</p>
                    <p className="text-base font-bold text-gray-900">{item.val}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">{bandResult.details.totalWords} words &middot; {bandResult.details.wpm} wpm</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Full Transcript</h3>
              <div className="space-y-2 max-h-56 overflow-y-auto text-sm text-gray-700 leading-relaxed">
                {allAnswers.map((a, i) => (
                  <div key={i}>
                    <span className="font-semibold text-gray-900">{a.part.charAt(0).toUpperCase() + a.part.slice(1).replace('part', 'Part ')}:</span>
                    <span className="ml-1">{a.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Link to="/dashboard" className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors">
                Back to Dashboard
              </Link>
              <button onClick={() => window.location.reload()}
                className="px-6 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* ── EXAM PHASES (intro / part1 / part2-prep / part2-speak / part2-followup / part3) ── */}
        {phase !== 'complete' && (
          <div className="max-w-2xl mx-auto px-6 py-8 exam-fade">

            {/* Part heading */}
            <div className="mb-8">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                {phase === 'intro' && 'Introduction & ID Check'}
                {phase === 'part1' && `Part 1: Interview — Question ${step + 1} of ${allPart1.length}`}
                {phase === 'part2-prep' && 'Part 2: Long Turn — Preparation'}
                {phase === 'part2-speak' && 'Part 2: Long Turn — Speaking'}
                {phase === 'part2-followup' && 'Part 2: Follow-up'}
                {phase === 'part3' && `Part 3: Discussion — Question ${step + 1} of ${examData?.part3?.length || 0}`}
              </p>
              {phase === 'part1' && (
                <div className="w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gray-900 rounded-full transition-all duration-500"
                    style={{ width: `${(step / Math.max(allPart1.length, 1)) * 100}%` }} />
                </div>
              )}
              {phase === 'part3' && (
                <div className="w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gray-900 rounded-full transition-all duration-500"
                    style={{ width: `${(step / Math.max(examData?.part3?.length || 1, 1)) * 100}%` }} />
                </div>
              )}
            </div>

            {/* AI Examiner Avatar */}
            {(phase === 'intro' || phase === 'part1' || phase === 'part3') && (
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <SpeakingAvatar isSpeaking={isReading} isListening={recording} speechBoundary={speechBoundary} size={140} />
                  {isReading && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      Speaking
                    </div>
                  )}
                  {recording && !isReading && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      Listening
                    </div>
                  )}
                </div>
                <p className="text-[11px] font-medium text-gray-500 mt-2">
                  {isReading ? 'Your examiner is speaking...' : recording ? 'Speak now' : 'Waiting...'}
                </p>
              </div>
            )}

            {/* INTRO / PART 1 / PART 3 — Question card */}
            {(phase === 'intro' || phase === 'part1' || phase === 'part3') && (
              <div className="space-y-5">

                {/* Question */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  {phase === 'part1' && examData && (
                    <p className="text-[11px] font-semibold text-gray-400 mb-2">{examData.part1[step]?.topic}</p>
                  )}
                  {phase === 'part3' && (
                    <p className="text-[11px] font-semibold text-gray-400 mb-2">Discussion Question</p>
                  )}
                  <p className="text-base text-gray-900 leading-relaxed">
                    {phase === 'intro' && getIntroTexts()[step]}
                    {phase === 'part1' && examData?.part1[step]?.text}
                    {phase === 'part3' && examData?.part3[step]}
                  </p>
                </div>

                {/* Captions — subtitle-style bar at bottom */}
                {showTranscript && (recording || currentAnswer || interimTranscript) && (
                  <div className="min-h-[60px] bg-gray-900 bg-opacity-90 rounded-lg px-4 py-3 flex items-center">
                    <div className="w-full">
                      {interimTranscript && (
                        <p className="text-sm text-gray-300 italic leading-relaxed text-center">{interimTranscript}</p>
                      )}
                      {currentAnswer && !interimTranscript && (
                        <p className="text-sm text-white leading-relaxed text-center">{currentAnswer}</p>
                      )}
                      {!currentAnswer && !interimTranscript && recording && (
                        <p className="text-sm text-gray-500 italic text-center">Speak now...</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Start Recording button */}
                {awaitingRecording && !recording && !isReading && (
                  <div className="text-center">
                    <button onClick={() => { setAwaitingRecording(false); startRecording(phase, step) }}
                      className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors">
                      Start Recording
                    </button>
                  </div>
                )}

                {/* Live Translation toggle */}
                {recording && (
                  <div className="text-center">
                    <button onClick={() => setShowTranscript(v => !v)}
                      className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">
                      {showTranscript ? 'Hide Live Translation' : 'Show Live Translation'}
                    </button>
                  </div>
                )}

                {/* Manual fallback — hidden by default, toggleable */}
                {!recording && !isReading && !awaitingRecording && (
                  <div className="text-center">
                    <button onClick={() => {
                      const el = document.getElementById('type-fallback')
                      if (el) el.classList.toggle('hidden')
                    }} className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">
                      Type instead
                    </button>
                    <div id="type-fallback" className="hidden mt-3 space-y-2">
                      <textarea
                        placeholder="Type your response..."
                        className="w-full p-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-gray-400 min-h-20"
                        onChange={e => currentAnswerRef.current = e.target.value}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleUserDone(phase, step) }}}
                      />
                      <button onClick={() => handleUserDone(phase, step)}
                        className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors">
                        {phase === 'intro'
                          ? (step < introCount - 1 ? 'Next Question' : 'Start Part 1')
                          : (phase === 'part3' && step >= (examData?.part3?.length || 1) - 1 ? 'Finish Test' : 'Next Question')
                        }
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PART 2 PREP */}
            {phase === 'part2-prep' && cue && (
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-2">
                  <SpeakingAvatar isSpeaking={false} isListening={false} speechBoundary={0} size={100} />
                  <p className="text-[11px] font-medium text-gray-500 mt-1.5">Prepare your response</p>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  You will have <span className="font-bold text-gray-900">1 minute</span> to prepare. The examiner will then ask you to speak for 1–2 minutes.
                </p>

                {/* Cue card — official style */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Cue Card</p>
                  <p className="text-base font-semibold text-gray-900 mb-4">{cue.title}</p>
                  <p className="text-xs font-medium text-gray-500 mb-2">You should say:</p>
                  <ul className="space-y-1.5 mb-4">
                    {cue.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-600 italic">and {cue.explain}</p>
                </div>

                {/* Timer */}
                <div className="flex items-center justify-center gap-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#111827" strokeWidth="5"
                        strokeDasharray={`${(prepRemaining / 60) * 264}`}
                        strokeDashoffset="0" strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 1s linear' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-900 font-mono">{prepRemaining}</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase">Preparation</p>
                    <p className="text-xs text-gray-500">Time remaining</p>
                  </div>
                </div>

                <div className="text-center">
                  <button onClick={() => setPrepRemaining(0)}
                    className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors">
                    Start Speaking
                  </button>
                </div>
              </div>
            )}

            {/* PART 2 SPEAK */}
            {phase === 'part2-speak' && cue && (
              <div className="space-y-5">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-2">
                  <SpeakingAvatar isSpeaking={isReading} isListening={recording} speechBoundary={speechBoundary} size={110} />
                  <p className="text-[11px] font-medium text-gray-500 mt-1.5">
                    {isReading ? 'Your examiner is listening...' : recording ? 'Recording your response' : 'Ready'}
                  </p>
                </div>
                {/* Mini cue card reference */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-[11px] font-semibold text-gray-400 mb-1">Cue Card Reference</p>
                  <p className="text-sm text-gray-800">{cue.title}</p>
                </div>

                {/* Timer bar */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500 tabular-nums">{fmt(part2Seconds)} / 2:00</span>
                  {recording && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 pulse-dot inline-block" />
                      REC
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-900 rounded-full transition-all duration-1000"
                    style={{ width: `${(part2Seconds / 120) * 100}%` }} />
                </div>

                {/* Captions */}
                {showTranscript && (recording || currentAnswer || interimTranscript) && (
                  <div className="min-h-[60px] bg-gray-900 bg-opacity-90 rounded-lg px-4 py-3 flex items-center">
                    <div className="w-full">
                      {interimTranscript && (
                        <p className="text-sm text-gray-300 italic leading-relaxed text-center">{interimTranscript}</p>
                      )}
                      {currentAnswer && !interimTranscript && (
                        <p className="text-sm text-white leading-relaxed text-center">{currentAnswer}</p>
                      )}
                      {!currentAnswer && !interimTranscript && recording && (
                        <p className="text-sm text-gray-500 italic text-center">Speak now...</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Status / controls */}
                <div className="flex items-center justify-center gap-4">
                  {recording ? (
                    <span className="text-xs text-gray-500">Recording — speak clearly into your microphone</span>
                  ) : awaitingRecording ? (
                    <button onClick={() => { setAwaitingRecording(false); startRecording('part2-speak', 0) }}
                      className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors">
                      Start Speaking
                    </button>
                  ) : null}
                </div>

                {/* Live Translation toggle */}
                {recording && (
                  <div className="text-center">
                    <button onClick={() => setShowTranscript(v => !v)}
                      className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">
                      {showTranscript ? 'Hide Live Translation' : 'Show Live Translation'}
                    </button>
                  </div>
                )}

                <div className="text-center">
                  <button onClick={() => { stopRecording(); setPhase('part2-followup'); setStep(0); setTimeout(() => startStepRef.current?.('part2-followup', 0), 500) }}
                    className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">
                    Skip to follow-up
                  </button>
                </div>
              </div>
            )}

            {/* PART 2 FOLLOW-UP */}
            {phase === 'part2-followup' && (
              <div className="space-y-5 text-center">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-2">
                  <SpeakingAvatar isSpeaking={false} isListening={recording} speechBoundary={0} size={100} />
                  <p className="text-[11px] font-medium text-gray-500 mt-1.5">
                    {recording ? 'Listening...' : 'Follow-up question'}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Would you like to add anything else?</p>
                  <p className="text-xs text-gray-500 mb-4">
                    {recording ? 'Recording... silence will auto-continue' : 'Add more or continue to Part 3'}
                  </p>

                  {/* Captions */}
                  {(recording || currentAnswer || interimTranscript) && (
                    <div className="min-h-[60px] bg-gray-900 bg-opacity-90 rounded-lg px-4 py-3 flex items-center mb-4">
                      <div className="w-full">
                        {interimTranscript && (
                          <p className="text-sm text-gray-300 italic leading-relaxed text-center">{interimTranscript}</p>
                        )}
                        {currentAnswer && !interimTranscript && (
                          <p className="text-sm text-white leading-relaxed text-center">{currentAnswer}</p>
                        )}
                        {!currentAnswer && !interimTranscript && recording && (
                          <p className="text-sm text-gray-500 italic text-center">Speak now...</p>
                        )}
                      </div>
                    </div>
                  )}

                  {!recording && !isReading && (
                    <div className="flex justify-center gap-3">
                      <button onClick={() => startRecording('part2-followup', 0)}
                        className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors">
                        Add More
                      </button>
                      <button onClick={() => { setPhase('part3'); setStep(0); setTimeout(() => startStepRef.current?.('part3', 0), 800) }}
                        className="px-5 py-2 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Continue to Part 3
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
    </>
  )
}
