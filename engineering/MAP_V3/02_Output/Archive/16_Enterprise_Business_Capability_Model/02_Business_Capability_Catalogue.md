# Business Capability Catalogue

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  

---

## 1. Migration Management Domain

### 1.1 Project Management
- **Purpose:** Define and track migration projects with source/target systems, mappings, and controls
- **Business Owner:** Migration Lead
- **Primary Users:** Migration Engineers
- **Inputs:** Project requirements, source/target system details
- **Outputs:** Project configuration, execution plans
- **Dependent Capabilities:** Connection Management, Dataset Mapping
- **Supporting Services:** ExecutionService
- **Supporting Schemas:** core, engine
- **Supporting Tables:** core.projects, engine.migration_validation_batch, engine.migration_batch_registry
- **Supporting APIs:** POST /api/v1/execution/run
- **Supporting Python Modules:** app.execution_engine
- **Supporting Frontend Pages:** Migration > Projects (partial)

### 1.2 Connection Management
- **Purpose:** Manage source/target database connections and encrypted credentials
- **Business Owner:** Migration Lead
- **Primary Users:** Migration Engineers
- **Inputs:** Database connection details, credentials
- **Outputs:** Tested, encrypted connections
- **Dependent Capabilities:** None (root capability)
- **Supporting Services:** SystemService, CredentialService
- **Supporting Schemas:** core
- **Supporting Tables:** core.system_registry, core.system_credentials
- **Supporting APIs:** GET/POST /api/v1/systems/, GET/POST/PUT/DELETE /api/v1/credentials/
- **Supporting Python Modules:** app.db.connection_resolver, app.services.system_service, app.services.credential_service
- **Supporting Frontend Pages:** Migration > Datasets, Security > Credentials

### 1.3 Dataset Discovery
- **Purpose:** Automatically discover schemas, tables, columns from source/target databases
- **Business Owner:** Migration Lead
- **Primary Users:** Migration Engineers
- **Inputs:** Database connections
- **Outputs:** Discovered tables, columns, data types
- **Dependent Capabilities:** Connection Management
- **Supporting Services:** DatasetDiscoveryService
- **Supporting Schemas:** core, engine
- **Supporting Tables:** core.dataset_mappings, core.dataset_columns, core.rule_dataset_mapping
- **Supporting APIs:** (CLI only)
- **Supporting Python Modules:** app.discovery.auto_rule_discovery, app.services.dataset_discovery_service
- **Supporting Frontend Pages:** None

### 1.4 Dataset Mapping
- **Purpose:** Define source-to-target table mappings for validation
- **Business Owner:** Migration Lead
- **Primary Users:** Migration Engineers
- **Inputs:** Discovered datasets
- **Outputs:** Source-target table mappings
- **Dependent Capabilities:** Dataset Discovery
- **Supporting Services:** MappingResolver, MappingValidator
- **Supporting Schemas:** core
- **Supporting Tables:** core.dataset_mappings, core.rule_dataset_mapping
- **Supporting APIs:** (auto-created during discovery)
- **Supporting Python Modules:** app.services.mapping_resolver, app.services.mapping_validator
- **Supporting Frontend Pages:** Migration > Mappings (partial)

### 1.5 Column Mapping
- **Purpose:** Map individual source columns to target columns within a table mapping
- **Business Owner:** Migration Lead
- **Primary Users:** Migration Engineers
- **Inputs:** Dataset mappings
- **Outputs:** Column-level mappings with inferred roles
- **Dependent Capabilities:** Dataset Mapping
- **Supporting Services:** DatasetDiscoveryService
- **Supporting Schemas:** core
- **Supporting Tables:** core.dataset_columns, core.column_mappings
- **Supporting APIs:** (auto-created during discovery)
- **Supporting Python Modules:** app.services.dataset_discovery_service
- **Supporting Frontend Pages:** None

---

## 2. Validation Management Domain

### 2.1 Rule Discovery
- **Purpose:** Auto-infer validation rules based on column roles (PK, FK, numeric, date)
- **Business Owner:** Migration Lead
- **Primary Users:** Migration Engineers
- **Inputs:** Column mappings with inferred roles
- **Outputs:** Discovered rules (C01-C010)
- **Dependent Capabilities:** Column Mapping
- **Supporting Services:** AutoRuleDiscovery, RuleFactory
- **Supporting Schemas:** engine, core
- **Supporting Tables:** engine.rule_registry, core.rule_dataset_mapping
- **Supporting APIs:** (auto during execution)
- **Supporting Python Modules:** app.discovery.auto_rule_discovery, app.rule_factory
- **Supporting Frontend Pages:** Validation > Rules (partial)

