# MAP_CLI_MVP_Phase_02_Capability_Verification_Report.md

**Phase:** 2 — Capability Extraction & Verification
**Date:** 2026-07-20
**Status:** COMPLETE — Awaiting Approval
**Authoritative Source:** engineering/MAP_V2/00_Architecture/ (all architecture documents)

---

## 1. Goal

Extract capabilities from the approved policy, then verify each capability against the current MAP CLI implementation. The approved policy remains the authoritative source.

---

## 2. Source Documents Analysed

| # | Document | Role |
|---|----------|------|
| 16 | Enterprise_Business_Capability_Model.md | **Primary** — 34 business capabilities defined |
| 15 | Enterprise_Functional_Traceability_Architecture.md | Functional traceability to engine capabilities |
| 00 | Master_Roadmap.md | High-level roadmap and workstreams |
| 03 | Backend_Architecture.md | Backend service capabilities |
| 04 | API_Architecture.md | API endpoint definitions |
| 05 | Database_Architecture.md | Database schema and tables |
| 06 | AI_Architecture.md | AI/ML capability definitions |
| 07 | Reporting_Architecture.md | Reporting and dashboard capabilities |
| 08 | Security_Architecture.md | Security capabilities |
| 10 | Implementation_Roadmap.md | Implementation workstreams and phases |

---

## 3. Verification Methodology

For each of the 34 primary business capabilities defined in Doc 16:
1. Verified existence in the approved architecture (Doc 16 + supporting docs)
2. Searched the MAP CLI implementation (`app/`) for corresponding code
3. Classified as: **Covered** | **Partially Covered** | **Missing** | **Ambiguous** | **Duplicate**

---

## 4. Capability Verification Matrix

### DOMAIN 1: MIGRATION MANAGEMENT

| # | Capability | Architecture Ref | CLI Implementation | Status | Evidence |
|---|-----------|-----------------|-------------------|--------|----------|
| 1.1 | Project Management | Doc 16 §4.1, Doc 15 §4.2 #1, Doc 05 "Core Schema" | `app.execution_engine` — batch-level project_id tracking; no standalone project CRUD | **PARTIALLY COVERED** | Project ID exists in batch registry but no project entity management. Doc 15 confirms: "API Status: Partial" |
| 1.2 | Connection Management | Doc 16 §4.1, Doc 15 §4.2 #2, Doc 05 "Core Schema" | `app/db/connection_resolver.py`, `app/db/connection_factory.py`, `app/services/system_service.py`, `app/services/credential_service.py` — full CRUD + encryption + connection testing | **COVERED** | API: `/api/v1/systems/`, `/api/v1/credentials/` — CRUD + test connection |
| 1.3 | Dataset Discovery | Doc 16 §4.1, Doc 15 §4.2 #3, Doc 05 "Core Schema" | `app/services/dataset_discovery_service.py`, `app/discovery/auto_rule_discovery.py` — CLI `discover` command | **PARTIALLY COVERED** | CLI-only, no API endpoints. Doc 16 §11.1 #1 confirms gap |
| 1.4 | Dataset Mapping | Doc 16 §4.1, Doc 15 §4.2 #4, Doc 05 "Core Schema" | `app/services/mapping_resolver.py`, `app/services/mapping_validator.py` — auto-created during discovery | **PARTIALLY COVERED** | Auto-created, no manual CRUD API. Doc 16 §11.1 #2 confirms gap |
| 1.5 | Column Mapping | Doc 16 §4.1, Doc 15 §4.2 #5, Doc 05 "Core Schema" | `app/services/dataset_discovery_service.py` — auto-created during discovery | **PARTIALLY COVERED** | Auto-created, no manual CRUD API. Doc 16 §11.1 #2 confirms gap |

### DOMAIN 2: VALIDATION MANAGEMENT

