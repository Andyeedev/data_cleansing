# Phase 1.3 — Platform Core Definition

**Version:** 2.0  
**Status:** Architecture Baseline  
**Audience:** Engineering, Architecture, Founders Hub Technical Reviewers

---

# Platform Core

## Executive Summary

The **Platform Core** is the central orchestration layer of the FS Migration Validation Engine. Rather than allowing each engine to communicate directly with every other engine, the Platform Core acts as the single coordination point responsible for workflow orchestration, state management, event routing, security enforcement, configuration management, and engine lifecycle management.

This architecture dramatically reduces coupling between components while improving scalability, maintainability, security, and extensibility.

---

# Why the Platform Core Exists

**Without a Platform Core:**
```
Discovery ↔ Validation ↔ Scoring ↔ Governance ↔ Export
```
Every engine develops dependencies on every other engine, creating duplicated logic, inconsistent state, difficult testing, tight coupling, and deployment challenges.

**With a Platform Core:**
```
             Users / CLI / API
                    │
            Platform Core
                    │
    ┌───────┬───────┼───────┬───────┐
    │       │       │       │       │
Discovery Validation Scoring Governance Export
```

Each engine communicates only with the Platform Core. No engine requires knowledge of another engine's internal implementation.

---

# Core Responsibilities

## 1. Workflow Orchestration

Coordinates execution between engines in the correct sequence:

```
Discovery → Platform Core → Validation → Platform Core → Scoring → Platform Core → Governance → Platform Core → Export
```

The engines remain independent. The Platform Core determines execution order.

## 2. Control Dependency Management

Manages the Directed Acyclic Graph (DAG) of control dependencies:

```
C01
 │
 └──→ C02
      │
      └──→ C03 → C09
                │
                └──→ C04 → C05 → C06 → C07 → C08 → C010
```

Dependencies are defined in `config.yaml`:
```yaml
control_dependencies:
  C02: [C01]
  C09: [C03]
```

## 3. Engine Registry

Maintains metadata for every registered engine:

| Engine | Status | Version | Capabilities |
|--------|--------|---------|-------------|
| Discovery | Healthy | 1.0 | Schema discovery, metadata extraction |
| Validation | Healthy | 1.0 | 10 structured controls (C01-C010) |
| Scoring | Healthy | 1.0 | Pass/fail, aggregate scoring |
| Governance | Healthy | 1.0 | Release gates, audit, export |

## 4. State Management

The Platform Core owns workflow state:

```
Pipeline Status: Running
├── Discovery: Complete (passed 100%)
├── Validation: Running (5/10 controls complete)
├── Scoring: Pending
└── Governance: Pending
```

This provides restart capability, checkpointing, resilience, and recovery.

## 5. Configuration Service

Central configuration management via `config.yaml`:

```yaml
execution:
  environment: DEV
  client_name: DemoBank
  control_id: null        # null = run all controls

release_gate:
  enabled: true
  block_on_status: ["FAIL", "BLOCKED", "ERROR"]
  minimum_score: 80
  enforcement_mode: "STRICT"

rules:
  C01: enabled
  C02: enabled
  # ... through to C010
```

Every engine reads configuration from one location — the Platform Core.

## 6. Security Enforcement

The Platform Core validates every request:

- Authentication (API keys, environment-based)
- Authorisation (role-based execution permissions)
- Audit logging (every action logged with batch ID and timestamp)
- Secrets isolation (credentials via environment variables, not code)
- Configuration validation (pre-execution checks)

## 7. Error Handling & Failure Isolation

- **Control-level isolation** — A failure in C01 does not block C03
- **Graceful degradation** — Non-critical failures logged, execution continues
- **Retry logic** — Configurable timeout per control (default: 300 seconds)
- **Exception register** — All failures recorded for audit
- **Recovery mode** — Re-run only failed controls from previous batch

## 8. Observability

Provides a single operational view:

