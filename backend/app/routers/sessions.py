from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from typing import List
from app.database import get_db
from app import models, schemas
from app.utils.auth import get_current_user
from app.utils.scoring import reading_band, listening_band

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.post("/start", response_model=schemas.SessionOut, status_code=201)
def start_session(
    data: schemas.SessionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    test = db.query(models.IELTSTest).filter(models.IELTSTest.id == data.test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    session = models.PracticeSession(
        user_id=current_user.id,
        test_id=data.test_id,
        section_type=data.section_type,
        status="in_progress",
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.post("/submit", response_model=schemas.SessionResult)
def submit_session(
    data: schemas.SessionSubmit,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    session = db.query(models.PracticeSession).filter(
        models.PracticeSession.id == data.session_id,
        models.PracticeSession.user_id == current_user.id,
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.status == "completed":
        raise HTTPException(status_code=400, detail="Session already submitted")

    answer_results = []
    correct_count = 0

    for ans in data.answers:
        question = db.query(models.Question).filter(
            models.Question.id == ans.question_id
        ).first()
        if not question:
            continue

        # Normalize and compare answers
        given = (ans.given_answer or "").strip().upper()
        correct = question.correct_answer.strip().upper()

        # Check alt answers too
        alt_answers = [a.strip().upper() for a in (question.alt_answers or [])]
        is_correct = (given == correct) or (given in alt_answers)

        if is_correct:
            correct_count += 1

        user_answer = models.UserAnswer(
            session_id=session.id,
            question_id=question.id,
            given_answer=ans.given_answer,
            is_correct=is_correct,
        )
        db.add(user_answer)

        answer_results.append(schemas.AnswerResult(
            question_id=question.id,
            question_number=question.question_number,
            given_answer=ans.given_answer,
            correct_answer=question.correct_answer,
            is_correct=is_correct,
            explanation=question.explanation,
        ))

    total = len(data.answers)
    raw_score = correct_count

    # Calculate band score
    test = db.query(models.IELTSTest).filter(models.IELTSTest.id == session.test_id).first()
    test_type = test.test_type if test else "academic"

    if session.section_type == models.SectionType.reading:
        band = reading_band(raw_score, test_type)
    elif session.section_type == models.SectionType.listening:
        band = listening_band(raw_score)
    else:
        band = 0.0

    # Update session
    session.status = "completed"
    session.completed_at = datetime.utcnow()
    session.time_taken_seconds = data.time_taken_seconds
    session.raw_score = raw_score
    session.band_score = band
    session.total_questions = total
    session.correct_answers = correct_count

    db.commit()

    return schemas.SessionResult(
        session_id=session.id,
        section_type=session.section_type,
        raw_score=raw_score,
        total_questions=total,
        correct_answers=correct_count,
        band_score=band,
        percentage=round((correct_count / max(total, 1)) * 100, 1),
        answer_results=answer_results,
    )


@router.get("/my", response_model=List[schemas.SessionOut])
def my_sessions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.PracticeSession)
        .filter(models.PracticeSession.user_id == current_user.id)
        .order_by(models.PracticeSession.started_at.desc())
        .limit(50)
        .all()
    )


@router.get("/{session_id}", response_model=schemas.SessionOut)
def get_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    session = db.query(models.PracticeSession).filter(
        models.PracticeSession.id == session_id,
        models.PracticeSession.user_id == current_user.id,
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.get("/{session_id}/answers")
def get_session_answers(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    session = db.query(models.PracticeSession).filter(
        models.PracticeSession.id == session_id,
        models.PracticeSession.user_id == current_user.id,
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    answers = (
        db.query(models.UserAnswer)
        .options(joinedload(models.UserAnswer.question))
        .filter(models.UserAnswer.session_id == session_id)
        .all()
    )
    return [
        {
            "question_id": a.question_id,
            "question_number": a.question.question_number if a.question else 0,
            "given_answer": a.given_answer,
            "correct_answer": a.question.correct_answer if a.question else "",
            "is_correct": a.is_correct,
            "explanation": a.question.explanation if a.question else None,
        }
        for a in answers
    ]
