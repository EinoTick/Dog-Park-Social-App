"""
Visit router — the core feature of the app.

Handles creating, reading, updating, and deleting park visits,
including managing the many-to-many relationship between visits and dogs.

Also includes the dashboard stats endpoint.
"""

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, col, func, select

from app.core.deps import get_current_user
from app.database import get_session
from app.models.dog import Dog
from app.models.park import DogPark
from app.models.user import User
from app.models.visit import Visit, VisitDogLink
from app.schemas.visit import DashboardStats, VisitCreate, VisitDetail, VisitRead, VisitUpdate

router = APIRouter()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _get_visit_or_404(visit_id: int, session: Session) -> Visit:
    visit = session.get(Visit, visit_id)
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    return visit


def _attach_dogs_to_visit(visit: Visit, dog_ids: list[int], user: User, session: Session) -> None:
    """Validate that all dog_ids belong to the user, then create link rows."""
    dogs = session.exec(select(Dog).where(col(Dog.id).in_(dog_ids))).all()
    if len(dogs) != len(dog_ids):
        raise HTTPException(status_code=400, detail="One or more dog IDs are invalid")

    for dog in dogs:
        if dog.owner_id != user.id:
            raise HTTPException(status_code=403, detail=f"Dog '{dog.name}' does not belong to you")
        session.add(VisitDogLink(visit_id=visit.id, dog_id=dog.id))


def _get_dogs_for_visit(visit_id: int, session: Session) -> list[Dog]:
    """Load all dogs linked to a visit."""
    stmt = (
        select(Dog)
        .join(VisitDogLink, Dog.id == VisitDogLink.dog_id)
        .where(VisitDogLink.visit_id == visit_id)
    )
    return list(session.exec(stmt).all())


def _enrich_visit(visit: Visit, session: Session) -> dict:
    """Build a VisitDetail-compatible dict with nested user, park, dogs."""
    dogs = _get_dogs_for_visit(visit.id, session)
    user = session.get(User, visit.user_id)
    park = session.get(DogPark, visit.park_id)
    return {
        **visit.model_dump(),
        "dogs": [d.model_dump() for d in dogs],
        "user": user.model_dump() if user else None,
        "park": park.model_dump() if park else None,
    }


# ---------------------------------------------------------------------------
# CRUD
# ---------------------------------------------------------------------------
@router.post("/", response_model=VisitRead, status_code=status.HTTP_201_CREATED)
def create_visit(
    payload: VisitCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Log a new visit to a park.

    The user selects a park, a time range, and which of their dogs are coming.
    """
    # Validate park exists
    park = session.get(DogPark, payload.park_id)
    if not park:
        raise HTTPException(status_code=404, detail="Park not found")

    if payload.end_time <= payload.start_time:
        raise HTTPException(status_code=400, detail="end_time must be after start_time")

    visit = Visit(
        start_time=payload.start_time,
        end_time=payload.end_time,
        notes=payload.notes,
        user_id=current_user.id,
        park_id=payload.park_id,
    )
    session.add(visit)
    session.commit()
    session.refresh(visit)

    # Attach dogs (many-to-many)
    _attach_dogs_to_visit(visit, payload.dog_ids, current_user, session)
    session.commit()

    dogs = _get_dogs_for_visit(visit.id, session)
    return {**visit.model_dump(), "dogs": [d.model_dump() for d in dogs]}


@router.get("/", response_model=list[VisitDetail])
def list_visits(
    park_id: int | None = Query(default=None, description="Filter by park"),
    upcoming: bool = Query(default=False, description="Only future visits"),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """List visits with optional park and time filters."""
    stmt = select(Visit)
    if park_id is not None:
        stmt = stmt.where(Visit.park_id == park_id)
    if upcoming:
        stmt = stmt.where(Visit.end_time >= datetime.now(timezone.utc))
    stmt = stmt.order_by(Visit.start_time)

    visits = session.exec(stmt).all()
    return [_enrich_visit(v, session) for v in visits]


@router.get("/my", response_model=list[VisitRead])
def list_my_visits(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """List the current user's visits."""
    visits = session.exec(
        select(Visit).where(Visit.user_id == current_user.id).order_by(Visit.start_time)
    ).all()
    result = []
    for v in visits:
        dogs = _get_dogs_for_visit(v.id, session)
        result.append({**v.model_dump(), "dogs": [d.model_dump() for d in dogs]})
    return result


@router.get("/upcoming-activity", response_model=list[VisitDetail])
def upcoming_activity(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Visits happening now or within the next 24 hours (for the dashboard)."""
    now = datetime.now(timezone.utc)
    cutoff = now + timedelta(hours=24)
    visits = session.exec(
        select(Visit)
        .where(Visit.end_time >= now, Visit.start_time <= cutoff)
        .order_by(Visit.start_time)
    ).all()
    return [_enrich_visit(v, session) for v in visits]


@router.get("/dashboard-stats", response_model=DashboardStats)
def dashboard_stats(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Aggregated stats for the dashboard page."""
    now = datetime.now(timezone.utc)

    # Count of user's upcoming visits
    upcoming_count = session.exec(
        select(func.count())
        .select_from(Visit)
        .where(Visit.user_id == current_user.id, Visit.end_time >= now)
    ).one()

    # Most popular park this week
    week_ago = now - timedelta(days=7)
    popular_row = session.exec(
        select(DogPark.name, func.count().label("cnt"))
        .join(Visit, Visit.park_id == DogPark.id)
        .where(Visit.start_time >= week_ago)
        .group_by(DogPark.name)
        .order_by(func.count().desc())
        .limit(1)
    ).first()

    return DashboardStats(
        upcoming_visit_count=upcoming_count,
        most_popular_park=popular_row[0] if popular_row else None,
        most_popular_park_visit_count=popular_row[1] if popular_row else 0,
    )


@router.get("/{visit_id}", response_model=VisitDetail)
def read_visit(
    visit_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Get a single visit with full details."""
    visit = _get_visit_or_404(visit_id, session)
    return _enrich_visit(visit, session)


@router.patch("/{visit_id}", response_model=VisitRead)
def update_visit(
    visit_id: int,
    payload: VisitUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Update a visit (owner or admin only)."""
    visit = _get_visit_or_404(visit_id, session)
    if visit.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = payload.model_dump(exclude_unset=True)
    dog_ids = update_data.pop("dog_ids", None)

    for field, value in update_data.items():
        setattr(visit, field, value)

    session.add(visit)
    session.commit()
    session.refresh(visit)

    # Replace dog links if new list provided
    if dog_ids is not None:
        # Remove existing links
        existing_links = session.exec(
            select(VisitDogLink).where(VisitDogLink.visit_id == visit.id)
        ).all()
        for link in existing_links:
            session.delete(link)
        session.commit()
        # Add new links
        _attach_dogs_to_visit(visit, dog_ids, current_user, session)
        session.commit()

    dogs = _get_dogs_for_visit(visit.id, session)
    return {**visit.model_dump(), "dogs": [d.model_dump() for d in dogs]}


@router.delete("/{visit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_visit(
    visit_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Delete a visit (owner or admin only)."""
    visit = _get_visit_or_404(visit_id, session)
    if visit.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Remove dog links first
    links = session.exec(select(VisitDogLink).where(VisitDogLink.visit_id == visit.id)).all()
    for link in links:
        session.delete(link)

    session.delete(visit)
    session.commit()
