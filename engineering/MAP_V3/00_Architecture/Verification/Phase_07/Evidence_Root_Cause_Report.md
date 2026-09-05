# EVIDENCE & ROOT CAUSE REPORT
## KPI Repository Incorrect Table References

**Generated:** 2026-07-24
**Status:** EVIDENCE ONLY - No changes authorised
**Scope:** Why KPI repositories reference tables that do not exist

---

## Executive Summary

The incorrect table references (`engine.systems`, `engine.controls`, `engine.audit_log`, `engine.approvals`, `engine.exceptions`) exist in **untracked files** that were never committed to git. These are newly created files on the `feature/workstream-05-task_management` branch, written against a planned schema that was never implemented.

**Root Cause:** Two independent governance designs were created without integration:
1. **v1.9 roadmap governance** (planned): `migration_control_decisions`, `migration_risk_scores`, `tenants`
2. **New API governance** (implemented): `audit_log`, `approvals`, `exceptions`

The new API governance references tables that were never defined in any SQL file.

---

## SECTION 1: Dashboard Repository References

### 1.1 engine.systems

| Attribute | Evidence |
|-----------|----------|
| **File** | `app/repositories/dashboard_repository.py:10` |
| **SQL** | `SELECT COUNT(*) FROM engine.systems` |
| **Git Status** | UNTRACKED (never committed) |
| **Git History** | Zero commits across all branches |
| **First Appeared** | Unknown (no git history) |
| **Was it ever implemented?** | NO - table never existed in any schema |
| **Intended Design** | Count systems for dashboard portfolio summary |
| **Actual Table** | `engine_v14.systems` (legacy schema) or `core.system_registry` (current) |
| **Classification** | **Coding Bug** - incorrect table name |

**Evidence:**
- `git status app/repositories/dashboard_repository.py` → Untracked
- `git log --follow --all --oneline -- app/repositories/dashboard_repository.py` → Empty
- `SELECT * FROM information_schema.tables WHERE table_name = 'systems' AND table_schema = 'engine'` → 0 rows
- `engine_backup.sql:1739` shows `CREATE TABLE engine_v14.systems` (different schema)

### 1.2 engine.controls

| Attribute | Evidence |
|-----------|----------|
| **File** | `app/repositories/dashboard_repository.py:27` |
| **SQL** | `SELECT COUNT(*) FROM engine.controls` |
| **Git Status** | UNTRACKED (never committed) |
| **Git History** | Zero commits across all branches |
| **First Appeared** | Unknown (no git history) |
| **Was it ever implemented?** | NO - table never existed in any schema |
| **Intended Design** | Count controls for dashboard portfolio summary |
| **Actual Table** | `engine.control_registry` (defined in `sql/schema/01_engine_schema.sql:6`) |
| **Classification** | **Coding Bug** - incorrect table name |

**Evidence:**
- `git status app/repositories/dashboard_repository.py` → Untracked
- `git log --follow --all --oneline -- app/repositories/dashboard_repository.py` → Empty
- `SELECT * FROM information_schema.tables WHERE table_name = 'controls' AND table_schema = 'engine'` → 0 rows
- `sql/schema/01_engine_schema.sql:6` shows `CREATE TABLE engine.control_registry` (different name)

### 1.3 engine.audit_log (Dashboard)

| Attribute | Evidence |
|-----------|----------|
| **File** | `app/repositories/dashboard_repository.py:40` |
| **SQL** | `SELECT id, action, entity_type, entity_id, user_email, timestamp FROM engine.audit_log ORDER BY timestamp DESC LIMIT %s` |
| **Git Status** | UNTRACKED (never committed) |
| **Git History** | Zero commits across all branches |
| **First Appeared** | Unknown (no git history) |
| **Was it ever implemented?** | NO - table never existed in any schema |
| **Intended Design** | Display recent activity feed on dashboard |
| **Actual Table** | `audit.audit_events` (defined in `MAP_V2/03_Source/database/create_audit_schema.sql:13`) |
| **Classification** | **Incomplete Implementation** - table planned but never created |

