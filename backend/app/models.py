from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, Float,
    ForeignKey, Enum, JSON, BigInteger
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    student = "student"
    admin = "admin"


class PlanType(str, enum.Enum):
    free = "free"
    premium = "premium"
    enterprise = "enterprise"


class TestType(str, enum.Enum):
    academic = "academic"
    general = "general"


class SectionType(str, enum.Enum):
    reading = "reading"
    listening = "listening"
    writing = "writing"
    speaking = "speaking"


class QuestionType(str, enum.Enum):
    multiple_choice = "multiple_choice"
    true_false_ng = "true_false_ng"
    yes_no_ng = "yes_no_ng"
    match_headings = "match_headings"
    match_features = "match_features"
    match_paragraph_info = "match_paragraph_info"
    sentence_endings = "sentence_endings"
    fill_blank = "fill_blank"
    fill_in_blank = "fill_in_blank"
    short_answer = "short_answer"
    sentence_completion = "sentence_completion"
    summary_completion = "summary_completion"
    diagram_labelling = "diagram_labelling"
    diagram_completion = "diagram_completion"
    note_completion = "note_completion"
    flow_chart = "flow_chart"
    table_completion = "table_completion"
    choose_title = "choose_title"
    classification = "classification"
    summary_completion_select = "summary_completion_select"


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"
    refunded = "refunded"


class PaymentGateway(str, enum.Enum):
    esewa = "esewa"
    khalti = "khalti"


class LoginStatus(str, enum.Enum):
    success = "success"
    failed = "failed"
    suspicious = "suspicious"
    active = "active"


# ─── PASSWORD RESET ─────────────────────────────────────────────────────────

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String(255), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="reset_tokens")


# ─── PENDING USER (pre-verification) ───────────────────────────────────────

class PendingUser(Base):
    __tablename__ = "pending_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    target_band = Column(Float, nullable=True)
    otp_code = Column(String(6), nullable=False)
    otp_expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())


# ─── USER ───────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.student)
    plan = Column(Enum(PlanType), default=PlanType.free)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    avatar_url = Column(String(500), nullable=True)
    target_band = Column(Float, nullable=True)
    test_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    sessions = relationship("PracticeSession", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    starred_words = relationship("StarredWord", back_populates="user")
    writing_submissions = relationship("WritingSubmission", back_populates="user")
    reset_tokens = relationship("PasswordResetToken", back_populates="user")
    subscription_requests = relationship("SubscriptionRequest", back_populates="user")
    auth_sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    login_records = relationship("LoginRecord", back_populates="user", cascade="all, delete-orphan")
    mock_test_results = relationship("MockTestResult", back_populates="user")


# ─── AUTH SESSION ─────────────────────────────────────────────────────────

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    token_jti = Column(String(255), unique=True, nullable=False, index=True)
    device_name = Column(String(255), nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    last_accessed_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="auth_sessions")


# ─── LOGIN HISTORY ──────────────────────────────────────────────────────

class LoginRecord(Base):
    __tablename__ = "login_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    device_name = Column(String(255), nullable=True)
    os_name = Column(String(100), nullable=True)
    browser_name = Column(String(100), nullable=True)
    browser_version = Column(String(50), nullable=True)
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    login_status = Column(String(20), default="success")
    login_time = Column(DateTime, server_default=func.now())

    user = relationship("User")


# ─── CONTENT ─────────────────────────────────────────────────────────────────

class TestBook(Base):
    __tablename__ = "test_books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    book_number = Column(Integer, nullable=False)
    test_type = Column(Enum(TestType), default=TestType.academic)
    description = Column(Text, nullable=True)
    is_free = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    tests = relationship("IELTSTest", back_populates="book")


class IELTSTest(Base):
    __tablename__ = "ielts_tests"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("test_books.id"), nullable=False)
    test_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    test_type = Column(Enum(TestType), default=TestType.academic)
    is_free = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    book = relationship("TestBook", back_populates="tests")
    sections = relationship("TestSection", back_populates="test")
    sessions = relationship("PracticeSession", back_populates="test")


