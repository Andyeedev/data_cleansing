# ADR-010 — Discovery/Mapping Data Model: Merged V2 Model and Legacy Fallback

- **Status:** Analysis / Proposed (contingency recorded)
- **Date:** 2026-08-13
- **Area:** `23_Enterprise_Discovery_and_AI_Mapping_Architecture`
- **Related:** Phase_14 (Discovery & Mapping Clear/Recovery), Phase_07 Table_Usage_Categorization_Report

---

## 1. Context

The original platform design intended **separate tables for discovery and for mappings**. In the
shipped V2 engine the discovery inventory has been **merged into the mappings data model**: discovery
output (source→target table matches) and mapping definitions share the same `dataset_mappings` table.
The originally-separate discovery tables (`core.discovered_datasets` / `core.discovered_columns`)
survive only as a **legacy vestige** — still read by the Mappings UI for schema pickers, but no longer
written by any V2 process.

This note records the verified state of both models, the risks introduced by the merge, and a
**contingency**: if the merged V2 model becomes unmanageable and requires redesign, the legacy
architecture (separate discovery inventory tables) should be reconsidered as the basis.

---

## 2. Verified Evidence

### 2.1 V2 active (merged) model
- `core.dataset_mappings` — source→target **table pairs** with `match_status` (matched/unmatched),
  `is_active`, confidence. Serves as BOTH the discovery result and the parent of mappings.
- `core.column_mappings` — source→target **column pairs**; child of `dataset_mappings` via `mapping_id`.
- `core.dataset_columns` — V2 **column catalog** per dataset (successor to legacy `discovered_columns`).
- `core.rule_dataset_mapping` — rule↔dataset links.
- Discovery **run metadata** kept separate: `discovery_results` / `discovery_batches`.
- `app/services/dataset_discovery_service.py` writes directly into `dataset_mappings` +
  `dataset_columns` + `rule_dataset_mapping` (no write to `discovered_datasets`).
- `app/db/repositories/discovery_repository.py` (`get_all_datasets`) reads `dataset_mappings` for the
  Discovery tree; `MappingSpreadsheetPage` reads `column_mappings` + `dataset_mappings`.

### 2.2 Legacy (separate) model — still present, partially consumed
- `core.discovered_datasets` (columns: `discovered_dataset_id, project_id, system_id, table_name,
  schema_name, discovered_at, last_seen`) and child `core.discovered_columns`
  (FK `discovered_dataset_id`).
- Live DB: 8 rows in `discovered_datasets`, 16 in `discovered_columns`, **all Default Tenant**, seeded
  in a single batch on 2026-04-01 — confirming no ongoing V2 maintenance.
- `research/Part_1_Legacy_v2_1_AutoMapping_Architecture_Analysis.md:261` states the legacy MAP v2.1
  runtime "reads `information_schema`; **writes to `core.discovered_datasets`**".
- Absent from `engine_backup.sql`; no V2 `INSERT`/`CREATE TABLE` exists → legacy-owned.
- Still read by:
  - `app/services/mapping/mapping_repository.py` `get_schema()` → `mapping_routes.py:54` (Mappings
    **source schema dropdown**).
  - `mapping_repository.get_target_columns()` → `mapping_service._get_target_columns` (Mappings
    **target column dropdown**).
  - `app/repositories/migration_dataset_repository.py` (Datasets page) and `migration_project_repository.get_project_datasets`.
- Referenced by engine views `engine.v_migration_datasets`, `engine.v_migration_projects` (which back
  the Migration project list, overview stats, and tenant picker).
- Phase_07 (`Table_Usage_Categorization_Report.md:211`, `Runtme_Platform_Data_Lineage_Audit.md:69`)
  flagged `discovered_datasets` as a **"Candidate for architectural review"**.

---

## 3. Model Comparison

| Aspect | Legacy (separate) | V2 (merged) |
|---|---|---|
| Discovery inventory | `discovered_datasets` + `discovered_columns` (raw, all found tables/cols) | folded into `dataset_mappings` (table pairs) + `dataset_columns` |
| Mapping definitions | (legacy mappings) | `column_mappings` (child of `dataset_mappings`) |
| Discovery vs mapping intent | distinct tables | **conflated in one `dataset_mappings` row** (`is_active` + `match_status`) |
| Written by | legacy runtime only | V2 `dataset_discovery_service` |
| Run metadata | n/a | separate (`discovery_results`/`discovery_batches`) |

