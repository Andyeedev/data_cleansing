# OC-SEC-002 — Product Security Assessment (Revised)
**WORK PACKAGE:** OC-SEC-002 | **ID:** OC-SEC-002 | **DATE:** 2026-09-06 | **REVISED:** 2026-09-07 | **MAP VERSION:** MAP_V3 (from MAP_V2_FINAL_BASELINE d5f42b86)
**OBJECTIVE:** Assess product implementation security (auth, RBAC, tenant isolation, API, session, DB, secrets, encryption, audit, validation, error handling, dependencies, config, prod) — assessment only.

**REVISION NOTE:** Updated to reflect OC-SEC-001 completions (rate limiting, work_email_hash, CSP). Created OC-SEC-005/006/007 for deeper security work streams.

---

## ALREADY REMEDIATED BY OC-SEC-001

| Finding | Remediation | Commit | Evidence |
|---|---|---|---|
| `POST /api/v1/leads` no rate limiting | 10/min per-IP sliding window | `28339d72` | `app/api/routes/rate_limit.py`, `tests/test_rate_limit.py` (6/6 pass) |
| `work_email_hash` plain lowercased | Removed from INSERT (GDPR) | `3dbb7973` | `app/services/lead_service.py`, `tests/test_website_security.py` |
| No CSP on website | Report-only mode, `staticwebapp.config.json` | `3dbb7973` | 7 headers including HSTS, X-Frame-Options, Permissions-Policy |
| Tailwind CDN dependency | Self-hosted v3 build (20KB) | `3dbb7973` | `engineering/MAP_V2/02_output/08_Soft_Launch/Website_Prepared/css/tailwind.min.css` |
| Chart.js no SRI | Added integrity + crossorigin | `3dbb7973` | `index.html` |
| No robots.txt | Created, blocks /admin/, /api/, etc. | `3dbb7973` | `robots.txt` |

---

## FILES / SYSTEMS / POLICIES INSPECTED
* `app/api/core/auth/jwt_config.py` (HS256, JWT_SECRET_KEY from .env, 2h expiry), `dependencies.py` (`get_current_user`, `get_current_user_with_tenant`), `rbac.py` (`require_permissions`, `require_role`, `require_admin` via `platform.user_roles`), `tenant_middleware.py` (sets `request.state.tenant_id` from JWT)
* `app/api/main.py` (CORS `5173/3000/8080`, `AuditLoggingMiddleware`, `slowapi` limiter 5/min on `/auth/login` only, global `500`/`404` handlers, `ConnectionPoolManager` reset)
* `app/services/credential_service.py` + `EncryptionManager` (Fernet, `password_encrypted` for `snowflake.private_key` PEM, `platform.users` bcrypt `$2b$12`), `app/db/connection.py` (`PooledDBConnector` 2-5), `app/adapters/pool.py` (snowflake JWT DER, `sqlserver` ODBC `Encrypt=yes` for Azure)
* `app/api/routes/*` (34 files, all `Depends(get_current_user_with_tenant)` except `POST /api/v1/leads` anonymous + rate-limited), `app/db/repositories/*` (5 files, tenant-filtered `WHERE tenant_id = %s`)
* `app/execution_engine.py` (6-step, `ConnectionResolver` via `DB_TYPE_MAP`, `AutoRuleDiscovery` FK skip for snowflake)
* `engineering/MAP_V2/03_Source/frontend-mvp/src/context/AuthContext.tsx` (JWT `localStorage`, `isTokenExpired` check), `engineering/MAP_V2/02_output/08_Soft_Launch/Website_Prepared` (self-hosted Tailwind, CSP report-only)
* `.env` (ignored), `snowflake-certification/keys/*.p8` (ignored), `terraform.tfvars` (ignored), `core.leads` (`work_email_hash` removed by OC-SEC-001)

---

## EXISTING IMPLEMENTATION

