"""Pydantic schemas for Visit API endpoints."""

from datetime import datetime

from pydantic import BaseModel

from app.schemas.dog import DogRead
from app.schemas.park import ParkRead
from app.schemas.user import UserPublic


class VisitCreate(BaseModel):
    park_id: int
    start_time: datetime
    end_time: datetime
    dog_ids: list[int]  # which of the user's dogs are coming
    notes: str | None = None


class VisitUpdate(BaseModel):
    start_time: datetime | None = None
    end_time: datetime | None = None
    dog_ids: list[int] | None = None
    notes: str | None = None


class VisitRead(BaseModel):
    id: int
    start_time: datetime
    end_time: datetime
    notes: str | None
    user_id: int
    park_id: int
    created_at: datetime
    dogs: list[DogRead] = []

    model_config = {"from_attributes": True}


class VisitDetail(VisitRead):
    """Extended view with nested user and park info."""

    user: UserPublic
    park: ParkRead


class DashboardStats(BaseModel):
    upcoming_visit_count: int
    most_popular_park: str | None
    most_popular_park_visit_count: int
