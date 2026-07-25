# Enterprise Functional Traceability Matrix

**Date:** 14 July 2026  
**Audit:** Enterprise Functional Traceability Audit (Prompt 15)  

---

## 1. Summary

| Status | Count | Percentage |
|--------|-------|------------|
| Aligned | 9 | 7% |
| Partial | 10 | 7% |
| Missing | 111 | 83% |
| Duplicate | 2 | 1% |
| Unknown | 2 | 1% |
| **Total** | **134** | **100%** |

---

## 2. Aligned Pages

| Frontend Menu | Route | React Component | API Endpoint | Service | Python Module | Schema | Tables | Business Capability | Status |
|---------------|-------|-----------------|-------------|---------|---------------|--------|--------|-------------------|--------|
| Executive Dashboard | /dashboard/executive | ExecutiveDashboardPage | GET /api/v1/execution/status/{batch_id} | ExecutionService | app.execution_engine | engine | migration_batch_registry | Validation Execution | Aligned |
| Migration > Execution | /migration/execution | MigrationExecutionPage | POST /api/v1/execution/run | ExecutionService | app.execution_engine | engine | migration_batch_registry | Validation Execution | Aligned |
| Migration > Datasets | /migration/datasets | MigrationDatasetsPage | GET /api/v1/systems/ | SystemService | app.services.system_service | core | system_registry | Connection Management | Aligned |
| Validation > Rules | /validation/rules | ValidationRulesPage | GET /api/v1/validation/rules | ValidationService | app.rule_factory | engine | rule_registry | Rule Discovery | Aligned |
| Validation > Results | /validation/results | ValidationResultsPage | GET /api/v1/validation/results | ExecutionService | app.execution_engine | engine | migration_control_execution | Validation Execution | Aligned |
| Security > Credentials | /security/credentials | CredentialManagement | GET /api/v1/credentials/ | CredentialService | app.services.credential_service | core | system_credentials | Connection Management | Aligned |
| Administration > Users | /administration/users | UserManagement | GET /api/v1/users/ | UserService | app.services.user_service | platform | users | User Management | Aligned |
| Administration > Roles | /administration/roles | RoleManagement | GET /api/v1/roles/ | RoleService | app.services.role_service | platform | roles | Role Management | Aligned |
| Settings | /settings | SettingsPage | GET /api/v1/settings/ | SettingsService | app.services.settings_service | platform | system_settings | System Settings | Aligned |

---

## 3. Partial Pages

| Frontend Menu | Route | React Component | API Endpoint | Service | Python Module | Schema | Tables | Business Capability | Status |
|---------------|-------|-----------------|-------------|---------|---------------|--------|--------|-------------------|--------|
| Migration > Projects | /migration/projects | MigrationProjectsPage | POST /api/v1/execution/run | ExecutionService | app.execution_engine | core, engine | projects, migration_validation_batch | Project Management | Partial |
| Migration > Mappings | /migration/mappings | MigrationMappingsPage | (auto-created) | DatasetDiscoveryService | app.services.dataset_discovery_service | core | dataset_mappings | Dataset Mappings | Partial |
| Validation > Queue | /validation/queue | ValidationQueuePage | GET /api/v1/validation/queue | ValidationService | app.execution_engine | engine | migration_batch_registry | Validation Execution | Partial |
| Task Management > Dashboard | /task-management/dashboard | TaskDashboard | GET /api/v1/tasks/ | TaskService | app.services.task_service | platform | tasks | Task Management | Partial |
| Task Management > My Tasks | /task-management/my-tasks | MyTasks | GET /api/v1/tasks/my/list | TaskService | app.services.task_service | platform | tasks | Task Management | Partial |
| Task Management > All Tasks | /task-management/tasks | AllTasks | GET /api/v1/tasks/ | TaskService | app.services.task_service | platform | tasks | Task Management | Partial |
| Task Management > Workflows | /task-management/workflows | TaskWorkflows | GET /api/v1/workflows/ | WorkflowService | app.services.workflow_service | platform | workflow_definitions | Workflow Management | Partial |
| Task Management > Approvals | /task-management/approvals | TaskApprovals | GET /api/v1/approvals/ | ApprovalService | app.services.approval_service | platform | approval_requests | Approval Management | Partial |
| Task Management > Calendar | /task-management/calendar | TaskCalendar | GET /api/v1/calendar/events | CalendarService | app.services.calendar_service | platform | calendar_events | Calendar Management | Partial |
| Task Management > Notifications | /task-management/notifications | TaskNotifications | GET /api/v1/notifications/ | NotificationService | app.services.notification_service | platform | notifications | Notification Management | Partial |

---

## 4. Missing Pages (Mock Data Only)

### Operations Portal

