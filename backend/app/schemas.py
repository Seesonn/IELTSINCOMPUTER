from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any, Dict
from datetime import datetime
from app.models import (
    UserRole, PlanType, TestType, SectionType,
    QuestionType, PaymentStatus, PaymentGateway,
    SubscriptionRequestStatus, LoginStatus,
)


# ─── AUTH ────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=255)
    password: str = Field(..., min_length=8)
    target_band: Optional[float] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    plan: PlanType
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str]
    target_band: Optional[float]
    test_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    is_enterprise_owner: bool = False

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    target_band: Optional[float] = None
    test_date: Optional[datetime] = None


class OTPVerify(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)


class OTPResend(BaseModel):
    email: EmailStr


class OTPResponse(BaseModel):
    message: str
    access_token: Optional[str] = None


class GoogleLogin(BaseModel):
    credential: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(..., min_length=8)


class ForgotPasswordResponse(BaseModel):
    message: str


# ─── TESTS ───────────────────────────────────────────────────────────────────

class TestBookOut(BaseModel):
    id: int
    title: str
    book_number: int
    test_type: TestType
    description: Optional[str]
    is_free: bool

    class Config:
        from_attributes = True


class IELTSTestOut(BaseModel):
    id: int
    book_id: int
    test_number: int
    title: str
    test_type: TestType
    is_free: bool

    class Config:
        from_attributes = True


class QuestionOut(BaseModel):
    id: int
    group_id: int
    question_number: int
    prompt: Optional[str] = None
    correct_answer: str
    alt_answers: Optional[List[str]] = None
    order_index: int

    class Config:
        from_attributes = True


class QuestionGroupOut(BaseModel):
    id: int
    section_id: int
    passage_number: Optional[int] = None
    question_type: QuestionType
    instruction: str
    extra_data: Optional[Any] = None
    order_index: int
    questions: List[QuestionOut] = []

    class Config:
        from_attributes = True


class ReadingPassageOut(BaseModel):
    id: int
    section_id: int
    passage_number: int
    title: Optional[str] = None
    body: str
    has_headings: bool = False

    class Config:
        from_attributes = True


class ReadingSectionOut(BaseModel):
    id: int
    section_type: SectionType
    section_number: int
    title: Optional[str] = None
    instructions: Optional[str] = None
    time_limit_seconds: int
    passages: List[ReadingPassageOut] = []
    question_groups: List[QuestionGroupOut] = []

    class Config:
        from_attributes = True


class ListeningSectionOut(BaseModel):
    id: int
    section_type: SectionType
    section_number: int
    title: Optional[str] = None
    instructions: Optional[str] = None
    time_limit_seconds: int
    audio_url: Optional[str] = None
    question_groups: List[QuestionGroupOut] = []

    class Config:
        from_attributes = True


class WritingTaskOut(BaseModel):
    id: int
    task_number: int
    task_type: str
    prompt: str
    image_url: Optional[str] = None
    min_words: int
    time_limit_seconds: int
    sample_answer: Optional[str] = None

    class Config:
        from_attributes = True


class WritingSectionOut(BaseModel):
    id: int
    section_type: SectionType
    section_number: int
    title: Optional[str] = None
    instructions: Optional[str] = None
    time_limit_seconds: int
    writing_tasks: List[WritingTaskOut] = []

    class Config:
        from_attributes = True


class SpeakingPartOut(BaseModel):
    id: int
    section_id: int
    part_number: int
    topic: Optional[str] = None
    questions: Any = None
    cue_card: Optional[str] = None
    time_limit_seconds: int

    class Config:
        from_attributes = True


class SpeakingSectionOut(BaseModel):
    id: int
    section_type: SectionType
    section_number: int
    title: Optional[str] = None
    instructions: Optional[str] = None
    time_limit_seconds: int
    speaking_parts: List[SpeakingPartOut] = []

    class Config:
        from_attributes = True


# ─── SESSIONS & ANSWERS ───────────────────────────────────────────────────────

class SessionCreate(BaseModel):
    test_id: int
    section_type: SectionType


class AnswerSubmit(BaseModel):
    question_id: int
    given_answer: Optional[str] = None


class SessionSubmit(BaseModel):
    session_id: int
    answers: List[AnswerSubmit] = []
    time_taken_seconds: Optional[int] = None


class AnswerResult(BaseModel):
    question_id: int
    question_number: int
    given_answer: Optional[str]
    correct_answer: str
    is_correct: bool
    explanation: Optional[str] = None


