# FINAL EVIDENCE PASS
## Phase 07 - Evidence-Based Root Cause Analysis

**Generated:** 2026-07-24
**Status:** EVIDENCE ONLY - No assumptions
**Standard:** Every claim backed by source code, git history, SQL DDL, documentation, or runtime evidence

---

## SECTION 1: UNTRACKED FILES - ARE THEY ACTUALLY USED?

### 1.1 Git Evidence

| File | `git status` | `git log` | Branch |
|------|--------------|-----------|--------|
| `app/repositories/dashboard_repository.py` | UNTRACKED | Empty | `feature/workstream-05-task_management` |
| `app/repositories/governance_repository.py` | UNTRACKED | Empty | `feature/workstream-05-task_management` |
| `app/repositories/validation_report_repository.py` | UNTRACKED | Empty | `feature/workstream-05-task_management` |
| `app/repositories/execution_control_repository.py` | UNTRACKED | Empty | `feature/workstream-05-task_management` |
| `app/services/dashboard_service.py` | UNTRACKED | Empty | `feature/workstream-05-task_management` |
| `app/services/governance_service.py` | UNTRACKED | Empty | `feature/workstream-05-task_management` |

### 1.2 Runtime Import Evidence

**Source:** `app/api/main.py:14-37` (eager imports at module level)

```python
from app.api.routes import (
    dashboard_routes,      # Line 36
    governance_routes,     # Line 35
    validation_report_routes,  # Line 30
    execution_control_routes,  # Line 33
    ...
)
```

**Source:** `app/api/main.py:177-178` (router registration)

```python
app.include_router(governance_routes.router)    # Line 177
app.include_router(dashboard_routes.router)     # Line 178
```

### 1.3 Import Chain Evidence

| Route Module | Service Import | Repository Import |
|--------------|----------------|-------------------|
| `dashboard_routes.py:4` | `from app.services.dashboard_service import DashboardService` | `dashboard_service.py:1` → `dashboard_repository.py:1` |
| `governance_routes.py:4` | `from app.services.governance_service import GovernanceService` | `governance_service.py:1` → `governance_repository.py:1` |
| `validation_report_routes.py:10` | `from app.services.validation_report_service import ValidationReportService` | `validation_report_service.py:1` → `validation_report_repository.py:1` |
| `execution_control_routes.py:9` | `from app.services.execution_control_service import ExecutionControlService` | `execution_control_service.py:1` → `execution_control_repository.py:1` |

### 1.4 Conclusion

**The untracked files ARE used at runtime.** The application imports them eagerly at startup via `app/api/main.py`. The import chain is:

```
main.py → routes → services → repositories (untracked)
```

**Why they're untracked:** These files were created locally but never committed to git. The application uses them because FastAPI loads all route modules at startup.

---

## SECTION 2: WERE engine.audit_log / approvals / exceptions PLANNED?

### 2.1 Documentation Evidence

**Source:** `release/v1_8/Migration_platform_governance.md` (v1.9 Roadmap)

**Planned tables (from documentation):**
| Table | Line | Status |
|-------|------|--------|
| `engine.migration_risk_scores` | Line 170 | DDL exists in `install_governance_tables.sql:34` |
| `engine.migration_control_decisions` | Line 180 | DDL exists in `install_governance_tables.sql:11` |
| `engine.tenants` | Line 190 | DDL exists in `install_governance_tables.sql:49` |

**NOT mentioned in documentation:**
| Table | Evidence |
|-------|----------|
| `engine.audit_log` | **NOT in v1.9 roadmap** |
| `engine.approvals` | **NOT in v1.9 roadmap** |
| `engine.exceptions` | **NOT in v1.9 roadmap** |

### 2.2 DDL Evidence

| Table | Has DDL? | Location |
|-------|----------|----------|
| `engine.migration_risk_scores` | YES | `app/installer/install_governance_tables.sql:34` |
| `engine.migration_control_decisions` | YES | `app/installer/install_governance_tables.sql:11` |
| `engine.tenants` | YES | `app/installer/install_governance_tables.sql:49` |
| `engine.audit_log` | **NO** | No DDL found anywhere |
| `engine.approvals` | **NO** | No DDL found anywhere |
| `engine.exceptions` | **NO** | No DDL found anywhere |

### 2.3 Conclusion

