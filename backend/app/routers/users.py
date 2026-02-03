"""
User management router.

Demonstrates:
- `get_current_user` dependency for "who am I?" endpoints.
- `get_current_admin` dependency for admin-only endpoints.
- Partial updates using `model.model_dump(exclude_unset=True)`.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_
from sqlmodel import Session, select

from app.core.deps import get_current_admin, get_current_user
from app.core.security import hash_password, verify_password
from app.database import get_session
from app.models.user import User
from app.schemas.user import AdminUserCreate, AdminUserUpdate, PasswordChange, UserRead, UserUpdate

router = APIRouter()


@router.get("/me", response_model=UserRead)
def read_current_user(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return current_user


@router.patch("/me", response_model=UserRead)
def update_current_user(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Update the current user's profile fields."""
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user


@router.post("/me/change-password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(
    payload: PasswordChange,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Change the current user's password."""
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    current_user.hashed_password = hash_password(payload.new_password)
    session.add(current_user)
    session.commit()


# ---------------------------------------------------------------------------
# Admin endpoints
# ---------------------------------------------------------------------------
@router.get("/", response_model=list[UserRead])
def list_users(
    admin: User = Depends(get_current_admin),
    session: Session = Depends(get_session),
):
    """Admin: list all users."""
    return session.exec(select(User)).all()


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: AdminUserCreate,
    admin: User = Depends(get_current_admin),
    session: Session = Depends(get_session),
):
    """Admin: create a new user."""
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
        is_active=payload.is_active,
        is_admin=payload.is_admin,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.patch("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    payload: AdminUserUpdate,
    admin: User = Depends(get_current_admin),
    session: Session = Depends(get_session),
):
    """Admin: update a user's profile and flags."""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    update_data = payload.model_dump(exclude_unset=True)
    if "email" in update_data:
        other = session.exec(
            select(User).where(and_(User.email == update_data["email"], User.id != user_id))
        ).first()
        if other:
            raise HTTPException(status_code=409, detail="Another user already has this email")
    for field, value in update_data.items():
        setattr(user, field, value)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    admin: User = Depends(get_current_admin),
    session: Session = Depends(get_session),
):
    """Admin: deactivate (soft-delete) a user."""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    session.add(user)
    session.commit()
