# Phase 14 — Minimum-Change Proposal

**Phase:** 14 — Discovery and Mapping Clear Recovery
**Status:** Draft — pending approval
**Related:** `14_0_Scope_Document.md`, `14_2_Assessment.md`, `14_3_Implementation_Plan.md`

---

## 1. Principle

Per `MAP_Development_Rule_Gates.md` §8 (Scope Control) and the Mandatory Implementation Gates:
**build only what is missing; extend, never duplicate.** This proposal lists the minimum change
required to fix the Clear All defect and deliver audit/recovery.

---

## 2. What Already Exists (reuse — do NOT rebuild)

- `POST /discovery/clear-all` route — extend only.
- `POST /mappings/clear-all` route — extend only.
- `DiscoveryRepository` — add methods; do not fork.
- `get_current_user_with_tenant` — actor/tenant context.
- `/administration` route group + admin layout — host the console.
- Shared components (`PageHeader`, `DataTable`, `StatusBadge`, `Modal`, `ConfirmDialog`,
  `TenantFilter`, `MetricCard`) — build the console from these.
- `sql/schema` migration convention — apply new DDL via a new `08_*` file.

---

## 3. What Must Change (minimum)

| # | Change | Type | Scope |
|---|--------|------|-------|
| 1 | Add 4 archive/audit tables | New SQL (`sql/schema/08_discovery_clear_archive.sql`) | Schema only |
| 2 | Discovery clear-all: archive-then-hard-delete + audit header | Extend `DiscoveryRepository` + route | Backend |
| 3 | Mapping clear-all: same pattern | Extend repository + route | Backend |
| 4 | Restore endpoint + repository | Add (reuses repository) | Backend |
| 5 | Clear-history endpoint + repository | Add (reuses repository) | Backend |
| 6 | Frontend clear-flow: handle new response, fix modal wording | Extend hooks/pages | Frontend |
| 7 | Admin reporting & recovery console page | New page + 1 route in `AppRoutes.tsx` | Frontend |

---

## 4. Explicitly Out of Scope (do NOT build)

- No change to the discovery/matching engine.
- No new connection/client management.
- No alteration of `dataset_mappings` columns.
- No retention/cleanup job for the archive (kept indefinitely for audit).
- No separate per-page Clear History UI (reuses the admin console).

---

## 5. Why This Is Minimum

- The defect (soft delete invisible + unrecoverable) is fixed by switching to hard-delete + archive
  in the **existing** clear-all path (changes #2, #3) — no new discovery logic.
- Recovery needs exactly two small endpoints (#4, #5) reusing the archive tables.
- Reporting needs one admin page (#7) assembled from existing components.
- Total new surface area: 4 tables + ~3 endpoints + 1 page. No duplicate services.

---

## 6. Recommendation

Adopt the minimum change above. Approving this proposal authorises Steps 14.1–14.7 in
`14_3_Implementation_Plan.md` and unblocks implementation per the Approval Gate.
