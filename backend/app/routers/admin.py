from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.utils.auth import get_admin_user

router = APIRouter(prefix="/admin", tags=["Admin"])


# ── Dashboard Stats ──

@router.get("/stats", response_model=schemas.AdminStats)
def admin_stats(
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    total_users = db.query(models.User).count()
    total_requests = db.query(models.SubscriptionRequest).count()
    pending_requests = db.query(models.SubscriptionRequest).filter(
        models.SubscriptionRequest.status == models.SubscriptionRequestStatus.pending
    ).count()
    approved_requests = db.query(models.SubscriptionRequest).filter(
        models.SubscriptionRequest.status == models.SubscriptionRequestStatus.approved
    ).count()
    rejected_requests = db.query(models.SubscriptionRequest).filter(
        models.SubscriptionRequest.status == models.SubscriptionRequestStatus.rejected
    ).count()
    free_users = db.query(models.User).filter(models.User.plan == models.PlanType.free).count()
    premium_users = db.query(models.User).filter(models.User.plan == models.PlanType.premium).count()
    enterprise_users = db.query(models.User).filter(models.User.plan == models.PlanType.enterprise).count()
    total_books = db.query(models.TestBook).count()

    return schemas.AdminStats(
        total_users=total_users,
        total_requests=total_requests,
        pending_requests=pending_requests,
        approved_requests=approved_requests,
        rejected_requests=rejected_requests,
        free_users=free_users,
        premium_users=premium_users,
        enterprise_users=enterprise_users,
        total_books=total_books,
    )


# ── Users ──

@router.get("/users", response_model=List[schemas.AdminUserOut])
def list_users(
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    result = []
    for u in users:
        req = db.query(models.SubscriptionRequest).filter(
            models.SubscriptionRequest.user_id == u.id
        ).order_by(models.SubscriptionRequest.created_at.desc()).first()
        result.append(schemas.AdminUserOut(
            id=u.id,
            email=u.email,
            full_name=u.full_name,
            role=u.role,
            plan=u.plan,
            is_active=u.is_active,
            is_verified=u.is_verified,
            avatar_url=u.avatar_url,
            target_band=u.target_band,
            test_date=u.test_date,
            created_at=u.created_at,
            updated_at=u.updated_at,
            latest_request_status=req.status.value if req else None,
            latest_request_plan=req.plan_type if req else None,
        ))
    return result


@router.put("/users/{user_id}/toggle-active", response_model=schemas.UserOut)
def toggle_active(
    user_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    return user


@router.put("/users/{user_id}/toggle-verify", response_model=schemas.UserOut)
def toggle_verify(
    user_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_verified = not user.is_verified
    db.commit()
    db.refresh(user)
    return user


@router.put("/users/{user_id}/plan", response_model=schemas.UserOut)
def update_plan(
    user_id: int,
    data: schemas.AdminUserUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if data.plan:
        user.plan = data.plan
    db.commit()
    db.refresh(user)
    return user


@router.put("/users/{user_id}/role", response_model=schemas.UserOut)
def update_role(
    user_id: int,
    data: schemas.AdminUserUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if data.role:
        user.role = data.role
    db.commit()
    db.refresh(user)
    return user


# ── Books (CRUD) ──

@router.get("/books", response_model=List[schemas.TestBookOut])
def list_books(
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    return db.query(models.TestBook).order_by(models.TestBook.book_number.asc()).all()


@router.post("/books", response_model=schemas.TestBookOut)
def create_book(
    data: schemas.AdminBookCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    book = models.TestBook(**data.model_dump())
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.put("/books/{book_id}", response_model=schemas.TestBookOut)
def update_book(
    book_id: int,
    data: schemas.AdminBookUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    book = db.query(models.TestBook).filter(models.TestBook.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(book, field, value)
    db.commit()
    db.refresh(book)
    return book


@router.delete("/books/{book_id}")
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    book = db.query(models.TestBook).filter(models.TestBook.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return {"message": "Book deleted.", "id": book_id}


# ── Plans (CRUD) ──

@router.get("/plans", response_model=List[schemas.SubscriptionPlanOut])
def list_plans(
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    return db.query(models.SubscriptionPlan).order_by(models.SubscriptionPlan.price_npr.asc()).all()


@router.post("/plans", response_model=schemas.SubscriptionPlanOut)
def create_plan(
    data: schemas.AdminPlanCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    existing = db.query(models.SubscriptionPlan).filter(
        models.SubscriptionPlan.plan_type == data.plan_type
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="A plan with this type already exists")
    plan = models.SubscriptionPlan(**data.model_dump())
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.put("/plans/{plan_id}", response_model=schemas.SubscriptionPlanOut)
def update_plan(
    plan_id: int,
    data: schemas.AdminPlanUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(plan, field, value)
    db.commit()
    db.refresh(plan)
    return plan


@router.delete("/plans/{plan_id}")
def delete_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    db.delete(plan)
    db.commit()
    return {"message": "Plan deleted.", "id": plan_id}
