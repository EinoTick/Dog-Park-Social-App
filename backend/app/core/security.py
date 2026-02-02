"""
Security utilities: password hashing and JWT token management.

ARCHITECTURE NOTES:
-------------------
- We use `bcrypt` directly (not passlib) for password hashing.  passlib has
  known compatibility issues with bcrypt>=4.1.  The bcrypt library gives us
  `hashpw` and `checkpw` — simple and battle-tested.

- `create_access_token` embeds a `sub` (subject = user id) and an `exp`
  (expiration) claim.  The frontend stores this token and sends it as
  `Authorization: Bearer <token>` on every request.

- `decode_access_token` is used inside a FastAPI *dependency* (see
  core/deps.py) to extract the current user from the incoming request.
"""

from datetime import datetime, timedelta, timezone

import bcrypt
from jose import JWTError, jwt

from app.core.config import settings

# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )


def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")


# ---------------------------------------------------------------------------
# JWT tokens
# ---------------------------------------------------------------------------
def create_access_token(subject: int | str, expires_delta: timedelta | None = None) -> str:
    """
    Create a signed JWT.

    Parameters
    ----------
    subject : int | str
        Typically the user's primary-key id.
    expires_delta : timedelta, optional
        Custom lifetime.  Falls back to settings.ACCESS_TOKEN_EXPIRE_MINUTES.
    """
    expire = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode = {"sub": str(subject), "exp": expire}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> str | None:
    """
    Decode a JWT and return the `sub` claim (user id as string).

    Returns None if the token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None