### 2.2 Control Discovery
- **Purpose:** Fetch and configure validation controls from database
- **Business Owner:** Migration Lead
- **Primary Users:** Migration Engineers
- **Inputs:** Control configuration
- **Outputs:** Enabled controls for execution
- **Dependent Capabilities:** Rule Discovery
- **Supporting Services:** ControlExecutor
- **Supporting Schemas:** engine
- **Supporting Tables:** engine.control_registry
- **Supporting APIs:** (auto during execution)
- **Supporting Python Modules:** app.execution.control_executor
- **Supporting Frontend Pages:** None

### 2.3 Validation Execution
- **Purpose:** Execute the 6-step validation pipeline (Connection → Mapping → Rules → Controls → Execution → Governance)
- **Business Owner:** Migration Lead
- **Primary Users:** Migration Engineers
- **Inputs:** Project configuration, connections, mappings
- **Outputs:** Validation results, batch status, exceptions
- **Dependent Capabilities:** Control Discovery, Connection Management, Dataset Mapping, Rule Discovery
- **Supporting Services:** ExecutionService, ExecutionEngine, RuleExecutor
- **Supporting Schemas:** engine
- **Supporting Tables:** engine.migration_validation_batch, engine.migration_batch_registry, engine.migration_control_execution, engine.migration_control_summary, engine.migration_control_exceptions, engine.migration_batch_summary
- **Supporting APIs:** POST /api/v1/execution/run, GET /api/v1/execution/status/{batch_id}
- **Supporting Python Modules:** app.execution_engine, app.rule_executor
- **Supporting Frontend Pages:** Migration > Execution, Validation > Results

### 2.4 Checkpointing
- **Purpose:** Save execution state for resume after failure
- **Business Owner:** Migration Lead
- **Primary Users:** Migration Engineers
- **Inputs:** Execution state
- **Outputs:** Checkpoint data
- **Dependent Capabilities:** Validation Execution
- **Supporting Services:** ExecutionEngine
- **Supporting Schemas:** engine
- **Supporting Tables:** engine.batch_execution_checkpoint
- **Supporting APIs:** (automatic)
- **Supporting Python Modules:** app.execution_engine
- **Supporting Frontend Pages:** None

### 2.5 Retry Engine
- **Purpose:** Automatically retry failed validations at multiple levels
- **Business Owner:** Migration Lead
- **Primary Users:** Migration Engineers
- **Inputs:** Failed validation results
- **Outputs:** Retry attempts, success/failure
- **Dependent Capabilities:** Validation Execution, Checkpointing
- **Supporting Services:** RuleRetryManager
- **Supporting Schemas:** N/A (in-memory)
- **Supporting Tables:** None
- **Supporting APIs:** (automatic)
- **Supporting Python Modules:** app.orchestration.retry.rule_retry_manager
- **Supporting Frontend Pages:** None

---

## 3. Governance & Compliance Domain

### 3.1 Governance Decisions
- **Purpose:** Compute governance outcomes post-execution
- **Business Owner:** Governance Officer
- **Primary Users:** Compliance Officers
- **Inputs:** Validation results, governance configuration
- **Outputs:** Governance decisions (PASS/FAIL/BLOCKED)
- **Dependent Capabilities:** Validation Execution
- **Supporting Services:** DecisionEngine
- **Supporting Schemas:** engine
- **Supporting Tables:** engine.migration_governance_status, engine.migration_control_decisions
- **Supporting APIs:** (auto post-execution)
- **Supporting Python Modules:** app.governance.decision_engine
- **Supporting Frontend Pages:** Governance (mock)

### 3.2 Risk Scoring
- **Purpose:** Calculate risk scores using weighted algorithms
- **Business Owner:** Governance Officer
- **Primary Users:** Compliance Officers
- **Inputs:** Validation results, governance config
- **Outputs:** Risk scores (LOW/MEDIUM/HIGH)
- **Dependent Capabilities:** Validation Execution
- **Supporting Services:** RiskScoring
- **Supporting Schemas:** engine
- **Supporting Tables:** engine.migration_risk_scores
- **Supporting APIs:** (auto post-execution)
- **Supporting Python Modules:** app.governance.risk_scoring
- **Supporting Frontend Pages:** Risk (mock)

