# INTEGRATION RUNBOOK
## Phase 08 — Repository Reference Resolution & Governance Integration

**Generated:** 2026-07-24
**Status:** APPROVED — Ready for Execution

---

## Purpose

Step-by-step runbook for integrating repository fixes, service layer changes, and governance integration.

---

## Pre-Integration Checklist

| Check | Status |
|-------|--------|
| Phase 07 approved and frozen | ✓ |
| Architectural decisions documented | ✓ |
| Branch created | [ ] |
| Backup taken | [ ] |

---

## Architectural Decisions (APPROVED)

These mappings are authoritative and supersede any previous Phase 08 documentation.

| Reference | Target Table | Rationale |
|-----------|--------------|-----------|
| `engine.systems` | `core.system_registry` | Already exists, currently maintained manually |
| `engine.controls` | `engine.control_registry` | Already exists, no need to create |
| `engine.audit_log` | `audit.audit_events` | Already created |
| `engine.approvals` | `platform.approval_requests` | Already created |
| `engine.exceptions` | `engine.migration_control_exceptions` | Already created |
| `engine.tenants` | `core.tenants` | Active table, keep, currently maintained manually |

### BLOCKED — Pending Investigation

| Reference | Status | Instruction |
|-----------|--------|-------------|
| `engine.migration_batch_lifecycle` | BLOCKED | **DO NOT invent replacement tables. DO NOT create these tables. Stop work and report findings if these references are encountered.** |
| `engine.migration_risk_scores` | BLOCKED | **DO NOT invent replacement tables. DO NOT create these tables. Stop work and report findings if these references are encountered.** |

---

## Implementation Rules

### RULE 1: Verify Target Table Schema (Enforceable)

**Before changing any repository query:**

1. Locate every reference to the incorrect table
2. Verify whether the target table provides an equivalent data source (schema, keys, and required columns)
3. If compatible, perform the replacement
4. If incompatible, stop and report the incompatibility. Do not modify the repository.

**Do not assume the replacement table has identical column names or structure.**

### RULE 2: Inspect Code First

Do not assume the code looks exactly as documented. OpenCode must inspect the actual file content before making changes. Line numbers are brittle and may have shifted.

### RULE 3: No Assumptions

Locate every reference to the incorrect table inside the repository class. Do not guess at implementation details.

### RULE 4: Verify Semantic Equivalence

A replacement table must satisfy **both** conditions:

1. **Schema compatibility** — columns, PK/FK, datatypes
2. **Business semantic compatibility** — represents the same business entity

Matching names alone are insufficient. If either condition fails, stop and report.

### RULE 5: Query Compatibility

After verifying schema compatibility, verify every selected column, filter column, JOIN column, GROUP BY column, ORDER BY column, and aggregate exists in the replacement table (or can be obtained through an existing documented relationship). If the repository query cannot be reproduced without redesigning the query, stop and report the incompatibility rather than rewriting business logic.

---

## Integration Steps

### Phase 08.1: Repository Fixes

#### Step 1: Fix `DashboardRepository`

**File:** `app/repositories/dashboard_repository.py`

**For each reference:**

1. Locate every reference to `engine.systems` inside `DashboardRepository`
2. Verify whether `core.system_registry` provides an equivalent data source (schema, keys, and required columns)
3. If compatible, perform the replacement
4. If incompatible, stop and report the incompatibility. Do not modify the repository.

5. Locate every reference to `engine.controls` inside `DashboardRepository`
6. Verify whether `engine.control_registry` provides an equivalent data source (schema, keys, and required columns)
7. If compatible, perform the replacement
8. If incompatible, stop and report the incompatibility. Do not modify the repository.

9. Locate every reference to `engine.audit_log` inside `DashboardRepository`
10. Verify whether `audit.audit_events` provides an equivalent data source (schema, keys, and required columns)
11. If compatible, perform the replacement
12. If incompatible, stop and report the incompatibility. Do not modify the repository.

**Verification:**
```bash
python -c "from app.repositories.dashboard_repository import DashboardRepository; print('Import OK')"
```

#### Step 2: Fix `GovernanceRepository`

**File:** `app/repositories/governance_repository.py`

**For each reference:**

1. Locate every reference to `engine.audit_log` inside `GovernanceRepository`
2. Verify whether `audit.audit_events` provides an equivalent data source (schema, keys, and required columns)
3. If compatible, perform the replacement
4. If incompatible, stop and report the incompatibility. Do not modify the repository.

5. Locate every reference to `engine.approvals` inside `GovernanceRepository`
6. Verify whether `platform.approval_requests` provides an equivalent data source (schema, keys, and required columns)
7. If compatible, perform the replacement
8. If incompatible, stop and report the incompatibility. Do not modify the repository.

