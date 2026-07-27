# OPENCODE EXECUTION GUIDE
## Phase 08 — Repository Reference Resolution

**Generated:** 2026-07-24
**Status:** APPROVED — Ready for Execution

---

## Purpose

This guide provides step-by-step instructions for OpenCode to execute Phase 08 tasks.

---

## Prerequisites

| Prerequisite | Status |
|--------------|--------|
| Phase 07 approved and frozen | ✓ |
| Architectural decisions documented | ✓ |
| Git branch created | Pending |

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

### RULE 18: Frontend Traceability (Capability Matrix)

**Every frontend feature must be traceable to exactly one authoritative MAP CLI business capability.**

#### Business Capability First

The frontend must bind to the authoritative MAP CLI **business capability**, not to a table name. Tables are implementation details. The authoritative source is the table currently populated by MAP CLI that best represents the business function. If no authoritative source exists, the feature must be marked **Not Implementable** rather than inventing new storage.

#### Implementation Checklist

Before implementing any dashboard or API endpoint, OpenCode must:

1. **Identify** the authoritative MAP CLI table that provides the data
2. **Verify** the table is actively populated (database evidence + source code)
3. **Trace** the Python code that writes to it (file:function:line)
4. **Confirm** it has not been superseded by another table (RULE 17 check)
5. **Record** the mapping in the `MAP_CLI_Frontend_Capability_Matrix.md`

**No implementation may proceed until this matrix entry exists.**

#### Required Matrix Columns

The matrix must include:
- Frontend Feature (card, page, or API endpoint)
- Business Capability (what the feature does)
- Original Table (what the code currently references)
- MAP CLI Authoritative Table (the actual table MAP CLI writes to)
- Row Count (evidence of active population)
- Last Populated (timestamp of most recent write)
- Populated By (Python file:function:line)
- Status (VERIFIED / NEEDS FIX / BLOCKED / Not Implementable)

#### Empty Features

If a frontend feature maps to a table that:
- Has 0 rows
- Is not populated by MAP CLI
- Has no defined business requirement

Then the feature must be flagged for **removal review** rather than kept as empty scaffolding.

This eliminates imaginary tables forever, prevents duplicate functionality, and makes every dashboard value origin deterministic.

### RULE 19: Preserve Functional Fidelity

Any frontend endpoint implemented during Phase 08 must faithfully represent the capabilities of the underlying MAP CLI source.

**Missing data must be reported as unavailable rather than inferred, synthesized, defaulted, or fabricated.**

The frontend may expose a subset of available functionality but must never imply functionality that MAP CLI does not currently provide.

#### Implementation Requirements

- If a column does not exist in the MAP CLI table, the frontend must not display a value for it
- If a row does not exist, the frontend must show "No data available" — not a default or placeholder
- If a business capability is not implemented by MAP CLI, the frontend must mark it "Not implemented" — not fabricate results
- If a table has 0 rows, the frontend must show empty state — not generate synthetic data
- If a field is not populated by MAP CLI code, the frontend must not assume a value

#### Prohibited Patterns

- Defaulting missing fields to arbitrary values (e.g., `status = "UNKNOWN"`, `score = 0`)
- Generating placeholder data to make dashboards look populated
- Inferring business decisions from unrelated tables
- Synthesizing lifecycle events from partial data
- Creating "fallback" logic that invents data when the source is empty

This rule ensures the frontend is a faithful window into MAP CLI behaviour, not a fabrication layer.

---

## Stop Conditions

**OpenCode MUST stop and report if it encounters ANY of the following:**

- Missing columns in replacement table
- Missing joins required by the query
- Incompatible primary keys
- Changed business semantics
- Required business logic rewrite
- Replacement requiring SQL redesign
- Uncertainty about any aspect of the replacement

**No guessing. No assumptions. No rewrites without explicit approval.**

---

## Execution Steps

### Phase 08.0: Repository Discovery

**Before any code modification, generate a Repository Inventory for each repository.**

#### Step 0.1: Discover `DashboardRepository`

**File:** `app/repositories/dashboard_repository.py`

**Task:**
1. Locate every SQL query in `DashboardRepository`
2. List referenced tables
3. List referenced columns
4. Map to replacement candidates
5. Verify replacement schema
6. Verify business semantics
7. Decide: Compatible / Incompatible / Blocked

**Output:** Repository Inventory Table

#### Step 0.2: Discover `GovernanceRepository`

**File:** `app/repositories/governance_repository.py`

**Task:**
1. Locate every SQL query in `GovernanceRepository`
2. List referenced tables
3. List referenced columns
4. Map to replacement candidates
5. Verify replacement schema
6. Verify business semantics
7. Decide: Compatible / Incompatible / Blocked

**Output:** Repository Inventory Table

#### Step 0.3: Discover `ExecutionControlRepository`

**File:** `app/repositories/execution_control_repository.py`

**Task:**
1. Locate every SQL query in `ExecutionControlRepository`
2. List referenced tables
3. List referenced columns
4. Mark as BLOCKED (B-06)

**Output:** Repository Inventory Table

#### Step 0.4: Discover `ValidationReportRepository`

**File:** `app/repositories/validation_report_repository.py`

**Task:**
1. Locate every SQL query in `ValidationReportRepository`
2. List referenced tables
3. List referenced columns
4. Mark as BLOCKED (B-07)

**Output:** Repository Inventory Table

**Only compatible repositories move to implementation.**

