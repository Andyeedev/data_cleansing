# Frontend Gap Analysis: Pages with NO Backend Capability

> **Analysis Date:** 2026-07-14
> **Scope:** All frontend pages consuming mock/hardcoded data with no corresponding backend API
> **Total Gaps Identified:** 98 pages across 10 portals
> **Total Estimated Backend APIs Needed:** ~98 endpoints (many can be consolidated)

---

## Summary

| Portal | Pages | Mock Data Source | Backend APIs Needed | Priority |
|--------|-------|------------------|---------------------|----------|
| Operations Portal | 7 | Mock hooks/components | 7 | High |
| Governance Portal | 9 | Mock hooks/components | 9 | High |
| Reports Portal | 12 | Mock hooks/components | 12 | High |
| Risk Portal | 3 | Mock components | 3 | Medium |
| AI Portal | 4 | Local AIEngine class | 4 | Medium |
| Security Portal | 15 | Mock components | 15 | High |
| Administration Portal | 17 | Mock components | 17 | High |
| Report Centre | 7 | Mock components | 7 | Low |
| Report Scheduler | 11 | Mock components | 11 | Low |
| Report Distribution | 13 | Mock components | 13 | Low |

---

## 1. Operations Portal (7 Pages)

### 1.1 Operations Dashboard

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `OperationsDashboard` |
| **File Reference** | `useOperationsDashboard.ts` (hook) |
| **Currently Shows** | Hardcoded KPI cards: total operations, success rate, active queues, pending retries, avg processing time. Static trend data (7-day array), static recent activity list |
| **Mock Data Shape** | `{ totalOperations, successRate, activeQueues, pendingRetries, avgProcessingTime, trends[], recentActivity[] }` |
| **Backend Capability Needed** | Aggregated operations KPIs: counts by status, success rate calculation, queue metrics, retry counts, processing time averages |
| **API Type** | Platform API (aggregation service) |
| **Python Engine Dependency** | None — operational metrics are platform-level |
| **Priority** | **High** — core monitoring page, users cannot see real operational state |
| **Consolidation Note** | Can share `/api/v1/operations/stats` endpoint with Operations Executions page |

### 1.2 Operations Executions

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `OperationsExecution` |
| **File Reference** | Mock component in Operations module |
| **Currently Shows** | Table of execution records with columns: id, pipeline, status, startTime, endTime, duration, recordsProcessed, errorCount. Static 10-row dataset |
| **Mock Data Shape** | `Array<{ id, pipeline, status, startTime, endTime, duration, recordsProcessed, errorCount }>` |
| **Backend Capability Needed** | Execution history query API with filtering, pagination, sorting. Must support date range, status, and pipeline filters |
| **API Type** | Platform API (execution log service) |
| **Python Engine Dependency** | None — execution logs are platform-managed |
| **Priority** | **High** — users need to query real execution history |

### 1.3 Operations Queues

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `OperationsQueues` |
| **File Reference** | Mock component in Operations module |
| **Currently Shows** | Queue list: id, name, status, pendingCount, processingCount, failedCount, lastActivity. Static 5-row dataset |
| **Mock Data Shape** | `Array<{ id, name, status, pendingCount, processingCount, failedCount, lastActivity }>` |
| **Backend Capability Needed** | Queue status service: list queues with real-time counts, queue health, and activity timestamps |
| **API Type** | Platform API (queue management service) |
| **Python Engine Dependency** | None — queue state is platform-managed |
| **Priority** | **High** — critical for operational visibility |

### 1.4 Operations Schedules

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `OperationsSchedules` |
| **File Reference** | Mock component in Operations module |
| **Currently Shows** | Schedule list: id, name, cron, pipeline, status, lastRun, nextRun, enabled. Static 4-row dataset |
| **Mock Data Shape** | `Array<{ id, name, cron, pipeline, status, lastRun, nextRun, enabled }>` |
| **Backend Capability Needed** | Schedule CRUD API: list, create, update, delete schedules. Cron expression validation. Next-run calculation service |
| **API Type** | Platform API (scheduler service) |
| **Python Engine Dependency** | None — scheduling is platform-managed |
| **Priority** | **Medium** — users need to manage real schedules |

### 1.5 Operations Monitoring

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `OperationsMonitoring` |
| **File Reference** | Mock component in Operations module |
| **Currently Shows** | Real-time monitoring view: active operations, resource usage (CPU/memory), throughput metrics, alert thresholds. Static snapshot data |
| **Mock Data Shape** | `{ activeOperations[], resourceMetrics: { cpu, memory, disk }, throughput, alerts[] }` |
| **Backend Capability Needed** | Real-time monitoring API: streaming metrics (WebSocket or SSE), resource utilization, throughput counters, threshold alerts |
| **API Type** | Platform API (monitoring service) |
| **Python Engine Dependency** | None — monitoring is platform infrastructure |
| **Priority** | **High** — critical for real-time operational awareness |

### 1.6 Operations Alerts

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `OperationsAlerts` |
| **File Reference** | Mock component in Operations module |
| **Currently Shows** | Alert list: id, severity, title, source, timestamp, acknowledged, resolvedAt. Static 8-row dataset |
| **Mock Data Shape** | `Array<{ id, severity, title, source, timestamp, acknowledged, resolvedAt }>` |
| **Backend Capability Needed** | Alert management API: list/filter/acknowledge/resolve alerts. Severity-based filtering, bulk operations |
| **API Type** | Platform API (alerting service) |
| **Python Engine Dependency** | None — alerts are platform-generated |
| **Priority** | **High** — users cannot manage real alerts |

### 1.7 Operations Retry Centre

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `OperationsRetry` |
| **File Reference** | Mock component in Operations module |
| **Currently Shows** | Failed operation list with retry controls: id, operation, failureReason, retryCount, maxRetries, lastAttempt, status. Static 6-row dataset with retry buttons |
| **Mock Data Shape** | `Array<{ id, operation, failureReason, retryCount, maxRetries, lastAttempt, status }>` |
| **Backend Capability Needed** | Retry management API: list failed operations, trigger retry, bulk retry, retry history, configurable retry policies |
| **API Type** | Platform API (retry service) |
| **Python Engine Dependency** | None — retry orchestration is platform-managed |
| **Priority** | **High** — critical for operational recovery workflows |

