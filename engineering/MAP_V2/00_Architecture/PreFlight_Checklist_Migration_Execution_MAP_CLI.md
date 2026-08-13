# Pre-Flight Checklist — Migration Execution (MAP CLI Run)

- **Type:** Operations / Runbook (readiness checklist)
- **Date:** 2026-08-13
- **Scope:** `Migration → Execution → Start Migration` (frontend trigger of the MAP CLI)
- **Status of investigation:** READ-ONLY. No executions were run; no data was modified.

---

## 1. What "Start Migration" actually does
The Execution page does **not** call the validation `/execution/run` endpoint. The flow is:

1. `MigrationPage.tsx` requires **admin** role (`MigrationPage.tsx:125`).
2. Modal: select **Tenant → Project**, then it calls `GET /migration/schedules?project_id=…`
   - If **no schedule** → hard error: *"No schedule found for this project. Please create a schedule first via Migration > Schedules."* (`MigrationPage.tsx:93-100`).
3. It then calls `POST /migration/schedules/{id}/run` → `ScheduleRunner.run_schedule` → **`app.main run` (the MAP CLI)** (`schedule_routes.py:205-207`, `schedule_runner.py:28-36`).
4. Backend precheck: project must have `dataset_mappings` OR `column_mappings` > 0, else `400 Cannot run schedule: project has no dataset mappings or discovery data` (`schedule_routes.py:199-203`).
5. `ExecutionEngine.run`:
   - **STEP 01 CONNECTION RESOLUTION:** needs ≥1 active SOURCE + ≥1 active TARGET system with resolvable credentials, else `RuntimeError("No active SOURCE/TARGET systems found")` (`execution_engine.py:94-97`; `connection_resolver.py:23` filters `is_active`).
   - **STEP 02 DATASET MAPPING:** `MappingResolver` keeps only `dataset_mappings` with `is_active = true` (`mapping_resolver.py:34`) → builds the pairs actually executed.

---

## 2. Pre-Flight Checklist (apply per project before running)

| # | Prerequisite | How to verify | Failure impact |
|---|---|---|---|
| 1 | User has **admin** role | Frontend gate `MigrationPage.tsx:125` | Page blocked |
| 2 | Tenant exists & is ACTIVE in `core.tenants` | `SELECT … FROM core.tenants` | Tenant not selectable |
| 3 | Project exists & ACTIVE for tenant (`core.projects`) | `useMigrationProjects` | No project to select |
| 4 | **Schedule exists** for the project (`engine.migration_schedules`) | `GET /migration/schedules?project_id=` | Frontend refuses to start |
| 5 | ≥1 **active SOURCE** system + ≥1 **active TARGET** system (`core.system_registry.is_active=true`) | `connection_resolver.py` | STEP 01 RuntimeError |
| 6 | Each system has `connection_config` + `credential_id` → `core.system_credentials` decrypts | `connection_resolver.py:136-160` | Connection failure → batch FAILED |
| 7 | Source/target DBs **reachable** (network/cloud) | actual connect at run time | STEP 01 RuntimeError |
| 8 | `dataset_mappings` COUNT > 0 for project | schedule precheck (`schedule_routes.py`) | 400 rejected |
| 9 | **Active** `dataset_mappings` (`is_active=true`) with correct `source_system_id`/`target_system_id` | `MappingResolver` (`mapping_resolver.py:34`) | 0 valid pairs → nothing executed |
| 10 | `column_mappings` present (optional but needed for column-level validation) | join `dataset_mappings` | column rules skipped |
| 11 | **Controls/rules** exist & enabled for project (`engine.control_registry` by `project_id`) | `control_registry` | run completes with 0 controls |

---

## 3. Cert Tenant Assessment (live DB, 2026-08-13)

**Four "Cert" tenants exist; three have NO projects** (nothing to run):
`SQL Certification Tenant`, `SQL Certification Tenant 2026`, `Cert Tenant fc9d338a`.

Only **`Cert Tenant 086cfe2b`** (`20cbc0a3-…`) → project **`Cert Project 4cd2320d`** (`cd738f5f-…`) has data. Results for that project:

| Check | Result | Status |
|---|---|---|
| Schedules | 0 | ❌ BLOCKER (frontend refuses) |
| SOURCE system (SQL-Cert-Source) | active, config+cred present | ✅ (if reachable) |
| TARGET system (SQL-Cert-Target) | active, config+cred present | ✅ (if reachable) |
| `dataset_mappings` | 10 rows, **ALL `is_active = False`** | ❌ 0 valid pairs |
| `column_mappings` | 50 | ✅ |
| Controls (`engine.control_registry` for project) | 0 | ⚠️ 0 controls validate |
| `rule_dataset_mapping` active links | 100 | (reference rules outside this project) |

**Verdict: NOT READY.** A run would be blocked at the UI (no schedule) and, even if a schedule existed, would process **zero datasets** (all mappings inactive) and validate **zero controls**.

### Root cause
All 10 mappings are `is_active = False` with correct SOURCE/TARGET IDs — i.e. soft-deleted/inactivated (the Phase 14 soft-delete trap: `is_active=false` is hidden by the Discovery tree but respected by `MappingResolver`). This is the same defect class analyzed in ADR-010 / Phase 14.

---

## 4. Required actions before running (NOT executed)
1. **Create a schedule** for `Cert Project 4cd2320d` (Migration → Schedules).
2. **Re-activate the 10 `dataset_mappings`** (`is_active=true`) — via re-discovery or direct update.
3. **Assign/enable controls** in `engine.control_registry` for the project (otherwise run validates nothing).
4. **Confirm SQL Server source/target connectivity** (Phase 12 cloud connection must be live).

---

## 5. Reproducible verification queries
```sql
-- schedules for a project
SELECT schedule_id, status FROM engine.migration_schedules WHERE project_id = '<pid>';

-- active source/target systems with config + credential
SELECT system_name, system_role, is_active,
       (connection_config IS NOT NULL AND connection_config::text <> '{}') AS has_cfg,
       (credential_id IS NOT NULL) AS has_cred
FROM core.system_registry WHERE project_id = '<pid>';

-- active dataset_mappings actually used by MappingResolver
SELECT COUNT(*) FROM core.dataset_mappings
WHERE project_id='<pid>'
  AND source_system_id='<src>' AND target_system_id='<tgt>'
  AND is_active=true;

-- controls for the project
SELECT COUNT(*) FROM engine.control_registry WHERE project_id = '<pid>';
```

---

## 6. References
- `engineering/MAP_V2/03_Source/frontend-mvp/src/routes/MigrationPage.tsx`
- `app/api/routes/schedule_routes.py` (`/{schedule_id}/run`)
- `app/services/schedule_runner.py` (MAP CLI subprocess)
- `app/execution_engine.py` (STEP 01/02)
- `app/db/connection_resolver.py` (active + credential resolution)
- `app/services/mapping_resolver.py` (`is_active=true` filter)
- Related: `ADR-010-Discovery-Mapping-Data-Model-Merge-and-Legacy-Fallback.md` (soft-delete trap)