| # | Capability | Architecture Ref | CLI Implementation | Status | Evidence |
|---|-----------|-----------------|-------------------|--------|----------|
| 2.1 | Rule Discovery | Doc 16 §4.2, Doc 15 §4.2 #6, Doc 05 "Engine Schema" | `app/discovery/auto_rule_discovery.py` — infers rules from column metadata | **COVERED** | 10 rule types auto-inferred. CLI internal, no API |
| 2.2 | Control Discovery | Doc 16 §4.2, Doc 15 §4.2 #7, Doc 05 "Engine Schema" | `app/execution_engine.py` Step 4 — loads controls from registry, validates DAG | **COVERED** | Internal to execution engine |
| 2.3 | Validation Execution | Doc 16 §4.2, Doc 15 §4.2 #8, Doc 03 "Validation Service" | `app/execution_engine.py` — 6-step pipeline, `app/execution/control_executor.py` | **COVERED** | API: `/api/v1/execution/run` (trigger), `/api/v1/execution/status/{batch_id}` (poll) |
| 2.4 | Checkpointing | Doc 16 §4.2, Doc 15 §4.2 #14, Doc 05 "Engine Schema" | `app/execution_engine.py` — checkpoint after each control, resume from checkpoint | **COVERED** | CLI `run --resume-batch` |
| 2.5 | Retry Engine | Doc 16 §4.2, Doc 15 §4.2 #13, Doc 07 "Business Events" | `app/orchestration/retry/rule_retry_manager.py`, `app/execution_engine.py` retry with backoff | **COVERED** | 3-level retry strategy, automatic |

### DOMAIN 3: GOVERNANCE & COMPLIANCE

| # | Capability | Architecture Ref | CLI Implementation | Status | Evidence |
|---|-----------|-----------------|-------------------|--------|----------|
| 3.1 | Governance Decisions | Doc 16 §4.3, Doc 15 §4.2 #9, Doc 03 "Governance Service" | `app/governance/decision_engine.py` — records decisions per control per batch | **PARTIALLY COVERED** | Auto post-execution, no API for manual governance actions. Doc 16 §11.1 #4 confirms gap |
| 3.2 | Risk Scoring | Doc 16 §4.3, Doc 03 "Risk Service", Doc 05 "Engine Schema" | `app/scoring_engine.py`, `app/governance/risk_scoring.py` — weighted scoring (0-100) | **PARTIALLY COVERED** | Auto post-execution, no API. Doc 16 §11.1 #5 confirms gap |
| 3.3 | Release Gates | Doc 16 §4.3, Doc 05 "Engine Schema" | `app/execution_engine.py` — release gate enforcement, blocks release below thresholds | **PARTIALLY COVERED** | Auto-enforced, no API for manual gate management. Doc 16 §11.1 #6 confirms gap |
| 3.4 | Approvals | Doc 16 §4.3, Doc 05 "Platform Schema" | `app/services/approval_service.py` — full CRUD + approve/reject | **COVERED** | API: `/api/v1/approvals/` — CRUD + approve/reject + pending count |

### DOMAIN 4: REPORTING & ANALYTICS

| # | Capability | Architecture Ref | CLI Implementation | Status | Evidence |
|---|-----------|-----------------|-------------------|--------|----------|
| 4.1 | Executive Reporting | Doc 16 §4.4, Doc 07 "Executive Reports" | SQL views only (no API, no CLI export for executive reports) | **MISSING** | Doc 16 §11.1 #7 confirms: "SQL views only, needs API endpoints" |
| 4.2 | Operational Reporting | Doc 16 §4.4, Doc 07 "Operational Reports" | SQL views only | **MISSING** | Same as 4.1 |
| 4.3 | Governance Reporting | Doc 16 §4.4, Doc 07 "Governance Reports" | SQL views only | **MISSING** | Same as 4.1 |
| 4.4 | Technical Reporting | Doc 16 §4.4, Doc 07 "Technical Reports" | SQL views only | **MISSING** | Same as 4.1 |
| 4.5 | Dashboard Services | Doc 16 §4.4, Doc 03 "Dashboard Service", Doc 07 "Dashboard Engine" | SQL views only — no API, no frontend integration | **MISSING** | Doc 04 defines `/api/v1/dashboard` but not implemented |
| 4.6 | Export Services | Doc 16 §4.4, Doc 07 "Export Engine" | `app/audit_export.py` — CLI `export` command (CSV audit pack) | **PARTIALLY COVERED** | CLI-only, PDF/Excel/PNG not implemented. Doc 07 defines full export engine |

### DOMAIN 5: PLATFORM SERVICES

