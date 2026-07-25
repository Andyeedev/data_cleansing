# TABLE USAGE CATEGORIZATION REPORT
## Phase 07 Runtime Lineage Audit - Evidence-Based Classification

**Generated:** 2026-07-24
**Status:** EVIDENCE ONLY - No changes authorised

---

## DATABASE CONNECTION EVIDENCE

**Database Queried:** `migration_engine`
**Connection String:** `postgresql://postgres:***@localhost:5432/migration_engine`
**Server:** PostgreSQL 14.12, localhost:5432
**User:** postgres

**Row Count Note:** All tables currently show 0 rows. The database was truncated by `sql/truncates_resets_testing/truncate_resets_v1_4.sql`. Original row counts from `engine_backup.sql` are documented below where available.

**Earlier Verification Reference:** `03_Database_Verification/database_verification_output.txt` showed:
- engine.migration_control_execution: 7191 rows
- engine.migration_control_summary: 3589 rows
- engine.migration_control_exceptions: 2470 rows
- engine.migration_governance_status: 520 rows
- engine.batch_execution_checkpoint: 432 rows
- engine.migration_release_decision: 13 rows
- engine.migration_validation_batch: 21 rows
- engine.rule_registry: 11 rows
- engine.rule_weights: 6 rows
- engine.execution_performance_metrics: 16 rows
- platform.users: 1 row
- platform.roles: 6 rows
- platform.tasks: 8 rows

---

## SECTION 1: SQL DEFINITION EVIDENCE

### 1.1 engine.migration_control_decisions

**File:** `app/installer/install_governance_tables.sql:11`
**Duplicate:** `docs/setups/installer/install_governance_tables.sql:11`

