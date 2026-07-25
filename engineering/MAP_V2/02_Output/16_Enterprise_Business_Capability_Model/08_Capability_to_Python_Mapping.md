# Capability to Python Mapping

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  
**Scope:** MAP Nexus Enterprise Platform — Python Module Mapping  

---

## 1. Purpose

This document maps each business capability to its corresponding Python modules, services, and components.

---

## 2. Python Module Overview

| Module Category | Count | Purpose |
|----------------|-------|---------|
| Services | 12 | Business logic services |
| Engine | 1 | Core execution engine |
| Discovery | 1 | Rule discovery |
| Execution | 1 | Control execution |
| Governance | 2 | Governance decisions, risk scoring |
| Orchestration | 1 | Retry management |
| AI | 1 | AI framework |
| Database | 4 | Connection, adapters, repositories |
| API | 3 | Routes, middleware, helpers |
| Utilities | 2 | Logging, encryption |
| **Total** | **29** | |

---

## 3. Capability to Python Module Mapping

### 3.1 Migration Management Domain

| Capability | Python Module | Service File | Entry Point |
|-----------|--------------|--------------|-------------|
| Project Management | app.execution_engine | app/services/execution_service.py | ExecutionEngine.__init__() |
| Connection Management | app.db.connection_resolver | app/services/system_service.py, app/services/credential_service.py | ConnectionResolver.get_connections() |
| Dataset Discovery | app.discovery.auto_rule_discovery | app/services/dataset_discovery_service.py | DatasetDiscoveryService.discover() |
| Dataset Mapping | app.services.mapping_resolver | app/services/mapping_resolver.py | MappingResolver.resolve() |
| Column Mapping | app.services.dataset_discovery_service | app/services/dataset_discovery_service.py | DatasetDiscoveryService._fetch_columns() |

### 3.2 Validation Management Domain

| Capability | Python Module | Service File | Entry Point |
|-----------|--------------|--------------|-------------|
| Rule Discovery | app.discovery.auto_rule_discovery | app/discovery/auto_rule_discovery.py | AutoRuleDiscovery.generate_rules() |
| Control Discovery | app.execution.control_executor | app/execution/control_executor.py | ControlExecutor.execute() |
| Validation Execution | app.execution_engine | app/services/execution_service.py | ExecutionEngine.run() |
| Checkpointing | app.execution_engine | — | ExecutionEngine._save_checkpoint() |
| Retry Engine | app.orchestration.retry.rule_retry_manager | app/orchestration/retry/rule_retry_manager.py | RuleRetryManager.retry() |

### 3.3 Governance & Compliance Domain

| Capability | Python Module | Service File | Entry Point |
|-----------|--------------|--------------|-------------|
| Governance Decisions | app.governance.decision_engine | app/governance/decision_engine.py | record_decision() |
| Risk Scoring | app.governance.risk_scoring | app/governance/risk_scoring.py | calculate_migration_risk() |
| Release Gates | app.execution_engine | — | ExecutionEngine._evaluate_governance() |
| Approvals | app.services.approval_service | app/services/approval_service.py | ApprovalService.create() |

### 3.4 Reporting & Analytics Domain

| Capability | Python Module | Service File | Entry Point |
|-----------|--------------|--------------|-------------|
| Executive Reporting | app.audit_export | app/audit_export.py | AuditExporter.export_governance() |
| Operational Reporting | app.audit_export | app/audit_export.py | AuditExporter.export_governance() |
| Governance Reporting | app.audit_export | app/audit_export.py | AuditExporter.export_governance() |
| Technical Reporting | app.audit_export | app/audit_export.py | AuditExporter.export_governance() |
| Dashboard Services | app.scoring_engine | app/scoring_engine.py | ScoringEngine.calculate_overall() |
| Export Services | app.audit_export | app/audit_export.py | AuditExporter.export_governance() |

### 3.5 Platform Services Domain

| Capability | Python Module | Service File | Entry Point |
|-----------|--------------|--------------|-------------|
| Workflow Management | app.services.workflow_service | app/services/workflow_service.py | WorkflowService.create() |
| Task Management | app.services.task_service | app/services/task_service.py | TaskService.create() |
| Notification Services | app.services.notification_service | app/services/notification_service.py | NotificationService.create() |
| Calendar Services | app.services.calendar_service | app/services/calendar_service.py | CalendarService.create() |
| AI / MAP Copilot | app.ai.framework | app/ai/framework.py | AIService.query() |
| Authentication | app.services.auth_service | app/services/auth_service.py | AuthService.login() |