### Authentication
* JWT `HS256` `JWT_SECRET_KEY` (256-bit, from `.env`, `get_secret` fails if missing), `exp 2h`
* `bcrypt` `$2b$12` for `platform.users`, `last_login_at` tracking
* `failed_login_attempts` (not yet lockout) — **gap: no account lockout**
* `externalbrowser` for Snowflake `MAPADMIN` vs `snowflake_jwt` for `MAP_CERT_ADMIN` (separate)

### Authorisation / RBAC
* `platform.roles` (`Super Admin`, `Admin`, etc.) + `platform.role_permissions` + `platform.permissions` (`resource:action`)
* `require_permissions(*)` and `require_role(*)` + `require_admin` (Super Admin)
* Frontend `useAuth` `userRoles` + `ProtectedRoute` + `PermissionGuard` (tested)

### Tenant Isolation (SHALLOW — needs deeper audit)
* `tenant_middleware` sets `request.state.tenant_id` from JWT
* `system_repository`, `discovery_repository`, `diagnostics_repository` filter `WHERE tenant_id = %s` (verified `b8c16399...` Snowflake tenant isolated from `aaf73536...` Default)
* `core.leads` no `tenant_id` (public lead, `null`)
* **NOT tested:** cross-tenant API access, object-level access control, edge cases in batch/governance routes

### API Security
* 34 routes all `Depends(get_current_user_with_tenant)` except `POST /api/v1/leads` (public, rate-limited) and `GET /health` (exempt via `limiter.exempt`)
* `CORS` limited to 3 origins
* `AuditLoggingMiddleware` logs `CONNECTION_RESOLVED`, `BATCH_STARTED`, etc.

### Session Management
* JWT stored in `localStorage`/`sessionStorage` (`access_token`)
* `isTokenExpired` check in `apiClient.ts` → `window.location.href = '/session-expired'` on `401` + `exp` check
* `2h` expiry, no `httpOnly` cookie (XSS risk if XSS exists)
* **DEFERRED:** httpOnly cookie migration is a breaking change requiring frontend `apiClient` update — not for immediate implementation

### Database Access
* `PooledDBConnector` `min 2 max 5`, `health_check` `SELECT 1`
* `MARS_Connection=Yes` for `sqlserver` Azure
* `snowflake` JWT DER via `cryptography`, `psycopg2` `autocommit True`

### Credentials / Secrets
* `snowflake.private_key` PEM stored **encrypted** as `password_encrypted` via `EncryptionManager` (Fernet) in `core.system_credentials`
* `Key Vault` `kv-snowflake-cert` empty per `12_9` (outside Terraform, `az keyvault secret set --file rsa_key.p8`)
* `.env` `ENGINE_DB_PASS` `dev123456` is **dev only**, not prod
* **NOT tested:** encryption key rotation, Fernet key lifecycle, Key Vault access policies, service principal credentials

### Encryption
* `EncryptionManager` uses `Fernet` (AES-128-CBC) for `password_encrypted`
* `bcrypt` for `platform.users`
* `snowflake` `Encrypt=yes` for Azure SQL
* `snowflake` TLS 1.2 (`minimum_tls_version 1.2` in Terraform)

### Audit Logging
* `AuditLoggingMiddleware` + `get_audit_logger` logs `CONNECTION_RESOLVED`, `BATCH_STARTED`, `MAPPING_RESOLVED`, `CONTROL_EXECUTED`, `GOVERNANCE_DECISION` with `tenant_id`, `batch_id`, `user`

### Input Validation
* `Pydantic` `BaseModel` for `SystemCreateRequest`, `LeadCreateRequest` (email regex, free domain block)
* `lead_routes` has **no Pydantic max_length** for `message` (could be large)

### Error Handling
* Global `500` `Internal server error` + `404` `Resource not found` + `422` handlers in `main.py`
* Prevents stack trace leakage

