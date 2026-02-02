"""
Reusable FastAPI dependencies — injected into route functions via `Depends()`.

HOW DEPENDENCY INJECTION WORKS IN FASTAPI:
------------------------------------------
When you write:

    @router.get("/me")
    def read_me(current_user: User = Depends(get_current_user)):
        return current_user

FastAPI will:
  1. See that `get_current_user` is itself a function.
  2. Inspect *its* signature — it depends on `get_session` and on
     `oauth2_scheme` (which reads the Authorization header).
  3. Resolve those inner dependencies first, then call `get_current_user`,
     then pass the result into your route handler.

This gives you composable, testable auth without global state.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session

from app.core.config import settings
from app.core.security import decode_access_token
from app.database import get_session
from app.models.user import User

# This tells FastAPI (and Swagger UI) where the login endpoint lives.
# Swagger's "Authorize" button will POST credentials to this URL.
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login"
)


def get_current_user(
    session: Session = Depends(get_session),
    token: str = Depends(oauth2_scheme),
) -> User:
    """
    Decode the JWT from the Authorization header, look up the user,
    and return the User model instance.

    Raises 401 if the token is invalid or the user doesn't exist.
    """
    user_id = decode_access_token(token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = session.get(User, int(user_id))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    return user


def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Same as get_current_user but additionally checks the `is_admin` flag.

    Usage:
        @router.delete("/users/{user_id}")
        def delete_user(
            user_id: int,
            admin: User = Depends(get_current_admin),
        ):
            ...
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return current_user
