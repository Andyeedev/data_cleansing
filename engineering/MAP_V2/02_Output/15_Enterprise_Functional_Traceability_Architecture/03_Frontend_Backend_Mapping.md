# Frontend-Backend Mapping

**Date:** 14 July 2026  
**Audit:** Enterprise Functional Traceability Audit (Prompt 15)  

---

## 1. Summary

| Status | Count |
|--------|-------|
| Aligned | 9 |
| Partial | 10 |
| Platform-Only | 6 |
| Missing (Mock) | 63+ |
| Total Mapped | 88+ |

---

## 2. Aligned Pages (Frontend → Working Backend)

| # | Frontend Menu | Route | React Component | API Endpoint | Service | Python Module | Schema | Tables |
|---|---------------|-------|-----------------|-------------|---------|---------------|--------|--------|
| 1 | Executive Dashboard | /dashboard/executive | ExecutiveDashboardPage | GET /api/v1/execution/status/{batch_id} | ExecutionService | app.execution_engine | engine | migration_batch_registry |
| 2 | Migration > Execution | /migration/execution | MigrationExecutionPage | POST /api/v1/execution/run | ExecutionService | app.execution_engine | engine | migration_batch_registry |
| 3 | Migration > Datasets | /migration/datasets | MigrationDatasetsPage | GET /api/v1/systems/ | SystemService | app.services.system_service | core | system_registry |
| 4 | Validation > Rules | /validation/rules | ValidationRulesPage | GET /api/v1/validation/rules | ValidationService | app.rule_factory | engine | rule_registry |
| 5 | Validation > Results | /validation/results | ValidationResultsPage | GET /api/v1/validation/results | ExecutionService | app.execution_engine | engine | migration_control_execution |
| 6 | Security > Credentials | /security/credentials | CredentialManagement | GET /api/v1/credentials/ | CredentialService | app.services.credential_service | core | system_credentials |
| 7 | Administration > Users | /administration/users | UserManagement | GET /api/v1/users/ | UserService | app.services.user_service | platform | users |
| 8 | Administration > Roles | /administration/roles | RoleManagement | GET /api/v1/roles/ | RoleService | app.services.role_service | platform | roles |
| 9 | Settings | /settings | SettingsPage | GET /api/v1/settings/ | SettingsService | app.services.settings_service | platform | system_settings |

---

## 3. Partial Pages (Frontend → Incomplete Backend)

| # | Frontend Menu | Route | React Component | API Endpoint | Gap |
|---|---------------|-------|-----------------|-------------|-----|
| 1 | Migration > Projects | /migration/projects | MigrationProjectsPage | POST /api/v1/execution/run | No project CRUD — only execution trigger |
| 2 | Migration > Mappings | /migration/mappings | MigrationMappingsPage | (auto-created during discovery) | No mapping management API |
| 3 | Validation > Queue | /validation/queue | ValidationQueuePage | GET /api/v1/validation/queue | Incomplete queue management |
| 4 | Task Management > Dashboard | /task-management/dashboard | TaskDashboard | GET /api/v1/tasks/ | Platform-only, no engine link |
| 5 | Task Management > My Tasks | /task-management/my-tasks | MyTasks | GET /api/v1/tasks/my/list | Platform-only |
| 6 | Task Management > All Tasks | /task-management/tasks | AllTasks | GET /api/v1/tasks/ | Platform-only |
| 7 | Task Management > Workflows | /task-management/workflows | TaskWorkflows | GET /api/v1/workflows/ | Platform-only |
| 8 | Task Management > Approvals | /task-management/approvals | TaskApprovals | GET /api/v1/approvals/ | Platform-only |
| 9 | Task Management > Calendar | /task-management/calendar | TaskCalendar | GET /api/v1/calendar/events | Platform-only |
| 10 | Task Management > Notifications | /task-management/notifications | TaskNotifications | GET /api/v1/notifications/ | Platform-only |

---

## 4. Platform-Only Pages (No Python Engine Equivalent)

These pages have working backend APIs but are independent of the Python migration engine:

| # | Frontend Menu | Route | API Endpoint | Service | Schema | Tables |
|---|---------------|-------|-------------|---------|--------|--------|
| 1 | Task Management > Dashboard | /task-management/dashboard | GET /api/v1/tasks/ | TaskService | platform | tasks |
| 2 | Task Management > Workflows | /task-management/workflows | GET /api/v1/workflows/ | WorkflowService | platform | workflow_definitions |
| 3 | Task Management > Approvals | /task-management/approvals | GET /api/v1/approvals/ | ApprovalService | platform | approval_requests |
| 4 | Task Management > Calendar | /task-management/calendar | GET /api/v1/calendar/events | CalendarService | platform | calendar_events |
| 5 | Task Management > Notifications | /task-management/notifications | GET /api/v1/notifications/ | NotificationService | platform | notifications |
| 6 | Administration > Tenants | /administration/tenants | (mock) | — | — | — |

---

## 5. Missing Pages (Mock Data Only)

### 5.1 Operations Portal (8 pages)

