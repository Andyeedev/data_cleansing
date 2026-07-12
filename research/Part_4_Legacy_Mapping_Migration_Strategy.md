# Part 4: Legacy v2.1 → Current — Automated Mapping Migration Strategy

## Objective

Determine exactly which automated mapping components existed in legacy v2.1, compare against the current project, and produce a concrete migration strategy for each component.

---

## 1. Table Matching Algorithms

### Legacy v2.1 (`matching_strategies.py`)

The legacy system had a fully implemented heuristic table matching engine:

| Component | Detail |
|-----------|--------|
| **Algorithm** | `difflib.SequenceMatcher` on normalized table names |
| **Normalization** | Removes prefixes/suffixes: `_source`, `_src`, `_target`, `_tgt` |
| **Column Overlap** | Jaccard similarity of column name sets between source and target tables |
| **Weighted Score** | `final_score = (0.4 × name_similarity) + (0.6 × column_overlap)` |
| **Function** | `table_score(source, target) → float` |
| **Dependencies** | `difflib.SequenceMatcher` only (stdlib — zero external deps) |
| **File** | `app/mapping_engine/matching_strategies.py` |

### Current Project

| Component | Detail |
|-----------|--------|
| **Algorithm** | Simple suffix replacement only: strips `_source`, appends `_target` |
| **Column Overlap** | Not used |
| **Weighted Score** | None |
| **Function** | `DatasetDiscoveryService._match_tables()` — returns exact suffix matches only |
| **File** | `app/services/dataset_discovery_service.py` (lines 38–58) |

**Verdict:** ❌ Not present — the `app/mapping_engine/` directory is empty.

### Migration Decision

| Question | Answer |
|----------|--------|
| **Should it be migrated?** | ✅ Yes — the fuzzy matching logic is mathematically sound and zero-dependency |
| **Should it be redesigned?** | ⚠️ Partial — the algorithm itself should be ported as-is, but should be integrated into the new adapter-based discovery pipeline rather than recreated as a standalone module |
| **Estimated effort** | 3–5 days (2 days to port + 1–3 days to integrate with new adapter discovery pipeline) |

### Recommended Approach

1. Extract the `table_score()` function logic into a new `app/intelligence/matching/table_matcher.py`
2. Add configurable scoring weights (legacy was hardcoded at 0.4/0.6)
3. Integrate with `MappingResolver` to produce scored mapping contracts
4. Add threshold configuration (`auto_match`, `review_required`, `rejected`) to `config.yaml`

---

## 2. Column Matching Algorithms

### Legacy v2.1 (`mapping_engine.py` + `matching_strategies.py`)

| Component | Detail |
|-----------|--------|
| **Algorithm** | Fuzzy matching of column names using `difflib.SequenceMatcher` |
| **Data type bonus** | `+0.05` if source and target data types match |
| **PK bonus** | `+0.10` if both columns are primary keys |
| **Function** | `column_score(source_col, target_col) → float` |
| **Input** | Column metadata objects (name, data_type, is_primary_key) |
| **File** | `app/mapping_engine/matching_strategies.py` |

### Current Project

**Verdict:** ❌ Not present — no column matching logic exists. `DatasetDiscoveryService` fetches column arrays but never matches them. The `MetadataIntelligenceService` only infers roles per column, never matches across systems.

### Migration Decision

| Question | Answer |
|----------|--------|
| **Should it be migrated?** | ✅ Yes — column matching is essential for automated mapping |
| **Should it be redesigned?** | ✅ Yes — the legacy approach only used name + type + PK. A redesigned version should also consider: ordinal position, nullability, default values, foreign key references, and data profiling statistics |
| **Estimated effort** | 5–7 days (2 days port + 3–5 days enhancement) |

### Recommended Approach

1. Port `column_score()` to `app/intelligence/matching/column_matcher.py`
2. Add extended scoring factors:
   - Position similarity (columns in same ordinal position)
   - Nullability match (+0.03)
   - FK reference match (both reference same table → +0.10)
   - Length/precision match for numeric types
3. Add rejection rules (e.g., incompatible types should never match)

---

## 3. Metadata Extraction

### Legacy v2.1

