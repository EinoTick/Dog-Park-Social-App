"""
Application entry point.

Run with:  uvicorn app.main:app --reload

STRUCTURE OVERVIEW (for FastAPI newcomers):
-------------------------------------------
FastAPI apps are assembled by:
  1. Creating an `app = FastAPI(...)` instance.
  2. Adding middleware (CORS, etc.).
  3. Including *routers* — each router is a mini-app that owns a group of
     related endpoints (e.g. /auth, /dogs, /parks).
  4. Registering startup events (here: creating DB tables).

Each router lives in its own file under `routers/` and is attached with
`app.include_router(router, prefix=..., tags=[...])`.
Tags control grouping in the auto-generated Swagger docs at /docs.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database import create_db_and_tables
from app.routers import auth, dogs, parks, users, visits


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Runs once at startup (before yield) and once at shutdown (after yield)."""
    create_db_and_tables()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
)

# ---------------------------------------------------------------------------
# CORS — allow the Vite dev server (localhost:5173) to call the API
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
api = settings.API_V1_PREFIX

app.include_router(auth.router,   prefix=f"{api}/auth",   tags=["Auth"])
app.include_router(users.router,  prefix=f"{api}/users",  tags=["Users"])
app.include_router(dogs.router,   prefix=f"{api}/dogs",   tags=["Dogs"])
app.include_router(parks.router,  prefix=f"{api}/parks",  tags=["Parks"])
app.include_router(visits.router, prefix=f"{api}/visits", tags=["Visits"])


@app.get("/health")
def health_check():
    return {"status": "ok"}
