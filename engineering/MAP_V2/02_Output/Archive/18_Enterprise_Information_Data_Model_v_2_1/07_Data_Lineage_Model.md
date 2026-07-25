# Data Lineage Model

**Document ID:** 18-07  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document defines the data lineage for the MAP Nexus platform. It tracks data from source through transformation to consumption.

---

## 2. Current State

### 2.1 Existing Lineage Capability

| Capability | Status | Evidence |
|------------|--------|----------|
| Source lineage | Partial | core.dataset_mappings tracks source-to-target table mappings |
| Transformation lineage | Partial | core.column_mappings tracks column transformations |
| Validation lineage | Partial | engine.migration_control_execution tracks rule execution |
| Reporting lineage | None | Views exist but lineage not captured |
| Audit lineage | Partial | audit.audit_events logs API calls |

### 2.2 Current Lineage Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Current State Lineage                        │
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
│       └──► engine.migration_control_summary (summaries)         │
│                                                                 │
│  [No formal lineage metadata]                                   │
│  [No transformation tracking]                                   │
│  [No impact analysis]                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Current Lineage Gaps

| # | Gap | Impact | Evidence |
|---|-----|--------|----------|
| 1 | No formal lineage metadata | High | No lineage tables |
| 2 | No transformation tracking | High | Rules exist but lineage not captured |
| 3 | No impact analysis | Medium | No dependency tracking |
| 4 | No data flow documentation | Medium | No flow diagrams |

---

## 3. Target State

### 3.1 Target Lineage Capability

| Capability | Status | Enhancement |
|------------|--------|-------------|
| Source lineage | Target State | Automated source-to-target tracking |
| Transformation lineage | Target State | Automated transformation capture |
| Validation lineage | Target State | End-to-end validation lineage |
| Reporting lineage | Target State | View-to-source lineage |
| Audit lineage | Target State | Complete audit trail lineage |

### 3.2 Target Lineage Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Target State Lineage                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Source Database]                                              │
│       │                                                         │
│       ▼                                                         │
│  lineage.source_metadata (Target State)                         │
│       │                                                         │
│       ▼                                                         │
│  lineage.transformations (Target State)                         │
│       │                                                         │
│       ▼                                                         │
│  lineage.validation_results (Target State)                      │
│       │                                                         │
│       ▼                                                         │
│  lineage.reporting_views (Target State)                         │
│       │                                                         │
│       ▼                                                         │
│  lineage.audit_trail (Target State)                             │
│                                                                 │
│  [Automated lineage capture]                                    │
│  [End-to-end impact analysis]                                   │
│  [Real-time lineage updates]                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Target Lineage Enhancements

| # | Enhancement | Impact | Dependencies |
|---|-------------|--------|--------------|
| 1 | Create lineage metadata tables | High | None |
| 2 | Implement automated lineage capture | High | Lineage tables |
| 3 | Implement impact analysis | Medium | Lineage tables |
| 4 | Create data flow documentation | Medium | Lineage tables |
| 5 | Implement real-time lineage | Medium | Lineage tables |

---

## 4. Lineage Summary

| Lineage | Current State | Target State | Refresh |
|---------|---------------|--------------|---------|
| Migration | Partial (manual mapping) | Automated | On-demand |
| Governance | Partial (decision tracking) | Automated | Post-execution |
| Reporting | None (views only) | Automated | Real-time |
| Audit | Partial (middleware logging) | Automated | Real-time |

---

## 5. Lineage Maturity Roadmap

| Phase | Duration | Focus | Maturity |
|-------|----------|-------|----------|
| Phase 1 | 0-3 Months | Foundation | 1→2 |
| Phase 2 | 3-12 Months | Metadata & Lineage | 2→3 |
| Phase 3 | 12-24 Months | Governance | 3→4 |

---

## 6. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This data lineage model is part of the Enterprise Information & Data Model (Prompt 18 v2.1). All findings are based on source code analysis — no code was modified.*
