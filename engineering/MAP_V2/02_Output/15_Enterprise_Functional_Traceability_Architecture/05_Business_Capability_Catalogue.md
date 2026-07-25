# Business Capability Catalogue

**Date:** 14 July 2026  
**Audit:** Enterprise Functional Traceability Audit (Prompt 15)  
**Scope:** Python Migration Validation Engine — 14 Business Capabilities  

---

## 1. Summary

| Metric | Value |
|--------|-------|
| Total Capabilities | 14 |
| With Full CRUD API | 2 (14%) |
| With Trigger API | 1 (7%) |
| With No API | 11 (79%) |
| With Frontend | 5 (36%) |
| Without Frontend | 9 (64%) |

---

## 2. Capability Catalogue

### 2.1 Project Management

| Attribute | Value |
|-----------|-------|
| **Description** | Groups a migration effort — source/target systems, mappings, controls |
| **Python Module** | `app.execution_engine` (line 34: `self.project_id = config.get("project_id")`) |
| **Service File** | `app/services/execution_service.py` |
| **Entry Point** | `ExecutionEngine.__init__()` / `ExecutionService.run()` |
| **Database Schema** | core, engine |
| **Tables** | engine.migration_validation_batch, engine.migration_batch_registry, core.dataset_mappings |
| **API Status** | Partial — project injected via config YAML, execution via POST /api/v1/execution/run |
| **Frontend** | Migration > Projects (partial) |
| **Notes** | Projects are a config-level concept, not a first-class CRUD entity |

---

### 2.2 Connection Management

| Attribute | Value |
|-----------|-------|
| **Description** | Manages source/target database connections and credentials |
| **Python Module** | `app.db.connection_resolver`, `app.db.connection_factory`, `app.db.adapters.*` |
| **Service File** | `app/services/system_service.py`, `app/services/credential_service.py` |
| **Repository** | `app/db/repositories/system_repository.py`, `app/db/repositories/credential_repository.py` |
| **Entry Points** | `ConnectionResolver.get_connections(project_id)`, `SystemService.create_system()` |
| **Database Schema** | core |
| **Tables** | core.system_registry, core.system_credentials |
| **Driver Adapters** | postgres_adapter, sqlserver_adapter, snowflake_adapter, bigquery_adapter, oracle_adapter, mysql_adapter, databricks_adapter |
| **API Status** | **YES (Full CRUD)** |
| **API Endpoints** | GET/POST /api/v1/systems/, GET /api/v1/systems/{id}, GET /api/v1/systems/{id}/test, GET/POST/PUT/DELETE /api/v1/credentials/ |
| **Frontend** | Migration > Datasets, Security > Credentials |
| **Encryption** | Fernet symmetric via EncryptionManager |

---

### 2.3 Dataset Discovery

| Attribute | Value |
|-----------|-------|
| **Description** | Automatically discovers tables, columns, data types from source/target databases |
| **Python Module** | `app.discovery.auto_rule_discovery`, `app.services.dataset_discovery_service` |
| **Service File** | `app/services/dataset_discovery_service.py` |
| **Entry Points** | `DatasetDiscoveryService.discover()` (CLI: `python -m app.main discover`) |
| **Database Schema** | core, engine |
| **Tables** | core.dataset_mappings, core.dataset_columns, core.rule_dataset_mapping, engine.rule_registry |
| **Discovery Source** | information_schema.tables, information_schema.columns on source/target DBs |
| **API Status** | No dedicated endpoint (CLI only) |
| **Frontend** | None |
| **Notes** | Discovery is triggered via CLI or automatically as Step 03/06 of execution pipeline |

---

### 2.4 Dataset Mappings

| Attribute | Value |
|-----------|-------|
| **Description** | Defines source-to-target table mappings for validation |
| **Python Module** | `app.services.mapping_resolver`, `app.services.mapping_validator` |
| **Service Files** | `app/services/mapping_resolver.py`, `app/services/mapping_validator.py` |
| **Entry Points** | `MappingResolver.resolve(source_ids, target_ids)` |
| **Database Schema** | core |
| **Tables** | core.dataset_mappings, core.rule_dataset_mapping |
| **Unique Constraint** | (project_id, source_schema, source_table, target_schema, target_table) |
| **API Status** | No dedicated CRUD API (auto-created during discovery) |
| **Frontend** | Migration > Mappings (partial) |
| **Notes** | Mappings are created by DatasetDiscoveryService._create_mapping() or manually via SQL |

---

### 2.5 Column Mappings

| Attribute | Value |
|-----------|-------|
| **Description** | Maps individual source columns to target columns within a table mapping |
| **Python Module** | `app.services.dataset_discovery_service._fetch_columns()` |
| **Service File** | `app/services/dataset_discovery_service.py` |
| **Entry Points** | `DatasetDiscoveryService._fetch_columns()` — discovers columns from information_schema |
| **Database Schema** | core |
| **Tables** | core.dataset_mappings (source_columns, target_columns as arrays), core.dataset_columns |
| **Column Roles** | PRIMARY_KEY, NUMERIC_METRIC, FOREIGN_KEY, TABLE |
| **API Status** | No dedicated API |
| **Frontend** | None |
| **Notes** | Column mappings are auto-created during dataset discovery |

