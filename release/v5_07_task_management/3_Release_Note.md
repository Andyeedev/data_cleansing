# Release Notes — v5.07

## Highlights

- ✅ Complete MAP Validation Pipeline (Schedule → Execute → Validate → Report)
- ✅ SQL Server MARS fix — zero "Connection is busy" errors
- ✅ Connection pool exhaustion fix — every step closes DB connections
- ✅ Control status logic fixed — SKIPPED correctly shown for C02-C09
- ✅ detail_json populated for ALL statuses (pass, fail, error, skipped)
- ✅ System 2 (Operations → Execution) reuses System 1 backend services
- ✅ Governance Check runs full MAP CLI via subprocess
- ✅ Fix Options API — pattern-based error→fix resolution
- ✅ ControlReportModal — View Report for any control
- ✅ Auth: JWT expiry validation, 401 redirect
- ✅ 115 database tables, 19 views, 91 FKs, 220 indexes

---

## Critical Bug Fixes

### SQL Server MARS Connection Error
- **Problem:** "Connection is busy with results for another command" during parallel execution
- **Fix:** Added `MARS_Connection=Yes` to SQL Server connection string in `app/adapters/pool.py`
- **Impact:** Zero connection errors during batch execution

### Connection Pool Exhaustion
- **Problem:** Pool returns connections after timeout, steps fail
- **Fix:** Every step and method now closes DB connections via `finally: db.close()` in `run_orchestrator_service.py`
- **Impact:** Pool returns connections properly, no more timeout failures

### Control Status Logic
- **Problem:** C02-C09 showing PASS instead of SKIPPED
- **Fix:** Priority order: BLOCKED → ERROR → FAIL → ALL_SKIPPED → ANY_FAIL → PASS in `rule_executor.py`
- **Impact:** Correct status displayed for all controls

### detail_json for Skipped Rules
- **Problem:** Skipped rules had no detail_json (empty column)
- **Fix:** Every rule execution now populates detail_json with query, source_count, target_count, source_system, target_system, delta, error, skip_reason
- **Impact:** Full audit trail for all execution statuses

---

## New Features

### System 2 — Operations → Execution
- Reuses System 1 service classes for all 5 steps
- No new backend code — leverages existing migration services
- Fresh DB connection per step (no pool exhaustion)

### Governance Check — Full MAP Validation
- Renamed from "Governance Check" to "Full MAP Validation"
- Runs `python -m app.main run --config config.yaml` via subprocess
- Same backend as Schedule → Run

### Fix Options API
- Pattern-based error→fix generator with 5 categories:
  - **Permission** — access denied, authentication failures
  - **Connection** — timeout, refused, unreachable
  - **Schema** — missing table, column not found, type mismatch
  - **Config** — missing config, invalid parameter
  - **Data** — null values, constraint violations
- `GET /execution/{batch_id}/control/{control_id}/fix-options`
- `POST /execution/{batch_id}/apply-fix`

### ControlReportModal
- Click 🔍 icon in expanded mappings table header
- Opens modal with Rule ID, Entity, Status, Delta, Time, Details
- Resolves latest batch via `GET /execution/{project_id}/control/{control_id}/latest-batch`

### Auth Improvements
- JWT expiry validation on token load (checks `exp` claim)
- 401 response clears localStorage and redirects to `/login`
- CascadeDropdowns show error messages instead of empty dropdowns

### Operations Run History
- Pagination, status filter, sorting, search
- KPI cards with progress bars
- Re-run button for completed batches
- Execution type column
- View Report modal

---

## Technical Changes

### Backend (191 Python files)

| File | Change |
|------|--------|
| `app/adapters/pool.py` | MARS_Connection=Yes for SQL Server |
| `app/api/main.py` | Startup event resets ConnectionPoolManager |
| `app/execution_engine.py` | Handles both dict config and PooledDBConnector |
| `app/db_connector.py` | fetch_all() and fetch_dataframe() aliases |
| `app/rule_executor.py` | Control status logic, detail_json for all statuses |
| `app/rules/C01_row_count_rule.py` | Returns query, source_count, target_count |
| `app/services/run_orchestrator_service.py` | System 2 orchestrator, pool close, status breakdown |
| `app/services/fix_options_service.py` | Pattern-based error→fix generator |
| `app/api/routes/rule_execution_routes.py` | Fix options endpoints, latest-batch for control |
| `app/api/routes/rule_discovery_routes.py` | Latest-batch endpoint with mapping resolution |

### Frontend (140 TSX files)

| File | Change |
|------|--------|
| `RuleMappingsUsageTab.tsx` | ControlReportModal, 🔍 icon, latest-batch resolution |
| `ValidationResultsPage.tsx` | Controls drilldown modal, Back to Rules button |
| `OperationsExecutionPage.tsx` | Enhanced run history with pagination, sorting |
| `AuthContext.tsx` | JWT expiry check on load |
| `apiClient.ts` | 401 redirect to login |
| `CascadeDropdowns.tsx` | Error message display |

### Database (115 tables)

| Schema | Tables | Views | FKs | Indexes |
|--------|--------|-------|-----|---------|
| core | 27 | — | — | — |
| engine | 47 | — | — | — |
| engine_v14 | 10 | — | — | — |
| platform | 23 | — | — | — |
| audit | 5 | — | — | — |
| reporting | 3 | 19 | — | — |
| **Total** | **115** | **19** | **91** | **220** |

---

## Verified Execution

| Batch ID | Status | Controls | Date |
|----------|--------|----------|------|
| `49459a82-4f86-44c0-99ab-d6d683461dc2` | COMPLETED | All PASSED | 2026-08-19 |
| `d28944c2-ec24-401b-a305-ceb4778f7296` | COMPLETED | All PASSED | 2026-08-18 |

---

## Known Limitations

- Repository layer partially implemented (services use direct SQL)
- Fix Options apply returns SQL preview for manual execution (not auto-applied)
- Definitions tab manages its own tenant filter (decoupled from global context)

---

## Version

**Version:** v5.07

**Branch:** `feature/workstream-07-task_management`

**Status:** Validation Engine Complete — Ready for Git Upload
