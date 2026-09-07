# OC-SEC-007 — Dependency & Supply-Chain Security
**WORK PACKAGE:** OC-SEC-007 | **ID:** OC-SEC-007 | **DATE:** 2026-09-07 | **MAP VERSION:** MAP_V3
**OBJECTIVE:** Remediate known dependency vulnerabilities, establish automated security scanning pipeline, and create dependency management policy.
**CREATED FROM:** OC-SEC-002 revised assessment (finding 5, 9).

---

## SCOPE

### Known Vulnerabilities
* `npm audit` shows 6 vulnerabilities (1 moderate, 5 high)
* `frontend-mvp` dependencies: `react 19.2.7`, `vite 8.1.1`
* `backend` dependencies: `snowflake-connector 4.7.2`, `cryptography 50.0.1`

### Automated Security Scanning
* SAST (Static Application Security Testing) in CI pipeline
* DAST (Dynamic Application Security Testing) for deployed environments
* Container image scanning (if applicable)
* Secret scanning in CI

### Dependency Management
* Version pinning policy
* Automated dependency update (Dependabot / Renovate)
* SBOM (Software Bill of Materials) generation
* License compliance checking

---

## FILES TO INSPECT
* `frontend-mvp/package.json` + `package-lock.json` — npm audit
* `requirements.txt` or `pyproject.toml` — Python dependencies
* `.github/workflows/` or CI config — pipeline security steps
* `Dockerfile` (if any) — base image scanning

---

## PROPOSED CHANGES (P1)
1. Run `npm audit fix` for frontend-mvp
2. Run `pip-audit` for Python dependencies
3. Add SAST step to CI pipeline (Semgrep / CodeQL / Bandit)
4. Add dependency version pinning policy
5. Create SBOM document

---

## DEPENDENCIES
* CI/CD pipeline access (GitHub Actions / Azure DevOps)

---

## STATUS:** NOT STARTED — Awaiting approval.