| # | Capability | Architecture Ref | CLI Implementation | Status | Evidence |
|---|-----------|-----------------|-------------------|--------|----------|
| 5.1 | Workflow Management | Doc 16 §4.5, Doc 05 "Platform Schema" | `app/services/workflow_service.py` — full CRUD + execute + instances | **COVERED** | API: `/api/v1/workflows/` — CRUD + execute + instances |
| 5.2 | Task Management | Doc 16 §4.5, Doc 05 "Platform Schema" | `app/services/task_service.py` — full CRUD + comments + my tasks | **COVERED** | API: `/api/v1/tasks/` — CRUD + comments + my tasks |
| 5.3 | Notification Services | Doc 16 §4.5, Doc 03 "Notification Service" | `app/services/notification_service.py` — full CRUD + preferences | **COVERED** | API: `/api/v1/notifications/` — CRUD + preferences + unread count |
| 5.4 | Calendar Services | Doc 16 §4.5, Doc 05 "Platform Schema" | `app/services/calendar_service.py` — full CRUD + upcoming events | **COVERED** | API: `/api/v1/calendar/events` — CRUD + upcoming |
| 5.5 | AI / MAP Copilot | Doc 16 §4.5, Doc 06 "AI Architecture", Doc 03 "MAP Copilot Service" | **No implementation** — `app/intelligence/` all empty placeholders | **MISSING** | Doc 16 §11.3 #5: "frontend-local, needs engine APIs". Doc 15: "AI system is entirely frontend-local" |
| 5.6 | Authentication | Doc 16 §4.5, Doc 08 "Authentication" | `app/services/auth_service.py`, `app/api/core/auth/jwt_handler.py` — JWT + bcrypt | **COVERED** | API: `/api/v1/auth/login` — JWT token generation |

### DOMAIN 6: ADMINISTRATION

| # | Capability | Architecture Ref | CLI Implementation | Status | Evidence |
|---|-----------|-----------------|-------------------|--------|----------|
| 6.1 | User Management | Doc 16 §4.6, Doc 03 "Administration Service" | `app/services/user_service.py` — full CRUD + role assignment | **COVERED** | API: `/api/v1/users/` — CRUD + role assignment |
| 6.2 | Role & Permission Management | Doc 16 §4.6, Doc 04 "Platform APIs" | `app/services/role_service.py` — full CRUD + permission assignment | **COVERED** | API: `/api/v1/roles/` — CRUD + permissions |
| 6.3 | Tenant Management | Doc 16 §4.6, Doc 05 "Core Schema" | **No implementation** — no tenant CRUD, no multi-tenant middleware | **MISSING** | Doc 16: "Proposed (No API, mock frontend)". Doc 00: "v2.1 Multi-tenancy" |
| 6.4 | System Settings | Doc 16 §4.6, Doc 04 "Platform APIs" | `app/services/settings_service.py` — category-based CRUD | **COVERED** | API: `/api/v1/settings/` — CRUD + feature flags |
| 6.5 | Feature Flags | Doc 16 §4.6, Doc 05 "Platform Schema" | `app/services/settings_service.py` — feature flag CRUD | **COVERED** | API: `/api/v1/settings/flags/` — CRUD |
| 6.6 | Security Management | Doc 16 §4.6, Doc 08 "Security Architecture" | `app/security/crypto.py` — Fernet encryption only; no full security management | **MISSING** | Doc 16: "Proposed (No API, mock frontend)". Doc 08 defines extensive security capabilities |
| 6.7 | Audit Trail | Doc 16 §4.6, Doc 15 §4.2 #11, Doc 08 "Audit Framework" | `app/api/core/middleware/audit_middleware.py` — middleware logging only | **PARTIALLY COVERED** | File-based logging, no API for querying audit events. Doc 16 §11.1 #8 confirms gap |
| 6.8 | Maintenance & Health | Doc 16 §4.6, Doc 10 "Workstream G" | `app/api/main.py` — `/health`, `/api/v1/health`, `/api/v1/ready` | **COVERED** | API: health + readiness checks |

---

## 5. Verification Summary

### 5.1 Status Counts

| Status | Count | Capabilities |
|--------|-------|-------------|
| **COVERED** | 17 | 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 3.4, 5.1, 5.2, 5.3, 5.4, 5.6, 6.1, 6.2, 6.4, 6.5, 6.8 |
| **PARTIALLY COVERED** | 9 | 1.1, 1.3, 1.4, 1.5, 3.1, 3.2, 3.3, 4.6, 6.7 |
| **MISSING** | 8 | 4.1, 4.2, 4.3, 4.4, 4.5, 5.5, 6.3, 6.6 |
| **AMBIGUOUS** | 0 | — |
| **DUPLICATE** | 0 | — |
| **Total** | **34** | — |

### 5.2 Coverage by Domain

| Domain | Covered | Partial | Missing | Total |
|--------|---------|---------|---------|-------|
| Migration Management | 1 | 4 | 0 | 5 |
| Validation Management | 5 | 0 | 0 | 5 |
| Governance & Compliance | 1 | 3 | 0 | 4 |
| Reporting & Analytics | 0 | 1 | 5 | 6 |
| Platform Services | 5 | 0 | 1 | 6 |
| Administration | 5 | 1 | 2 | 8 |
| **Total** | **17** | **9** | **8** | **34** |

