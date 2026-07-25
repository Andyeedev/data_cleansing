# MAP Nexus™ Enterprise Platform

# Architecture Generation Framework

## Module 005 — Analyse Database

**Framework Version:** 1.0

**Module:** 005_Analyse_Database.md

**Status:** Approved

**Classification:** Enterprise Architecture Generation Framework

---

# Purpose

This module performs a comprehensive architectural analysis of the MAP PostgreSQL database.

Its objective is to validate that the database implementation complies with the approved MAP Enterprise Architecture and Platform Integration Standards.

The analysis shall determine whether the database supports the current MAP platform while remaining scalable for future enterprise growth.

This module performs analysis only.

No SQL shall be executed.

No schema modifications shall occur.

No tables shall be created.

No data shall be modified.

---

# Objective

Analyse the complete MAP database and determine

• Database architecture

• Schema ownership

• Business domain ownership

• Metadata architecture

• Entity relationships

• Repository compatibility

• API exposure

• Frontend isolation

• Python Validation Engine integration

• Workflow integration

• Reporting integration

• AI integration

• Technical debt

• Future scalability

---

# Source Database

Analyse

Database

migration_engine

---

# Schemas

Mandatory

core

engine

platform

Analyse every schema completely.

---

# Architecture References

Read

engineering/

└── MAP_V2/

    └── 00_Architecture/

Mandatory

03_Backend_Architecture.md

04_API_Architecture.md

05_Database_Architecture.md

06_AI_Architecture.md

07_Reporting_Architecture.md

11_Development_Standards.md

12_Platform_Integration_Architecture.md

13_Architecture_Compliance_Audit.md

---

# Database Inventory

Discover

Schemas

Tables

Views

Materialised Views

Indexes

Constraints

Primary Keys

Foreign Keys

Functions

Procedures

Sequences

Triggers

Check Constraints

Audit Columns

Metadata Tables

Lookup Tables

Bridge Tables

Reference Tables

---

# Schema Ownership

Determine ownership of every schema.

## core

Responsible for

Metadata

Configuration

Projects

Connections

Mappings

Datasets

Columns

Business metadata

Platform metadata

Reference data

Determine whether every table belongs within core.

---

## engine

Responsible for

Validation

Execution

Controls

Rules

Governance

Audit

Checkpointing

Retry

Scheduling

Execution history

Determine whether every table belongs within engine.

---

## platform

Responsible for

Workflow

Task Management

Calendar

Notifications

AI

Reporting

Dashboards

User Preferences

Application Services

Presentation

Future MAP functionality

Determine whether every table belongs within platform.

---

# Business Domain Analysis

Determine every business domain represented within the database.

Examples

Migration

Validation

Governance

Workflow

Reporting

AI

Notifications

Task Management

Calendar

Administration

Security

Configuration

Metadata

Determine

Domain ownership

Schema ownership

Entity ownership

Cross-domain dependencies

Future extensibility

---

# Entity Relationship Analysis

Analyse

Primary Keys

Foreign Keys

Cardinality

Many-to-many relationships

Reference integrity

Cascade behaviour

Orphan entities

Relationship complexity

Shared entities

Duplicate entities

---

# Metadata Architecture

Determine

Metadata driven behaviour

Configuration tables

Rule metadata

Workflow metadata

Report metadata

AI metadata

Portal metadata

Widget metadata

Security metadata

Determine whether metadata has been centralised correctly.

---

# Repository Compatibility

Determine

Repository ownership

Entity ownership

Repository boundaries

Transaction boundaries

Shared repositories

Potential repository duplication

Repository scalability

---

# Backend Usage

Cross-reference Module 003.

Determine

Which backend service owns every table.

Examples

Dashboard Service

↓

platform.dashboard

Workflow Service

↓

platform.workflow_definitions

Validation Engine

↓

engine.*

Metadata Service

↓

core.*

Every table shall have an owning service.

---

