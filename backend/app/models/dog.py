"""
Dog database model.

Each Dog belongs to exactly one User (owner_id foreign key).
The `size` field uses a plain string constrained to known values
via the Pydantic schema layer (see schemas/dog.py).
"""

from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class Dog(SQLModel, table=True):
    __tablename__ = "dogs"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=100)
    breed: str = Field(default="Mixed", max_length=100)
    size: str = Field(default="medium")  # small, medium, large
    good_with_others: bool = Field(default=True)
    personality_notes: str | None = Field(default=None)
    photo_url: str | None = Field(default=None)

    owner_id: int = Field(foreign_key="users.id", index=True)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
