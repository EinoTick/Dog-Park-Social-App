"""
Import all models here so SQLModel.metadata knows about every table
when `create_db_and_tables()` runs in main.py.
"""

from app.models.dog import Dog  # noqa: F401
from app.models.park import DogPark  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.visit import Visit, VisitDogLink  # noqa: F401
