# MAP Nexus Enterprise Platform

# Architecture Recommendations

**Date:** 13 July 2026

**Version:** 1.0

**Classification:** Recommendations

**Status:** Complete

---

# 1. Recommendation Summary

| Priority | Category | Count | Effort |
|----------|----------|-------|--------|
| Critical | Security | 3 | Medium |
| High | Architecture | 5 | Medium-Large |
| High | Code Quality | 4 | Small |
| Medium | Infrastructure | 4 | Medium |
| Low | Future Enhancement | 4 | Large |

---

# 2. Critical Recommendations (Do First)

## REC-SEC-1: Implement Password Hashing

**Category:** Security

**Problem:** Authentication uses env-var comparison. No real user management.

**Recommendation:**
- Add bcrypt password hashing to platform.users
- Update auth_service.py to query platform.users and verify bcrypt hash
- Create migration script to hash existing passwords
- Implement password complexity requirements

**Effort:** Medium (2-3 days)

**Impact:** Enables multi-user authentication, eliminates plaintext credential risk.

---

## REC-SEC-2: Implement RBAC Middleware

**Category:** Security

**Problem:** All authenticated users have full access. No role checking.

**Recommendation:**
- Create FastAPI dependency that checks user_roles and role_permissions
- Define route-level permission requirements
- Add role checking to every protected route
- Implement 9 defined roles from security architecture

**Effort:** Medium (3-5 days)

**Impact:** Enables enterprise-grade access control.

---

## REC-SEC-3: Implement Tenant Isolation

**Category:** Security

**Problem:** No tenant filtering in queries. Cross-tenant data leakage possible.

**Recommendation:**
- Extract tenant_id from JWT in get_current_user
- Add tenant_id filtering to all platform service queries
- Create middleware that injects tenant context
- Audit all queries for tenant compliance

**Effort:** Medium (2-3 days)

**Impact:** Enables multi-tenant deployment.

---

# 3. High Priority Recommendations

## REC-ARCH-1: Move Response Envelopes to API Layer

**Category:** Architecture

**Problem:** 8 services return success/data envelopes which is presentation in business layer.

**Recommendation:**
- Create standardised APIResponse model in FastAPI
- Add response wrapper middleware or dependency
- Remove envelope construction from all 8 services
- Services return raw data, API layer wraps it

**Effort:** Medium (2-3 days)

**Impact:** Services become reusable by CLI, batch jobs, AI.

---

## REC-ARCH-2: Create Missing Repositories

**Category:** Architecture

**Problem:** 6 of 8 services use raw SQL. No data access abstraction.

**Recommendation:**
- Create repositories for workflows, tasks, users, roles, notifications, settings, calendar
- Move SQL from services to repositories
- Services depend on repositories, not raw SQL

**Effort:** Large (5-7 days)

**Impact:** Maintainable data access layer, consistent patterns.

---

## REC-ARCH-3: Add CORS Middleware

**Category:** Architecture

**Problem:** No CORS configuration. Production deployment will fail.

**Recommendation:**
- Add CORSMiddleware to FastAPI app
- Configure allowed origins per environment
- Add to app/api/main.py

**Effort:** Small (1 hour)

**Impact:** Enables cross-origin requests in production.

---

## REC-ARCH-4: Add Centralised Error Handling

**Category:** Architecture

**Problem:** Inconsistent error responses across endpoints.

**Recommendation:**
- Create ErrorResponse Pydantic model
- Add global exception handlers to FastAPI
- Standardise error format across all routes

**Effort:** Medium (2-3 days)

**Impact:** Consistent API error handling, easier frontend integration.

---

## REC-ARCH-5: Add Audit Logging Middleware

**Category:** Architecture

**Problem:** No API call audit trail despite audit schema existing.

**Recommendation:**
- Create audit logging middleware for FastAPI
- Log every API call: timestamp, user, operation, resource, duration, result
- Write to audit.api_logs table

**Effort:** Medium (2-3 days)

**Impact:** Compliance with audit architecture, security visibility.

---

# 4. Code Quality Recommendations

## REC-CQ-1: Delete Legacy ExecutionEngine Methods

**Category:** Code Quality

**Problem:** 8 legacy _execute_control methods totaling ~1100 lines of dead code.

**Recommendation:**
- Verify no callers reference legacy methods
- Delete all _execute_control_legacy variants
- Remove related dead imports

**Effort:** Small (1-2 hours)

**Impact:** Reduces confusion, simplifies codebase.

---

## REC-CQ-2: Delete Duplicate Route/Model Files

**Category:** Code Quality

**Problem:** system_routes_20260424.py and system_models_with_validation_20260424.py are unused.

**Recommendation:**
- Verify no imports reference these files
- Delete duplicate files
- Update any references if found

**Effort:** Small (30 minutes)

**Impact:** Eliminates confusion about which file to use.

---

## REC-CQ-3: Merge Credential Services

**Category:** Code Quality