---

### 2.6 Rule Discovery

| Attribute | Value |
|-----------|-------|
| **Description** | Automatically infers validation rules based on column roles |
| **Python Module** | `app.discovery.auto_rule_discovery` |
| **Service File** | `app/discovery/auto_rule_discovery.py` |
| **Entry Point** | `AutoRuleDiscovery.generate_rules()` |
| **Rule Classes** | C01_RowCountRule, C02_SumCompareRule, C03_ReferentialIntegrityRule, C04_ColumnCountRule, C05_ColumnNullCompareRule, C06_DataTypeMatchRule, C07_DuplicateDetectionRule, C08_DataDriftDetectionRule, C09_ReferentialCoverageRule, C010_SchemaDriftRule |
| **Factory** | `app/rule_factory.py` — `RuleFactory.create(rule_id, source_db, target_db, parameters)` |
| **Database Schema** | engine, core |
| **Tables** | engine.rule_registry, core.dataset_columns, core.rule_dataset_mapping |
| **Inference Logic** | PRIMARY_KEY → C01, C03, C07; NUMERIC_METRIC → C02, C08; FOREIGN_KEY → C09; date types → C05; Always: C04, C06, C010 |
| **API Status** | No dedicated API (auto-discovered during execution) |
| **Frontend** | Validation > Rules (partial) |

---

### 2.7 Control Discovery

| Attribute | Value |
|-----------|-------|
| **Description** | Fetches enabled controls from DB and dispatches to control classes |
| **Python Module** | `app.execution_engine.ExecutionEngine._get_controls()`, `app.execution.control_executor` |
| **Control Framework** | `app/controls/base_control.py` (ABC), `app/controls/rule_adapter_control.py` |
| **Executor** | `app/execution/control_executor.py` — `ControlExecutor.execute(control_id)` |
| **Database Schema** | engine |
| **Tables** | engine.control_registry |
| **Pre-seeded Controls** | C01 (Record Completeness/HIGH), C02 (Financial Value Integrity/CRITICAL), C03 (Referential Integrity/HIGH), C04-C010 via rule_registry |
| **API Status** | No dedicated API |
| **Frontend** | None |
| **Notes** | Controls are discovered from DB during execution; config.yaml can enable/disable |

---

### 2.8 Validation Execution

| Attribute | Value |
|-----------|-------|
| **Description** | Orchestrates the full 6-step validation pipeline |
| **Python Module** | `app.execution_engine.ExecutionEngine` (orchestrator), `app.rule_executor.RuleExecutor` |
| **Service File** | `app/services/execution_service.py` |
| **Entry Points** | `ExecutionEngine.run()` — 6-step pipeline; `ExecutionService.run(project_id, batch_id)` — API-triggered |
| **CLI Entry** | `python -m app.main run --config config.yaml [--resume-batch UUID] [--recovery]` |
| **Pipeline** | Connection Resolution → Dataset Mapping → Rule Discovery → Control Discovery → Control Execution → Governance Decision |
| **Parallelism** | ThreadPoolExecutor (MAX_WORKERS=4), DAG-based scheduling |
| **Database Schema** | engine |
| **Tables** | engine.migration_validation_batch, engine.migration_batch_registry, engine.migration_control_summary, engine.migration_control_execution, engine.migration_control_exceptions, engine.migration_batch_summary |
| **API Status** | **YES (Trigger + Status)** |
| **API Endpoints** | POST /api/v1/execution/run?project_id=..., GET /api/v1/execution/status/{batch_id} |
| **Frontend** | Migration > Execution, Validation > Results |

---

### 2.9 Governance Decisions

| Attribute | Value |
|-----------|-------|
| **Description** | Computes governance decisions post-execution, risk scoring, release gates |
| **Python Module** | `app.governance.decision_engine`, `app.governance.risk_scoring` |
| **Service Files** | `app/governance/decision_engine.py`, `app/governance/risk_scoring.py` |
| **Entry Points** | `record_decision()`, `calculate_migration_risk()`, `ExecutionEngine._evaluate_governance()` |
| **Release Gate** | Configurable via config.yaml: enabled, block_on_status, minimum_score, enforcement_mode (STRICT/LENIENT) |
| **Database Schema** | engine |
| **Tables** | engine.migration_governance_status, engine.migration_control_decisions, engine.migration_risk_scores, engine.migration_release_decision, engine.governance_config |
| **API Status** | No dedicated API (computed automatically post-execution) |
| **Frontend** | Governance (all mock data) |
| **Notes** | Also uses PostgreSQL function engine.run_governance_intelligence() for anomaly detection |

---

### 2.10 Reporting

