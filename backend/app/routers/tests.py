# from fastapi import APIRouter, Depends, HTTPException, Query
# from sqlalchemy.orm import Session, joinedload
# from typing import List, Optional
# from app.database import get_db
# from app import models, schemas
# from app.utils.auth import get_current_user

# router = APIRouter(prefix="/tests", tags=["Tests"])


# def _check_access(test: models.IELTSTest, user: models.User):
#     if not test.is_free and user.plan == models.PlanType.free:
#         raise HTTPException(
#             status_code=403,
#             detail="This test requires a premium subscription. Please upgrade your plan."
#         )


# # ─── BOOKS ───────────────────────────────────────────────────────────────────

# @router.get("/books", response_model=List[schemas.TestBookOut])
# def list_books(
#     test_type: Optional[str] = Query(None),
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):
#     q = db.query(models.TestBook)
#     if test_type:
#         q = q.filter(models.TestBook.test_type == test_type)
#     return q.order_by(models.TestBook.book_number).all()


# @router.get("/books/{book_id}/tests", response_model=List[schemas.IELTSTestOut])
# def list_tests(
#     book_id: int,
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):
#     tests = db.query(models.IELTSTest).filter(
#         models.IELTSTest.book_id == book_id
#     ).order_by(models.IELTSTest.test_number).all()
#     return tests


# @router.get("/all", response_model=List[schemas.IELTSTestOut])
# def list_all_tests(
#     test_type: Optional[str] = Query(None),
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):
#     q = db.query(models.IELTSTest)
#     if test_type:
#         q = q.filter(models.IELTSTest.test_type == test_type)
#     return q.order_by(models.IELTSTest.id).all()


# # ─── READING ─────────────────────────────────────────────────────────────────

# @router.get("/{test_id}/reading", response_model=schemas.ReadingSectionOut)
# def get_reading_section(
#     test_id: int,
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):
#     test = db.query(models.IELTSTest).filter(models.IELTSTest.id == test_id).first()
#     if not test:
#         raise HTTPException(status_code=404, detail="Test not found")
#     _check_access(test, current_user)

#     section = (
#         db.query(models.TestSection)
#         .options(
#             joinedload(models.TestSection.passages),
#             joinedload(models.TestSection.question_groups).joinedload(models.QuestionGroup.questions),
#         )
#         .filter(
#             models.TestSection.test_id == test_id,
#             models.TestSection.section_type == models.SectionType.reading,
#         )
#         .first()
#     )
#     if not section:
#         raise HTTPException(status_code=404, detail="Reading section not found for this test")
#     return section


# # ─── LISTENING ───────────────────────────────────────────────────────────────

# @router.get("/{test_id}/listening", response_model=schemas.ListeningSectionOut)
# def get_listening_section(
#     test_id: int,
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):
#     test = db.query(models.IELTSTest).filter(models.IELTSTest.id == test_id).first()
#     if not test:
#         raise HTTPException(status_code=404, detail="Test not found")
#     _check_access(test, current_user)

#     section = (
#         db.query(models.TestSection)
#         .options(
#             joinedload(models.TestSection.question_groups).joinedload(models.QuestionGroup.questions),
#         )
#         .filter(
#             models.TestSection.test_id == test_id,
#             models.TestSection.section_type == models.SectionType.listening,
#         )
#         .first()
#     )
#     if not section:
#         raise HTTPException(status_code=404, detail="Listening section not found")
#     return section


# # ─── WRITING ─────────────────────────────────────────────────────────────────

# @router.get("/{test_id}/writing", response_model=schemas.WritingSectionOut)
# def get_writing_section(
#     test_id: int,
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):
#     test = db.query(models.IELTSTest).filter(models.IELTSTest.id == test_id).first()
#     if not test:
#         raise HTTPException(status_code=404, detail="Test not found")
#     _check_access(test, current_user)

#     section = (
#         db.query(models.TestSection)
#         .options(joinedload(models.TestSection.writing_tasks))
#         .filter(
#             models.TestSection.test_id == test_id,
#             models.TestSection.section_type == models.SectionType.writing,
#         )
#         .first()
#     )
#     if not section:
#         raise HTTPException(status_code=404, detail="Writing section not found")
#     return section


# # ─── SPEAKING ────────────────────────────────────────────────────────────────

# @router.get("/{test_id}/speaking", response_model=schemas.SpeakingSectionOut)
# def get_speaking_section(
#     test_id: int,
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):
#     test = db.query(models.IELTSTest).filter(models.IELTSTest.id == test_id).first()
#     if not test:
#         raise HTTPException(status_code=404, detail="Test not found")
#     _check_access(test, current_user)