# Frontend Isolation

Cross-reference Module 004.

Verify

Frontend never accesses

core

engine

platform

directly.

Determine

Every frontend page

↓

Required API

↓

Owning backend service

↓

Database tables used

Identify violations.

---

# Python Validation Engine Integration

Determine

Tables read

Tables written

Execution metadata

Governance metadata

Checkpoint metadata

Retry metadata

Reporting metadata

Rule metadata

Control metadata

Audit metadata

---

# Workflow Integration

Determine

Workflow tables

Approval tables

Notification tables

Task tables

Calendar tables

Execution state

History

Audit

Ownership

---

# Reporting Integration

Determine

Report metadata

Schedules

Templates

Presentation

Distribution

Document generation

Export

Future reporting capabilities

---

# AI Integration

Determine

Prompt metadata

Conversation metadata

Assistant metadata

Provider metadata

Recommendation metadata

Insight metadata

Future AI storage requirements

---

# Naming Standards

Validate

Schema names

Table names

Column names

Index names

Constraint names

Primary Keys

Foreign Keys

Audit fields

Against

11_Development_Standards.md

---

# Audit Standards

Verify every applicable table contains

created_date

updated_date

created_by

updated_by

version_number

deleted_flag

audit_id

Identify missing audit fields.

---

# Security Analysis

Determine

Sensitive data

Personally Identifiable Information

Secrets

Credentials

Encryption requirements

Row level security

Tenant isolation

Audit protection

---

# Performance Analysis

Analyse

Indexes

Query patterns

Large tables

High-write tables

High-read tables

Partition candidates

Materialised view candidates

Caching opportunities

---

# Technical Debt

Identify

Duplicate tables

Duplicate entities

Duplicate metadata

Unused tables

Unused columns

Unused indexes

Missing indexes

Incorrect ownership

Architecture violations

Scalability risks

---

# Future Scalability

Assess readiness for

Multi-tenancy

Horizontal scaling

Cloud deployment

AI Platform

Workflow Platform

Reporting Platform

Future integrations

External APIs

Event-driven architecture

---

# Compliance Assessment

Compare implementation against

05_Database_Architecture.md

11_Development_Standards.md

12_Platform_Integration_Architecture.md

Determine

Compliant

Partially compliant

Non-compliant

Provide evidence for every finding.

---

# Refactoring Opportunities

Recommend

Schema consolidation

Entity consolidation

Metadata improvements

Index improvements

Repository improvements

Performance improvements

Security improvements

Future partitioning

No SQL shall be generated.

Recommendations only.

---

# Outputs

Generate

Database_Architecture_Model.md

Schema_Ownership_Report.md

Business_Domain_Model.md

Entity_Relationship_Model.md

Database_Compliance_Report.md

Database_Technical_Debt.md

Repository_Ownership_Map.md

Database_Refactoring_Recommendations.md

Database_Scalability_Report.md

---

# Output Location

Generate into

engineering/

└── MAP_V2/

    └── 02_Output/

        └── Enterprise_Architecture/

            └── Module_005/

---

# Validation

Validate

✓ All schemas analysed

✓ Every table analysed

✓ Every relationship analysed

✓ Business domains identified

✓ Schema ownership established

✓ Backend ownership established

✓ Frontend isolation verified

✓ Repository ownership verified

✓ Metadata architecture analysed

✓ Audit standards verified

✓ Technical debt identified

✓ Scalability assessed

✓ Compliance measured

✓ No SQL generated

✓ No implementation performed

---

# Success Criteria

Module 005 is complete when

✓ The complete MAP database architecture has been analysed

✓ Every schema has an owner

✓ Every table has an owning service

✓ Every business domain has been identified

✓ Entity relationships have been validated

✓ Frontend isolation has been verified

✓ Repository ownership has been established

✓ Technical debt has been documented

✓ Database architecture model has been generated

✓ Ready for Module 006 — Analyse AI Framework