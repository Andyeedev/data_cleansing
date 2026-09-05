# EXECUTIVE SUMMARY
## Table Usage Categorization - Phase 07 Runtime Lineage Audit

**Generated:** 2026-07-24
**Status:** EVIDENCE ONLY - Pending Phase 07 Approval
**Full Report:** `Table_Usage_Categorization_Report.md`

---

## Purpose

This audit traces every database table reference across the MAP CLI codebase to determine:
1. Which tables are actually used during runtime
2. Which tables are platform/UI infrastructure
3. Which tables are legacy, duplicate, or candidates for architectural review

**Key finding:** The repository files containing incorrect table references (`engine.systems`, `engine.controls`, `engine.audit_log`, `engine.approvals`, `engine.exceptions`) are **uncommitted local files** with no git history. These are uncommitted implementations, not historical schema changes.

---

## Database Context

| Property | Value |
|----------|-------|
| Database | `migration_engine` |
| Connection | `postgresql://postgres:***@localhost:5432/migration_engine` |
| Current Row Counts | All tables show 0 rows (truncated by `truncate_resets_v1_4.sql`) |
| Original Data | Documented in `engine_backup.sql` and `03_Database_Verification/database_verification_output.txt` |

---

## Classification Summary

| Category | Count | Description |
|----------|-------|-------------|
| **Runtime (MAP CLI)** | 14 | Actively used during `python app/main.py run` |
| **Runtime (FK targets)** | 5 | Core tables referenced via foreign keys |
| **Platform (current UI)** | 16 | Used by FastAPI web application |
| **Platform (infrastructure)** | 12 | Set up but not integrated |
| **Legacy** | 22 | OLD variants, legacy schemas, defined but not created |
| **Duplicate** | 1 | `engine.tenants` duplicates `core.tenants` |
| **Candidate for architectural review** | 26 | No references, requires decision |
| **Total** | 96 | |

---

## Critical Findings

### 1. Runtime Tables (14 engine + 5 core)

These tables are used during actual MAP CLI execution:

| Table | Purpose | References |
|-------|---------|------------|
| `engine.migration_batch_registry` | Batch lifecycle tracking | 93 refs |
| `engine.migration_control_execution` | Rule execution results | Multiple |
| `engine.migration_control_summary` | Control aggregation | Multiple |
| `engine.migration_control_exceptions` | Exception recording | Multiple |
| `engine.migration_validation_batch` | Batch metadata | Multiple |
| `engine.migration_governance_status` | Governance status | Multiple |
| `engine.migration_batch_summary` | Batch summary | Multiple |
| `engine.migration_release_decision` | Release gate | Multiple |
| `engine.batch_execution_checkpoint` | Checkpoint/resume | Multiple |
| `engine.control_registry` | Control definitions | Multiple |
| `engine.rule_registry` | Rule definitions | Multiple |
| `engine.run_governance_intelligence` | Scoring function | Multiple |
| `engine.migration_exception_register` | Exception register | Uncommitted implementation |
| `core.system_registry` | Connection resolution | Multiple |
| `core.system_credentials` | Credential retrieval | Multiple |
| `core.dataset_mappings` | Mapping resolution | Multiple |
| `core.dataset_columns` | Column metadata | Multiple |
| `core.rule_dataset_mapping` | Rule-mapping binding | Multiple |
| `core.projects` | FK target | Indirect |

### 2. Incorrect References (Uncommitted Code)

| Reference | File | Status |
|-----------|------|--------|
| `engine.systems` | dashboard_repository.py | UNTRACKED |
| `engine.controls` | dashboard_repository.py | UNTRACKED |
| `engine.audit_log` | dashboard_repository.py, governance_repository.py | UNTRACKED |
| `engine.approvals` | governance_repository.py | UNTRACKED |
| `engine.exceptions` | governance_repository.py | UNTRACKED |
| `engine.migration_risk_scores` | validation_report_repository.py | UNTRACKED |
| `engine.migration_batch_lifecycle` | execution_control_repository.py | UNTRACKED |

**Current Working Hypothesis:** Repository files reference objects that do not exist in the current deployed schema. The origin of these references has not yet been established. Service layer catches exceptions and returns empty/zero values, silently masking errors.

### 3. Defined but Never Created

| Table | Defined In | Status |
|-------|------------|--------|
| `engine.migration_control_decisions` | install_governance_tables.sql:11 | NOT IN DB |
| `engine.migration_risk_scores` | install_governance_tables.sql:34 | NOT IN DB |
| `engine.tenants` | install_governance_tables.sql:49 | NOT IN DB (candidate for architectural review) |

### 4. engine.tenants - Candidate for Architectural Review

- Duplicates `core.tenants` with different PK type (VARCHAR vs UUID)
- Zero references anywhere in codebase
- Candidate for architectural review

---

## KPI Endpoint Validation

| Endpoint | Tables Used | Status |
|----------|-------------|--------|
| `GET /api/v1/dashboard/portfolio` | `engine.systems` (INCORRECT), `engine.migration_batch_registry` (Runtime), `engine.controls` (INCORRECT) | **Pending architectural decision** |
| `GET /api/v1/dashboard/kpis` | `engine.migration_batch_registry` (Runtime), `engine.systems` (INCORRECT) | **Pending architectural decision** |
| `GET /api/v1/dashboard/activity` | `engine.audit_log` (INCORRECT) | **Pending architectural decision** |

**Finding:** All 3 KPI endpoints reference incorrect tables. Their runtime behaviour cannot be confirmed until the architectural decision is made.

**Recommendation:** KPI endpoints cannot be validated until incorrect references are resolved.

---

## Remaining Before Phase 07 Freeze

| Item | Status | Action Required |
|------|--------|-----------------|
| Report inconsistencies | Resolved | Database connection documented, row counts explained |
| Runtime count reconciliation | Resolved | 14 engine + 5 core = 19 total |
| Active/inactive classification | Complete | Full table inventory with classification |
| KPI runtime table usage | **Pending architectural decision** | KPI endpoints reference incorrect tables |
| Final approval | Pending | Awaiting user review |

---

## Evidence Files

| File | Purpose |
|------|---------|
| `Executive_Summary.md` | This document (2-3 pages) |
| `Table_Usage_Categorization_Report.md` | Full evidence report |
| `Evidence_Chain_Table_Replacements.md` | Detailed analysis of incorrect references |
| `Runtime_Lineage/runtime_lineage_output.json` | Query execution trace |
| `Runtime_Lineage/runtime_lineage_report.md` | Lineage analysis |
| `MAP_Phase_07_Verification_Report.md` | Phase 07 verification |

---

**Document Generated:** 2026-07-24
**Status:** EVIDENCE ONLY - Pending Phase 07 Approval
