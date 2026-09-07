# OC-SEC-007 — Dependency & Supply-Chain Security Assessment

**Date:** 2026-09-07
**Status:** IN PROGRESS
**Scope:** npm audit, pip-audit, SAST, secret scanning, dependency policy, SBOM

---

## CI/CD Infrastructure Assessment

| Item | Status |
|------|--------|
| `.github/workflows/` | NOT EXISTS |
| `.gitlab-ci.yml` | NOT EXISTS |
| `Jenkinsfile` | NOT EXISTS |
| `Dockerfile` | EXISTS (python:3.11-slim) |
| Container scanning | NOT CONFIGURED |
| CI platform | NONE (manual deployment) |

**Decision:** DAST, container scanning, and CI pipeline integration are deferred — no CI infrastructure exists to integrate with. Dockerfile is present but used for manual builds only.

---

## npm Audit Findings

**Note:** npm audit resolved from user's global `node_modules` (`C:\Users\devwork\node_modules`). The project frontend uses Vite + React (not Next.js). The `next`, `next-auth`, `prisma` packages are NOT in the project's `package.json`. Only `axios` overlaps with the project's frontend dependencies.

### Actual Project Dependencies (Vite + React Frontend)

| Package | Installed | Severity | Vulnerability | Fix | Breaking? |
|---------|-----------|----------|---------------|-----|-----------|
| axios | 1.12.2 | HIGH | SSRF, Prototype Pollution, Header Injection (28 CVEs) | 1.18.1+ | No |
| follow-redirects | (transitive) | MODERATE | Auth header leak on redirect | npm audit fix | No |
| form-data | (transitive) | HIGH | CRLF injection | npm audit fix | No |
| nanoid | (transitive) | HIGH | Integer overflow, infinite loop | npm audit fix | No |
| postcss | (transitive) | HIGH | XSS, path traversal | npm audit fix | No |
| picomatch | (transitive) | HIGH | ReDoS, method injection | npm audit fix | No |

### Non-Project Packages (Global node_modules — NOT in project dependency tree)

| Package | Installed | Severity | Notes |
|---------|-----------|----------|-------|
| next | 15.5.6 | CRITICAL | NOT in project package.json |
| next-auth | 4.24.11 | CRITICAL | NOT in project package.json |
| prisma | 6.17.1 | HIGH | NOT in project package.json |
| deepmerge-ts | (transitive) | HIGH | Requires prisma breaking change |
| effect | (transitive) | HIGH | Requires prisma breaking change |

**Action:** Only remediate packages actually in the project's dependency tree. Global packages are out of scope.

---

## pip-audit Findings

| Package | Installed | Severity | Vulnerability | Fix | Breaking? |
|---------|-----------|----------|---------------|-----|-----------|
| click | 8.1.7 | HIGH | PYSEC-2026-2132 | 8.3.3 | No |
| cryptography | 49.0.0 | HIGH | PYSEC-2026-3552 | 50.0.0 | Potential (major version) |
| ecdsa | 0.19.2 | HIGH | PYSEC-2026-1325 | NO FIX | N/A |
| flask | 3.1.0 | HIGH | 2 vulns | 3.1.3 | No |
| jinja2 | 3.1.4 | HIGH | 3 vulns | 3.1.6 | No |
| nltk | 3.9.1 | HIGH | 50+ vulns | 3.10.3 | No |
| pillow | 12.2.0 | HIGH | 15+ vulns | 12.3.0 | No |
| pip | 26.1.1 | MODERATE | PYSEC-2026-196 | 26.2 | No |
| werkzeug | 3.1.3 | HIGH | 3 vulns | 3.1.6 | No |

**Key decisions:**
- `cryptography` 49→50: MAJOR version bump. Must test before upgrading.
- `ecdsa`: No fix available. Used by `python-jose` for JWT. Evaluate if still needed.
- `flask`, `werkzeug`: Indirect dependencies (via FastAPI). Upgrading FastAPI may resolve.

---

## Remediation Plan

### Phase 1: Safe npm fixes (non-breaking)
```bash
npm audit fix  # without --force
```
Fixes: axios, follow-redirects, form-data, nanoid, postcss, picomatch

### Phase 2: Safe pip fixes (non-breaking)
```bash
pip install --upgrade click jinja2 nltk pillow pip werkzeug
```

### Phase 3: Deliberate pip fixes (requires testing)
```bash
pip install --upgrade cryptography==50.0.0  # Test JWT/auth flows
pip install --upgrade flask==3.1.3           # Test any Flask endpoints
```

### Phase 4: No-fix packages
- `ecdsa`: No fix. Document as accepted risk. Evaluate `python-jose` alternatives.
- `next`, `next-auth`, `prisma`: NOT in project dependencies. No action.

### Phase 5: Policy & SBOM
- Pin dependency versions in requirements.txt
- Add `.safety-policy.yml` for safety checks
- Generate SBOM (CycloneDX format)
- Create `SECURITY.md` with vulnerability reporting process

### Phase 6: SAST + Secret Scanning
- Add `bandit` for Python SAST
- Add `semgrep` rules for common patterns
- Add `.gitignore` entries for secrets
- Create `detect-secrets` baseline
