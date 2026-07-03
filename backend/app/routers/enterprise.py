import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.utils.auth import get_current_user
from app.models import PlanType

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Enterprise"])

MAX_MEMBERS = 10


def _is_owner(db: Session, user: models.User) -> bool:
    is_member = db.query(models.EnterpriseMember).filter(
        models.EnterpriseMember.member_email == user.email,
    ).first() is not None
    return user.plan == PlanType.enterprise and not is_member


@router.get("/enterprise/status")
def enterprise_status(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    member_count = db.query(models.EnterpriseMember).filter(
        models.EnterpriseMember.owner_id == current_user.id,
    ).count()
    return {
        "is_owner": _is_owner(db, current_user),
        "member_count": member_count,
        "max_members": MAX_MEMBERS,
    }


@router.post("/enterprise/members", response_model=schemas.EnterpriseMemberOut)
def add_member(
    data: schemas.EnterpriseMemberAdd,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not _is_owner(db, current_user):
        raise HTTPException(status_code=403, detail="Only the enterprise account owner can manage team members")

    member_email = data.member_email.strip().lower()

    if member_email == current_user.email:
        raise HTTPException(status_code=400, detail="Cannot add yourself as a member")

    count = db.query(models.EnterpriseMember).filter(
        models.EnterpriseMember.owner_id == current_user.id,
    ).count()
    if count >= MAX_MEMBERS:
        raise HTTPException(status_code=400, detail=f"Maximum {MAX_MEMBERS} team members allowed")

    existing = db.query(models.EnterpriseMember).filter(
        models.EnterpriseMember.owner_id == current_user.id,
        models.EnterpriseMember.member_email == member_email,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="This email is already a team member")

    member = models.EnterpriseMember(
        owner_id=current_user.id,
        member_email=member_email,
    )
    db.add(member)

    user = db.query(models.User).filter(models.User.email == member_email).first()
    if user:
        user.plan = PlanType.enterprise

    db.commit()
    db.refresh(member)
    logger.info("Enterprise member added: owner=%s member=%s", current_user.email, member_email)
    return member


@router.get("/enterprise/members", response_model=List[schemas.EnterpriseMemberOut])
def list_members(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not _is_owner(db, current_user):
        raise HTTPException(status_code=403, detail="Only the enterprise account owner can view team members")

    members = db.query(models.EnterpriseMember).filter(
        models.EnterpriseMember.owner_id == current_user.id,
    ).order_by(models.EnterpriseMember.created_at.desc()).all()
    return members


@router.delete("/enterprise/members/{member_id}")
def remove_member(
    member_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not _is_owner(db, current_user):
        raise HTTPException(status_code=403, detail="Only the enterprise account owner can manage team members")

    member = db.query(models.EnterpriseMember).filter(
        models.EnterpriseMember.id == member_id,
        models.EnterpriseMember.owner_id == current_user.id,
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    user = db.query(models.User).filter(models.User.email == member.member_email).first()
    if user:
        user.plan = PlanType.free

    db.delete(member)
    db.commit()
    logger.info("Enterprise member removed: owner=%s member=%s", current_user.email, member.member_email)
    return {"message": "Team member removed"}
