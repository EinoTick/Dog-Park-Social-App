"""Pydantic schemas for DogPark API endpoints."""

from datetime import datetime

from pydantic import BaseModel


class ParkCreate(BaseModel):
    name: str
    address: str
    description: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class ParkUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    description: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class ParkRead(BaseModel):
    id: int
    name: str
    address: str
    description: str | None
    latitude: float | None
    longitude: float | None
    created_by_id: int
    created_at: datetime

    model_config = {"from_attributes": True}
