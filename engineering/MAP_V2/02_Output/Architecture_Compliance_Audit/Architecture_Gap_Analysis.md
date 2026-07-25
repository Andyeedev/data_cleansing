# MAP Nexus™ Enterprise Platform

# Architecture Gap Analysis

**Date:** 13 July 2026

**Version:** 1.0

**Classification:** Gap Analysis

**Status:** Complete

---

# 1. Gap Summary

| Gap Category | Total Gaps | Critical | High | Medium | Low |
|-------------|-----------|----------|------|--------|-----|
| Security | 8 | 3 | 3 | 2 | 0 |
| Architecture | 7 | 0 | 4 | 2 | 1 |
| Database | 5 | 0 | 2 | 2 | 1 |
| Integration | 6 | 0 | 3 | 2 | 1 |
| Code Quality | 8 | 0 | 4 | 2 | 2 |
| **Total** | **34** | **3** | **16** | **10** | **5** |

---

# 2. Security Gaps

## GAP-SEC-1: No Password Hashing [CRITICAL]

**Architecture Expects:**
> 08_Security_Architecture.md: "Password-Based Authentication with strong password policy, bcrypt hashing, account lockout"

**Current State:**
- `auth_service.py` compares plaintext env vars (`APP_ADMIN_USER`, `APP_ADMIN_PASS`)
- `platform.users.password_hash` contains `hashed_password_placeholder`
- No bcrypt, no password complexity, no lockout

**Impact:** Any user compromise exposes all accounts. Cannot support multiple users.

**Fix:** Implement bcrypt hashing in `platform.users`, update `auth_service.py` to verify against DB.

---

## GAP-SEC-2: No Role-Based Authorisation [CRITICAL]

**Architecture Expects:**
> 08_Security_Architecture.md: "RBAC with 9 defined roles: Executive, Programme Sponsor, Programme Manager, Migration Lead, Migration Engineer, Governance Officer, Auditor, Administrator, Customer Administrator"

**Current State:**
- `get_current_user` verifies JWT exists but never checks roles
- No route-level permission checks
- `platform.user_roles` table exists but is unused
- `platform.role_permissions` table exists but is unused

**Impact:** All authenticated users have full access to everything.

**Fix:** Add RBAC middleware that checks `user_roles` and `role_permissions` on every request.

---

## GAP-SEC-3: No Tenant Isolation [CRITICAL]

**Architecture Expects:**
> 05_Database_Architecture.md: "Multi-Tenant Strategy: Tenant_ID in business entities"

**Current State:**
- All platform tables have `tenant_id` column with FK to `core.tenants`
- No service filters queries by `tenant_id`
- Any authenticated user can see data from all tenants

**Impact:** Cross-tenant data leakage. Enterprise customers cannot be isolated.

**Fix:** Add `tenant_id` filtering to all service queries, derived from JWT payload.

---

## GAP-SEC-4: JWT Secret is Trivial [HIGH]

**Architecture Expects:**
> 08_Security_Architecture.md: "Secrets Management: Azure Key Vault preferred; never hard-code credentials"

**Current State:**
- `JWT_SECRET_KEY=REDACTED` in `.env`
- Same secret across all environments

**Impact:** Token forgery if secret is leaked.

**Fix:** Generate cryptographically strong secret, rotate periodically, use Key Vault in production.

---

## GAP-SEC-5: No CORS Middleware [HIGH]

**Architecture Expects:**
> 04_API_Architecture.md: "API Security: JWT validation, role validation, request validation"

**Current State:**
- FastAPI has no CORS configuration
- Vite proxy masks this in development

**Impact:** Production deployment will fail with cross-origin requests.

**Fix:** Add `CORSMiddleware` to FastAPI app.

---

## GAP-SEC-6: No Rate Limiting [HIGH]

**Architecture Expects:**
> 04_API_Architecture.md: "Rate Limiting (future)" — but basic protection expected

**Current State:**
- No throttling on login or API endpoints

**Impact:** Brute-force attacks possible.

**Fix:** Add rate limiting middleware (e.g., slowapi).

---

## GAP-SEC-7: No MFA Implementation [MEDIUM]

**Architecture Expects:**
> 08_Security_Architecture.md: "Multi-Factor Authentication"

**Current State:**
- `VerifyMFAPage.tsx` is a placeholder
- `platform.users.mfa_enabled` and `mfa_secret` columns exist but unused

**Impact:** No second factor authentication.

**Fix:** Implement TOTP-based MFA (future phase).

---

## GAP-SEC-8: No HTTPS Enforcement [MEDIUM]

**Architecture Expects:**
> 08_Security_Architecture.md: "HTTPS Only"