| Metric | Source |
|--------|--------|
| Engine execution time | Platform Core timing |
| Control pass/fail rates | Scoring engine results |
| Batch duration | Workflow start/end timestamps |
| Exception counts | Exception register |
| API latency | FastAPI middleware |

---

# Interaction Model

```
User / CLI
    │
    ▼
API Gateway (FastAPI)
    │
    ▼
Authentication
    │
    ▼
Platform Core
    │
    ├──→ Workflow Manager
    │        │
    │        ├──→ Discovery Engine
    │        │        │
    │        │        └──→ Platform Core (event)
    │        │
    │        ├──→ Validation Engine
    │        │        │
    │        │        ├──→ Control C01
    │        │        ├──→ Control C02
    │        │        ├──→ ...
    │        │        └──→ Control C010
    │        │                 │
    │        │                 └──→ Platform Core (event)
    │        │
    │        ├──→ Scoring Engine
    │        │        │
    │        │        └──→ Platform Core (event)
    │        │
    │        ├──→ Governance Engine
    │        │        │
    │        │        ├──→ Release Gate Check
    │        │        │
    │        │        └──→ Platform Core (event)
    │        │
    │        └──→ Export Engine
    │                 │
    │                 └──→ Audit CSV
    │
    ▼
Response (pass/fail, score, exceptions, audit)
```

No engine communicates directly with another. All coordination passes through the Platform Core.

---

# Current Implementation

The Platform Core is implemented in `app/execution_engine.py`:

```python
class ExecutionEngine:
    def __init__(self, config, batch_id=None):
        self.config = config
        self.batch_id = batch_id or str(uuid.uuid4())
        self.recovery_mode = False

    def run(self):
        # 1. Initialise batch in database
        # 2. Resolve control execution order (DAG)
        # 3. Execute each control in dependency order
        # 4. Score results
        # 5. Apply release gates
        # 6. Export audit trail
```

Key files:
- `app/execution_engine.py` — Core orchestrator
- `app/rule_executor.py` — Individual control execution
- `app/rule_factory.py` — Control instantiation from config
- `app/scoring_engine.py` — Scoring logic
- `app/audit_export.py` — CSV audit export
- `config.yaml` — Centralised configuration
- `app/db_connector.py` — Database connectivity

---

# Azure Alignment

The Platform Core maps naturally to Azure services:

| Platform Core Function | Azure Service |
|------------------------|---------------|
| Compute / Hosting | Azure Container Apps |
| API Gateway | Azure API Management |
| Identity | Microsoft Entra ID |
| Secrets | Azure Key Vault |
| Monitoring | Azure Monitor / Application Insights |
| Database | Azure SQL Database / PostgreSQL Flexible Server |
| Storage | Azure Blob Storage |
| CI/CD | GitHub Actions / Azure DevOps |
| Infrastructure | Bicep / ARM Templates |

---

# Architectural Principles

1. **Loose coupling** — Engines communicate only through the Platform Core
2. **High cohesion** — Each engine has a single, well-defined responsibility
3. **Deterministic execution** — Same inputs produce same outputs
4. **Stateless engines** — State managed by Platform Core
5. **Centralised governance** — Release gates, audit, and compliance enforced centrally
6. **Cloud-native** — Designed for Azure, deployable anywhere
7. **Extensibility** — New engines can be added without modifying existing ones
8. **Security-by-design** — Authentication, authorisation, and audit built into the core
9. **Failure isolation** — One control failure does not cascade
10. **Observability-by-default** — Every execution produces audit evidence

---

# Benefits

## Technical
- Reduced coupling between components
- Easier maintenance and testing
- Independent engine evolution
- Simplified debugging (single coordination point)
- Improved resilience and recovery

## Operational
- Centralised monitoring and alerting
- Consistent configuration management
- Unified security enforcement
- Simplified deployment model
- Faster troubleshooting

## Business
- Faster feature delivery (add engines without redesign)
- Lower maintenance costs
- Easier partner integration
- Enterprise-grade governance built-in
- Clear Azure alignment for cloud migration