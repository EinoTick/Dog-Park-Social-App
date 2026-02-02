"""
Dog CRUD router.

Demonstrates:
- Ownership checks — a user can only edit/delete their own dogs.
- Admin override — admins can modify any dog.
- `response_model=list[DogRead]` — FastAPI serialises the response
  through the Pydantic schema, stripping any fields not in `DogRead`.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.deps import get_current_user
from app.database import get_session
from app.models.dog import Dog
from app.models.user import User
from app.schemas.dog import DogCreate, DogRead, DogUpdate

router = APIRouter()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _get_dog_or_404(dog_id: int, session: Session) -> Dog:
    dog = session.get(Dog, dog_id)
    if not dog:
        raise HTTPException(status_code=404, detail="Dog not found")
    return dog


def _check_ownership(dog: Dog, user: User) -> None:
    if dog.owner_id != user.id and not user.is_admin:
        raise HTTPException(status_code=403, detail="Not your dog")


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@router.get("/", response_model=list[DogRead])
def list_my_dogs(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """List all dogs belonging to the current user."""
    return session.exec(select(Dog).where(Dog.owner_id == current_user.id)).all()


@router.post("/", response_model=DogRead, status_code=status.HTTP_201_CREATED)
def create_dog(
    payload: DogCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Register a new dog under the current user."""
    dog = Dog(**payload.model_dump(), owner_id=current_user.id)
    session.add(dog)
    session.commit()
    session.refresh(dog)
    return dog


@router.get("/{dog_id}", response_model=DogRead)
def read_dog(
    dog_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Read any dog's public info (all authenticated users can view)."""
    return _get_dog_or_404(dog_id, session)


@router.patch("/{dog_id}", response_model=DogRead)
def update_dog(
    dog_id: int,
    payload: DogUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Update a dog (owner or admin only)."""
    dog = _get_dog_or_404(dog_id, session)
    _check_ownership(dog, current_user)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(dog, field, value)

    session.add(dog)
    session.commit()
    session.refresh(dog)
    return dog


@router.delete("/{dog_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dog(
    dog_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Delete a dog (owner or admin only)."""
    dog = _get_dog_or_404(dog_id, session)
    _check_ownership(dog, current_user)
    session.delete(dog)
    session.commit()