| # | Page | Route | Component | Mock Source | Real Backend Needed |
|---|------|-------|-----------|------------|-------------------|
| 1 | Dashboard | /operations/overview | OperationsDashboard | useOperationsDashboard.ts | Execution status APIs |
| 2 | Executions | /operations/executions | OperationsExecution | Mock | /api/v1/execution/status |
| 3 | Queues | /operations/queues | OperationsQueues | Mock | Queue management API |
| 4 | Schedules | /operations/schedules | OperationsSchedules | Mock | Schedule API |
| 5 | Monitoring | /operations/monitoring | OperationsMonitoring | Mock | Health/status APIs |
| 6 | Alerts | /operations/alerts | OperationsAlerts | Mock | Alert management API |
| 7 | Retry Centre | /operations/retry | OperationsRetry | Mock | Retry status API |
| 8 | Health | /operations/health | OperationsHealth | Mock | Health check APIs |

### 5.2 Governance Portal (9 pages)

| # | Page | Route | Component | Mock Source | Real Backend Needed |
|---|------|-------|-----------|------------|-------------------|
| 1 | Overview | /governance/overview | GovernanceOverview | useGovernanceDashboard.ts | /api/v1/governance |
| 2 | Compliance | /governance/compliance | Compliance | Mock | Governance decision API |
| 3 | Policies | /governance/policies | Policies | Mock | Policy management API |
| 4 | Controls | /governance/controls | Controls | Mock | /api/v1/controls |
| 5 | Exceptions | /governance/exceptions | Exceptions | Mock | Exception query API |
| 6 | Risk Governance | /governance/risk | RiskGovernance | Mock | Risk scoring API |
| 7 | Audit Centre | /governance/audit | AuditCentre | Mock | /api/v1/audit |
| 8 | Regulatory Reporting | /governance/reports | RegulatoryReporting | Mock | Report generation API |
| 9 | Workspace | /governance/workspace | GovernanceWorkspace | Mock | Workspace API |

### 5.3 Reports Portal (12 pages)

| # | Page | Route | Component | Mock Source | Real Backend Needed |
|---|------|-------|-----------|------------|-------------------|
| 1 | Overview | /reports/overview | ReportingOverview | useReportingDashboard.ts | SQL views |
| 2 | Executive Reports | /reports/executive | ExecutiveReports | Mock | v_migration_executive_summary |
| 3 | Operational Reports | /reports/operational | OperationalReports | Mock | v_migration_control_summary |
| 4 | Migration Reports | /reports/migration | MigrationReports | Mock | v_migration_summary |
| 5 | Validation Reports | /reports/validation | ValidationReports | Mock | v_control_results |
| 6 | Governance Reports | /reports/governance | GovernanceReports | Mock | v_governance_decisions |
| 7 | Audit Reports | /reports/audit | AuditReports | Mock | audit.audit_events |
| 8 | Regulatory Reports | /reports/regulatory | RegulatoryReports | Mock | Report generation API |
| 9 | Scheduled Reports | /reports/scheduled | ScheduledReports | Mock | Schedule management API |
| 10 | Templates | /reports/templates | ReportTemplates | Mock | Template management API |
| 11 | Distribution | /reports/distribution | ReportDistribution | Mock | Distribution API |
| 12 | Workspace | /reports/workspace | ReportingWorkspace | Mock | Workspace API |

### 5.4 Risk Portal (4 pages)

| # | Page | Route | Component | Mock Source | Real Backend Needed |
|---|------|-------|-----------|------------|-------------------|
| 1 | Risk | /risk | RiskPage | Static mock | Risk assessment API |
| 2 | Assessment | /risk/assessment | RiskPage | Static mock | Risk scoring API |
| 3 | Register | /risk/register | RiskPage | Static mock | Risk register API |
| 4 | Matrix | /risk/matrix | RiskPage | Static mock | Risk matrix API |

### 5.5 AI Portal (4 pages)

| # | Page | Route | Component | Mock Source | Real Backend Needed |
|---|------|-------|-----------|------------|-------------------|
| 1 | Assistant | /ai/assistant | AIAssistantPage | Local AIEngine | Python AI service |
| 2 | Insights | /ai/insights | AIInsightsPage | Local AIEngine | Python AI service |
| 3 | Recommendations | /ai/recommendations | AIRecommendationsPage | Local AIEngine | Python AI service |
| 4 | Report Generator | /ai/report-generator | AIReportGeneratorPage | Local AIEngine | Python AI service |

### 5.6 Security Portal (15 pages)