class SessionResult(BaseModel):
    session_id: int
    section_type: SectionType
    raw_score: int
    total_questions: int
    correct_answers: int
    band_score: float
    percentage: float
    answer_results: List[AnswerResult] = []


class SessionOut(BaseModel):
    id: int
    test_id: int
    section_type: SectionType
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    band_score: Optional[float] = None
    correct_answers: Optional[int] = None
    total_questions: Optional[int] = None

    class Config:
        from_attributes = True


# ─── WRITING ─────────────────────────────────────────────────────────────────

class WritingSubmissionCreate(BaseModel):
    task_id: int
    session_id: Optional[int] = None
    essay_text: str = Field(..., min_length=50)
    time_taken_seconds: Optional[int] = None


class WritingFeedback(BaseModel):
    overall_band: float
    task_achievement: float
    coherence_cohesion: float
    lexical_resource: float
    grammatical_range: float
    feedback: Dict[str, str]
    strengths: List[str]
    improvements: List[str]
    corrected_sentences: Optional[List[Dict[str, str]]] = None


class WritingSubmissionOut(BaseModel):
    id: int
    task_id: int
    essay_text: str
    word_count: Optional[int] = None
    overall_band: Optional[float] = None
    task_achievement: Optional[float] = None
    coherence_cohesion: Optional[float] = None
    lexical_resource: Optional[float] = None
    grammatical_range: Optional[float] = None
    ai_feedback: Optional[Any] = None
    submitted_at: datetime

    class Config:
        from_attributes = True


# ─── SPEAKING ────────────────────────────────────────────────────────────────

class SpeakingSubmissionCreate(BaseModel):
    speaking_part_id: int
    session_id: Optional[int] = None
    transcript: str
    time_taken_seconds: Optional[int] = None


class SpeakingFeedback(BaseModel):
    overall_band: float
    fluency_coherence: float
    lexical_resource: float
    grammatical_range: float
    pronunciation: float
    feedback: Dict[str, str]
    strengths: List[str]
    improvements: List[str]


class SpeakingSubmissionOut(BaseModel):
    id: int
    speaking_part_id: int
    transcript: str
    overall_band: Optional[float] = None
    fluency_coherence: Optional[float] = None
    lexical_resource: Optional[float] = None
    grammatical_range: Optional[float] = None
    pronunciation: Optional[float] = None
    ai_feedback: Optional[Any] = None
    submitted_at: datetime

    class Config:
        from_attributes = True


# ─── VOCABULARY ──────────────────────────────────────────────────────────────

class StarredWordCreate(BaseModel):
    word: str
    definition: Optional[str] = None
    context_sentence: Optional[str] = None
    passage_title: Optional[str] = None


class StarredWordOut(BaseModel):
    id: int
    word: str
    definition: Optional[str] = None
    context_sentence: Optional[str] = None
    passage_title: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ─── PAYMENTS ────────────────────────────────────────────────────────────────

class SubscriptionPlanOut(BaseModel):
    id: int
    name: str
    plan_type: PlanType
    price_npr: int
    duration_days: int
    features: Optional[Any] = None
    is_active: bool = True

    class Config:
        from_attributes = True


class PaymentInitiate(BaseModel):
    plan_id: int
    gateway: PaymentGateway


class EsewaVerify(BaseModel):
    data: str


class PaymentOut(BaseModel):
    id: int
    plan_id: int
    gateway: PaymentGateway
    amount_npr: int
    transaction_id: Optional[str] = None
    status: PaymentStatus
    created_at: datetime

    class Config:
        from_attributes = True


# ─── DASHBOARD ───────────────────────────────────────────────────────────────

# ─── ADMIN ───────────────────────────────────────────────────────────────────

class AdminUserUpdate(BaseModel):
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    plan: Optional[PlanType] = None
    role: Optional[UserRole] = None


class AdminStats(BaseModel):
    total_users: int
    total_requests: int
    pending_requests: int
    approved_requests: int
    rejected_requests: int
    free_users: int
    premium_users: int
    enterprise_users: int
    total_books: int


class AdminBookCreate(BaseModel):
    title: str
    book_number: int
    test_type: TestType = TestType.academic
    description: Optional[str] = None
    is_free: bool = False


class AdminBookUpdate(BaseModel):
    title: Optional[str] = None
    book_number: Optional[int] = None
    test_type: Optional[TestType] = None
    description: Optional[str] = None
    is_free: Optional[bool] = None


class AdminPlanCreate(BaseModel):
    name: str
    plan_type: PlanType
    price_npr: int
    duration_days: int = 30
    features: Optional[Any] = None
    is_active: bool = True