| Component | Detail |
|-----------|--------|
| **Table Enumeration** | `DiscoveryService.get_table_columns()` — fetches all tables for a schema |
| **Column Extraction** | Pulls: name, data_type, is_nullable, ordinal_position, column_default |
| **Constraint Loading** | `ConstraintLoader` — identifies PKs and FKs from `information_schema` |
| **Normalization** | Standard Python dict with keys: `column_name`, `data_type`, `is_nullable`, `is_primary_key`, `is_foreign_key`, `references` |
| **Persistence** | `DiscoveryRepository` — upserts into `core.datasets` and `core.dataset_columns` |
| **Files** | `app/discovery/discovery_service.py`, `app/discovery/constraint_loader.py`, `app/db/repositories/discovery_repository.py` |

### Current Project

| Component | Detail | Status |
|-----------|--------|--------|
| **Table Enumeration** | `DatasetDiscoveryService._fetch_tables()` | ⚠️ Exists but uses inline SQL with `information_schema`, only excludes `pg_catalog` |
| **Column Extraction** | `DatasetDiscoveryService._fetch_columns()` | ⚠️ Returns only column **names** — no types, nullability, defaults |
| **Constraint Loading** | `AutoRuleDiscovery._detect_foreign_keys()` | ⚠️ FK detection exists but for rule inference only, not persisted |
| **Normalization** | `MetadataIntelligenceService.infer_column_roles()` | ⚠️ Name-based heuristics only (`id`→PK, `numeric`→NUMERIC_METRIC) |
| **Persistence** | Inline INSERT statements in `DatasetDiscoveryService._create_mapping()` | ❌ No dedicated `DiscoveryRepository` |

**Files:**
- `app/services/dataset_discovery_service.py` (lines 283–306)
- `app/discovery/auto_rule_discovery.py` (lines 266–311)
- `app/services/metadata_intelligence_service.py` (full file, 36 lines)

### Migration Decision

| Question | Answer |
|----------|--------|
| **Should it be migrated?** | ✅ Yes — the legacy ConstraintLoader and DiscoveryRepository patterns are solid and should be recreated |
| **Should it be redesigned?** | ✅ Yes — must be redesigned to work through the adapter pattern rather than inline SQL. Also needs Pydantic models and proper persistence |
| **Estimated effort** | 7–10 days (5 days adapter discovery methods + 2–5 days repository layer) |

### Recommended Approach

1. Add discovery methods to `BaseAdapter`:
   - `discover_tables(schema_pattern)` → returns list of `TableMetadata`
   - `discover_columns(schema, table)` → returns list of `ColumnMetadata`
   - `discover_primary_keys(schema, table)` → returns list of PK column names
   - `discover_foreign_keys(schema, table)` → returns list of FK references
2. Create Pydantic models: `TableMetadata`, `ColumnMetadata`, `ConstraintMetadata`
3. Create `DiscoveryRepository` with upsert/versioning support
4. Implement methods for all 7 adapters (not just Postgres and SQL Server)

---

## 4. Similarity Scoring

### Legacy v2.1 (`matching_strategies.py`)

| Function | Purpose | Algorithm |
|----------|---------|-----------|
| `similarity(a, b)` | Generic string similarity | `difflib.SequenceMatcher.ratio()` — returns 0.0–1.0 |
| `table_score(source, target)` | Table-level match score | `0.4 × name_sim + 0.6 × column_overlap` |
| `column_score(src_col, tgt_col)` | Column-level match score | `name_sim + type_bonus(0.05) + pk_bonus(0.10)` |
| **Threshold** | None (scores are continuous) | Classification applied later |

**Reusability Score (legacy):** 5/5 — pure functions, zero dependencies beyond stdlib.

### Current Project

**Verdict:** ❌ Not present — the `app/intelligence/matching/` directory is empty. No similarity scoring functions exist anywhere in the codebase.

### Migration Decision

| Question | Answer |
|----------|--------|
| **Should it be migrated?** | ✅ Yes — pure functions with zero dependencies, trivial to port |
| **Should it be redesigned?** | ⚠️ Minimal — the core `similarity()` function can be identical. The scoring formulas should be made configurable via parameters |
| **Estimated effort** | 1–2 days |

### Recommended Approach

