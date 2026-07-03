export default function ListeningBooklet({ page }) {
  return (
    <>
      {/* Page 1 - Listening Overview */}
      <div data-page={1} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] leading-relaxed ${page !== 1 ? 'hidden' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="font-bold mb-2 text-[12pt]">IELTS Listening Overview</p>
            <p className="mb-3 text-justify">
              The IELTS Listening test takes <strong>30 minutes</strong> (plus <strong>10 minutes</strong> transfer time) and consists of <strong>4 sections</strong> with a total of <strong>40 questions</strong>. You hear each recording <strong>once only</strong>.
            </p>
            <table className="w-full border-collapse text-[10pt] mb-4" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold text-center bg-red-600 text-white">Feature</th><th className="border border-black p-1.5 font-bold text-center bg-red-600 text-white">Detail</th></tr>
              </thead>
              <tbody>
                <tr><td className="border border-black p-1.5 font-bold">Time</td><td className="border border-black p-1.5">30 min + 10 min transfer</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">Sections</td><td className="border border-black p-1.5">4 (10 questions each)</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">Questions</td><td className="border border-black p-1.5">40</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">Marks</td><td className="border border-black p-1.5">Each question = 1 mark</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">No penalty</td><td className="border border-black p-1.5">For wrong answers</td></tr>
              </tbody>
            </table>
            <p className="font-bold mb-1">Section Types</p>
            <table className="w-full border-collapse text-[10pt] mb-3" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Section</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Context</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Format</th></tr>
              </thead>
              <tbody>
                <tr><td className="border border-black p-1.5 font-bold text-center">1</td><td className="border border-black p-1.5">Social</td><td className="border border-black p-1.5">Conversation (2 people)</td></tr>
                <tr><td className="border border-black p-1.5 font-bold text-center">2</td><td className="border border-black p-1.5">Social</td><td className="border border-black p-1.5">Monologue (1 speaker)</td></tr>
                <tr><td className="border border-black p-1.5 font-bold text-center">3</td><td className="border border-black p-1.5">Academic</td><td className="border border-black p-1.5">Conversation (2-4 people)</td></tr>
                <tr><td className="border border-black p-1.5 font-bold text-center">4</td><td className="border border-black p-1.5">Academic</td><td className="border border-black p-1.5">Monologue / Lecture</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <p className="font-bold mb-2 text-[12pt]">Question Types Overview</p>
            <table className="w-full border-collapse text-[10pt]" style={{ border: '1px solid black' }}>
              <thead>
                <tr>
                  <th className="border border-black p-1.5 text-center font-bold bg-red-600 text-white">Question Type</th>
                  <th className="border border-black p-1.5 text-center font-bold bg-red-600 text-white">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Form / Note / Table Completion', 'Fill in missing information in a form, notes, or table'],
                  ['Multiple Choice', 'Choose the correct answer from options'],
                  ['Short-answer Questions', 'Answer with 1-3 words or a number'],
                  ['Sentence Completion', 'Complete sentences with words from the recording'],
                  ['Map / Plan / Diagram Labelling', 'Label a map, plan, or diagram while listening'],
                  ['Matching', 'Match items from two lists based on what you hear'],
                  ['Flowchart Completion', 'Complete steps in a process or sequence'],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="border border-black p-1.5 text-left">{row[0]}</td>
                    <td className="border border-black p-1.5 text-left text-[9.5pt]">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-justify text-[10.5pt] mt-3" style={{ lineHeight: 1.45 }}>
              <strong>Important:</strong> Sections increase in difficulty. Section 1 is the easiest, Section 4 the most challenging. The recording is played <strong>once only</strong> — you cannot replay it.
            </p>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">1</div>
      </div>

      {/* Page 2 - Strategies Before / During / After */}
      <div data-page={2} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] ${page !== 2 ? 'hidden' : ''}`}>
        <p className="text-base font-bold underline mb-4">Listening Strategies</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="font-bold underline mb-1 text-[10.5pt]">Before Listening — Read Ahead</p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              You are given time to read the questions before each section. Use this time wisely.
            </p>
            <ul className="list-none p-0 mb-3">
              {[
                'Read all questions in the section before the recording starts',
                'Underline keywords in each question',
                'Predict the type of answer (name, number, date, place, etc.)',
                'Look at the layout — form, table, map, or questions',
                'Think about possible vocabulary you might hear',
                'For maps: study the labels and compass directions',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">During Listening — Stay Focused</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Listen for signpost words that introduce answers',
                'Write answers directly on the question booklet',
                'If you miss a question, move on — do not get stuck',
                'Focus on the next question immediately',
                'Pay attention to plurals and word endings',
                'Write clearly so you can read your answers later',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold underline mb-1 text-[10.5pt]">After Listening — Transfer Time</p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              You have <strong>10 minutes</strong> at the end to transfer answers to the answer sheet.
            </p>
            <ul className="list-none p-0 mb-3">
              {[
                'Transfer answers carefully — check spelling',
                'Make sure your handwriting is clear',
                'Check singular/plural forms',
                'Verify numbers and dates are correct',
                'Fill in any gaps — guessing is better than blank',
                'Do not change answers unless you are absolutely sure',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Predicting Answers</p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              Before the recording starts, predict what type of answer is needed:
            </p>
            <table className="w-full border-collapse text-[10pt] mb-3" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Clue in Question</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Answer Likely</th></tr>
              </thead>
              <tbody>
                <tr><td className="border border-black p-1.5">"Name:"</td><td className="border border-black p-1.5">A person's name</td></tr>
                <tr><td className="border border-black p-1.5">"Date:"</td><td className="border border-black p-1.5">Day / month / year</td></tr>
                <tr><td className="border border-black p-1.5">"Cost / Price"</td><td className="border border-black p-1.5">A number (£, $, etc.)</td></tr>
                <tr><td className="border border-black p-1.5">"At [blank] Street"</td><td className="border border-black p-1.5">A street name</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">2</div>
      </div>

      {/* Page 3 - Signpost Language & Common Mistakes */}
      <div data-page={3} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] ${page !== 3 ? 'hidden' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="text-base font-bold underline mb-3">Signpost Language</p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              Signpost words signal that important information is coming. Recognize them to anticipate answers.
            </p>
            <table className="w-full border-collapse text-[10pt] mb-3" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Function</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Signpost Words</th></tr>
              </thead>
              <tbody>
                {[
                  ['Introducing a topic', 'Today we are going to look at…, First I will…'],
                  ['Sequence / Order', 'Firstly, Next, Then, After that, Finally'],
                  ['Adding information', 'Also, In addition, Another thing is…, Moreover'],
                  ['Giving an example', 'For example, For instance, Such as, Like'],
                  ['Contrasting', 'However, But, On the other hand, Although'],
                  ['Emphasizing', 'In particular, Especially, Notably, Importantly'],
                  ['Cause and effect', 'Because, So, Therefore, As a result, Due to'],
                  ['Concluding', 'In conclusion, To sum up, Overall, In summary'],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="border border-black p-1.5 text-left font-bold text-[9pt]">{row[0]}</td>
                    <td className="border border-black p-1.5 text-left text-[9.5pt]">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="font-bold underline mb-1 text-[10.5pt]">Spelling Tips</p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              Spelling mistakes lose marks even if you heard the correct answer.
            </p>
            <ul className="list-none p-0 mb-3">
              {[
                'Practice spelling days of the week and months',
                'Learn common places: library, museum, restaurant, accommodation',
                'Pay attention to double letters: accommodation, necessary, committee',
                'British spelling is preferred (colour, centre, organise)',
                'Numbers: write digits for speed, but check the format required',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold underline mb-1 text-[10.5pt]">Common Mistakes</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Losing concentration and missing answers',
                'Spending too long on one missed question and missing the next',
                'Not reading ahead during the given preparation time',
                'Writing incorrect spelling of simple words',
                'Confusing similar-sounding words (e.g., 13 vs 30, 15 vs 50)',
                'Forgetting to check plural forms (student vs students)',
                'Not following word limits (e.g., NO MORE THAN TWO WORDS)',
                'Writing the answer in the wrong place on the answer sheet',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Numbers & Dates</p>
            <table className="w-full border-collapse text-[10pt] mb-3" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Type</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">How to Write</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Example</th></tr>
              </thead>
              <tbody>
                <tr><td className="border border-black p-1.5">Telephone</td><td className="border border-black p-1.5">Numbers with spaces</td><td className="border border-black p-1.5">07700 900 456</td></tr>
                <tr><td className="border border-black p-1.5">Date</td><td className="border border-black p-1.5">Day + Month + Year</td><td className="border border-black p-1.5">25 December 2024</td></tr>
                <tr><td className="border border-black p-1.5">Time</td><td className="border border-black p-1.5">am / pm format</td><td className="border border-black p-1.5">2:30 pm</td></tr>
                <tr><td className="border border-black p-1.5">Price</td><td className="border border-black p-1.5">With currency symbol</td><td className="border border-black p-1.5">£45.50</td></tr>
              </tbody>
            </table>
            <p className="font-bold underline mb-1 text-[10.5pt]">Key Advice</p>
            <p className="text-justify text-[10.5pt]" style={{ lineHeight: 1.45 }}>
              The listening test requires <strong>intense concentration</strong> for 30 minutes. Train your focus by doing full practice tests under timed conditions. Build your ear for different accents — British, Australian, North American.
            </p>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">3</div>
      </div>

      {/* Page 4 - Section Strategies & Band Scores */}
      <div data-page={4} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] ${page !== 4 ? 'hidden' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="font-bold underline mb-1 text-[10.5pt]">Section 1 — Social Conversation</p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              A conversation between two people in an everyday context (e.g., booking a hotel, joining a club).
            </p>
            <ul className="list-none p-0 mb-3">
              {[
                'Often a form completion task',
                'Focus on names, numbers, addresses, dates',
                'The speakers speak relatively slowly',
                'Answers are usually given clearly — listen for spelling out of names',
                'Pay attention to corrections — speakers may change their mind',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Section 2 — Social Monologue</p>
            <ul className="list-none p-0 mb-3">
              {[
                'One person speaking (e.g., a guide, announcement, talk)',
                'Often includes a map or plan labelling task',
                'Listen for directions and locations',
                'Study the map layout and compass directions before listening',
                'Follow the speaker\'s movement or description order',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Section 3 — Academic Conversation</p>
            <ul className="list-none p-0 mb-3">
              {[
                '2-4 people discussing academic topics (assignment, project, tutorial)',
                'Often multiple choice or matching',
                'Listen for different viewpoints and opinions',
                'Pay attention to agreement and disagreement between speakers',
                'Follow the turn-taking — each speaker may give different information',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold underline mb-1 text-[10.5pt]">Section 4 — Academic Lecture</p>
            <ul className="list-none p-0 mb-3">
              {[
                'A university-style lecture on an academic topic',
                'Often note completion or sentence completion',
                'More complex vocabulary and faster speech',
                'The lecture is well-structured — follow the organization',
                'Focus on content words (nouns, verbs) that carry meaning',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Band Score Conversion</p>
            <table className="w-full border-collapse text-[10pt] mb-3" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Band Score</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Raw Score (out of 40)</th></tr>
              </thead>
              <tbody>
                <tr><td className="border border-black p-1.5 text-center font-bold">9</td><td className="border border-black p-1.5 text-center">39–40</td></tr>
                <tr><td className="border border-black p-1.5 text-center font-bold">8</td><td className="border border-black p-1.5 text-center">35–38</td></tr>
                <tr><td className="border border-black p-1.5 text-center font-bold">7</td><td className="border border-black p-1.5 text-center">30–34</td></tr>
                <tr><td className="border border-black p-1.5 text-center font-bold">6</td><td className="border border-black p-1.5 text-center">23–29</td></tr>
                <tr><td className="border border-black p-1.5 text-center font-bold">5</td><td className="border border-black p-1.5 text-center">15–22</td></tr>
              </tbody>
            </table>
            <p className="font-bold underline mb-1 text-[10.5pt]">Final Tips</p>
            <ul className="list-none p-0">
              {[
                'Practice with various accents (British, Australian, American)',
                'Do full listening tests, not just individual sections',
                'Transcribe short audio clips to improve accuracy',
                'Learn the most common topics: travel, education, health, environment',
                'Stay calm if you miss an answer — refocus on the next one',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <div className="border-2 border-black p-2 text-center font-bold text-[12pt] mt-2">
              Read Ahead + Predict + Listen for Keywords = Success
            </div>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">4</div>
      </div>
    </>
  )
}
