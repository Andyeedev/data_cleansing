from app.config_loader import load_config
from pathlib import Path

# =========================
# FIXED BASE DIRECTORY
# =========================
BASE_DIR = Path(__file__).resolve().parents[3]  # goes to project root

CONFIG_PATH = BASE_DIR / "config.yaml"

CONFIG = load_config(str(CONFIG_PATH))
