"""
Visit database model + the Visit ↔ Dog many-to-many link table.

RELATIONSHIP PATTERN:
---------------------
Visit belongs to one User and one DogPark.
Visit can include *many* Dogs (via the `visit_dogs` link table).

In SQLModel, link tables are defined as classes with `table=True`,
two foreign-key columns, and no extra fields.  SQLModel's
`Relationship(link_model=...)` then handles the join automatically
when you load related objects.

We keep the link table in this same file since it's tightly coupled
to Visit.
"""

from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class VisitDogLink(SQLModel, table=True):
    """Many-to-many link between visits and dogs."""

    __tablename__ = "visit_dogs"

    visit_id: int = Field(foreign_key="visits.id", primary_key=True)
    dog_id: int = Field(foreign_key="dogs.id", primary_key=True)


class Visit(SQLModel, table=True):
    __tablename__ = "visits"

    id: int | None = Field(default=None, primary_key=True)
    start_time: datetime
    end_time: datetime
    notes: str | None = Field(default=None)

    user_id: int = Field(foreign_key="users.id", index=True)
    park_id: int = Field(foreign_key="dog_parks.id", index=True)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