**`engine.audit_log`, `engine.approvals`, `engine.exceptions` were NEVER planned in any documentation.** They are NOT part of the v1.9 roadmap. They have no DDL definitions anywhere in the codebase.

**`engine.migration_risk_scores`, `engine.migration_control_decisions`, `engine.tenants` WERE planned** in the v1.9 roadmap and have DDL definitions, but were never executed.

---

## SECTION 3: WAS engine.systems A CODING BUG?

### 3.1 Evidence

| Evidence Type | Finding |
|---------------|---------|
| Git History | Zero commits for `dashboard_repository.py` |
| DDL | No `CREATE TABLE engine.systems` anywhere |
| Runtime | `SELECT COUNT(*) FROM engine.systems` → "relation does not exist" |
| Alternative | `engine_v14.systems` exists in `engine_backup.sql:1739` |
| Alternative | `core.system_registry` exists and is used by `connection_resolver.py:109` |

### 3.2 Was the Developer Intending core.system_registry?

**Evidence:** No direct evidence of developer intent. However:
- `core.system_registry` is the only system registry table used by the runtime execution engine
- `connection_resolver.py:109` queries `core.system_registry` for connection resolution
- The query `SELECT COUNT(*) FROM engine.systems` has no WHERE clause, suggesting it was meant to count all systems

### 3.3 Conclusion

**Cannot prove developer intent.** The table name `engine.systems` does not match any existing table. It could be:
- An uncommitted implementation (wrong schema prefix)
- An incomplete implementation (table planned but never created)
- An obsolete design (referencing a removed table)

**Evidence suggests an uncommitted implementation** because `engine_v14.systems` exists with the same name in a different schema, and `core.system_registry` is the current runtime table.

---

## SECTION 4: SERVICE LAYER EXCEPTION HANDLING

### 4.1 Dashboard Service

**Source:** `app/services/dashboard_service.py`

| Method | try/except | Success Return | Exception Default |
|--------|------------|----------------|-------------------|
| `get_portfolio_summary` (line 9) | YES (`except Exception` line 21) | `{"total_systems": N, "total_batches": N, ...}` | `{"total_systems": 0, "total_batches": 0, "total_controls": 0, "active_batches": 0}` |
| `get_kpis` (line 29) | YES (`except Exception` line 42) | `{"kpis": [...]}` | `{"kpis": []}` |
| `get_activity` (line 45) | YES (`except Exception` line 59) | `{"entries": [...], "total": N}` | `{"entries": [], "total": 0}` |

### 4.2 Governance Service

**Source:** `app/services/governance_service.py`

| Method | try/except | Success Return | Exception Default |
|--------|------------|----------------|-------------------|
| `get_audit_log` (line 9) | YES (`except Exception` line 24) | `{"entries": [...], "total": N}` | `{"entries": [], "total": 0}` |
| `get_approvals` (line 27) | YES (`except Exception` line 41) | `{"pending": [...], "total": N}` | `{"pending": [], "total": 0}` |
| `get_exceptions` (line 44) | YES (`except Exception` line 59) | `{"exceptions": [...], "total": N}` | `{"exceptions": [], "total": 0}` |
| `get_compliance_status` (line 62) | **NO** | Hardcoded `{"score": None, ...}` | N/A |

### 4.3 Validation Report Service

**Source:** `app/services/validation_report_service.py`

| Method | try/except | Exception Behavior |
|--------|------------|-------------------|
| `get_validation_report` (line 11) | **NO** | Raises to caller |
| `get_governance_decision` (line 50) | **NO** | Raises to caller |
| `get_risk_score` (line 64) | **NO** | Raises to caller |
| `get_compliance_checks` (line 94) | **NO** | Raises to caller |

### 4.4 Execution Control Service

**Source:** `app/services/execution_control_service.py`

| Method | try/except | Exception Behavior |
|--------|------------|-------------------|
| `cancel_execution` (line 10) | **NO** | Raises to caller |
| `pause_execution` (line 28) | **NO** | Raises to caller |
| `resume_execution` (line 46) | **NO** | Raises to caller |
| `retry_execution` (line 64) | **NO** | Raises to caller |
| `get_lifecycle` (line 82) | **NO** | Raises to caller |
| `get_progress` (line 97) | **NO** | Raises to caller |

### 4.5 Route Layer Exception Handling

**Source:** All route files

