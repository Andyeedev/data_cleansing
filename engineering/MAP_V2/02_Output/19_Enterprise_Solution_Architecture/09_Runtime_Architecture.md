# 09_Runtime_Architecture.md

# Runtime Architecture

### MAP Nexus Enterprise Solution Architecture

---

## Purpose

This document describes the runtime execution flows including process startup, request lifecycle, validation execution, governance execution, workflow execution, and reporting flow.

---

## Process Startup (Uvicorn)

### Startup Sequence

```mermaid
sequenceDiagram
    participant CLI as CLI/Shell
    participant UV as Uvicorn
    participant APP as FastAPI App
    participant MW as Middleware
    participant DB as PostgreSQL

    CLI->>UV: uvicorn app.api.main:app --reload
    UV->>APP: Import app.api.main
    APP->>APP: load_dotenv()
    APP->>APP: Create FastAPI instance
    APP->>MW: Register CORS Middleware
    APP->>MW: Register Audit Middleware
    APP->>MW: Register Timing Middleware
    APP->>APP: Register 12 Routers
    APP->>APP: Register Error Handlers
    APP->>APP: Register Health Endpoints
    APP-->>UV: App ready
    UV-->>CLI: Server started on port 8000
```

### Startup Evidence
| Step | File | Line |
|------|------|------|
| Load env | `app/main.py:3` | `load_dotenv()` |
| Import app | `app/main.py:6` | `from .api.main import app` |
| Create FastAPI | `app/api/main.py:33` | `app = FastAPI(...)` |
| CORS middleware | `app/api/main.py:41` | `app.add_middleware(CORSMiddleware)` |
| Audit middleware | `app/api/main.py:54` | `app.add_middleware(AuditLoggingMiddleware)` |
| Timing middleware | `app/api/main.py:60` | `@app.middleware("http")` |
| Route registration | `app/api/main.py:146-158` | `app.include_router(...)` |

---

## Request Lifecycle

```mermaid
sequenceDiagram
    participant Client as React Frontend
    participant CORS as CORS Middleware
    participant Audit as Audit Middleware
    participant Timing as Timing Middleware
    participant Router as FastAPI Router
    participant Auth as JWT Auth
    participant RBAC as RBAC Check
    participant Service as Service Layer
    participant DB as PostgreSQL

    Client->>CORS: HTTP Request
    CORS->>Audit: CORS validated
    Audit->>Timing: Extract user from JWT
    Timing->>Router: Add timing header
    Router->>Auth: Validate JWT token
    Auth->>RBAC: Check permissions
    RBAC->>Service: Authorized request
    Service->>DB: Query database
    DB-->>Service: Result set
    Service-->>Router: Response data
    Router-->>Client: JSON response
```

### Request Processing Evidence
| Step | File | Description |
|------|------|-------------|
| CORS | `app/api/main.py:41` | Allow origins |
| Audit | `app/api/core/middleware/audit_middleware.py:10` | Log request |
| Timing | `app/api/main.py:61` | Add X-Response-Time |
| JWT decode | `app/api/core/auth/jwt_handler.py:13` | Decode token |
| RBAC check | `app/api/core/auth/rbac.py:7` | Check permissions |

---

## 6-Step Validation Execution

