# ARCHITECTURE DECISION RECORD
## ADR-08-001: Repository Reference Resolution

**Generated:** 2026-07-24
**Status:** APPROVED
**Deciders:** User (Architect)

---

## Context

Phase 07 verification identified 7 incorrect table references in uncommitted repository files. These references point to tables that do not exist in the current deployed schema:

1. `engine.systems` — referenced in `dashboard_repository.py`
2. `engine.controls` — referenced in `dashboard_repository.py`
3. `engine.audit_log` — referenced in `dashboard_repository.py`, `governance_repository.py`
4. `engine.approvals` — referenced in `governance_repository.py`
5. `engine.exceptions` — referenced in `governance_repository.py`
6. `engine.migration_batch_lifecycle` — referenced in `execution_control_repository.py`
7. `engine.migration_risk_scores` — referenced in `validation_report_repository.py`

Additionally, `engine.tenants` DDL exists but was never executed, and duplicates `core.tenants`.

---

## Decision

### B-01: `engine.systems` → `core.system_registry`

**Decision:** Use `core.system_registry`

**Rationale:** Table already exists and is currently maintained manually by the runtime engine. No need to create a new table.

**Evidence:**
- `core.system_registry` is used by `app/db/connection_resolver.py:109` for connection resolution
- `core.system_registry` is documented in `02_Output/18_Enterprise_Information_Data_Model/03_Table_Catalogue.md:47`
- `core.system_registry` is referenced in `02_Output/17_Enterprise_Business_Process_Model/02_End_to_End_Business_Process_Catalogue.md:62`

---

### B-02: `engine.controls` → `engine.control_registry`

**Decision:** Use `engine.control_registry`

**Rationale:** Table already exists and is used by the runtime engine. No need to create a new table.

**Evidence:**
- `engine.control_registry` is used by `app/execution/control_executor.py` for loading enabled controls
- `engine.control_registry` is documented in `02_Output/18_Enterprise_Information_Data_Model/03_Table_Catalogue.md:196`
- `engine.control_registry` is referenced in `02_Output/17_Enterprise_Business_Process_Model/02_End_to_End_Business_Process_Catalogue.md:254`

---

### B-03: `engine.audit_log` → `audit.audit_events`

**Decision:** Use `audit.audit_events`

**Rationale:** Table already exists and is used by the audit middleware.

**Evidence:**
- `audit.audit_events` is used by `app/api/core/middleware/audit_middleware.py` for logging API calls
- `audit.audit_events` is documented in `02_Output/18_Enterprise_Information_Data_Model/03_Table_Catalogue.md:1094`
- `audit.audit_events` is referenced in `02_Output/17_Enterprise_Business_Process_Model/02_End_to_End_Business_Process_Catalogue.md:654`

---

### B-04: `engine.approvals` → `platform.approval_requests`

**Decision:** Use `platform.approval_requests`

**Rationale:** Table already exists and is used by the approval service.

**Evidence:**
- `platform.approval_requests` is used by `app/services/approval_service.py` for approval workflow
- `platform.approval_requests` is documented in `02_Output/18_Enterprise_Information_Data_Model/03_Table_Catalogue.md:775`
- `platform.approval_requests` is referenced in `02_Output/17_Enterprise_Business_Process_Model/02_End_to_End_Business_Process_Catalogue.md:376`

---

### B-05: `engine.exceptions` → `engine.migration_control_exceptions`

**Decision:** Use `engine.migration_control_exceptions`

**Rationale:** Table already exists and is used by the runtime engine for exception recording.

**Evidence:**
- `engine.migration_control_exceptions` is used by the runtime engine for exception recording
- `engine.migration_control_exceptions` is documented in `02_Output/18_Enterprise_Information_Data_Model/03_Table_Catalogue.md:350`
- `engine.migration_control_exceptions` is referenced in `02_Output/19_Enterprise_Solution_Architecture/04_Component_Architecture.md:103`

---

