import yaml
from pathlib import Path

# =========================
# FIXED BASE DIRECTORY
# =========================
BASE_DIR = Path(__file__).resolve().parents[3]  # goes to project root

CONFIG_PATH = BASE_DIR / "config.yaml"


def load_config():
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(f"Config file not found at: {CONFIG_PATH}")

    with open(CONFIG_PATH, "r") as f:
        return yaml.safe_load(f)


CONFIG = load_config()