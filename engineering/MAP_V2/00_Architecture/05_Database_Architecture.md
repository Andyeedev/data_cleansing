# MAP Nexus™ Enterprise Platform

## Database Architecture

**Version:** 2.0

**Document:** 05_Database_Architecture.md

**Status:** Draft 1.0

**Classification:** Internal Architecture

---

# Purpose

This document defines the enterprise database architecture for the MAP Nexus™ Enterprise Platform.

The database provides the authoritative repository for all operational, governance, reporting and administrative information used by MAP.

The database architecture is designed for enterprise scalability, integrity, auditability and future multi-tenant deployment.

---

# Database Vision

MAP maintains a single enterprise PostgreSQL repository organised into logical schemas.

Each schema represents a distinct business capability while remaining part of one integrated enterprise data platform.

This approach ensures:

• Single source of truth

• Simplified administration

• Strong transactional consistency

• Efficient reporting

• Enterprise scalability

---

# Architectural Principles

The repository follows these principles.

## Single Enterprise Repository

MAP maintains one enterprise database.

Business separation is achieved through schemas rather than multiple databases.

---

## Business-Oriented Design

The database is organised according to business domains rather than applications.

---

## Referential Integrity

Relationships are enforced through foreign keys wherever appropriate.

No orphaned business records shall exist.

---

## Auditability

Every business transaction must be traceable.

Audit history is immutable.

---

## Extensibility

The schema shall support future modules without redesign.

---

# Enterprise Data Model

The database is divided into four logical categories.

---

## Operational Data

Stores migration execution information.

Includes:

Migration Programmes

Migration Runs

Validation Results

Exceptions

Data Quality Results

Processing Status

---

## Reference Data

Stores reusable platform information.

Includes:

Validation Rules

Lookup Tables

Reference Codes

Industry Templates

Configuration

Rule Libraries

---

## Analytical Data

Supports dashboards and reporting.

Includes:

Executive KPIs

Readiness Scores

Trend Data

Risk Metrics

Historical Reporting

Aggregated Views

---

## System Data

Supports platform operation.

Includes:

Users

Roles

Permissions

Audit

Application Logs

Notifications

Licensing (future)

---

# Schema Organisation

The database uses a 5-schema model aligned with 12_Platform_Integration_Architecture.md.

```
PostgreSQL: migration_engine

├── core          ← What we migrate (metadata, connections, datasets, mappings)
├── engine        ← How we execute (batch, controls, rules, governance, scoring)
├── reporting     ← Results (dimensions, report templates, scheduling, export history)
├── platform      ← MAP V2 features (users, roles, workflows, tasks, notifications, calendar, settings)
└── audit         ← Immutable history (audit events, security events, login history, API logs)
```

---

# Core Schema

Stores migration metadata and reference information.

Primary entities include:

Projects

Systems (Source/Target)

Datasets

Dataset Columns

Column Mappings

Table Matches

Schema Diffs

System Credentials

Tenants

---

# Engine Schema

Stores execution and governance information.

Primary entities include:

Migration Batch Registry

Batch Execution Checkpoints

Control Execution

Governance Configuration

Rule Registry

Rule Weights

Migration Control Exceptions

Migration Governance Status

Migration Release Decision

Scoring (Unified, Summary, Details)

---

# Reporting Schema

Supports report generation and dashboard display.

Primary entities include:

Dimension Tables (Date, Severity, Status)

Dashboards

Reports

Report Templates

Scheduled Reports

Export History

---

# Platform Schema

Stores everything created by MAP V2.

Primary entities include:

Users

Roles

Permissions

User Roles

Role Permissions

Refresh Tokens

User Sessions

Workflow Definitions

Workflow Instances

Workflow Steps

Approval Templates

Approval Requests

Tasks

Task Comments

Task Dependencies

Notifications

Notification Preferences

Calendar Events

System Settings

Feature Flags

Plans

Subscriptions

---

# Audit Schema

Stores immutable history for security and compliance.

Primary entities include:

Audit Events

Security Events

Login History

API Logs

Configuration History

All audit records are append-only and immutable.

---

# Repository Relationships

Business flow:

```
Organisation

↓

Migration

↓

Validation

↓

Issues

↓

Risk

↓

Reporting

↓

Executive Dashboard
```

Every business object ultimately contributes to executive reporting.

---

# Data Lifecycle

Information flows through defined stages.

```
Source Data

↓

Validation

↓

Governance

↓

Reporting

↓

Archive
```

Archived information remains available for audit.

---

# Data Integrity

The repository enforces:

Primary Keys

Foreign Keys

Unique Constraints

Check Constraints

Transactions

Optimistic Concurrency where appropriate.

---

# Performance Strategy

Performance is achieved through:

Indexes

Partitioning (future)

Materialised Views

Query Optimisation

Read-only Reporting Views

Connection Pooling

---

# Backup Strategy

Supports:

Point-in-time recovery

Daily backups

Geo-redundant storage

Azure Backup integration

Disaster recovery

---

# Security

Database security includes:

Encryption at rest

Encrypted connections

Role-based database access

Least privilege

Audit logging

No direct Portal access

The Portal accesses data only through backend services.

---

# Multi-Tenant Strategy

Version 2 supports future multi-tenancy.

Approach:

Tenant_ID included within business entities.

Future deployment options:

Shared Database

Shared Schema

Dedicated Schema

Dedicated Database

Architecture remains flexible.

---

# Data Retention

Business data retention policies include:

Operational Data

Configurable

Audit Data

Permanent

Reports

Configurable

Logs

Rolling retention

---

# Future Enhancements

Data Warehouse

Azure Synapse integration

Power BI semantic models

Data Lake integration

Machine Learning features

Cross-region replication

---

# Success Criteria

The database architecture is complete when:

• Business schemas are defined.

• Data ownership is established.

• Relationships are documented.

• Security model is defined.

• Audit strategy is complete.

• Multi-tenant roadmap is established.

---

# Related Documents

00_Master_Roadmap.md

01_Product_Architecture.md

02_Portal_Architecture.md

03_Backend_Architecture.md

04_API_Architecture.md

06_AI_Architecture.md

07_Reporting_Architecture.md

08_Security_Architecture.md

09_Deployment_Architecture.md

10_Implementation_Roadmap.md