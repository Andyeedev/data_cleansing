# OC-SEC-001A — Public Lead Endpoint Security Assessment
**WORK PACKAGE:** OC-SEC-001A | **ID:** OC-SEC-001A | **DATE:** 2026-09-06 | **MAP VERSION:** MAP_V3 (from MAP_V2_FINAL_BASELINE d5f42b86)
**PARENT:** Split from OC-SEC-003 (lead data security)
**OBJECTIVE:** Establish exactly what `GET /api/v1/leads` exposes from an unauthenticated external request.

---

## 1. Actual Endpoint Behaviour

**File:** `app/api/routes/lead_routes.py` (34 lines total)

```python
@router.get("")
@router.get("/")
def list_leads():
    from app.db.connection import get_db_connection
    db = get_db_connection()
    rows = db.execute("SELECT lead_id, full_name, work_email, company, industry, role, challenge, source_form, created_at FROM core.leads ORDER BY created_at DESC LIMIT 50")
    return {"success": True, "data": [{"lead_id": str(r[0]), "full_name": r[1], "work_email": r[2], "company": r[3], "industry": r[4], "role": r[5], "challenge": r[6], "source_form": r[7], "created_at": str(r[8])} for r in rows]}
```

**Behaviour:**
* Accepts `GET /api/v1/leads` or `GET /api/v1/leads/`
* Queries `core.leads` table directly
* Returns up to 50 most recent leads
* Ordered by `created_at DESC`
* No authentication required
* No authorization required
* No rate limiting applied
* No tenant filtering
* No input parameters accepted

---

## 2. Can Lead Records Be Retrieved Anonymously?

**YES.** Any HTTP client can retrieve lead records without any authentication.

**Evidence:**
* `def list_leads():` — no `Request` parameter, no `Depends()`, no auth dependency
* No `@limiter` decorator — no rate limiting
* No `Depends(get_current_user)` or similar auth check
* Router registered at `app.include_router(lead_routes.router)` without any middleware prefix
* CORS middleware allows `localhost:5173`, `localhost:3000`, `localhost:8080`, `127.0.0.1:8080`, `localhost:5500` — but CORS does NOT block non-browser clients (curl, Postman, scripts)

**External request example:**
```bash
curl https://<backend-host>/api/v1/leads
```

**No authentication header required. No token. No session. No cookie.**

---

## 3. Example Response Structure (Data Redacted)

```json
{
  "success": true,
  "data": [
    {
      "lead_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "full_name": "[REDACTED]",
      "work_email": "[REDACTED]@example.com",
      "company": "[REDACTED] Ltd",
      "industry": "Financial Services",
      "role": "CTO",
      "challenge": "Data quality",
      "source_form": "get_started",
      "created_at": "2026-09-06T12:00:00+00:00"
    },
    {
      "lead_id": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
      "full_name": "[REDACTED]",
      "work_email": "[REDACTED]@example.org",
      "company": "[REDACTED] Inc",
      "industry": "Insurance",
      "role": "Head of Data",
      "challenge": "Migration risk",
      "source_form": "request_demo",
      "created_at": "2026-09-06T11:30:00+00:00"
    }
  ]
}
```

**Fields returned (9 columns):**

| Field | Sensitivity | Notes |
|---|---|---|
| `lead_id` | LOW | UUID, not personally identifiable |
| `full_name` | **HIGH** | Personal name — GDPR personal data |
| `work_email` | **HIGH** | Email address — GDPR personal data |
| `company` | MEDIUM | Business name |
| `industry` | LOW | Category |
| `role` | MEDIUM | Job title — may identify individual |
| `challenge` | LOW | Business need |
| `source_form` | LOW | Form attribution |
| `created_at` | LOW | Timestamp |

**Fields in database but NOT returned (3 columns):**

| Field | Sensitivity | Notes |
|---|---|---|
| `work_email_hash` | N/A | Redundant (same as work_email) |
| `org_size` | LOW | Not in SELECT |
| `message` | **HIGH** | Free-text message — not returned |
| `utm_source` | LOW | Not in SELECT |
| `referrer` | LOW | Not in SELECT |

**Note:** Even though `message`, `org_size`, `utm_source`, and `referrer` are not in the SELECT, the endpoint still returns **full_name** and **work_email** — both are GDPR personal data.

---

## 4. Where the Endpoint is Implemented

| Component | File | Line |
|---|---|---|
| Route handler | `app/api/routes/lead_routes.py` | 28-34 |
| Router prefix | `app/api/routes/lead_routes.py` | 6 |
| Route registration | `app/api/main.py` | 211 |
| Database query | `app/api/routes/lead_routes.py` | 33 (inline SQL) |
| Database connection | `app/db/connection.py` | `get_db_connection()` |

---

## 5. What Else Calls It

**Nothing.**

| Caller | Found | Detail |
|---|---|---|
| Frontend (TypeScript) | NO | No `useLeads.ts`, no `/leads` fetch in any `.ts`/`.tsx` file |
| Backend services | NO | No Python code calls `list_leads()` or `GET /api/v1/leads` |
| Tests | NO | No test file references this endpoint |
| Documentation | NO | No Swagger/OpenAPI annotation beyond auto-generated |
| Dashboard | NO | No dashboard service queries leads |

**The endpoint exists but is never called by any code in the repository.**

---

## 6. Authentication/Authorisation Options

