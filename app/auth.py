import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

# -------------------------
# CONFIG
# Add SECRET_KEY to your .env file before deploying.
# Generate a strong one with: python -c "import secrets; print(secrets.token_hex(32))"
# -------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "neurogrow-dev-secret-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7  # Users stay logged in for 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# auto_error=False means unauthenticated requests return None instead of crashing.
# This lets us have routes that work WITH or WITHOUT auth (backward compatible).
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


def _truncate(password: str) -> str:
    """Bcrypt silently truncates at 72 bytes — we enforce it explicitly."""
    return password.encode("utf-8")[:72].decode("utf-8", errors="ignore")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if a plain password matches a stored hashed password."""
    return pwd_context.verify(_truncate(plain_password), hashed_password)


def hash_password(password: str) -> str:
    """Securely hash a password using bcrypt. Never store plain passwords."""
    return pwd_context.hash(_truncate(password))


def create_access_token(email: str) -> str:
    """Create a signed JWT token that expires in ACCESS_TOKEN_EXPIRE_DAYS days."""
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    payload = {"sub": email, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_caregiver(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[models.Caregiver]:
    """
    Try to get the currently logged-in caregiver from the JWT token.
    Returns None if no token or invalid token (does NOT raise an error).
    Use this for routes that work whether or not the user is logged in.
    """
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            return None
    except JWTError:
        return None

    return db.query(models.Caregiver).filter(
        models.Caregiver.email == email
    ).first()


def require_caregiver(
    caregiver: Optional[models.Caregiver] = Depends(get_current_caregiver)
) -> models.Caregiver:
    """
    Same as get_current_caregiver but RAISES a 401 error if not logged in.
    Use this on routes that absolutely require authentication.
    """
    if not caregiver:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please log in to access this resource.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return caregiver
