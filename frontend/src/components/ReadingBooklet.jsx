export default function ReadingBooklet({ page }) {
  return (
    <>
      {/* Page 1 - Reading Overview */}
      <div data-page={1} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] leading-relaxed ${page !== 1 ? 'hidden' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="font-bold mb-2 text-[12pt]">IELTS Academic Reading Overview</p>
            <p className="mb-3 text-justify">
              The IELTS Reading test takes 60 minutes and consists of <strong>3 passages</strong> with a total of <strong>40 questions</strong>. Each passage is approximately 700–900 words long.
            </p>
            <table className="w-full border-collapse text-[10pt] mb-4" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold text-center bg-red-600 text-white">Feature</th><th className="border border-black p-1.5 font-bold text-center bg-red-600 text-white">Detail</th></tr>
              </thead>
              <tbody>
                <tr><td className="border border-black p-1.5 font-bold">Time</td><td className="border border-black p-1.5">60 minutes</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">Passages</td><td className="border border-black p-1.5">3 (700–900 words each)</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">Questions</td><td className="border border-black p-1.5">40</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">Marks</td><td className="border border-black p-1.5">Each question = 1 mark</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">No penalty</td><td className="border border-black p-1.5">For wrong answers</td></tr>
              </tbody>
            </table>
            <p className="font-bold mb-1">Passage Types</p>
            <p className="mb-2 text-justify text-[10.5pt]">
              Passages are taken from books, journals, magazines, and newspapers. Topics are academic but do not require specialist knowledge.
            </p>
            <ul className="list-none p-0 mb-3">
              {[
                'Descriptive — factual information about a topic',
                'Discursive — discussion of issues or arguments',
                'Narrative — a sequence of events or historical account',
                'Argumentative — presenting a case for/against a position',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold mb-2 text-[12pt]">Question Types Overview</p>
            <table className="w-full border-collapse text-[10pt]" style={{ border: '1px solid black' }}>
              <thead>
                <tr>
                  <th className="border border-black p-1.5 text-center font-bold bg-red-600 text-white">Question Type</th>
                  <th className="border border-black p-1.5 text-center font-bold bg-red-600 text-white">Example</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['True / False / Not Given', 'Statement agrees / disagrees with passage'],
                  ['Matching Headings', 'Choose heading for each paragraph'],
                  ['Matching Information', 'Find paragraph containing specific info'],
                  ['Matching Features', 'Match statements to people/dates/theories'],
                  ['Matching Sentence Endings', 'Complete sentences from two lists'],
                  ['Summary Completion', 'Fill gaps using words from passage'],
                  ['Sentence Completion', 'Complete sentences with words from passage'],
                  ['Table / Flowchart Completion', 'Fill in table based on passage info'],
                  ['Multiple Choice', 'Choose correct option (A, B, C, or D)'],
                  ['Short-answer Questions', 'Answer with words from passage'],
                  ['Diagram Label Completion', 'Label a diagram using passage words'],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="border border-black p-1.5 text-left">{row[0]}</td>
                    <td className="border border-black p-1.5 text-left text-[9.5pt]">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">1</div>
      </div>

      {/* Page 2 - Reading Techniques */}
      <div data-page={2} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] ${page !== 2 ? 'hidden' : ''}`}>
        <p className="text-base font-bold underline mb-4">Reading Techniques & Time Management</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="font-bold underline mb-1 text-[10.5pt]">Skimming</p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              Skimming means reading quickly to get the <strong>main idea</strong> of a passage. Do this before reading the questions.
            </p>
            <p className="font-bold mb-1 text-[10pt]">How to Skim:</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Read the title, headings, and subheadings first',
                'Read the first sentence of each paragraph',
                'Look at keywords and repeated terms',
                'Notice dates, names, and numbers',
                'Read the conclusion or final paragraph',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Scanning</p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              Scanning means looking for <strong>specific information</strong>. Once you know what to look for from the questions, scan the passage to find the relevant section.
            </p>
            <p className="font-bold mb-1 text-[10pt]">How to Scan:</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Identify keywords in the question',
                'Look for synonyms of those keywords',
                'Move your eyes quickly across the text',
                'Stop when you find a match',
                'Read the surrounding sentences carefully',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold underline mb-1 text-[10.5pt]">Time Management Strategy</p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              You have 60 minutes for 3 passages. A good time plan:
            </p>
            <table className="w-full border-collapse text-[10pt] mb-3" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Stage</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Time</th></tr>
              </thead>
              <tbody>
                <tr><td className="border border-black p-1.5">Passage 1</td><td className="border border-black p-1.5">20 minutes</td></tr>
                <tr><td className="border border-black p-1.5">Passage 2</td><td className="border border-black p-1.5">20 minutes</td></tr>
                <tr><td className="border border-black p-1.5">Passage 3</td><td className="border border-black p-1.5">20 minutes</td></tr>
              </tbody>
            </table>
            <ul className="list-none p-0 mb-3">
              {[
                'Spend 2-3 minutes skimming the passage first',
                'Spend about 1 minute per question',
                'Do not spend more than 2 minutes on any single question',
                'Mark difficult questions and return to them if time allows',
                'Leave 2-3 minutes at the end to check answers',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Keyword Technique</p>
            <p className="text-justify text-[10.5pt]" style={{ lineHeight: 1.45 }}>
              <strong>Keywords</strong> are the most important words in a question. Underline them and look for <strong>synonyms</strong> in the passage. IELTS rarely uses the exact same words — it tests your ability to recognize paraphrasing.
            </p>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">2</div>
      </div>

      {/* Page 3 - Question Type Strategies */}
      <div data-page={3} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] ${page !== 3 ? 'hidden' : ''}`}>
        <p className="text-base font-bold underline mb-4">Question Type Strategies</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="font-bold underline mb-1 text-[10.5pt]">True / False / Not Given</p>
            <ul className="list-none p-0 mb-3">
              {[
                '<strong>True</strong> — the statement matches the passage exactly or through paraphrase',
                '<strong>False</strong> — the statement contradicts the passage',
                '<strong>Not Given</strong> — the information is not mentioned in the passage',
                'Focus on keywords and look for synonyms',
                'If you cannot find evidence, choose Not Given',
                'Do not use outside knowledge — base answers only on the text',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Matching Headings</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Read all headings first to understand the options',
                'Read the first paragraph and identify the main idea',
                'Match the heading that best summarizes the paragraph',
                'Look at the first and last sentences of each paragraph',
                'Do not match based on a single word — understand the gist',
                'If unsure, eliminate unlikely options and choose the best fit',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Summary Completion</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Identify which part of the passage the summary covers',
                'Read the summary to understand the context',
                'Check the word limit (e.g., NO MORE THAN TWO WORDS)',
                'Predict the type of word needed (noun, verb, number, etc.)',
                'Find the relevant section and locate the exact words',
                'Copy the words exactly as they appear in the passage',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold underline mb-1 text-[10.5pt]">Multiple Choice</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Read the question and all options carefully',
                'Eliminate clearly wrong answers first',
                'Find evidence in the passage for the correct answer',
                'Watch out for distractors — answers that seem right but are not',
                'Options with extreme words (always, never, all) are often wrong',
                'If two options seem similar, check the passage for distinction',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Matching Information</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Read the statements/questions first',
                'Identify keywords in each statement',
                'Scan the passage paragraph by paragraph',
                'Some paragraphs may be used more than once',
                'Look for paraphrasing of the keywords',
                'Do not spend too much time on one statement',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">General Tips for All Types</p>
            <ul className="list-none p-0">
              {[
                'Read the instructions carefully — word limits matter',
                'Answers must be spelled correctly',
                'Transfer answers to the answer sheet carefully',
                'If unsure, guess — there is no negative marking',
                'Practice with timed conditions regularly',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">3</div>
      </div>

      {/* Page 4 - Advanced Tips & Band Scores */}
      <div data-page={4} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] ${page !== 4 ? 'hidden' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="font-bold underline mb-1 text-[10.5pt]">Vocabulary for Reading</p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              Building academic vocabulary is essential for IELTS Reading success. Focus on:
            </p>
            <ul className="list-none p-0 mb-3">
              {[
                'Common academic words (from the Academic Word List)',
                'Words showing cause and effect: <em>therefore, consequently, as a result</em>',
                'Words showing contrast: <em>however, although, nevertheless</em>',
                'Words showing sequence: <em>firstly, subsequently, finally</em>',
                'Synonym groups: <em>important / significant / crucial / vital</em>',
                'Learn words through reading, not memorizing lists',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Speed Reading Tips</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Do not sub-vocalize (read in your head) — it slows you down',
                'Use a finger or pen to guide your eyes faster',
                'Read phrases, not individual words',
                'Practice reading academic articles regularly',
                'Set a timer to gradually increase your reading speed',
                'Aim for 250-300 words per minute',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Common Mistakes</p>
            <ul className="list-none p-0">
              {[
                'Not reading instructions carefully (word limits, letter answers)',
                'Spending too long on difficult questions',
                'Not using the passage — relying on prior knowledge',
                'Misunderstanding True/False/Not Given (guessing false when it is not given)',
                'Not transferring answers in time',
                'Spelling errors in written answers',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold underline mb-1 text-[10.5pt]">Band Score Conversion</p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              Your raw score (out of 40) is converted to the IELTS 9-band scale. Approximate conversions:
            </p>
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
            <ul className="list-none p-0 mb-3">
              {[
                'Always read the questions before the passage',
                'Practice with official IELTS Cambridge books',
                'Simulate test conditions — no pauses, 60 minutes only',
                'Analyze your mistakes after each practice test',
                'Build stamina by reading long academic articles',
                'Remember: consistent practice is the key to improvement',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <div className="border-2 border-black p-2 text-center font-bold text-[12pt] mt-2">
              Skim + Scan + Keywords = Reading Success
            </div>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">4</div>
      </div>
    </>
  )
}