---

### Phase 08.1: Repository Fixes

#### Step 1: Create Branch

```bash
git checkout -b feature/phase-08-repository-fixes
```

#### Step 2: Fix `DashboardRepository`

**File:** `app/repositories/dashboard_repository.py`

**For each compatible reference from Phase 08.0:**

1. Verify the repository query can be reproduced against the approved replacement table without changing business behaviour
2. If reproducible, perform the replacement
3. If not reproducible, produce an incompatibility report instead of modifying the repository

**Verification:**
```bash
python -c "from app.repositories.dashboard_repository import DashboardRepository; print('Import OK')"
```

#### Step 3: Fix `GovernanceRepository`

**File:** `app/repositories/governance_repository.py`

**For each compatible reference from Phase 08.0:**

1. Verify the repository query can be reproduced against the approved replacement table without changing business behaviour
2. If reproducible, perform the replacement
3. If not reproducible, produce an incompatibility report instead of modifying the repository

**Verification:**
```bash
python -c "from app.repositories.governance_repository import GovernanceRepository; print('Import OK')"
```

#### Step 4: Skip `ExecutionControlRepository` — BLOCKED (B-06)

**DO NOT invent replacement tables. DO NOT create these tables. Stop work and report findings if these references are encountered.**

#### Step 5: Skip `ValidationReportRepository` — BLOCKED (B-07)

**DO NOT invent replacement tables. DO NOT create these tables. Stop work and report findings if these references are encountered.**

#### Step 6: Run Repository Tests

```bash
python -m pytest tests/test_repository*.py -v --tb=short
```

**Only proceed to Phase 08.2 after repository tests pass.**

---

### Phase 08.2: Service Layer Fixes

**Only begin after Phase 08.1 repository fixes are verified.**

#### Step 7: Fix `DashboardService`

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

#### Step 8: Fix `GovernanceService`

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

### Phase 08.3: Validation

#### Step 9: Run Backend Tests

```bash
python -m pytest tests/ -v --tb=short
```

**Expected:** 195 tests pass

#### Step 10: Run Frontend Tests

```bash
cd app/frontend && npm test
```

**Expected:** 248 tests pass

#### Step 11: Run E2E Verification

```bash
python -m pytest tests/test_e2e.py -v
```

**Expected:** 7/7 endpoints OK

#### Step 12: Verify KPI Endpoints Return Correct Business Data

```bash
# Test portfolio endpoint
curl -X GET "http://localhost:8000/api/v1/dashboard/portfolio" \
  -H "Authorization: Bearer <token>"

# Verify: total_systems > 0, total_batches > 0, total_controls > 0
```

```bash
# Test KPIs endpoint
curl -X GET "http://localhost:8000/api/v1/dashboard/kpis" \
  -H "Authorization: Bearer <token>"

# Verify: kpis array contains valid KPI objects with non-null values
```

```bash
# Test activity endpoint
curl -X GET "http://localhost:8000/api/v1/dashboard/activity" \
  -H "Authorization: Bearer <token>"

# Verify: entries array contains valid activity entries
```

#### Step 13: Verify Governance Endpoints Return Correct Business Data

```bash
curl -X GET "http://localhost:8000/api/v1/governance/audit" \
  -H "Authorization: Bearer <token>"

# Verify: entries array contains valid audit entries
```

```bash
curl -X GET "http://localhost:8000/api/v1/governance/approvals" \
  -H "Authorization: Bearer <token>"

# Verify: pending array contains valid approval objects
```

```bash
curl -X GET "http://localhost:8000/api/v1/governance/exceptions" \
  -H "Authorization: Bearer <token>"

# Verify: exceptions array contains valid exception objects
```

---

### Phase 08.4: Commit

#### Step 14: Commit Changes

```bash
git add .
git commit -m "fix: resolve repository references and remove silent exception handling

- Verify 5 repository queries against approved replacement tables
- engine.systems → core.system_registry
- engine.controls → engine.control_registry
- engine.audit_log → audit.audit_events
- engine.approvals → platform.approval_requests
- engine.exceptions → engine.migration_control_exceptions
- Remove silent exception handling in dashboard/governance services
- All tests passing (195 backend, 248 frontend)
- KPI endpoints return correct business data

Note: B-06 (engine.migration_batch_lifecycle) and B-07 (engine.migration_risk_scores) 
remain BLOCKED pending investigation."
```

---

## Validation Checklist

| Check | Status |
|-------|--------|
| Repository discovery complete | [ ] |
| Repository inventory generated | [ ] |
| 5 incorrect references verified | [ ] |
| Query compatibility verified | [ ] |
| KPI endpoints return correct business data | [ ] |
| Governance endpoints return correct business data | [ ] |
| Backend tests pass (195) | [ ] |
| Frontend tests pass (248) | [ ] |
| E2E verification passes | [ ] |
| No silent exception handling | [ ] |
| No repository query redesigned without approval | [ ] |

---

## Rollback Plan

If issues arise:

```bash
git rollback HEAD~1
```

Or revert specific files:

```bash
git checkout HEAD~1 -- app/repositories/dashboard_repository.py
git checkout HEAD~1 -- app/repositories/governance_repository.py
git checkout HEAD~1 -- app/services/dashboard_service.py
git checkout HEAD~1 -- app/services/governance_service.py
```

---

**Document Generated:** 2026-07-24
**Status:** APPROVED — Ready for Execution
