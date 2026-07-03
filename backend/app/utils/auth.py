import re
import secrets
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer(auto_error=False)

COOKIE_NAME = "access_token"
COOKIE_MAX_AGE = 7 * 24 * 60 * 60  # 7 days


def set_auth_cookie(response, token: str):
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=COOKIE_MAX_AGE,
        httponly=True,
        samesite="lax",
        secure=False,  # set True in production with HTTPS
        path="/",
    )


def clear_auth_cookie(response):
    response.delete_cookie(COOKIE_NAME, path="/")


def _extract_model(ua: str) -> str | None:
    """Extract the real device model name from a User-Agent string."""
    ua_lower = ua.lower()

    if "iphone" in ua_lower:
        m = re.search(r'(iPhone\d+,\d+)', ua)
        if m:
            return m.group(1)

    if "ipad" in ua_lower:
        m = re.search(r'(iPad\d+,\d+)', ua)
        if m:
            return m.group(1)

    if "android" in ua_lower:
        m = re.search(r'Android\s+\d+(?:\.\d+)?;\s*([^;)\]]+)', ua)
        if m:
            model = m.group(1).strip()
            if model and "build" not in model.lower() and len(model) > 1 and model != "w":
                return model

    return None


def parse_user_agent(ua: str | None) -> tuple[str | None, str | None, str | None]:
    """Extract (device_category, model, browser) from a User-Agent string."""
    if not ua:
        return None, None, None

    ua_lower = ua.lower()
    device = "Unknown Device"

    if "iphone" in ua_lower:
        device = "iPhone"
    elif "ipad" in ua_lower:
        device = "iPad"
    elif "android" in ua_lower:
        device = "Android Tablet" if ("tablet" in ua_lower or "tab" in ua_lower) else "Android Phone"
    elif "windows phone" in ua_lower:
        device = "Windows Phone"
    elif "mobile" in ua_lower:
        device = "Mobile Device"
    elif "windows" in ua_lower:
        device = "Windows PC"
    elif "macintosh" in ua_lower or "mac os" in ua_lower:
        device = "Mac"
    elif "linux" in ua_lower:
        device = "Linux"
    elif "cros" in ua_lower:
        device = "Chromebook"

    browser = "Unknown Browser"
    if "edg/" in ua_lower or "edge/" in ua_lower:
        browser = "Edge"
    elif "chrome/" in ua_lower and "chromium" not in ua_lower and "edge" not in ua_lower:
        browser = "Chrome"
    elif "safari/" in ua_lower and "chrome/" not in ua_lower:
        browser = "Safari"
    elif "firefox/" in ua_lower:
        browser = "Firefox"
    elif "opera" in ua_lower or "opr/" in ua_lower:
        browser = "Opera"

    model = _extract_model(ua)
    return device, model, browser


def parse_user_agent_detailed(ua: str | None) -> dict:
    """Parse a User-Agent string into detailed fields.

    Returns:
        device_name: human-readable device label
        os_name: operating system (e.g. Windows, iOS, Android)
        browser_name: browser name (e.g. Chrome, Firefox)
        browser_version: browser version string
    """
    if not ua:
        return {"device_name": None, "os_name": None, "browser_name": None, "browser_version": None}

    ua_lower = ua.lower()

    # --- OS detection ---
    os_name = None
    if "windows nt 10" in ua_lower:
        os_name = "Windows 10"
    elif "windows nt 11" in ua_lower:
        os_name = "Windows 11"
    elif "windows nt 6.3" in ua_lower:
        os_name = "Windows 8.1"
    elif "windows nt 6.1" in ua_lower:
        os_name = "Windows 7"
    elif "windows phone" in ua_lower:
        os_name = "Windows Phone"
    elif "windows" in ua_lower:
        os_name = "Windows"
    elif "iphone" in ua_lower or "ipad" in ua_lower:
        m = re.search(r'CPU iPhone OS (\d+[._]\d+)', ua)
        os_name = f"iOS {m.group(1).replace('_', '.')}" if m else "iOS"
    elif "mac os x" in ua_lower:
        m = re.search(r'Mac OS X (\d+[._]\d+(?:[._]\d+)?)', ua)
        os_name = f"macOS {m.group(1).replace('_', '.')}" if m else "macOS"
    elif "android" in ua_lower:
        m = re.search(r'Android (\d+(?:\.\d+)*)', ua)
        os_name = f"Android {m.group(1)}" if m else "Android"
    elif "linux" in ua_lower:
        os_name = "Linux"
    elif "cros" in ua_lower:
        os_name = "ChromeOS"

    # --- Browser detection ---
    browser_name = None
    browser_version = None

    edge_m = re.search(r'(?:Edg|Edge)/(\d+(?:\.\d+)+)', ua)
    chrome_m = re.search(r'Chrome/(\d+(?:\.\d+)+)', ua)
    safari_m = re.search(r'Version/(\d+(?:\.\d+)+).*Safari/', ua)
    firefox_m = re.search(r'Firefox/(\d+(?:\.\d+)+)', ua)
    opera_m = re.search(r'(?:OPR|Opera)/(\d+(?:\.\d+)+)', ua)

    if edge_m:
        browser_name = "Edge"
        browser_version = edge_m.group(1)
    elif opera_m:
        browser_name = "Opera"
        browser_version = opera_m.group(1)
    elif chrome_m and "chromium" not in ua_lower:
        browser_name = "Chrome"
        browser_version = chrome_m.group(1)
    elif firefox_m:
        browser_name = "Firefox"
        browser_version = firefox_m.group(1)
    elif safari_m:
        browser_name = "Safari"
        browser_version = safari_m.group(1)

    # --- Device name ---
    device, model, _ = parse_user_agent(ua)
    if model:
        device_name = model
    elif device:
        device_name = device
    else:
        device_name = None

    return {
        "device_name": device_name,
        "os_name": os_name,
        "browser_name": browser_name,
        "browser_version": browser_version,
    }


def generate_otp() -> str:
    return f"{secrets.randbelow(1000000):06d}"


def generate_jti() -> str:
    return secrets.token_urlsafe(24)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        jti = payload.get("jti")
        if not user_id:
            return None
        return {"user_id": int(user_id), "jti": jti}
    except JWTError:
        return None


def create_session_and_invalidate_others(
    user_id: int,
    jti: str,
    db: Session,
    device_name: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> models.UserSession:
    old_sessions = db.query(models.UserSession).filter(
        models.UserSession.user_id == user_id,
        models.UserSession.is_active == True,
    ).all()
    for s in old_sessions:
        s.is_active = False

    session = models.UserSession(
        user_id=user_id,
        token_jti=jti,
        device_name=device_name,
        ip_address=ip_address,
        user_agent=user_agent,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def _resolve_token(request: Request, credentials: HTTPAuthorizationCredentials | None = None) -> str | None:
    if credentials:
        return credentials.credentials
    return request.cookies.get(COOKIE_NAME)


def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    token = _resolve_token(request, credentials)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    user = db.query(models.User).filter(models.User.id == payload["user_id"]).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=404, detail="User not found")

    jti = payload.get("jti")
    if jti:
        session = db.query(models.UserSession).filter(
            models.UserSession.token_jti == jti,
            models.UserSession.is_active == True,
        ).first()
        if not session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired. You have been logged out on another device.",
            )
        session.last_accessed_at = datetime.utcnow()
        db.commit()

    return user


def get_admin_user(current_user: models.User = Depends(get_current_user)) -> models.User:
    if current_user.role != models.UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
