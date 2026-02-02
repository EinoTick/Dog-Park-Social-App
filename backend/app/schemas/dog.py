"""Pydantic schemas for Dog API endpoints."""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class DogSize(str, Enum):
    small = "small"
    medium = "medium"
    large = "large"


class DogCreate(BaseModel):
    name: str
    breed: str = "Mixed"
    size: DogSize = DogSize.medium
    good_with_others: bool = True
    personality_notes: str | None = None
    photo_url: str | None = None


class DogUpdate(BaseModel):
    name: str | None = None
    breed: str | None = None
    size: DogSize | None = None
    good_with_others: bool | None = None
    personality_notes: str | None = None
    photo_url: str | None = None


class DogRead(BaseModel):
    id: int
    name: str
    breed: str
    size: str
    good_with_others: bool
    personality_notes: str | None
    photo_url: str | None
    owner_id: int
    created_at: datetime

    model_config = {"from_attributes": True}