### 3.3 Release Gates
- **Purpose:** Approve or reject batch releases based on criteria
- **Business Owner:** Governance Officer
- **Primary Users:** Programme Managers
- **Inputs:** Governance decisions, risk scores
- **Outputs:** Release decisions (APPROVED/REJECTED/BLOCKED)
- **Dependent Capabilities:** Governance Decisions, Risk Scoring
- **Supporting Services:** ExecutionEngine
- **Supporting Schemas:** engine
- **Supporting Tables:** engine.migration_release_decision
- **Supporting APIs:** (auto post-execution)
- **Supporting Python Modules:** app.execution_engine
- **Supporting Frontend Pages:** Governance (mock)

### 3.4 Approvals
- **Purpose:** Manage approval workflows for governance decisions
- **Business Owner:** Governance Officer
- **Primary Users:** Compliance Officers
- **Inputs:** Approval requests
- **Outputs:** Approval decisions
- **Dependent Capabilities:** Governance Decisions
- **Supporting Services:** ApprovalService
- **Supporting Schemas:** platform
- **Supporting Tables:** platform.approval_requests, platform.approval_templates, platform.approval_step_instances
- **Supporting APIs:** GET/POST /api/v1/approvals/, PUT /api/v1/approvals/{id}/approve, PUT /api/v1/approvals/{id}/reject
- **Supporting Python Modules:** app.services.approval_service
- **Supporting Frontend Pages:** Task Management > Approvals

---

## 4. Reporting & Analytics Domain

### 4.1 Executive Reporting
- **Purpose:** High-level programme health summaries for executives
- **Business Owner:** Programme Sponsor
- **Primary Users:** Executives, CIO, CTO
- **Inputs:** Validated batch data
- **Outputs:** Executive summaries, KPIs
- **Dependent Capabilities:** Validation Execution, Governance Decisions
- **Supporting Services:** AuditExporter, ScoringEngine
- **Supporting Schemas:** engine, reporting
- **Supporting Tables:** engine.v_migration_executive_summary, reporting.v_fact_batch
- **Supporting APIs:** (SQL views)
- **Supporting Python Modules:** app.audit_export, app.scoring_engine
- **Supporting Frontend Pages:** Reports (mock)

### 4.2 Operational Reporting
- **Purpose:** Detailed migration progress reports for programme managers
- **Business Owner:** Programme Manager
- **Primary Users:** Migration Leads
- **Inputs:** Validation results
- **Outputs:** Progress reports, status updates
- **Dependent Capabilities:** Validation Execution
- **Supporting Services:** AuditExporter
- **Supporting Schemas:** engine
- **Supporting Tables:** engine.v_migration_control_summary
- **Supporting APIs:** (SQL views)
- **Supporting Python Modules:** app.audit_export
- **Supporting Frontend Pages:** Reports (mock)

### 4.3 Governance Reporting
- **Purpose:** Compliance and audit trail reports
- **Business Owner:** Governance Officer
- **Primary Users:** Auditors
- **Inputs:** Governance decisions, audit events
- **Outputs:** Compliance reports
- **Dependent Capabilities:** Governance Decisions, Audit Trail
- **Supporting Services:** AuditExporter
- **Supporting Schemas:** engine
- **Supporting Tables:** engine.v_governance_decisions
- **Supporting APIs:** (SQL views)
- **Supporting Python Modules:** app.audit_export
- **Supporting Frontend Pages:** Reports (mock)

### 4.4 Technical Reporting
- **Purpose:** Validation details, exceptions, rule results
- **Business Owner:** Migration Lead
- **Primary Users:** Migration Engineers
- **Inputs:** Validation results, exceptions
- **Outputs:** Technical reports
- **Dependent Capabilities:** Validation Execution
- **Supporting Services:** AuditExporter
- **Supporting Schemas:** engine
- **Supporting Tables:** engine.v_exception_detail, engine.v_top_failures
- **Supporting APIs:** (SQL views)
- **Supporting Python Modules:** app.audit_export
- **Supporting Frontend Pages:** Reports (mock)

### 4.5 Dashboard Services
- **Purpose:** Real-time KPI dashboards
- **Business Owner:** Programme Sponsor
- **Primary Users:** All Users
- **Inputs:** Validated data
- **Outputs:** Interactive dashboards
- **Dependent Capabilities:** Validation Execution, Reporting
- **Supporting Services:** ScoringEngine
- **Supporting Schemas:** reporting
- **Supporting Tables:** reporting.v_fact_batch, reporting.v_fact_control
- **Supporting APIs:** (SQL views)
- **Supporting Python Modules:** app.scoring_engine
- **Supporting Frontend Pages:** Executive Dashboard

