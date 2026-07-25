# Frontend Gap Analysis

**Date:** 14 July 2026  
**Audit:** Enterprise Functional Traceability Audit (Prompt 15)  
**Scope:** Frontend pages with no corresponding backend capability  

---

## 1. Summary

| Metric | Value |
|--------|-------|
| Total Frontend Pages | 134 |
| Pages with Backend | 19 (Aligned + Partial) |
| Pages with Mock Data | 98 (73%) |
| Pages Needing Backend | 98 |

---

## 2. Operations Portal (8 pages — All Mock)

| # | Page | Route | Component | Mock Source | Backend Needed |
|---|------|-------|-----------|------------|----------------|
| 1 | Dashboard | /operations/overview | OperationsDashboard | useOperationsDashboard.ts | Execution status APIs |
| 2 | Executions | /operations/executions | OperationsExecution | Mock | /api/v1/execution/status |
| 3 | Queues | /operations/queues | OperationsQueues | Mock | Queue management API |
| 4 | Schedules | /operations/schedules | OperationsSchedules | Mock | Schedule API |
| 5 | Monitoring | /operations/monitoring | OperationsMonitoring | Mock | Health/status APIs |
| 6 | Alerts | /operations/alerts | OperationsAlerts | Mock | Alert management API |
| 7 | Retry Centre | /operations/retry | OperationsRetry | Mock | Retry status API |
| 8 | Health | /operations/health | OperationsHealth | Mock | /api/v1/ready |

**Recommendation:** Wire to existing execution APIs and health checks. Priority: HIGH.

---

## 3. Governance Portal (9 pages — All Mock)

| # | Page | Route | Component | Mock Source | Backend Needed |
|---|------|-------|-----------|------------|----------------|
| 1 | Overview | /governance/overview | GovernanceOverview | useGovernanceDashboard.ts | /api/v1/governance |
| 2 | Compliance | /governance/compliance | Compliance | Mock | Governance decision API |
| 3 | Policies | /governance/policies | Policies | Mock | Policy management API |
| 4 | Controls | /governance/controls | Controls | Mock | /api/v1/controls |
| 5 | Exceptions | /governance/exceptions | Exceptions | Mock | Exception query API |
| 6 | Risk Governance | /governance/risk | RiskGovernance | Mock | Risk scoring API |
| 7 | Audit Centre | /governance/audit | AuditCentre | Mock | /api/v1/audit |
| 8 | Regulatory Reporting | /governance/reports | RegulatoryReporting | Mock | Report generation API |
| 9 | Workspace | /governance/workspace | GovernanceWorkspace | Mock | Workspace API |

**Recommendation:** Create /api/v1/governance endpoints reading from engine schema. Priority: HIGH.

---

## 4. Reports Portal (12 pages — All Mock)

| # | Page | Route | Component | Mock Source | Backend Needed |
|---|------|-------|-----------|------------|----------------|
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

**Recommendation:** Wire to existing SQL views (5 views in reporting schema). Priority: HIGH.

---

## 5. Risk Portal (4 pages — All Mock)

| # | Page | Route | Component | Mock Source | Backend Needed |
|---|------|-------|-----------|------------|----------------|
| 1 | Risk | /risk | RiskPage | Static mock | Risk assessment API |
| 2 | Assessment | /risk/assessment | RiskPage | Static mock | Risk scoring API |
| 3 | Register | /risk/register | RiskPage | Static mock | Risk register API |
| 4 | Matrix | /risk/matrix | RiskPage | Static mock | Risk matrix API |

**Recommendation:** Create /api/v1/risk endpoints reading from engine.migration_risk_scores. Priority: MEDIUM.

---

## 6. AI Portal (4 pages — Local Engine Only)

| # | Page | Route | Component | Mock Source | Backend Needed |
|---|------|-------|-----------|------------|----------------|
| 1 | Assistant | /ai/assistant | AIAssistantPage | Local AIEngine class | Python AI service |
| 2 | Insights | /ai/insights | AIInsightsPage | Local AIEngine class | Python AI service |
| 3 | Recommendations | /ai/recommendations | AIRecommendationsPage | Local AIEngine class | Python AI service |
| 4 | Report Generator | /ai/report-generator | AIReportGeneratorPage | Local AIEngine class | Python AI service |

**Recommendation:** AI is frontend-local. No Python AI service exists. Priority: LOW.

---

## 7. Security Portal (15 pages — All Mock)

| # | Page | Route | Component | Mock Source | Backend Needed |
|---|------|-------|-----------|------------|----------------|
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