#     section = (
#         db.query(models.TestSection)
#         .options(joinedload(models.TestSection.speaking_parts))
#         .filter(
#             models.TestSection.test_id == test_id,
#             models.TestSection.section_type == models.SectionType.speaking,
#         )
#         .first()
#     )
#     if not section:
#         raise HTTPException(status_code=404, detail="Speaking section not found")
#     return section
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.database import get_db
from app import models, schemas
from app.utils.auth import get_current_user

router = APIRouter(prefix="/tests", tags=["Tests"])


def _check_access(test: models.IELTSTest, user: models.User):
    if not test.is_free and user.plan == models.PlanType.free:
        raise HTTPException(
            status_code=403,
            detail="This test requires a premium subscription. Please upgrade your plan."
        )


# ─── BOOKS ───────────────────────────────────────────────────────────────────

@router.get("/books", response_model=List[schemas.TestBookOut])
def list_books(
    test_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    q = db.query(models.TestBook)
    if test_type:
        q = q.filter(models.TestBook.test_type == test_type)
    return q.order_by(models.TestBook.book_number).all()


@router.get("/books/{book_id}/tests", response_model=List[schemas.IELTSTestOut])
def list_tests(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    tests = db.query(models.IELTSTest).filter(
        models.IELTSTest.book_id == book_id
    ).order_by(models.IELTSTest.test_number).all()
    return tests


@router.get("/all", response_model=List[schemas.IELTSTestOut])
def list_all_tests(
    test_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    q = db.query(models.IELTSTest)
    if test_type:
        q = q.filter(models.IELTSTest.test_type == test_type)
    return q.order_by(models.IELTSTest.id).all()


# ─── READING ─────────────────────────────────────────────────────────────────

@router.get("/{test_id}/reading", response_model=schemas.ReadingSectionOut)
def get_reading_section(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Get reading section with all passages and questions"""

    test = db.query(models.IELTSTest).filter(models.IELTSTest.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    _check_access(test, current_user)

    section = (
        db.query(models.TestSection)
        .options(
            joinedload(models.TestSection.passages),
            joinedload(models.TestSection.question_groups).joinedload(models.QuestionGroup.questions),
        )
        .filter(
            models.TestSection.test_id == test_id,
            models.TestSection.section_type == models.SectionType.reading,
        )
        .first()
    )
    if not section:
        raise HTTPException(status_code=404, detail="Reading section not found for this test")
    return section


# ─── LISTENING ───────────────────────────────────────────────────────────────

@router.get("/{test_id}/listening", response_model=schemas.ListeningSectionOut)
def get_listening_section(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    test = db.query(models.IELTSTest).filter(models.IELTSTest.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    _check_access(test, current_user)

    section = (
        db.query(models.TestSection)
        .options(
            joinedload(models.TestSection.question_groups).joinedload(models.QuestionGroup.questions),
        )
        .filter(
            models.TestSection.test_id == test_id,
            models.TestSection.section_type == models.SectionType.listening,
        )
        .first()
    )
    if not section:
        raise HTTPException(status_code=404, detail="Listening section not found")
    return section


# ─── WRITING ─────────────────────────────────────────────────────────────────

@router.get("/{test_id}/writing", response_model=schemas.WritingSectionOut)
def get_writing_section(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    test = db.query(models.IELTSTest).filter(models.IELTSTest.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    _check_access(test, current_user)

    section = (
        db.query(models.TestSection)
        .options(joinedload(models.TestSection.writing_tasks))
        .filter(
            models.TestSection.test_id == test_id,
            models.TestSection.section_type == models.SectionType.writing,
        )
        .first()
    )
    if not section:
        raise HTTPException(status_code=404, detail="Writing section not found")
    return section


# ─── SPEAKING ────────────────────────────────────────────────────────────────

@router.get("/{test_id}/speaking", response_model=schemas.SpeakingSectionOut)
def get_speaking_section(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    test = db.query(models.IELTSTest).filter(models.IELTSTest.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    _check_access(test, current_user)

    section = (
        db.query(models.TestSection)
        .options(joinedload(models.TestSection.speaking_parts))
        .filter(
            models.TestSection.test_id == test_id,
            models.TestSection.section_type == models.SectionType.speaking,
        )
        .first()
    )
    if not section:
        raise HTTPException(status_code=404, detail="Speaking section not found")
    return section