### 4.6 Export Services
- **Purpose:** PDF, Excel, CSV, PNG export
- **Business Owner:** Programme Manager
- **Primary Users:** All Users
- **Inputs:** Reports
- **Outputs:** Exported files
- **Dependent Capabilities:** Reporting
- **Supporting Services:** AuditExporter
- **Supporting Schemas:** N/A
- **Supporting Tables:** N/A
- **Supporting APIs:** (CLI only)
- **Supporting Python Modules:** app.audit_export
- **Supporting Frontend Pages:** None

---

## 5. Platform Services Domain

### 5.1 Workflow Management
- **Purpose:** Define and execute business workflows
- **Business Owner:** Administrator
- **Primary Users:** All Users
- **Inputs:** Workflow definitions
- **Outputs:** Workflow instances, execution history
- **Dependent Capabilities:** Authentication
- **Supporting Services:** WorkflowService
- **Supporting Schemas:** platform
- **Supporting Tables:** platform.workflow_definitions, platform.workflow_instances, platform.workflow_step_instances, platform.workflow_history
- **Supporting APIs:** GET/POST/PUT/DELETE /api/v1/workflows/
- **Supporting Python Modules:** app.services.workflow_service
- **Supporting Frontend Pages:** Task Management > Workflows

### 5.2 Task Management
- **Purpose:** Track and assign migration tasks
- **Business Owner:** Programme Manager
- **Primary Users:** All Users
- **Inputs:** Task definitions
- **Outputs:** Task status, assignments
- **Dependent Capabilities:** Authentication, Workflow Management
- **Supporting Services:** TaskService
- **Supporting Schemas:** platform
- **Supporting Tables:** platform.tasks, platform.task_comments, platform.task_dependencies
- **Supporting APIs:** GET/POST/PUT/DELETE /api/v1/tasks/
- **Supporting Python Modules:** app.services.task_service
- **Supporting Frontend Pages:** Task Management > Dashboard, My Tasks, All Tasks

### 5.3 Notification Services
- **Purpose:** Alert users of events and actions
- **Business Owner:** Administrator
- **Primary Users:** All Users
- **Inputs:** Event triggers
- **Outputs:** Notifications
- **Dependent Capabilities:** Authentication
- **Supporting Services:** NotificationService
- **Supporting Schemas:** platform
- **Supporting Tables:** platform.notifications, platform.notification_preferences
- **Supporting APIs:** GET/PUT/DELETE /api/v1/notifications/
- **Supporting Python Modules:** app.services.notification_service
- **Supporting Frontend Pages:** Task Management > Notifications

### 5.4 Calendar Services
- **Purpose:** Schedule and track events
- **Business Owner:** Administrator
- **Primary Users:** All Users
- **Inputs:** Event definitions
- **Outputs:** Calendar events, reminders
- **Dependent Capabilities:** Authentication
- **Supporting Services:** CalendarService
- **Supporting Schemas:** platform
- **Supporting Tables:** platform.calendar_events, platform.calendar_event_reminders
- **Supporting APIs:** GET/POST/PUT/DELETE /api/v1/calendar/events
- **Supporting Python Modules:** app.services.calendar_service
- **Supporting Frontend Pages:** Task Management > Calendar

### 5.5 AI / MAP Copilot
- **Purpose:** Natural language assistance and insights
- **Business Owner:** Administrator
- **Primary Users:** All Users
- **Inputs:** User queries
- **Outputs:** AI responses, insights, recommendations
- **Dependent Capabilities:** All business capabilities (reads via APIs)
- **Supporting Services:** AIService
- **Supporting Schemas:** N/A (API-only)
- **Supporting Tables:** N/A
- **Supporting APIs:** (frontend-local)
- **Supporting Python Modules:** app.ai.framework
- **Supporting Frontend Pages:** AI (mock)

### 5.6 Authentication
- **Purpose:** Identity management and SSO
- **Business Owner:** Security Officer
- **Primary Users:** All Users
- **Inputs:** Credentials
- **Outputs:** JWT tokens, sessions
- **Dependent Capabilities:** None (root capability)
- **Supporting Services:** AuthService
- **Supporting Schemas:** platform
- **Supporting Tables:** platform.users, platform.user_sessions, platform.refresh_tokens
- **Supporting APIs:** POST /api/v1/auth/login
- **Supporting Python Modules:** app.services.auth_service
- **Supporting Frontend Pages:** Login

---

## 6. Administration Domain

