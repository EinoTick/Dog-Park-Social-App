"""
Auth router — registration and login.

KEY FASTAPI PATTERNS DEMONSTRATED:
-----------------------------------
1. `APIRouter()` — a mini-app that groups related endpoints.

2. `OAuth2PasswordRequestForm` — a built-in dependency that parses
   `application/x-www-form-urlencoded` bodies with `username` and `password`
   fields.  This is the OAuth2 "Resource Owner Password" flow.
   Swagger UI's "Authorize" dialog sends exactly this format.

3. `Depends(get_session)` — injects a database Session that auto-closes.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app.core.security import create_access_token, hash_password, verify_password
from app.database import get_session
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserRead

router = APIRouter()


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(
    payload: UserCreate,
    session: Session = Depends(get_session),
):
    """Create a new user account."""
    # Check for existing email/username
    existing = session.exec(
        select(User).where((User.email == payload.email) | (User.username == payload.username))
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email or username already exists",
        )

    user = User(
        email=payload.email,
        username=payload.username,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    """
    OAuth2-compatible login endpoint.

    Accepts form data (not JSON) with `username` and `password` fields.
    The `username` field can contain the user's email address.
    Returns a JWT access token.
    """
    user = session.exec(
        select(User).where(
            (User.email == form_data.username) | (User.username == form_data.username)
        )
    ).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    token = create_access_token(subject=user.id)
    return Token(access_token=token)