**Current State:**
- No TLS termination configured
- Development runs on HTTP

**Impact:** Production deployment needs reverse proxy or load balancer for TLS.

**Fix:** Configure in deployment architecture.

---

# 3. Architecture Gaps

## GAP-ARCH-1: Services Return API Envelopes [HIGH]

**Architecture Expects:**
> 12_Platform_Integration_Architecture.md: "Business Services contain business logic; API Layer handles presentation"

**Current State:**
- 8 platform services return `{"success": True, "data": {...}}`
- Response formatting is presentation logic in business layer

**Impact:** Services cannot be reused by other consumers (CLI, batch jobs, AI).

**Fix:** Move envelope to API response layer or FastAPI middleware.

---

## GAP-ARCH-2: 6 of 8 Services Bypass Repository Pattern [HIGH]

**Architecture Expects:**
> 03_Backend_Architecture.md: "Repository Layer → PostgreSQL"

**Current State:**
- Only `credential_repository.py` and `system_repository.py` exist
- 6 services embed raw SQL

**Impact:** SQL logic duplicated across services, hard to maintain, no data access abstraction.

**Fix:** Create repositories for workflows, tasks, users, roles, notifications, settings, calendar.

---

## GAP-ARCH-3: No API Gateway [HIGH]

**Architecture Expects:**
> 04_API_Architecture.md: "API Gateway provides Authentication, Authorisation, Routing, Request Validation, Rate Limiting, Monitoring, Logging"

**Current State:**
- Direct FastAPI access, no gateway layer

**Impact:** No centralised rate limiting, monitoring, or request validation.

**Fix:** Implement API gateway (Azure API Management in production).

---

## GAP-ARCH-4: No Centralised Error Handling [HIGH]

**Architecture Expects:**
> 04_API_Architecture.md: "Standard Error Codes: 200, 201, 400, 401, 403, 404, 409, 422, 500"

**Current State:**
- Inconsistent error responses across endpoints
- Some return `{detail}`, others `{message}`, others plain text

**Impact:** Frontend cannot reliably parse errors.

**Fix:** Create standardised error response model and exception handlers.

---

## GAP-ARCH-5: No Audit Logging on API Calls [MEDIUM]

**Architecture Expects:**
> 04_API_Architecture.md: "Every API call is audited: Timestamp, User, Operation, Resource, Duration, Result"

**Current State:**
- `audit` schema exists with tables
- No middleware captures API call audit events

**Impact:** No API call audit trail.

**Fix:** Add audit logging middleware.

---

## GAP-ARCH-6: Empty `MAP_V2/03_Source/backend/` Scaffold [MEDIUM]

**Architecture Expects:**
> 11_Development_Standards.md: "Backend root is `app/` at project root"

**Current State:**
- `MAP_V2/03_Source/backend/` exists with empty subdirectories
- Live backend is `app/` at root

**Impact:** Confusion about where backend code lives.

**Fix:** Delete empty scaffold.

---

## GAP-ARCH-7: `13_Platform_Application_Architecture.md` is Empty [LOW]

**Architecture Expects:**
> This document should define the platform application architecture

**Current State:**
- File exists but contains 0 lines

**Impact:** Missing architectural reference.

**Fix:** Generate document (separate task).

---

# 4. Database Gaps

## GAP-DB-1: Missing tasks → batches FK [HIGH]

**Architecture Expects:**
> Tasks should link to migration batches they relate to

**Current State:**
- `platform.tasks` has no `batch_id` column
- Cannot associate tasks with specific migration batches

**Impact:** Task context is incomplete.

**Fix:** Add `batch_id` FK to `platform.tasks`.

---

## GAP-DB-2: 7+ Legacy `_OLD` Tables [HIGH]

**Architecture Expects:**
> Clean schema with current tables only

**Current State:**
- `tenants_OLD`, `projects_OLD`, `system_registry_OLD`, `dataset_mappings_OLD`, etc.
- Multiple versions of same data

**Impact:** Confusion, wasted storage, potential data inconsistency.

**Fix:** Drop legacy tables after confirming no dependencies.

---

## GAP-DB-3: Inconsistent Audit Columns [MEDIUM]

**Architecture Expects:**
> 11_Development_Standards.md: "Every table must have Created_Date, Updated_Date, Created_By, Updated_By"

**Current State:**
- Most tables have `created_at`/`updated_at`
- Many missing `created_by`/`updated_by`

**Impact:** Cannot track who made changes.

**Fix:** Add missing audit columns.

---

## GAP-DB-4: Reporting Schema Empty [MEDIUM]

**Architecture Expects:**
> 05_Database_Architecture.md: "Reporting schema contains dimensions, dashboards, reports, templates, scheduled reports, export history"

