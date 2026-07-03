"""Seed listening section with all 14 question types (40 questions)."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app import models
from app.utils.auth import hash_password

from app.models import QuestionType

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Find the existing test
test1 = db.query(models.IELTSTest).first()
if not test1:
    print("No test found. Run the main seed first.")
    db.close()
    sys.exit(1)

# Delete old listening section if present
old = db.query(models.TestSection).filter(
    models.TestSection.section_type == models.SectionType.listening
).first()
if old:
    print(f"Deleting old listening section id={old.id}")
    qgs = db.query(models.QuestionGroup).filter(models.QuestionGroup.section_id == old.id).all()
    for qg in qgs:
        qids = [q.id for q in db.query(models.Question).filter(models.Question.group_id == qg.id).all()]
        if qids:
            db.query(models.UserAnswer).filter(models.UserAnswer.question_id.in_(qids)).delete(synchronize_session=False)
            db.query(models.Question).filter(models.Question.group_id == qg.id).delete(synchronize_session=False)
        db.delete(qg)
    db.delete(old)
    db.commit()
    print("Old listening section deleted.")

# ── Create listening section ─────────────────────────────────────────────
listening_section = models.TestSection(
    test_id=test1.id,
    section_type=models.SectionType.listening,
    section_number=1,
    title="Listening",
    instructions="You will hear four recordings and answer 40 questions. You have 30 minutes plus 10 minutes to transfer answers.",
    time_limit_seconds=2400,
    audio_url="/static/audio/test1_listening.mp3",
)
db.add(listening_section)
db.commit()

# ── Recording 1: University Accommodation (Q 1–10) ─────────────────────
# Note Completion
lqg1 = models.QuestionGroup(
    section_id=listening_section.id,
    question_type=QuestionType.note_completion,
    instruction="Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer. Questions 1–4.",
    order_index=0,
    extra_data={
        "recording": 1,
        "context": "A student calls the university accommodation office about housing options.",
        "form_title": "STUDENT ACCOMMODATION ENQUIRY",
        "form_template": (
            "**Date:** 14th September\n"
            "**Student name:** Anna {1}\n"
            "**Course:** {2}\n"
            "**Year of study:** {3}\n"
            "**Preferred hall:** {4} Hall"
        ),
    },
)
db.add(lqg1)
db.commit()

for num, prompt, answer, alts in [
    (1, "___", "Kowalski", None),
    (2, "___", "Environmental Science", ["Environmental Sciences"]),
    (3, "___", "second", ["2nd", "2"]),
    (4, "___", "Queen's", ["Queens"]),
]:
    db.add(models.Question(group_id=lqg1.id, question_number=num, prompt=prompt, correct_answer=answer, alt_answers=alts, order_index=num))
db.commit()

# Short Answer
lqg1b = models.QuestionGroup(
    section_id=listening_section.id,
    question_type=QuestionType.short_answer,
    instruction="Answer the questions below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer. Questions 5–7.",
    order_index=1,
    extra_data={
        "recording": 1,
        "context": "The accommodation officer explains the application process.",
        "word_limit": 3,
    },
)
db.add(lqg1b)
db.commit()

for num, prompt, answer in [
    (5, "What type of accommodation is most popular among first-year students?", "university halls"),
    (6, "By what date must the accommodation form be submitted?", "30th September"),
    (7, "What deposit is required to secure a place?", "250 pounds"),
]:
    db.add(models.Question(group_id=lqg1b.id, question_number=num, prompt=prompt, correct_answer=answer, order_index=num))
db.commit()

# Multiple Choice
lqg1c = models.QuestionGroup(
    section_id=listening_section.id,
    question_type=QuestionType.multiple_choice,
    instruction='Choose the correct letter, A, B, or C. Questions 8–10.',
    order_index=2,
    extra_data={
        "recording": 1,
        "context": "The officer provides additional information about campus facilities.",
        "8": {"options": {"A": "a swimming pool", "B": "a careers advice centre", "C": "a pharmacy"}},
        "9": {"options": {"A": "8 pm", "B": "10 pm", "C": "midnight"}},
        "10": {"options": {"A": "meals and laundry", "B": "internet and electricity", "C": "gym membership and parking"}},
    },
)
db.add(lqg1c)
db.commit()

for num, prompt, answer in [
    (8, "What facility is available in the student union building?", "B"),
    (9, "Until what time is the university library open on weekdays?", "B"),
    (10, "What is included in the accommodation fee?", "B"),
]:
    db.add(models.Question(group_id=lqg1c.id, question_number=num, prompt=prompt, correct_answer=answer, order_index=num))
db.commit()

# ── Recording 2: Museum Visit (Q 11–20) ──────────────────────────────────
# Multiple Choice
lqg2 = models.QuestionGroup(
    section_id=listening_section.id,
    question_type=QuestionType.multiple_choice,
    instruction="Choose the correct letter, A, B, or C. Questions 11–13.",
    order_index=3,
    extra_data={
        "recording": 2,
        "context": "The students compare different study methods for their upcoming exams.",
        "11": {"options": {"A": "creating mind maps", "B": "group discussion", "C": "practice tests"}},
        "12": {"options": {"A": "reading textbooks aloud", "B": "summarising notes", "C": "watching videos"}},
        "13": {"options": {"A": "a calm environment", "B": "short breaks", "C": "study groups"}},
    },
)
db.add(lqg2)
db.commit()

for num, prompt, answer in [
    (11, "What study method does Sarah find most effective?", "C"),
    (12, "What technique does Tom recommend for remembering key facts?", "B"),
    (13, "What does the tutor suggest is most important for effective study?", "A"),
]:
    db.add(models.Question(group_id=lqg2.id, question_number=num, prompt=prompt, correct_answer=answer, order_index=num))
db.commit()

for num, prompt, answer in [
    (11, "The museum was originally built as a…", "B"),
    (12, "How many galleries does the museum currently have?", "C"),
    (13, "Visitors are NOT allowed to…", "B"),
]:
    db.add(models.Question(group_id=lqg2.id, question_number=num, prompt=prompt, correct_answer=answer, order_index=num))
db.commit()

# Matching Features
lqg2a = models.QuestionGroup(
    section_id=listening_section.id,
    question_type=QuestionType.match_features,
    instruction="Match each invention to the correct inventor. Write the correct letter, A, B, C, or D, in boxes 14–16.",
    order_index=4,
    extra_data={
        "recording": 2,
        "context": "A lecturer describes key inventions and their inventors.",
        "categories": {
            "A": "Thomas Edison",
            "B": "Alexander Graham Bell",
            "C": "Marie Curie",
            "D": "Nikola Tesla",
        }
    },
)
db.add(lqg2a)
db.commit()

for num, prompt, answer in [
    (14, "The telephone", "B"),
    (15, "The alternating current system", "D"),
    (16, "Radium and polonium", "C"),
]:
    db.add(models.Question(group_id=lqg2a.id, question_number=num, prompt=prompt, correct_answer=answer, order_index=num))
db.commit()

# Sentence Endings
lqg2b = models.QuestionGroup(
    section_id=listening_section.id,
    question_type=QuestionType.sentence_endings,
    instruction="Complete each sentence with the correct ending, A–E. Questions 17–18.",
    order_index=5,
    extra_data={
        "recording": 2,
        "context": "A docent explains the museum's history.",
        "endings": {
            "A": "was added in 2010",
            "B": "focuses on ancient civilisations",
            "C": "contains mostly modern art",
            "D": "is closed for renovation",
            "E": "houses the museum's archives",
        }
    },
)
db.add(lqg2b)
db.commit()

for num, prompt, answer in [
    (17, "The main building of the museum", "A"),
    (18, "The east wing of the museum", "C"),
]:
    db.add(models.Question(group_id=lqg2b.id, question_number=num, prompt=prompt, correct_answer=answer, order_index=num))
db.commit()

# Matching Features
lqg2d = models.QuestionGroup(
    section_id=listening_section.id,
    question_type=QuestionType.match_features,
    instruction="Which floor of the museum contains the following? Write the correct letter, A, B, C, or D, in boxes 19–20.",
    order_index=6,
    extra_data={
        "recording": 2,
        "context": "The guide explains the location of exhibits in the museum.",
        "categories": {
            "A": "Ground Floor",
            "B": "First Floor",
            "C": "Second Floor",
            "D": "Basement",
        }
    },
)
db.add(lqg2d)
db.commit()

for num, prompt, answer in [
    (19, "A working replica of the first computer", "C"),
    (20, "Antique carriages and early automobiles", "A"),
]:
    db.add(models.Question(group_id=lqg2d.id, question_number=num, prompt=prompt, correct_answer=answer, order_index=num))
db.commit()

# ── Recording 3: University Presentation (Q 21–30) ──────────────────────
# Sentence Completion
lqg3 = models.QuestionGroup(
    section_id=listening_section.id,
    question_type=QuestionType.sentence_completion,
    instruction="Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer. Questions 21–23.",
    order_index=7,
    extra_data={
        "recording": 3,
        "context": "Two students discuss their group presentation for a business studies module.",
        "word_limit": 2,
    },
)
db.add(lqg3)
db.commit()

for num, prompt, answer, alts in [
    (21, "The presentation topic is the impact of ___ on retail businesses.", "e-commerce", ["online shopping"]),
    (22, "Their presentation will be on ___ morning.", "Tuesday", None),
    (23, "Each group member will speak for ___ minutes.", "five", ["5"]),
]:
    db.add(models.Question(group_id=lqg3.id, question_number=num, prompt=prompt, correct_answer=answer, alt_answers=alts, order_index=num))
db.commit()

# Table Completion
lqg3b = models.QuestionGroup(
    section_id=listening_section.id,
    question_type=QuestionType.table_completion,
    instruction="Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer. Questions 24–27.",
    order_index=8,
    extra_data={
        "recording": 3,
        "context": "The students present survey results comparing three online retail sectors.",
        "form_title": "ONLINE RETAIL SECTOR COMPARISON",
        "table_headers": ["Sector", "Annual Growth", "Main Customer Concern", "Average Order Value"],
        "table_rows": [
            ["Fashion", "{24}%", "Fit and sizing", "\u00a3{25}"],
            ["Electronics", "15%", "{26} support", "\u00a3180"],
            ["Groceries", "28%", "Delivery {27}", "\u00a345"],
        ],
    },
)
db.add(lqg3b)
db.commit()

for num, answer in [(24, "22"), (25, "65"), (26, "after-sales"), (27, "time slots")]:
    db.add(models.Question(group_id=lqg3b.id, question_number=num, prompt="___", correct_answer=answer, order_index=num))
db.commit()

# Multiple Choice
lqg3c = models.QuestionGroup(
    section_id=listening_section.id,
    question_type=QuestionType.multiple_choice,
    instruction="Choose the correct letter, A, B, or C. Questions 28–30.",
    order_index=9,
    extra_data={
        "recording": 3,
        "context": "The students discuss the key findings from their research.",
        "28": {"options": {"A": "focus on pricing strategies", "B": "expand to rural areas", "C": "improve delivery speed"}},
        "29": {"options": {"A": "fashion sector", "B": "electronics sector", "C": "grocery sector"}},
        "30": {"options": {"A": "product quality", "B": "customer loyalty", "C": "supply chain costs"}},
    },
)
db.add(lqg3c)
db.commit()

for num, prompt, answer in [
    (28, "According to the survey, what do most online shoppers want retailers to improve?", "C"),
    (29, "Which retail sector showed the highest customer satisfaction rating?", "A"),
    (30, "What was identified as the biggest challenge for online retailers?", "C"),
]:
    db.add(models.Question(group_id=lqg3c.id, question_number=num, prompt=prompt, correct_answer=answer, order_index=num))
db.commit()

# ── Recording 4: Coastal Geography Lecture (Q 31–40) ───────────────────────
# Diagram Labelling
lqg4 = models.QuestionGroup(
    section_id=listening_section.id,
    question_type=QuestionType.diagram_labelling,
    instruction="Label the diagram of coastal defences. Write NO MORE THAN TWO WORDS for each answer. Questions 31–33.",
    order_index=10,
    extra_data={
        "recording": 4,
        "context": "A geography lecturer explains different coastal defence structures.",
        "diagram_description": "Cross-section of a coastline showing: a tall wall at the top of the beach [31], wooden structures extending into the sea at regular intervals [32], and a pile of rocks at the base of the cliff [33].",
        "labels": {
            "31": "Vertical structure built at the back of the beach to prevent flooding",
            "32": "Wooden barriers built perpendicular to the coastline",
            "33": "Large rocks placed at the foot of a cliff",
        },
    },
)
db.add(lqg4)
db.commit()

for num, prompt, answer in [
    (31, "___", "sea wall"),
    (32, "___", "groynes"),
    (33, "___", "riprap"),
]:
    db.add(models.Question(group_id=lqg4.id, question_number=num, prompt=prompt, correct_answer=answer, order_index=num))
db.commit()

# Flow Chart
lqg4b = models.QuestionGroup(
    section_id=listening_section.id,
    question_type=QuestionType.flow_chart,
    instruction="Complete the flow chart below. Choose ONE WORD ONLY from the recording for each answer. Questions 34–36.",
    order_index=11,
    extra_data={
        "recording": 4,
        "context": "The lecturer explains the process of coastal erosion and defence planning.",
        "steps": [
            "Step 1: Identify areas at highest risk of {34}",
            "Step 2: Assess the {35} impact on local communities",
            "Step 3: Choose appropriate {36} based on budget and geography",
        ],
    },
)
db.add(lqg4b)
db.commit()

for num, answer in [(34, "erosion"), (35, "economic"), (36, "defences")]:
    db.add(models.Question(group_id=lqg4b.id, question_number=num, prompt="___", correct_answer=answer, order_index=num))
db.commit()

# Classification
lqg4c = models.QuestionGroup(
    section_id=listening_section.id,
    question_type=QuestionType.classification,
    instruction="Classify the following coastal features. Write the correct letter, A, B, or C, in boxes 37–38.",
    order_index=12,
    extra_data={
        "recording": 4,
        "context": "The lecturer classifies coastal features by their formation process.",
        "categories": {
            "A": "Erosional feature",
            "B": "Depositional feature",
            "C": "Man-made structure",
        }
    },
)
db.add(lqg4c)
db.commit()

for num, prompt, answer in [
    (37, "Sea stack", "A"),
    (38, "Spit", "B"),
]:
    db.add(models.Question(group_id=lqg4c.id, question_number=num, prompt=prompt, correct_answer=answer, order_index=num))
db.commit()

# Summary Completion
lqg4d = models.QuestionGroup(
    section_id=listening_section.id,
    question_type=QuestionType.summary_completion,
    instruction="Complete the summary below. Write NO MORE THAN TWO WORDS for each answer. Questions 39–40.",
    order_index=13,
    extra_data={
        "recording": 4,
        "context": "The lecturer concludes with a summary of coastal defence strategies.",
        "form_title": "LECTURE SUMMARY",
        "word_limit": 2,
        "form_template": (
            "Effective coastal management requires a balanced approach. "
            "Hard engineering provides strong protection but can lead to increased {39} further along the coast. "
            "Soft engineering techniques work with natural processes and provide better {40} outcomes."
        ),
    },
)
db.add(lqg4d)
db.commit()

for num, answer in [(39, "erosion"), (40, "environmental")]:
    db.add(models.Question(group_id=lqg4d.id, question_number=num, prompt="___", correct_answer=answer, order_index=num))
db.commit()

db.close()

print("-> Listening section seeded successfully!")
print("   Recording 1 (Q 1–10):  Note Completion, Short Answer, Multiple Choice")
print("   Recording 2 (Q 11–20): Multiple Choice, Match Features, Sentence Endings, Match Features")
print("   Recording 3 (Q 21–30): Sentence Completion, Table Completion, Multiple Choice")
print("   Recording 4 (Q 31–40): Diagram Labelling, Flow Chart, Classification, Summary Completion")
