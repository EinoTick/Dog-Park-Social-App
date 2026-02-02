"""
Application configuration loaded from environment variables.

Uses Pydantic BaseSettings so every field can be overridden by an env var
(e.g. SECRET_KEY=changeme uvicorn app.main:app).
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Dog Park Social"
    API_V1_PREFIX: str = "/api/v1"

    # --- Auth / JWT ---
    SECRET_KEY: str = "CHANGE-ME-in-production-use-openssl-rand-hex-32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # --- Database ---
    DATABASE_URL: str = "sqlite:///./dog_park.db"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