| # | Page | Route | Component | Mock Source | Real Backend Needed |
|---|------|-------|-----------|------------|-------------------|
| 1 | Overview | /security/overview | SecurityOverview | useSecurityDashboard.ts | Security metrics API |
| 2 | Encryption | /security/encryption | EncryptionManagement | Mock | Encryption key API |
| 3 | Keys | /security/keys | KeyManagement | Mock | Key management API |
| 4 | Certificates | /security/certificates | CertificateManagement | Mock | Certificate API |
| 5 | Identity Providers | /security/identity-providers | IdentityProviders | Mock | IdP configuration API |
| 6 | Authentication | /security/authentication | AuthenticationPolicies | Mock | Auth policy API |
| 7 | MFA | /security/mfa | MultiFactorAuthentication | Mock | MFA management API |
| 8 | Sessions | /security/sessions | SessionManagement | Mock | Session API |
| 9 | API Security | /security/api-security | ApiSecurity | Mock | API security API |
| 10 | Audit Logs | /security/audit-logs | AuditLogs | Mock | audit.audit_events |
| 11 | Security Events | /security/security-events | SecurityEvents | Mock | audit.security_events |
| 12 | Threat Monitoring | /security/threat-monitoring | ThreatMonitoring | Mock | Threat detection API |
| 13 | Compliance | /security/compliance | ComplianceStatus | Mock | Compliance status API |
| 14 | Dashboard | /security/dashboard | SecurityDashboard | Mock | Security metrics API |
| 15 | Navigation | /security/* | SecurityNavigation | Mock | — |

### 5.7 Administration Portal (17 pages)

| # | Page | Route | Component | Mock Source | Real Backend Needed |
|---|------|-------|-----------|------------|-------------------|
| 1 | Overview | /administration/overview | AdministrationOverview | useAdminDashboard.ts | Admin metrics API |
| 2 | Tenants | /administration/tenants | TenantManagement | Mock | /api/v1/tenants |
| 3 | Organisations | /administration/organisations | OrganisationManagement | Mock | Organisation API |
| 4 | Subscriptions | /administration/subscriptions | SubscriptionManagement | Mock | Subscription API |
| 5 | Licensing | /administration/licensing | Licensing | Mock | Licensing API |
| 6 | Platform Config | /administration/platform-config | PlatformConfiguration | Mock | Config API |
| 7 | Feature Flags | /administration/feature-flags | FeatureFlags | Mock | /api/v1/settings/flags |
| 8 | System Settings | /administration/system-settings | SystemSettings | Mock | /api/v1/settings |
| 9 | Scheduler | /administration/scheduler | JobScheduler | Mock | Schedule API |
| 10 | Notifications | /administration/notifications | NotificationManagement | Mock | Notification API |
| 11 | Environment | /administration/environment | EnvironmentManagement | Mock | Environment API |
| 12 | Maintenance | /administration/maintenance | MaintenanceCentre | Mock | Maintenance API |
| 13 | Health | /administration/health | HealthMonitoring | Mock | /api/v1/ready |
| 14 | Dashboard | /administration/dashboard | AdministrationDashboard | Mock | Admin metrics API |

### 5.8 Report Centre (16 pages) — All Mock

| Page | Route | Mock Source |
|------|-------|------------|
| Home | /report-centre | useReportCentre.ts |
| Explorer | /report-centre/explorer | Mock |
| Recent | /report-centre/recent | Mock |
| Favourites | /report-centre/favourites | Mock |
| Scheduled | /report-centre/scheduled | Mock |
| Templates | /report-centre/templates | Mock |
| Shared | /report-centre/shared | Mock |
| My Reports | /report-centre/my-reports | Mock |
| Search | /report-centre/search | Mock |
| Preview | /report-centre/preview | Mock |
| Details | /report-centre/details | Mock |
| History | /report-centre/history | Mock |
| Queue | /report-centre/queue | Mock |
| Filters | /report-centre/filters | Mock |
| Workspace | /report-centre/workspace | Mock |
| Categories | /report-centre/categories | Mock |

### 5.9 Report Scheduler (12 pages) — All Mock

| Page | Route | Mock Source |
|------|-------|------------|
| Dashboard | /scheduler/dashboard | useReportScheduler.ts |
| Schedules | /scheduler/schedules | Mock |
| Calendar | /scheduler/calendar | Mock |
| Timeline | /scheduler/timeline | Mock |
| Queue | /scheduler/queue | Mock |
| History | /scheduler/history | Mock |
| Templates | /scheduler/templates | Mock |
| Notifications | /scheduler/notifications | Mock |
| Logs | /scheduler/logs | Mock |
| Statistics | /scheduler/statistics | Mock |
| Settings | /scheduler/settings | Mock |
| Workspace | /scheduler/workspace | Mock |

### 5.10 Report Distribution (13 pages) — All Mock

| Page | Route | Mock Source |
|------|-------|------------|
| Dashboard | /distribution/dashboard | useDistribution.ts |
| Explorer | /distribution/explorer | Mock |
| Queue | /distribution/queue | Mock |
| History | /distribution/history | Mock |
| Channels | /distribution/channels | Mock |
| Profiles | /distribution/profiles | Mock |
| Templates | /distribution/templates | Mock |
| Notifications | /distribution/notifications | Mock |
| Audit | /distribution/audit | Mock |
| Logs | /distribution/logs | Mock |
| Statistics | /distribution/statistics | Mock |
| Workspace | /distribution/workspace | Mock |
| Settings | /distribution/settings | Mock |

---

*This mapping is part of the Enterprise Functional Traceability Audit (Prompt 15). All findings are based on source code analysis — no code was modified.*
