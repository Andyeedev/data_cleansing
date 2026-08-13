# Phase 14 — Implementation Plan

**Phase:** 14 — Discovery and Mapping Clear Recovery
**Status:** Draft — pending approval
**Related:** `14_0_Scope_Document.md`, `14_2_Assessment.md`

> Implementation may not begin until `14_5_Approval_Record.md` is signed (Approval Gate).

---

## 1. Overview

Replace soft-delete Clear All with **archive-then-hard-delete**, add **restore** and
**clear-history**, and surface both in an **admin reporting & recovery console**. All work extends
existing code (Discovery/Mapping repositories, routes, admin layout, shared components).

---

## 2. Schema (Step 14.1)

Apply `sql/schema/08_discovery_clear_archive.sql` (already authored during analysis). Creates in
`core`:

- `discovery_clear_operations` — one row per Clear All (audit header: tenant_id, tenant_name,
  deleted_by_user_id, deleted_by_name, deleted_at, row_count, status, restored_*).
- `dataset_mappings_archive` — one row per deleted mapping.
- `dataset_columns_archive` — archived child columns.
- `rule_dataset_mapping_archive` — archived rule bindings.

These are **new tables**; `dataset_mappings` is not altered.

---

## 3. Backend — Discovery clear-all (Step 14.2)

Extend `DiscoveryRepository` (do not duplicate the route). New method e.g.
`archive_and_clear(tenant_id, tenant_name, user_id, user_name)` executed in a **single transaction**:

1. Insert audit header (`discovery_clear_operations`), capture `operation_id`.
2. Archive `dataset_columns` for the tenant's mappings → `dataset_columns_archive`.
3. Archive `rule_dataset_mapping` for the tenant's mappings → `rule_dataset_mapping_archive`.
4. Archive `dataset_mappings` for the tenant → `dataset_mappings_archive`.
5. Update `row_count` on the header.
6. `DELETE FROM core.dataset_mappings … WHERE tenant_id = :tenant_id` — cascade removes children.

Endpoint `POST /discovery/clear-all` keeps the required `tenant_id` query param and now returns
`operation_id` + `row_count`. Actor context from `get_current_user_with_tenant`.

---

## 4. Backend — Mapping clear-all (Step 14.3)

Apply the **same** archive + audit pattern to `POST /mappings/clear-all` (confirm exact current
behaviour in 14.G3). Archive `dataset_mappings` + `column_mappings` (+ children) for the tenant,
write the same audit header. Reuses the transaction pattern from Step 14.2.

---

## 5. Backend — Restore (Step 14.4)

New `POST /discovery/restore` (and/or `/mappings/restore`) taking `operation_id`:

1. Re-insert archived mappings (`dataset_mappings_archive` → `dataset_mappings`) preserving
   `original_mapping_id`, `is_active=true`.
2. Re-insert archived columns (`dataset_columns_archive` → `dataset_columns`).
3. Re-insert archived rule bindings (`rule_dataset_mapping_archive` → `rule_dataset_mapping`).
4. `ON CONFLICT DO NOTHING` on each (PK/unique) — leaves already-re-discovered rows untouched.
5. Mark header `status='RESTORED'`, `restored_at`, `restored_by`.

Returns count restored + count skipped (already re-discovered).

---

## 6. Backend — Clear History (Step 14.5)

New `GET /discovery/clear-history` (admin-wide) returning operations ordered by `deleted_at desc`,
supporting optional `tenant_id` / `client` filter for reporting. Reuses `DiscoveryRepository`.

---

## 7. Frontend — Clear flow (Step 14.6)

- `useDiscovery.ts` / `useMapping.ts`: handle new `operation_id`/`row_count` response (no breaking
  change to the button UX).
- Fix modal wording on Discovery + Mapping pages: current text over-promises column clearing;
  align it with the actual archive scope (mappings + columns + rule bindings).

---

## 8. Frontend — Admin console (Step 14.7)

New page under `/administration` (e.g. `/administration/discovery-mapping-recovery`),
admin-only, built from **existing** shared components:

- `PageHeader` (title/actions)
- `DataTable` listing operations: Client (`tenant_name`), Who (`deleted_by_name`), When
  (`deleted_at`), Count (`row_count`), Status (`StatusBadge`: CLEARED / RESTORED), [Restore]
- `TenantFilter` for reporting filter
- `ConfirmDialog`/`Modal` for the restore confirmation
- `MetricCard` summary (total clears, last clear, restored count)

Route registered in `src/AppRoutes.tsx` following `/administration/*` convention. The in-context
"Clear History" on Discovery/Mappings pages deep-links to this console (no separate build).

---

## 9. Verification (Step 14.8 — Testing Gate)

Per `MAP_Development_Rule_Gates.md` §6, provide a test summary covering:

- Build / typecheck (frontend + backend)
- API: clear-all returns `operation_id`; data gone from `dataset_mappings`; archive rows present
- API: restore re-inserts; `ON CONFLICT` skips re-discovered; header → RESTORED
- API: clear-history lists operations; filter by tenant works
- Frontend: admin console renders, Restore disabled when RESTORED
- DB: archive tables populated; cascade children archived before delete
- Regression: Auto Discovery after clear produces fresh active rows (no conflict trap)
- Documentation verification

---

## 10. Traceability

Every task maps to `14_0` scope and `14_1` WBS. Schema traces to
`sql/schema/08_discovery_clear_archive.sql`. Behaviour traces to `14_2_Assessment.md` findings.
