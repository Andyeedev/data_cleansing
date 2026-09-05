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

```
PostgreSQL

├── operational

├── governance

├── reporting

├── administration

├── configuration

├── audit

└── analytics
```

---

# Operational Schema

Stores migration processing information.

Primary entities include:

Migration

Migration_Run

Validation_Result

Validation_Exception

Source_System

Target_System

Execution_Status

---

# Governance Schema

Stores governance information.

Primary entities include:

Issue

Risk

Approval

Exception

Compliance_Record

Governance_Action

---

# Reporting Schema

Supports report generation.

Primary entities include:

Dashboard

Report

Report_Template

Scheduled_Report

Export_History

---

# Administration Schema

Stores platform management information.

Primary entities include:

User

Role

Permission

Team

Organisation

Tenant (future)

---

# Configuration Schema

Stores reusable platform settings.

Primary entities include:

System_Settings

Validation_Rules

Reference_Data

Lookup_Values

Industry_Pack

---

# Audit Schema

Stores immutable history.

Primary entities include:

Audit_Event

Security_Event

Login_History

API_Log

Configuration_History

---

# Analytics Schema

Supports executive dashboards.

Contains:

Materialised Views

Aggregated KPIs

Trend Tables

Historical Metrics

Performance Statistics

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