**Recommendation:** Wire Audit Logs and Security Events to audit schema. Priority: MEDIUM.

---

## 8. Administration Portal (17 pages — All Mock)

| # | Page | Route | Component | Mock Source | Backend Needed |
|---|------|-------|-----------|------------|----------------|
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

**Recommendation:** Wire Feature Flags and System Settings to existing settings API. Priority: MEDIUM.

---

## 9. Report Centre (16 pages — All Mock)

| # | Page | Route | Mock Source |
|---|------|-------|------------|
| 1 | Home | /report-centre | useReportCentre.ts |
| 2 | Explorer | /report-centre/explorer | Mock |
| 3 | Recent | /report-centre/recent | Mock |
| 4 | Favourites | /report-centre/favourites | Mock |
| 5 | Scheduled | /report-centre/scheduled | Mock |
| 6 | Templates | /report-centre/templates | Mock |
| 7 | Shared | /report-centre/shared | Mock |
| 8 | My Reports | /report-centre/my-reports | Mock |
| 9 | Search | /report-centre/search | Mock |
| 10 | Preview | /report-centre/preview | Mock |
| 11 | Details | /report-centre/details | Mock |
| 12 | History | /report-centre/history | Mock |
| 13 | Queue | /report-centre/queue | Mock |
| 14 | Filters | /report-centre/filters | Mock |
| 15 | Workspace | /report-centre/workspace | Mock |
| 16 | Categories | /report-centre/categories | Mock |

**Recommendation:** Merge with Reports portal. Priority: LOW.

---

## 10. Report Scheduler (12 pages — All Mock)

| # | Page | Route | Mock Source |
|---|------|-------|------------|
| 1 | Dashboard | /scheduler/dashboard | useReportScheduler.ts |
| 2 | Schedules | /scheduler/schedules | Mock |
| 3 | Calendar | /scheduler/calendar | Mock |
| 4 | Timeline | /scheduler/timeline | Mock |
| 5 | Queue | /scheduler/queue | Mock |
| 6 | History | /scheduler/history | Mock |
| 7 | Templates | /scheduler/templates | Mock |
| 8 | Notifications | /scheduler/notifications | Mock |
| 9 | Logs | /scheduler/logs | Mock |
| 10 | Statistics | /scheduler/statistics | Mock |
| 11 | Settings | /scheduler/settings | Mock |
| 12 | Workspace | /scheduler/workspace | Mock |

**Recommendation:** Merge with Reports portal. Priority: LOW.

---

## 11. Report Distribution (13 pages — All Mock)

| # | Page | Route | Mock Source |
|---|------|-------|------------|
| 1 | Dashboard | /distribution/dashboard | useDistribution.ts |
| 2 | Explorer | /distribution/explorer | Mock |
| 3 | Queue | /distribution/queue | Mock |
| 4 | History | /distribution/history | Mock |
| 5 | Channels | /distribution/channels | Mock |
| 6 | Profiles | /distribution/profiles | Mock |
| 7 | Templates | /distribution/templates | Mock |
| 8 | Notifications | /distribution/notifications | Mock |
| 9 | Audit | /distribution/audit | Mock |
| 10 | Logs | /distribution/logs | Mock |
| 11 | Statistics | /distribution/statistics | Mock |
| 12 | Workspace | /distribution/workspace | Mock |
| 13 | Settings | /distribution/settings | Mock |

**Recommendation:** Merge with Reports portal. Priority: LOW.

---

## 12. Consolidated Backend Requirements

| Priority | API Group | Endpoints Needed | Frontend Pages Unlocked |
|----------|-----------|-----------------|------------------------|
| HIGH | /api/v1/governance | 6-8 endpoints | 9 (Governance portal) |
| HIGH | /api/v1/reports | 5-7 endpoints (SQL views) | 12 (Reports portal) |
| HIGH | /api/v1/discovery | 3-4 endpoints | 3 (Migration pages) |
| MEDIUM | /api/v1/audit | 3-4 endpoints | 3 (Audit pages) |
| MEDIUM | /api/v1/risk | 3-4 endpoints | 4 (Risk portal) |
| MEDIUM | /api/v1/controls | 2-3 endpoints | 2 (Controls pages) |
| LOW | /api/v1/schedules | 2-3 endpoints | 3 (Schedule pages) |
| LOW | /api/v1/distribution | 2-3 endpoints | 3 (Distribution pages) |

---

*This analysis is part of the Enterprise Functional Traceability Audit (Prompt 15). All findings are based on source code analysis — no code was modified.*
