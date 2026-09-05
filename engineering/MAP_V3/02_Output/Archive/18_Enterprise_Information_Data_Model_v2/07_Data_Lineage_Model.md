# Data Lineage Model

**Document ID:** 18-07  
**Version:** 2.0  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document defines the data lineage for the MAP Nexus platform. It tracks data from source through transformation to consumption, reporting, and governance.

---

## 2. Lineage Architecture

### 2.1 Lineage Direction

| Direction | Description | Evidence |
|-----------|-------------|----------|
| Source to Target | Database tables discovered and mapped | core.dataset_mappings |
| Transformation | Rules and controls applied | engine.rule_registry, engine.control_registry |
| Storage | Results stored in engine tables | engine.migration_control_summary |
| Consumption | Views and reports consume data | reporting views |
| Governance | Governance decisions recorded | engine.migration_governance_status |

---

## 3. Major Data Lineages

### 3.1 Migration Data Lineage

```
┌─────────────────────────────────────────────────────────────────┐
│                    Migration Data Lineage                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Source Database]                                              │
│       │                                                         │
│       ▼                                                         │
│  core.system_registry (connection metadata)                     │
│       │                                                         │
│       ▼                                                         │
│  core.datasets (discovered tables)                              │
│       │                                                         │
│       ├──► core.dataset_columns (discovered columns)            │
│       │                                                         │
│       ├──► core.dataset_mappings (table mappings)               │
│       │         │                                               │
│       │         └──► core.column_mappings (column mappings)     │
│       │                                                         │
│       ▼                                                         │
│  engine.rule_registry (validation rules)                        │
│       │                                                         │
│       ▼                                                         │
│  engine.migration_validation_batch (execution)                  │
│       │                                                         │
│       ├──► engine.migration_control_execution (control results) │
│       │                                                         │
│       ├──► engine.migration_control_summary (summaries)         │
│       │                                                         │
│       └──► engine.migration_exception_register (exceptions)     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Origin:** Source databases (via connection)  
**Consumers:** Migration Engineers, Programme Manager  
**Transformations:** Discovery, Mapping, Validation  
**Refresh:** On-demand (per batch execution)  
**Dependencies:** Connection, Dataset, Mapping  
**Evidence:** core.*, engine.* tables

---

### 3.2 Governance Data Lineage

```
┌─────────────────────────────────────────────────────────────────┐
│                    Governance Data Lineage                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Validation Results]                                           │
│       │                                                         │
│       ▼                                                         │
│  engine.migration_control_summary                               │
│       │                                                         │
│       ▼                                                         │
│  app.governance.decision_engine                                 │
│       │                                                         │
│       ├──► engine.migration_governance_status (decisions)       │
│       │                                                         │
│       └──► engine.migration_risk_scores (risk scores)           │
│               │                                                 │
│               ▼                                                 │
│  engine.migration_release_decision (release approval)           │
│       │                                                         │
│       ▼                                                         │
│  platform.approval_requests (approval workflow)                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Origin:** Validation batch results  
**Consumers:** Governance Officers, Programme Manager  
**Transformations:** Risk scoring, decision making  
**Refresh:** Post-execution  
**Dependencies:** Batch, Control Summary  
**Evidence:** engine.migration_governance_status, engine.migration_risk_scores

---

### 3.3 Reporting Data Lineage

```
┌─────────────────────────────────────────────────────────────────┐
│                    Reporting Data Lineage                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Engine Tables]                                                │
│       │                                                         │
│       ▼                                                         │
│  engine.v_migration_executive_summary (view)                    │
│       │                                                         │
│       ▼                                                         │
│  [Frontend Dashboard] (mock data)                               │
│                                                                 │
│  [Engine Tables]                                                │
│       │                                                         │
│       ▼                                                         │
│  engine.v_migration_control_summary (view)                      │
│       │                                                         │
│       ▼                                                         │
│  [Frontend Dashboard] (mock data)                               │
│                                                                 │
│  [Engine Tables]                                                │
│       │                                                         │
│       ▼                                                         │
│  reporting.v_fact_batch (view)                                  │
│       │                                                         │
│       ▼                                                         │
│  [Frontend Dashboard] (mock data)                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Origin:** Engine tables  
**Consumers:** Programme Sponsor, All Users  
**Transformations:** SQL views aggregate data  
**Refresh:** On-demand (view query)  
**Dependencies:** Engine tables  
**Evidence:** engine views, reporting views

---

### 3.4 Audit Data Lineage

```
┌─────────────────────────────────────────────────────────────────┐
│                    Audit Data Lineage                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [API Calls]                                                    │
│       │                                                         │
│       ▼                                                         │
│  audit_middleware (capture)                                      │
│       │                                                         │
│       ├──► audit.audit_events (audit trail)                     │
│       │                                                         │
│       └──► audit.api_logs (API call details)                    │
│                                                                 │
│  [Security Events]                                              │
│       │                                                         │
│       ▼                                                         │
│  audit.security_events (security trail)                         │
│                                                                 │
│  [Login Attempts]                                               │
│       │                                                         │
│       ▼                                                         │
│  audit.login_history (login trail)                              │
│                                                                 │
│  [Config Changes]                                               │
│       │                                                         │
│       ▼                                                         │
│  audit.configuration_history (config trail)                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Origin:** All API calls, security events, logins, config changes  
**Consumers:** Security Officers, Auditors  
**Transformations:** None (append-only logging)  
**Refresh:** Real-time (every API call)  
**Dependencies:** All platform activity  
**Evidence:** audit schema tables

---

## 4. Lineage Gaps

| # | Gap | Impact | Evidence | Recommendation |
|---|-----|--------|----------|----------------|
| 1 | No formal lineage metadata | High | No lineage tables | Create lineage_metadata table |
| 2 | No transformation tracking | High | Rules exist but lineage not captured | Add transformation lineage |
| 3 | No impact analysis | Medium | No dependency tracking | Implement impact analysis |
| 4 | No data flow documentation | Medium | No flow diagrams | Create data flow diagrams |
| 5 | Lineage not captured in views | Medium | Views exist but lineage missing | Add lineage to view definitions |

---

## 5. Lineage Summary

| Lineage | Sources | Transformations | Targets | Refresh | Evidence |
|---------|---------|-----------------|---------|---------|----------|
| Migration | Source DB | Discovery, Mapping, Validation | Engine tables | On-demand | core.*, engine.* |
| Governance | Validation results | Risk scoring, Decision | Governance tables | Post-execution | engine.migration_governance_status |
| Reporting | Engine tables | SQL views | Dashboard (mock) | On-demand | engine views, reporting views |
| Audit | API calls, Events | None (append-only) | Audit tables | Real-time | audit.* |

---

## 6. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This data lineage model is part of the Enterprise Information & Data Model (Prompt 18). All findings are based on source code analysis — no code was modified.*