### B-06: `engine.migration_batch_lifecycle` — BLOCKED

**Decision:** BLOCKED — Pending Investigation

**Issue:** Table does not exist. Need more information on how this reference came about.

**Action:** Investigate before deciding replacement.

---

### B-07: `engine.migration_risk_scores` — BLOCKED

**Decision:** BLOCKED — Pending Investigation

**Issue:** Table does not exist. Need more information on how this reference came about. DDL exists in `app/installer/install_governance_tables.sql:34` but was never executed.

**Action:** Investigate before deciding replacement.

---

### B-08: `engine.tenants` → `core.tenants`

**Decision:** Use `core.tenants`

**Rationale:** `core.tenants` is the active table, currently maintained manually. `engine.tenants` DDL exists but was never executed and has different PK type (VARCHAR vs UUID).

**Evidence:**
- `core.tenants` is used by the runtime engine for tenant management
- `engine.tenants` has zero references in the codebase
- `engine.tenants` DDL is in `app/installer/install_governance_tables.sql:49`

---

## Consequences

### Positive

- All 5 resolved references now point to existing, active tables
- No database schema changes required for resolved references
- KPI endpoints will return real data after fixes
- Governance endpoints will return real data after fixes

### Negative

- B-06 and B-07 remain blocked pending investigation
- Service layer silent exception handling must be removed separately
- Two governance layers remain unintegrated

### Risks

- Fixes may expose runtime errors previously masked by silent exception handling
- Table column names may differ between old and new references

---

## ADR-08-002: Scheduler Subsystem Design

**Generated:** 2026-07-31
**Status:** APPROVED
**Deciders:** User (Architect)

### Context

The MVP needs a migration schedule management subsystem that allows users to create, edit, delete, and trigger scheduled MAP CLI executions. The frozen frontend has a Scheduler portal but uses mock data. The MVP must connect to real backend data.

### Decision

Two-table design over single-table JSON approach:

1. `engine.migration_schedules` — schedule definition (17 columns including recurrence JSONB)
2. `engine.schedule_execution_log` — execution history (11 columns including terminal_output)

The `platform.calendar_events` table is reused with a FK link to `engine.migration_schedules`.

### Rationale

- Two-table design provides better queryability, filtering, and reporting than a single JSON column
- `recurrence` column uses JSONB for flexible cron expression storage
- `terminal_output` stores subprocess stdout/stderr for UI display
- MAP CLI command: `python -m app.main run --config config.yaml`
- Role-based filtering: Super Admin sees all tenants/projects; Tenant Admin sees only their tenant's projects
- When schedule is OFF, all action buttons (Run/Edit/Delete/View Output) are disabled

### Evidence

- DDL: `sql/schema/03_schedule_schema.sql`
- Seed data: `sql/demo/03_seed_schedules.sql`
- Backend: `app/repositories/schedule_repository.py`, `app/services/schedule_service.py`, `app/services/schedule_runner.py`, `app/api/routes/schedule_routes.py`
- Frontend: `src/routes/MigrationSchedulesPage.tsx` (Option C design)
- Tests: `src/routes/MigrationSchedulesPage.test.tsx` (5/5 passing)

### Consequences

- Positive: Full CRUD with real data, terminal output capture, calendar event linkage
- Negative: Two tables to maintain instead of one
- Risk: Subprocess execution may have security implications (validated with project/mapping checks)

---

## Authority

These mappings are authoritative and supersede any previous Phase 08 documentation.

---

## Evidence Files

| File | Purpose |
|------|---------|
| `Phase_07/Table_Usage_Categorization_Report.md` | 96-table classification |
| `Phase_07/Evidence_Root_Cause_Report.md` | Root cause analysis |
| `Phase_07/Final_Evidence_Pass.md` | Evidence-only analysis |
| `Phase_08/Execution_Backlog.md` | Task backlog with decisions |

---

**Document Generated:** 2026-07-24
**Status:** APPROVED