9. Locate every reference to `engine.exceptions` inside `GovernanceRepository`
10. Verify whether `engine.migration_control_exceptions` provides an equivalent data source (schema, keys, and required columns)
11. If compatible, perform the replacement
12. If incompatible, stop and report the incompatibility. Do not modify the repository.

**Verification:**
```bash
python -c "from app.repositories.governance_repository import GovernanceRepository; print('Import OK')"
```

#### Step 3: Skip `ExecutionControlRepository` — BLOCKED (B-06)

**DO NOT invent replacement tables. DO NOT create these tables. Stop work and report findings if these references are encountered.**

#### Step 4: Skip `ValidationReportRepository` — BLOCKED (B-07)

**DO NOT invent replacement tables. DO NOT create these tables. Stop work and report findings if these references are encountered.**

---

### Phase 08.2: Service Layer Fixes

#### Step 5: Fix `DashboardService`

**File:** `app/services/dashboard_service.py`

**Task:** Remove silent exception handling from `get_portfolio_summary`, `get_kpis`, and `get_activity` methods.

**Before each change:**
1. Inspect the actual file content
2. Identify the try/except blocks
3. Remove the try/except and let errors propagate

**Verification:**
```bash
python -c "from app.services.dashboard_service import DashboardService; print('Import OK')"
```

#### Step 6: Fix `GovernanceService`

**File:** `app/services/governance_service.py`

**Task:** Remove silent exception handling from `get_audit_log`, `get_approvals`, and `get_exceptions` methods.

**Before each change:**
1. Inspect the actual file content
2. Identify the try/except blocks
3. Remove the try/except and let errors propagate

**Verification:**
```bash
python -c "from app.services.governance_service import GovernanceService; print('Import OK')"
```

---

### Phase 08.3: Governance Integration

#### Step 7: Integrate Governance Layers

**Decision Required:** How to integrate v1.9 governance with new API governance?

**Options:**
1. Keep separate — no integration
2. Merge into single layer
3. Create adapter layer

**Files involved:**
- `app/governance/decision_engine.py` (v1.9)
- `app/governance/risk_scoring.py` (v1.9)
- `app/repositories/governance_repository.py` (new)
- `app/services/governance_service.py` (new)

---

### Phase 08.4: Validation

#### Step 8: Run Backend Tests

```bash
python -m pytest tests/ -v --tb=short
```

**Expected:** 195 tests pass

#### Step 9: Run Frontend Tests

```bash
cd app/frontend && npm test
```

**Expected:** 248 tests pass

#### Step 10: Run E2E Verification

```bash
python -m pytest tests/test_e2e.py -v
```

**Expected:** 7/7 endpoints OK

#### Step 11: Verify KPI Endpoints

```bash
# Start server
python -m uvicorn app.api.main:app --reload

# Test endpoints
curl -X GET "http://localhost:8000/api/v1/dashboard/portfolio" \
  -H "Authorization: Bearer <token>"

curl -X GET "http://localhost:8000/api/v1/dashboard/kpis" \
  -H "Authorization: Bearer <token>"

curl -X GET "http://localhost:8000/api/v1/dashboard/activity" \
  -H "Authorization: Bearer <token>"
```

**Expected:** All return `{"success": true, "data": {...}}`

#### Step 12: Verify Governance Endpoints

```bash
curl -X GET "http://localhost:8000/api/v1/governance/audit" \
  -H "Authorization: Bearer <token>"

curl -X GET "http://localhost:8000/api/v1/governance/approvals" \
  -H "Authorization: Bearer <token>"

curl -X GET "http://localhost:8000/api/v1/governance/exceptions" \
  -H "Authorization: Bearer <token>"
```

**Expected:** All return `{"success": true, "data": {...}}`

---

## Post-Integration Checklist

| Check | Status |
|-------|--------|
| 5 incorrect references resolved | [ ] |
| Target table schemas verified | [ ] |
| Semantic equivalence verified | [ ] |
| KPI endpoints return data | [ ] |
| Governance endpoints return data | [ ] |
| Backend tests pass (195) | [ ] |
| Frontend tests pass (248) | [ ] |
| E2E verification passes | [ ] |
| No silent exception handling | [ ] |
| Code committed | [ ] |
| PR created | [ ] |

---

## Rollback Procedure

If integration fails:

```bash
# Revert all changes
git reset --hard HEAD~1

# Or revert specific files
git checkout HEAD~1 -- app/repositories/
git checkout HEAD~1 -- app/services/
```

---

## Contact

| Role | Contact |
|------|---------|
| Architect | [Pending] |
| Developer | [Pending] |
| QA | [Pending] |

---

**Document Generated:** 2026-07-24
**Status:** APPROVED — Ready for Execution
