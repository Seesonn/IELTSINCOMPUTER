export default function WritingBooklet({ page }) {
  return (
    <>
      {/* Page 1 - Writing Overview */}
      <div data-page={1} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] leading-relaxed ${page !== 1 ? 'hidden' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="font-bold mb-2 text-[12pt]">IELTS Writing Overview</p>
            <p className="mb-3 text-justify">
              The IELTS Writing test takes <strong>60 minutes</strong> and consists of <strong>2 tasks</strong>. Both tasks must be completed.
            </p>
            <p className="mb-3 text-justify">
              <strong>Task 2 is worth 66%</strong> of your Writing score — allocate your time accordingly.
            </p>
            <table className="w-full border-collapse text-[10pt] mb-4" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold text-center bg-red-600 text-white">Feature</th><th className="border border-black p-1.5 font-bold text-center bg-red-600 text-white">Detail</th></tr>
              </thead>
              <tbody>
                <tr><td className="border border-black p-1.5 font-bold">Total Time</td><td className="border border-black p-1.5">60 minutes</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">Task 1</td><td className="border border-black p-1.5">20 min, 150+ words</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">Task 2</td><td className="border border-black p-1.5">40 min, 250+ words</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">Weighting</td><td className="border border-black p-1.5">Task 1 = 33%, Task 2 = 66%</td></tr>
              </tbody>
            </table>
            <p className="font-bold mb-1">Task 1 — Academic (Graphs/Charts)</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Describe visual data (line graph, bar chart, pie chart, table, diagram, map, process)',
                'Write an overview of the main trends',
                'Report specific details with data',
                'Do <strong>not</strong> give opinions or explanations — just describe',
                'Use appropriate language for trends, comparisons, and changes',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold mb-1">Task 1 — General Training (Letter)</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Write a letter (formal, semi-formal, or informal)',
                'Cover all three bullet points in the prompt',
                'Use appropriate tone based on the recipient',
                'Organize with clear paragraphs',
                'Include a clear purpose in the opening',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold mb-1">Task 2 — Essay (Both Academic & General)</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Write a discursive essay on a given topic',
                'Present and support your position with examples',
                'Common types: Opinion, Discussion, Problem/Solution, Double Question',
                'Use a clear 4-paragraph structure',
                'Develop arguments with specific examples and evidence',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Time Management Strategy</p>
            <table className="w-full border-collapse text-[10pt]" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Task</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Plan</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Write</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Review</th></tr>
              </thead>
              <tbody>
                <tr><td className="border border-black p-1.5">Task 1</td><td className="border border-black p-1.5">5 min</td><td className="border border-black p-1.5">12 min</td><td className="border border-black p-1.5">3 min</td></tr>
                <tr><td className="border border-black p-1.5">Task 2</td><td className="border border-black p-1.5">10 min</td><td className="border border-black p-1.5">25 min</td><td className="border border-black p-1.5">5 min</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">1</div>
      </div>

      {/* Page 2 - Task 1 Structure */}
      <div data-page={2} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] ${page !== 2 ? 'hidden' : ''}`}>
        <p className="text-base font-bold underline mb-4">Task 1 — Structure & Language</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="font-bold mb-1 text-[10.5pt]">Task 1 (Academic) — Structure</p>
            <table className="w-full border-collapse text-[10pt] mb-3" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Paragraph</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Content</th></tr>
              </thead>
              <tbody>
                <tr><td className="border border-black p-1.5 font-bold">1 — Introduction</td><td className="border border-black p-1.5">Paraphrase the question. "The line graph shows…"</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">2 — Overview</td><td className="border border-black p-1.5">Describe the main trends — no data. "Overall, there was a significant increase…"</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">3 — Details 1</td><td className="border border-black p-1.5">Specific data for the first key feature or time period</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">4 — Details 2</td><td className="border border-black p-1.5">Specific data for the second key feature or comparison</td></tr>
              </tbody>
            </table>
            <p className="font-bold mb-1 text-[10.5pt]">Key Vocabulary for Trends</p>
            <table className="w-full border-collapse text-[10pt] mb-3" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Trend</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Verbs</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Adjectives/Adverbs</th></tr>
              </thead>
              <tbody>
                {[
                  ['Increase', 'rose, increased, grew, climbed', 'significant(ly), sharp(ly), steady/steadily'],
                  ['Decrease', 'fell, dropped, declined, decreased', 'dramatic(ally), gradual(ly), slight(ly)'],
                  ['Stability', 'remained stable, stayed constant, plateaued', 'stable, steady, unchanged'],
                  ['Fluctuation', 'fluctuated, varied', 'erratic(ally), unstable'],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="border border-black p-1.5 font-bold">{row[0]}</td>
                    <td className="border border-black p-1.5 text-[9pt]">{row[1]}</td>
                    <td className="border border-black p-1.5 text-[9pt]">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p className="font-bold mb-1 text-[10.5pt]">Task 1 (General) — Letter Structure</p>
            <table className="w-full border-collapse text-[10pt] mb-3" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Tone</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">When to Use</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Opening</th></tr>
              </thead>
              <tbody>
                <tr><td className="border border-black p-1.5">Formal</td><td className="border border-black p-1.5 text-[9pt]">To someone you don\'t know</td><td className="border border-black p-1.5 text-[9pt]">Dear Sir/Madam,</td></tr>
                <tr><td className="border border-black p-1.5">Semi-formal</td><td className="border border-black p-1.5 text-[9pt]">To a teacher, manager, neighbour</td><td className="border border-black p-1.5 text-[9pt]">Dear Mr. Smith,</td></tr>
                <tr><td className="border border-black p-1.5">Informal</td><td className="border border-black p-1.5 text-[9pt]">To a friend or family member</td><td className="border border-black p-1.5 text-[9pt]">Dear John,</td></tr>
              </tbody>
            </table>
            <p className="font-bold mb-1 text-[10.5pt]">Letter Structure</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Opening greeting + purpose of the letter',
                'Paragraph 1: address the first bullet point',
                'Paragraph 2: address the second bullet point',
                'Paragraph 3: address the third bullet point',
                'Closing statement + appropriate sign-off',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Common Task 1 Mistakes</p>
            <ul className="list-none p-0">
              {[
                'No overview paragraph — this costs marks',
                'Giving opinions instead of describing data',
                'Using the same vocabulary repeatedly',
                'Missing the word count (150 words minimum)',
                'Forgetting to compare data points',
                'Using informal language in academic task',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">2</div>
      </div>

      {/* Page 3 - Task 2 Essay Structure */}
      <div data-page={3} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] ${page !== 3 ? 'hidden' : ''}`}>
        <p className="text-base font-bold underline mb-4">Task 2 — Essay Structure & Question Types</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="font-bold mb-1 text-[10.5pt]">4-Paragraph Essay Structure</p>
            <table className="w-full border-collapse text-[10pt] mb-3" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Paragraph</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Purpose</th></tr>
              </thead>
              <tbody>
                <tr><td className="border border-black p-1.5 font-bold">1 — Introduction</td><td className="border border-black p-1.5">Paraphrase topic + state your position / outline</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">2 — Body 1</td><td className="border border-black p-1.5">Main point + explanation + example</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">3 — Body 2</td><td className="border border-black p-1.5">Second main point + explanation + example</td></tr>
                <tr><td className="border border-black p-1.5 font-bold">4 — Conclusion</td><td className="border border-black p-1.5">Summarize main points + restate position</td></tr>
              </tbody>
            </table>
            <p className="font-bold mb-1 text-[10.5pt]">Introduction Formula</p>
            <ul className="list-none p-0 mb-3">
              {[
                '<strong>Sentence 1:</strong> Paraphrase the question (use synonyms, change structure)',
                '<strong>Sentence 2:</strong> State your thesis / opinion (for opinion essays)',
                '<strong>Sentence 3:</strong> Outline what you will discuss',
                'Keep introduction to 2-3 sentences only',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
            <p className="font-bold mb-1 text-[10.5pt]">Body Paragraph Formula</p>
            <ul className="list-none p-0 mb-3">
              {[
                '<strong>Topic Sentence:</strong> State the main idea of this paragraph',
                '<strong>Explanation:</strong> Explain what you mean in more detail',
                '<strong>Example:</strong> Give a specific example to support your point',
                'Use linking words to connect sentences smoothly',
                'Each body paragraph should focus on ONE main idea',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold mb-1 text-[10.5pt]">Question Types</p>
            <table className="w-full border-collapse text-[10pt] mb-3" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Type</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">What to Do</th></tr>
              </thead>
              <tbody>
                {[
                  ['Opinion (Agree/Disagree)', 'Give your view and support with reasons & examples'],
                  ['Discussion (Both Views)', 'Discuss both sides + give your opinion'],
                  ['Problem / Solution', 'Identify causes/problems + propose solutions'],
                  ['Advantages / Disadvantages', 'List pros and cons + give your position'],
                  ['Double Question', 'Answer both questions equally in your essay'],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="border border-black p-1.5 text-left font-bold text-[9.5pt]">{row[0]}</td>
                    <td className="border border-black p-1.5 text-left text-[9.5pt]">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="font-bold mb-1 text-[10.5pt]">Linking Words for Task 2</p>
            <table className="w-full border-collapse text-[10pt] mb-3" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Function</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Linking Words</th></tr>
              </thead>
              <tbody>
                {[
                  ['Introducing ideas', 'Firstly, To begin with, The main reason is'],
                  ['Adding ideas', 'Furthermore, Moreover, In addition, Also'],
                  ['Contrasting', 'However, On the other hand, Nevertheless, Although'],
                  ['Giving examples', 'For instance, For example, such as'],
                  ['Concluding', 'In conclusion, To sum up, Overall'],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="border border-black p-1.5 text-left font-bold text-[9pt]">{row[0]}</td>
                    <td className="border border-black p-1.5 text-left text-[9.5pt]">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="font-bold underline mb-1 text-[10.5pt]">Word Count Check</p>
            <p className="text-justify text-[10.5pt]" style={{ lineHeight: 1.45 }}>
              Task 2 requires <strong>at least 250 words</strong>. A well-developed essay is typically 280–320 words. Do not write more than 350 words — you waste time that could be used for checking.
            </p>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">3</div>
      </div>

      {/* Page 4 - Band Descriptors & Final Tips */}
      <div data-page={4} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] ${page !== 4 ? 'hidden' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="font-bold underline mb-1 text-[10.5pt]">Band Descriptors — 4 Criteria</p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              Both tasks are marked using four equally weighted criteria (25% each):
            </p>
            {[
              { title: '1) Task Achievement / Response', desc: 'Did you answer the question fully? Did you cover all requirements? For Task 1: did you describe the key features? For Task 2: did you address all parts of the prompt?' },
              { title: '2) Coherence & Cohesion', desc: 'Is your essay well-organized? Are paragraphs logically ordered? Do you use linking words effectively? Does the essay flow naturally from one idea to the next?' },
              { title: '3) Lexical Resource', desc: 'Do you use a range of vocabulary? Do you paraphrase effectively? Have you used less common words? Avoid repetition and use synonyms appropriately.' },
              { title: '4) Grammatical Range & Accuracy', desc: 'Do you use both simple and complex sentences? Are your sentences error-free? Can you use conditional structures, relative clauses, and passive voice?' },
            ].map((section, i) => (
              <div key={i} className="mb-2">
                <p className="font-bold underline text-[11pt] mb-0.5">{section.title}</p>
                <p className="text-justify text-[10pt]" style={{ lineHeight: 1.45 }}>{section.desc}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="font-bold underline mb-1 text-[10.5pt]">Grammatical Structures to Master</p>
            <table className="w-full border-collapse text-[10pt] mb-3" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Structure</th><th className="border border-black p-1.5 font-bold bg-red-600 text-white">Example</th></tr>
              </thead>
              <tbody>
                {[
                  ['Conditional (If)', 'If the government invests more, the situation could improve.'],
                  ['Relative clause', 'Students who study regularly achieve higher scores.'],
                  ['Passive voice', 'The test is taken by over 2 million people annually.'],
                  ['Comparatives', 'This solution is more effective than the alternative.'],
                  ['Modal verbs', 'This could lead to significant improvements.'],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="border border-black p-1.5 text-left font-bold text-[9pt]">{row[0]}</td>
                    <td className="border border-black p-1.5 text-left text-[9pt]">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="font-bold underline mb-1 text-[10.5pt]">Final Tips for High Score</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Plan before writing — never start without a plan',
                'Use a variety of sentence structures',
                'Avoid memorized essays — examiners can detect them',
                'Stay on topic — do not go off on tangents',
                'Leave 5 minutes to proofread for errors',
                'Practice handwriting — legibility matters in the real test',
                'Learn to write 250 words in 40 minutes through regular practice',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Common Writing Mistakes</p>
            <ul className="list-none p-0 mb-3">
              {[
                'Not directly answering the question',
                'Poor paragraph organization',
                'Overusing linking words (firstly, secondly, thirdly...)',
                'Repeating the same vocabulary',
                'Not writing enough words',
                'Not leaving time to review',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <div className="border-2 border-black p-2 text-center font-bold text-[12pt] mt-2">
              Plan + Structure + Examples + Review = Band 7+
            </div>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">4</div>
      </div>
    </>
  )
}