### Option A: Require Admin Authentication (Recommended)
```python
from app.api.core.auth import get_current_user  # existing auth dependency

@router.get("")
@router.get("/")
def list_leads(current_user = Depends(get_current_user)):
    # Check if user has admin role
    if current_user.role not in ["super_admin", "tenant_admin"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    ...
```
**Pros:** Only authenticated admins can view leads. Uses existing auth infrastructure.
**Cons:** Requires login to view leads (may be intentional).

### Option B: API Key Authentication
```python
@router.get("")
@router.get("/")
def list_leads(request: Request):
    api_key = request.headers.get("X-API-Key")
    if api_key != os.getenv("LEADS_API_KEY"):
        raise HTTPException(status_code=401, detail="Invalid API key")
    ...
```
**Pros:** Simple, no user account needed. Good for internal tools.
**Cons:** API key must be managed securely.

### Option C: Remove Endpoint Entirely
```python
# Delete the GET handler entirely
# Keep only POST for lead creation
```
**Pros:** Simplest fix. No data exposed.
**Cons:** No way to list leads via API (must query database directly).

### Option D: IP Allowlist
```python
ALLOWED_IPS = ["127.0.0.1", "::1"]  # localhost only

@router.get("")
@router.get("/")
def list_leads(request: Request):
    client_ip = request.client.host
    if client_ip not in ALLOWED_IPS:
        raise HTTPException(status_code=403, detail="Access denied")
    ...
```
**Pros:** Restricts to local development only.
**Cons:** Breaks if backend is behind a proxy (sees proxy IP).

### Option E: Rate Limit + Auth
```python
@router.get("")
@router.get("/")
@limiter.limit("5/minute")
def list_leads(current_user = Depends(get_current_user)):
    ...
```
**Pros:** Defence in depth — auth + rate limit.
**Cons:** More complex.

---

## 7. Recommended Fix

**Option A: Require Admin Authentication** — recommended because:
1. Lead data is GDPR-sensitive (full_name, work_email)
2. The endpoint is never called by any code in the repository
3. No legitimate use case for anonymous lead listing
4. Uses existing auth infrastructure (`get_current_user`)
5. Simplest to implement with existing codebase patterns

**Implementation:**
```python
from fastapi import Depends, HTTPException
from app.api.core.auth import get_current_user

@router.get("")
@router.get("/")
def list_leads(current_user = Depends(get_current_user)):
    if current_user.get("role") not in ("super_admin", "tenant_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    from app.db.connection import get_db_connection
    db = get_db_connection()
    rows = db.execute("SELECT lead_id, full_name, work_email, company, industry, role, challenge, source_form, created_at FROM core.leads ORDER BY created_at DESC LIMIT 50")
    return {"success": True, "data": [...]}
```

---

## 8. Tests

### Test 1: Unauthenticated Request Returns 401/403
```python
def test_list_leads_no_auth():
    response = client.get("/api/v1/leads")
    assert response.status_code in (401, 403)
```

### Test 2: Authenticated Non-Admin Returns 403
```python
def test_list_leads_non_admin():
    token = get_auth_token(role="team_member")
    response = client.get("/api/v1/leads", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403
```

### Test 3: Authenticated Admin Returns 200
```python
def test_list_leads_admin():
    token = get_auth_token(role="super_admin")
    response = client.get("/api/v1/leads", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["success"] is True
```

### Test 4: Response Structure Correct
```python
def test_list_leads_structure():
    token = get_auth_token(role="super_admin")
    response = client.get("/api/v1/leads", headers={"Authorization": f"Bearer {token}"})
    data = response.json()["data"]
    assert isinstance(data, list)
    if len(data) > 0:
        assert "lead_id" in data[0]
        assert "full_name" in data[0]
        assert "work_email" in data[0]
```

### Test 5: Rate Limiting (if applied)
```python
def test_list_leads_rate_limit():
    token = get_auth_token(role="super_admin")
    for i in range(6):
        response = client.get("/api/v1/leads", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 429
```

---

## 9. Backward-Compatibility Impact

| Impact | Detail |
|---|---|
| Frontend | **NONE** — no frontend code calls `GET /api/v1/leads` |
| Backend services | **NONE** — no Python code calls this endpoint |
| Tests | **NONE** — no tests reference this endpoint |
| External integrations | **UNKNOWN** — no evidence of external callers, but cannot guarantee |
| Swagger UI | **MINOR** — endpoint will show "Lock" icon (requires auth) in Swagger |

**Risk: LOW.** The endpoint is unused in the codebase. Adding authentication may break external integrations if any exist (no evidence found).

---

## 10. Exact Files / Database Changes

| File | Change | Type |
|---|---|---|
| `app/api/routes/lead_routes.py` | Add `Depends(get_current_user)` to `list_leads`, add role check | Modified |
| `app/api/routes/lead_routes.py` | Add `from fastapi import Depends, HTTPException` import | Modified |
| `tests/test_lead_routes.py` | **NEW** — 5 tests for authentication + authorization | New file |

**Database changes:** NONE — no schema changes required.

---

## 11. Rollback Plan

**Rollback:** Remove `Depends(get_current_user)` and role check from `list_leads` function.

**Risk:** LOW — additive change, removal restores original unauthenticated state.

**Steps:**
1. Revert `app/api/routes/lead_routes.py` to previous version
2. Remove `tests/test_lead_routes.py`
3. Redeploy

**Evidence:** Git commit history shows original unauthenticated handler.

---

**CRITICAL: No implementation until explicitly approved.**