---

## 2. Governance Portal (9 Pages)

### 2.1 Governance Overview

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `GovernanceOverview` |
| **File Reference** | `useGovernanceDashboard.ts` (hook) |
| **Currently Shows** | KPI cards: complianceScore, totalPolicies, activeControls, openExceptions, pendingReviews. Static trend data, recent governance activity |
| **Mock Data Shape** | `{ complianceScore, totalPolicies, activeControls, openExceptions, pendingReviews, trends[], recentActivity[] }` |
| **Backend Capability Needed** | Governance aggregation service: compliance scoring, policy/exception/control counts, activity feed |
| **API Type** | Platform API (governance aggregation) |
| **Python Engine Dependency** | None — governance metrics are platform-level |
| **Priority** | **High** — governance team cannot see real compliance status |

### 2.2 Compliance

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `Compliance` |
| **File Reference** | Mock component in Governance module |
| **Currently Shows** | Compliance dashboard: overall score, framework breakdown (PCI-DSS, GDPR, SOX, HIPAA), compliance trends, gap analysis. Static data |
| **Mock Data Shape** | `{ overallScore, frameworks: [{ name, score, status, gaps }], trends[], gapAnalysis[] }` |
| **Backend Capability Needed** | Compliance assessment API: framework-based scoring, gap tracking, trend calculation, compliance rule evaluation |
| **API Type** | Platform API (compliance service) |
| **Python Engine Dependency** | None — compliance assessment is platform-managed |
| **Priority** | **High** — regulatory compliance requires real data |

### 2.3 Policies

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `Policies` |
| **File Reference** | Mock component in Governance module |
| **Currently Shows** | Policy list: id, name, category, status, version, lastUpdated, assignedTo. Static 8-row dataset |
| **Mock Data Shape** | `Array<{ id, name, category, status, version, lastUpdated, assignedTo }>` |
| **Backend Capability Needed** | Policy management CRUD: list, create, update, version, assign, approve/reject, audit trail |
| **API Type** | Platform API (policy service) |
| **Python Engine Dependency** | None |
| **Priority** | **High** — policies require lifecycle management |