### 5.3 Coverage Percentage

- **Fully Covered:** 17/34 = 50%
- **Partially Covered:** 9/34 = 26%
- **Missing:** 8/34 = 24%
- **Covered + Partially Covered:** 26/34 = 76%

---

## 6. Detailed Gap Analysis

### 6.1 MISSING Capabilities (No CLI Implementation)

| # | Capability | Architecture Source | Impact on frontend-mvp |
|---|-----------|--------------------|-----------------------|
| 4.1 | Executive Reporting | Doc 16 §4.4, Doc 07 | Cannot build executive dashboard without API |
| 4.2 | Operational Reporting | Doc 16 §4.4, Doc 07 | Cannot build operational reports without API |
| 4.3 | Governance Reporting | Doc 16 §4.4, Doc 07 | Cannot build governance reports without API |
| 4.4 | Technical Reporting | Doc 16 §4.4, Doc 07 | Cannot build technical reports without API |
| 4.5 | Dashboard Services | Doc 16 §4.4, Doc 03, Doc 07 | Cannot build dashboard widgets without API |
| 5.5 | AI / MAP Copilot | Doc 16 §4.5, Doc 06 | Cannot build AI assistant without engine APIs |
| 6.3 | Tenant Management | Doc 16 §4.6, Doc 05 | Multi-tenant UI cannot be built |
| 6.6 | Security Management | Doc 16 §4.6, Doc 08 | Security portal cannot be fully built |

### 6.2 PARTIALLY COVERED Capabilities (CLI exists, API gaps)

| # | Capability | What Exists | What's Missing |
|---|-----------|------------|---------------|
| 1.1 | Project Management | batch-level project_id | Standalone project CRUD API |
| 1.3 | Dataset Discovery | CLI `discover` command | `/api/v1/discovery` endpoints |
| 1.4 | Dataset Mapping | Auto-created during discovery | `/api/v1/mappings` CRUD API |
| 1.5 | Column Mapping | Auto-created during discovery | `/api/v1/column-mappings` CRUD API |
| 3.1 | Governance Decisions | Auto post-execution | `/api/v1/governance` API for manual actions |
| 3.2 | Risk Scoring | Auto post-execution | `/api/v1/risk` API |
| 3.3 | Release Gates | Auto-enforced | `/api/v1/release` API for manual gate management |
| 4.6 | Export Services | CLI `export` (CSV audit pack) | PDF, Excel, PNG export |
| 6.7 | Audit Trail | Middleware logging | `/api/v1/audit` API for querying events |

---

## 7. Additional Findings

### 7.1 Implementation Utilities Outside the Business Capability Model

These capabilities exist in the MAP CLI implementation but are NOT listed as business capabilities in the approved architecture:

| Capability | CLI Module | Notes |
|-----------|-----------|-------|
| Parameter Injection | `app/parameter_injector.py` | SQL template parameter replacement — internal utility |
| Config Loader | `app/config_loader.py` | YAML config with env-var expansion — internal utility |
| SafeSQL | `app/db/safe_sql.py` | Safe SQL execution wrapper — internal utility |
| Rule Isolation | `app/orchestration/execution/rule_isolation.py` | Failure containment — internal to execution |
| Metadata Intelligence | `app/services/metadata_intelligence_service.py` | Column role inference — internal to discovery |
| Multi-System Adapters | `app/db/adapters/` (8 adapters) | Postgres, MySQL, SQL Server, Snowflake, BigQuery, Oracle, Databricks — infrastructure |
| Batch Idempotency Guard | `app/execution_engine.py` | Prevents duplicate batch execution — internal |
| Execution Trace | `app/execution_engine.py` | Structured logging — internal |

These are implementation details, not business capabilities. They support the architecture capabilities but should not be treated as separate capability requirements.

### 7.2 Architecture Capabilities Not Yet in Any Implementation

| Capability | Architecture Source | Status |
|-----------|--------------------|--------|
| Data Quality Service | Doc 03 "Data Quality Service" | Not in CLI, not in API |
| Analytics Services | Doc 03 "Insights Domain" | Not in CLI, not in API |
| Presentation Engine | Doc 07 "Presentation Engine" | Not in CLI, not in API |
| Prompt Governance | Doc 06 "Prompt Governance" | Not in CLI (3 prompt .md files only) |
| AI Usage Monitoring | Doc 06 "Usage Monitoring" | Not in CLI |
| AI Cost Management | Doc 06 "Cost Management" | Not in CLI |
| AI Safety | Doc 06 "AI Safety" | Not in CLI |
| Conversation Management | Doc 06 "Conversation Management" | Not in CLI |
| Security Monitoring | Doc 08 "Security Monitoring" | Not in CLI |
| Secrets Management | Doc 08 "Secrets Management" | Not in CLI (Fernet encryption only) |
| Platform Hardening | Doc 08 "Platform Hardening" | Not in CLI |
| Compliance Framework | Doc 08 "Compliance" | Not in CLI |

