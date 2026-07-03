from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.utils.auth import get_current_user
from app.services.ai_scoring import score_writing, score_speaking

router = APIRouter(prefix="/submissions", tags=["Submissions"])


# ─── WRITING ─────────────────────────────────────────────────────────────────

@router.post("/writing", response_model=schemas.WritingSubmissionOut, status_code=201)
def submit_writing(
    data: schemas.WritingSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = db.query(models.WritingTask).filter(models.WritingTask.id == data.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Writing task not found")

    word_count = len(data.essay_text.split())

    # Call AI scoring
    ai_result = score_writing(data.essay_text, task.prompt, task.task_type)

    submission = models.WritingSubmission(
        user_id=current_user.id,
        task_id=data.task_id,
        session_id=data.session_id,
        essay_text=data.essay_text,
        word_count=word_count,
        overall_band=ai_result.get("overall_band"),
        task_achievement=ai_result.get("task_achievement"),
        coherence_cohesion=ai_result.get("coherence_cohesion"),
        lexical_resource=ai_result.get("lexical_resource"),
        grammatical_range=ai_result.get("grammatical_range"),
        ai_feedback=ai_result,
        time_taken_seconds=data.time_taken_seconds,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.get("/writing", response_model=List[schemas.WritingSubmissionOut])
def my_writing_submissions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.WritingSubmission)
        .filter(models.WritingSubmission.user_id == current_user.id)
        .order_by(models.WritingSubmission.submitted_at.desc())
        .limit(30)
        .all()
    )


@router.get("/writing/{submission_id}", response_model=schemas.WritingSubmissionOut)
def get_writing_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    sub = db.query(models.WritingSubmission).filter(
        models.WritingSubmission.id == submission_id,
        models.WritingSubmission.user_id == current_user.id,
    ).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    return sub


# ─── SPEAKING ────────────────────────────────────────────────────────────────

@router.post("/speaking", status_code=201)
def submit_speaking(
    data: schemas.SpeakingSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    part = db.query(models.SpeakingPart).filter(
        models.SpeakingPart.id == data.speaking_part_id
    ).first()
    if not part:
        raise HTTPException(status_code=404, detail="Speaking part not found")

    questions = part.questions if isinstance(part.questions, list) else []
    ai_result = score_speaking(data.transcript, questions, part.part_number)

    submission = models.SpeakingSubmission(
        user_id=current_user.id,
        speaking_part_id=data.speaking_part_id,
        session_id=data.session_id,
        transcript=data.transcript,
        overall_band=ai_result.get("overall_band"),
        fluency_coherence=ai_result.get("fluency_coherence"),
        lexical_resource=ai_result.get("lexical_resource"),
        grammatical_range=ai_result.get("grammatical_range"),
        pronunciation=ai_result.get("pronunciation"),
        ai_feedback=ai_result,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return {"id": submission.id, "band_score": ai_result.get("overall_band"), "feedback": ai_result}


@router.get("/speaking/my")
def my_speaking_submissions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    subs = (
        db.query(models.SpeakingSubmission)
        .filter(models.SpeakingSubmission.user_id == current_user.id)
        .order_by(models.SpeakingSubmission.submitted_at.desc())
        .limit(20)
        .all()
    )
    return [
        {
            "id": s.id,
            "speaking_part_id": s.speaking_part_id,
            "overall_band": s.overall_band,
            "submitted_at": s.submitted_at,
        }
        for s in subs
    ]