class AdminPlanUpdate(BaseModel):
    name: Optional[str] = None
    plan_type: Optional[PlanType] = None
    price_npr: Optional[int] = None
    duration_days: Optional[int] = None
    features: Optional[Any] = None
    is_active: Optional[bool] = None


# ─── SUBSCRIPTION REQUESTS ────────────────────────────────────────────────

class SubscriptionRequestOut(BaseModel):
    id: int
    user_id: int
    email: str
    plan_type: str
    gateway: Optional[str] = None
    screenshot_path: str
    status: str
    created_at: datetime
    updated_at: datetime
    user_name: Optional[str] = None
    user_current_plan: Optional[str] = None
    user_created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SubscriptionRequestUpdate(BaseModel):
    gateway: Optional[str] = None
    plan_type: Optional[str] = None
    status: Optional[SubscriptionRequestStatus] = None


class AdminUserOut(UserOut):
    latest_request_status: Optional[str] = None
    latest_request_plan: Optional[str] = None


# ─── AUTH SESSIONS ──────────────────────────────────────────────────────

class UserSessionOut(BaseModel):
    id: int
    device_name: Optional[str] = None
    ip_address: Optional[str] = None
    is_active: bool
    is_current: bool = False
    created_at: datetime
    last_accessed_at: datetime

    class Config:
        from_attributes = True


class LoginRecordOut(BaseModel):
    id: int
    ip_address: Optional[str] = None
    device_name: Optional[str] = None
    os_name: Optional[str] = None
    browser_name: Optional[str] = None
    browser_version: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    login_status: str
    login_time: datetime

    class Config:
        from_attributes = True


class MockTestResultSubmit(BaseModel):
    test_id: int
    listening_band: Optional[float] = None
    reading_band: Optional[float] = None
    writing_band: Optional[float] = None
    speaking_band: Optional[float] = None
    listening_session_id: Optional[int] = None
    reading_session_id: Optional[int] = None
    writing_submission_id: Optional[int] = None
    speaking_submission_id: Optional[int] = None


class MockTestResultOut(BaseModel):
    id: int
    test_id: int
    overall_band: Optional[float] = None
    listening_band: Optional[float] = None
    reading_band: Optional[float] = None
    writing_band: Optional[float] = None
    speaking_band: Optional[float] = None
    modules_completed: int
    completed_at: datetime

    class Config:
        from_attributes = True


class MockTestResultDetail(MockTestResultOut):
    listening_session_id: Optional[int] = None
    reading_session_id: Optional[int] = None
    writing_submission_id: Optional[int] = None
    speaking_submission_id: Optional[int] = None


class MockTestResultWithTestOut(MockTestResultOut):
    test_title: Optional[str] = None
    mock_test_number: Optional[int] = None


class MockTestResultDetailWithTest(MockTestResultDetail):
    test_title: Optional[str] = None
    book_title: Optional[str] = None
    mock_test_number: Optional[int] = None


class MockTestStats(BaseModel):
    total_mock_tests: int
    overall_band_average: Optional[float] = None
    listening_band_average: Optional[float] = None
    reading_band_average: Optional[float] = None
    writing_band_average: Optional[float] = None
    speaking_band_average: Optional[float] = None
    best_overall_band: Optional[float] = None
    best_listening_band: Optional[float] = None
    best_reading_band: Optional[float] = None
    best_writing_band: Optional[float] = None
    best_speaking_band: Optional[float] = None
    latest_result: Optional[MockTestResultOut] = None


class DashboardStats(BaseModel):
    total_sessions: int
    completed_sessions: int
    average_band: Optional[float] = None
    reading_avg: Optional[float] = None
    listening_avg: Optional[float] = None
    writing_avg: Optional[float] = None
    speaking_avg: Optional[float] = None
    recent_sessions: List[SessionOut] = []
    starred_words_count: int = 0
    writing_submissions_count: int = 0
    mock_test_count: int = 0
    mock_test_stats: Optional[MockTestStats] = None
    recent_mock_tests: List[MockTestResultWithTestOut] = []


# ─── ENTERPRISE MEMBERS ─────────────────────────────────────────────────

class EnterpriseMemberAdd(BaseModel):
    member_email: EmailStr


class EnterpriseMemberOut(BaseModel):
    id: int
    member_email: str
    created_at: datetime

    class Config:
        from_attributes = True


class EnterpriseStatus(BaseModel):
    is_owner: bool
    member_count: int
    max_members: int = 10