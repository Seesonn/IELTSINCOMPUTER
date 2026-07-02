# IELTSPrep — Full-Stack IELTS Practice Platform

Nepal's most comprehensive computer-based IELTS practice platform with AI scoring.

## 🏗️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS    |
| Backend    | FastAPI (Python)                  |
| Database   | PostgreSQL                        |
| AI Scoring | Ollama + Qwen (local, free) — OpenAI optional |
| Auth       | JWT (python-jose + bcrypt)        |
| Payments   | eSewa v2 + Khalti                 |

---

## 📁 Project Structure

```
ieltsprep/
├── backend/
│   ├── app/
│   │   ├── models.py           # SQLAlchemy ORM models
│   │   ├── schemas.py          # Pydantic request/response schemas
│   │   ├── config.py           # App settings (loaded from .env)
│   │   ├── database.py         # DB engine + session factory
│   │   ├── routers/
│   │   │   ├── auth.py         # Register, Login, /me, update profile
│   │   │   ├── tests.py        # Fetch reading/listening/writing/speaking
│   │   │   ├── sessions.py     # Start session, submit answers, scoring
│   │   │   ├── submissions.py  # Writing AI scoring, Speaking AI scoring
│   │   │   ├── payments.py     # eSewa + Khalti initiate & verify
│   │   │   └── dashboard.py    # Stats + vocabulary CRUD
│   │   ├── services/
│   │   │   ├── ai_scoring.py   # OpenAI GPT-4o writing/speaking scorer
│   │   │   └── payment.py      # eSewa HMAC-SHA256 + Khalti API
│   │   └── utils/
│   │       ├── auth.py         # JWT + bcrypt helpers
│   │       └── scoring.py      # Official IELTS band conversion tables
│   ├── main.py                 # FastAPI app entry point
│   ├── seed.py                 # DB seeder with full sample IELTS content
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx / RegisterPage.jsx
    │   │   ├── DashboardPage.jsx    # Stats + radar chart
    │   │   ├── TestsPage.jsx        # Test browser
    │   │   ├── ReadingPage.jsx      # Split pane + vocab starring
    │   │   ├── ListeningPage.jsx    # Audio player + questions
    │   │   ├── WritingPage.jsx      # Word counter + AI submission
    │   │   ├── SpeakingPage.jsx     # Web Speech API recording
    │   │   ├── ResultPage.jsx       # Answer review + band score
    │   │   ├── WritingResultPage.jsx# AI feedback breakdown
    │   │   ├── ProgressPage.jsx     # Recharts band trend
    │   │   ├── VocabularyPage.jsx   # Starred words
    │   │   ├── PricingPage.jsx      # eSewa/Khalti checkout
    │   │   ├── PaymentSuccess.jsx   # Payment callback verifier
    │   │   └── ProfilePage.jsx
    │   ├── components/
    │   │   ├── layout/  MainLayout (sidebar), AuthLayout, TestLayout
    │   │   ├── test/    TestHeader (countdown timer), QuestionPanel
    │   │   └── ui/      BandBadge, StatCard, EmptyState, Modal, etc.
    │   ├── hooks/useTimer.js     # Countdown timer hook
    │   ├── store/authStore.js    # Zustand auth state
    │   └── utils/api.js          # Axios instance + all API calls
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+, Node.js 18+, PostgreSQL 15+

### 1. PostgreSQL Setup
```sql
CREATE DATABASE ieltsprep;
CREATE USER ieltsprep_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE ieltsprep TO ieltsprep_user;
```

### 2. Backend
```bash
cd ieltsprep/backend
python -m venv venv
source venv/bin/activate         # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # Edit with your credentials
python seed.py                   # Creates tables + sample content
uvicorn main:app --reload --port 8000
```
→ API docs: http://localhost:8000/api/docs

### 3. Frontend
```bash
cd ieltsprep/frontend
npm install
npm run dev
```
→ App: http://localhost:5173

---

## 🔑 Demo Accounts (after seeding)

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@ieltsprep.com    | admin123456 |
| Student | demo@ieltsprep.com     | demo123456  |

---

## 💳 Payment Gateways

### eSewa (Sandbox)
- Merchant Code: `EPAYTEST`
- Secret Key: `8gBm/:&EnhH.1/q`
- Test URL: https://rc-epay.esewa.com.np

### Khalti (Sandbox)
- Get test key from: https://test-admin.khalti.com
- Test URL: https://a.khalti.com/api/v2

---

## 🤖 AI Scoring

### Option A: Local Free (Recommended) — Ollama + Qwen

No API key needed. Runs 100% locally with zero cost.

```bash
# 1. Install Ollama: https://ollama.com/download
# 2. Pull the Qwen model:
ollama pull qwen2.5:7b

# 3. Ensure Ollama is running (it starts automatically as a service)
# 4. Your .env should have:
#    OLLAMA_BASE_URL=http://localhost:11434/v1
#    OLLAMA_MODEL=qwen2.5:7b
```

The scoring uses the **IELTS AI Examiner Pro** engine with official Band Descriptors. To test:

```bash
curl http://localhost:11434/api/generate -d '{"model": "qwen2.5:7b", "prompt": "Score this IELTS essay...", "stream": false}'
```

### Option B: OpenAI (Optional Fallback)

Set `OPENAI_API_KEY` in `.env` for GPT-4o scoring. This is used only if Ollama is unreachable.

### Fallback

If neither Ollama nor OpenAI is available, a **rule-based scorer** activates automatically (heuristic, less accurate).

### Criteria

**Writing** scores: Task Achievement · Coherence & Cohesion · Lexical Resource · Grammatical Range
**Speaking** scores: Fluency & Coherence · Lexical Resource · Grammatical Range · Pronunciation

---

## 📡 Key API Endpoints

| Method | Path                             | Description                   |
|--------|----------------------------------|-------------------------------|
| POST   | /api/v1/auth/register            | Register new user             |
| POST   | /api/v1/auth/login               | Login → JWT token             |
| GET    | /api/v1/tests/all                | List all tests                |
| GET    | /api/v1/tests/{id}/reading       | Reading section + passages    |
| GET    | /api/v1/tests/{id}/listening     | Listening section + audio URL |
| GET    | /api/v1/tests/{id}/writing       | Writing tasks + prompts       |
| GET    | /api/v1/tests/{id}/speaking      | Speaking parts + questions    |
| POST   | /api/v1/sessions/start           | Start a practice session      |
| POST   | /api/v1/sessions/submit          | Submit answers → band score   |
| POST   | /api/v1/submissions/writing      | Submit essay → AI score       |
| POST   | /api/v1/submissions/speaking     | Submit transcript → AI score  |
| GET    | /api/v1/dashboard/stats          | Dashboard statistics          |
| POST   | /api/v1/payments/esewa/initiate  | Initiate eSewa payment        |
| POST   | /api/v1/payments/khalti/initiate | Initiate Khalti payment       |
