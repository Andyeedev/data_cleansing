# Phase 2 bypass verification — direct endpoint test with real DB
# Only for checking whether the backend responds to the actual JWT login
# and project list, not for changing architecture.
import requests

session = requests.Session()

# DEV-003/DEV-001: login with cookie-based auth (the fixed endpoint)
login_resp = session.post(
    "http://localhost:8000/api/v1/auth/login",
    json={"username": "admin@mapnexus.com", "password": "Admin123456"},
    timeout=10
)
print("LOGIN status:", login_resp.status_code)
print("LOGIN cookie set?", "access_token" in session.cookies)

if login_resp.status_code == 200 and "access_token" in session.cookies:
    # Fetch first with cookie (DEV-003: JWT cookie authoritative)
    proj_resp = session.get("http://localhost:8000/api/v1/migration/projects?limit=10", timeout=10)
    print("PROJECTS (cookie) status:", proj_resp.status_code)
    try:
        data = proj_resp.json()
        print("PROJECTS data keys:", list(data.get("data", {}).keys())[:6] if isinstance(data.get("data"), dict) else type(data.get("data")))
    except Exception:
        print("PROJECTS body:", proj_resp.text[:200])

    # Check if /me returns structure (DEV-003)
    me_resp = session.get("http://localhost:8000/api/v1/auth/me", timeout=10)
    print("/me status:", me_resp.status_code)
    try:
        print("/me has tenant_id:", me_resp.json().get("tenant_id") is not None)
    except Exception:
        pass
else:
    print("LOGIN failed — checking error body:")
    try:
        print(login_resp.text[:300])
    except Exception:
        pass
