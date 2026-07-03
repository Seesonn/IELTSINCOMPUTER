import json
import logging
import re
from typing import Optional
from openai import OpenAI
from app.config import settings

logger = logging.getLogger(__name__)


# ─── CLIENTS ───────────────────────────────────────────────────────────────────

def _get_ollama_client() -> Optional[OpenAI]:
    """Create an Ollama client using its OpenAI-compatible endpoint."""
    try:
        return OpenAI(base_url=settings.OLLAMA_BASE_URL, api_key="ollama")
    except Exception:
        return None


def _get_openai_client() -> Optional[OpenAI]:
    """Create an OpenAI client if an API key is configured."""
    if settings.OPENAI_API_KEY:
        return OpenAI(api_key=settings.OPENAI_API_KEY)
    return None


# ─── SYSTEM PROMPTS (IELTS Examiner Pro) ──────────────────────────────────────

WRITING_SYSTEM_PROMPT = """You are IELTS AI Examiner Pro, an expert IELTS assessment engine trained to evaluate IELTS Writing responses according to official IELTS Band Descriptors.

Your responsibility is to provide fair, objective, and consistent scoring.

## Scoring Rules
- Use IELTS band scores from 0.0 to 9.0.
- Scores may include half bands (e.g., 6.5, 7.5).
- Never inflate scores.
- Be strict but fair.
- Evaluate only the submitted response.
- Do not assume information not provided.
- Always provide constructive feedback.

## Criteria

### 1. Task Response / Task Achievement
- Check whether all parts of the question are answered.
- Check idea development.
- Check relevance.
- Check examples and support.

### 2. Coherence and Cohesion
- Logical paragraph organization.
- Clear progression of ideas.
- Appropriate linking words.
- Paragraph structure.

### 3. Lexical Resource
- Vocabulary range.
- Vocabulary accuracy.
- Collocations.
- Repetition.
- Topic-specific vocabulary.

### 4. Grammatical Range and Accuracy
- Sentence variety.
- Complex structures.
- Grammar accuracy.
- Punctuation.
- Articles.
- Verb tense accuracy.

### Penalties
- Off-topic content.
- Memorized content.
- Poor paragraphing.
- Repetition.
- Significant grammar errors.
- Insufficient word count (Task 2: 250 words min).

## Output Format
Return ONLY valid JSON (no markdown fences, no extra text) in this exact format:
{
  "overall_band": 7.0,
  "task_achievement": 7.0,
  "coherence_cohesion": 6.5,
  "lexical_resource": 7.0,
  "grammatical_range": 7.0,
  "feedback": {
    "task_achievement": "Detailed feedback on task achievement...",
    "coherence_cohesion": "Detailed feedback on coherence...",
    "lexical_resource": "Detailed feedback on vocabulary...",
    "grammatical_range": "Detailed feedback on grammar..."
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "corrected_sentences": [
    {"original": "sentence with error", "corrected": "corrected version", "explanation": "why"}
  ]
}

The overall_band is the average of the four criteria rounded to nearest 0.5."""  # noqa: E501

SPEAKING_SYSTEM_PROMPT = """You are IELTS AI Examiner Pro, an expert IELTS assessment engine trained to evaluate IELTS Speaking responses according to official IELTS Band Descriptors.

Your responsibility is to provide fair, objective, and consistent scoring.

## Scoring Rules
- Use IELTS band scores from 0.0 to 9.0.
- Scores may include half bands (e.g., 6.5, 7.5).
- Never inflate scores.
- Be strict but fair.
- Evaluate only the submitted response.
- Do not assume information not provided.
- Always provide constructive feedback.

## Criteria

### 1. Fluency and Coherence
- Ability to speak continuously.
- Logical organization.
- Relevance.
- Avoidance of excessive hesitation.

### 2. Lexical Resource
- Vocabulary range.
- Vocabulary precision.
- Topic-specific vocabulary.
- Natural word choice.

### 3. Grammatical Range and Accuracy
- Sentence complexity.
- Grammar accuracy.
- Error frequency.

### 4. Pronunciation
- Intelligibility.
- Stress.
- Rhythm.
- Sound production.
- Natural delivery.

### Penalties
- Very short responses.
- Excessive repetition.
- Irrelevant content.
- Frequent hesitation.
- Major grammar issues.

## Output Format
Return ONLY valid JSON (no markdown fences, no extra text) in this exact format:
{
  "overall_band": 7.0,
  "fluency_coherence": 7.0,
  "lexical_resource": 6.5,
  "grammatical_range": 7.0,
  "pronunciation": 7.0,
  "feedback": {
    "fluency_coherence": "Detailed feedback...",
    "lexical_resource": "Detailed feedback...",
    "grammatical_range": "Detailed feedback...",
    "pronunciation": "Detailed feedback..."
  },
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"]
}

The overall_band is the average of the four criteria rounded to nearest 0.5."""  # noqa: E501


# ─── PARSING ───────────────────────────────────────────────────────────────────

def _parse_json_response(content: str) -> dict:
    """Safely parse JSON from LLM response, stripping markdown fences."""
    content = content.strip()
    content = re.sub(r'^```(?:json)?\s*', '', content)
    content = re.sub(r'\s*```$', '', content)
    return json.loads(content)


