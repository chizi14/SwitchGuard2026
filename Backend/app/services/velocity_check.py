"""Velocity-based fraud detection engine.

On every new transaction, compares against the customer's last known location.
If distance / time > MAX_REALISTIC_SPEED_KMH → flag as security alert.

Uses real Malawian city coordinates:
  Blantyre:  [-15.7861, 35.0058]
  Lilongwe:  [-13.9626, 33.7741]
  Mzuzu:     [-11.4587, 34.0151]
"""

import math
from dataclasses import dataclass

from app.core.config import get_settings

settings = get_settings()

# Malawian city coordinates
CITY_COORDS = {
    "Blantyre": (-15.7861, 35.0058),
    "Lilongwe": (-13.9626, 33.7741),
    "Mzuzu": (-11.4587, 34.0151),
}


@dataclass
class VelocityCheckResult:
    flagged: bool
    distance_km: float = 0.0
    minutes_apart: int = 0
    required_speed_kmh: float = 0.0
    risk_score: int = 0
    reason: str = ""


def haversine_km(
    lat1: float, lon1: float, lat2: float, lon2: float
) -> float:
    """Calculate the great-circle distance between two points in km."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def get_city_coords(city: str) -> tuple[float, float] | None:
    """Get coordinates for a Malawian city by name (case-insensitive)."""
    for name, coords in CITY_COORDS.items():
        if name.lower() in city.lower():
            return coords
    return None


def compute_risk_score(
    distance_km: float,
    minutes_apart: int,
    required_speed_kmh: float,
) -> int:
    """Compute a risk score 0-100 based on velocity anomaly severity."""
    if minutes_apart <= 0 or distance_km <= 0:
        return 0

    speed_ratio = required_speed_kmh / settings.MAX_REALISTIC_SPEED_KMH

    if speed_ratio <= 1.0:
        return 0
    if speed_ratio <= 1.5:
        return min(50, int((speed_ratio - 1.0) * 100))
    if speed_ratio <= 3.0:
        return 50 + int((speed_ratio - 1.5) / 1.5 * 30)
    return min(100, 80 + int((speed_ratio - 3.0) * 10))


def run_velocity_check(
    current_city: str,
    previous_city: str,
    current_time,
    previous_time,
) -> VelocityCheckResult:
    """Check if travel between two transaction cities is physically possible."""

    current_coords = get_city_coords(current_city)
    prev_coords = get_city_coords(previous_city)

    # Same city — no velocity issue
    if current_city.lower() == previous_city.lower():
        return VelocityCheckResult(flagged=False)

    if not current_coords or not prev_coords:
        # Unknown city — can't compute distance, flag as low confidence
        return VelocityCheckResult(
            flagged=True,
            distance_km=0,
            minutes_apart=0,
            required_speed_kmh=0,
            risk_score=30,
            reason=f"Unknown city coordinates for velocity check ({current_city} vs {previous_city}).",
        )

    distance_km = haversine_km(*prev_coords, *current_coords)
    time_delta = current_time - previous_time
    minutes_apart = max(1, int(time_delta.total_seconds() / 60))
    required_speed_kmh = (distance_km / minutes_apart) * 60

    if required_speed_kmh <= settings.MAX_REALISTIC_SPEED_KMH:
        return VelocityCheckResult(
            flagged=False,
            distance_km=distance_km,
            minutes_apart=minutes_apart,
            required_speed_kmh=required_speed_kmh,
        )

    risk_score = compute_risk_score(distance_km, minutes_apart, required_speed_kmh)
    speed_multiple = round(required_speed_kmh / settings.MAX_REALISTIC_SPEED_KMH)

    return VelocityCheckResult(
        flagged=True,
        distance_km=distance_km,
        minutes_apart=minutes_apart,
        required_speed_kmh=required_speed_kmh,
        risk_score=risk_score,
        reason=(
            f"Two withdrawals detected in different cities {minutes_apart} minutes apart. "
            f"This distance ({distance_km:.0f} km) is physically impossible to travel in that time "
            f"(requires ~{required_speed_kmh:.0f} km/h, {speed_multiple}× faster than the "
            f"fastest realistic road speed of {settings.MAX_REALISTIC_SPEED_KMH:.0f} km/h)."
        ),
    )