---

## 4. Consequences / Risks of the Merge

**Benefits**
- Single source of truth for "source table X → target table Y"; no sync job between a discovery table
  and a mappings table.

**Risks**
1. **Intent conflation** — a `dataset_mappings` row mixes "discovered match" with "mapping
   assignment" (`match_status` + `is_active` + column children); hard to separate found-vs-mapped.
2. **`ON CONFLICT DO NOTHING` trap** — because discovery re-inserts into the *same* `dataset_mappings`
   that holds live mappings, a soft-deleted row blocks re-discovery → unrecoverable. This directly
   drove **Phase_14 Option B** (hard-delete + archive + recovery), not a soft-delete.
3. **Legacy coupling** — V2 already has `dataset_columns` as its column catalog, yet the Mappings UI
   still reads the legacy `discovered_columns`/`discovered_datasets` for pickers, so UI schema can
   drift from actual V2 discovery data.
4. **Stale/redundant Datasets page** — it renders the legacy raw inventory (Default Tenant seed only),
   disconnected from the V2 `dataset_mappings` data.

---

## 5. Phase 14 Relevance
Phase_14 clear/recovery deliberately targets the **merged V2 tables** (`dataset_mappings`,
`dataset_columns`, `rule_dataset_mapping`) with archive + hard-delete. `discovered_datasets` /
`discovered_columns` sit **outside** that scope and must be treated as a separate cleanup decision
(repint Mappings UI to `dataset_columns`, or formally retire them).

---

## 6. Decision / Contingency
- **Current stance:** keep the merged V2 model; treat `discovered_datasets`/`discovered_columns` as a
  legacy read-only dictionary and decouple the Mappings UI from them (repoint `get_schema` /
  `get_target_columns` to `dataset_columns` or live adapters). Retire or re-source the Datasets page.
- **Fallback (if merged model becomes unmanageable):** revisit the **legacy architecture** — adopt
  `discovered_datasets` / `discovered_columns` (or a V2-native equivalent) as a **separate discovery
  inventory layer** distinct from `column_mappings`, restoring the originally-intended separation.
  Trigger conditions for reconsideration:
  - The `ON CONFLICT DO NOTHING` / re-discovery recovery problem proves intractable under the merged model.
  - Discovery (found-but-not-mapped) and mapping (intended transformation) semantics cannot be cleanly
    separated for reporting/audit.
  - The legacy-coupling cleanup cannot be completed without a schema redesign.

---

## 7. Short-term Recommendations
1. Repoint Mappings UI schema pickers from legacy `discovered_*` to `dataset_columns` / live adapters.
2. Decide Datasets page fate: back it with `dataset_mappings`, or remove it (frontend-only, low risk).
3. Do **not** drop `discovered_datasets`/`discovered_columns` while the Mappings UI still reads them
   (would break `get_schema`/`get_target_columns` and the `v_migration_*` views).

---

## 8. Open Questions
- Was `dataset_mappings` intentionally chosen as the merged container, or an accretion of the legacy
  `discovered_datasets` role?
- Should Phase_14 be extended to also archive/retire `discovered_*` (legacy cleanup workstream)?

## 9. References
- `research/Part_1_Legacy_v2_1_AutoMapping_Architecture_Analysis.md:261`
- `app/services/dataset_discovery_service.py` (writes `dataset_mappings`/`dataset_columns`)
- `app/db/repositories/discovery_repository.py` (reads `dataset_mappings`)
- `app/services/mapping/mapping_repository.py` (`get_schema`, `get_target_columns` → legacy `discovered_*`)
- `app/repositories/migration_dataset_repository.py`, `migration_project_repository.py`
- `engineering/MAP_V2/00_Architecture/Verification/Phase_07/*` (architectural-review flag)
- Live DB inspection: `core.discovered_datasets` (8 rows), `core.discovered_columns` (16 rows), all Default Tenant