**Evidence:**
- `git status app/repositories/dashboard_repository.py` → Untracked
- `git log --follow --all --oneline -- app/repositories/dashboard_repository.py` → Empty
- `SELECT * FROM information_schema.tables WHERE table_name = 'audit_log' AND table_schema = 'engine'` → 0 rows
- `MAP_V2/03_Source/database/create_audit_schema.sql:13` shows `CREATE TABLE audit.audit_events` (different schema and name)

---

## SECTION 2: Governance Repository References

### 2.1 engine.audit_log (Governance)

| Attribute | Evidence |
|-----------|----------|
| **File** | `app/repositories/governance_repository.py:19` |
| **SQL** | `SELECT id, action, entity_type, entity_id, user_email, timestamp, details FROM engine.audit_log WHERE 1=1` |
| **Git Status** | UNTRACKED (never committed) |
| **Git History** | Zero commits across all branches |
| **First Appeared** | Unknown (no git history) |
| **Was it ever implemented?** | NO - table never existed in any schema |
| **Intended Design** | Governance audit trail for compliance reporting |
| **Actual Table** | `audit.audit_events` (different schema and column names) |
| **Classification** | **Incomplete Implementation** - table planned but never created |

**Evidence:**
- Same as Section 1.3 above
- Additionally: `governance_repository.py` also untracked

### 2.2 engine.approvals

| Attribute | Evidence |
|-----------|----------|
| **File** | `app/repositories/governance_repository.py:39` |
| **SQL** | `SELECT id, entity_type, entity_id, status, requested_by, created_at FROM engine.approvals WHERE status = 'PENDING'` |
| **Git Status** | UNTRACKED (never committed) |
| **Git History** | Zero commits across all branches |
| **First Appeared** | Unknown (no git history) |
| **Was it ever implemented?** | NO - table never existed in any schema |
| **Intended Design** | Track pending approval requests for governance workflow |
| **Actual Table** | `platform.approval_requests` (different schema, different columns) |
| **Classification** | **Incomplete Implementation** - table planned but never created |

**Evidence:**
- `git status app/repositories/governance_repository.py` → Untracked
- `git log --follow --all --oneline -- app/repositories/governance_repository.py` → Empty
- `SELECT * FROM information_schema.tables WHERE table_name = 'approvals' AND table_schema = 'engine'` → 0 rows
- `platform.approval_requests` exists but has different columns (no `entity_type`, `entity_id`, `requested_by`)

### 2.3 engine.exceptions

| Attribute | Evidence |
|-----------|----------|
| **File** | `app/repositories/governance_repository.py:55` |
| **SQL** | `SELECT id, entity_type, entity_id, reason, status, requested_by, created_at FROM engine.exceptions WHERE status = 'OPEN'` |
| **Git Status** | UNTRACKED (never committed) |
| **Git History** | Zero commits across all branches |
| **First Appeared** | Unknown (no git history) |
| **Was it ever implemented?** | NO - table never existed in any schema |
| **Intended Design** | Track open exception requests for governance workflow |
| **Actual Table** | `engine.migration_control_exceptions` (different semantics) |
| **Classification** | **Incomplete Implementation** - table planned but never created |

**Evidence:**
- `git status app/repositories/governance_repository.py` → Untracked
- `git log --follow --all --oneline -- app/repositories/governance_repository.py` → Empty
- `SELECT * FROM information_schema.tables WHERE table_name = 'exceptions' AND table_schema = 'engine'` → 0 rows
- `engine.migration_control_exceptions` exists but has different purpose (control execution failures vs governance exception requests)

---

## SECTION 3: Additional Incorrect References

### 3.1 engine.migration_batch_lifecycle

