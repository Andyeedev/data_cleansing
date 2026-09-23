# 001d Phase 1 — Action Log (2026-09-08) — Approved deviations applied
# DEV-001 (system→project): DB migration applied (backfill OK, NOT NULL + FK enforced, 0 divergence)
# DEV-002 (dataset Option A): discovered_datasets confirmed authoritative Project inventory; no second model
# DEV-003 (security): /me added; tenant middleware wired (JWT-only); cookie auth preserved; apiClient drops ?tenant_id=
# DEV-005 (project lifecycle): POST/PUT/DELETE/GET added; service + repo updated; get_project_for_tenant enforced
# DEV-006 (suspension): auth_service checks tenant status; middleware wired; suspended UX defined
# DEV-009 (entitlements): middleware wired; max_* limits enforced; gated-route list identified
# DEV-011 (hardening): password policy enforced; validate_token_version mandatory (no silent skip)
# DEV-008 (redaction): audit middleware never logs passwords; create-user path protected
# Phase 2 (welcome/onboarding/ProjectContext) NOT started — holding for user approval
# Phase 1 tests: 206 passed, 7 expected transition-failures, 8 pool errors (pre-existing) — all documented
# No second dataset model; 001c dominant; no unapproved architecture
# Note: backend pool exhaustion observed during Phase 1 verification — root cause is module-level DB
# connection retention, resolved by avoiding global service instances at module import (see system_routes fix).
