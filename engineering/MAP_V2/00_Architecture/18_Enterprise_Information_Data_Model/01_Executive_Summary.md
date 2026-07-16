# 01_Executive_Summary.md

## Purpose

This document provides a complete technical reference describing the **current implemented Enterprise Information & Data Model** for the MAP Nexus platform. It documents only what physically exists in the repository, supported by evidence from SQL DDL files, ORM models, and database schemas.

## Scope

- **Database:** PostgreSQL 17.4 (`migration_engine`)
- **Schemas:** 5 active schemas (core, engine, reporting, platform, audit)
- **Source Evidence:** SQL DDL files, backup dumps, migration scripts, application code

## Schemas Discovered

| Schema | Purpose | Status |
|--------|---------|--------|
| `core` | Tenant, project, system, dataset, and mapping management | Implemented |
| `engine` | Validation execution, controls, rules, governance intelligence | Implemented |
| `engine_v14` | Legacy v1.4 schema (historical reference) | Implemented |
| `reporting` | Dimension tables and reporting views | Implemented |
| `platform` | User management, RBAC, workflows, approvals, tasks, notifications | Implemented |
| `audit` | Audit events, security events, login history, API logs | Implemented |

## Total Counts

| Object Type | Count |
|-------------|-------|
| **Schemas** | 6 |
| **Tables** | 62 |
| **Views** | 9 |
| **Materialized Views** | 0 |
| **Functions** | 3 |
| **Triggers** | 8 |
| **Sequences** | 15 |
| **Indexes** | 71 |
| **Foreign Keys** | 28 |
| **Check Constraints** | 6 |
| **Unique Constraints** | 2 |

## Table Inventory by Schema

| Schema | Active Tables | Legacy/Old Tables |
|--------|---------------|-------------------|
| `core` | 7 | 0 |
| `engine` | 15 | 6 |
| `engine_v14` | 7 | 0 |
| `reporting` | 3 | 0 |
| `platform` | 20 | 0 |
| `audit` | 5 | 0 |
| **Total** | **57** | **6** |

## Lookup Tables

| Table | Schema | Purpose |
|-------|--------|---------|
| `dim_date` | reporting | Date dimension for time-based reporting |
| `dim_severity` | reporting | Severity level reference (CRITICAL, HIGH, MEDIUM, LOW) |
| `dim_status` | reporting | Status category reference |
| `control_registry` | engine | Validation control definitions (C01-C03) |
| `rule_registry` | engine | Validation rule definitions |
| `governance_config` | engine | Governance intelligence configuration |
| `roles` | platform | System and custom role definitions |
| `permissions` | platform | Permission definitions (resource + action) |
| `system_settings` | platform | Platform configuration key-value pairs |
| `feature_flags` | platform | Feature toggle definitions |

## Major Observations

1. **Three-System Architecture:** The database supports three independent systems: Python Migration Validation Engine (primary business), React Frontend (presentation), PostgreSQL (data).

2. **Multi-Tenant Design:** Core tables include `tenant_id` for multi-tenant isolation, with row-level security policies.

3. **Governance Intelligence:** The engine schema contains sophisticated anomaly detection with Z-score analysis, risk heat indexing, and repeat failure tracking.

4. **Legacy Schema:** `engine_v14` preserves the v1.4 schema structure for backward compatibility.

5. **No Materialized Views:** All reporting is done through standard views.

6. **Append-Only Audit:** Audit tables are designed as append-only and immutable.

7. **RBAC Implementation:** Full role-based access control with roles, permissions, and role-permission mappings.

8. **Workflow Engine:** Complete workflow management with definitions, instances, step instances, and history tracking.

---

**Version:** 2.1

**Status:** Current State Documentation