| Attribute | Evidence |
|-----------|----------|
| **File** | `app/repositories/execution_control_repository.py:34,42` |
| **SQL** | `SELECT ... FROM engine.migration_batch_lifecycle` and `INSERT INTO engine.migration_batch_lifecycle` |
| **Git Status** | UNTRACKED (never committed) |
| **Git History** | Zero commits across all branches |
| **First Appeared** | Unknown (no git history) |
| **Was it ever implemented?** | NO - table never existed in any schema |
| **Intended Design** | Track lifecycle events (CANCELLED, PAUSED, RESUMED, RETRY) for batches |
| **Actual Table** | None - needs to be created |
| **Classification** | **Incomplete Implementation** - table planned but never created |

### 3.2 engine.migration_risk_scores

| Attribute | Evidence |
|-----------|----------|
| **File** | `app/repositories/validation_report_repository.py:61` |
| **SQL** | `SELECT batch_id, risk_score, risk_level, calculated_timestamp FROM engine.migration_risk_scores` |
| **Git Status** | UNTRACKED (never committed) |
| **Git History** | Zero commits across all branches |
| **First Appeared** | Unknown (no git history) |
| **Was it ever implemented?** | Defined in `install_governance_tables.sql:34` but never executed |
| **Intended Design** | Persist risk score calculations for batches |
| **Actual Table** | None - SQL exists but was never run |
| **Classification** | **Incomplete Implementation** - DDL exists but table not created |

---

## SECTION 4: Root Cause Analysis

### 4.1 Why Do These References Exist?

**Two independent governance designs were created without integration:**

| Design | Tables | Status | Location |
|--------|--------|--------|----------|
| v1.9 Roadmap Governance | `migration_control_decisions`, `migration_risk_scores`, `tenants` | DDL exists, never executed | `app/installer/install_governance_tables.sql` |
| New API Governance | `audit_log`, `approvals`, `exceptions` | No DDL, never created | `app/repositories/governance_repository.py` |

**The new API governance layer was written against tables that were planned but never defined in SQL.**

### 4.2 Was It an Uncommitted Implementation, Incomplete Implementation, or Obsolete Design?

| Reference | Classification | Evidence |
|-----------|----------------|----------|
| `engine.systems` | **Uncommitted Implementation** | Table name does not match current schema; could be `engine_v14.systems` or `core.system_registry` |
| `engine.controls` | **Uncommitted Implementation** | Table name does not match current schema; could be `engine.control_registry` |
| `engine.audit_log` | **Incomplete Implementation** | Table planned but never created |
| `engine.approvals` | **Incomplete Implementation** | Table planned but never created |
| `engine.exceptions` | **Incomplete Implementation** | Table planned but never created |
| `engine.migration_batch_lifecycle` | **Incomplete Implementation** | Table planned but never created |
| `engine.migration_risk_scores` | **Incomplete Implementation** | DDL exists but never executed |

### 4.3 Why Were These Files Never Committed?

The `app/repositories/` directory is entirely untracked. This suggests:
1. These files were created locally during development
2. They were never staged or committed to git
3. The developer may have been waiting for the governance tables to be created first
4. The silent error handling (try/except returning empty data) masked the runtime failures

### 4.4 Why Does Silent Error Handling Mask the Problem?

```python
# app/services/dashboard_service.py:9-20
def get_portfolio_summary(self):
    try:
        total_systems = self.repository.get_system_count()  # FAILS
        total_batches, active_batches = self.repository.get_batch_stats()
        total_controls = self.repository.get_total_controls()  # FAILS
        return {...}
    except Exception:
        return {
            "total_systems": 0,  # Returns 0 instead of error
            "total_batches": 0,
            "total_controls": 0,
            "active_batches": 0
        }
```

The `except Exception` block catches the "relation does not exist" error and returns zeros, making the API appear to work when it's actually failing.

---

## SECTION 5: Architectural Disconnect

### 5.1 v1.9 Roadmap Governance

**Source:** `release/v1_8/Migration_platform_governance.md`