**Current State:**
- `reporting` schema exists with 0 tables

**Impact:** No structured reporting data.

**Fix:** Create reporting tables (future phase).

---

## GAP-DB-5: No Database Migrations Framework [LOW]

**Architecture Expects:**
> 11_Development_Standards.md: "Schema changes managed through migrations"

**Current State:**
- SQL scripts manually executed
- No migration versioning

**Impact:** Schema changes are ad-hoc, not tracked.

**Fix:** Implement Alembic or similar migration tool.

---

# 5. Integration Gaps

## GAP-INT-1: No CI/CD Pipeline [HIGH]

**Architecture Expects:**
> 09_Deployment_Architecture.md: "CI/CD Pipeline: Developer → Git → CI → CD"

**Current State:**
- Manual deployment only
- No automated testing, building, or deployment

**Impact:** Slow, error-prone releases.

**Fix:** Implement GitHub Actions or Azure DevOps pipeline.

---

## GAP-INT-2: No Containerization [HIGH]

**Architecture Expects:**
> 09_Deployment_Architecture.md: "Every backend service containerised"

**Current State:**
- Docker files exist but unused
- Backend runs as raw Python process

**Impact:** Cannot deploy to container orchestration platforms.

**Fix:** Create working Dockerfiles, test locally.

---

## GAP-INT-3: No Azure Integration [HIGH]

**Architecture Expects:**
> 09_Deployment_Architecture.md: "Azure App Service, Container Apps, PostgreSQL Flexible Server, Key Vault, Monitor"

**Current State:**
- Local development only
- No Azure resource configuration

**Impact:** Cannot deploy to production.

**Fix:** Create Azure deployment templates (Bicep/Terraform).

---

## GAP-INT-4: No Logging Framework [MEDIUM]

**Architecture Expects:**
> 08_Security_Architecture.md: "Audit Framework: Timestamp, User, Role, Operation, Object, Duration, Result"

**Current State:**
- `app/utils/logger.py` exists but basic
- No structured logging, no correlation IDs

**Impact:** Difficult to debug production issues.

**Fix:** Implement structured logging with correlation IDs.

---

## GAP-INT-5: No Health Checks [MEDIUM]

**Architecture Expects:**
> 09_Deployment_Architecture.md: "Health verification"

**Current State:**
- No `/health` or `/ready` endpoints

**Impact:** Cannot monitor service health.

**Fix:** Add health check endpoints.

---

## GAP-INT-6: No Configuration Management [LOW]

**Architecture Expects:**
> 09_Deployment_Architecture.md: "Externalised configuration"

**Current State:**
- Single `.env` file for all configuration
- No environment-specific config

**Impact:** Cannot configure per environment.

**Fix:** Implement environment-based configuration.

---

# 6. Code Quality Gaps

## GAP-CQ-1: 8 Legacy Methods in ExecutionEngine [HIGH]

**Current State:** `_execute_control` has 8+ legacy variants totaling ~1,100 lines of dead code.

**Fix:** Delete all legacy variants.

---

## GAP-CQ-2: 3 Duplicate System Route/Model Files [HIGH]

**Current State:** `system_routes_20260424.py` and `system_models_with_validation_20260424.py` are unused duplicates.

**Fix:** Delete duplicate files.

---

## GAP-CQ-3: 2 Credential Service Files [HIGH]

**Current State:** `credential_service.py` and `credential_admin_service.py` overlap.

**Fix:** Merge into single service.

---

## GAP-CQ-4: 3 EncryptionManager Implementations [HIGH]

**Current State:** Three different crypto implementations exist.

**Fix:** Consolidate to single implementation.

---

## GAP-CQ-5: Empty Scaffolding Directories [MEDIUM]

**Current State:** `app/mapping/`, `app/matching/`, `app/scoring/`, `app/diff/`, `MAP_V2/03_Source/backend/`, `MAP_V2/03_Source/shared/` are all empty.

**Fix:** Delete empty directories.

---

## GAP-CQ-6: Inconsistent Service Patterns [MEDIUM]

**Current State:** Some services use repositories, others use raw SQL, others use DBConnector directly.

**Fix:** Standardise on repository pattern.

---

## GAP-CQ-7: No Test Suite [LOW]

**Current State:** `tests/` directory has 2 basic test files. No comprehensive testing.

**Fix:** Write tests for all services and routes.

---

## GAP-CQ-8: No TypeScript Strict Mode [LOW]

**Current State:** Frontend compiles but no strict TypeScript checks.

**Fix:** Enable strict mode, fix type errors.

---

*Generated by Architecture Compliance Audit Framework v1.0*