| Frontend Menu | Route | React Component | API Endpoint | Service | Python Module | Schema | Tables | Business Capability | Status |
|---------------|-------|-----------------|-------------|---------|---------------|--------|--------|-------------------|--------|
| Operations > Dashboard | /operations/overview | OperationsDashboard | (none) | (none) | (none) | (none) | (none) | Operations Monitoring | Missing |
| Operations > Executions | /operations/executions | OperationsExecution | (none) | (none) | (none) | (none) | (none) | Execution Monitoring | Missing |
| Operations > Queues | /operations/queues | OperationsQueues | (none) | (none) | (none) | (none) | (none) | Queue Management | Missing |
| Operations > Schedules | /operations/schedules | OperationsSchedules | (none) | (none) | (none) | (none) | (none) | Schedule Management | Missing |
| Operations > Monitoring | /operations/monitoring | OperationsMonitoring | (none) | (none) | (none) | (none) | (none) | System Monitoring | Missing |
| Operations > Alerts | /operations/alerts | OperationsAlerts | (none) | (none) | (none) | (none) | (none) | Alert Management | Missing |
| Operations > Retry Centre | /operations/retry | OperationsRetry | (none) | (none) | (none) | (none) | (none) | Retry Management | Missing |
| Operations > Health | /operations/health | OperationsHealth | (none) | (none) | (none) | (none) | (none) | Health Monitoring | Missing |

### Governance Portal

| Frontend Menu | Route | React Component | API Endpoint | Service | Python Module | Schema | Tables | Business Capability | Status |
|---------------|-------|-----------------|-------------|---------|---------------|--------|--------|-------------------|--------|
| Governance > Overview | /governance/overview | GovernanceOverview | (none) | (none) | (none) | (none) | (none) | Governance Overview | Missing |
| Governance > Compliance | /governance/compliance | Compliance | (none) | (none) | (none) | (none) | (none) | Compliance Monitoring | Missing |
| Governance > Policies | /governance/policies | Policies | (none) | (none) | (none) | (none) | (none) | Policy Management | Missing |
| Governance > Controls | /governance/controls | Controls | (none) | (none) | (none) | (none) | (none) | Control Management | Missing |
| Governance > Exceptions | /governance/exceptions | Exceptions | (none) | (none) | (none) | (none) | (none) | Exception Management | Missing |
| Governance > Risk Governance | /governance/risk | RiskGovernance | (none) | (none) | (none) | (none) | (none) | Risk Governance | Missing |
| Governance > Audit Centre | /governance/audit | AuditCentre | (none) | (none) | (none) | (none) | (none) | Audit Centre | Missing |
| Governance > Regulatory Reporting | /governance/reports | RegulatoryReporting | (none) | (none) | (none) | (none) | (none) | Regulatory Reporting | Missing |
| Governance > Workspace | /governance/workspace | GovernanceWorkspace | (none) | (none) | (none) | (none) | (none) | Governance Workspace | Missing |

### Reports Portal

| Frontend Menu | Route | React Component | API Endpoint | Service | Python Module | Schema | Tables | Business Capability | Status |
|---------------|-------|-----------------|-------------|---------|---------------|--------|--------|-------------------|--------|
| Reports > Overview | /reports/overview | ReportingOverview | (none) | (none) | (none) | (none) | (none) | Reporting Overview | Missing |
| Reports > Executive Reports | /reports/executive | ExecutiveReports | (none) | (none) | (none) | (none) | (none) | Executive Reporting | Missing |
| Reports > Operational Reports | /reports/operational | OperationalReports | (none) | (none) | (none) | (none) | (none) | Operational Reporting | Missing |
| Reports > Migration Reports | /reports/migration | MigrationReports | (none) | (none) | (none) | (none) | (none) | Migration Reporting | Missing |
| Reports > Validation Reports | /reports/validation | ValidationReports | (none) | (none) | (none) | (none) | (none) | Validation Reporting | Missing |
| Reports > Governance Reports | /reports/governance | GovernanceReports | (none) | (none) | (none) | (none) | (none) | Governance Reporting | Missing |
| Reports > Audit Reports | /reports/audit | AuditReports | (none) | (none) | (none) | (none) | (none) | Audit Reporting | Missing |
| Reports > Regulatory Reports | /reports/regulatory | RegulatoryReports | (none) | (none) | (none) | (none) | (none) | Regulatory Reporting | Missing |
| Reports > Scheduled Reports | /reports/scheduled | ScheduledReports | (none) | (none) | (none) | (none) | (none) | Scheduled Reporting | Missing |
| Reports > Templates | /reports/templates | ReportTemplates | (none) | (none) | (none) | (none) | (none) | Report Templates | Missing |
| Reports > Distribution | /reports/distribution | ReportDistribution | (none) | (none) | (none) | (none) | (none) | Report Distribution | Missing |
| Reports > Workspace | /reports/workspace | ReportingWorkspace | (none) | (none) | (none) | (none) | (none) | Reporting Workspace | Missing |