**Planned tables:**
- `engine.migration_control_decisions` - Human decisions on controls
- `engine.migration_risk_scores` - Risk score calculations
- `engine.tenants` - Multi-tenant support

**Status:** DDL exists in `install_governance_tables.sql` but was never executed.

**Modules created:**
- `app/governance/risk_scoring.py` - Writes to `migration_risk_scores`
- `app/governance/decision_engine.py` - Writes to `migration_control_decisions`

### 5.2 New API Governance

**Planned tables:**
- `engine.audit_log` - Business activity audit trail
- `engine.approvals` - Pending approval requests
- `engine.exceptions` - Open exception requests

**Status:** No DDL exists. Tables were never created.

**Modules created:**
- `app/repositories/governance_repository.py` - Queries the three tables
- `app/services/governance_service.py` - Business logic layer
- `app/api/routes/governance_routes.py` - REST API endpoints

### 5.3 The Disconnect

The v1.9 governance module (`app/governance/`) and the new API governance module (`app/repositories/` + `app/services/` + `app/api/routes/`) are **completely independent**. They:
- Reference different tables
- Have no code-level integration
- Were designed at different times
- Serve different purposes (risk scoring vs compliance API)

---

## SECTION 6: Evidence Summary

### 6.1 Git Evidence

| File | Status | Git Log |
|------|--------|---------|
| `app/repositories/dashboard_repository.py` | UNTRACKED | Empty |
| `app/repositories/governance_repository.py` | UNTRACKED | Empty |
| `app/repositories/validation_report_repository.py` | UNTRACKED | Empty |
| `app/repositories/execution_control_repository.py` | UNTRACKED | Empty |
| `app/services/dashboard_service.py` | UNTRACKED | Empty |
| `app/services/governance_service.py` | UNTRACKED | Empty |

### 6.2 Database Evidence

| Table | Exists in DB | Has DDL | Has Python Refs |
|-------|--------------|---------|-----------------|
| `engine.systems` | NO | NO | YES (untracked) |
| `engine.controls` | NO | NO | YES (untracked) |
| `engine.audit_log` | NO | NO | YES (untracked) |
| `engine.approvals` | NO | NO | YES (untracked) |
| `engine.exceptions` | NO | NO | YES (untracked) |
| `engine.migration_batch_lifecycle` | NO | NO | YES (untracked) |
| `engine.migration_risk_scores` | NO | YES (unexecuted) | YES (untracked) |

### 6.3 Service Layer Evidence

All service methods catch exceptions and return empty/zero data:
- `dashboard_service.py:21` → `except Exception: return {...zeros...}`
- `governance_service.py:24` → `except Exception: return {"entries": [], "total": 0}`
- `validation_report_service.py:64` → Falls back to ScoringEngine calculation

---

## SECTION 7: Conclusion

### 7.1 Root Cause

The incorrect table references are caused by **incomplete implementation** of the governance feature. The new API governance layer was written against tables that were planned but never defined in SQL.

### 7.2 Classification

| Reference | Type | Description |
|-----------|------|-------------|
| `engine.systems` | Coding Bug | Wrong table name |
| `engine.controls` | Coding Bug | Wrong table name |
| `engine.audit_log` | Incomplete Implementation | Table planned but never created |
| `engine.approvals` | Incomplete Implementation | Table planned but never created |
| `engine.exceptions` | Incomplete Implementation | Table planned but never created |
| `engine.migration_batch_lifecycle` | Incomplete Implementation | Table planned but never created |
| `engine.migration_risk_scores` | Incomplete Implementation | DDL exists but never executed |

### 7.3 Why It Wasn't Caught

1. Files are untracked (never committed)
2. Service layer silently catches exceptions
3. No startup validation of SQL queries
4. Tests mock the repository layer (never hit the database)

---

**Document Generated:** 2026-07-24
**Status:** EVIDENCE ONLY - No changes authorised
