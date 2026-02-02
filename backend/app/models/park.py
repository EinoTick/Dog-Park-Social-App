"""
DogPark database model.

Parks are shared resources — any authenticated user can create one,
and all users can read them.  Admins can edit/delete any park.
"""

from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class DogPark(SQLModel, table=True):
    __tablename__ = "dog_parks"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=200, index=True)
    address: str = Field(max_length=300)
    description: str | None = Field(default=None)
    latitude: float | None = Field(default=None)
    longitude: float | None = Field(default=None)

    created_by_id: int = Field(foreign_key="users.id")

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
