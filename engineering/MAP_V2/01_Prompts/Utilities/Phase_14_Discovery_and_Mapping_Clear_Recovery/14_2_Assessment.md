# Phase 14 — Backend & Frontend Assessment

**Phase:** 14 — Discovery and Mapping Clear Recovery
**Status:** Draft — pending approval
**Related:** `14_0_Scope_Document.md`, `14_1_Work_Breakdown_Structure.md`

> Per `MAP_Development_Rule_Gates.md` §1 (Task Analysis) and the Mandatory Implementation Gates,
> this assessment confirms what already exists vs. what is absent. **No assumption** — every row
> cites the inspected source.

---

## 1. Backend Assessment

### 1.1 Discovery clear-all (exists, defective)

| Question | Finding | Source |
|----------|---------|--------|
| Does `POST /discovery/clear-all` exist? | Yes | `app/api/routes/discovery_routes.py:87-108` |
| What does it do? | Soft delete: `UPDATE core.dataset_mappings SET is_active=false` scoped by `tenant_id` join `core.projects` | `app/db/repositories/discovery_repository.py:226-250` |
| Does it archive? | **No** | — |
| Does it record who/when/client? | **No** (only `tenant_id` in, returns `deleted_count`) | `discovery_routes.py:89-108` |
| Is `tenant_id` required? | Yes (400 if missing) | `discovery_routes.py:95-96` |

### 1.2 Mapping clear-all (exists)

| Question | Finding | Source |
|----------|---------|--------|
| Does `POST /mappings/clear-all` exist? | Yes | `app/api/routes/mapping_routes.py:206-207` |
| Archives / audits? | **No** (not yet inspected in detail; same soft-delete pattern assumed only if confirmed — see risk) | — |

> **Action item (14.G3):** confirm the exact behaviour of `mapping_routes.py:206` before extending.
> The minimum-change proposal (14_4) must cover both endpoints identically.

### 1.3 Restore endpoint (absent)

| Question | Finding | Source |
|----------|---------|--------|
| Does a `restore` endpoint exist for cleared data? | **No** | Grep: no `restore` in discovery/mapping routes |
| Does archived data exist to restore from? | **No** (no archive tables) | Grep: no `dataset_mappings_archive` |

### 1.4 Clear-history endpoint (absent)

| Question | Finding | Source |
|----------|---------|--------|
| Is there an endpoint listing past clear operations? | **No** | Grep: no `clear-history` / `discovery_clear_operations` |

### 1.5 Schema (absent)

| Table | Exists? | Source |
|-------|---------|--------|
| `core.discovery_clear_operations` | **No** | Grep: not present |
| `core.dataset_mappings_archive` | **No** | — |
| `core.dataset_columns_archive` | **No** | — |
| `core.rule_dataset_mapping_archive` | **No** | — |

### 1.6 Behavioural root cause (confirmed)

| # | Fact | Implication |
|---|------|-------------|
| 1 | Discovery reads (`get_tree`, `get_tables`, `get_summary`) do **not** filter `is_active` | Soft delete is invisible in UI |
| 2 | Auto-discovery insert uses `ON CONFLICT (project_id, source_schema, source_table, target_schema, target_table) DO NOTHING` | Soft-deleted row blocks re-insert → unrecoverable via re-discovery |
| 3 | `dataset_columns`, `column_mappings`, `rule_dataset_mapping` cascade-delete from `dataset_mappings` | A hard delete of `dataset_mappings` removes children automatically — but they must be archived *before* delete |

Sources: `app/db/repositories/discovery_repository.py:45,143,10`; `app/services/dataset_discovery_service.py:112-122`; `engine_backup.sql:5839,5879,5887`.

---

## 2. Frontend Assessment

| Question | Finding | Source |
|----------|---------|--------|
| Is there a Clear All button on Discovery tree page? | Yes (calls `useClearAllDiscovery`) | `src/routes/DiscoveryTreeTablePage.tsx` |
| Is there a Clear All button on Discovery page? | Yes | `src/routes/DiscoveryPage.tsx` |
| Is there a Clear History / recovery UI? | **No** | — |
| Does an admin section exist to host the console? | Yes (`/administration`: users, roles, tenants, settings, security, notifications, maintenance) | `src/AppRoutes.tsx:119-131` |
| Are shared components available for the console? | Yes (`PageHeader`, `DataTable`, `StatusBadge`, `Modal`, `ConfirmDialog`, `TenantFilter`, `MetricCard`) | `Phase_11_.../00_Mandatory_Implementation_Gates.md` §1.2 |

---

## 3. Reuse Opportunities (documented)

- **Repository:** extend `DiscoveryRepository` (add `archive_and_clear`, `restore`, `list_operations`); reuse `get_db_connection()`.
- **Auth:** reuse `get_current_user_with_tenant` for actor `user_id`/`name` and tenant context.
- **Frontend:** build admin console from existing shared components; register route in `AppRoutes.tsx` under `/administration/*`.
- **Schema:** add new archive tables only; do not alter `dataset_mappings`.

---

## 4. Gaps to Build

1. 4 archive/audit tables (DDL).
2. Archive-then-hard-delete logic for Discovery clear-all (+ audit header).
3. Same for Mapping clear-all.
4. `restore` endpoint + repository.
5. `clear-history` endpoint + repository.
6. Frontend clear-flow wiring + modal wording fix.
7. Admin reporting & recovery console page.

---

## 5. Risks

| Risk | Likelihood | Impact | Note |
|------|-----------|--------|------|
| Mapping clear-all behaviour differs from discovery | Medium | Medium | Confirm via 14.G3 before 14.3 |
| Cascade delete removes children before archive if order wrong | Low | High | Archive children **before** `DELETE` in same transaction |
| Restore conflicts with re-discovered rows | Medium | Low | `ON CONFLICT DO NOTHING` + report skipped |
| Audit actor fields unavailable from auth | Low | Medium | Confirm `get_current_user_with_tenant` payload fields |

---

## 6. Assessment Conclusion

The current Clear All is **defective by design** (soft delete invisible + unrecoverable). All
required building blocks (repository, routes, auth, admin layout, shared components) already exist
and must be **extended, not duplicated**. No new services or duplicate tables are required beyond
the 4 archive/audit tables. Implementation may proceed only after the minimum-change proposal is
approved.
