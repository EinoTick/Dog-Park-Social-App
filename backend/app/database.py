"""
Database engine, session factory, and table-creation helper.

KEY CONCEPTS FOR FASTAPI NEWCOMERS:
------------------------------------
1. `create_engine` — one per app, reused everywhere.
   `connect_args={"check_same_thread": False}` is required for SQLite
   because FastAPI serves requests on multiple threads.

2. `get_session` — a *generator* dependency.  FastAPI calls `next()` on it
   to get a Session, then `.close()` it when the request finishes.
   We mark it with `Depends(get_session)` on route parameters.

3. `create_db_and_tables` — called once at startup (see main.py).
   SQLModel reads all imported model classes and issues CREATE TABLE IF NOT
   EXISTS for each one.
"""

from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},  # SQLite-specific
)


def create_db_and_tables() -> None:
    """Create all tables derived from SQLModel.metadata."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    FastAPI dependency that yields a DB session.

    Usage in a route:
        @router.get("/items")
        def read_items(session: Session = Depends(get_session)):
            ...
    """
    with Session(engine) as session:
        yield session