### 2.4 Controls

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `Controls` |
| **File Reference** | Mock component in Governance module |
| **Currently Shows** | Control list: id, name, type, status, effectiveness, owner, lastTested. Static 6-row dataset |
| **Mock Data Shape** | `Array<{ id, name, type, status, effectiveness, owner, lastTested }>` |
| **Backend Capability Needed** | Control management API: CRUD, effectiveness scoring, testing schedule, linkage to policies/risks |
| **API Type** | Platform API (control service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** — controls need real effectiveness tracking |

### 2.5 Exceptions

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `Exceptions` |
| **File Reference** | Mock component in Governance module |
| **Currently Shows** | Exception list: id, title, policy, risk, status, owner, expiry, justification. Static 5-row dataset |
| **Mock Data Shape** | `Array<{ id, title, policy, risk, status, owner, expiry, justification }>` |
| **Backend Capability Needed** | Exception management API: CRUD, approval workflow, expiry tracking, risk association, renewal workflow |
| **API Type** | Platform API (exception service) |
| **Python Engine Dependency** | None |
| **Priority** | **High** — exceptions require real approval workflows |

### 2.6 Risk Governance

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `RiskGovernance` |
| **File Reference** | Mock component in Governance module |
| **Currently Shows** | Risk governance view: risk appetite statement, risk tolerance, risk indicators, governance board decisions. Static data |
| **Mock Data Shape** | `{ appetite, tolerance, indicators[], boardDecisions[] }` |
| **Backend Capability Needed** | Risk governance API: appetite/tolerance config, KRI tracking, board decision log, governance review scheduling |
| **API Type** | Platform API (risk governance service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** — risk governance is primarily platform-managed |

### 2.7 Audit Centre

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `AuditCentre` |
| **File Reference** | Mock component in Governance module |
| **Currently Shows** | Audit management: audit list (id, scope, status, auditor, startDate, findings), finding categories, remediation status |
| **Mock Data Shape** | `Array<{ id, scope, status, auditor, startDate, findings[] }>` |
| **Backend Capability Needed** | Audit lifecycle API: create/track/close audits, findings management, remediation tracking, evidence attachment |
| **API Type** | Platform API (audit service) |
| **Python Engine Dependency** | None |
| **Priority** | **High** — audits require real tracking and evidence management |

### 2.8 Regulatory Reporting

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `RegulatoryReporting` |
| **File Reference** | Mock component in Governance module |
| **Currently Shows** | Regulatory report list: id, regulation, reportType, dueDate, status, submissionDate. Static 4-row dataset |
| **Mock Data Shape** | `Array<{ id, regulation, reportType, dueDate, status, submissionDate }>` |
| **Backend Capability Needed** | Regulatory reporting API: report generation, submission tracking, deadline management, regulatory framework mapping |
| **API Type** | Platform API (regulatory service) |
| **Python Engine Dependency** | None |
| **Priority** | **High** — regulatory deadlines are critical |

### 2.9 Governance Workspace

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `GovernanceWorkspace` |
| **File Reference** | Mock component in Governance module |
| **Currently Shows** | Collaborative workspace: task list, comments, document links, workflow status. Static data |
| **Mock Data Shape** | `{ tasks[], comments[], documents[], workflowStatus }` |
| **Backend Capability Needed** | Workspace API: task management, commenting, document linking, workflow state, user assignment |
| **API Type** | Platform API (workspace/collaboration service) |
| **Python Engine Dependency** | None |
| **Priority** | **Low** — collaborative features are lower priority than core governance |

---

## 3. Reports Portal (12 Pages)

### 3.1 Reporting Overview

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `ReportingOverview` |
| **File Reference** | `useReportingDashboard.ts` (hook) |
| **Currently Shows** | KPIs: totalReports, generatedThisMonth, scheduledCount, failedCount. Recent reports list, popular templates. Static data |
| **Mock Data Shape** | `{ totalReports, generatedThisMonth, scheduledCount, failedCount, recentReports[], popularTemplates[] }` |
| **Backend Capability Needed** | Reporting aggregation service: report counts, generation stats, schedule stats, template popularity |
| **API Type** | Platform API (reporting aggregation) |
| **Python Engine Dependency** | None |
| **Priority** | **High** — reporting team needs real metrics |

### 3.2 Executive Reports

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `ExecutiveReports` |
| **File Reference** | Mock component in Reports module |
| **Currently Shows** | Executive summary cards: migration progress, risk summary, compliance score, financial impact. Static data |
| **Mock Data Shape** | `{ migrationProgress, riskSummary, complianceScore, financialImpact }` |
| **Backend Capability Needed** | Executive report generation API: aggregate data across modules, generate summary statistics, trend analysis |
| **API Type** | Platform API (reporting service) — may pull from Python engine for migration metrics |
| **Python Engine Dependency** | Partial — migration metrics from engine, executive summary from platform |
| **Priority** | **High** — executives need real dashboards |

### 3.3 Operational Reports

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `OperationalReports` |
| **File Reference** | Mock component in Reports module |
| **Currently Shows** | Operational report list: id, name, type, generatedAt, status, recordCount. Static 6-row dataset |
| **Mock Data Shape** | `Array<{ id, name, type, generatedAt, status, recordCount }>` |
| **Backend Capability Needed** | Operational report API: list/filter reports, trigger generation, download, status tracking |
| **API Type** | Platform API (report service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 3.4 Migration Reports

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `MigrationReports` |
| **File Reference** | Mock component in Reports module |
| **Currently Shows** | Migration-specific reports: pipeline summary, data quality scores, transformation stats, error breakdown. Static data |
| **Mock Data Shape** | `{ pipelineSummary, dataQualityScores, transformationStats, errorBreakdown }` |
| **Backend Capability Needed** | Migration report generation: pipeline-level stats, quality metrics, transformation summaries — requires data from Python engine |
| **API Type** | Python Engine API — report generation triggers engine, results stored in platform |
| **Python Engine Dependency** | **Yes** — core migration data lives in engine |
| **Priority** | **High** — migration teams need real reporting |

### 3.5 Validation Reports

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `ValidationReports` |
| **File Reference** | Mock component in Reports module |
| **Currently Shows** | Validation report list: id, rule, result, passRate, issues. Static data |
| **Mock Data Shape** | `Array<{ id, rule, result, passRate, issues }>` |
| **Backend Capability Needed** | Validation report API: run validation, collect results, generate PDF/Excel, historical comparison |
| **API Type** | Python Engine API — validation logic lives in engine |
| **Python Engine Dependency** | **Yes** — validation execution is engine-based |
| **Priority** | **High** — validation reports are core product deliverable |

### 3.6 Governance Reports

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `GovernanceReports` |
| **File Reference** | Mock component in Reports module |
| **Currently Shows** | Governance report list: compliance summary, policy adherence, control effectiveness. Static data |
| **Mock Data Shape** | `{ complianceSummary, policyAdherence, controlEffectiveness }` |
| **Backend Capability Needed** | Governance report aggregation: pull from governance module, generate compliance/policy/control summaries |
| **API Type** | Platform API (governance reporting) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 3.7 Audit Reports

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `AuditReports` |
| **File Reference** | Mock component in Reports module |
| **Currently Shows** | Audit report list: id, auditName, date, status, findingsCount, severity. Static 4-row dataset |
| **Mock Data Shape** | `Array<{ id, auditName, date, status, findingsCount, severity }>` |
| **Backend Capability Needed** | Audit report generation: compile audit data, finding summaries, trend reports |
| **API Type** | Platform API (audit reporting) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 3.8 Regulatory Reports

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `RegulatoryReports` |
| **File Reference** | Mock component in Reports module |
| **Currently Shows** | Regulatory report list: regulation, reportType, period, status, submissionDate. Static data |
| **Mock Data Shape** | `Array<{ regulation, reportType, period, status, submissionDate }>` |
| **Backend Capability Needed** | Regulatory report generation: framework-specific templates, data aggregation, submission tracking |
| **API Type** | Platform API (regulatory reporting) |
| **Python Engine Dependency** | None |
| **Priority** | **High** — regulatory compliance |

### 3.9 Scheduled Reports

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `ScheduledReports` |
| **File Reference** | Mock component in Reports module |
| **Currently Shows** | Scheduled report list: id, name, schedule, recipients, lastRun, nextRun, enabled. Static data |
| **Mock Data Shape** | `Array<{ id, name, schedule, recipients, lastRun, nextRun, enabled }>` |
| **Backend Capability Needed** | Report scheduling API: CRUD schedules, cron validation, recipient management, run history |
| **API Type** | Platform API (report scheduler) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 3.10 Templates

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `ReportTemplates` |
| **File Reference** | Mock component in Reports module |
| **Currently Shows** | Template gallery: id, name, category, preview, usageCount. Static 8-row dataset |
| **Mock Data Shape** | `Array<{ id, name, category, preview, usageCount }>` |
| **Backend Capability Needed** | Template management API: CRUD templates, category management, usage tracking, preview generation |
| **API Type** | Platform API (template service) |
| **Python Engine Dependency** | None |
| **Priority** | **Low** |

### 3.11 Distribution

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `ReportDistribution` |
| **File Reference** | Mock component in Reports module |
| **Currently Shows** | Distribution list: id, report, recipients, method (email/S3/SFTP), schedule, lastSent. Static data |
| **Mock Data Shape** | `Array<{ id, report, recipients, method, schedule, lastSent }>` |
| **Backend Capability Needed** | Distribution management API: CRUD distributions, delivery method configuration, send history, failure retry |
| **API Type** | Platform API (distribution service) |
| **Python Engine Dependency** | None |
| **Priority** | **Low** |

### 3.12 Reporting Workspace

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `ReportingWorkspace` |
| **File Reference** | Mock component in Reports module |
| **Currently Shows** | Collaborative workspace: recent edits, shared reports, comments, workflow status. Static data |
| **Mock Data Shape** | `{ recentEdits[], sharedReports[], comments[], workflowStatus }` |
| **Backend Capability Needed** | Workspace API: collaboration features, shared report management, commenting |
| **API Type** | Platform API (workspace service) |
| **Python Engine Dependency** | None |
| **Priority** | **Low** |

---

## 4. Risk Portal (3 Pages)

### 4.1 Risk Assessment

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `RiskPage` (tab: Assessment) |
| **File Reference** | Mock component in Risk module |
| **Currently Shows** | Risk assessment form: risk identification, likelihood, impact, risk score calculation, mitigation plan. Static form data |
| **Mock Data Shape** | `{ risks: [{ id, description, likelihood, impact, score, mitigation }] }` |
| **Backend Capability Needed** | Risk assessment API: CRUD assessments, score calculation, mitigation tracking, risk lifecycle |
| **API Type** | Platform API (risk service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 4.2 Risk Register

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `RiskPage` (tab: Register) |
| **File Reference** | Mock component in Risk module |
| **Currently Shows** | Risk register table: id, title, category, owner, likelihood, impact, score, status, lastReviewed. Static 8-row dataset |
| **Mock Data Shape** | `Array<{ id, title, category, owner, likelihood, impact, score, status, lastReviewed }>` |
| **Backend Capability Needed** | Risk register API: list/filter risks, review scheduling, owner assignment, status transitions |
| **API Type** | Platform API (risk register service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 4.3 Risk Matrix

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `RiskPage` (tab: Matrix) |
| **File Reference** | Mock component in Risk module |
| **Currently Shows** | 5x5 risk matrix heatmap: likelihood (y) vs impact (x), risk items plotted by position. Static data |
| **Mock Data Shape** | `{ matrix: [[{ count, risks[] }]], axisLabels: { likelihood, impact } }` |
| **Backend Capability Needed** | Risk matrix API: aggregate risks by likelihood/impact, calculate matrix positions, trend over time |
| **API Type** | Platform API (risk analytics) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

---

## 5. AI Portal (4 Pages)

### 5.1 AI Assistant

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `AIAssistantPage` |
| **File Reference** | Local `AIEngine` class (client-side) |
| **Currently Shows** | Chat interface: user messages, AI responses generated from local rule-based engine (pattern matching on keywords). No actual LLM integration |
| **Mock Data Shape** | N/A — deterministic rule-based responses from local `AIEngine` class |
| **Backend Capability Needed** | AI chat API: LLM integration endpoint, conversation history, context injection (migration data), streaming responses |
| **API Type** | Python Engine API — AI engine wraps LLM or rule engine with access to migration data |
| **Python Engine Dependency** | **Yes** — AI responses need context from migration data in engine |
| **Priority** | **Medium** — feature exists but with degraded intelligence |

### 5.2 AI Insights

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `AIInsightsPage` |
| **File Reference** | Local `AIEngine` class |
| **Currently Shows** | Insight cards: anomaly detection, pattern recognition, trend predictions — all generated from local rule engine with hardcoded patterns |
| **Mock Data Shape** | `{ insights: [{ type, title, description, confidence, severity }] }` |
| **Backend Capability Needed** | AI insights API: anomaly detection pipeline, pattern analysis, trend prediction — requires engine access to historical data |
| **API Type** | Python Engine API — insights derived from migration data analysis |
| **Python Engine Dependency** | **Yes** — insights need real data to be meaningful |
| **Priority** | **Medium** |

### 5.3 AI Recommendations

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `AIRecommendationsPage` |
| **File Reference** | Local `AIEngine` class |
| **Currently Shows** | Recommendation cards: optimization suggestions, risk mitigation, best practices — from local rule matching |
| **Mock Data Shape** | `{ recommendations: [{ type, title, rationale, impact, priority }] }` |
| **Backend Capability Needed** | AI recommendation engine: analyze current state, suggest optimizations, risk-based recommendations, priority scoring |
| **API Type** | Python Engine API — recommendations based on actual migration state |
| **Python Engine Dependency** | **Yes** |
| **Priority** | **Medium** |

### 5.4 AI Report Generator

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `AIReportGeneratorPage` |
| **File Reference** | Local `AIEngine` class |
| **Currently Shows** | Report generation form: select report type, parameters — generates hardcoded template text from local engine |
| **Mock Data Shape** | `{ reportTypes: string[], generatedReport: string }` |
| **Backend Capability Needed** | AI report generation API: LLM-powered report drafting from real data, template selection, data injection, format output |
| **API Type** | Python Engine API — report generation needs real migration data |
| **Python Engine Dependency** | **Yes** |
| **Priority** | **Low** — report generation can be deferred |

---

## 6. Security Portal (15 Pages)

### 6.1 Security Overview

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `SecurityOverview` |
| **File Reference** | Mock component in Security module |
| **Currently Shows** | Security dashboard: threat level, active incidents, encryption status, access anomalies. Static snapshot data |
| **Mock Data Shape** | `{ threatLevel, activeIncidents, encryptionStatus, accessAnomalies }` |
| **Backend Capability Needed** | Security overview API: aggregate security metrics, threat assessment, encryption status, anomaly counts |
| **API Type** | Platform API (security aggregation) |
| **Python Engine Dependency** | None |
| **Priority** | **High** — security team needs real-time visibility |

### 6.2 Encryption Management

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `EncryptionManagement` |
| **File Reference** | Mock component in Security module |
| **Currently Shows** | Encryption status: algorithms in use, key rotation schedule, encrypted data volume. Static data |
| **Mock Data Shape** | `{ algorithms[], rotationSchedule, encryptedVolume }` |
| **Backend Capability Needed** | Encryption management API: algorithm registry, rotation policy enforcement, encrypted volume tracking |
| **API Type** | Platform API (encryption service) |
| **Python Engine Dependency** | None |
| **Priority** | **High** |

### 6.3 Key Management

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `KeyManagement` |
| **File Reference** | Mock component in Security module |
| **Currently Shows** | Key list: id, type, algorithm, created, expires, status, usage. Static 5-row dataset |
| **Mock Data Shape** | `Array<{ id, type, algorithm, created, expires, status, usage }>` |
| **Backend Capability Needed** | Key management API (KMS integration): key CRUD, rotation, usage tracking, expiry management |
| **API Type** | Platform API (KMS integration) |
| **Python Engine Dependency** | None |
| **Priority** | **High** |

### 6.4 Certificate Management

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `CertificateManagement` |
| **File Reference** | Mock component in Security module |
| **Currently Shows** | Certificate list: id, domain, issuer, issued, expires, status. Static 4-row dataset |
| **Mock Data Shape** | `Array<{ id, domain, issuer, issued, expires, status }>` |
| **Backend Capability Needed** | Certificate management API: certificate inventory, expiry monitoring, renewal workflows, CA integration |
| **API Type** | Platform API (certificate service) |
| **Python Engine Dependency** | None |
| **Priority** | **High** |

### 6.5 Identity Providers

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `IdentityProviders` |
| **File Reference** | Mock component in Security module |
| **Currently Shows** | IdP list: id, name, type (SAML/OIDC), status, users, lastSync. Static 3-row dataset |
| **Mock Data Shape** | `Array<{ id, name, type, status, users, lastSync }>` |
| **Backend Capability Needed** | Identity provider management: IdP CRUD, SAML/OIDC configuration, user sync, health monitoring |
| **API Type** | Platform API (identity service) |
| **Python Engine Dependency** | None |
| **Priority** | **High** |

### 6.6 Authentication Policies

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `AuthenticationPolicies` |
| **File Reference** | Mock component in Security module |
| **Currently Shows** | Policy list: id, name, rules (MFA, password complexity, session timeout), appliesTo. Static 4-row dataset |
| **Mock Data Shape** | `Array<{ id, name, rules: object, appliesTo: string }>` |
| **Backend Capability Needed** | Auth policy management: CRUD policies, rule configuration, policy enforcement, violation tracking |
| **API Type** | Platform API (auth policy service) |
| **Python Engine Dependency** | None |
| **Priority** | **High** |

### 6.7 Multi-Factor Authentication

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `MultiFactorAuthentication` |
| **File Reference** | Mock component in Security module |
| **Currently Shows** | MFA overview: enrolled users, methods (TOTP/SMS/push), success rates, bypass requests. Static data |
| **Mock Data Shape** | `{ enrolledUsers, methods[], successRates, bypassRequests }` |
| **Backend Capability Needed** | MFA management API: enrollment tracking, method configuration, bypass workflow, success/failure analytics |
| **API Type** | Platform API (MFA service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 6.8 Session Management

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `SessionManagement` |
| **File Reference** | Mock component in Security module |
| **Currently Shows** | Active sessions: userId, ip, device, loginTime, lastActivity, status. Static 6-row dataset |
| **Mock Data Shape** | `Array<{ userId, ip, device, loginTime, lastActivity, status }>` |
| **Backend Capability Needed** | Session management API: active session listing, session termination, concurrent session limits, session analytics |
| **API Type** | Platform API (session service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 6.9 API Security

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `ApiSecurity` |
| **File Reference** | Mock component in Security module |
| **Currently Shows** | API security view: rate limiting status, OAuth tokens, API key inventory, abuse detection. Static data |
| **Mock Data Shape** | `{ rateLimiting, oauthTokens[], apiKeys[], abuseDetection }` |
| **Backend Capability Needed** | API security service: rate limit config, token management, API key CRUD, abuse pattern detection |
| **API Type** | Platform API (API gateway security) |
| **Python Engine Dependency** | None |
| **Priority** | **High** |

### 6.10 Audit Logs

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `AuditLogs` |
| **File Reference** | Mock component in Security module |
| **Currently Shows** | Audit log table: timestamp, user, action, resource, outcome, ip. Static 10-row dataset |
| **Mock Data Shape** | `Array<{ timestamp, user, action, resource, outcome, ip }>` |
| **Backend Capability Needed** | Audit log API: log ingestion, querying with filters (user, action, time range), export, retention management |
| **API Type** | Platform API (audit log service) |
| **Python Engine Dependency** | None |
| **Priority** | **High** |

### 6.11 Security Events

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `SecurityEvents` |
| **File Reference** | Mock component in Security module |
| **Currently Shows** | Event stream: id, type, severity, source, timestamp, details. Static 8-row dataset |
| **Mock Data Shape** | `Array<{ id, type, severity, source, timestamp, details }>` |
| **Backend Capability Needed** | Security event service: event ingestion, streaming (WebSocket/SSE), filtering, correlation, alerting |
| **API Type** | Platform API (SIEM integration) |
| **Python Engine Dependency** | None |
| **Priority** | **High** |

### 6.12 Threat Monitoring

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `ThreatMonitoring` |
| **File Reference** | Mock component in Security module |
| **Currently Shows** | Threat dashboard: active threats, attack vectors, geographic heatmap, threat intelligence feeds. Static data |
| **Mock Data Shape** | `{ activeThreats, attackVectors[], geoData[], threatFeeds[] }` |
| **Backend Capability Needed** | Threat monitoring API: threat detection pipeline, geolocation, threat intelligence integration, correlation engine |
| **API Type** | Platform API (threat intelligence service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 6.13 Compliance Status

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `ComplianceStatus` |
| **File Reference** | Mock component in Security module |
| **Currently Shows** | Security compliance: framework compliance (PCI-DSS, SOC2), control status, scan results. Static data |
| **Mock Data Shape** | `{ frameworks: [{ name, status, controls }], scanResults[] }` |
| **Backend Capability Needed** | Security compliance API: framework mapping, control evaluation, vulnerability scan integration |
| **API Type** | Platform API (compliance service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 6.14 Security Dashboard

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `SecurityDashboard` |
| **File Reference** | Mock component in Security module |
| **Currently Shows** | Consolidated security dashboard: KPIs across all security domains. Static aggregated data |
| **Mock Data Shape** | `{ threatScore, incidents, vulnerabilities, compliance, access }` |
| **Backend Capability Needed** | Security dashboard aggregation: cross-domain security metrics, scoring, trends |
| **API Type** | Platform API (security aggregation) |
| **Python Engine Dependency** | None |
| **Priority** | **High** — executive-level security view |

### 6.15 Security Navigation

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `SecurityNavigation` |
| **File Reference** | Mock component (navigation component) |
| **Currently Shows** | Navigation sidebar component — purely UI, no data requirements |
| **Mock Data Shape** | N/A — static navigation menu items |
| **Backend Capability Needed** | None — this is a static UI component. May benefit from dynamic menu config API |
| **API Type** | Platform API (optional — menu config) |
| **Python Engine Dependency** | None |
| **Priority** | **Low** — purely UI component |

---

## 7. Administration Portal (17 Pages)

### 7.1 Administration Overview

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `AdministrationOverview` |
| **File Reference** | Mock component in Administration module |
| **Currently Shows** | Admin dashboard: system health, active tenants, resource utilization, pending tasks. Static snapshot |
| **Mock Data Shape** | `{ systemHealth, activeTenants, resourceUtil, pendingTasks }` |
| **Backend Capability Needed** | Admin overview API: system health aggregation, tenant stats, resource metrics, task queue |
| **API Type** | Platform API (admin aggregation) |
| **Python Engine Dependency** | None |
| **Priority** | **High** |

### 7.2 Tenant Management

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `TenantManagement` |
| **File Reference** | Mock component in Administration module |
| **Currently Shows** | Tenant list: id, name, status, plan, users, storage, created. Static 5-row dataset |
| **Mock Data Shape** | `Array<{ id, name, status, plan, users, storage, created }>` |
| **Backend Capability Needed** | Tenant management CRUD: create/suspend/delete tenants, plan assignment, usage tracking, provisioning |
| **API Type** | Platform API (multi-tenant service) |
| **Python Engine Dependency** | None |
| **Priority** | **High** |

### 7.3 Organisation Management

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `OrganisationManagement` |
| **File Reference** | Mock component in Administration module |
| **Currently Shows** | Org hierarchy: id, name, parent, departments, members, status. Static 4-row dataset |
| **Mock Data Shape** | `Array<{ id, name, parent, departments, members, status }>` |
| **Backend Capability Needed** | Organisation CRUD: hierarchy management, department CRUD, member assignment, org-level settings |
| **API Type** | Platform API (organisation service) |
| **Python Engine Dependency** | None |
| **Priority** | **High** |

### 7.4 Subscription Management

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `SubscriptionManagement` |
| **File Reference** | Mock component in Administration module |
| **Currently Shows** | Subscription list: id, tenant, plan, status, billingCycle, mrr, renewalDate. Static 3-row dataset |
| **Mock Data Shape** | `Array<{ id, tenant, plan, status, billingCycle, mrr, renewalDate }>` |
| **Backend Capability Needed** | Subscription management: plan CRUD, subscription lifecycle, billing integration, usage metering |
| **API Type** | Platform API (billing/subscription service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 7.5 Licensing

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `Licensing` |
| **File Reference** | Mock component in Administration module |
| **Currently Shows** | License overview: license key, features enabled, seat count, expiration, activation status. Static data |
| **Mock Data Shape** | `{ licenseKey, features[], seats, expiration, activated }` |
| **Backend Capability Needed** | License management: license generation/validation, feature gating, seat management, activation workflow |
| **API Type** | Platform API (licensing service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 7.6 Platform Configuration

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `PlatformConfiguration` |
| **File Reference** | Mock component in Administration module |
| **Currently Shows** | Configuration editor: key-value pairs for platform settings, environment variables. Static data |
| **Mock Data Shape** | `{ configs: [{ key, value, description, lastModified }] }` |
| **Backend Capability Needed** | Configuration management API: CRUD configs, version history, validation, rollout control |
| **API Type** | Platform API (config service) |
| **Python Engine Dependency** | None |
| **Priority** | **High** |

### 7.7 Feature Flags

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `FeatureFlags` |
| **File Reference** | Mock component in Administration module |
| **Currently Shows** | Feature flag list: id, name, enabled, percentage, rules, lastToggled. Static 6-row dataset |
| **Mock Data Shape** | `Array<{ id, name, enabled, percentage, rules, lastToggled }>` |
| **Backend Capability Needed** | Feature flag service: CRUD flags, targeting rules, percentage rollouts, A/B testing support |
| **API Type** | Platform API (feature flag service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 7.8 System Settings

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `SystemSettings` |
| **File Reference** | Mock component in Administration module |
| **Currently Shows** | System settings panels: email config, storage config, logging level, maintenance mode toggle. Static data |
| **Mock Data Shape** | `{ email: {}, storage: {}, logging: {}, maintenance: {} }` |
| **Backend Capability Needed** | System settings API: read/update settings, validation, restart requirements, audit logging |
| **API Type** | Platform API (settings service) |
| **Python Engine Dependency** | None |
| **Priority** | **High** |

### 7.9 Job Scheduler

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `JobScheduler` |
| **File Reference** | Mock component in Administration module |
| **Currently Shows** | Job list: id, name, type, schedule, status, lastRun, nextRun, enabled. Static 5-row dataset |
| **Mock Data Shape** | `Array<{ id, name, type, schedule, status, lastRun, nextRun, enabled }>` |
| **Backend Capability Needed** | Job scheduler API: CRUD jobs, cron validation, execution history, manual trigger, dependency management |
| **API Type** | Platform API (job scheduler service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 7.10 Notification Management

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `NotificationManagement` |
| **File Reference** | Mock component in Administration module |
| **Currently Shows** | Notification config: channels (email/SMS/webhook), templates, rules, delivery stats. Static data |
| **Mock Data Shape** | `{ channels[], templates[], rules[], deliveryStats }` |
| **Backend Capability Needed** | Notification service: channel configuration, template management, delivery rules, analytics |
| **API Type** | Platform API (notification service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 7.11 Environment Management

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `EnvironmentManagement` |
| **File Reference** | Mock component in Administration module |
| **Currently Shows** | Environment list: id, name, type (dev/staging/prod), status, version, deployedAt. Static 3-row dataset |
| **Mock Data Shape** | `Array<{ id, name, type, status, version, deployedAt }>` |
| **Backend Capability Needed** | Environment management: environment CRUD, deployment tracking, version management, health monitoring |
| **API Type** | Platform API (environment service) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

### 7.12 Maintenance Centre

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `MaintenanceCentre` |
| **File Reference** | Mock component in Administration module |
| **Currently Shows** | Maintenance window scheduler: upcoming windows, history, impact assessment. Static data |
| **Mock Data Shape** | `{ upcoming: [], history: [], impact: {} }` |
| **Backend Capability Needed** | Maintenance management: window scheduling, notification dispatch, impact tracking, post-mortem logging |
| **API Type** | Platform API (maintenance service) |
| **Python Engine Dependency** | None |
| **Priority** | **Low** |

### 7.13 Health Monitoring

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `HealthMonitoring` |
| **File Reference** | Mock component in Administration module |
| **Currently Shows** | System health: service status, uptime, response times, error rates. Static snapshot |
| **Mock Data Shape** | `{ services: [{ name, status, uptime, responseTime, errorRate }] }` |
| **Backend Capability Needed** | Health monitoring API: service health checks, uptime tracking, SLA monitoring, alerting |
| **API Type** | Platform API (health service) |
| **Python Engine Dependency** | None |
| **Priority** | **High** |

### 7.14 Administration Dashboard

| Attribute | Detail |
|-----------|--------|
| **Frontend Page** | `AdministrationDashboard` |
| **File Reference** | Mock component in Administration module |
| **Currently Shows** | Admin dashboard: system overview, recent admin actions, quick actions. Static data |
| **Mock Data Shape** | `{ overview, recentActions[], quickActions[] }` |
| **Backend Capability Needed** | Admin dashboard aggregation: system metrics, admin activity feed, quick-action config |
| **API Type** | Platform API (admin aggregation) |
| **Python Engine Dependency** | None |
| **Priority** | **Medium** |

---

## 8. Report Centre (7 Pages)

> All pages in this portal are mock. Report Centre is a user-facing report browsing and generation interface.

| # | Frontend Page | Mock Data Shape | Backend Capability Needed | API Type | Python Engine | Priority |
|---|---------------|-----------------|---------------------------|----------|---------------|----------|
| 8.1 | Report Centre Overview | `{ categories[], recentReports[], popularReports[] }` | Report catalogue API: browse/search reports, categorization, usage analytics | Platform API | No | Low |
| 8.2 | Report Browser | `Array<{ id, name, category, type, lastGenerated }>` | Report search API: full-text search, filter by category/type/date, pagination | Platform API | No | Low |
| 8.3 | Report Viewer | `{ reportId, sections[], charts[], tables[] }` | Report rendering API: fetch report data, chart configurations, table data | Platform API | No | Low |
| 8.4 | Report Builder | `{ templates[], dataSources[], visualizations[] }` | Report builder API: template management, data source config, visualization config | Platform API | No | Low |
| 8.5 | Report Exporter | `{ formats: [PDF, Excel, CSV], exportHistory[] }` | Export service: generate exports in multiple formats, download URLs, history | Platform API | No | Low |
| 8.6 | Report Sharing | `{ sharedWith[], permissions[], shareLinks[] }` | Sharing API: share management, permission control, link generation | Platform API | No | Low |
| 8.7 | Report Favourites | `Array<{ id, name, addedAt, category }>` | Favourites API: user favourites CRUD, ordering, categorization | Platform API | No | Low |

---

## 9. Report Scheduler (11 Pages)

> All pages in this portal are mock. Report Scheduler manages automated report generation and delivery.

| # | Frontend Page | Mock Data Shape | Backend Capability Needed | API Type | Python Engine | Priority |
|---|---------------|-----------------|---------------------------|----------|---------------|----------|
| 9.1 | Scheduler Overview | `{ activeJobs, completedToday, failedToday, nextRun }` | Scheduler aggregation: job counts, execution stats, next-run calculation | Platform API | No | Low |
| 9.2 | Schedule List | `Array<{ id, name, cron, reportType, status, lastRun }>` | Schedule CRUD: list/create/update/delete schedules, cron validation | Platform API | No | Low |
| 9.3 | Schedule Editor | `{ schedule: { cron, parameters, recipients } }` | Schedule config API: cron builder, parameter templates, recipient management | Platform API | No | Low |
| 9.4 | Schedule Calendar | `{ events: [{ date, scheduleId, status }] }` | Calendar view API: upcoming runs, historical runs, calendar formatting | Platform API | No | Low |
| 9.5 | Execution History | `Array<{ id, scheduleId, startedAt, completedAt, status, reportUrl }>` | Execution log API: run history with filters, download links, status | Platform API | No | Low |
| 9.6 | Failure Queue | `Array<{ id, scheduleId, error, failedAt, retryCount }>` | Failure management API: failed runs, retry logic, error details | Platform API | No | Low |
| 9.7 | Schedule Templates | `Array<{ id, name, cron, reportType, description }>` | Template CRUD: schedule template management, instantiation | Platform API | No | Low |
| 9.8 | Recipient Management | `Array<{ id, name, email, groups[] }>` | Recipient service: contact management, group management, preferences | Platform API | No | Low |
| 9.9 | Delivery Methods | `Array<{ id, type, config, status }>` | Delivery config: email/S3/SFTP/webhook configuration, health checks | Platform API | No | Low |
| 9.10 | Schedule Analytics | `{ totalRuns, avgDuration, successRate, popularReports }` | Analytics API: execution statistics, performance metrics, usage trends | Platform API | No | Low |
| 9.11 | Schedule Settings | `{ defaults: {}, notifications: {}, retention: {} }` | Settings API: default configurations, notification preferences, retention policies | Platform API | No | Low |

---

## 10. Report Distribution (13 Pages)

> All pages in this portal are mock. Report Distribution manages report delivery to stakeholders.

| # | Frontend Page | Mock Data Shape | Backend Capability Needed | API Type | Python Engine | Priority |
|---|---------------|-----------------|---------------------------|----------|---------------|----------|
| 10.1 | Distribution Overview | `{ activeDistributions, deliveredToday, failedToday }` | Distribution aggregation: delivery counts, success/failure rates | Platform API | No | Low |
| 10.2 | Distribution List | `Array<{ id, name, report, recipients, method, schedule }>` | Distribution CRUD: list/create/update/delete distribution rules | Platform API | No | Low |
| 10.3 | Distribution Rules | `Array<{ id, name, conditions: {}, actions: {} }>` | Rule engine: conditional distribution based on report content, thresholds | Platform API | No | Low |
| 10.4 | Recipient Groups | `Array<{ id, name, members[], criteria }>` | Group management: dynamic/static groups, membership rules, criteria-based | Platform API | No | Low |
| 10.5 | Email Delivery | `Array<{ id, subject, recipients, sentAt, status }>` | Email service: send management, template rendering, delivery tracking | Platform API | No | Low |
| 10.6 | S3 Delivery | `Array<{ id, bucket, prefix, lastUpload, status }>` | S3 integration: upload management, bucket config, access policies | Platform API | No | Low |
| 10.7 | SFTP Delivery | `Array<{ id, host, path, lastUpload, status }>` | SFTP integration: connection management, upload tracking, key management | Platform API | No | Low |
| 10.8 | Webhook Delivery | `Array<{ id, url, method, lastTrigger, status }>` | Webhook integration: endpoint config, delivery tracking, retry logic | Platform API | No | Low |
| 10.9 | Delivery History | `Array<{ id, distributionId, method, sentAt, status, error }>` | Delivery log API: history with filters, error details, retry status | Platform API | No | Low |
| 10.10 | Failure Management | `Array<{ id, distributionId, error, failedAt, retryable }>` | Failure queue: error classification, retry management, escalation | Platform API | No | Low |
| 10.11 | Distribution Analytics | `{ totalDelivered, avgDeliveryTime, successRate, channelBreakdown }` | Analytics API: delivery performance, channel comparison, trend analysis | Platform API | No | Low |
| 10.12 | Access Control | `Array<{ userId, distributionId, permission, grantedAt }>` | Access control API: permission management, audit trail, bulk operations | Platform API | No | Low |
| 10.13 | Distribution Settings | `{ defaults: {}, retryPolicy: {}, retention: {} }` | Settings API: default distribution config, retry policies, retention | Platform API | No | Low |

---

## Consolidation & Backend API Design Recommendations

### API Endpoint Groups

To reduce the total number of endpoints, consolidate into these API groups:

| API Group | Endpoints Covered | Estimated Endpoints |
|-----------|-------------------|---------------------|
| `/api/v1/operations/*` | Dashboard, Executions, Queues, Schedules, Monitoring, Alerts, Retry | ~12 |
| `/api/v1/governance/*` | Overview, Compliance, Policies, Controls, Exceptions, Risk Gov, Audit, Regulatory, Workspace | ~20 |
| `/api/v1/reports/*` | Overview, Executive, Operational, Migration, Validation, Governance, Audit, Regulatory, Schedules, Templates, Distribution, Workspace | ~25 |
| `/api/v1/risk/*` | Assessment, Register, Matrix | ~8 |
| `/api/v1/ai/*` | Assistant, Insights, Recommendations, Report Gen | ~6 |
| `/api/v1/security/*` | Overview, Encryption, Keys, Certificates, IdP, Auth, MFA, Sessions, API Security, Audit Logs, Events, Threats, Compliance, Dashboard | ~30 |
| `/api/v1/admin/*` | Overview, Tenants, Orgs, Subscriptions, Licensing, Config, Features, Settings, Jobs, Notifications, Environments, Maintenance, Health | ~25 |
| `/api/v1/report-centre/*` | Browse, View, Build, Export, Share, Favourites | ~10 |
| `/api/v1/report-scheduler/*` | Schedules, Calendar, History, Failures, Templates, Recipients, Delivery, Analytics | ~15 |
| `/api/v1/report-distribution/*` | Distributions, Rules, Groups, Email, S3, SFTP, Webhooks, History, Failures, Analytics, Access | ~20 |
| **Total** | | **~171** |

### Priority Implementation Roadmap

| Phase | Portals | Pages | Rationale |
|-------|---------|-------|-----------|
| **Phase 1** (High) | Operations, Governance, Security, Admin | 48 | Core operational and compliance capabilities |
| **Phase 2** (High) | Reports (Migration/Validation only) | 2 | Core product deliverable reports |
| **Phase 3** (Medium) | Risk, AI, Reports (remaining) | 19 | Business intelligence and risk management |
| **Phase 4** (Low) | Report Centre, Scheduler, Distribution | 31 | Advanced reporting infrastructure |
| **Phase 5** (Low) | Security Navigation, Maintenance, Workspace pages | 5 | UI-only and collaboration features |

### Python Engine vs Platform API Decision Matrix

| Data Domain | API Type | Reasoning |
|-------------|----------|-----------|
| Migration execution metrics | Python Engine | Data generated by engine pipelines |
| Validation results | Python Engine | Validation logic in engine |
| AI insights/recommendations | Python Engine | Needs migration data context |
| Migration reports | Python Engine | Aggregation of engine data |
| Operations (queues, scheduling) | Platform | Infrastructure-level concerns |
| Governance (compliance, policies) | Platform | Organizational management |
| Security (auth, encryption, audit) | Platform | Platform security services |
| Administration (tenants, billing) | Platform | SaaS management |
| Report delivery/distribution | Platform | Delivery infrastructure |

---

*End of Frontend Gap Analysis*
