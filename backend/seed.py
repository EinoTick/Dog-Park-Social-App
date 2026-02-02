"""
Seed script — populates the database with sample data.

Run:  python seed.py
"""

from datetime import datetime, timedelta, timezone

from app.core.security import hash_password
from app.database import create_db_and_tables, engine
from app.models.dog import Dog
from app.models.park import DogPark
from app.models.user import User
from app.models.visit import Visit, VisitDogLink
from sqlmodel import Session

create_db_and_tables()

with Session(engine) as s:
    # --- Users ---
    alice = User(
        email="alice@example.com",
        username="alice",
        hashed_password=hash_password("password123"),
        full_name="Alice Johnson",
        is_admin=True,
    )
    bob = User(
        email="bob@example.com",
        username="bob",
        hashed_password=hash_password("password123"),
        full_name="Bob Smith",
    )
    carol = User(
        email="carol@example.com",
        username="carol",
        hashed_password=hash_password("password123"),
        full_name="Carol Davis",
    )
    s.add_all([alice, bob, carol])
    s.commit()
    s.refresh(alice)
    s.refresh(bob)
    s.refresh(carol)

    # --- Dogs ---
    buddy = Dog(name="Buddy", breed="Golden Retriever", size="large", good_with_others=True, personality_notes="Loves fetch and swimming", owner_id=alice.id)
    luna = Dog(name="Luna", breed="Border Collie", size="medium", good_with_others=True, personality_notes="Very energetic, loves to herd", owner_id=alice.id)
    max_ = Dog(name="Max", breed="German Shepherd", size="large", good_with_others=False, personality_notes="Needs space, warming up slowly", owner_id=bob.id)
    daisy = Dog(name="Daisy", breed="Beagle", size="medium", good_with_others=True, personality_notes="Friendly with everyone", owner_id=bob.id)
    rocky = Dog(name="Rocky", breed="French Bulldog", size="small", good_with_others=True, personality_notes="Playful and snorty", owner_id=carol.id)
    bella = Dog(name="Bella", breed="Labrador", size="large", good_with_others=True, personality_notes="Gentle giant, great with puppies", owner_id=carol.id)
    s.add_all([buddy, luna, max_, daisy, rocky, bella])
    s.commit()
    for d in [buddy, luna, max_, daisy, rocky, bella]:
        s.refresh(d)

    # --- Parks ---
    central = DogPark(name="Central Bark", address="100 Park Avenue", description="Large open field with shaded areas and water fountains", created_by_id=alice.id)
    riverside = DogPark(name="Riverside Dog Run", address="55 River Road", description="Fenced area along the river, separate small-dog section", created_by_id=bob.id)
    hilltop = DogPark(name="Hilltop Off-Leash Park", address="200 Summit Drive", description="Hilly terrain with trails, great for active dogs", created_by_id=carol.id)
    s.add_all([central, riverside, hilltop])
    s.commit()
    for p in [central, riverside, hilltop]:
        s.refresh(p)

    # --- Visits ---
    now = datetime.now(timezone.utc)

    v1 = Visit(start_time=now + timedelta(hours=2), end_time=now + timedelta(hours=4), notes="Morning walk with Buddy and Luna", user_id=alice.id, park_id=central.id)
    v2 = Visit(start_time=now + timedelta(hours=3), end_time=now + timedelta(hours=5), notes="Daisy needs socialization practice", user_id=bob.id, park_id=central.id)
    v3 = Visit(start_time=now + timedelta(hours=6), end_time=now + timedelta(hours=8), notes="Evening run", user_id=carol.id, park_id=riverside.id)
    v4 = Visit(start_time=now + timedelta(days=1, hours=1), end_time=now + timedelta(days=1, hours=3), notes="Weekend playdate", user_id=alice.id, park_id=hilltop.id)
    v5 = Visit(start_time=now + timedelta(days=1, hours=4), end_time=now + timedelta(days=1, hours=6), user_id=bob.id, park_id=riverside.id)
    s.add_all([v1, v2, v3, v4, v5])
    s.commit()
    for v in [v1, v2, v3, v4, v5]:
        s.refresh(v)

    # --- Visit ↔ Dog links ---
    s.add_all([
        VisitDogLink(visit_id=v1.id, dog_id=buddy.id),
        VisitDogLink(visit_id=v1.id, dog_id=luna.id),
        VisitDogLink(visit_id=v2.id, dog_id=daisy.id),
        VisitDogLink(visit_id=v3.id, dog_id=rocky.id),
        VisitDogLink(visit_id=v3.id, dog_id=bella.id),
        VisitDogLink(visit_id=v4.id, dog_id=buddy.id),
        VisitDogLink(visit_id=v5.id, dog_id=max_.id),
    ])
    s.commit()

    print("Seeded successfully!")
    print(f"  Users:  {alice.id}, {bob.id}, {carol.id}")
    print(f"  Dogs:   {buddy.id}, {luna.id}, {max_.id}, {daisy.id}, {rocky.id}, {bella.id}")
    print(f"  Parks:  {central.id}, {riverside.id}, {hilltop.id}")
    print(f"  Visits: {v1.id}, {v2.id}, {v3.id}, {v4.id}, {v5.id}")
