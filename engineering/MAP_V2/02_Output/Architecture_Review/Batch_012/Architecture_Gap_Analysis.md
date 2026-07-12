# MAP Nexus Enterprise Platform
## Architecture Gap Analysis

**Version:** 1.0
**Date:** 2026-07-12
**Status:** Complete

---

## Executive Summary

The architecture review identified 7 gaps between the current architecture documents and the existing implementation. All gaps have been resolved through the adoption of a 5-schema model.

---

## Gap Analysis

### Gap 1: Schema Model Mismatch

**Current State:**
- 05_Database_Architecture.md defines 7 schemas
- 12_Platform_Integration_Architecture.md defines 3 schemas
- Actual database uses core + engine + reporting

**Target State:**
- 5-schema model: core, engine, reporting, platform, audit

**Resolution:**
- Update 05_Database_Architecture.md to reflect 5-schema model
- Create platform and audit schemas in migration_engine

---

### Gap 2: Database Target

**Current State:**
- .env references map_nexus
- Architecture mandates migration_engine

**Target State:**
- All SQL targets migration_engine
- No new database created

**Resolution:**
- Update all SQL scripts to target migration_engine
- Create platform and audit schemas within migration_engine

---

### Gap 3: Backend Location

**Current State:**
- MAP_V2/03_Source/backend/main.py is empty shell
- app/api/main.py has working FastAPI with 4 routers

**Target State:**
- app/api/main.py is the single FastAPI entry point
- New routes added to app/api/routes/

**Resolution:**
- Extend app/api/main.py with new routers
- Add new routes to app/api/routes/
- Add new services to app/services/

---

### Gap 4: Audit Architecture

**Current State:**
- No audit tables exist
- Security Architecture requires immutable audit records

**Target State:**
- Dedicated audit schema
- Immutable audit events, security events, login history, API logs

**Resolution:**
- Create audit schema in migration_engine
- Implement append-only audit tables

---

### Gap 5: Configuration Management

**Current State:**
- No system_settings or feature_flags tables
- Deployment Architecture requires externalised configuration

**Target State:**
- System settings in platform schema
- Feature flags for progressive rollout

**Resolution:**
- Create platform.system_settings
- Create platform.feature_flags

---

### Gap 6: Workflow Capabilities

**Current State:**
- No workflow tables exist
- Backend Architecture defines workflow engine as future capability

**Target State:**
- Workflow definitions, instances, steps, history
- Approval templates, requests, step instances

**Resolution:**
- Create platform.workflow_* tables
- Implement workflow routes and services

---

### Gap 7: Reporting Scope

**Current State:**
- reporting schema has only 3 dimension tables
- Reporting Architecture defines report templates, scheduling, export history

**Target State:**
- Full reporting schema with templates, scheduling, export history

**Resolution:**
- Extend reporting schema with report templates
- Add scheduled reports and export history

---

## Implementation Priority

| Priority | Gap | Action |
|----------|-----|--------|
| 1 | Database Target | Create platform + audit schemas in migration_engine |
| 2 | Schema Model | Update 05_Database_Architecture.md |
| 3 | Backend Location | Extend app/api/ with new routes |
| 4 | Audit Architecture | Create audit schema |
| 5 | Configuration | Create platform.system_settings |
| 6 | Workflow | Create platform.workflow_* tables |
| 7 | Reporting | Extend reporting schema |
