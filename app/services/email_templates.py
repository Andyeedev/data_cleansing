import os
from pathlib import Path
from typing import Dict

TEMPLATE_DIR = Path(__file__).parent.parent / "templates" / "email"

_TEMPLATE_CACHE: Dict[str, str] = {}


def load_template(name: str) -> str:
    if name in _TEMPLATE_CACHE:
        return _TEMPLATE_CACHE[name]

    template_path = TEMPLATE_DIR / f"{name}.html"
    if not template_path.exists():
        raise FileNotFoundError(f"Email template not found: {name}")

    with open(template_path, "r", encoding="utf-8") as f:
        content = f.read()

    _TEMPLATE_CACHE[name] = content
    return content


def render_template(name: str, context: Dict[str, str]) -> str:
    template = load_template(name)
    for key, value in context.items():
        template = template.replace(f"{{{{{key}}}}}", value)
    return template


def render_invitation(accept_url: str, first_name: str, tenant_name: str) -> str:
    return render_template("invitation", {
        "accept_url": accept_url,
        "first_name": first_name or "there",
        "tenant_name": tenant_name,
    })


def render_password_reset(reset_url: str, first_name: str) -> str:
    return render_template("password_reset", {
        "reset_url": reset_url,
        "first_name": first_name or "there",
    })


def render_verification(verify_url: str, first_name: str) -> str:
    return render_template("verification", {
        "verify_url": verify_url,
        "first_name": first_name or "there",
    })