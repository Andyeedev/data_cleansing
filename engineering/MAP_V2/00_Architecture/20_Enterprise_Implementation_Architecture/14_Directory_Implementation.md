# Document 14: Repository Directory Structure

## Overview

Implementation-focused directory tree showing architecturally significant folders and files.

```
fs-migration-validation-engine/
├── app/
│   ├── api/
│   │   ├── core/
│   │   │   ├── app_config.py              # CONFIG loaded from config.yaml
│   │   │   ├── config.py                  # get_env() helper for env vars
│   │   │   ├── encryption_manager.py      # Fernet EncryptionManager
│   │   │   ├── auth/
│   │   │   │   ├── dependencies.py        # get_current_user(), get_current_user_with_tenant()
│   │   │   │   ├── jwt_config.py          # SECRET_KEY, ALGORITHM = "HS256"
│   │   │   │   ├── jwt_handler.py         # create_token(), decode_token()
│   │   │   │   └── rbac.py               # require_permissions(), require_role()
│   │   │   ├── middleware/
│   │   │   │   ├── audit_middleware.py    # AuditLoggingMiddleware
│   │   │   │   └── tenant_middleware.py   # tenant_id extraction from JWT
│   │   │   └── security/
│   │   │       └── encryption.py          # Fernet EncryptionManager (service-level)
│   │   ├── routes/
│   │   │   ├── auth_routes.py             # POST /api/v1/auth/login
│   │   │   ├── execution_routes.py        # POST /run, GET /status/{batch_id}
│   │   │   ├── credential_routes.py       # CRUD credentials
│   │   │   ├── system_routes.py           # CRUD systems
│   │   │   ├── user_routes.py             # User management
│   │   │   ├── role_routes.py             # Role management
│   │   │   ├── workflow_routes.py         # Workflow management
│   │   │   ├── task_routes.py             # Task management
│   │   │   ├── calendar_routes.py         # Calendar management
│   │   │   ├── notification_routes.py     # Notification management
│   │   │   ├── settings_routes.py         # Settings management
│   │   │   └── approval_routes.py         # Approval workflows
│   │   └── main.py                        # FastAPI app, CORS, middleware, health endpoints
│   ├── controls/
│   │   ├── base_control.py                # BaseControl ABC
│   │   └── rule_adapter_control.py        # RuleAdapterControl (default control impl)
│   ├── db/
│   │   ├── adapters/
│   │   │   ├── base_adapter.py            # BaseAdapter ABC with retry, execute()
│   │   │   ├── postgres_adapter.py
│   │   │   ├── mysql_adapter.py
│   │   │   ├── sqlserver_adapter.py
│   │   │   ├── snowflake_adapter.py
│   │   │   ├── bigquery_adapter.py
│   │   │   ├── oracle_adapter.py
│   │   │   └── odatapricks_adapter.py     # DatabricksAdapter
│   │   ├── connection.py                  # get_db_connection()
│   │   ├── connection_factory.py          # connection_factory(config) — 7 DB types
│   │   ├── connection_resolver.py         # ConnectionResolver — multi-system resolution
│   │   ├── connection_validator.py        # validate_connection(adapter)
│   │   ├── repositories/
│   │   │   ├── credential_repository.py   # CredentialRepository
│   │   │   └── system_repository.py       # SystemRepository
│   │   └── safe_sql.py                    # SafeSQL.execute()
│   ├── discovery/
│   │   └── auto_rule_discovery.py         # AutoRuleDiscovery — rule inference engine
│   ├── execution/
│   │   ├── control_executor.py            # ControlExecutor
│   │   ├── control_registry.py            # CONTROL_REGISTRY (empty dict)
│   │   ├── execution_context.py           # ExecutionContext dataclass
│   │   └── execution_result.py            # ExecutionResult dataclass
│   ├── governance/
│   │   ├── decision_engine.py             # record_decision()
│   │   └── risk_scoring.py                # calculate_migration_risk()
│   ├── orchestration/
│   │   ├── dag/
│   │   │   ├── dag_validator.py           # (empty)
│   │   │   └── dag_scheduler.py           # (empty)
│   │   ├── execution/
│   │   │   ├── control_executor.py        # (empty)
│   │   │   └── rule_isolation.py          # RuleIsolationExecutor
│   │   ├── observability/
│   │   │   └── execution_trace.py         # (empty)
│   │   └── retry/
│   │       └── rule_retry_manager.py      # RuleRetryManager (max_retries=1)
│   ├── rules/
│   │   ├── base_rule.py                   # BaseRule ABC with REGISTRY
│   │   ├── C01_row_count_rule.py
│   │   ├── C02_sum_compare_rule.py
│   │   ├── C03_referential_rule.py
│   │   ├── C04_column_count_rule.py
│   │   ├── C05_column_null_compare_rule.py
│   │   ├── C06_data_type_match_rule.py
│   │   ├── C07_duplicate_detection_rule.py
│   │   ├── C08_data_drift_detection_rule.py
│   │   ├── C09_referential_coverage_rule.py
│   │   └── C010_schema_drift_rule.py
│   ├── schemas/
│   │   └── credential_schema.py
│   ├── security/
│   │   └── crypto.py                      # CryptoManager — Fernet decrypt
│   ├── services/
│   │   ├── auth_service.py                # AuthService (login, bcrypt)
│   │   ├── credential_service.py          # CredentialService (encrypt/decrypt CRUD)
│   │   ├── execution_service.py           # ExecutionService (run, get_status)
│   │   ├── mapping_resolver.py            # MappingResolver
│   │   ├── mapping_validator.py           # MappingValidator
│   │   ├── dataset_discovery_service.py   # DatasetDiscoveryService
│   │   ├── metadata_intelligence_service.py
│   │   ├── audit_pack_service.py
│   │   ├── approval_service.py
│   │   ├── calendar_service.py
│   │   ├── notification_service.py
│   │   ├── role_service.py
│   │   ├── settings_service.py
│   │   ├── system_service.py
│   │   ├── task_service.py
│   │   ├── user_service.py
│   │   └── workflow_service.py
│   ├── utils/
│   │   ├── logger.py                      # get_logger(), AUDIT_LEVEL=25
│   │   ├── sanitizer.py                   # LogSanitizer
│   │   └── encryption_utils.py            # EncryptionUtils (static)
│   ├── config_loader.py                   # load_config() YAML + env var expansion
│   ├── db_connector.py                    # DBConnector (psycopg2)
│   ├── execution_engine.py                # ExecutionEngine — top-level orchestrator
│   ├── rule_executor.py                   # RuleExecutor
│   ├── rule_factory.py                    # RuleFactory with RULE_REGISTRY
│   ├── scoring_engine.py                  # ScoringEngine
│   └── main.py                            # CLI entry: run, discover, export
├── config.yaml                            # Runtime configuration
├── .env                                   # Secrets (gitignored)
├── Dockerfile                             # Multi-stage Python 3.11
├── docker/
│   └── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml                         # lint → test → build
├── sql/
│   ├── schema/
│   │   ├── 01_engine_schema.sql
│   │   └── 02_views.sql
│   ├── views/
│   │   ├── 1_migration_governance_report.sql
│   │   ├── 2_Executive_Dashboard_View.sql
│   │   ├── 3_Trend_Intelligence_View.sql
│   │   └── 4_Intelligent_Anomaly_Detection.sql
│   ├── controls/
│   └── demo/
├── tests/
│   ├── test_engine.py
│   └── test_controls.py
├── MAP_V2/
│   └── 03_Source/
│       └── frontend/
│           └── src/
│               ├── ai/                    # AI framework, insights, recommendations
│               ├── components/            # Widget system, layout, common
│               ├── dashboard/             # Dashboard framework, widgets, charts
│               ├── portal/                # Portal definitions, registry
│               ├── reporting/             # Viewer, scheduler, distribution, HTML
│               ├── authentication/        # AuthService, auth types
│               ├── navigation/            # Navigation config, types
│               ├── hooks/                 # useWorkflows, useTasks, useCalendar
│               ├── services/              # Frontend service layer
│               ├── api/                   # Axios client, endpoints, interceptors
│               └── theme/                 # Design tokens, component styles
└── exports/
    ├── execution.log                      # Runtime diagnostic log
    └── audit.log                          # Runtime audit log
```

---

## Omitted Sections

```
__pycache__/     — Python bytecode cache
.venv/           — Virtual environment
.vscode/         — IDE settings
.git/            — Git repository
.pytest_cache/   — pytest cache
old_dbs/         — Legacy database files
analysis/        — Analysis scripts
release/         — Release artifacts
reports/         — Generated reports
research/        — Research prototypes
scripts/         # Utility scripts (migration, demo generation)
pipelines_TO_BE_DELETED/ — Deprecated pipeline code
installer/       — Installer utilities
intelligence/    — Intelligence modules
mapping_engine/  — Mapping engine
prompt/          — Prompt templates
```
