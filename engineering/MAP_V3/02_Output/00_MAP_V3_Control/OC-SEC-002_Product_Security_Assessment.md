# OC-SEC-002 — Product Security Assessment
**WORK PACKAGE:** OC-SEC-002 | **ID:** OC-SEC-002 | **DATE:** 2026-09-06 | **MAP VERSION:** MAP_V3 (from MAP_V2_FINAL_BASELINE d5f42b86)
**OBJECTIVE:** Assess product implementation security (auth, RBAC, tenant isolation, API, session, DB, secrets, encryption, audit, validation, rate limit, error handling, dependencies, config, prod) — assessment only.

**FILES / SYSTEMS / POLICIES INSPECTED:**
* `app/api/core/auth/jwt_config.py` (HS256, JWT_SECRET_KEY from .env, 2h expiry), `dependencies.py` (`get_current_user`, `get_current_user_with_tenant`), `rbac.py` (`require_permissions`, `require_role`, `require_admin` via `platform.user_roles`), `tenant_middleware.py` (sets `request.state.tenant_id` from JWT)
* `app/api/main.py` (CORS `5173/3000/8080`, `AuditLoggingMiddleware`, `slowapi` limiter 5/min on `/auth/login` only, global `500`/`404` handlers, `ConnectionPoolManager` reset)
* `app/services/credential_service.py` + `EncryptionManager` (Fernet, `password_encrypted` for `snowflake.private_key` PEM, `platform.users` bcrypt `$2b$12`), `app/db/connection.py` (`PooledDBConnector` 2-5), `app/adapters/pool.py` (snowflake JWT DER, `sqlserver` ODBC `Encrypt=yes` for Azure)
* `app/api/routes/*` (34 files, all `Depends(get_current_user_with_tenant)` except `POST /api/v1/leads` anonymous — intentional for public), `app/db/repositories/*` (5 files, tenant-filtered `WHERE tenant_id = %s`)
* `app/execution_engine.py` (6-step, `ConnectionResolver` via `DB_TYPE_MAP`, `AutoRuleDiscovery` FK skip for snowflake)
* `engineering/MAP_V2/03_Source/frontend-mvp/src/context/AuthContext.tsx` (JWT `localStorage`, `isTokenExpired` check), `engineering/MAP_V2/02_output/08_Soft_Launch/Website_Prepared` (static, no auth)
* `.env` (ignored), `snowflake-certification/keys/*.p8` (ignored), `terraform.tfvars` (ignored), `core.leads` (new, `work_email_hash` plain, no rate limit)

**EXISTING IMPLEMENTATION:**
* **Authentication:** JWT `HS256` `JWT_SECRET_KEY` (256-bit, from `.env`, `get_secret` fails if missing), `exp 2h`, `bcrypt` `$2b$12` for `platform.users`, `last_login_at` tracking, `failed_login_attempts` (not yet lockout). `externalbrowser` for Snowflake `MAPADMIN` vs `snowflake_jwt` for `MAP_CERT_ADMIN` (separate).
* **Authorisation/RBAC:** `platform.roles` (`Super Admin`, `Admin`, etc.) + `platform.role_permissions` + `platform.permissions` (`resource:action`), `require_permissions(*)` and `require_role(*)` + `require_admin` (Super Admin). Frontend `useAuth` `userRoles` + `ProtectedRoute` + `PermissionGuard` (tested).
* **Tenant Isolation:** `tenant_middleware` sets `request.state.tenant_id` from JWT, all `system_repository`, `discovery_repository`, `diagnostics_repository` filter `WHERE tenant_id = %s` (verified `b8c16399...` Snowflake tenant isolated from `aaf73536...` Default — 2 vs 3 systems). `core.leads` currently **no tenant_id** (public lead, `null`).
* **API Security:** 34 routes all `Depends(get_current_user_with_tenant)` except `POST /api/v1/leads` (public, intentional) and `GET /health` (exempt via `limiter.exempt`). `CORS` limited to 3 origins, `AuditLoggingMiddleware` logs `CONNECTION_RESOLVED`, `BATCH_STARTED`, etc.
* **Session Management:** JWT stored in `localStorage`/`sessionStorage` (`access_token`), `isTokenExpired` check in `apiClient.ts` → `window.location.href = '/session-expired'` on `401` + `exp` check, `2h` expiry, no `httpOnly` cookie (XSS risk if XSS exists).
* **Database Access:** `PooledDBConnector` `min 2 max 5`, `health_check` `SELECT 1`, `MARS_Connection=Yes` for `sqlserver` Azure, `snowflake` JWT DER via `cryptography`, `psycopg2` `autocommit True`.
* **Credentials/Secrets:** `snowflake.private_key` PEM stored **encrypted** as `password_encrypted` via `EncryptionManager` (Fernet) in `core.system_credentials` (verified `BEGIN` → `private_key`), `Key Vault` `kv-snowflake-cert` empty per `12_9` (outside Terraform, `az keyvault secret set --file rsa_key.p8`), `.env` `ENGINE_DB_PASS` `dev123456` is **dev only**, not prod.
* **Encryption:** `EncryptionManager` uses `Fernet` (AES-128-CBC) for `password_encrypted`, `bcrypt` for `platform.users`, `snowflake` `Encrypt=yes` for Azure SQL, `snowflake` TLS 1.2 (`minimum_tls_version 1.2` in Terraform).
* **Audit Logging:** `AuditLoggingMiddleware` + `get_audit_logger` logs `CONNECTION_RESOLVED`, `BATCH_STARTED`, `MAPPING_RESOLVED`, `CONTROL_EXECUTED`, `GOVERNANCE_DECISION` with `tenant_id`, `batch_id`, `user`.
* **Input Validation:** `Pydantic` `BaseModel` for `SystemCreateRequest`, `LeadCreateRequest` (email regex, free domain block `gmail.com`), but `lead_routes` has **no Pydantic max_length** for `message` (could be large).
* **Rate Limiting:** `slowapi` `Limiter` `5/minute` only on `POST /api/v1/auth/login` — **not on** `POST /api/v1/leads` (public, spam risk) or `POST /api/v1/diagnostics/{id}/run`.
* **Error Handling:** Global `500` `Internal server error` + `404` `Resource not found` + `422` handlers in `main.py` — prevents stack trace leakage, but `diagnostics` 500 previously exposed `System not found` (now fixed to tenant-aware).
* **Dependency Security:** `frontend-mvp` `react 19.2.7`, `vite 8.1.1`, `snowflake-connector 4.7.2`, `cryptography 50.0.1` — `npm audit` shows 6 vulnerabilities (1 moderate, 5 high) after `npm install` in `MAP_V3` (needs `npm audit fix`).
* **Configuration:** `.env` ignored, `ENGINE_DB_HOST=localhost` dev, `JWT_SECRET_KEY` required via `get_secret`, `terraform` `sensitive=true` for `snowflake_private_key` (not in state).
* **Production Security:** `engine_db` `postgres` with `TrustServerCertificate` handling, `snowflake` `TrustServerCertificate=no` for JWT, `Key Vault` soft-delete 7 days, `WAF` **Disabled** on Static Web Apps Free.
* **Monitoring:** `HealthCheckService` for DB, `DiagnosticsService` 6 checks, no `Application Insights` for website, no `SIEM`.
* **Security Testing:** No automated `SAST`/`DAST`/`penetration` test in pipeline — manual `pytest` for `snowflake` JWT, `vite build` only.