### Risk Portal

| Frontend Menu | Route | React Component | API Endpoint | Service | Python Module | Schema | Tables | Business Capability | Status |
|---------------|-------|-----------------|-------------|---------|---------------|--------|--------|-------------------|--------|
| Risk | /risk | RiskPage | (none) | (none) | (none) | (none) | (none) | Risk Management | Missing |
| Risk > Assessment | /risk/assessment | RiskPage | (none) | (none) | (none) | (none) | (none) | Risk Assessment | Missing |
| Risk > Register | /risk/register | RiskPage | (none) | (none) | (none) | (none) | (none) | Risk Register | Missing |
| Risk > Matrix | /risk/matrix | RiskPage | (none) | (none) | (none) | (none) | (none) | Risk Matrix | Missing |

### AI Portal

| Frontend Menu | Route | React Component | API Endpoint | Service | Python Module | Schema | Tables | Business Capability | Status |
|---------------|-------|-----------------|-------------|---------|---------------|--------|--------|-------------------|--------|
| AI > Assistant | /ai/assistant | AIAssistantPage | (none) | (none) | (none) | (none) | (none) | AI Assistant | Missing |
| AI > Insights | /ai/insights | AIInsightsPage | (none) | (none) | (none) | (none) | (none) | AI Insights | Missing |
| AI > Recommendations | /ai/recommendations | AIRecommendationsPage | (none) | (none) | (none) | (none) | (none) | AI Recommendations | Missing |
| AI > Report Generator | /ai/report-generator | AIReportGeneratorPage | (none) | (none) | (none) | (none) | (none) | AI Report Generation | Missing |

### Security Portal

