# app/core/config.py

import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load .env ONCE
load_dotenv(BASE_DIR / ".env")

def get_env(key: str, required: bool = True):
    value = os.getenv(key)
    if required and not value:
        raise RuntimeError(f"Missing required environment variable: {key}")
    return value