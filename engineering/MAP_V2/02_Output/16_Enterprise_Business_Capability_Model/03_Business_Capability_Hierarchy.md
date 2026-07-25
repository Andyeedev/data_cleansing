# Business Capability Hierarchy

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  
**Scope:** MAP Nexus Enterprise Platform — Capability Hierarchy  

---

## 1. Purpose

This document defines the hierarchical structure of business capabilities for MAP Nexus, organized from enterprise platform level down to implementation components.

---

## 2. Hierarchy Levels

| Level | Description | Example |
|-------|-------------|---------|
| Level 0 | Enterprise Platform | MAP Nexus Enterprise Platform |
| Level 1 | Business Domains | Migration Management |
| Level 2 | Business Capabilities | Project Management |
| Level 3 | Business Services | ExecutionService |
| Level 4 | Implementation Components | app.execution_engine |

---

## 3. Complete Hierarchy

### 3.1 Level 0: Enterprise Platform

```text
MAP Nexus Enterprise Platform
```

### 3.2 Level 1: Business Domains

```text
MAP Nexus Enterprise Platform
├── Migration Management
├── Validation Management
├── Governance & Compliance
├── Reporting & Analytics
├── Platform Services
└── Administration
```

### 3.3 Level 2: Business Capabilities

```text
MAP Nexus Enterprise Platform
├── Migration Management
│   ├── Project Management
│   ├── Connection Management
│   ├── Dataset Discovery
│   ├── Dataset Mapping
│   └── Column Mapping
├── Validation Management
│   ├── Rule Discovery
│   ├── Control Discovery
│   ├── Validation Execution
│   ├── Checkpointing
│   └── Retry Engine
├── Governance & Compliance
│   ├── Governance Decisions
│   ├── Risk Scoring
│   ├── Release Gates
│   └── Approvals
├── Reporting & Analytics
│   ├── Executive Reporting
│   ├── Operational Reporting
│   ├── Governance Reporting
│   ├── Technical Reporting
│   ├── Dashboard Services
│   └── Export Services
├── Platform Services
│   ├── Workflow Management
│   ├── Task Management
│   ├── Notification Services
│   ├── Calendar Services
│   ├── AI / MAP Copilot
│   └── Authentication
└── Administration
    ├── User Management
    ├── Role & Permission Management
    ├── Tenant Management
    ├── System Settings
    ├── Feature Flags
    ├── Security Management
    ├── Audit Trail
    └── Maintenance & Health
```

### 3.4 Level 3: Business Services

```text
MAP Nexus Enterprise Platform
├── Migration Management
│   ├── Project Management
│   │   └── ExecutionService
│   ├── Connection Management
│   │   ├── SystemService
│   │   └── CredentialService
│   ├── Dataset Discovery
│   │   └── DatasetDiscoveryService
│   ├── Dataset Mapping
│   │   └── MappingResolver
│   └── Column Mapping
│       └── DatasetDiscoveryService
├── Validation Management
│   ├── Rule Discovery
│   │   └── AutoRuleDiscovery
│   ├── Control Discovery
│   │   └── ControlExecutor
│   ├── Validation Execution
│   │   ├── ExecutionEngine
│   │   └── ExecutionService
│   ├── Checkpointing
│   │   └── ExecutionEngine
│   └── Retry Engine
│       └── RuleRetryManager
├── Governance & Compliance
│   ├── Governance Decisions
│   │   └── DecisionEngine
│   ├── Risk Scoring
│   │   └── RiskScoring
│   ├── Release Gates
│   │   └── ExecutionEngine
│   └── Approvals
│       └── ApprovalService
├── Reporting & Analytics
│   ├── Executive Reporting
│   │   └── AuditExporter
│   ├── Operational Reporting
│   │   └── AuditExporter
│   ├── Governance Reporting
│   │   └── AuditExporter
│   ├── Technical Reporting
│   │   └── AuditExporter
│   ├── Dashboard Services
│   │   └── ScoringEngine
│   └── Export Services
│       └── AuditExporter
├── Platform Services
│   ├── Workflow Management
│   │   └── WorkflowService
│   ├── Task Management
│   │   └── TaskService
│   ├── Notification Services
│   │   └── NotificationService
│   ├── Calendar Services
│   │   └── CalendarService
│   ├── AI / MAP Copilot
│   │   └── AIService
│   └── Authentication
│       └── AuthService
└── Administration
    ├── User Management
    │   └── UserService
    ├── Role & Permission Management
    │   └── RoleService
    ├── Tenant Management
    │   └── —
    ├── System Settings
    │   └── SettingsService
    ├── Feature Flags
    │   └── SettingsService
    ├── Security Management
    │   └── —
    ├── Audit Trail
    │   └── AuditMiddleware
    └── Maintenance & Health
        └── —
```

