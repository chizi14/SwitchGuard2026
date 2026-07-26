"""JWT token creation and password hashing utilities."""
from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext

from app.core.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()


def hash_secret(secret: str) -> str:
    """Hash a PIN or password."""
    return pwd_context.hash(secret)


def verify_secret(plain: str, hashed: str) -> bool:
    """Verify a PIN or password against its hash."""
    return pwd_context.verify(plain, hashed)


def create_access_token(
    subject: str,
    extra_claims: dict | None = None,
    expires_minutes: int | None = None,
) -> str:
    """Create a JWT access token."""
    expire_minutes = expires_minutes or settings.JWT_EXPIRY_MINUTES
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "iat": now,
        "exp": now + timedelta(minutes=expire_minutes),
    }
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


def decode_access_token(token: str) -> dict:
    """Decode and validate a JWT access token."""
    return jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
