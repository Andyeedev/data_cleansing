# Capability to Python Module Mapping

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  

---

## 1. Module Ownership

| Capability | Primary Module | Service Files | Entry Points |
|-----------|---------------|---------------|-------------|
| Project Management | app.execution_engine | app/services/execution_service.py | ExecutionEngine.__init__() |
| Connection Management | app.db.connection_resolver | app/services/system_service.py, app/services/credential_service.py | ConnectionResolver.get_connections() |
| Dataset Discovery | app.discovery.auto_rule_discovery | app/services/dataset_discovery_service.py | DatasetDiscoveryService.discover() |
| Dataset Mapping | app.services.mapping_resolver | app/services/mapping_resolver.py, app/services/mapping_validator.py | MappingResolver.resolve() |
| Column Mapping | app.services.dataset_discovery_service | app/services/dataset_discovery_service.py | DatasetDiscoveryService._fetch_columns() |
| Rule Discovery | app.discovery.auto_rule_discovery | app/discovery/auto_rule_discovery.py | AutoRuleDiscovery.generate_rules() |
| Control Discovery | app.execution.control_executor | app/execution/control_executor.py | ControlExecutor.execute() |
| Validation Execution | app.execution_engine | app/services/execution_service.py, app/rule_executor.py | ExecutionEngine.run() |
| Checkpointing | app.execution_engine | — | ExecutionEngine._save_checkpoint() |
| Retry Engine | app.orchestration.retry.rule_retry_manager | app/orchestration/retry/rule_retry_manager.py | RuleRetryManager.retry() |
| Governance Decisions | app.governance.decision_engine | app/governance/decision_engine.py | record_decision() |
| Risk Scoring | app.governance.risk_scoring | app/governance/risk_scoring.py | calculate_migration_risk() |
| Executive Reporting | app.audit_export | app/audit_export.py | AuditExporter.export_governance() |
| Dashboard Services | app.scoring_engine | app/scoring_engine.py | ScoringEngine.calculate_overall() |
| Workflow Management | app.services.workflow_service | app/services/workflow_service.py | WorkflowService |
| Task Management | app.services.task_service | app/services/task_service.py | TaskService |
| Notification Services | app.services.notification_service | app/services/notification_service.py | NotificationService |
| Calendar Services | app.services.calendar_service | app/services/calendar_service.py | CalendarService |
| Approvals | app.services.approval_service | app/services/approval_service.py | ApprovalService |
| Authentication | app.services.auth_service | app/services/auth_service.py | AuthService.login() |
| User Management | app.services.user_service | app/services/user_service.py | UserService |
| Role Management | app.services.role_service | app/services/role_service.py | RoleService |
| System Settings | app.services.settings_service | app/services/settings_service.py | SettingsService |
| Audit Trail | app.api.core.middleware.audit_middleware | app/api/core/middleware/audit_middleware.py | AuditLoggingMiddleware.dispatch() |

---

## 2. Module Coverage

| Module Category | Modules | Capabilities |
|----------------|---------|-------------|
| Engine (app.execution_engine, app.discovery, app.governance, app.rule_executor, app.orchestration) | 8 | 12 |
| Services (app.services.*) | 10 | 10 |
| Middleware (app.api.core.middleware) | 1 | 1 |
| Adapters (app.db.adapters.*) | 7 | 1 |

---

*This mapping is part of the Enterprise Business Capability Model (Prompt 16).*
