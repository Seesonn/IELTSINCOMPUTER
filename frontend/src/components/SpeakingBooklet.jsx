export default function SpeakingBooklet({ page }) {
  return (
    <>
      {/* Page 1 - Speaking Guide */}
      <div data-page={1} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] leading-relaxed ${page !== 1 ? 'hidden' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="mb-3 text-justify">IELTS's four module is divided into two major parts:</p>
            <table className="w-full border-collapse text-[10pt] mb-4" style={{ border: '1px solid black' }}>
              <thead>
                <tr><th className="border border-black p-1.5 font-bold text-center bg-red-600 text-white">Receptor</th><th className="border border-black p-1.5 font-bold text-center bg-red-600 text-white">Productive</th></tr>
              </thead>
              <tbody>
                <tr><td className="border border-black p-1.5 text-center">Listening &amp; Reading</td><td className="border border-black p-1.5 text-center">Writing &amp; Speaking</td></tr>
              </tbody>
            </table>
            <p className="font-bold mb-1">Speaking</p>
            <p className="mb-2">There are 3 parts in IELTS speaking. These are:</p>
            <p className="font-bold underline mb-1">Part 1:</p>
            <ul className="list-none p-0 mb-2">
              {['Last for about 5-8 mins', 'Based on interview format', 'Answer at least 10 seconds to each questions and give reason depending upon question', 'Questions focusing on personal mainly related about general introduction, interest, hobbies', 'Common topic includes: hometown, neighborhood, work, study, food, sports, friends, family', 'Be confident, maintain eye-contact, behave friendly through body language too'].map((item, i) => (
                <li key={i} className="pl-4 mb-0.5 text-[10pt] relative before:content-['-'] before:absolute before:left-0">{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1">Part 2:</p>
            <ul className="list-none p-0 mb-2">
              {['Last for 3 mins', 'Monologue format referred as <strong>Cue Card</strong>', 'Make optimum use of <strong>1 min</strong> preparation time and try to speak at least <strong>90 secs</strong>', 'Use <strong>Keyword Mapping</strong>', 'Do not leave any given points unanswered', 'Use personal examples', 'Expand by co-relating the main topic and the characters introduced', 'Organize speech into <strong>Introduction, Body, Conclusion</strong>', 'Use introductory phrase such as: <em>Thank you for the cue card\u2026 I would like to talk about\u2026</em>', 'Use transition such as: <em>First of all, Secondly, After that, Finally</em>', 'Use tenses according to the question', 'Speak loudly and clearly'].map((item, i) => (
                <li key={i} className="pl-4 mb-0.5 text-[10pt] relative before:content-['-'] before:absolute before:left-0" dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
            <p className="font-bold underline mb-1">Part 3:</p>
            <ul className="list-none p-0">
              {['Last for 3-5 mins', 'Answer at least 15 to 20 seconds to each questions and give reason depending upon question', 'Similar to Part 1'].map((item, i) => (
                <li key={i} className="pl-4 mb-0.5 text-[10pt] relative before:content-['-'] before:absolute before:left-0">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <ul className="list-none p-0 mb-3">
              {['Listen for keywords', 'Do not hesitate to request to repeat the question if you did not understand', 'Give details, examples, reasons clearly', 'Do not go off topic', 'Build higher level of vocabulary', 'Relate question to own life', 'Divide up answer', 'Use modals such as <em>Can, Could, May, Might</em>', 'Use "That\'s a good question" but only once'].map((item, i) => (
                <li key={i} className="pl-4 mb-0.5 text-[10pt] relative before:content-['-'] before:absolute before:left-0" dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              IELTS speaking is marked using the following four criteria also known as band descriptor which are equally weighted meaning each consists of 25% marks in IELTS speaking.
            </p>
            <p className="text-justify text-[10.5pt] mb-2" style={{ lineHeight: 1.45 }}>
              For <strong>Band 6</strong> or higher you need to fulfill:
            </p>
            {[
              { title: '1) Fluency & Coherence', items: ['Willingness (effort) to speak at length', 'Range of connectives & discourse marker', 'Avoid repetition, hesitation, self-correction'] },
              { title: '2) Lexical Resources', items: ['Wide, uncommon vocabulary', 'Paraphrase successfully', 'Idiomatic language naturally'] },
              { title: '3) Grammatical Range and Accuracy', items: ['Range of simple & complex sentences', 'May produces error-free sentences with complex structure but does not cause comprehension problems'] },
              { title: '4) Pronunciation', items: ['Use range of pronunciation features', 'Do not mispronounce words', 'L1 accent has minimal effect', 'Does not sound robotic', 'Effortless to understand'] },
            ].map((section, i) => (
              <div key={i} className="mb-2">
                <p className="font-bold underline text-[11pt] mb-0.5">{section.title}</p>
                <ul className="list-none p-0">
                  {section.items.map((item, j) => (
                    <li key={j} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-justify text-[10.5pt] mt-3 mb-3" style={{ lineHeight: 1.45 }}>
              In general one can use the recommended format for speaking to secure <strong>6 or higher</strong>:
            </p>
            <div className="border-2 border-black p-2 text-center font-bold text-[12pt]">
              L.W + Paraphrase + Connectives + Reason
            </div>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">1</div>
      </div>

      {/* Page 2 - Linking Words */}
      <div data-page={2} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] ${page !== 2 ? 'hidden' : ''}`}>
        <p className="text-base font-bold underline mb-4">Linking Words and Phrases</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            {[
              { title: 'When expressing your opinion, agreeing, and disagreeing', items: ['as far as I am concerned','from my perspective','from my point of view','in my opinion','it seems to me that','I accept that','I strongly/firmly believe that','I agree with that','I am aware of that','I don\'t really accept that','I am not totally convinced that','I don\'t really agree with that'] },
              { title: 'When reporting to other people\'s opinions', items: ['according to','it\'s often said that'] },
              { title: 'When emphasizing a point', items: ['actually','in fact','to be honest'] },
              { title: 'When introducing a point', items: ['first of all','firstly','in the first place','to begin with'] },
              { title: 'When introducing an additional point', items: ['additionally','apart from that','in addition to','secondly','what\'s more'] },
              { title: 'When clarifying a point', items: ['in other words','to be clear','what I mean is'] },
              { title: 'When being more specific to a point', items: ['in particular','specifically','to be more specific','in particular'] },
            ].map((group, i) => (
              <div key={i} className="mb-3">
                <p className="font-bold italic text-xs mb-0.5">{group.title}</p>
                <ul className="list-none p-0">
                  {group.items.map((item, j) => (
                    <li key={j} className="text-[10pt] relative pl-3 before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div>
            {[
              { title: 'When comparing', items: ['in a similar way','likewise','similarly'] },
              { title: 'When giving reasons and expressing results', items: ['another reason why','as a result of','due to','on account of','that\'s why','the main reason why','since'] },
              { title: 'When speculating', items: ['it\'s possible that','I suspect that','I don\'t really know for sure but maybe','it\'s not an area I know a lot about but perhaps','it\'s difficult to answer that with any certainty but maybe','probably','may','might','possibly'] },
              { title: 'When talking hypothetically', items: ['if I had to','I would prefer to','I would rather','I wish I had'] },
              { title: 'When expressing contrast', items: ['although','nevertheless','on the one hand','on the other hand','despite','in spite of','whereas'] },
              { title: 'When gaining time to think', items: ['that\'s a good question and not one I have really spent much time thinking about before. But I suppose','I haven\'t really thought about that but I reckon','off the top of my head I think'] },
              { title: 'When giving examples', items: ['for instance','such as','one example of that is'] },
            ].map((group, i) => (
              <div key={i} className="mb-3">
                <p className="font-bold italic text-xs mb-0.5">{group.title}</p>
                <ul className="list-none p-0">
                  {group.items.map((item, j) => (
                    <li key={j} className="text-[10pt] relative pl-3 before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">2</div>
      </div>

      {/* Page 3 - Discourse Markers */}
      <div data-page={3} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] ${page !== 3 ? 'hidden' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              <strong>Discourse markers</strong> are used to organize and manage what we are saying using words and phrases to connect ideas and to express how we feel about what we are saying.
            </p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              Look at the discourse markers <strong className="underline">bold &amp; underlined</strong> in the following sentences:
            </p>
            <p className="italic text-[10.5pt] mb-3" style={{ lineHeight: 1.5 }}>
              <em>"The food I ate last night <strong className="underline">probably</strong> gave me food poisoning, <strong className="underline">so, unfortunately</strong>, I've been up all night."</em>
            </p>
            <p className="italic text-[10.5pt] mb-3" style={{ lineHeight: 1.5 }}>
              <em>"<strong className="underline">The first thing</strong> I am going to do is show you the broken screen, <strong className="underline">then</strong> I'll explain how it happened, <strong className="underline">after which</strong> I will discuss my proposed solution."</em>
            </p>
            <table className="w-full border-collapse text-[10pt]" style={{ border: '1px solid black' }}>
              <thead>
                <tr>
                  <th className="border border-black p-1.5 text-center font-bold bg-red-600 text-white">Function</th>
                  <th className="border border-black p-1.5 text-center font-bold bg-red-600 text-white">Discourse Markers</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Sequencing - ordering information', 'First of all, Firstly, To begin with, Secondly, Subsequently, Finally, After this'],
                  ['Adding information', 'Also, And, Besides, Additionally, Another thing that comes to mind, What\'s more'],
                  ['Indicating opinion & attitude', 'Unfortunately, Actually, To be honest, Frankly, Clearly, Seriously, As a matter of fact'],
                  ['Comparing', 'Similarly, In the same way, Likewise, Equally, In a similar fashion'],
                  ['Contrasting', 'However, Although, Instead of, Despite, On the other hand, Whereas, In contrast'],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="border border-black p-1.5 text-left font-bold bg-gray-200">{row[0]}</td>
                    <td className="border border-black p-1.5 text-left" style={{ verticalAlign: 'top', lineHeight: 1.4 }}>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p className="font-bold underline mb-2 text-[10.5pt]">More Discourse Markers</p>
            <table className="w-full border-collapse text-[10pt]" style={{ border: '1px solid black' }}>
              <thead>
                <tr>
                  <th className="border border-black p-1.5 text-center font-bold bg-red-600 text-white">Function</th>
                  <th className="border border-black p-1.5 text-center font-bold bg-red-600 text-white">Discourse Markers</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Giving examples', 'For example, For instance, A great example of this is, A personal example is, Such as'],
                  ['Stalling for time', 'Let me think about that\u2026, That\'s a difficult question, Well, Actually, Basically'],
                  ['Result', 'As a result, Because of this, Therefore, Consequently, So, Then'],
                  ['Generalizing', 'Generally, Broadly speaking, As a rule, On the whole, In most cases, The vast majority of'],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="border border-black p-1.5 text-left font-bold bg-gray-200">{row[0]}</td>
                    <td className="border border-black p-1.5 text-left" style={{ verticalAlign: 'top', lineHeight: 1.4 }}>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-justify text-[10.5pt] mt-4 mb-2" style={{ lineHeight: 1.45 }}>
              For <strong>Band 6</strong> or higher you need to use a range of discourse markers naturally.
            </p>
            <p className="text-justify text-[10.5pt]" style={{ lineHeight: 1.45 }}>
              The key is to use them appropriately - don't force them. Practice incorporating them into your speech until they feel natural.
            </p>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">3</div>
      </div>

      {/* Page 4 - Extra Tips */}
      <div data-page={4} className={`w-full bg-white shadow-lg p-6 sm:p-10 relative text-[11pt] ${page !== 4 ? 'hidden' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              <strong>General Tips for IELTS Speaking:</strong>
            </p>
            <ul className="list-none p-0 mb-3">
              {[
                'Listen for keywords in the question',
                'Do not hesitate to ask the examiner to repeat if you did not understand',
                'Give details, examples, reasons clearly',
                'Do not go off topic - answer the question directly',
                'Build higher level of vocabulary for uncommon topics',
                'Relate the question to your own life for authentic answers',
                'Divide up your answer into clear points',
                'Use modals such as Can, Could, May, Might',
                'Use "That\'s a good question" but only once per test',
              ].map((item, i) => (
                <li key={i} className="pl-4 text-[10pt] relative before:content-['-'] before:absolute before:left-0" style={{ lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
            <p className="font-bold underline mb-1 text-[10.5pt]">Part 1 Tips</p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              Part 1 is about personal information. Answer each question with 2-3 sentences. Give a direct answer, then add a reason or example. Common topics: hometown, work/study, hobbies, food, family, friends, weather, transport.
            </p>
            <p className="font-bold underline mb-1 text-[10.5pt]">Part 2 Tips - Cue Card</p>
            <p className="text-justify text-[10.5pt] mb-3" style={{ lineHeight: 1.45 }}>
              Use the 1 minute preparation time to make keyword notes. Structure your answer: Introduction \u2192 Body (cover all points) \u2192 Conclusion. Use personal examples and try to speak for at least 90 seconds. Use transitions like "First of all", "Secondly", "After that", "Finally".
            </p>
            <p className="font-bold underline mb-1 text-[10.5pt]">Part 3 Tips</p>
            <p className="text-justify text-[10.5pt]" style={{ lineHeight: 1.45 }}>
              Part 3 is more abstract. Answer each question for 15-20 seconds. Give reasons, examples, and express opinions. Use a range of linking words and discourse markers. Show the examiner you can discuss complex topics.
            </p>
          </div>
          <div>
            <p className="font-bold underline text-[11pt] mb-1">Band Descriptors - What Examiners Look For</p>
            {[
              { title: '1) Fluency & Coherence', desc: 'Speak at length without unnatural pausing. Use connectives and discourse markers to link ideas. Avoid repetition and self-correction.' },
              { title: '2) Lexical Resource', desc: 'Use a wide range of vocabulary. Paraphrase successfully. Include idiomatic language naturally. Use less common words appropriately.' },
              { title: '3) Grammatical Range and Accuracy', desc: 'Use both simple and complex sentence structures. Make errors only when attempting complex structures. Maintain control of tenses.' },
              { title: '4) Pronunciation', desc: 'Use a range of pronunciation features (stress, intonation). Do not mispronounce key words. Your L1 accent should have minimal effect on clarity. Speak clearly and at a natural pace.' },
            ].map((section, i) => (
              <div key={i} className="mb-3">
                <p className="font-bold underline text-[11pt] mb-0.5">{section.title}</p>
                <p className="text-justify text-[10pt]" style={{ lineHeight: 1.45 }}>{section.desc}</p>
              </div>
            ))}
            <p className="text-justify text-[10.5pt] mt-4 mb-2" style={{ lineHeight: 1.45 }}>
              Remember: All four criteria are equally weighted at <strong>25%</strong> each.
            </p>
            <div className="border-2 border-black p-2 text-center font-bold text-[12pt] mt-2">
              L.W + Paraphrase + Connectives + Reason = Band 6+
            </div>
          </div>
        </div>
        <div className="text-center text-[10pt] mt-6">4</div>
      </div>
    </>
  )
}