**FINDINGS:**
* **Positive:** Tenant isolation verified (2 Snowflake systems isolated), JWT expiry + bcrypt, RBAC via DB, audit logging, Key Vault discipline (no PEM in state), HSTS on `www.mapnexus.co.uk`, `core.leads` with `source_form` intelligence.
* **Issues:** 1) `POST /api/v1/leads` **no rate limiting** (open to spam, as `OC-SEC-001` also noted). 2) `JWT` in `localStorage` (XSS-extractable, not `httpOnly`). 3) `work_email_hash` plain lowercased, not hashed. 4) `WAF` Disabled on SWA Free. 5) `npm audit` 6 vulns.

**RISKS:**
* **High:** Public `POST /api/v1/leads` without rate limit → spam/DoS fills `core.leads` (same as website).
* **Medium:** `JWT` in `localStorage` → XSS could steal token (mitigated if `Content-Security-Policy` added in `OC-SEC-001`).
* **Medium:** No `WAF` on Free SKU → DDoS on `www.mapnexus.co.uk` not mitigated.
* **Low:** `core.leads` plain hash → dedupe weak.

**GAPS:**
* No `slowapi` on `lead_routes` (as `OC-SEC-001`).
* No `httpOnly` cookie for JWT (requires backend change to set cookie).
* No `WAF` on Free (requires upgrade to `Standard` + Front Door).

**DEPENDENCIES:**
* `OC-SEC-001` (Website) for `CSP` + `WAF` + `lead` rate limit.

**RECOMMENDATION:** **Assessment Only** — Report approved, then implement: 1) Add `slowapi` 5/min to `lead_routes` (same as `OC-SEC-001`), 2) Consider `httpOnly` cookie for JWT in `MAP_V3` (breaking change, needs frontend `apiClient` update), 3) Upgrade SWA to `Standard` + Front Door for `WAF` if needed for `mapnexus.co.uk` production (after validation).

**PROPOSED CHANGES:** `app/api/routes/lead_routes.py` (+ `limiter`), `app/api/core/auth/dependencies.py` (optional `httpOnly`), `staticwebapp.config.json` (CSP).

**FILES EXPECTED TO CHANGE:** 2-3 files + `staticwebapp.config.json` (from `OC-SEC-001`).

**DATABASE CHANGES:** None (no schema, just `core.leads` hash fix via code).

**SECURITY IMPACT:** Low-positive — adds rate limit, reduces spam.

**BACKWARD COMPATIBILITY:** Additive, no breaking for `core.leads` (hash change internal).

**TEST PLAN:** `curl POST /api/v1/leads` 6x rapid → expect `429` after 5, `GET /health` still 200, `www.mapnexus.co.uk` still 200.

**EVIDENCE REQUIRED:** `az staticwebapp show` `EnterpriseGradeCdnStatus`, `curl -I`, `psql` spam test.

**QUESTIONS / DECISIONS REQUIRED:** Approve `slowapi` 5/min for public leads? Approve `httpOnly` vs `localStorage` trade-off?

**STATUS:** `REPORT` — Awaiting `CHATGPT REVIEW` → `APPROVAL` before `OC-SEC-002` implementation.