1. Port `similarity(a, b)` → `app/intelligence/matching/similarity.py` — identical implementation using `difflib.SequenceMatcher`
2. Port `table_score()` → `app/intelligence/matching/table_scorer.py` — make weights configurable
3. Port `column_score()` → `app/intelligence/matching/column_scorer.py` — make bonuses configurable
4. Add unit tests with known source/target name pairs to validate correct behavior

---

## 5. Confidence Scoring (Mapping Classification)

### Legacy v2.1 (`mapping_engine.py`)

| Component | Detail |
|-----------|--------|
| **Classification** | 3-tier based on confidence score |
| **AUTO_MATCHED** | `confidence > 0.85` |
| **REVIEW_REQUIRED** | `confidence > 0.65 and ≤ 0.85` |
| **REJECTED** | `confidence < 0.65` |
| **Persistence** | Saved to `core.dataset_mappings` with classification status |
| **Usage** | Drives which mappings can be auto-applied vs. require human review |

### Current Project

**Verdict:** ❌ Not present — the current `ScoringEngine` (`app/scoring_engine.py`) performs **batch risk-weighted scoring** for execution results, not mapping confidence scoring. No mapping classification exists.

### Migration Decision

| Question | Answer |
|----------|--------|
| **Should it be migrated?** | ✅ Yes — three-tier classification is essential for automated mapping |
| **Should it be redesigned?** | ✅ Yes — should be expanded to support additional classification dimensions (e.g., structural confidence, data-type confidence, FK relationship confidence) |
| **Estimated effort** | 3–4 days |

### Recommended Approach

1. Create `app/intelligence/mapping/mapping_confidence_scorer.py`
2. Port the 3-tier classification with configurable thresholds in `config.yaml`:
   ```yaml
   mapping:
     classification:
       auto_match_threshold: 0.85
       review_threshold: 0.65
   ```
3. Add additional confidence dimensions:
   - Name similarity confidence
   - Schema similarity confidence
   - FK relationship confidence
   - Data type compatibility confidence
4. Store overall confidence and per-dimension scores in `core.dataset_mappings`
5. Add a `mapping_status` column (or reuse `is_active` semantics): `AUTO_MATCHED`, `MANUAL`, `REVIEW_REQUIRED`, `REJECTED`

---

## 6. Discovery Logic

### Legacy v2.1

| Component | Detail |
|-----------|--------|
| **DiscoveryService** | `run_auto_discovery(source_id)` — orchestrates full schema discovery for a system |
| **DiscoveryRepository** | `upsert_dataset()`, `insert_columns()` — persists discovered metadata |
| **ConstraintLoader** | `load_constraints()` — identifies PKs and FKs |
| **Pipeline** | Connect → Discover Tables → Discover Columns → Load Constraints → Persist |
| **Schema Isolation** | Queried `public` schema by default, but schema parameter was available |

### Current Project

| Component | Detail | Status |
|-----------|--------|--------|
| **DatasetDiscoveryService** | `discover()` — orchestrates discovery | ⚠️ Exists but much simpler |
| **DiscoveryRepository** | None | ❌ Missing — uses inline INSERTs |
| **ConstraintLoader** | None | ❌ Missing — FK detection only in `AutoRuleDiscovery` |
| **Pipeline** | Connect → Fetch Tables → Match (suffix) → Create Mapping + Bind Rules | ⚠️ Simplified, no full schema scanning |

### Migration Decision

| Question | Answer |
|----------|--------|
| **Should it be migrated?** | ✅ Yes — the legacy DiscoveryService + DiscoveryRepository + ConstraintLoader pipeline should be recreated |
| **Should it be redesigned?** | ✅ Yes — must be redesigned to work through adapter discovery methods, support all 7 databases, and include metadata versioning |
| **Estimated effort** | 10–14 days (see Phase 2+3 from the roadmap in Part 3) |

### Recommended Approach

This is covered in detail by Phases 2–4 of the roadmap in `Part_3_Current_System_Architecture_Assessment.md`. In summary:

1. `SchemaDiscoveryService` — orchestrates discovery using adapter methods
2. `DiscoveryRepository` — persists with upsert logic and versioning support
3. `ConstraintLoader` — dedicated PK/FK/index discovery
4. `MetadataVersioning` — snapshot-based change tracking

---

## 7. Reusable Classes — Complete Inventory

