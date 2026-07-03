import os
import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas
from app.utils.auth import get_current_user, get_admin_user
from app.services.cloudinary_upload import upload_screenshot

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Subscription Requests"])

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/subscription-requests/upload")
def upload_screenshot_endpoint(
    file: UploadFile = File(...),
    gateway: Optional[str] = Form(None),
    plan_type: Optional[str] = Form("premium"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    logger.info("Upload request: user=%s gateway=%s filename=%s", current_user.id, gateway, file.filename)

    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only image files (PNG, JPG, GIF, WEBP) are allowed")

    try:
        contents = file.file.read()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read uploaded file: {e}")

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB")

    existing = db.query(models.SubscriptionRequest).filter(
        models.SubscriptionRequest.user_id == current_user.id,
        models.SubscriptionRequest.status == models.SubscriptionRequestStatus.pending,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already have a pending request")

    filename = f"user_{current_user.id}_{int(datetime.utcnow().timestamp())}{ext}"
    try:
        url = upload_screenshot(contents, filename)
        logger.info("Cloudinary upload success: url=%s", url)
    except Exception as e:
        logger.exception("Cloudinary upload failed")
        raise HTTPException(status_code=500, detail=f"Failed to upload image to server: {e}")

    req = models.SubscriptionRequest(
        user_id=current_user.id,
        email=current_user.email,
        plan_type=plan_type or "premium",
        gateway=gateway,
        screenshot_path=url,
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return {"message": "Screenshot uploaded. Awaiting admin approval.", "id": req.id, "status": req.status}


@router.get("/subscription-requests/my", response_model=List[schemas.SubscriptionRequestOut])
def my_requests(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    reqs = db.query(models.SubscriptionRequest).filter(
        models.SubscriptionRequest.user_id == current_user.id,
    ).order_by(models.SubscriptionRequest.created_at.desc()).all()
    result = []
    for r in reqs:
        u = db.query(models.User).filter(models.User.id == r.user_id).first()
        result.append(schemas.SubscriptionRequestOut(
            id=r.id,
            user_id=r.user_id,
            email=r.email,
            plan_type=r.plan_type,
            gateway=r.gateway,
            screenshot_path=r.screenshot_path,
            status=r.status.value,
            created_at=r.created_at,
            updated_at=r.updated_at,
            user_name=u.full_name if u else None,
            user_current_plan=u.plan.value if u else None,
            user_created_at=u.created_at if u else None,
        ))
    return result


@router.get("/admin/subscription-requests", response_model=List[schemas.SubscriptionRequestOut])
def list_requests(
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    reqs = db.query(models.SubscriptionRequest).order_by(
        models.SubscriptionRequest.created_at.desc()
    ).all()
    result = []
    for r in reqs:
        u = db.query(models.User).filter(models.User.id == r.user_id).first()
        result.append(schemas.SubscriptionRequestOut(
            id=r.id,
            user_id=r.user_id,
            email=r.email,
            plan_type=r.plan_type,
            gateway=r.gateway,
            screenshot_path=r.screenshot_path,
            status=r.status.value,
            created_at=r.created_at,
            updated_at=r.updated_at,
            user_name=u.full_name if u else None,
            user_current_plan=u.plan.value if u else None,
            user_created_at=u.created_at if u else None,
        ))
    return result


@router.put("/admin/subscription-requests/{req_id}/approve")
def approve_request(
    req_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    req = db.query(models.SubscriptionRequest).filter(
        models.SubscriptionRequest.id == req_id
    ).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != models.SubscriptionRequestStatus.pending:
        raise HTTPException(status_code=400, detail="Request already processed")

    req.status = models.SubscriptionRequestStatus.approved
    req.updated_at = datetime.utcnow()

    user = db.query(models.User).filter(models.User.id == req.user_id).first()
    if user and req.plan_type:
        user.plan = models.PlanType(req.plan_type)

    db.commit()
    db.refresh(req)
    return {"message": f"Request approved. {req.email} upgraded to {req.plan_type}.", "id": req.id, "status": req.status}


@router.put("/admin/subscription-requests/{req_id}/reject")
def reject_request(
    req_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    req = db.query(models.SubscriptionRequest).filter(
        models.SubscriptionRequest.id == req_id
    ).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != models.SubscriptionRequestStatus.pending:
        raise HTTPException(status_code=400, detail="Request already processed")

    req.status = models.SubscriptionRequestStatus.rejected
    req.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(req)
    return {"message": "Request rejected.", "id": req.id, "status": req.status}


@router.put("/admin/subscription-requests/{req_id}")
def update_request(
    req_id: int,
    data: schemas.SubscriptionRequestUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    req = db.query(models.SubscriptionRequest).filter(
        models.SubscriptionRequest.id == req_id
    ).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    if data.gateway is not None:
        req.gateway = data.gateway
    if data.plan_type is not None:
        req.plan_type = data.plan_type
    if data.status is not None:
        allowed = {s.value for s in models.SubscriptionRequestStatus}
        if data.status not in allowed:
            raise HTTPException(status_code=400, detail=f"Invalid status. Allowed: {', '.join(allowed)}")
        req.status = models.SubscriptionRequestStatus(data.status)

        if req.status == models.SubscriptionRequestStatus.approved:
            user = db.query(models.User).filter(models.User.id == req.user_id).first()
            if user and req.plan_type:
                user.plan = models.PlanType(req.plan_type)

    req.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(req)
    return {"message": "Request updated.", "id": req.id, "status": req.status}


@router.delete("/admin/subscription-requests/{req_id}")
def delete_request(
    req_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_user),
):
    req = db.query(models.SubscriptionRequest).filter(
        models.SubscriptionRequest.id == req_id
    ).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    db.delete(req)
    db.commit()
    return {"message": "Request deleted.", "id": req_id}
