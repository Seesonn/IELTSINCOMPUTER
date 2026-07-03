import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.utils.auth import get_current_user
from app.services.payment import (
    get_esewa_form_data, verify_esewa_payment,
    initiate_khalti_payment, verify_khalti_payment,
)
from app.config import settings

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("/plans", response_model=List[schemas.SubscriptionPlanOut])
def get_plans(db: Session = Depends(get_db)):
    return db.query(models.SubscriptionPlan).filter(
        models.SubscriptionPlan.is_active == True
    ).all()


@router.post("/esewa/initiate")
def initiate_esewa(
    data: schemas.PaymentInitiate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    plan = db.query(models.SubscriptionPlan).filter(
        models.SubscriptionPlan.id == data.plan_id
    ).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    transaction_uuid = str(uuid.uuid4())

    payment = models.Payment(
        user_id=current_user.id,
        plan_id=plan.id,
        gateway=models.PaymentGateway.esewa,
        amount_npr=plan.price_npr,
        transaction_id=transaction_uuid,
        status=models.PaymentStatus.pending,
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    form_data = get_esewa_form_data(
        amount_npr_paisa=plan.price_npr,
        transaction_uuid=transaction_uuid,
        success_url=f"{settings.FRONTEND_URL}/payment/success?gateway=esewa&payment_id={payment.id}",
        failure_url=f"{settings.FRONTEND_URL}/payment/failure",
    )

    return {"payment_id": payment.id, "form_data": form_data}


@router.post("/esewa/verify")
def verify_esewa(
    data: schemas.EsewaVerify,
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    payment = db.query(models.Payment).filter(
        models.Payment.id == payment_id,
        models.Payment.user_id == current_user.id,
    ).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    result = verify_esewa_payment(data.data)

    if result["success"]:
        payment.status = models.PaymentStatus.completed
        payment.gateway_response = result["data"]
        payment.gateway_ref_id = result["data"].get("transaction_code")

        # Upgrade user plan
        plan = db.query(models.SubscriptionPlan).filter(
            models.SubscriptionPlan.id == payment.plan_id
        ).first()
        if plan:
            current_user.plan = plan.plan_type
        db.commit()
        return {"success": True, "message": "Payment verified successfully"}
    else:
        payment.status = models.PaymentStatus.failed
        payment.gateway_response = result.get("data")
        db.commit()
        raise HTTPException(status_code=400, detail="Payment verification failed")


@router.post("/khalti/initiate")
def initiate_khalti(
    data: schemas.PaymentInitiate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    plan = db.query(models.SubscriptionPlan).filter(
        models.SubscriptionPlan.id == data.plan_id
    ).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    order_id = str(uuid.uuid4())

    payment = models.Payment(
        user_id=current_user.id,
        plan_id=plan.id,
        gateway=models.PaymentGateway.khalti,
        amount_npr=plan.price_npr,
        transaction_id=order_id,
        status=models.PaymentStatus.pending,
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    result = initiate_khalti_payment(
        amount_paisa=plan.price_npr,
        purchase_order_id=order_id,
        purchase_order_name=f"IELTSPrep {plan.name} Plan",
        return_url=f"{settings.FRONTEND_URL}/payment/success?gateway=khalti&payment_id={payment.id}",
        website_url=settings.FRONTEND_URL,
        customer_info={
            "name": current_user.full_name,
            "email": current_user.email,
        },
    )

    if result["success"]:
        payment.gateway_ref_id = result["pidx"]
        db.commit()
        return {
            "payment_id": payment.id,
            "pidx": result["pidx"],
            "payment_url": result["payment_url"],
        }
    else:
        payment.status = models.PaymentStatus.failed
        db.commit()
        raise HTTPException(status_code=400, detail=f"Khalti initiation failed: {result.get('error')}")


@router.post("/khalti/verify")
def verify_khalti(
    pidx: str,
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    payment = db.query(models.Payment).filter(
        models.Payment.id == payment_id,
        models.Payment.user_id == current_user.id,
    ).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    result = verify_khalti_payment(pidx)

    if result["success"]:
        payment.status = models.PaymentStatus.completed
        payment.gateway_response = result["data"]

        plan = db.query(models.SubscriptionPlan).filter(
            models.SubscriptionPlan.id == payment.plan_id
        ).first()
        if plan:
            current_user.plan = plan.plan_type
        db.commit()
        return {"success": True, "message": "Payment verified successfully"}
    else:
        payment.status = models.PaymentStatus.failed
        payment.gateway_response = result.get("data")
        db.commit()
        raise HTTPException(status_code=400, detail="Khalti verification failed")


@router.get("/history", response_model=List[schemas.PaymentOut])
def payment_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Payment)
        .filter(models.Payment.user_id == current_user.id)
        .order_by(models.Payment.created_at.desc())
        .all()
    )
