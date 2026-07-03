import secrets
import logging
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
try:
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests
    GOOGLE_AUTH_AVAILABLE = True
except ImportError:
    GOOGLE_AUTH_AVAILABLE = False
    id_token = None
    google_requests = None
from app.database import get_db
from app import models, schemas
from app.config import settings
from app.utils.auth import hash_password, verify_password, create_access_token, get_current_user, generate_otp, generate_jti, create_session_and_invalidate_others, decode_token, parse_user_agent, parse_user_agent_detailed, set_auth_cookie, clear_auth_cookie
from app.services.email import send_otp_email, send_password_reset_email
from app.services.geolocation import geolocate_ip

router = APIRouter(prefix="/auth", tags=["Authentication"])

OTP_EXPIRE_MINUTES = 10
logger = logging.getLogger("auth")
bearer_scheme = HTTPBearer()


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def _build_response(email: str, otp: str) -> dict:
    resp = {"message": "Account created. Please verify your email.", "email": _normalize_email(email)}
    if settings.DEBUG:
        resp["otp"] = otp
    return resp


async def _record_login_attempt(
    user_id: int,
    request: Request,
    db: Session,
    status: str = "success",
) -> None:
    """Parse User-Agent, geolocate IP, and persist a LoginRecord."""
    ua = request.headers.get("User-Agent", None)
    ua_info = parse_user_agent_detailed(ua)
    ip = request.client.host if request.client else None
    city, country = await geolocate_ip(ip)

    record = models.LoginRecord(
        user_id=user_id,
        ip_address=ip,
        user_agent=ua,
        device_name=ua_info.get("device_name"),
        os_name=ua_info.get("os_name"),
        browser_name=ua_info.get("browser_name"),
        browser_version=ua_info.get("browser_version"),
        city=city,
        country=country,
        login_status=status,
    )
    db.add(record)
    db.commit()


@router.post("/register", status_code=201)
def register(data: schemas.UserRegister, db: Session = Depends(get_db)):
    email = _normalize_email(data.email)

    if db.query(models.User).filter(models.User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    existing = db.query(models.PendingUser).filter(models.PendingUser.email == email).first()
    if existing:
        db.delete(existing)
        db.commit()

    otp = generate_otp()
    otp_expires = datetime.utcnow() + timedelta(minutes=OTP_EXPIRE_MINUTES)

    pending = models.PendingUser(
        email=email,
        full_name=data.full_name.strip(),
        hashed_password=hash_password(data.password),
        target_band=data.target_band,
        otp_code=otp,
        otp_expires_at=otp_expires,
    )
    db.add(pending)
    db.commit()

    send_otp_email(email, otp)

    return _build_response(email, otp)


@router.post("/verify-otp", response_model=schemas.OTPResponse)
def verify_otp(data: schemas.OTPVerify, response: Response, db: Session = Depends(get_db)):
    email = _normalize_email(data.email)
    pending = db.query(models.PendingUser).filter(models.PendingUser.email == email).first()
    if not pending:
        raise HTTPException(status_code=404, detail="No pending registration found. Please register first.")
    if pending.otp_code != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if datetime.utcnow() > pending.otp_expires_at:
        db.delete(pending)
        db.commit()
        raise HTTPException(status_code=400, detail="OTP has expired. Please register again.")

    user = models.User(
        email=pending.email,
        full_name=pending.full_name,
        hashed_password=pending.hashed_password,
        target_band=pending.target_band,
    )
    db.add(user)
    db.delete(pending)
    db.commit()
    db.refresh(user)

    member = db.query(models.EnterpriseMember).filter(
        models.EnterpriseMember.member_email == email,
    ).first()
    if member and user.plan != models.PlanType.enterprise:
        user.plan = models.PlanType.enterprise
        db.commit()

    jti = generate_jti()
    token = create_access_token({"sub": str(user.id), "jti": jti})
    create_session_and_invalidate_others(user.id, jti, db)
    set_auth_cookie(response, token)
    return {"message": "Email verified successfully", "access_token": token}


@router.post("/resend-otp")
def resend_otp(data: schemas.OTPResend, db: Session = Depends(get_db)):
    email = _normalize_email(data.email)
    pending = db.query(models.PendingUser).filter(models.PendingUser.email == email).first()
    if not pending:
        raise HTTPException(status_code=404, detail="No pending registration found. Please register first.")

    otp = generate_otp()
    pending.otp_code = otp
    pending.otp_expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRE_MINUTES)
    db.commit()

    send_otp_email(email, otp)

    return _build_response(email, otp)