| # | Legacy Component | File (Legacy) | Present? | Redesign? | Effort |
|---|-----------------|---------------|----------|-----------|--------|
| 1 | `BaseAdapter` | `app/db/adapters/base_adapter.py` | ✅ Present | ⚠️ Extend | — |
| 2 | `PostgresAdapter` | `app/db/adapters/postgres_adapter.py` | ✅ Present | ⚠️ Add discovery | — |
| 3 | `SQLServerAdapter` | `app/db/adapters/sqlserver_adapter.py` | ✅ Present | ⚠️ Add discovery | — |
| 4 | Other adapters (5 more) | `app/db/adapters/` | ✅ Present | ⚠️ Complete impl. | 3–5d |
| 5 | `ConnectionFactory` | `app/db/connection_factory.py` | ✅ Present | ✅ Enough | — |
| 6 | `DiscoveryService` | `app/discovery/discovery_service.py` | ❌ Missing | ✅ Redesign | 7–10d |
| 7 | `ConstraintLoader` | `app/discovery/constraint_loader.py` | ❌ Missing | ✅ Redesign | 5–7d |
| 8 | `DiscoveryRepository` | `app/db/repositories/discovery_repository.py` | ❌ Missing | ✅ Redesign | 3–5d |
| 9 | `MappingEngine` | `app/mapping_engine/mapping_engine.py` | ❌ Missing | ✅ Redesign | 7–10d |
| 10 | `MatchingStrategies` | `app/mapping_engine/matching_strategies.py` | ❌ Missing | ⚠️ Port | 1–2d |
| 11 | `TableMatchingEngine` | `app/matching/table_matching_engine.py` | ❌ Missing | ✅ Redesign | 3–5d |
| 12 | `ScoringEngine` (mapping) | `app/scoring/scoring.py` | ❌ Missing | ✅ Redesign | 3–4d |
| 13 | `AutoRuleDiscovery` | `app/discovery/auto_rule_discovery.py` | ✅ Present | ⚠️ Enhance | — |
| 14 | `MetadataIntelligenceService` | `app/services/metadata_intelligence_service.py` | ✅ Present | ⚠️ Replace | — |
| 15 | `MappingResolver` | `app/services/mapping_resolver.py` | ✅ Present | ⚠️ Enrich | — |
| 16 | `DatasetDiscoveryService` | `app/services/dataset_discovery_service.py` | ✅ Present | 🔴 Replace | 10–14d |

### Legend

| Status | Meaning |
|--------|---------|
| ✅ Present | Functionally exists in current project |
| ❌ Missing | Does not exist in current project |
| ⚠️ Extend / Enhance | Exists but needs additions |
| ⚠️ Port | Should be copied with minimal changes |
| ✅ Redesign | Needs significant architectural rework |
| 🔴 Replace | Should be rewritten entirely |

---

## 8. Summary Migration Plan

```
Phase 0: Foundation (1–2 days)
  ├── Port matching_strategies.py → app/intelligence/matching/
  │   └── similarity(), table_score(), column_score()
  └── Create Pydantic models → app/schemas/metadata_schema.py
      └── TableMetadata, ColumnMetadata, ConstraintMetadata

Phase 1: Adapter Discovery Methods (5–7 days)
  ├── Extend BaseAdapter with discovery interface
  ├── Implement for all 7 adapters
  └── Create DiscoveryRepository

Phase 2: Discovery Pipeline (7–10 days)
  ├── SchemaDiscoveryService (unified orchestrator)
  ├── MetadataVersioning
  └── MetadataCache (Redis)

Phase 3: Mapping Engine (10–14 days)
  ├── TableMatchingEngine (heuristic + configurable)
  ├── ColumnMatchingEngine (extended scoring)
  ├── MappingScoringEngine (3-tier classification)
  └── MappingReviewService (human-in-the-loop)

Phase 4: AI-Assisted Mapping (21–30 days)
  ├── AIMappingService (LLM integration)
  ├── InferenceEngine (statistical FK inference)
  └── FeedbackLoop (learn from human decisions)

Total estimated effort: 44–67 days
```

### Key Dependencies

| Phase | Depends On | Risk Level |
|-------|------------|------------|
| 0: Foundation | None | Low |
| 1: Adapter Discovery | Phase 0 | Medium — adapter implementation gaps |
| 2: Discovery Pipeline | Phase 1 | Medium — schema size performance |
| 3: Mapping Engine | Phase 0, 2 | High — algorithm tuning required |
| 4: AI-Assisted Mapping | Phase 3 | High — LLM cost, data privacy |