```mermaid
sequenceDiagram
    participant API as Execution API
    participant EE as ExecutionEngine
    participant CR as ConnectionResolver
    participant MR as MappingResolver
    participant ARD as AutoRuleDiscovery
    participant CE as ControlExecutor
    participant RE as RuleExecutor
    participant GE as Governance Engine
    participant DB as PostgreSQL

    API->>EE: Create ExecutionEngine(config)
    API->>EE: engine.run()

    Note over EE,DB: STEP 1: CONNECTION RESOLUTION
    EE->>CR: get_connections(project_id)
    CR->>DB: SELECT from core.system_registry
    DB-->>CR: System records
    CR->>CR: Decrypt credentials
    CR->>CR: Build adapters via connection_factory()
    CR-->>EE: {SOURCE: {id: adapter}, TARGET: {id: adapter}}

    Note over EE,DB: STEP 2: DATASET MAPPING
    EE->>MR: resolve(source_ids, target_ids)
    MR->>DB: SELECT from core.dataset_mappings
    DB-->>MR: Mapping records
    MR-->>EE: valid_pairs, skipped_pairs

    Note over EE,DB: STEP 3: RULE DISCOVERY
    EE->>ARD: generate_rules()
    ARD->>DB: SELECT from core.dataset_columns
    DB-->>ARD: Column metadata
    ARD->>DB: INSERT into engine.rule_registry
    ARD-->>EE: Rules generated

    Note over EE,DB: STEP 4: CONTROL DISCOVERY
    EE->>DB: SELECT from engine.control_registry
    DB-->>EE: Control list
    EE->>EE: Validate DAG dependencies
    EE->>EE: Detect cycles
    EE->>EE: Build dependency graph

    Note over EE,DB: STEP 5: CONTROL EXECUTION
    loop For each ready control
        EE->>CE: execute(control_id)
        CE->>CE: Lookup CONTROL_REGISTRY
        alt Specialized control
            CE->>CE: Execute custom class
        else Standard control
            CE->>CE: RuleAdapterControl
            CE->>RE: execute_rules()
            RE->>DB: SELECT from engine.rule_registry
            RE->>DB: SELECT from core.dataset_mappings
            loop For each rule entity
                RE->>RE: RuleFactory.create(rule_id)
                RE->>RE: rule.execute()
                RE->>DB: INSERT into engine.migration_control_execution
            end
        end
        CE-->>EE: ExecutionResult
        EE->>DB: Save checkpoint
    end

    Note over EE,DB: STEP 6: GOVERNANCE DECISION
    EE->>GE: _evaluate_governance()
    GE->>DB: SELECT from engine.migration_control_execution
    GE->>GE: Calculate blocking/failed rules
    GE->>DB: INSERT into engine.migration_governance_status
    EE->>EE: _finalise_batch()
    EE->>DB: UPDATE engine.migration_batch_registry
    EE->>DB: INSERT into engine.migration_release_decision
    EE-->>API: Execution complete
```

### Pipeline Evidence
| Step | File | Line |
|------|------|------|
| Connection Resolution | `app/execution_engine.py:81` | `[STEP 01/06]` |
| Dataset Mapping | `app/execution_engine.py:115` | `[STEP 02/06]` |
| Rule Discovery | `app/execution_engine.py:190` | `[STEP 03/06]` |
| Control Discovery | `app/execution_engine.py:210` | `[STEP 04/06]` |
| Control Execution | `app/execution_engine.py:354` | `[STEP 05/06]` |
| Governance Decision | `app/execution_engine.py:459` | `[STEP 06/06]` |

---

## Governance Execution

```mermaid
sequenceDiagram
    participant EE as ExecutionEngine
    participant SE as ScoringEngine
    participant GE as Governance Engine
    participant DB as PostgreSQL

    EE->>SE: calculate_overall()
    SE->>DB: SELECT execution_status, severity_level
    DB-->>SE: Rule results
    SE->>SE: Calculate risk-weighted score
    SE-->>EE: overall_score

    EE->>GE: _evaluate_governance()
    GE->>DB: SELECT COUNT(*) with FILTER
    DB-->>GE: blocking_rules, failed_rules
    GE->>GE: Determine migration_status
    GE->>DB: INSERT into engine.migration_governance_status
    GE-->>EE: governance_decision

    EE->>EE: _enforce_release_gate()
    EE->>DB: INSERT into engine.migration_release_decision
    alt Gate REJECTED + STRICT mode
        EE->>EE: raise SystemExit
    end
```

### Governance Evidence
| Component | File | Line |
|-----------|------|------|
| Scoring | `app/scoring_engine.py:52` | `calculate_overall()` |
| Governance eval | `app/execution_engine.py:841` | `_evaluate_governance()` |
| Release gate | `app/execution_engine.py:736` | `_enforce_release_gate()` |
| Decision engine | `app/governance/decision_engine.py:3` | `record_decision()` |
| Risk scoring | `app/governance/risk_scoring.py:1` | `calculate_migration_risk()` |

---

## Workflow Execution