| Attribute | Value |
|-----------|-------|
| **Description** | SQL views and CLI export for BI tools and compliance reports |
| **Python Module** | `app.audit_export.AuditExporter`, `app.scoring_engine.ScoringEngine` |
| **Service Files** | `app/audit_export.py`, `app/scoring_engine.py` |
| **Entry Points** | `AuditExporter.export_governance(batch_id)`, `ScoringEngine.calculate_overall()` |
| **CLI Entry** | `python -m app.main export --config config.yaml --batch-id UUID` |
| **Scoring** | Risk-weighted: CRITICAL=5, HIGH=3, MEDIUM=2, LOW=1 |
| **Database Schema** | engine |
| **SQL Views** | engine.v_migration_control_summary, engine.v_migration_executive_summary, engine.v_migration_exception_detail, engine.v_migration_governance_report, engine.v_migration_summary, engine.v_top_failures, engine.v_control_results, engine.v_migration_risk, engine.v_exception_summary, engine.v_governance_decisions |
| **API Status** | No dedicated API (SQL views for BI tools) |
| **Frontend** | Reports (all mock data) |

---

### 2.11 Audit Trail

| Attribute | Value |
|-----------|-------|
| **Description** | Middleware-based API call logging and compliance event tracking |
| **Python Module** | `app.api.core.middleware.audit_middleware`, `app.utils.logger` |
| **Middleware** | `AuditLoggingMiddleware.dispatch()` — logs every HTTP request |
| **Audit Events** | BATCH_STARTED, MAPPING_RESOLVED, CONNECTION_RESOLVED, CONTROL_EXECUTED, GOVERNANCE_DECISION |
| **Output Files** | exports/audit.log (compliance), exports/execution.log (diagnostic) |
| **Database Schema** | N/A (file-based) |
| **API Status** | No dedicated API (automatic middleware) |
| **Frontend** | Governance > Audit Centre (mock) |

---

### 2.12 Scheduling

| Attribute | Value |
|-----------|-------|
| **Description** | Config-driven DAG scheduling embedded in ExecutionEngine |
| **Python Module** | `app.execution_engine.ExecutionEngine` (inline DAG), `app.orchestration.dag.*` (empty placeholders) |
| **Entry Points** | `ExecutionEngine._validate_dependencies()`, `_detect_cycles()` |
| **Database Schema** | N/A (in-memory) |
| **Tables** | None |
| **API Status** | No API (config-driven) |
| **Frontend** | Operations > Schedules (mock) |
| **Notes** | DAG scheduling is embedded in ExecutionEngine, not a separate scheduler. No cron-like scheduler. |

---

### 2.13 Retry Engine

| Attribute | Value |
|-----------|-------|
| **Description** | Automatic retry of failed rules at multiple levels |
| **Python Module** | `app.orchestration.retry.rule_retry_manager`, `app.rule_executor.RuleExecutor.execute_with_retry()` |
| **Service File** | `app/orchestration/retry/rule_retry_manager.py` |
| **Retry Levels** | 1: Rule-level transient (2 attempts, 1s delay), 2: Rule-level selective (RuleRetryManager), 3: Control-level (configurable) |
| **Database Schema** | N/A (in-memory) |
| **Tables** | None |
| **API Status** | No API (automatic) |
| **Frontend** | Operations > Retry Centre (mock) |

---

### 2.14 Checkpointing

| Attribute | Value |
|-----------|-------|
| **Description** | Saves execution state for resume after failure |
| **Python Module** | `app.execution_engine.ExecutionEngine._save_checkpoint()` / `_load_checkpoint()` |
| **Entry Points** | `_save_checkpoint(control_id)` — saves after each successful control; `_load_checkpoint()` — resumes from last |
| **Recovery Mode** | CLI flag `--recovery` triggers `_get_failed_controls()` |
| **Idempotency** | Batch registration checks: RUNNING=reject, COMPLETED=skip |
| **Database Schema** | engine |
| **Tables** | engine.batch_execution_checkpoint, engine.migration_batch_registry |
| **API Status** | No API (automatic) |
| **Frontend** | None |

---

## 3. Summary Matrix

| # | Capability | Schema | Tables | API | Frontend | Priority |
|---|-----------|--------|--------|-----|----------|----------|
| 1 | Project Management | core, engine | 3 | Partial | Partial | HIGH |
| 2 | Connection Management | core | 2 | YES | YES | DONE |
| 3 | Dataset Discovery | core, engine | 4 | No | No | HIGH |
| 4 | Dataset Mappings | core | 2 | No | Partial | HIGH |
| 5 | Column Mappings | core | 2 | No | No | MEDIUM |
| 6 | Rule Discovery | engine, core | 3 | No | Partial | MEDIUM |
| 7 | Control Discovery | engine | 1 | No | No | MEDIUM |
| 8 | Validation Execution | engine | 6 | YES | Partial | DONE |
| 9 | Governance Decisions | engine | 5 | No | Mock | HIGH |
| 10 | Reporting | engine | views | No | Mock | HIGH |
| 11 | Audit Trail | N/A | file | No | Mock | MEDIUM |
| 12 | Scheduling | N/A | none | No | Mock | LOW |
| 13 | Retry Engine | N/A | none | No | Mock | LOW |
| 14 | Checkpointing | engine | 2 | No | No | LOW |

---

*This catalogue is part of the Enterprise Functional Traceability Audit (Prompt 15). All findings are based on source code analysis — no code was modified.*
