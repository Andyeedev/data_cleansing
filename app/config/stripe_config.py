import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotdotenv(dotenv_path=env_path) if env_path.exists() else None
load_dotenv(dotenv_path=env_path) if env_path.exists() else None


def _get(key: str, default=None):
    val = os.getenv(key, default)
    if val is None:
        raise RuntimeError(f"CRITICAL: Missing environment variable {key}")
    return val


STRIPE_SECRET_KEY = _get("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = _get("STRIPE_PUBLISHABLE_KEY", "")
STRIPE_WEBHOOK_SECRET = _get("STRIPE_WEBHOOK_SECRET", "")
STRIPE_API_VERSION = "2025-08-27.basil"

STRIPE_PRICE_IDS = {
    "professional_monthly": _get("STRIPE_PRICE_PROFESSIONAL_MONTHLY", ""),
    "professional_annual": _get("STRIPE_PRICE_PROFESSIONAL_ANNUAL", ""),
    "enterprise_monthly": _get("STRIPE_PRICE_ENTERPRISE_MONTHLY", ""),
    "enterprise_annual": _get("STRIPE_PRICE_ENTERPRISE_ANNUAL", ""),
    "enterprise_plus_monthly": _get("STRIPE_PRICE_ENTERPRISE_PLUS_MONTHLY", ""),
    "enterprise_plus_annual": _get("STRIPE_PRICE_ENTERPRISE_PLUS_ANNUAL", ""),
}

TIER_MAP = {
    "professional": {
        "monthly": STRIPE_PRICE_IDS["professional_monthly"],
        "annual": STRIPE_PRICE_IDS["professional_annual"],
    },
    "enterprise": {
        "monthly": STRIPE_PRICE_IDS["enterprise_monthly"],
        "annual": STRIPE_PRICE_IDS["enterprise_annual"],
    },
    "enterprise_plus": {
        "monthly": STRIPE_PRICE_IDS["enterprise_plus_monthly"],
        "annual": STRIPE_PRICE_IDS["enterprise_plus_annual"],
    },
}
