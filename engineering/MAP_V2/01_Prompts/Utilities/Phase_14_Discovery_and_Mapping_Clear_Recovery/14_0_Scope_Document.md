# Discovery & Mapping "Clear All" — Archive, Audit & Recovery — Implementation Task

**Phase:** 14 — Discovery and Mapping Clear Recovery
**Status:** Draft — Scope Frozen pending approval
**Classification:** Scope Document — Governance Phase
**Related scope:** `Phase_11_Validation_Frontend_Integration\11_0_Scope_Document.md`
(references "Rule Discovery → Reuse Migration → Discovery")

---

# 1. Objective

Replace the current Discovery / Mapping **"Clear All"** behaviour with a **hard delete of live
data plus a recoverable, auditable archive copy**, and provide an **admin reporting & recovery
console** so that any clear action can be traced (client, acting user, timestamp, count) and
undone.

The purpose is to fix a defect in the current Clear All implementation (it performs a soft delete
that is invisible to the UI and unrecoverable through normal re-discovery) while adding the
governance, audit, and recovery capabilities a commercial product requires.

---

# 2. Mandatory Stop Gate

Before making changes:

1. Inspect the existing MAP codebase for the Clear All implementation.
2. Locate the existing:
   * Discovery clear-all API (`app/api/routes/discovery_routes.py` → `POST /discovery/clear-all`)
   * Mapping clear-all API (`app/api/routes/mapping_routes.py` → `POST /mappings/clear-all`)
   * Discovery repository (`app/db/repositories/discovery_repository.py`)
   * Dataset discovery service (`app/services/dataset_discovery_service.py`)
   * Frontend Discovery pages (`src/routes/DiscoveryPage.tsx`, `src/routes/DiscoveryTreeTablePage.tsx`)
   * Frontend Mapping clear-all hook (`src/hooks/useMapping.ts`)
   * Admin section (`src/AppRoutes.tsx` → `/administration`)
   * Shared components (`src/components/shared/*`) — see `Phase_11_.../00_Mandatory_Implementation_Gates.md` §1.2
3. Determine exactly how Clear All currently behaves and why it fails.
4. Reuse existing functionality wherever possible.

**Do NOT create a second clear-all system.** Extend the existing endpoints/repository; do not
duplicate the `clear-all` route, the discovery repository, or the admin layout.

If the assessment (14_2) confirms a gap, extend the existing components, hooks, and routes
(`AppRoutes.tsx`) rather than creating new ones.

---

# 3. Current State (Evidence-Based — No Assumption)

All findings below are taken directly from the repository as inspected:

| # | Finding | Source (file:line) |
|---|---------|--------------------|
| 1 | Discovery `clear-all` performs a **soft delete** (`SET is_active = false`), scoped by `tenant_id` via a join to `core.projects` | `app/api/routes/discovery_routes.py:87`; `app/db/repositories/discovery_repository.py:226` |
| 2 | `core.dataset_mappings` real columns include `is_active`, `source_columns text[]`, `target_columns text[]` | `engine_backup.sql:657` |
| 3 | Discovery read endpoints `get_tree`, `get_tables`, `get_summary` do **NOT** filter `is_active` | `app/db/repositories/discovery_repository.py:45,143,10` |
| 4 | Children `dataset_columns`, `column_mappings`, `rule_dataset_mapping` have `ON DELETE CASCADE` to `dataset_mappings` | `engine_backup.sql:5839,5879,5887` |
| 5 | Auto-discovery inserts with `ON CONFLICT (project_id, source_schema, source_table, target_schema, target_table) DO NOTHING` | `app/services/dataset_discovery_service.py:112-122` |
| 6 | Mapping clear-all exists at `POST /mappings/clear-all` | `app/api/routes/mapping_routes.py:206` |
| 7 | Frontend Clear All button present on Discovery tree page and Discovery page | `src/routes/DiscoveryTreeTablePage.tsx`, `src/routes/DiscoveryPage.tsx` |
| 8 | Admin section already exists (`/administration`: users, roles, tenants, settings, security, notifications, maintenance) | `src/AppRoutes.tsx:119-131` |
| 9 | Shared components available for reuse: `PageHeader`, `DataTable`, `StatusBadge`, `Modal`, `ConfirmDialog`, `TenantFilter`, `MetricCard` | `Phase_11_.../00_Mandatory_Implementation_Gates.md` §1.2 |
| 10 | Auth dependency `get_current_user_with_tenant` provides the acting user + tenant context | `app/api/routes/discovery_routes.py:3` |

### 3.1 Why the current Clear All is broken

- Because of finding #3, a soft-deleted row is still returned by the Discovery tree/tables/summary,
  so the UI never changes for the selected client (e.g., `mcert`).
- Because of finding #5, after a soft delete the row still occupies the unique-key slot, so
  re-running Auto Discovery hits `ON CONFLICT DO NOTHING` and can **never** bring the cleared
  tables back. The data is effectively unrecoverable through normal use.

---

# 4. Scope

### In scope
- Hard delete of a tenant's discovery/mapping data (cascade children) for **both** the Discovery
  `clear-all` (`core.dataset_mappings`) and the Mapping `clear-all` (`core.dataset_mappings` /
  `core.column_mappings`).