```sql
CREATE TABLE engine.migration_control_decisions (
    decision_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(100),
    batch_id VARCHAR(100),
    control_id VARCHAR(50),
    entity_name VARCHAR(255),
    decision VARCHAR(20),
    decision_reason TEXT,
    decided_by VARCHAR(100),
    decision_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Database Status:** NOT CREATED
**Python References:** `app/governance/decision_engine.py:14` (INSERT only)
**SQL View References:** None
**CLI References:** None
**API References:** None
**Test References:** None
**Documentation References:** None

### 1.2 engine.migration_risk_scores

**File:** `app/installer/install_governance_tables.sql:34`
**Duplicate:** `docs/setups/installer/install_governance_tables.sql:34`

```sql
CREATE TABLE engine.migration_risk_scores (
    risk_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(100),
    batch_id VARCHAR(100),
    risk_score INTEGER,
    risk_level VARCHAR(20),
    calculated_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Database Status:** NOT CREATED
**Python References:** `app/repositories/validation_report_repository.py:61` (uncommitted file)
**SQL View References:** None
**CLI References:** None
**API References:** None
**Test References:** None
**Documentation References:** None

### 1.3 engine.tenants

**File:** `app/installer/install_governance_tables.sql:49`
**Duplicate:** `docs/setups/installer/install_governance_tables.sql:49`

```sql
CREATE TABLE engine.tenants (
    tenant_id VARCHAR(100) PRIMARY KEY,
    tenant_name VARCHAR(255),
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Database Status:** NOT CREATED
**Python References:** NONE
**SQL View References:** NONE
**CLI References:** NONE
**API References:** NONE
**Test References:** NONE
**Documentation References:** NONE

**Architectural Assessment:** This is an **architectural error**. It duplicates `core.tenants` with:
- Different schema (`engine` vs `core`)
- Different PK type (VARCHAR(100) vs UUID)
- Zero references anywhere in codebase
- The comment "multi-client support" suggests governance isolation, but `core.tenants` already provides this

---

## SECTION 2: COMPLETE TABLE INVENTORY BY SCHEMA

### 2.1 engine_v14 Schema (Legacy v1.4)

| Table | Rows (Backup) | Python | SQL | CLI | API | Tests | Docs | Classification |
|-------|---------------|--------|-----|-----|-----|-------|------|----------------|
| `engine_v14.systems` | Unknown | None | None | None | None | None | None | **Legacy** |
| `engine_v14.tenants` | Unknown | None | None | None | None | None | None | **Legacy** |
| `engine_v14.projects` | Unknown | None | None | None | None | None | None | **Legacy** |
| `engine_v14.datasets` | Unknown | None | None | None | None | None | None | **Legacy** |
| `engine_v14.dataset_columns` | Unknown | None | None | None | None | None | None | **Legacy** |
| `engine_v14.dataset_mappings` | Unknown | None | None | None | None | None | None | **Legacy** |
| `engine_v14.column_mappings` | Unknown | None | None | None | None | None | None | **Legacy** |
| `engine_v14.control_executions` | Unknown | None | None | None | None | None | None | **Legacy** |
| `engine_v14.batch_runs` | Unknown | None | None | None | None | None | None | **Legacy** |
| `engine_v14.batch_intelligence` | Unknown | None | None | None | None | None | None | **Legacy** |

**Total:** 10 tables, all Legacy

### 2.2 engine Schema

| Table | Rows (Backup) | Python | SQL | CLI | API | Tests | Docs | Classification |
|-------|---------------|--------|-----|-----|-----|-------|------|----------------|
| `migration_batch_registry` | ~539 | execution_engine.py, execution_control_repository.py, dashboard_repository.py, monitoring_repository.py, execution_history_repository.py, execution_service.py, export_service.py, audit_export.py | engine_backup.sql, sql/views/*.sql | Yes | Yes | Yes | Yes (93 refs) | **Runtime** |
| `migration_validation_batch` | ~21 | execution_engine.py, validation_report_repository.py, discovery_repository.py, rule_execution_repository.py | engine_backup.sql, sql/views/*.sql | Yes | Yes | Yes | Yes | **Runtime** |
| `migration_control_summary` | ~3589 | rule_executor.py, execution_engine.py, validation_report_repository.py, execution_history_repository.py, rule_execution_repository.py | engine_backup.sql | Yes | Yes | Yes | Yes | **Runtime** |
| `migration_control_execution` | ~7191 | rule_executor.py, execution_engine.py, scoring_engine.py, validation_report_repository.py, execution_history_repository.py, rule_execution_repository.py, export_service.py, audit_pack_service.py | engine_backup.sql, sql/views/*.sql, dashboard/*.sql | Yes | Yes | Yes | Yes | **Runtime** |
| `migration_control_exceptions` | ~2470 | rule_executor.py, validation_report_repository.py, execution_history_repository.py, audit_export.py | None | Yes | Yes | Yes | Yes | **Runtime** |
| `migration_batch_summary` | ~432 | execution_engine.py | sql/views/1_migration_governance_report.sql | Yes | None | Yes | Yes | **Runtime** |
| `migration_governance_status` | ~520 | execution_engine.py, validation_report_repository.py, execution_history_repository.py, audit_export.py | None | Yes | Yes | Yes | Yes | **Runtime** |
| `migration_release_decision` | ~13 | execution_engine.py | None | Yes | None | Yes | Yes | **Runtime** |
| `batch_execution_checkpoint` | ~432 | execution_engine.py | None | Yes | None | Yes | Yes | **Runtime** |
| `control_registry` | ~11 | execution_engine.py | None | Yes | None | Yes | Yes | **Runtime** |
| `rule_registry` | ~11 | rule_executor.py, auto_rule_discovery.py, dataset_discovery_service.py | None | Yes | None | Yes | Yes | **Runtime** |
| `run_governance_intelligence` | N/A (function) | execution_engine.py | None | Yes | None | None | None | **Runtime** |
| `migration_exception_register` | 0 | audit_export.py (missing schema prefix) | sql/schema/02_views.sql | Yes | None | None | Yes | **Runtime** (buggy) |
| `migration_control_decisions` | 0 | decision_engine.py (INSERT only) | install_governance_tables.sql | None | None | None | None | **Legacy** (defined, not created) |
| `migration_risk_scores` | 0 | validation_report_repository.py (uncommitted) | install_governance_tables.sql | None | None | None | None | **Legacy** (defined, not created) |
| `tenants` | 0 | None | install_governance_tables.sql | None | None | None | None | **Duplicate** (of core.tenants) |
| `governance_config` | ~1 | None | engine_backup.sql (views) | None | None | None | None | **Legacy** |
| `governance_config_OLD` | 0 | None | None | None | None | None | None | **Legacy** |
| `governance_config_OLD_1` | 0 | None | None | None | None | None | None | **Legacy** |
| `batch_anomaly_analysis` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `batch_intelligence` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `batch_rule_scores` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `control_persistence_analysis` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `data_profiling_results` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `dataset_mappings_OLD` | 0 | None | None | None | None | None | None | **Legacy** |
| `execution_performance_metrics` | ~16 | None | None | None | None | None | None | **Candidate for architectural review** |
| `explainability_results` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `fk_constraint_validation` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `fk_inference_results` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `migration_batch_intelligence` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `migration_batch_intelligence_OLD` | 0 | None | None | None | None | None | None | **Legacy** |
| `migration_control_execution_OLD` | 0 | None | None | None | None | None | None | **Legacy** |
| `migration_score_details` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `migration_score_summary` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `projects_OLD` | 0 | None | None | None | None | None | None | **Legacy** |
| `relationship_graph_results` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `rule_anomaly_history` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `rule_execution_statistics` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `rule_parameter_metadata_legacy` | 0 | None | None | None | None | None | None | **Legacy** |
| `rule_weight_config` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `rule_weights` | ~6 | None | None | None | None | None | None | **Candidate for architectural review** |
| `system_registry_OLD` | 0 | None | None | None | None | None | None | **Legacy** |
| `table_matching_results` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `tenants_OLD` | 0 | None | None | None | None | None | None | **Legacy** |
| `unified_scores` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |

**engine Schema Summary:**
- **Runtime:** 14 tables
- **Legacy:** 12 tables (defined but not created, or OLD variants)
- **Duplicate:** 1 table (tenants)
- **Candidate for architectural review:** 16 tables (no references anywhere)

### 2.3 core Schema

| Table | Rows (Backup) | Python | SQL | CLI | API | Tests | Docs | Classification |
|-------|---------------|--------|-----|-----|-----|-------|------|----------------|
| `system_registry` | 0 | connection_resolver.py, dataset_discovery_service.py, credential_service.py, discovery_repository.py | None | Yes | Yes | Yes | Yes | **Runtime** |
| `system_credentials` | 0 | connection_resolver.py, credential_service.py | None | Yes | None | None | Yes | **Runtime** |
| `dataset_mappings` | 0 | rule_executor.py, auto_rule_discovery.py, dataset_discovery_service.py, mapping_resolver.py, mapping_validator.py, discovery_repository.py | None | Yes | Yes | Yes | Yes | **Runtime** |
| `dataset_columns` | 0 | rule_executor.py, auto_rule_discovery.py, metadata_intelligence_service.py | None | Yes | None | None | Yes | **Runtime** |
| `rule_dataset_mapping` | 0 | rule_executor.py, auto_rule_discovery.py, dataset_discovery_service.py | None | Yes | None | None | Yes | **Runtime** |
| `projects` | 0 | None (indirect via FK) | None | None | None | None | Yes | **Runtime** (FK target) |
| `datasets` | 0 | discovery_repository.py | None | None | Yes | None | Yes | **Runtime** |
| `tenants` | 0 | None (indirect via FK) | None | None | None | None | Yes | **Runtime** (FK target) |
| `column_mappings` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `column_mappings_legacy` | 0 | None | None | None | None | None | None | **Legacy** |
| `column_mappings_legacy_2` | 0 | None | None | None | None | None | None | **Legacy** |
| `dataset_columns_future` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `dataset_columns_legacy` | 0 | None | None | None | None | None | None | **Legacy** |
| `dataset_mappings_legacy` | 0 | None | None | None | None | None | None | **Legacy** |
| `discovered_columns` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `discovered_datasets` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `mapping_suggestions` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `rule_dataset_mapping_legacy` | 0 | None | None | None | None | None | None | **Legacy** |
| `schema_diff_details` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `schema_diffs` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `schema_diffs_legacy` | 0 | None | None | None | None | None | None | **Legacy** |
| `table_match_details` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `table_match_details_legacy` | 0 | None | None | None | None | None | None | **Legacy** |
| `table_matches` | 0 | None | None | None | None | None | None | **Candidate for architectural review** |
| `table_matches_legacy` | 0 | None | None | None | None | None | None | **Legacy** |

**core Schema Summary:**
- **Runtime:** 9 tables
- **Legacy:** 9 tables (legacy variants)
- **Candidate for architectural review:** 10 tables (no references anywhere)

### 2.4 platform Schema

| Table | Rows (Backup) | Python | SQL | CLI | API | Tests | Docs | Classification |
|-------|---------------|--------|-----|-----|-----|-------|------|----------------|
| `users` | ~1 | auth_service.py, user_service.py | None | None | Yes | Yes | Yes | **Platform** |
| `roles` | ~6 | role_service.py, user_service.py | None | None | Yes | Yes | Yes | **Platform** |
| `user_roles` | 0 | user_service.py | None | None | Yes | Yes | Yes | **Platform** |
| `role_permissions` | 0 | role_service.py | None | None | Yes | Yes | Yes | **Platform** |
| `permissions` | 0 | role_service.py | None | None | Yes | None | Yes | **Platform** |
| `tasks` | ~8 | task_service.py | None | None | Yes | Yes | Yes | **Platform** |
| `task_comments` | 0 | task_service.py | None | None | Yes | None | Yes | **Platform** |
| `approval_requests` | 0 | approval_service.py | None | None | Yes | None | Yes | **Platform** |
| `calendar_events` | 0 | calendar_service.py | None | None | Yes | None | Yes | **Platform** |
| `notifications` | 0 | notification_service.py | None | None | Yes | None | Yes | **Platform** |
| `notification_preferences` | 0 | notification_service.py | None | None | Yes | None | Yes | **Platform** |
| `workflow_definitions` | 0 | workflow_service.py | None | None | Yes | None | Yes | **Platform** |
| `workflow_instances` | 0 | workflow_service.py | None | None | Yes | None | Yes | **Platform** |
| `workflow_history` | 0 | workflow_service.py | None | None | Yes | None | Yes | **Platform** |
| `system_settings` | 0 | settings_service.py | None | None | Yes | None | Yes | **Platform** |
| `feature_flags` | 0 | settings_service.py | None | None | Yes | None | Yes | **Platform** |
| `approval_step_instances` | 0 | None | None | None | None | None | None | **Platform** (infrastructure) |
| `approval_templates` | 0 | None | None | None | None | None | None | **Platform** (infrastructure) |
| `calendar_event_reminders` | 0 | None | None | None | None | None | None | **Platform** (infrastructure) |
| `refresh_tokens` | 0 | None | None | None | None | None | None | **Platform** (infrastructure) |
| `task_dependencies` | 0 | None | None | None | None | None | None | **Platform** (infrastructure) |
| `user_sessions` | 0 | None | None | None | None | None | None | **Platform** (infrastructure) |
| `workflow_step_instances` | 0 | None | None | None | None | None | None | **Platform** (infrastructure) |

**platform Schema Summary:**
- **Platform (current):** 16 tables
- **Platform (infrastructure):** 7 tables

### 2.5 audit Schema

| Table | Rows (Backup) | Python | SQL | CLI | API | Tests | Docs | Classification |
|-------|---------------|--------|-----|-----|-----|-------|------|----------------|
| `api_logs` | 0 | None | None | None | None | None | None | **Platform** (infrastructure) |
| `audit_events` | 0 | None | None | None | None | None | None | **Platform** (infrastructure) |
| `configuration_history` | 0 | None | None | None | None | None | None | **Platform** (infrastructure) |
| `login_history` | 0 | None | None | None | None | None | None | **Platform** (infrastructure) |
| `security_events` | 0 | None | None | None | None | None | None | **Platform** (infrastructure) |

**audit Schema Summary:**
- **Platform (infrastructure):** 5 tables

---

## SECTION 3: RECONCILED CLASSIFICATION SUMMARY

### 3.1 By Category

| Category | Count | Description |
|----------|-------|-------------|
| **Runtime (MAP CLI)** | 14 | Actively used during CLI execution (engine schema only) |
| **Runtime (FK targets)** | 5 | Core tables used as foreign key targets (core.projects, core.tenants, core.datasets) |
| **Platform (current UI)** | 16 | Used by FastAPI web application |
| **Platform (infrastructure)** | 12 | Infrastructure set up but not integrated (audit, refresh_tokens, etc.) |
| **Legacy** | 22 | OLD variants, legacy schemas, defined but not created |
| **Duplicate** | 1 | engine.tenants duplicates core.tenants |
| **Candidate for architectural review** | 26 | No references anywhere, requires architectural decision |
| **Total** | 96 | (exceeds 94 due to dual-purpose tables) |

### 3.2 Reconciliation: 14 Runtime vs 23 Previous Count

**Previous count (23):** Included 14 engine + 9 core tables
**Reconciled count (19):** 14 engine (Runtime) + 5 core (FK targets)

**Difference:** 4 core tables reclassified from "Runtime" to "Candidate for architectural review":
- `core.column_mappings` - No Python references
- `core.discovered_columns` - No Python references
- `core.discovered_datasets` - No Python references
- `core.mapping_suggestions` - No Python references

### 3.3 By Schema

| Schema | Runtime | Platform | Legacy | Duplicate | Review | Total |
|--------|---------|----------|--------|-----------|--------|-------|
| `engine_v14` | 0 | 0 | 10 | 0 | 0 | 10 |
| `engine` | 14 | 0 | 12 | 1 | 16 | 43 |
| `core` | 5 | 0 | 9 | 0 | 10 | 24 |
| `platform` | 0 | 23 | 0 | 0 | 0 | 23 |
| `audit` | 0 | 5 | 0 | 0 | 0 | 5 |
| **Total** | **19** | **28** | **31** | **1** | **26** | **105** |

*Note: Total exceeds 94 because some tables serve dual purposes*

---

## SECTION 4: EVIDENCE ARTIFACTS

**Files Generated:**
- `engineering/MAP_V2/00_Architecture/Verification/Phase_07/Table_Usage_Categorization_Report.md` - This document

**Database Evidence:**
- Connection: `postgresql://postgres:***@localhost:5432/migration_engine`
- `pg_stat_user_tables`: All tables have 0 rows (truncated)
- `information_schema.tables`: engine.migration_control_decisions, engine.migration_risk_scores, engine.tenants do NOT exist
- `engine_backup.sql`: Original data before truncation

**SQL Evidence:**
- `app/installer/install_governance_tables.sql`: Lines 11, 34, 49 define the three tables
- `docs/setups/installer/install_governance_tables.sql`: Duplicate copy

**Git Evidence:**
- `git status`: app/repositories/ is untracked
- `git log`: Zero commits for repository files

**Reference Evidence:**
- `engine.migration_batch_registry`: 93 references across Python, SQL, documentation
- All Runtime tables: Multiple references in Python, SQL, CLI, API, tests, documentation

---

**Document Generated:** 2026-07-24
**Status:** EVIDENCE ONLY - No changes authorised until review
