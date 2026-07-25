# Frontend-Backend Mapping

## 1. Frontend Pages with Backend API (ALIGNED)

| Frontend Menu | React Component | API Endpoint | Service | Status |
|---|---|---|---|---|
| Executive Dashboard | ExecutiveDashboardPage | /api/v1/execution/status/{id} | ExecutionService | Aligned |
| Migration > Execution | MigrationExecutionPage | POST /api/v1/execution/run | ExecutionService | Aligned |
| Migration > Datasets | MigrationDatasetsPage | /api/v1/systems/ | SystemService | Aligned |
| Migration > Mappings | MigrationMappingsPage | (auto-created during discovery) | DatasetDiscoveryService | Partial |
| Validation > Rules | ValidationRulesPage | /api/v1/validation/rules | ValidationService | Aligned |
| Validation > Results | ValidationResultsPage | /api/v1/validation/results | ValidationService | Aligned |
| Security > Credentials | CredentialManagement | /api/v1/credentials/ | CredentialService | Aligned |
| Administration > Users | UserManagement | /api/v1/users/ | UserService | Aligned |
| Administration > Roles | RoleManagement | /api/v1/roles/ | RoleService | Aligned |
| Settings | SettingsPage | /api/v1/settings/ | SettingsService | Aligned |

---

## 2. Frontend Pages with PLATFORM-ONLY Backend (no Python engine)

| Frontend Menu | API Endpoint | Service | Status |
|---|---|---|---|
| Task Management > Dashboard | /api/v1/tasks/ | TaskService | Platform-only |
| Task Management > My Tasks | /api/v1/tasks/my/list | TaskService | Platform-only |
| Task Management > Workflows | /api/v1/workflows/ | WorkflowService | Platform-only |
| Task Management > Approvals | /api/v1/approvals/ | ApprovalService | Platform-only |
| Task Management > Calendar | /api/v1/calendar/events | CalendarService | Platform-only |
| Task Management > Notifications | /api/v1/notifications/ | NotificationService | Platform-only |

---

## 3. Frontend Pages with NO Backend (Mock Data)

| Frontend Menu | Component | Data Source | Status |
|---|---|---|---|
| Operations > Dashboard | OperationsDashboardPage | Mock data | Missing |
| Operations > Executions | OperationsExecution | Mock data | Missing |
| Operations > Queues | OperationsQueues | Mock data | Missing |
| Operations > Schedules | OperationsSchedules | Mock data | Missing |
| Operations > Monitoring | OperationsMonitoring | Mock data | Missing |
| Operations > Alerts | OperationsAlerts | Mock data | Missing |
| Operations > Retry Centre | OperationsRetry | Mock data | Missing |
| Governance > Overview | GovernanceOverview | Mock data | Missing |
| Governance > Compliance | Compliance | Mock data | Missing |
| Governance > Policies | Policies | Mock data | Missing |
| Governance > Controls | Controls | Mock data | Missing |
| Governance > Exceptions | Exceptions | Mock data | Missing |
| Governance > Risk Governance | RiskGovernance | Mock data | Missing |
| Governance > Audit Centre | AuditCentre | Mock data | Missing |
| Governance > Regulatory Reporting | RegulatoryReporting | Mock data | Missing |
| Reports > Overview | ReportingOverview | Mock data | Missing |
| Reports > Executive Reports | ExecutiveReports | Mock data | Missing |
| Reports > Operational Reports | OperationalReports | Mock data | Missing |
| Reports > Migration Reports | MigrationReports | Mock data | Missing |
| Reports > Validation Reports | ValidationReports | Mock data | Missing |
| Reports > Governance Reports | GovernanceReports | Mock data | Missing |
| Reports > Audit Reports | AuditReports | Mock data | Missing |
| Reports > Regulatory Reports | RegulatoryReports | Mock data | Missing |
| Reports > Scheduled Reports | ScheduledReports | Mock data | Missing |
| Reports > Templates | ReportTemplates | Mock data | Missing |
| Reports > Distribution | ReportDistribution | Mock data | Missing |
| Risk > Assessment | RiskPage | Mock data | Missing |
| Risk > Register | RiskPage | Mock data | Missing |
| Risk > Matrix | RiskPage | Mock data | Missing |
| AI > Assistant | AIAssistantPage | Local AIEngine | Missing |
| AI > Insights | AIInsightsPage | Local AIEngine | Missing |
| AI > Recommendations | AIRecommendationsPage | Local AIEngine | Missing |
| AI > Report Generator | AIReportGeneratorPage | Local AIEngine | Missing |
| Security > Overview | SecurityOverview | Mock data | Missing |
| Security > Encryption | EncryptionManagement | Mock data | Missing |
| Security > Keys | KeyManagement | Mock data | Missing |
| Security > Certificates | CertificateManagement | Mock data | Missing |
| Security > Identity Providers | IdentityProviders | Mock data | Missing |
| Security > Authentication | AuthenticationPolicies | Mock data | Missing |
| Security > MFA | MultiFactorAuthentication | Mock data | Missing |
| Security > Sessions | SessionManagement | Mock data | Missing |
| Security > API Security | ApiSecurity | Mock data | Missing |
| Security > Audit Logs | AuditLogs | Mock data | Missing |
| Security > Security Events | SecurityEvents | Mock data | Missing |
| Security > Threat Monitoring | ThreatMonitoring | Mock data | Missing |
| Security > Compliance | ComplianceStatus | Mock data | Missing |
| Security > Dashboard | SecurityDashboard | Mock data | Missing |
| Administration > Overview | AdministrationOverview | Mock data | Missing |
| Administration > Tenants | TenantManagement | Mock data | Missing |
| Administration > Organisations | OrganisationManagement | Mock data | Missing |
| Administration > Subscriptions | SubscriptionManagement | Mock data | Missing |
| Administration > Licensing | Licensing | Mock data | Missing |
| Administration > Platform Configuration | PlatformConfiguration | Mock data | Missing |
| Administration > Feature Flags | FeatureFlags | Mock data | Missing |
| Administration > System Settings | SystemSettings | Mock data | Missing |
| Administration > Scheduler | JobScheduler | Mock data | Missing |
| Administration > Notifications | NotificationManagement | Mock data | Missing |
| Administration > Environment | EnvironmentManagement | Mock data | Missing |
| Administration > Maintenance | MaintenanceCentre | Mock data | Missing |
| Administration > Health | HealthMonitoring | Mock data | Missing |
| Administration > Dashboard | AdministrationDashboard | Mock data | Missing |
| Report Centre > Home | ReportCentre | Mock data | Missing |
| Report Scheduler > Dashboard | ReportScheduler | Mock data | Missing |
| Distribution > Dashboard | ReportDistributionCentre | Mock data | Missing |

---

## Summary

| Category | Count |
|---|---|
| Aligned (Frontend + Backend) | 9 |
| Partial (Frontend + Backend) | 1 |
| Platform-only (no Python engine) | 6 |
| Missing (Mock Data / Local AIEngine) | 63 |
| **Total Frontend Pages** | **79** |