class TestSection(Base):
    __tablename__ = "test_sections"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("ielts_tests.id"), nullable=False)
    section_type = Column(Enum(SectionType), nullable=False)
    section_number = Column(Integer, default=1)
    title = Column(String(255), nullable=True)
    instructions = Column(Text, nullable=True)
    time_limit_seconds = Column(Integer, default=1200)
    audio_url = Column(String(500), nullable=True)   # for listening
    transcript = Column(Text, nullable=True)          # for listening
    created_at = Column(DateTime, server_default=func.now())

    test = relationship("IELTSTest", back_populates="sections")
    passages = relationship("ReadingPassage", back_populates="section")
    question_groups = relationship("QuestionGroup", back_populates="section")
    writing_tasks = relationship("WritingTask", back_populates="section")
    speaking_parts = relationship("SpeakingPart", back_populates="section")


class ReadingPassage(Base):
    __tablename__ = "reading_passages"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("test_sections.id"), nullable=False)
    passage_number = Column(Integer, default=1)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    source = Column(String(255), nullable=True)
    has_headings = Column(Boolean, default=False)
    headings = Column(JSON, nullable=True)   # list of heading strings
    created_at = Column(DateTime, server_default=func.now())

    section = relationship("TestSection", back_populates="passages")


class QuestionGroup(Base):
    __tablename__ = "question_groups"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("test_sections.id"), nullable=False)
    passage_number = Column(Integer, nullable=True)
    question_type = Column(Enum(QuestionType), nullable=False)
    instruction = Column(Text, nullable=False)
    extra_data = Column(JSON, nullable=True)   # options list, headings, features etc.
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

    section = relationship("TestSection", back_populates="question_groups")
    questions = relationship("Question", back_populates="group")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("question_groups.id"), nullable=False)
    question_number = Column(Integer, nullable=False)
    prompt = Column(Text, nullable=True)
    correct_answer = Column(String(500), nullable=False)
    alt_answers = Column(JSON, nullable=True)   # list of alternative correct answers
    explanation = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)

    group = relationship("QuestionGroup", back_populates="questions")
    answers = relationship("UserAnswer", back_populates="question")


class WritingTask(Base):
    __tablename__ = "writing_tasks"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("test_sections.id"), nullable=False)
    task_number = Column(Integer, default=1)
    task_type = Column(String(50), default="task2")   # task1 / task2
    prompt = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)   # for task 1 charts
    min_words = Column(Integer, default=150)
    time_limit_seconds = Column(Integer, default=1200)
    band_descriptors = Column(JSON, nullable=True)
    sample_answer = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    section = relationship("TestSection", back_populates="writing_tasks")
    submissions = relationship("WritingSubmission", back_populates="task")


class SpeakingPart(Base):
    __tablename__ = "speaking_parts"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("test_sections.id"), nullable=False)
    part_number = Column(Integer, default=1)
    topic = Column(String(255), nullable=True)
    questions = Column(JSON, nullable=False)   # list of question strings
    cue_card = Column(Text, nullable=True)     # for part 2
    time_limit_seconds = Column(Integer, default=120)
    created_at = Column(DateTime, server_default=func.now())

    section = relationship("TestSection", back_populates="speaking_parts")


# ─── SESSIONS & ANSWERS ───────────────────────────────────────────────────────

class PracticeSession(Base):
    __tablename__ = "practice_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    test_id = Column(Integer, ForeignKey("ielts_tests.id"), nullable=False)
    section_type = Column(Enum(SectionType), nullable=False)
    status = Column(String(50), default="in_progress")  # in_progress / completed / abandoned
    started_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)
    time_taken_seconds = Column(Integer, nullable=True)
    raw_score = Column(Integer, nullable=True)
    band_score = Column(Float, nullable=True)
    total_questions = Column(Integer, nullable=True)
    correct_answers = Column(Integer, nullable=True)

    user = relationship("User", back_populates="sessions")
    test = relationship("IELTSTest", back_populates="sessions")
    answers = relationship("UserAnswer", back_populates="session")


