"""Application configuration loaded from environment variables."""
import os
from functools import lru_cache


class Settings:
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://switchguard:switchguard_secret@localhost:5432/switchguard",
    )
    JWT_SECRET: str = os.getenv("JWT_SECRET", "dev-secret-change-me")
    JWT_EXPIRY_MINUTES: int = int(os.getenv("JWT_EXPIRY_MINUTES", "60"))
    REVERSAL_AUTO_THRESHOLD_MWK: float = float(
        os.getenv("REVERSAL_AUTO_THRESHOLD_MWK", "100000")
    )

    # Africa's Talking
    AFRICASTALKING_USERNAME: str = os.getenv("AFRICASTALKING_USERNAME", "sandbox")
    AFRICASTALKING_API_KEY: str = os.getenv("AFRICASTALKING_API_KEY", "")
    AFRICASTALKING_SHORTCODE: str = os.getenv("AFRICASTALKING_SHORTCODE", "38446")

    # Velocity check
    MAX_REALISTIC_SPEED_KMH: float = 120.0


@lru_cache()
def get_settings() -> Settings:
    return Settings()