### 3.5 Level 4: Implementation Components

```text
MAP Nexus Enterprise Platform
├── Migration Management
│   ├── Project Management
│   │   └── ExecutionService
│   │       └── app.services.execution_service
│   ├── Connection Management
│   │   ├── SystemService
│   │   │   └── app.services.system_service
│   │   └── CredentialService
│   │       └── app.services.credential_service
│   ├── Dataset Discovery
│   │   └── DatasetDiscoveryService
│   │       └── app.services.dataset_discovery_service
│   ├── Dataset Mapping
│   │   └── MappingResolver
│   │       └── app.services.mapping_resolver
│   └── Column Mapping
│       └── DatasetDiscoveryService
│           └── app.services.dataset_discovery_service
├── Validation Management
│   ├── Rule Discovery
│   │   └── AutoRuleDiscovery
│   │       └── app.discovery.auto_rule_discovery
│   ├── Control Discovery
│   │   └── ControlExecutor
│   │       └── app.execution.control_executor
│   ├── Validation Execution
│   │   ├── ExecutionEngine
│   │   │   └── app.execution_engine
│   │   └── ExecutionService
│   │       └── app.services.execution_service
│   ├── Checkpointing
│   │   └── ExecutionEngine
│   │       └── app.execution_engine
│   └── Retry Engine
│       └── RuleRetryManager
│           └── app.orchestration.retry.rule_retry_manager
├── Governance & Compliance
│   ├── Governance Decisions
│   │   └── DecisionEngine
│   │       └── app.governance.decision_engine
│   ├── Risk Scoring
│   │   └── RiskScoring
│   │       └── app.governance.risk_scoring
│   ├── Release Gates
│   │   └── ExecutionEngine
│   │       └── app.execution_engine
│   └── Approvals
│       └── ApprovalService
│           └── app.services.approval_service
├── Reporting & Analytics
│   ├── Executive Reporting
│   │   └── AuditExporter
│   │       └── app.audit_export
│   ├── Operational Reporting
│   │   └── AuditExporter
│   │       └── app.audit_export
│   ├── Governance Reporting
│   │   └── AuditExporter
│   │       └── app.audit_export
│   ├── Technical Reporting
│   │   └── AuditExporter
│   │       └── app.audit_export
│   ├── Dashboard Services
│   │   └── ScoringEngine
│   │       └── app.scoring_engine
│   └── Export Services
│       └── AuditExporter
│           └── app.audit_export
├── Platform Services
│   ├── Workflow Management
│   │   └── WorkflowService
│   │       └── app.services.workflow_service
│   ├── Task Management
│   │   └── TaskService
│   │       └── app.services.task_service
│   ├── Notification Services
│   │   └── NotificationService
│   │       └── app.services.notification_service
│   ├── Calendar Services
│   │   └── CalendarService
│   │       └── app.services.calendar_service
│   ├── AI / MAP Copilot
│   │   └── AIService
│   │       └── app.ai.framework
│   └── Authentication
│       └── AuthService
│           └── app.services.auth_service
└── Administration
    ├── User Management
    │   └── UserService
    │       └── app.services.user_service
    ├── Role & Permission Management
    │   └── RoleService
    │       └── app.services.role_service
    ├── Tenant Management
    │   └── —
    ├── System Settings
    │   └── SettingsService
    │       └── app.services.settings_service
    ├── Feature Flags
    │   └── SettingsService
    │       └── app.services.settings_service
    ├── Security Management
    │   └── —
    ├── Audit Trail
    │   └── AuditMiddleware
    │       └── app.api.core.middleware.audit_middleware
    └── Maintenance & Health
        └── —
```

---

## 4. Hierarchy Statistics

| Metric | Count |
|--------|-------|
| Level 0 (Platform) | 1 |
| Level 1 (Domains) | 6 |
| Level 2 (Capabilities) | 34 |
| Level 3 (Services) | 38 |
| Level 4 (Components) | 38 |

---

*This hierarchy is part of the Enterprise Business Capability Model (Prompt 16).*