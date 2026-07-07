import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
env_path = Path(__file__).resolve().parents[4] / ".env"
load_dotenv(dotenv_path=env_path)

def get_secret(key: str):
    val = os.getenv(key)
    if not val:
        raise RuntimeError(f"CRITICAL SECURITY ERROR: Missing required environment variable {key}")
    return val

SECRET_KEY = get_secret("JWT_SECRET_KEY")
ALGORITHM = "HS256"
