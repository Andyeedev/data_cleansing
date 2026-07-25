# MAP Nexus Enterprise Platform — Enterprise Functional Traceability Architecture

**Document ID:** 15  
**Version:** 1.0  
**Date:** 14 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document establishes the **Enterprise Functional Traceability Architecture** for the MAP Nexus platform. It defines how the three independent systems — Python Migration Validation Engine, React Frontend, and PostgreSQL Database — must be traced, mapped, and aligned to ensure the frontend functions as a true presentation layer for the migration engine.

---

## 2. Scope

| In Scope | Out of Scope |
|----------|-------------|
| Python Migration Validation Engine (14 capabilities) | Code implementation |
| React Frontend (134 pages, 9 portals) | API development |
| PostgreSQL Database (6 schemas, 69 tables) | Database schema changes |
| FastAPI Backend (72+ endpoints) | Refactoring |
| Frontend-to-Backend traceability | New feature development |

---

## 3. Architecture Principles

### Principle 1: Migration-First
The Python Migration Validation Engine is the **primary business system**. Every frontend capability must trace back to an existing engine capability.

### Principle 2: Presentation Layer
The React frontend is a **presentation layer**, not an independent application. It must not contain business logic that duplicates engine functionality.

### Principle 3: Single Source of Truth
Database tables in `core` and `engine` schemas are the single source of truth for migration data. Platform tables in `platform` schema handle application concerns only.

### Principle 4: Traceability Required
Every frontend page must have a documented trace to: API Endpoint → Service → Python Module → Database Table.

---

## 4. System Architecture

### 4.1 Three-System Model