### Dependency Security
* `frontend-mvp` `react 19.2.7`, `vite 8.1.1`, `snowflake-connector 4.7.2`, `cryptography 50.0.1`
* `npm audit` 6 vulns (1 moderate, 5 high) — **needs `npm audit fix`**

### Configuration
* `.env` ignored, `ENGINE_DB_HOST=localhost` dev
* `JWT_SECRET_KEY` required via `get_secret`
* `terraform` `sensitive=true` for `snowflake_private_key` (not in state)

### Production Security
* `engine_db` `postgres` with `TrustServerCertificate` handling
* `snowflake` `TrustServerCertificate=no` for JWT
* `Key Vault` soft-delete 7 days
* `WAF` Disabled on Static Web Apps Free — **classified as cloud/production architecture, not immediate remediation**

### Monitoring
* `HealthCheckService` for DB, `DiagnosticsService` 6 checks
* No `Application Insights` for website, no `SIEM`

### Security Testing
* No automated `SAST`/`DAST`/`penetration` test in pipeline
* Manual `pytest` for `snowflake` JWT, `vite build` only

---

## FINDINGS

### Positive
* Tenant isolation verified (2 Snowflake systems isolated)
* JWT expiry + bcrypt
* RBAC via DB
* Audit logging
* Key Vault discipline (no PEM in state)
* HSTS on `www.mapnexus.co.uk`
* Rate limiting on public endpoints (OC-SEC-001)
* CSP report-only (OC-SEC-001)
* `work_email_hash` removed (OC-SEC-001)

### Issues
1. ~~`POST /api/v1/leads` no rate limiting~~ — **REMEDIATED** by OC-SEC-001 (10/min per-IP)
2. `JWT` in `localStorage` (XSS-extractable, not `httpOnly`) — **DEFERRED** to OC-SEC-005
3. ~~`work_email_hash` plain lowercased~~ — **REMEDIATED** by OC-SEC-001 (removed)
4. ~~`WAF` Disabled~~ — **RECLASSIFIED** as cloud/production architecture (not immediate)
5. `npm audit` 6 vulns — **CREATED** OC-SEC-007 for dependency security
6. **NEW:** No account lockout after failed login attempts
7. **NEW:** No encryption key rotation policy
8. **NEW:** No object-level / tenant-level auth testing completed
9. **NEW:** No automated SAST/DAST in CI pipeline

---

## RISKS

| Risk | Severity | Status | Notes |
|---|---|---|---|
| ~~Public `POST /leads` without rate limit~~ | High | **REMEDIATED** | OC-SEC-001 commit `28339d72` |
| `JWT` in `localStorage` → XSS | Medium | **DEFERRED** | OC-SEC-005 — httpOnly cookie migration |
| ~~No `WAF` on Free SKU~~ | Medium | **RECLASSIFIED** | Cloud/production architecture (future) |
| ~~`work_email_hash` plain~~ | Low | **REMEDIATED** | OC-SEC-001 commit `3dbb7973` |
| No account lockout | Medium | **NEW** | OC-SEC-005 scope |
| No encryption key rotation | Medium | **NEW** | OC-SEC-005 scope |
| Cross-tenant object access | High | **NEW** | OC-SEC-006 scope |
| npm dependency vulnerabilities | Medium | **NEW** | OC-SEC-007 scope |

---

## OUTSTANDING REMEDIATION (Revised)

### Deferred to OC-SEC-005 (Authentication / Session Architecture)
* httpOnly cookie for JWT (breaking change, requires frontend `apiClient` update)
* Account lockout after failed login attempts
* Encryption key rotation policy
* Deeper session management audit
* Token refresh / renewal strategy
* Service-to-service authentication audit

### Deferred to OC-SEC-006 (Multi-Tenant Isolation)
* Object-level access control testing (cross-tenant API access)
* Tenant-level authorization edge cases
* Batch/governance route tenant isolation verification
* Shared resource isolation testing