| Route File | Pattern | Error Leakage |
|------------|---------|---------------|
| `dashboard_routes.py` | `except Exception as e: raise HTTPException(status_code=500, detail=str(e))` | **YES** - leaks `str(e)` |
| `governance_routes.py` | `except Exception as e: raise HTTPException(status_code=500, detail=str(e))` | **YES** - leaks `str(e)` |
| `validation_report_routes.py` | `except Exception as e: raise HTTPException(status_code=500, detail=str(e))` | **YES** - leaks `str(e)` |
| `execution_control_routes.py` | `except Exception as e: raise HTTPException(status_code=500, detail=str(e))` | **YES** - leaks `str(e)` |

### 4.6 Conclusion

**Confirmed:** `dashboard_service.py` and `governance_service.py` silently swallow ALL exceptions and return defaults. `validation_report_service.py` and `execution_control_service.py` do NOT catch exceptions - they raise to the route layer.

**All routes leak `str(e)` to clients**, which can expose database errors, stack traces, or internal paths.

---

## SECTION 5: DUPLICATE GOVERNANCE DESIGNS

### 5.1 Two Independent Governance Layers

| Layer | Tables | Status | Location |
|-------|--------|--------|----------|
| **v1.9 Roadmap Governance** | `migration_control_decisions`, `migration_risk_scores`, `tenants` | DDL exists, never executed | `app/governance/`, `app/installer/install_governance_tables.sql` |
| **New API Governance** | `audit_log`, `approvals`, `exceptions` | No DDL, never created | `app/repositories/governance_repository.py`, `app/services/governance_service.py`, `app/api/routes/governance_routes.py` |

### 5.2 Evidence of Disconnect

**v1.9 Roadmap (from `release/v1_8/Migration_platform_governance.md`):**
- Line 95: `app/governance` module
- Line 101-102: `risk_scoring.py`, `decision_engine.py`
- Line 170: `engine.migration_risk_scores`
- Line 180: `engine.migration_control_decisions`
- Line 190: `engine.tenants`

**New API Governance (from codebase):**
- `app/repositories/governance_repository.py` queries `audit_log`, `approvals`, `exceptions`
- These tables are NOT in the v1.9 roadmap
- These tables have NO DDL definitions

### 5.3 Why This Happened

**Evidence:**
1. The v1.9 roadmap defined governance tables for risk scoring and decision recording
2. The `app/governance/` module was created to implement this
3. A NEW governance layer was later created (`app/repositories/`, `app/services/`, `app/api/routes/`) with DIFFERENT table requirements
4. The new layer references tables that were never planned or defined
5. The two layers have NO code-level integration

### 5.4 Conclusion

**The architecture diverged because two independent governance designs were created without integration.** The v1.9 roadmap governance (risk scoring + decision engine) and the new API governance (audit + approvals + exceptions) serve different purposes and reference different tables.

---

## SECTION 6: COMPLETE EVIDENCE SUMMARY

### 6.1 Claims vs Evidence

| Claim | Evidence Type | Source |
|-------|---------------|--------|
| Files are untracked | Git | `git status`, `git log` |
| Files are used at runtime | Source Code | `app/api/main.py:14-37,177-178` |
| `engine.audit_log` not planned | Documentation | `release/v1_8/Migration_platform_governance.md` (absent) |
| `engine.approvals` not planned | Documentation | `release/v1_8/Migration_platform_governance.md` (absent) |
| `engine.exceptions` not planned | Documentation | `release/v1_8/Migration_platform_governance.md` (absent) |
| `engine.migration_risk_scores` planned | Documentation | `release/v1_8/Migration_platform_governance.md:170` |
| `engine.migration_control_decisions` planned | Documentation | `release/v1_8/Migration_platform_governance.md:180` |
| `engine.tenants` planned | Documentation | `release/v1_8/Migration_platform_governance.md:190` |
| Service layer swallows exceptions | Source Code | `app/services/dashboard_service.py:21,42,59` |
| Routes leak error details | Source Code | `app/api/routes/dashboard_routes.py:25` |
| Two governance layers exist | Code Analysis | `app/governance/` vs `app/repositories/` |

### 6.2 Remaining Assumptions

| Assumption | Evidence Gap |
|------------|--------------|
| Developer intended `core.system_registry` | No direct evidence of intent - only circumstantial |
| `engine.systems` is an uncommitted implementation | Could be incomplete implementation or obsolete design |

---

**Document Generated:** 2026-07-24
**Status:** EVIDENCE ONLY - No assumptions