- Archiving of the deleted mappings, their columns, and rule bindings **before** deletion.
- An audit header recording tenant (client name), acting user, timestamp, and row count.
- A restore capability to recover a previous clear operation.
- **Admin reporting & recovery console** — a new sub-page inside the existing `/administration`
  section (admin-only) listing every clear operation across all clients (client, who, when, count,
  status) with a **Restore** action.
- Optional in-context "Clear History" affordance on the Discovery tree and Mappings pages that
  reuses the same admin console.

### Out of scope
- Changes to the discovery *engine* (how tables/columns are matched).
- Tenant-level permission changes beyond the existing admin role guard.
- Retention expiry/cleanup of the archive (kept indefinitely for audit — see policy §7).
- New connection-management or client-management functionality.

---

# 5. Reuse & No-Duplication Policy

Per `Phase_11_Validation_Frontend_Integration\00_Mandatory_Implementation_Gates.md` (applies to all
future phases) and `00_Governance\MAP_Development_Rule_Gates.md`:

- **Backend:** extend the existing `DiscoveryRepository` and `clear-all` routes; reuse
  `get_current_user_with_tenant` for actor/tenant context. Do **not** add a parallel clear service.
- **Frontend:** build the admin console using existing shared components
  (`PageHeader`, `DataTable`, `StatusBadge`, `Modal`/`ConfirmDialog`, `TenantFilter`).
  Register the new route in `src/AppRoutes.tsx` following the existing `/administration/*` pattern.
- **Schema:** add the archive/audit tables in `core` (new tables only — no alteration of
  `dataset_mappings`).

---

# 6. Relevant Policies (Referenced, Not Assumed)

| Policy | File | Relevance |
|--------|------|-----------|
| Mandatory Implementation Gates | `Phase_11_Validation_Frontend_Integration\00_Mandatory_Implementation_Gates.md` | Component/hook/type/route reuse; Phase Gate (stop & approve); assessment before build |
| MAP Development Rule Gates | `00_Governance\MAP_Development_Rule_Gates.md` | Task Analysis, Approval Gate, Recommendations (top-3), Testing Gate, Documentation, Scope Control, Traceability, Commercial Product Principle |
| Audit Trail (Discovery/AI Mapping) | `00_Architecture\23_Enterprise_Discovery_and_AI_Mapping_Architecture\03_Governance_and_Workflow\3_Audit_Trail.md` | Establishes the audit/who-when-client tracking principle this feature implements |
| Phase 11 Scope | `Phase_11_Validation_Frontend_Integration\11_0_Scope_Document.md` | Discovery is framed there as "Reuse Migration → Discovery"; this phase owns that capability's clear/recovery |

Implementation may not begin until the assessment (14_2), implementation plan (14_3), and
minimum-change proposal (14_4) are approved per the **Approval Gate** and **Phase Gate** policies.

---

# 7. Deliverables (Governance Documents — create before code)

```text
Phase_14_Discovery_and_Mapping_Clear_Recovery/
├── 14_0_Scope_Document.md              (this document)
├── 14_1_Work_Breakdown_Structure.md
├── 14_2_Assessment.md
├── 14_3_Implementation_Plan.md
├── 14_4_Minimum_Change_Proposal.md
├── 14_5_Approval_Record.md
└── 14_6_Technical_Design.md            (DDL + procedure SQL, carried from discovery analysis)
```

**STOP after these governance documents are created.**

Do NOT modify MAP code or schema until the implementation plan and minimum-change proposal have
been approved.

After approval, implement the approved plan, then at completion create:
```text
Phase_14_Closure_Report.md
```

---

# 8. Mandatory Governance

Follow:
- `Phase_11_Validation_Frontend_Integration\00_Mandatory_Implementation_Gates.md`
- `00_Governance\MAP_Development_Rule_Gates.md`

Mandatory gates for this phase:
1. Existing implementation assessment (14_2) — confirm what already exists vs. absent.
2. Reuse review — extend, never duplicate.
3. Minimum-change proposal (14_4).
4. Explicit approval (14_5).
5. Implementation (14_3), following existing patterns.
6. Verification — build/typecheck/test per Testing Gate.
7. Documentation update — keep this scope and the technical design current.
8. Closure report.

No implementation before explicit approval.

---

# 9. Final Success Criteria

The task is complete only when:
- [ ] `core.discovery_clear_operations`, `core.dataset_mappings_archive`, `core.dataset_columns_archive`, `core.rule_dataset_mapping_archive` exist and are applied
- [ ] Discovery `clear-all` hard-deletes live data and writes an archive + audit header
- [ ] Mapping `clear-all` follows the same archive + audit pattern
- [ ] A `restore` endpoint re-inserts an operation's archive (skip conflicts) and marks it `RESTORED`
- [ ] A `clear-history` endpoint lists past operations (admin-wide; filterable by tenant/client)
- [ ] Admin reporting & recovery console exists under `/administration` (list + Restore, admin-only)
- [ ] Clear All on Discovery and Mapping pages still functions and now triggers the archive
- [ ] Re-running Auto Discovery after a clear produces fresh active rows (no conflict trap)
- [ ] No duplicate clear-all services/routes/components created
- [ ] All tests (build, typecheck, API, frontend render, DB) pass
- [ ] Documentation (this scope + technical design + closure) complete

---

## Critical Instruction

**Do not start coding immediately.**

First produce the governance documents (14_1–14_6) and the minimum-change proposal, then STOP and
wait for explicit approval before making changes.