### 7.3 Cross-Document Ambiguities

| # | Concept | Documents | Ambiguity |
|---|---------|-----------|-----------|
| 1 | Reporting | Doc 16 (4 capabilities), Doc 15 (1 capability) | Doc 15 collapses all reporting into one engine capability. Doc 16 has 4 separate sub-capabilities |
| 2 | Audit | Doc 16 (6.7), Doc 03 (governance domain), Doc 08 (full framework) | Doc 16 treats audit as platform capability. Doc 03 as governance service. Doc 08 has extensive framework |
| 3 | Scheduling | Doc 15 (engine capability #12), Doc 07 (reporting service) | Not listed in Doc 16. Doc 15 includes it. Doc 07 includes as part of Reporting |
| 4 | Data Quality | Doc 03 (backend service), Doc 04 (API endpoint) | Not standalone in Doc 16. Doc 03/04 define as separate service |
| 5 | Security Management | Doc 16 (minimal "Proposed"), Doc 08 (extensive architecture) | Major scope gap between Doc 16 and Doc 08 |

### 7.4 Duplicate Capability Representations

| Capability | Representations | Canonical | Notes |
|-----------|----------------|-----------|-------|
| Encryption | `app/security/crypto.py` (Fernet), `app/api/core/security/encryption.py` (Fernet), `app/api/core/encryption_manager.py` (Fernet) | `app/security/crypto.py` | 3 separate encryption implementations |
| Navigation Config | `src/navigation/navigation.config.ts`, `src/config/navigation.ts`, `src/portal/metadata/PortalMetadata.ts` | `src/navigation/navigation.config.ts` | 3 navigation definitions |
| Auth Pages | `src/authentication/pages/`, `src/pages/authentication/` | `src/authentication/pages/` | 5 duplicate pages |
| Layout Components | `src/layout/`, `src/components/layout/` | `src/layout/` | 7 duplicate components |
| AI Widgets | `src/ai/widgets/`, `src/components/widgets/ai/` | `src/ai/widgets/` | 3 duplicate widgets |

---

## 8. Potential Policy Gaps Identified During Implementation Verification

The policy gaps identified here are preliminary implementation observations. Verified Policy Gaps are recorded in the approved Phase 3.5 Architecture Verification Report.

| # | Gap | Source | Impact |
|---|-----|--------|--------|
| PG-1 | No approved metadata contract exists for runtime generation | Execution Plan §Phase 3.5 | Phase 4 cannot proceed until resolved |
| PG-2 | No approved navigation contract (3 competing navigation systems) | Phase 1 inventory | frontend-mvp cannot determine navigation source |
| PG-3 | Reporting capabilities (4.1-4.5) have no API implementation | Doc 16 §11.1 #7 | Dashboard/reporting frontend cannot be built |
| PG-4 | AI/ML capabilities (5.5) have no engine implementation | Doc 16 §11.3 #5 | AI assistant frontend cannot connect to backend |
| PG-5 | Tenant Management (6.3) is "Proposed" with no implementation plan | Doc 16, Doc 00 | Multi-tenant UI is aspirational only |
| PG-6 | Security Management (6.6) scope gap between Doc 16 and Doc 08 | Doc 16 §4.6 vs Doc 08 | Unclear which security capabilities to implement |

---

## 9. Summary

The capability verification identified the implementation gaps summarised in Section 6. Resolution of architecture policy questions is addressed separately in the approved Phase 3.5 Architecture Verification Report.

---

## 10. Phase 2 Gate

**Recommendation:** PROCEED to Phase 3

**Findings:**
- 34 business capabilities verified against MAP CLI implementation
- 17 fully covered (50%)
- 9 partially covered (26%)
- 8 missing (24%)
- 0 ambiguous
- 0 duplicates at capability level (5 duplicate component sets found in Phase 1)
- 6 policy gaps discovered
- 12 architecture capabilities not yet in any implementation (from supporting docs)

**STOP. Do not continue to the next phase. Produce the report, wait for user approval, and only proceed after explicit approval.**
