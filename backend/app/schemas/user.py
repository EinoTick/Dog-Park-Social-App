"""
Pydantic schemas for User-related API requests and responses.

WHY SEPARATE SCHEMAS FROM MODELS?
----------------------------------
Even though SQLModel *can* serve as both, it's best practice to have
dedicated request/response schemas because:

1. The DB model has `hashed_password` — you never want that in a response.
2. Create requests need a plain `password` field — which doesn't exist on the DB model.
3. Update requests make most fields optional.
4. Response schemas can include computed/joined data (e.g. dog count).

This separation gives you full control over what goes in and out of your API.
"""

from datetime import datetime

from pydantic import BaseModel, EmailStr


# ---------------------------------------------------------------------------
# Requests
# ---------------------------------------------------------------------------
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str | None = None


class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


# ---------------------------------------------------------------------------
# Responses
# ---------------------------------------------------------------------------
class UserRead(BaseModel):
    id: int
    email: str
    username: str
    full_name: str | None
    is_active: bool
    is_admin: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserPublic(BaseModel):
    """Minimal info shown to other users (e.g. 'who is visiting')."""

    id: int
    username: str
    full_name: str | None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