| Frontend Menu | Route | React Component | API Endpoint | Service | Python Module | Schema | Tables | Business Capability | Status |
|---------------|-------|-----------------|-------------|---------|---------------|--------|--------|-------------------|--------|
| Security > Overview | /security/overview | SecurityOverview | (none) | (none) | (none) | (none) | (none) | Security Overview | Missing |
| Security > Encryption | /security/encryption | EncryptionManagement | (none) | (none) | (none) | (none) | (none) | Encryption Management | Missing |
| Security > Keys | /security/keys | KeyManagement | (none) | (none) | (none) | (none) | (none) | Key Management | Missing |
| Security > Certificates | /security/certificates | CertificateManagement | (none) | (none) | (none) | (none) | (none) | Certificate Management | Missing |
| Security > Identity Providers | /security/identity-providers | IdentityProviders | (none) | (none) | (none) | (none) | (none) | Identity Provider Mgmt | Missing |
| Security > Authentication | /security/authentication | AuthenticationPolicies | (none) | (none) | (none) | (none) | (none) | Authentication Policies | Missing |
| Security > MFA | /security/mfa | MultiFactorAuthentication | (none) | (none) | (none) | (none) | (none) | MFA Management | Missing |
| Security > Sessions | /security/sessions | SessionManagement | (none) | (none) | (none) | (none) | (none) | Session Management | Missing |
| Security > API Security | /security/api-security | ApiSecurity | (none) | (none) | (none) | (none) | (none) | API Security | Missing |
| Security > Audit Logs | /security/audit-logs | AuditLogs | (none) | (none) | (none) | (none) | (none) | Audit Logs | Missing |
| Security > Security Events | /security/security-events | SecurityEvents | (none) | (none) | (none) | (none) | (none) | Security Events | Missing |
| Security > Threat Monitoring | /security/threat-monitoring | ThreatMonitoring | (none) | (none) | (none) | (none) | (none) | Threat Monitoring | Missing |
| Security > Compliance | /security/compliance | ComplianceStatus | (none) | (none) | (none) | (none) | (none) | Compliance Status | Missing |
| Security > Dashboard | /security/dashboard | SecurityDashboard | (none) | (none) | (none) | (none) | (none) | Security Dashboard | Missing |
| Security > Navigation | /security/* | SecurityNavigation | (none) | (none) | (none) | (none) | (none) | Security Navigation | Missing |

### Administration Portal

| Frontend Menu | Route | React Component | API Endpoint | Service | Python Module | Schema | Tables | Business Capability | Status |
|---------------|-------|-----------------|-------------|---------|---------------|--------|--------|-------------------|--------|
| Administration > Overview | /administration/overview | AdministrationOverview | (none) | (none) | (none) | (none) | (none) | Admin Overview | Missing |
| Administration > Tenants | /administration/tenants | TenantManagement | (none) | (none) | (none) | (none) | (none) | Tenant Management | Missing |
| Administration > Organisations | /administration/organisations | OrganisationManagement | (none) | (none) | (none) | (none) | (none) | Organisation Management | Missing |
| Administration > Subscriptions | /administration/subscriptions | SubscriptionManagement | (none) | (none) | (none) | (none) | (none) | Subscription Management | Missing |
| Administration > Licensing | /administration/licensing | Licensing | (none) | (none) | (none) | (none) | (none) | Licensing | Missing |
| Administration > Platform Config | /administration/platform-config | PlatformConfiguration | (none) | (none) | (none) | (none) | (none) | Platform Configuration | Missing |
| Administration > Feature Flags | /administration/feature-flags | FeatureFlags | (none) | (none) | (none) | (none) | (none) | Feature Flags | Missing |
| Administration > System Settings | /administration/system-settings | SystemSettings | (none) | (none) | (none) | (none) | (none) | System Settings | Missing |
| Administration > Scheduler | /administration/scheduler | JobScheduler | (none) | (none) | (none) | (none) | (none) | Job Scheduler | Missing |
| Administration > Notifications | /administration/notifications | NotificationManagement | (none) | (none) | (none) | (none) | (none) | Notification Management | Missing |
| Administration > Environment | /administration/environment | EnvironmentManagement | (none) | (none) | (none) | (none) | (none) | Environment Management | Missing |
| Administration > Maintenance | /administration/maintenance | MaintenanceCentre | (none) | (none) | (none) | (none) | (none) | Maintenance Centre | Missing |
| Administration > Health | /administration/health | HealthMonitoring | (none) | (none) | (none) | (none) | (none) | Health Monitoring | Missing |
| Administration > Dashboard | /administration/dashboard | AdministrationDashboard | (none) | (none) | (none) | (none) | (none) | Admin Dashboard | Missing |

### Report Centre, Scheduler, Distribution (41 pages — all Missing)

All pages in Report Centre (16), Report Scheduler (12), and Report Distribution (13) use mock data with no backend connection. See Frontend_Gap_Analysis.md for full listing.

---

## 5. Duplicate Pages

| Frontend Menu | Route | React Component | API Endpoint | Service | Python Module | Schema | Tables | Business Capability | Status |
|---------------|-------|-----------------|-------------|---------|---------------|--------|--------|-------------------|--------|
| Governance > Overview | /governance/overview | GovernanceOverview | (none) | (none) | (none) | (none) | (none) | Governance Overview | Duplicate |
| Reports > Overview | /reports/overview | ReportingOverview | (none) | (none) | (none) | (none) | (none) | Reporting Overview | Duplicate |

---

## 6. Unknown Pages

| Frontend Menu | Route | React Component | API Endpoint | Service | Python Module | Schema | Tables | Business Capability | Status |
|---------------|-------|-----------------|-------------|---------|---------------|--------|--------|-------------------|--------|
| Home | / | HomePage | (none) | (none) | (none) | (none) | (none) | Landing Page | Unknown |
| Help | /help | HelpPage | (none) | (none) | (none) | (none) | (none) | Documentation | Unknown |

---

## 7. Coverage Analysis

| Portal | Total Pages | Aligned | Partial | Missing | Coverage |
|--------|------------|---------|---------|---------|----------|
| Executive | 1 | 1 | 0 | 0 | 100% |
| Migration | 9 | 2 | 2 | 5 | 44% |
| Validation | 3 | 2 | 1 | 0 | 100% |
| Task Management | 7 | 0 | 7 | 0 | 100% (platform) |
| Operations | 8 | 0 | 0 | 8 | 0% |
| Governance | 9 | 0 | 0 | 9 | 0% |
| Reports | 12 | 0 | 0 | 12 | 0% |
| Risk | 4 | 0 | 0 | 4 | 0% |
| AI | 4 | 0 | 0 | 4 | 0% |
| Security | 15 | 1 | 0 | 14 | 7% |
| Administration | 17 | 2 | 0 | 15 | 12% |
| Report Centre | 16 | 0 | 0 | 16 | 0% |
| Report Scheduler | 12 | 0 | 0 | 12 | 0% |
| Report Distribution | 13 | 0 | 0 | 13 | 0% |
| Settings | 1 | 1 | 0 | 0 | 100% |
| Help | 1 | 0 | 0 | 0 | N/A |
| Home | 1 | 0 | 0 | 0 | N/A |
| **Total** | **134** | **9** | **10** | **111** | **7%** |

---

## 8. Backend Coverage by Schema

| Schema | Tables | Used by API | Used by Frontend | Coverage |
|--------|--------|-------------|-----------------|----------|
| core | 8 | 8 | 3 | 38% |
| engine | 22 | 2 | 2 | 18% |
| platform | 22 | 22 | 7 | 32% |
| reporting | 3 + 5 views | 0 | 0 | 0% |
| audit | 5 | 0 | 0 | 0% |

---

*This matrix is part of the Enterprise Functional Traceability Audit (Prompt 15). All findings are based on source code analysis — no code was modified.*