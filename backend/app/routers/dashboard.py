from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import get_db
from app import models, schemas
from app.utils.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    sessions_q = db.query(models.PracticeSession).filter(
        models.PracticeSession.user_id == current_user.id
    )

    total_sessions = sessions_q.count()
    completed_sessions = sessions_q.filter(
        models.PracticeSession.status == "completed"
    ).count()

    def avg_band(section: str):
        result = sessions_q.filter(
            models.PracticeSession.section_type == section,
            models.PracticeSession.band_score != None,
        ).with_entities(func.avg(models.PracticeSession.band_score)).scalar()
        return round(float(result), 1) if result else None

    reading_avg = avg_band("reading")
    listening_avg = avg_band("listening")

    writing_avg_raw = db.query(
        func.avg(models.WritingSubmission.overall_band)
    ).filter(
        models.WritingSubmission.user_id == current_user.id,
        models.WritingSubmission.overall_band != None,
    ).scalar()
    writing_avg = round(float(writing_avg_raw), 1) if writing_avg_raw else None

    speaking_avg_raw = db.query(
        func.avg(models.SpeakingSubmission.overall_band)
    ).filter(
        models.SpeakingSubmission.user_id == current_user.id,
        models.SpeakingSubmission.overall_band != None,
    ).scalar()
    speaking_avg = round(float(speaking_avg_raw), 1) if speaking_avg_raw else None

    avgs = [x for x in [reading_avg, listening_avg, writing_avg, speaking_avg] if x]
    overall_avg = round(sum(avgs) / len(avgs), 1) if avgs else None

    recent_sessions = (
        sessions_q
        .filter(models.PracticeSession.status == "completed")
        .order_by(models.PracticeSession.started_at.desc())
        .limit(5)
        .all()
    )

    starred_count = db.query(models.StarredWord).filter(
        models.StarredWord.user_id == current_user.id
    ).count()

    writing_count = db.query(models.WritingSubmission).filter(
        models.WritingSubmission.user_id == current_user.id
    ).count()

    mock_base = db.query(models.MockTestResult).filter(
        models.MockTestResult.user_id == current_user.id
    )
    mock_test_count = mock_base.count()

    mock_stats = None
    recent_mock_tests = []
    if mock_test_count > 0:
        def avg(col):
            val = mock_base.with_entities(func.avg(col)).scalar()
            return round(float(val), 1) if val else None

        def best(col):
            val = mock_base.with_entities(func.max(col)).scalar()
            return round(float(val), 1) if val else None

        latest = mock_base.order_by(models.MockTestResult.completed_at.desc()).first()

        mock_stats = schemas.MockTestStats(
            total_mock_tests=mock_test_count,
            overall_band_average=avg(models.MockTestResult.overall_band),
            listening_band_average=avg(models.MockTestResult.listening_band),
            reading_band_average=avg(models.MockTestResult.reading_band),
            writing_band_average=avg(models.MockTestResult.writing_band),
            speaking_band_average=avg(models.MockTestResult.speaking_band),
            best_overall_band=best(models.MockTestResult.overall_band),
            best_listening_band=best(models.MockTestResult.listening_band),
            best_reading_band=best(models.MockTestResult.reading_band),
            best_writing_band=best(models.MockTestResult.writing_band),
            best_speaking_band=best(models.MockTestResult.speaking_band),
            latest_result=schemas.MockTestResultOut.model_validate(latest),
        )

        mock_results = mock_base.order_by(models.MockTestResult.completed_at.desc()).limit(5).all()
        test_ids = {r.test_id for r in mock_results}
        tests = db.query(models.IELTSTest).filter(models.IELTSTest.id.in_(test_ids)).all()
        test_map = {t.id: t.title for t in tests}

        ordered_ids = (
            db.query(models.MockTestResult.id)
            .filter(models.MockTestResult.user_id == current_user.id)
            .order_by(models.MockTestResult.completed_at.asc())
            .all()
        )
        num_map = {row[0]: i + 1 for i, row in enumerate(ordered_ids)}

        for r in mock_results:
            item = schemas.MockTestResultWithTestOut.model_validate(r)
            item.test_title = test_map.get(r.test_id)
            item.mock_test_number = num_map.get(r.id)
            recent_mock_tests.append(item)

    return schemas.DashboardStats(
        total_sessions=total_sessions,
        completed_sessions=completed_sessions,
        average_band=overall_avg,
        reading_avg=reading_avg,
        listening_avg=listening_avg,
        writing_avg=writing_avg,
        speaking_avg=speaking_avg,
        recent_sessions=recent_sessions,
        starred_words_count=starred_count,
        writing_submissions_count=writing_count,
        mock_test_count=mock_test_count,
        mock_test_stats=mock_stats,
        recent_mock_tests=recent_mock_tests,
    )


# ─── VOCABULARY ──────────────────────────────────────────────────────────────
vocab_router = APIRouter(prefix="/vocabulary", tags=["Vocabulary"])


@vocab_router.post("/star", response_model=schemas.StarredWordOut, status_code=201)
def star_word(
    data: schemas.StarredWordCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    existing = db.query(models.StarredWord).filter(
        models.StarredWord.user_id == current_user.id,
        models.StarredWord.word == data.word,
    ).first()
    if existing:
        return existing

    word = models.StarredWord(user_id=current_user.id, **data.model_dump())
    db.add(word)
    db.commit()
    db.refresh(word)
    return word


@vocab_router.get("/", response_model=List[schemas.StarredWordOut])
def list_starred(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.StarredWord)
        .filter(models.StarredWord.user_id == current_user.id)
        .order_by(models.StarredWord.created_at.desc())
        .all()
    )


@vocab_router.delete("/{word_id}")
def unstar_word(
    word_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    word = db.query(models.StarredWord).filter(
        models.StarredWord.id == word_id,
        models.StarredWord.user_id == current_user.id,
    ).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(word)
    db.commit()
    return {"message": "Word removed"}
