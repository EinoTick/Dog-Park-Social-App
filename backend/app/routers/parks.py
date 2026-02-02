"""
DogPark CRUD router.

Any authenticated user can create a park and all users can read parks.
Only admins (or the creator) can update/delete a park.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.deps import get_current_user
from app.database import get_session
from app.models.park import DogPark
from app.models.user import User
from app.schemas.park import ParkCreate, ParkRead, ParkUpdate

router = APIRouter()


@router.get("/", response_model=list[ParkRead])
def list_parks(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """List all dog parks."""
    return session.exec(select(DogPark)).all()


@router.post("/", response_model=ParkRead, status_code=status.HTTP_201_CREATED)
def create_park(
    payload: ParkCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Create a new dog park."""
    park = DogPark(**payload.model_dump(), created_by_id=current_user.id)
    session.add(park)
    session.commit()
    session.refresh(park)
    return park


@router.get("/{park_id}", response_model=ParkRead)
def read_park(
    park_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Read a single park's details."""
    park = session.get(DogPark, park_id)
    if not park:
        raise HTTPException(status_code=404, detail="Park not found")
    return park


@router.patch("/{park_id}", response_model=ParkRead)
def update_park(
    park_id: int,
    payload: ParkUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Update a park (creator or admin only)."""
    park = session.get(DogPark, park_id)
    if not park:
        raise HTTPException(status_code=404, detail="Park not found")
    if park.created_by_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(park, field, value)

    session.add(park)
    session.commit()
    session.refresh(park)
    return park


@router.delete("/{park_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_park(
    park_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Delete a park (creator or admin only)."""
    park = session.get(DogPark, park_id)
    if not park:
        raise HTTPException(status_code=404, detail="Park not found")
    if park.created_by_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    session.delete(park)
    session.commit()
