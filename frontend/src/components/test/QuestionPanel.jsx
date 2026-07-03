import { cn } from '../../utils/helpers'

function TrueFalseNG({ question, value, onChange }) {
  const opts = ['TRUE', 'FALSE', 'NOT GIVEN']
  return (
    <div className="flex flex-wrap gap-2">
      {opts.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={cn(
            'px-4 py-1.5 rounded-lg border text-sm font-medium transition-all',
            value === o
              ? 'bg-brand-600 border-brand-600 text-white'
              : 'border-surface-200 text-surface-700 hover:border-brand-400 hover:bg-brand-50'
          )}>
          {o}
        </button>
      ))}
    </div>
  )
}

function YesNoNG({ question, value, onChange }) {
  const opts = ['YES', 'NO', 'NOT GIVEN']
  return (
    <div className="flex flex-wrap gap-2">
      {opts.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={cn(
            'px-4 py-1.5 rounded-lg border text-sm font-medium transition-all',
            value === o
              ? 'bg-brand-600 border-brand-600 text-white'
              : 'border-surface-200 text-surface-700 hover:border-brand-400 hover:bg-brand-50'
          )}>
          {o}
        </button>
      ))}
    </div>
  )
}

function MultipleChoice({ question, extraData, value, onChange }) {
  const qNum = question.question_number
  const opts = extraData?.[qNum]?.options || extraData?.options || {}
  return (
    <div className="space-y-2">
      {Object.entries(opts).map(([letter, text]) => (
        <label key={letter}
          className={cn(
            'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all',
            value === letter
              ? 'bg-brand-50 border-brand-400'
              : 'border-surface-200 hover:border-surface-300'
          )}>
          <input type="radio" className="mt-0.5 accent-brand-600"
            checked={value === letter} onChange={() => onChange(letter)} />
          <span className="text-sm text-surface-800">
            <span className="font-bold text-surface-900 mr-1">{letter}.</span>{text}
          </span>
        </label>
      ))}
    </div>
  )
}

function FillBlank({ question, value, onChange }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="input max-w-xs"
      placeholder="Your answer…"
    />
  )
}

function MatchHeadings({ question, extraData, value, onChange }) {
  const headings = extraData?.headings || []
  return (
    <select value={value || ''} onChange={e => onChange(e.target.value)} className="input max-w-sm">
      <option value="">— Select heading —</option>
      {headings.map((h, i) => {
        const letter = String.fromCharCode(65 + i)
        return <option key={i} value={letter}>{letter}. {h}</option>
      })}
    </select>
  )
}

export default function QuestionPanel({ groups, answers, onAnswer }) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.id} className="card p-6">
          <p className="text-sm text-surface-600 leading-relaxed mb-5 bg-amber-50 border border-amber-100 rounded-xl p-4">
            {group.instruction}
          </p>
          <div className="space-y-5">
            {group.questions.map((q) => (
              <div key={q.id} className="border-b border-surface-100 pb-5 last:border-0 last:pb-0">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
                    {q.question_number}
                  </span>
                  {q.prompt && (
                    <p className="text-sm text-surface-800 leading-relaxed">{q.prompt}</p>
                  )}
                </div>
                <div className="pl-10">
                  {(group.question_type === 'true_false_ng') && (
                    <TrueFalseNG question={q} value={answers[q.id]} onChange={v => onAnswer(q.id, v)} />
                  )}
                  {(group.question_type === 'yes_no_ng') && (
                    <YesNoNG question={q} value={answers[q.id]} onChange={v => onAnswer(q.id, v)} />
                  )}
                  {(group.question_type === 'multiple_choice') && (
                    <MultipleChoice question={q} extraData={group.extra_data}
                      value={answers[q.id]} onChange={v => onAnswer(q.id, v)} />
                  )}
                  {(group.question_type === 'match_headings') && (
                    <MatchHeadings question={q} extraData={group.extra_data}
                      value={answers[q.id]} onChange={v => onAnswer(q.id, v)} />
                  )}
                  {(['fill_blank','short_answer','note_completion','sentence_completion','summary_completion'].includes(group.question_type)) && (
                    <FillBlank question={q} value={answers[q.id]} onChange={v => onAnswer(q.id, v)} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
