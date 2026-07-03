from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import get_db
from app import models, schemas
from app.utils.auth import get_current_user

router = APIRouter(prefix="/mock-test", tags=["Mock Test"])


def _enrich_results(db: Session, user_id: int, results: list):
    ids = [r.test_id for r in results]
    tests = db.query(models.IELTSTest).filter(models.IELTSTest.id.in_(ids)).all()
    test_map = {t.id: t for t in tests}

    result_ids = [r.id for r in results]
    ordered = (
        db.query(models.MockTestResult.id)
        .filter(
            models.MockTestResult.user_id == user_id,
            models.MockTestResult.id.in_(result_ids),
        )
        .order_by(models.MockTestResult.completed_at.asc())
        .all()
    )
    number_map = {row[0]: idx + 1 for idx, row in enumerate(ordered)}
    return test_map, number_map


@router.post("/submit", response_model=schemas.MockTestResultOut, status_code=201)
def submit_mock_test(
    data: schemas.MockTestResultSubmit,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    test = db.query(models.IELTSTest).filter(models.IELTSTest.id == data.test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    bands = [b for b in [data.listening_band, data.reading_band, data.writing_band, data.speaking_band] if b is not None]
    modules_completed = len(bands)
    overall = round(sum(bands) / modules_completed, 1) if modules_completed > 0 else None

    if modules_completed == 0:
        raise HTTPException(status_code=400, detail="At least one module band is required")

    result = models.MockTestResult(
        user_id=current_user.id,
        test_id=data.test_id,
        overall_band=overall,
        listening_band=data.listening_band,
        reading_band=data.reading_band,
        writing_band=data.writing_band,
        speaking_band=data.speaking_band,
        listening_session_id=data.listening_session_id,
        reading_session_id=data.reading_session_id,
        writing_submission_id=data.writing_submission_id,
        speaking_submission_id=data.speaking_submission_id,
        modules_completed=modules_completed,
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result


@router.get("/stats", response_model=schemas.MockTestStats)
def mock_test_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    base = db.query(models.MockTestResult).filter(
        models.MockTestResult.user_id == current_user.id
    )
    total = base.count()
    if total == 0:
        return schemas.MockTestStats(total_mock_tests=0)

    def avg(col):
        val = base.with_entities(func.avg(col)).scalar()
        return round(float(val), 1) if val else None

    def best(col):
        val = base.with_entities(func.max(col)).scalar()
        return round(float(val), 1) if val else None

    latest = base.order_by(models.MockTestResult.completed_at.desc()).first()

    return schemas.MockTestStats(
        total_mock_tests=total,
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


@router.get("/my", response_model=List[schemas.MockTestResultWithTestOut])
def my_mock_tests(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    results = (
        db.query(models.MockTestResult)
        .filter(models.MockTestResult.user_id == current_user.id)
        .order_by(models.MockTestResult.completed_at.desc())
        .limit(50)
        .all()
    )
    if not results:
        return []

    test_map, number_map = _enrich_results(db, current_user.id, results)

    out = []
    for r in results:
        item = schemas.MockTestResultWithTestOut.model_validate(r)
        t = test_map.get(r.test_id)
        item.test_title = t.title if t else None
        item.mock_test_number = number_map.get(r.id)
        out.append(item)
    return out


@router.get("/{result_id}", response_model=schemas.MockTestResultDetailWithTest)
def get_mock_test_result(
    result_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    result = db.query(models.MockTestResult).filter(
        models.MockTestResult.id == result_id,
        models.MockTestResult.user_id == current_user.id,
    ).first()
    if not result:
        raise HTTPException(status_code=404, detail="Mock test result not found")

    test = db.query(models.IELTSTest).filter(models.IELTSTest.id == result.test_id).first()
    book = db.query(models.TestBook).filter(models.TestBook.id == test.book_id).first() if test else None

    number = (
        db.query(models.MockTestResult.id)
        .filter(
            models.MockTestResult.user_id == current_user.id,
            models.MockTestResult.completed_at <= result.completed_at,
        )
        .count()
    )

    item = schemas.MockTestResultDetailWithTest.model_validate(result)
    item.test_title = test.title if test else None
    item.book_title = book.title if book else None
    item.mock_test_number = number
    return item