# ─── FALLBACK (rule-based, zero cost) ─────────────────────────────────────────

def _fallback_writing_feedback(essay_text: str, task_type: str) -> dict:
    """Rule-based fallback scoring when no AI model is available."""
    word_count = len(essay_text.split())
    sentences = [s for s in essay_text.split('.') if s.strip()]

    base_band = 5.0
    if word_count >= 250:
        base_band += 0.5
    if word_count >= 300:
        base_band += 0.5
    if len(sentences) >= 10:
        base_band += 0.5

    words = essay_text.lower().split()
    unique_ratio = len(set(words)) / max(len(words), 1)
    if unique_ratio > 0.6:
        base_band += 0.5

    band = min(max(base_band, 4.0), 8.0)

    return {
        "overall_band": band,
        "task_achievement": band,
        "coherence_cohesion": band,
        "lexical_resource": band - 0.5,
        "grammatical_range": band - 0.5,
        "feedback": {
            "task_achievement": f"Your essay has {word_count} words. Ensure you address all parts of the task.",
            "coherence_cohesion": "Focus on using cohesive devices and organizing your paragraphs logically.",
            "lexical_resource": "Expand your vocabulary range with academic synonyms and collocations.",
            "grammatical_range": "Vary your sentence structures and check for grammatical accuracy.",
        },
        "strengths": [
            f"Essay length of {word_count} words is {'adequate' if word_count >= 250 else 'below the minimum requirement'}",
            "Attempt at paragraph organization detected",
        ],
        "improvements": [
            "Use more complex vocabulary and academic phrases",
            "Ensure topic sentence clearly states paragraph main idea",
            "Vary sentence structure between simple, compound, and complex",
        ],
        "corrected_sentences": [],
    }


def _fallback_speaking_feedback(transcript: str) -> dict:
    """Rule-based fallback scoring for speaking when no AI model is available."""
    word_count = len(transcript.split())
    filler_words = ['um', 'uh', 'like', 'you know', 'basically', 'actually']
    filler_count = sum(transcript.lower().count(fw) for fw in filler_words)

    base_band = 5.5
    if word_count > 100:
        base_band += 0.5
    if filler_count < 5:
        base_band += 0.5

    band = min(max(base_band, 4.0), 8.0)

    return {
        "overall_band": band,
        "fluency_coherence": band,
        "lexical_resource": band - 0.5,
        "grammatical_range": band - 0.5,
        "pronunciation": band,
        "feedback": {
            "fluency_coherence": "Work on speaking more fluently with fewer hesitations.",
            "lexical_resource": "Use a wider range of vocabulary and idiomatic expressions.",
            "grammatical_range": "Practice using a variety of grammatical structures.",
            "pronunciation": "Focus on word stress and sentence intonation.",
        },
        "strengths": ["Attempted to answer the question", f"Response length: {word_count} words"],
        "improvements": [
            "Reduce filler words (um, uh, like)",
            "Develop answers with more detail and examples",
            "Use more sophisticated vocabulary",
        ],
    }


def _call_llm(system_prompt: str, user_content: str, max_tokens: int = 2000) -> Optional[dict]:
    """Try Ollama first, then OpenAI, then return None."""
    # Try Ollama
    ollama_client = _get_ollama_client()
    if ollama_client:
        try:
            response = ollama_client.chat.completions.create(
                model=settings.OLLAMA_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content},
                ],
                temperature=0.3,
                max_tokens=max_tokens,
            )
            content = response.choices[0].message.content
            if content:
                return _parse_json_response(content)
        except Exception as e:
            logger.warning("Ollama scoring error: %s", e)

    # Try OpenAI as fallback
    openai_client = _get_openai_client()
    if openai_client:
        try:
            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content},
                ],
                temperature=0.3,
                max_tokens=max_tokens,
            )
            content = response.choices[0].message.content
            if content:
                return _parse_json_response(content)
        except Exception as e:
            logger.warning("OpenAI scoring error: %s", e)

    return None


# ─── PUBLIC API ────────────────────────────────────────────────────────────────

def score_writing(essay_text: str, task_prompt: str, task_type: str = "task2") -> dict:
    """Score an IELTS writing submission using Ollama (or OpenAI fallback, or rule-based)."""
    user_content = f"""Task Type: IELTS Writing {task_type.upper()}
Task Prompt: {task_prompt}
Word Count: {len(essay_text.split())}

Candidate's Essay:
{essay_text}"""

    result = _call_llm(WRITING_SYSTEM_PROMPT, user_content)
    if result:
        return result

    logger.warning("AI scoring unavailable — using rule-based fallback for writing")
    return _fallback_writing_feedback(essay_text, task_type)


def score_speaking(transcript: str, questions: list, part_number: int) -> dict:
    """Score an IELTS speaking submission using Ollama (or OpenAI fallback, or rule-based)."""
    questions_text = "\n".join(f"Q{i+1}: {q}" for i, q in enumerate(questions))
    user_content = f"""Part {part_number} Questions:
{questions_text}

Candidate's Response Transcript:
{transcript}"""

    result = _call_llm(SPEAKING_SYSTEM_PROMPT, user_content, max_tokens=1500)
    if result:
        return result

    logger.warning("AI scoring unavailable — using rule-based fallback for speaking")
    return _fallback_speaking_feedback(transcript)