@router.post("/forgot-password", response_model=schemas.ForgotPasswordResponse)
def forgot_password(data: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = _normalize_email(data.email)
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return {"message": "If an account with that email exists, a reset link has been sent."}

    old_tokens = db.query(models.PasswordResetToken).filter(
        models.PasswordResetToken.user_id == user.id,
        models.PasswordResetToken.used == False,
    ).all()
    for t in old_tokens:
        t.used = True

    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)

    reset_token = models.PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=expires_at,
    )
    db.add(reset_token)
    db.commit()

    send_password_reset_email(email, token)

    if settings.DEBUG:
        logger.warning(f"Password reset token for {email}: {token}")

    return {"message": "If an account with that email exists, a reset link has been sent."}


@router.post("/reset-password", response_model=schemas.ForgotPasswordResponse)
def reset_password(data: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    reset = db.query(models.PasswordResetToken).filter(
        models.PasswordResetToken.token == data.token,
        models.PasswordResetToken.used == False,
    ).first()
    if not reset or datetime.utcnow() > reset.expires_at:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user = db.query(models.User).filter(models.User.id == reset.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = hash_password(data.password)
    reset.used = True

    old_sessions = db.query(models.UserSession).filter(
        models.UserSession.user_id == user.id,
        models.UserSession.is_active == True,
    ).all()
    for s in old_sessions:
        s.is_active = False

    db.commit()

    return {"message": "Password has been reset successfully."}


@router.post("/login", response_model=schemas.Token)
async def login(data: schemas.UserLogin, request: Request, response: Response, db: Session = Depends(get_db)):
    email = _normalize_email(data.email)
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        pending = db.query(models.PendingUser).filter(models.PendingUser.email == email).first()
        if pending:
            raise HTTPException(
                status_code=403,
                detail="Email not verified. Please check your inbox or request a new code.",
            )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(data.password, user.hashed_password):
        await _record_login_attempt(user.id, request, db, status="failed")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        await _record_login_attempt(user.id, request, db, status="failed")
        raise HTTPException(status_code=403, detail="Account is deactivated")

    member = db.query(models.EnterpriseMember).filter(
        models.EnterpriseMember.member_email == email,
    ).first()
    if member and user.plan != models.PlanType.enterprise:
        user.plan = models.PlanType.enterprise
        db.commit()

    jti = generate_jti()
    token = create_access_token({"sub": str(user.id), "jti": jti})
    ua = request.headers.get("User-Agent", None)
    device, model, browser = parse_user_agent(ua)
    label = model or device
    device_name = f"{label} · {browser}" if label and browser else label or ua
    create_session_and_invalidate_others(
        user.id, jti, db,
        device_name=device_name,
        ip_address=request.client.host if request.client else None,
        user_agent=ua,
    )
    await _record_login_attempt(user.id, request, db, status="success")
    set_auth_cookie(response, token)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/google", response_model=schemas.Token)
async def google_login(data: schemas.GoogleLogin, request: Request, response: Response, db: Session = Depends(get_db)):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google OAuth is not configured on the server.")
    if not GOOGLE_AUTH_AVAILABLE:
        raise HTTPException(status_code=500, detail="Google Auth library not installed. Run: pip install google-auth")

    try:
        info = id_token.verify_oauth2_token(
            data.credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid Google token: {e}")
    except Exception as e:
        logger.error(f"Google token verification failed: {e}")
        raise HTTPException(status_code=400, detail="Google authentication failed. The token may be expired or invalid.")

    email = info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email")

    email = email.strip().lower()
    name = info.get("name", "").strip() or email.split("@")[0]
    picture = info.get("picture")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = models.User(
            email=email,
            full_name=name,
            hashed_password=hash_password(secrets.token_urlsafe(32)),
            avatar_url=picture,
            is_verified=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif picture and not user.avatar_url:
        user.avatar_url = picture
        db.commit()

    member = db.query(models.EnterpriseMember).filter(
        models.EnterpriseMember.member_email == email,
    ).first()
    if member and user.plan != models.PlanType.enterprise:
        user.plan = models.PlanType.enterprise
        db.commit()

    jti = generate_jti()
    token = create_access_token({"sub": str(user.id), "jti": jti})
    ua = request.headers.get("User-Agent", None)
    device, model, browser = parse_user_agent(ua)
    label = model or device
    device_name = f"{label} · {browser}" if label and browser else label or ua
    create_session_and_invalidate_others(
        user.id, jti, db,
        device_name=device_name,
        ip_address=request.client.host if request.client else None,
        user_agent=ua,
    )
    await _record_login_attempt(user.id, request, db, status="success")
    set_auth_cookie(response, token)
    return {"access_token": token, "token_type": "bearer"}

@router.post("/logout")


@router.post("/logout")
def logout(response: Response, current_user: models.User = Depends(get_current_user)):
    clear_auth_cookie(response)
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=schemas.UserOut)
def get_me(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    is_member = db.query(models.EnterpriseMember).filter(
        models.EnterpriseMember.member_email == current_user.email,
    ).first() is not None
    is_owner = db.query(models.EnterpriseMember).filter(
        models.EnterpriseMember.owner_id == current_user.id,
    ).first() is not None
    enterprise_owner = (
        current_user.plan == models.PlanType.enterprise
        and not is_member
    ) or is_owner
    return schemas.UserOut(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        plan=current_user.plan,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        avatar_url=current_user.avatar_url,
        target_band=current_user.target_band,
        test_date=current_user.test_date,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
        is_enterprise_owner=enterprise_owner,
    )


@router.put("/me", response_model=schemas.UserOut)
def update_me(
    data: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/login-history", response_model=List[schemas.LoginRecordOut])
def login_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    records = db.query(models.LoginRecord).filter(
        models.LoginRecord.user_id == current_user.id,
    ).order_by(models.LoginRecord.login_time.desc()).limit(10).all()

    result = [schemas.LoginRecordOut.model_validate(r) for r in records]

    # Prepend current active session as "active" entry
    active_session = db.query(models.UserSession).filter(
        models.UserSession.user_id == current_user.id,
        models.UserSession.is_active == True,
    ).order_by(models.UserSession.last_accessed_at.desc()).first()

    if active_session:
        ua_info = parse_user_agent_detailed(active_session.user_agent)
        result.insert(0, schemas.LoginRecordOut(
            id=0,
            ip_address=active_session.ip_address,
            device_name=ua_info.get("device_name") or active_session.device_name,
            os_name=ua_info.get("os_name"),
            browser_name=ua_info.get("browser_name"),
            browser_version=ua_info.get("browser_version"),
            city=None,
            country=None,
            login_status="active",
            login_time=active_session.last_accessed_at or active_session.created_at,
        ))

    return result


@router.get("/sessions", response_model=List[schemas.UserSessionOut])
def list_sessions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    current_jti = None
    payload = decode_token(credentials.credentials)
    if payload:
        current_jti = payload.get("jti")

    sessions = db.query(models.UserSession).filter(
        models.UserSession.user_id == current_user.id,
        models.UserSession.is_active == True,
    ).order_by(models.UserSession.last_accessed_at.desc()).all()

    result = []
    for s in sessions:
        out = schemas.UserSessionOut.model_validate(s)
        out.is_current = (s.token_jti == current_jti)
        result.append(out)
    return result


@router.delete("/sessions/{session_id}")
def revoke_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    session = db.query(models.UserSession).filter(
        models.UserSession.id == session_id,
        models.UserSession.user_id == current_user.id,
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    payload = decode_token(credentials.credentials)
    if payload and payload.get("jti") == session.token_jti:
        raise HTTPException(status_code=400, detail="Cannot revoke your current session. Use /auth/logout instead.")

    session.is_active = False
    db.commit()
    return {"message": "Session revoked."}


@router.post("/logout")
def logout(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    payload = decode_token(credentials.credentials)
    if payload and payload.get("jti"):
        session = db.query(models.UserSession).filter(
            models.UserSession.token_jti == payload["jti"],
        ).first()
        if session:
            session.is_active = False
            db.commit()
    return {"message": "Logged out successfully."}