### 6.1 User Management
- **Purpose:** Create, update, deactivate users
- **Business Owner:** Administrator
- **Primary Users:** Administrators
- **Inputs:** User details
- **Outputs:** User accounts
- **Dependent Capabilities:** Authentication, Role Management
- **Supporting Services:** UserService
- **Supporting Schemas:** platform
- **Supporting Tables:** platform.users, platform.user_roles
- **Supporting APIs:** GET/POST/PUT/DELETE /api/v1/users/
- **Supporting Python Modules:** app.services.user_service
- **Supporting Frontend Pages:** Administration > Users

### 6.2 Role & Permission Management
- **Purpose:** Define RBAC roles and permissions
- **Business Owner:** Administrator
- **Primary Users:** Administrators
- **Inputs:** Role definitions, permission sets
- **Outputs:** Role assignments
- **Dependent Capabilities:** Authentication
- **Supporting Services:** RoleService
- **Supporting Schemas:** platform
- **Supporting Tables:** platform.roles, platform.permissions, platform.role_permissions
- **Supporting APIs:** GET/POST/PUT/DELETE /api/v1/roles/
- **Supporting Python Modules:** app.services.role_service
- **Supporting Frontend Pages:** Administration > Roles

### 6.3 Tenant Management
- **Purpose:** Multi-tenant configuration
- **Business Owner:** Administrator
- **Primary Users:** Administrators
- **Inputs:** Tenant details
- **Outputs:** Tenant configurations
- **Dependent Capabilities:** None
- **Supporting Services:** —
- **Supporting Schemas:** core
- **Supporting Tables:** core.tenants
- **Supporting APIs:** (no API)
- **Supporting Python Modules:** —
- **Supporting Frontend Pages:** Administration > Tenants (mock)

### 6.4 System Settings
- **Purpose:** Platform configuration
- **Business Owner:** Administrator
- **Primary Users:** Administrators
- **Inputs:** Configuration values
- **Outputs:** Updated settings
- **Dependent Capabilities:** None
- **Supporting Services:** SettingsService
- **Supporting Schemas:** platform
- **Supporting Tables:** platform.system_settings
- **Supporting APIs:** GET/PUT /api/v1/settings/
- **Supporting Python Modules:** app.services.settings_service
- **Supporting Frontend Pages:** Settings

### 6.5 Feature Flags
- **Purpose:** Toggle features by tenant/user
- **Business Owner:** Administrator
- **Primary Users:** Administrators
- **Inputs:** Flag definitions
- **Outputs:** Feature toggles
- **Dependent Capabilities:** None
- **Supporting Services:** SettingsService
- **Supporting Schemas:** platform
- **Supporting Tables:** platform.feature_flags
- **Supporting APIs:** GET /api/v1/settings/flags/list
- **Supporting Python Modules:** app.services.settings_service
- **Supporting Frontend Pages:** Administration > Feature Flags (mock)

### 6.6 Security Management
- **Purpose:** Encryption, keys, certificates
- **Business Owner:** Security Officer
- **Primary Users:** Security Analysts
- **Inputs:** Security configurations
- **Outputs:** Security status
- **Dependent Capabilities:** Authentication
- **Supporting Services:** —
- **Supporting Schemas:** audit
- **Supporting Tables:** audit.security_events
- **Supporting APIs:** (no API)
- **Supporting Python Modules:** —
- **Supporting Frontend Pages:** Security (mock)

### 6.7 Audit Trail
- **Purpose:** Immutable audit log
- **Business Owner:** Security Officer
- **Primary Users:** Auditors
- **Inputs:** API calls, system events
- **Outputs:** Audit records
- **Dependent Capabilities:** Authentication
- **Supporting Services:** AuditMiddleware
- **Supporting Schemas:** audit
- **Supporting Tables:** audit.audit_events, audit.api_call_log, audit.data_access_log, audit.system_events
- **Supporting APIs:** (middleware-based)
- **Supporting Python Modules:** app.api.core.middleware.audit_middleware
- **Supporting Frontend Pages:** Security > Audit Logs (mock)

### 6.8 Maintenance & Health
- **Purpose:** System health monitoring
- **Business Owner:** Administrator
- **Primary Users:** Administrators
- **Inputs:** System status
- **Outputs:** Health reports
- **Dependent Capabilities:** None
- **Supporting Services:** —
- **Supporting Schemas:** N/A
- **Supporting Tables:** N/A
- **Supporting APIs:** GET /api/v1/ready
- **Supporting Python Modules:** —
- **Supporting Frontend Pages:** Operations > Health (mock)

---

*This catalogue is part of the Enterprise Business Capability Model (Prompt 16). All findings are based on source code analysis — no code was modified.*
