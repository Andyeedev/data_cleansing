# Changelog

## v1.4 – SaaS Architecture Foundation

- Introduced core schema (tenants, projects, system_registry, dataset_mappings)
- Project-scoped execution engine
- Mapping-driven rule resolution
- Governance intelligence integration
- Release gate enforcement
- Multi-project capability
- Full backup taken (engine/source/target DBs)
- rule_parameter_metadata marked for deprecation

## v1.4.1 – Performance & Bug Fixes

### API Performance
- **JWT decode optimization**: Audit middleware now decodes JWT once and stores payload in `request.state.user`. Auth dependency reuses cached payload instead of decoding again. Eliminates redundant decode per request.
- **Audit middleware imports**: Moved `jose.jwt` and `jwt_config` imports to module level instead of importing inside `dispatch()` on every request.
- **Skip OPTIONS requests**: Audit logging middleware skips JWT decoding for OPTIONS (preflight) requests.

### Dashboard Performance
- **DB indexes**: Added indexes on `migration_batch_registry`:
  - `idx_mbr_batch_status`
  - `idx_mbr_batch_start_time`
  - `idx_mbr_project_id`
- **Status breakdown isolation**: Status breakdown API call now has its own `useEffect` dependency array — no longer re-fetched on every page/sort/search/filter change.
- **Migration Score Summary tenant filter**: Fixed 500 error caused by method signature mismatch (`ValidationReportRepository.get_migration_score_summary()` did not accept `tenant_id`). Now supports optional `tenant_id` query parameter.
- **Dashboard tenant filtering**: Portfolio and activity endpoints now accept `tenant_id` query parameter for tenant-scoped filtering.

### Migration Page (Execution → History tab)
- **Server-side search**: Text search now delegates to API (`?search=`) using SQL `ILIKE` across `batch_id`, `batch_status`, `project_id`. Searches all pages, not just current page.
- **Server-side sort**: Column sorting delegates to API (`?sort_by=` `&sort_dir=`) using SQL `ORDER BY`. Sorts all pages, not just current page.
- **Search debounce**: 300ms debounce prevents API hammering on rapid keystrokes.
- **Separate status breakdown fetch**: Two independent `useEffect` hooks — history data and status breakdown no longer re-fetch together.

### Governance Page (Risk tab)
- **Server-side search on Risk table**: Search now delegates to API.
- **Unscored/Orphaned sorting**: Added sort state (`unscoredSort`, `orphanedSort`) and clickable column headers for Batch ID and Status columns.
- **Orphaned search fix**: Search now matches `batch_status` as well as `batch_id` (so "ORPHANED" keyword works).

### Schedule Execution
- **Stale DB connection fix**: Schedule routes now create `ScheduleService()` per-request instead of module-level singleton, preventing stale connection errors.
- **Frontend error handling**: `apiClient.ts` `request()` now throws proper `Error` instances (was throwing plain objects). `MigrationSchedulesPage.tsx` extracts actual error detail from `err?.response?.detail`.
- **Schedule runner subprocess**: `ScheduleRunner._run_subprocess()` now passes `PYTHONPATH` environment variable including project root, ensuring `python -m app.main` finds the module.

### Infrastructure: DB Connection Pooling
- **`PooledDBConnector` class**: New class in `db_connector.py` using `psycopg2.pool.ThreadedConnectionPool` (minconn=2, maxconn=20).
- **Shared pool**: Module-level `ThreadedConnectionPool` created once on first `get_db_connection()` call.
- **Auto-return**: Connections returned to pool on `close()` and `__del__` (GC safety net).
- **`DBConnector`** retained for short-lived scripts/subprocesses (`app/main.py`, scripts); `get_db_connection()` now returns `PooledDBConnector`.