```
┌─────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                       │
│              (MAP_V2 — Presentation Layer)              │
│         17 menus, 103+ submenus, 9 portals             │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND                       │
│              (app/api/ — API Gateway)                   │
│            72+ endpoints, 12 route groups               │
└──────────────────────┬──────────────────────────────────┘
                       │ SQL (psycopg2)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                 PYTHON MIGRATION ENGINE                  │
│        (app/ — Primary Business System)                 │
│         14 capabilities, 6-step pipeline                │
└──────────────────────┬──────────────────────────────────┘
                       │ SQL
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   POSTGRESQL                            │
│           (migration_engine — Data Layer)               │
│       6 schemas, 69 tables, 5 views                    │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Python Engine Capabilities

| # | Capability | Module | API Status |
|---|-----------|--------|------------|
| 1 | Project Management | app.execution_engine | Partial |
| 2 | Connection Management | app.db.connection_resolver | YES (CRUD) |
| 3 | Dataset Discovery | app.discovery.auto_rule_discovery | No (CLI) |
| 4 | Dataset Mappings | app.services.mapping_resolver | No (auto) |
| 5 | Column Mappings | app.services.dataset_discovery_service | No |
| 6 | Rule Discovery | app.discovery.auto_rule_discovery | No (auto) |
| 7 | Control Discovery | app.execution.control_executor | No |
| 8 | Validation Execution | app.execution_engine | YES (trigger) |
| 9 | Governance Decisions | app.governance.decision_engine | No (auto) |
| 10 | Reporting | app.audit_export | No (SQL views) |
| 11 | Audit Trail | audit_middleware | No (middleware) |
| 12 | Scheduling | execution_engine (DAG) | No (config) |
| 13 | Retry Engine | rule_retry_manager | No (auto) |
| 14 | Checkpointing | execution_engine | No (auto) |

### 4.3 Database Schemas

| Schema | Tables | Owner | Purpose |
|--------|--------|-------|---------|
| core | 8 | Shared | Migration metadata, connections, mappings |
| engine | 22 | Python Engine | Execution, governance, intelligence |
| platform | 22 | Platform | Users, roles, workflows, tasks |
| reporting | 3 + 5 views | Reporting | BI dimensions and fact views |
| audit | 5 | Audit | Append-only audit trail |
| engine_v14 | 10 | Deprecated | Legacy backup |

---

## 5. Traceability Framework

### 5.1 Traceability Matrix Structure

Every frontend page must be documented with:

| Field | Description |
|-------|-------------|
| Frontend Menu | Navigation path |
| React Component | Component file path |
| API Endpoint | Backend API called |
| Service | Service class handling request |
| Python Module | Engine module (if connected) |
| Schema | Database schema used |
| Tables | Database tables accessed |
| Business Capability | Engine capability traced |
| Status | Aligned / Partial / Missing / Duplicate / Unknown |

### 5.2 Status Definitions

| Status | Definition |
|--------|-----------|
| **Aligned** | Frontend correctly traces to working backend API and engine capability |
| **Partial** | Frontend has some backend but incomplete integration |
| **Missing** | Frontend displays mock data, no backend connection |
| **Duplicate** | Multiple pages exist for same capability |
| **Unknown** | Page has no identifiable business logic |

---

## 6. Current State Assessment

### 6.1 Traceability Summary

| Status | Count | Percentage |
|--------|-------|------------|
| Aligned | 9 | 7% |
| Partial | 10 | 7% |
| Missing | 111 | 83% |
| Duplicate | 2 | 1% |
| Unknown | 2 | 1% |
| **Total** | **134** | **100%** |

### 6.2 Coverage by Portal

| Portal | Pages | Aligned | Partial | Missing | Coverage |
|--------|-------|---------|---------|---------|----------|
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

### 6.3 Architecture Verdict

**The frontend is PLATFORM-FIRST, not migration-first.**

Evidence:
- 111 of 134 pages (83%) display mock data
- Only 2 of 14 engine capabilities have full CRUD APIs
- Task Management, Workflow, Approvals, Calendar, Notifications are platform-only
- Reports, Governance, Operations portals have zero engine integration
- AI system is entirely frontend-local

---

## 7. Gap Analysis

### 7.1 Frontend Gaps (98 pages need backend)

| Priority | Portal | Pages | Needed Backend |
|----------|--------|-------|----------------|
| HIGH | Reports | 12 | SQL views (engine.v_*) |
| HIGH | Governance | 9 | New /api/v1/governance endpoints |
| HIGH | Operations | 8 | Execution status APIs |
| MEDIUM | Security | 15 | Audit events, security tables |
| MEDIUM | Administration | 17 | Platform settings APIs |
| MEDIUM | AI | 4 | Python engine AI service |
| LOW | Report Centre | 16 | Report metadata APIs |
| LOW | Report Scheduler | 12 | Schedule management APIs |
| LOW | Report Distribution | 13 | Distribution channel APIs |

### 7.2 Backend Gaps (10 capabilities need frontend)

| Priority | Capability | Module | Frontend Need |
|----------|-----------|--------|---------------|
| HIGH | Dataset Discovery | app.discovery | New page in Migration portal |
| HIGH | Governance Decisions | app.governance | Wire to Governance portal |
| HIGH | Reporting (SQL Views) | app.audit_export | Wire to Reports portal |
| MEDIUM | Column Mappings | dataset_discovery_service | New editor page |
| MEDIUM | Rule Discovery | auto_rule_discovery | New review page |
| MEDIUM | Control Discovery | control_executor | New controls page |
| MEDIUM | Audit Trail | audit_middleware | Wire to Security > Audit Logs |
| LOW | Scheduling | execution_engine | Expose status only |
| LOW | Retry Engine | rule_retry_manager | Expose status only |
| LOW | Checkpointing | execution_engine | Expose status only |

---

## 8. Recommended Target State

### 8.1 Target Menu Structure

| # | Menu | Submenus | Backend Required |
|---|------|----------|-----------------|
| 1 | Home | Dashboard | /api/v1/execution/status |
| 2 | Migration | Projects, Discovery, Mappings, Column Mappings, Execution, History, Reports, Workspace | Multiple APIs |
| 3 | Validation | Rules, Rule Discovery, Results, Queue, Controls | Multiple APIs |
| 4 | Governance | Overview, Compliance, Controls, Exceptions, Risk, Audit, Approvals | Multiple APIs |
| 5 | Reports | Executive, Operational, Migration, Validation, Governance, Audit, Templates, Distribution | SQL views |
| 6 | Operations | Monitoring, Alerts, Schedules, Retry, Health | Multiple APIs |
| 7 | Administration | Users, Roles, Tenants, Settings, Feature Flags, Security, Notifications, Maintenance | Platform APIs |
| 8 | Tasks | Dashboard, My Tasks, Workflows, Calendar, Notifications | Platform APIs |

### 8.2 Target Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Top-Level Menus | 17 | 8 |
| Submenus | 103+ | ~60 |
| Pages | 134 | ~70 |
| Pages with Backend | 19 (14%) | 70 (100%) |
| Pages with Mock Data | 98 (73%) | 0 (0%) |

---

## 9. Implementation Roadmap

### Phase 1: Quick Wins (Weeks 1-2)
- Wire Reports portal to SQL views (12 pages)
- Wire Operations > Executions to execution API (1 page)
- Wire Security > Audit Logs to audit table (1 page)

### Phase 2: Governance & Discovery (Weeks 3-6)
- Create /api/v1/governance endpoints (9 pages)
- Create /api/v1/discovery endpoints + frontend (3 pages)
- Create /api/v1/controls endpoints + frontend (2 pages)
- Create /api/v1/column-mappings endpoints + frontend (2 pages)

### Phase 3: Consolidation (Weeks 7-10)
- Merge Reports + Report Centre + Scheduler + Distribution (41 → 8 pages)
- Merge Risk into Governance (4 → 0 pages)
- Merge AI into Reports/Operations (4 → 0 pages)
- Reduce Security from 15 to 6 pages
- Reduce Administration from 17 to 8 pages

### Phase 4: Mock Data Replacement (Weeks 11-14)
- Replace all remaining mock data hooks
- Remove placeholder pages
- Final navigation cleanup

### Phase 5: Polish & Testing (Weeks 15-16)
- End-to-end testing
- Performance optimization
- Documentation update

---

## 10. Supporting Documentation

The following reports provide detailed analysis supporting this architecture standard:

| # | Report | Location |
|---|--------|----------|
| 01 | Executive Summary | 02_Output/15_Enterprise_Functional_Traceability_Architecture/01_Executive_Summary.md |
| 02 | Enterprise Functional Traceability Report | 02_Output/15_Enterprise_Functional_Traceability_Architecture/02_Enterprise_Functional_Traceability_Report.md |
| 03 | Frontend-Backend Mapping | 02_Output/15_Enterprise_Functional_Traceability_Architecture/03_Frontend_Backend_Mapping.md |
| 04 | Database Ownership Report | 02_Output/15_Enterprise_Functional_Traceability_Architecture/04_Database_Ownership_Report.md |
| 05 | Business Capability Catalogue | 02_Output/15_Enterprise_Functional_Traceability_Architecture/05_Business_Capability_Catalogue.md |
| 06 | API Service Mapping | 02_Output/15_Enterprise_Functional_Traceability_Architecture/06_API_Service_Mapping.md |
| 07 | Frontend Gap Analysis | 02_Output/15_Enterprise_Functional_Traceability_Architecture/07_Frontend_Gap_Analysis.md |
| 08 | Backend Gap Analysis | 02_Output/15_Enterprise_Functional_Traceability_Architecture/08_Backend_Gap_Analysis.md |
| 09 | Enterprise Functional Traceability Matrix | 02_Output/15_Enterprise_Functional_Traceability_Architecture/09_Enterprise_Functional_Traceability_Matrix.md |
| 10 | Recommended Frontend Reorganisation | 02_Output/15_Enterprise_Functional_Traceability_Architecture/10_Recommended_Frontend_Reorganisation.md |

---

## 11. Governance

### 11.1 Promotion Rules
- This document is promoted to `00_Architecture/` after engineering review and explicit user approval
- Supporting reports remain in `02_Output/` as engineering documentation
- Only one approved architecture document shall exist for each architectural subject

### 11.2 Amendment Process
- Changes to this document require engineering review
- Amendments must preserve traceability to supporting reports
- Version number increments on each approved change

---

## 12. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This document is part of the MAP Nexus Enterprise Architecture framework. It establishes the traceability standard that all future MAP development must follow.*