### Deferred to OC-SEC-007 (Dependency / Supply-Chain Security)
* `npm audit fix` for 6 vulnerabilities
* Automated SAST/DAST in CI pipeline
* Dependency version pinning + update policy
* SBOM (Software Bill of Materials) generation

### Deferred to Cloud/Production Architecture
* WAF on Static Web Apps (requires Standard + Front Door)
* DDoS mitigation
* SIEM / Application Insights

---

## REVISIONS FROM ORIGINAL

| Original Finding | Revised Status | Rationale |
|---|---|---|
| Rate limiting on `POST /leads` | **REMEDIATED** | OC-SEC-001 commit `28339d72` |
| `work_email_hash` plain | **REMEDIATED** | OC-SEC-001 commit `3dbb7973` |
| No CSP on website | **REMEDIATED** | OC-SEC-001 commit `3dbb7973` (report-only) |
| WAF Disabled | **RECLASSIFIED** | Cloud/production architecture, not immediate |
| `npm audit` 6 vulns | **NEW WP** | Created OC-SEC-007 |
| No account lockout | **NEW WP** | Created OC-SEC-005 |
| No encryption key rotation | **NEW WP** | Created OC-SEC-005 |
| No object-level auth testing | **NEW WP** | Created OC-SEC-006 |

---

## CREATED WORK PACKAGES

| WP | Title | Scope |
|---|---|---|
| **OC-SEC-005** | Authentication & Session Architecture | httpOnly cookies, account lockout, encryption key rotation, session audit, token refresh, service-to-service auth |
| **OC-SEC-006** | Multi-Tenant Isolation Deep Audit | Object-level access control, cross-tenant API testing, tenant isolation edge cases, shared resources |
| **OC-SEC-007** | Dependency & Supply-Chain Security | npm audit fix, SAST/DAST pipeline, dependency pinning, SBOM |

---

## P0 / P1 / P2 IMPLEMENTATION PLAN (Revised)

### P0 — No code changes, assessment only
| WP | Title | Action |
|---|---|---|
| OC-SEC-002 | Product Security Assessment | ✅ COMPLETE (this report) |
| OC-SEC-003 | Privacy & Data Collection | Assessment complete, remediation pending approval |
| OC-SEC-004 | Domain & Email Security | Assessment complete, no implementation (email not configured) |

### P1 — Requires implementation, await approval
| WP | Title | Scope | Blocked On |
|---|---|---|---|
| OC-SEC-005 | Authentication & Session Architecture | httpOnly cookies, lockout, key rotation | Frontend `apiClient` refactor |
| OC-SEC-006 | Multi-Tenant Isolation Audit | Object-level auth, cross-tenant testing | OC-SEC-005 (auth architecture first) |
| OC-SEC-007 | Dependency & Supply-Chain Security | npm audit, SAST/DAST pipeline | CI/CD pipeline access |
| OC-COM-001a | Tenant Model & Subscription | Plans, subscriptions, middleware | — |

### P2 — Future / production architecture
| WP | Title | Scope |
|---|---|---|
| WAF/DDoS | Cloud/production architecture | Azure Front Door + WAF Standard |
| SIEM | Monitoring architecture | Application Insights + Log Analytics |
| Penetration Test | External security testing | Third-party engagement |

---

## RECOMMENDATION
**Assessment Only — Revised.** 3 of 6 original findings remediated by OC-SEC-001. Remaining work split into OC-SEC-005 (auth/session), OC-SEC-006 (tenant isolation), OC-SEC-007 (dependencies). WAF reclassified as cloud/production architecture. No immediate code changes required from OC-SEC-002.

**NEXT STEP:** Await approval of OC-SEC-005/006/007 scope before any implementation.

---

**STATUS:** `REVISED REPORT` — Awaiting `CHATGPT REVIEW` → `APPROVAL` before OC-SEC-005/006/007 implementation.