### 3.6 Administration Domain

| Capability | Python Module | Service File | Entry Point |
|-----------|--------------|--------------|-------------|
| User Management | app.services.user_service | app/services/user_service.py | UserService.create() |
| Role & Permission Management | app.services.role_service | app/services/role_service.py | RoleService.create() |
| Tenant Management | — | — | — |
| System Settings | app.services.settings_service | app/services/settings_service.py | SettingsService.get() |
| Feature Flags | app.services.settings_service | app/services/settings_service.py | SettingsService.get_flags() |
| Security Management | — | — | — |
| Audit Trail | app.api.core.middleware.audit_middleware | app/api/core/middleware/audit_middleware.py | AuditLoggingMiddleware.dispatch() |
| Maintenance & Health | — | — | — |

---

## 4. Python Module to Capability Mapping

### 4.1 Core Engine Modules

| Module | Capability | Purpose |
|--------|-----------|---------|
| app.execution_engine | Project Management, Validation Execution, Release Gates, Checkpointing | Core execution engine |
| app.rule_executor | Validation Execution | Rule execution |
| app.scoring_engine | Dashboard Services | Scoring calculations |
| app.audit_export | Reporting, Export | Export functionality |

### 4.2 Service Modules

| Module | Capability | Purpose |
|--------|-----------|---------|
| app.services.execution_service | Project Management, Validation Execution | Execution service |
| app.services.system_service | Connection Management | System service |
| app.services.credential_service | Connection Management | Credential service |
| app.services.dataset_discovery_service | Dataset Discovery, Column Mapping | Discovery service |
| app.services.mapping_resolver | Dataset Mapping | Mapping resolver |
| app.services.mapping_validator | Dataset Mapping | Mapping validator |
| app.services.approval_service | Approvals | Approval service |
| app.services.workflow_service | Workflow Management | Workflow service |
| app.services.task_service | Task Management | Task service |
| app.services.notification_service | Notification Services | Notification service |
| app.services.calendar_service | Calendar Services | Calendar service |
| app.services.auth_service | Authentication | Auth service |
| app.services.user_service | User Management | User service |
| app.services.role_service | Role Management | Role service |
| app.services.settings_service | System Settings, Feature Flags | Settings service |

### 4.3 Discovery Modules

| Module | Capability | Purpose |
|--------|-----------|---------|
| app.discovery.auto_rule_discovery | Rule Discovery, Dataset Discovery | Auto rule discovery |

### 4.4 Execution Modules

| Module | Capability | Purpose |
|--------|-----------|---------|
| app.execution.control_executor | Control Discovery | Control execution |

### 4.5 Governance Modules

| Module | Capability | Purpose |
|--------|-----------|---------|
| app.governance.decision_engine | Governance Decisions | Decision engine |
| app.governance.risk_scoring | Risk Scoring | Risk scoring |

### 4.6 Orchestration Modules

| Module | Capability | Purpose |
|--------|-----------|---------|
| app.orchestration.retry.rule_retry_manager | Retry Engine | Retry management |

### 4.7 AI Modules

| Module | Capability | Purpose |
|--------|-----------|---------|
| app.ai.framework | AI / MAP Copilot | AI framework |

### 4.8 Database Modules

| Module | Capability | Purpose |
|--------|-----------|---------|
| app.db.connection_resolver | Connection Management | Connection resolution |
| app.db.connection_factory | Connection Management | Connection creation |
| app.db.adapters.* | Connection Management | Database adapters |
| app.db.repositories.* | Connection Management | Data repositories |

### 4.9 API Modules

| Module | Capability | Purpose |
|--------|-----------|---------|
| app.api.routes.* | All | API routes |
| app.api.core.middleware.audit_middleware | Audit Trail | Audit middleware |
| app.api.helpers | All | Response standardization |

### 4.10 Utility Modules

| Module | Capability | Purpose |
|--------|-----------|---------|
| app.utils.logger | Audit Trail | Logging |
| app.utils.encryption | Connection Management | Encryption |

---

## 5. Python Statistics

| Metric | Count |
|--------|-------|
| Total Modules | 29 |
| Service Modules | 15 |
| Engine Modules | 4 |
| Discovery Modules | 1 |
| Execution Modules | 1 |
| Governance Modules | 2 |
| Orchestration Modules | 1 |
| AI Modules | 1 |
| Database Modules | 4 |
| API Modules | 3 |
| Utility Modules | 2 |

---

*This mapping is part of the Enterprise Business Capability Model (Prompt 16).*