class UserAnswer(Base):
    __tablename__ = "user_answers"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("practice_sessions.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    given_answer = Column(String(500), nullable=True)
    is_correct = Column(Boolean, nullable=True)
    answered_at = Column(DateTime, server_default=func.now())

    session = relationship("PracticeSession", back_populates="answers")
    question = relationship("Question", back_populates="answers")


class WritingSubmission(Base):
    __tablename__ = "writing_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    task_id = Column(Integer, ForeignKey("writing_tasks.id"), nullable=False)
    session_id = Column(Integer, ForeignKey("practice_sessions.id"), nullable=True)
    essay_text = Column(Text, nullable=False)
    word_count = Column(Integer, nullable=True)
    overall_band = Column(Float, nullable=True)
    task_achievement = Column(Float, nullable=True)
    coherence_cohesion = Column(Float, nullable=True)
    lexical_resource = Column(Float, nullable=True)
    grammatical_range = Column(Float, nullable=True)
    ai_feedback = Column(JSON, nullable=True)
    time_taken_seconds = Column(Integer, nullable=True)
    submitted_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="writing_submissions")
    task = relationship("WritingTask", back_populates="submissions")


class MockTestResult(Base):
    __tablename__ = "mock_test_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    test_id = Column(Integer, ForeignKey("ielts_tests.id"), nullable=False)
    overall_band = Column(Float, nullable=True)
    listening_band = Column(Float, nullable=True)
    reading_band = Column(Float, nullable=True)
    writing_band = Column(Float, nullable=True)
    speaking_band = Column(Float, nullable=True)
    listening_session_id = Column(Integer, nullable=True)
    reading_session_id = Column(Integer, nullable=True)
    writing_submission_id = Column(Integer, nullable=True)
    speaking_submission_id = Column(Integer, nullable=True)
    modules_completed = Column(Integer, default=0)
    completed_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="mock_test_results")
    test = relationship("IELTSTest")


class SpeakingSubmission(Base):
    __tablename__ = "speaking_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    speaking_part_id = Column(Integer, ForeignKey("speaking_parts.id"), nullable=False)
    session_id = Column(Integer, ForeignKey("practice_sessions.id"), nullable=True)
    audio_url = Column(String(500), nullable=True)
    transcript = Column(Text, nullable=True)
    overall_band = Column(Float, nullable=True)
    fluency_coherence = Column(Float, nullable=True)
    lexical_resource = Column(Float, nullable=True)
    grammatical_range = Column(Float, nullable=True)
    pronunciation = Column(Float, nullable=True)
    ai_feedback = Column(JSON, nullable=True)
    submitted_at = Column(DateTime, server_default=func.now())


# ─── VOCABULARY ───────────────────────────────────────────────────────────────

class StarredWord(Base):
    __tablename__ = "starred_words"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    word = Column(String(255), nullable=False)
    definition = Column(Text, nullable=True)
    context_sentence = Column(Text, nullable=True)
    passage_title = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="starred_words")


# ─── PAYMENTS ─────────────────────────────────────────────────────────────────

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    plan_type = Column(Enum(PlanType), nullable=False, unique=True)
    price_npr = Column(Integer, nullable=False)   # price in NPR paisa
    duration_days = Column(Integer, default=30)
    features = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=False)
    gateway = Column(Enum(PaymentGateway), nullable=False)
    amount_npr = Column(Integer, nullable=False)   # in paisa
    transaction_id = Column(String(255), nullable=True)
    gateway_ref_id = Column(String(255), nullable=True)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.pending)
    gateway_response = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="payments")
    plan = relationship("SubscriptionPlan")


# ─── SUBSCRIPTION REQUESTS ─────────────────────────────────────────────────

class SubscriptionRequestStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class SubscriptionRequest(Base):
    __tablename__ = "subscription_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    email = Column(String(255), nullable=False)
    plan_type = Column(String(50), default="premium")
    gateway = Column(String(50), nullable=True)
    screenshot_path = Column(String(500), nullable=False)
    status = Column(Enum(SubscriptionRequestStatus), default=SubscriptionRequestStatus.pending)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="subscription_requests")


class EnterpriseMember(Base):
    __tablename__ = "enterprise_members"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    member_email = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    owner = relationship("User", backref="enterprise_team")
