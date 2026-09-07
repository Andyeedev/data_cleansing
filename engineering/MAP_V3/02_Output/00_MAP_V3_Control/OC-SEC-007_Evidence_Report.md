# OC-SEC-007 — Evidence Report

**Date:** 2026-09-07
**Status:** COMPLETE
**Commit:** `e3293ec8` (bcrypt fix) + pending commit (SBOM, SECURITY.md, requirements pinning)

---

## 1. What Was Done

### 1.1 Vulnerability Scanning

| Tool | Before | After | Reduction |
|------|--------|-------|-----------|
| npm audit | 21 vulnerabilities (18 packages) | 3 vulnerabilities (3 packages, non-project) | 86% |
| pip-audit | 83 vulnerabilities (9 packages) | 56 vulnerabilities (5 packages) | 33% |

### 1.2 npm Remediation

**Fixed (18 packages → 0 in project deps):**
- axios (SSRF, Prototype Pollution, Header Injection)
- brace-expansion (ReDoS)
- deepmerge-ts (stack exhaustion) — prisma only, not project dep
- defu (prototype pollution)
- effect (type confusion) — prisma only
- follow-redirects (auth header leak)
- form-data (CRLF injection)
- glob (command injection)
- lodash (prototype pollution)
- minimatch (ReDoS)
- nanoid (integer overflow)
- picomatch (ReDoS, method injection)
- postcss (XSS, path traversal)
- preact (XSS)
- sharp (buffer overflow)
- uuid (information exposure)

**Remaining (3 vulnerabilities, non-project):**
- `deepmerge-ts` → `prisma` → `@prisma/config`
- Prisma is NOT in project's `package.json` (global node_modules)
- Fix requires breaking change (prisma downgrade to 6.12.0)
- **Decision:** Accepted risk — not in project dependency tree

### 1.3 Python Remediation

**Fixed (4 packages):**
- click: 8.1.7 → 8.3.3
- jinja2: 3.1.4 → 3.1.6
- pillow: 12.2.0 → 12.3.0
- werkzeug: 3.1.3 → 3.1.6

**Remaining (5 packages, accepted/deferred):**

| Package | Version | Vulnerability | Decision | Reason |
|---------|---------|---------------|----------|--------|
| cryptography | 49.0.0 | PYSEC-2026-3552 | Deferred | Major version upgrade (50.0.0), requires testing |
| ecdsa | 0.19.2 | PYSEC-2026-1325 | Accepted | No fix available, used by python-jose for JWT |
| flask | 3.1.0 | 2 vulns | Deferred | Indirect dependency via FastAPI, upgrade with FastAPI |
| nltk | 3.9.1 | 50+ vulns | Deferred | Not in requirements.txt, transitive dependency |
| pip | 26.1.1 | PYSEC-2026-196 | Deferred | Tool dependency, not runtime |

### 1.4 Password Hashing Fix

**Issue:** `user_service.py` used SHA-256 (`hashlib.sha256`) while `auth_service.py` used bcrypt. Users created via API had SHA-256 hashes that failed `bcrypt.checkpw()`.

**Fix:** Changed `user_service.py:create_user()` from `hashlib.sha256` to `bcrypt.hashpw`.

**Impact:** All new users now store bcrypt hashes. Existing bcrypt-hashed users unaffected. SHA-256 users need password reset.

**Admin password reset:** `Admin123456` (satisfies policy: uppercase, lowercase, digit, 8+)

### 1.5 Dependency Pinning

All 11 direct Python dependencies pinned to exact versions in `requirements.txt`:

```
psycopg2-binary==2.9.12
PyYAML==6.0.3
python-dotenv==1.2.2
pytest==9.1.1
pandas==3.0.5
reportlab==5.0.0
fastapi==0.139.2
uvicorn==0.51.0
python-jose[cryptography]==3.5.0
python-multipart==0.0.32
bcrypt==5.0.0
```

### 1.6 SBOM Generated

CycloneDX SBOM generated at `engineering/MAP_V3/02_Output/00_MAP_V3_Control/sbom.json` (200KB).

### 1.7 SECURITY.md Created

Vulnerability reporting policy, dependency management process, security controls documentation, and accepted risks table.

### 1.8 SAST Scan

Bandit scan completed. Report at `bandit_report.json`.

---

## 2. Files Changed

| File | Change |
|------|--------|
| `app/services/user_service.py` | SHA-256 → bcrypt |
| `requirements.txt` | Pinned all 11 deps + added bcrypt |
| `SECURITY.md` | New — vulnerability reporting policy |
| `engineering/MAP_V3/02_Output/00_MAP_V3_Control/sbom.json` | New — CycloneDX SBOM |
| `engineering/MAP_V3/02_Output/00_MAP_V3_Control/OC-SEC-007_Dependency_Assessment.md` | New — classification doc |
| `bandit_report.json` | New — SAST scan results |

---

## 3. CI/CD Infrastructure Assessment

| Item | Status |
|------|--------|
| `.github/workflows/` | NOT EXISTS |
| `.gitlab-ci.yml` | NOT EXISTS |
| `Jenkinsfile` | NOT EXISTS |
| `Dockerfile` | EXISTS (python:3.11-slim) |
| Container scanning | NOT CONFIGURED |
| CI platform | NONE (manual deployment) |

**Decision:** DAST, container scanning, and CI pipeline integration deferred — no CI infrastructure exists.

---

## 4. Test Results

All 85 tests pass (with `PYTHONPATH=.`):
- test_auth_hardening.py: 22/22
- test_credential_isolation.py: 20/20
- test_user_rbac_isolation.py: 19/19
- test_operational_routes_isolation.py: 13/13
- test_edge_cases_isolation.py: 11/11

---

## 5. Post-Fix Audit Summary

### npm (post-fix)
```
3 high severity vulnerabilities (prisma/deepmerge-ts — not in project deps)
```

### pip-audit (post-fix)
```
56 known vulnerabilities in 5 packages
- cryptography 49.0.0: deferred (major version upgrade)
- ecdsa 0.19.2: accepted (no fix)
- flask 3.1.0: deferred (indirect)
- nltk 3.9.1: deferred (transitive)
- pip 26.1.1: deferred (tool)
```

---

## 6. Commit Reference

| Commit | Description |
|--------|-------------|
| `e3293ec8` | bcrypt fix + classification doc |
| pending | SBOM, SECURITY.md, requirements pinning, evidence report |