### Critical Path

**Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4**

Phase 0 and Phase 1 can be partially parallelized (Pydantic models and adapter discovery methods are independent of the matching logic port).

---

## 9. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Legacy `difflib.SequenceMatcher` struggles with abbreviations (e.g., `CUST` vs `CUSTOMER`) | Medium | Add abbreviation dictionary + token-based matching fallback |
| Fuzzy matching performance on 1000+ tables | High | Add configurable pre-filtering (schema filter, name prefix filter) before scoring |
| Column matching produces too many false positives | Medium | Add minimum threshold for column score (configurable) |
| Data type incompatibility across vendors | High | Build type compatibility matrix (e.g., `VARCHAR` ↔ `NVARCHAR` = compatible; `INT` ↔ `VARCHAR` = incompatible) |
| Duplicate legacy methods cause confusion during migration | Low | Methodically deprecate and remove legacy methods as new ones are deployed |

---

## 10. Files That Would Be Created (New) or Modified

### New Files

| File | Purpose |
|------|---------|
| `app/intelligence/matching/similarity.py` | Core `similarity()` function |
| `app/intelligence/matching/table_matcher.py` | `table_score()` + table matching orchestration |
| `app/intelligence/matching/column_matcher.py` | `column_score()` + column matching orchestration |
| `app/intelligence/mapping/mapping_confidence_scorer.py` | 3-tier classification |
| `app/schemas/metadata_schema.py` | Pydantic models (TableMetadata, ColumnMetadata, etc.) |
| `app/services/schema_discovery_service.py` | Unified discovery orchestrator |
| `app/db/repositories/discovery_repository.py` | Discovery persistence with upsert |
| `app/discovery/constraint_loader.py` | Dedicated PK/FK/index discovery |
| `app/intelligence/inference/relationship_inference.py` | Statistical FK inference |
| `app/services/mapping_service.py` | Automated mapping orchestration |

### Files to Modify

| File | Change |
|------|--------|
| `app/db/adapters/base_adapter.py` | Add discovery interface methods |
| `app/db/adapters/postgres_adapter.py` | Implement discovery methods + remove hardcoded `'public'` |
| `app/db/adapters/sqlserver_adapter.py` | Implement discovery methods |
| `app/db/adapters/mysql_adapter.py` | Implement discovery methods |
| `app/db/adapters/snowflake_adapter.py` | Implement discovery methods |
| `app/db/adapters/bigquery_adapter.py` | Implement discovery methods |
| `app/db/adapters/oracle_adapter.py` | Implement discovery methods |
| `app/db/adapters/odatabricks_adapter.py` | Implement discovery methods |
| `app/services/mapping_resolver.py` | Integrate mapping scoring and classification |
| `app/services/dataset_discovery_service.py` | **Replace** with new SchemaDiscoveryService |
| `app/discovery/auto_rule_discovery.py` | Refactor to use new discovery pipeline |
| `app/services/metadata_intelligence_service.py` | Replace with enhanced profiler |

---

## Appendix: Legacy Method Signatures for Reference

```python
# matching_strategies.py — Legacy reference for porting

from difflib import SequenceMatcher

def similarity(a: str, b: str) -> float:
    """Normalized string similarity (0.0–1.0)"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def table_score(source: dict, target: dict) -> float:
    """Table-level match score (0.0–1.0)"""
    name_sim = similarity(source['name'], target['name'])
    source_cols = set(source.get('columns', []))
    target_cols = set(target.get('columns', []))
    if not source_cols or not target_cols:
        col_overlap = 0.0
    else:
        col_overlap = len(source_cols & target_cols) / len(source_cols | target_cols)
    return (0.4 * name_sim) + (0.6 * col_overlap)

def column_score(source: dict, target: dict) -> float:
    """Column-level match score (0.0–1.0)"""
    score = similarity(source['name'], target['name'])
    if source.get('data_type') == target.get('data_type'):
        score += 0.05
    if source.get('is_primary_key') and target.get('is_primary_key'):
        score += 0.10
    return min(score, 1.0)
```

---

*End of Document: Part 4 — Legacy Mapping Migration Strategy*