```mermaid
sequenceDiagram
    participant Client as React Frontend
    participant API as Workflow Routes
    participant WS as WorkflowService
    participant DB as PostgreSQL

    Client->>API: POST /api/v1/workflows/{id}/execute
    API->>WS: execute_workflow(workflow_id)
    WS->>DB: SELECT from platform.workflow_definitions
    DB-->>WS: Workflow definition
    WS->>DB: INSERT into platform.workflow_instances
    WS->>DB: UPDATE workflow status
    WS-->>API: Workflow instance created
    API-->>Client: Instance ID returned
```

### Workflow Evidence
| Component | File | Line |
|-----------|------|------|
| Workflow routes | `app/api/routes/workflow_routes.py:86` | `execute` endpoint |
| Workflow service | `app/services/workflow_service.py:10` | `WorkflowService` |

---

## Reporting Flow

```mermaid
sequenceDiagram
    participant Client as React Frontend
    participant API as Execution API
    participant EE as ExecutionEngine
    participant AE as AuditExporter
    participant APS as AuditPackService
    participant DB as PostgreSQL

    Client->>API: POST /api/v1/execution/run
    API->>EE: engine.run()
    EE->>EE: Execute 6-step pipeline
    EE-->>API: Execution complete

    Client->>API: POST /api/v1/execution/export
    API->>AE: export_governance(batch_id)
    AE->>DB: SELECT governance decisions
    AE->>AE: Write to CSV

    API->>AE: export_summary(batch_id)
    AE->>DB: SELECT batch summary
    AE->>AE: Write to CSV

    API->>AE: export_control_details(batch_id)
    AE->>DB: SELECT control execution
    AE->>AE: Write to CSV

    API->>AE: export_exceptions(batch_id)
    AE->>DB: SELECT exceptions
    AE->>AE: Write to CSV

    AE-->>Client: Audit pack CSV files
```

### Reporting Evidence
| Component | File | Line |
|-----------|------|------|
| Audit export | `app/audit_export.py` | `AuditExporter` |
| Audit pack service | `app/services/audit_pack_service.py:4` | `generate()` |
| CLI export | `app/main.py:25` | `export_audit()` |

---

## DAG Execution Model

```mermaid
graph TD
    A[Control C01] --> D[Control C04]
    B[Control C02] --> D
    C[Control C03] --> E[Control C05]
    D --> E
    E --> F[Control C06]
    F --> G[Governance Decision]

    style A fill:#4CAF50
    style B fill:#4CAF50
    style C fill:#4CAF50
    style D fill:#2196F3
    style E fill:#2196F3
    style F fill:#FF9800
    style G fill:#F44336
```

### DAG Evidence
| Component | File | Line |
|-----------|------|------|
| Dependency validation | `app/execution_engine.py:992` | `_validate_dependencies()` |
| Cycle detection | `app/execution_engine.py:1009` | `_detect_cycles()` |
| Ready queue | `app/execution_engine.py:343` | `ready_queue` |
| Parallel execution | `app/execution_engine.py:368` | `ThreadPoolExecutor` |

---

## Retry Mechanism

```mermaid
sequenceDiagram
    participant RE as RuleExecutor
    participant Rule as Rule Instance
    participant DB as PostgreSQL

    loop MAX_RETRIES (2)
        RE->>Rule: execute()
        alt Success
            Rule-->>RE: Result
            RE->>DB: Log execution
        else Failure
            Rule-->>RE: Exception
            RE->>RE: Wait 1 second
        end
    end
```

### Retry Evidence
| Component | File | Line |
|-----------|------|------|
| Rule retry | `app/rule_executor.py:461` | `execute_with_retry()` |
| Control retry | `app/execution_engine.py:1046` | `_execute_control_with_retry()` |
| Max retries | `app/rule_executor.py:8` | `MAX_RETRIES = 2` |

---

## Summary

| Flow | Entry Point | Key Files |
|------|-------------|-----------|
| Process startup | `uvicorn app.api.main:app` | `app/api/main.py:33` |
| Request lifecycle | HTTP request | `app/api/main.py:41-66` |
| Validation execution | `POST /api/v1/execution/run` | `app/execution_engine.py:68` |
| Governance execution | `app/execution_engine.py:841` | `app/governance/` |
| Workflow execution | `POST /api/v1/workflows/{id}/execute` | `app/services/workflow_service.py` |
| Reporting flow | `POST /api/v1/execution/export` | `app/audit_export.py` |

---

*Document Version: 1.0 | Evidence-Based: Yes | File References: 25+*