**Problem:** credential_service.py and credential_admin_service.py overlap.

**Recommendation:**
- Merge credential_admin_service.py functionality into credential_service.py
- Delete credential_admin_service.py
- Consolidate EncryptionManager import paths

**Effort:** Small (1-2 hours)

**Impact:** Single source of truth for credential management.

---

## REC-CQ-4: Delete Empty Scaffolding

**Category:** Code Quality

**Problem:** Multiple empty directories create confusion.

**Recommendation:**
- Delete MAP_V2/03_Source/backend/ (live backend is app/)
- Delete MAP_V2/03_Source/shared/ (unused)
- Delete app/mapping/, app/matching/, app/scoring/, app/diff/ (empty)
- Keep app/intelligence/ (future use)

**Effort:** Small (30 minutes)

**Impact:** Cleaner codebase, no misleading directories.

---

# 5. Infrastructure Recommendations

## REC-INF-1: Strengthen JWT Secret

**Category:** Infrastructure

**Problem:** JWT secret is a trivial string in .env.

**Recommendation:**
- Generate cryptographically strong secret (256-bit minimum)
- Store in environment variable, not .env for production
- Implement secret rotation mechanism
- Use Azure Key Vault for production

**Effort:** Small (1 hour)

**Impact:** Prevents token forgery.

---

## REC-INF-2: Add Health Check Endpoints

**Category:** Infrastructure

**Problem:** No health check endpoints for monitoring.

**Recommendation:**
- Add GET /api/v1/health endpoint
- Add GET /api/v1/ready endpoint
- Check database connectivity in health check
- Return structured health status

**Effort:** Small (1-2 hours)

**Impact:** Enables container orchestration, monitoring.

---

## REC-INF-3: Add Rate Limiting

**Category:** Infrastructure

**Problem:** No throttling on endpoints.

**Recommendation:**
- Add slowapi or similar rate limiting middleware
- Configure per-endpoint limits
- Apply stricter limits to auth endpoints

**Effort:** Small (2-3 hours)

**Impact:** Prevents brute-force attacks.

---

## REC-INF-4: Create CI/CD Pipeline

**Category:** Infrastructure

**Problem:** Manual deployment only.

**Recommendation:**
- Create GitHub Actions workflow
- Add linting, type checking, testing stages
- Add build and deployment stages
- Configure per-environment deployment

**Effort:** Medium (3-5 days)

**Impact:** Automated, reliable releases.

---

# 6. Future Enhancement Recommendations

## REC-FUT-1: Implement Reporting Schema Tables

**Category:** Future Enhancement

**Problem:** Reporting schema exists but has 0 tables.

**Recommendation:**
- Create tables per 07_Reporting_Architecture.md
- Implement reporting service
- Create dashboard views

**Effort:** Large (2-3 weeks)

**Impact:** Structured reporting capability.

---

## REC-FUT-2: Implement AI Provider Framework

**Category:** Future Enhancement

**Problem:** AI architecture defined but not implemented.

**Recommendation:**
- Implement provider abstraction layer
- Create prompt library with governance
- Implement conversation management
- Add provider connectors (Azure OpenAI, etc.)

**Effort:** Large (3-4 weeks)

**Impact:** AI-powered insights and assistance.

---

## REC-FUT-3: Implement Containerization

**Category:** Future Enhancement

**Problem:** Docker files exist but unused.

**Recommendation:**
- Create working Dockerfiles for backend
- Create Docker Compose for local development
- Test containerized deployment
- Configure for Azure Container Apps

**Effort:** Medium (3-5 days)

**Impact:** Portable, scalable deployment.

---

## REC-FUT-4: Implement Database Migrations Framework

**Category:** Future Enhancement

**Problem:** SQL scripts manually executed, no versioning.

**Recommendation:**
- Implement Alembic for database migrations
- Create initial migration from current schema
- Establish migration workflow
- Document migration conventions

**Effort:** Medium (2-3 days)

**Impact:** Version-controlled schema changes.

---

# 7. Implementation Phases

| Phase | Recommendations | Duration | Impact |
|-------|----------------|----------|--------|
| Phase 1: Cleanup | REC-CQ-1, REC-CQ-2, REC-CQ-3, REC-CQ-4 | 1 day | Remove dead code |
| Phase 2: Layering | REC-ARCH-1, REC-ARCH-2, REC-ARCH-3, REC-ARCH-4 | 1 week | Architecture compliance |
| Phase 3: Security | REC-SEC-1, REC-SEC-2, REC-SEC-3, REC-INF-1 | 1-2 weeks | Security baseline |
| Phase 4: Infrastructure | REC-INF-2, REC-INF-3, REC-INF-4, REC-ARCH-5 | 1 week | Production readiness |
| Phase 5: Future | REC-FUT-1, REC-FUT-2, REC-FUT-3, REC-FUT-4 | 4-6 weeks | Full platform |

---

*Generated by Architecture Compliance Audit Framework v1.0*
