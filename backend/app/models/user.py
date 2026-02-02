"""
User database model.

SQLModel + table=True  =  SQLAlchemy Table  +  Pydantic validation combined.
The `hashed_password` is stored in the DB but excluded from default
serialisation (we never want to accidentally send it to the frontend).
"""

from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    username: str = Field(unique=True, index=True, max_length=100)
    hashed_password: str
    full_name: str | None = Field(default=None, max_length=200)

    is_active: bool = Field(default=True)
    is_admin: bool = Field(default=False)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
