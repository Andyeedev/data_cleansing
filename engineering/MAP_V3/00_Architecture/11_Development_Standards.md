# MAP Nexus™ Enterprise Platform

## Development Standards

**Version:** 2.0

**Document:** 11_Development_Standards.md

**Status:** Approved Baseline

**Classification:** Internal Engineering Standard

---

# Purpose

This document defines the mandatory engineering standards for the MAP Nexus™ Enterprise Platform.

All future development, regardless of contributor or AI-generated implementation, shall comply with these standards.

These standards ensure:

• Consistency

• Maintainability

• Scalability

• Readability

• Enterprise quality

This document is the authoritative development standard for MAP Version 2.

---

# Engineering Principles

MAP development follows these principles.

• Simplicity over cleverness

• Readability over brevity

• Configuration over hard-coding

• Composition over duplication

• API-first design

• Security by design

• Documentation first

• Testability by default

---

# Repository Structure

```
project root/
├── app/                          # Backend application (Python/FastAPI)
│   ├── api/                      # API routes and models
│   │   ├── routes/               # Route handlers
│   │   ├── models/               # Pydantic models
│   │   └── core/                 # Auth, config, security
│   ├── services/                 # Business logic
│   ├── db/                       # Database connections, repositories
│   ├── governance/               # Governance services
│   ├── orchestration/            # Workflow orchestration
│   └── rules/                    # Validation rules
├── MAP_V2/
│   ├── 00_Architecture/          # Architecture documents
│   ├── 01_Prompts/               # Implementation prompts
│   ├── 02_Output/                # Temporary output
│   ├── 03_Source/
│   │   ├── frontend/             # React application
│   │   └── database/             # SQL scripts
│   ├── 04_Testing/               # Test suites
│   └── 05_Releases/              # Release packages
└── config.yaml                   # Application configuration
```

The backend application root is `app/` at the project root, not `MAP_V2/03_Source/backend/`.

---
# Integration Standards

Integration behaviour is defined in

12_Implementation_Integration_Standards.md

This document shall be read together with this standard.

Implementation prompts shall comply with both documents.


---
# Technology Standards

## Frontend

Framework

React

Language

TypeScript

Package Manager

npm

Routing

React Router

Styling

Tailwind CSS

Icons

Lucide React

Charts

Recharts

State Management

React Context

Redux only when justified.

---

## Backend


Language
Python

Primary Application

Financial Services Migration Validation Engine

Application Root

app/

API Layer

FastAPI

Execution Engine

Existing MAP Python Engine

The existing backend remains the system of record.

FastAPI exposes APIs only.

Business logic must remain inside the existing application unless explicitly approved.


---

## Existing Application First

Before implementing any feature developers shall determine whether equivalent functionality already exists.

Implementation shall

✓ reuse existing services

✓ reuse existing repositories

✓ reuse existing business logic

✓ extend existing modules

New implementations shall not duplicate existing functionality.

The existing MAP Python platform is the authoritative backend.



---

## Database

Primary Database

migration_engine

Schemas

core

Master metadata, connections, datasets, mappings, projects, tenants

engine

Execution, batch, controls, rules, governance, scoring

reporting

Dimensions, report templates, scheduled reports, export history

platform

Users, roles, workflows, tasks, notifications, calendar, settings

audit

Immutable audit events, security events, login history, API logs

No implementation may create new schemas unless approved by the architecture.

Tables shall always be created within the approved schema.

The database architecture defined in 05_Database_Architecture.md is authoritative.

The schema model is defined in 12_Platform_Integration_Architecture.md.

---

# Naming Standards

## Files

Use PascalCase for React components.

Example

ExecutiveDashboard.tsx

RiskAssessmentPage.tsx

Use snake_case for Python.

Example

migration_service.py

validation_engine.py

---

## Variables

Python

snake_case

React

camelCase

Constants

UPPER_CASE

---

## Database

Tables

snake_case

Columns

snake_case

Indexes

idx_

Foreign Keys

fk_

Primary Keys

pk_

Views

vw_

Materialised Views

mv_

---

# Folder Standards

Frontend

```
frontend/

components/

pages/

layouts/

hooks/

services/

types/

utils/

assets/
```

Backend

```
app/
├── api/
│   ├── routes/          # FastAPI route handlers
│   ├── models/          # Pydantic request/response models
│   └── core/
│       ├── auth/        # JWT authentication
│       ├── config.py    # App configuration
│       └── app_config.py
├── services/            # Business logic
├── db/
│   ├── connection.py    # Database connection
│   ├── repositories/    # Data access
│   └── adapters/        # Database adapters
├── governance/          # Governance services
├── orchestration/       # Workflow orchestration
├── controls/            # Control execution
├── rules/               # Validation rules
├── security/            # Encryption, crypto
├── utils/               # Utilities
└── scripts/             # CLI scripts
```

Database

```
database/

schemas/

migrations/

views/

functions/

seed/

scripts/
```


# API Standards


```
Frontend shall never access PostgreSQL directly.

All communication must pass through versioned APIs.

React

↓

FastAPI

↓

Existing Python Engine

↓

PostgreSQL

```
REST only.

Versioned.

Example

/api/v1/

Every endpoint returns

```
{
    "success": true,
    "data": {},
    "message": "",
    "timestamp": ""
}
```

Errors return

```
{
    "success": false,
    "error": "",
    "details": ""
}
```



# Logging Standards

Every backend service uses structured logging.

Every log includes

Timestamp

Service

Operation

Request ID

User (if available)

Duration

Status

Never log passwords.

Never log secrets.

---

# Error Handling

Never expose stack traces.

Never expose SQL.

Never expose internal paths.

Users receive friendly messages.

Developers receive structured logs.

---

# Security Standards

Never hard-code

Passwords

Secrets

API Keys

Connection Strings

Certificates

Use Azure Key Vault (Production)

Use environment variables (Development)

---

# SQL Standards

Every table contains

Created_Date

Updated_Date

Created_By

Updated_By

Where appropriate

Deleted_Flag

Version_Number

Audit_ID

---

# UI Standards

Font

Segoe UI

Colour Palette

Azure-inspired

Spacing

8px grid

Responsive

Desktop first

Accessibility

WCAG 2.1 AA

---

# Reporting Standards

Every report follows

MAP branding

Consistent header

Consistent footer

Standard export formats

HTML first

PDF generated from HTML

No duplicated report templates.

---

# AI Standards

AI never accesses PostgreSQL directly.

AI communicates only through

API Layer

↓

AI Framework

↓

Provider Adapter

↓

Configured Provider

AI shall never communicate directly with databases or internal business services.

---

# Documentation Standards

Every service contains

Overview

Responsibilities

Dependencies

Public Interfaces

Configuration

Error Handling

Future Enhancements

Every API endpoint documented.

---

# Git Standards

Main Branch

main

Development Branch

develop

Feature Branch

feature/<feature-name>

Bug Fix

bugfix/<issue>

Release

release/<version>

Hotfix

hotfix/<version>

---

# Versioning

Semantic Versioning

Major.Minor.Patch

Example

2.0.0

2.1.0

2.1.1

---

# Testing Standards

Minimum requirements

Unit Tests

Integration Tests

API Tests

UI Tests

Security Tests

Performance Tests

Critical business services require automated testing.

---

# Code Quality

Maximum Function Length

50 lines

Maximum File Size

500 lines preferred

Single Responsibility Principle

Mandatory

No duplicated business logic.

---

# AI Prompt Standards

Every implementation prompt must include

Purpose

Inputs

Outputs

Architecture References

Prompt Dependencies

Framework Reuse

Folder Structure

Validation

Promotion Rules

Acceptance Criteria

Dependencies

Expected Deliverables

Prompts generate one measurable deliverable.

---

# Review Standards

Every implementation passes

Architecture Review

Code Review

Security Review

Documentation Review

Testing Review

Only then is it considered complete.

---

# Definition of Done

Development is complete when

✓ Code implemented

✓ Tests passing

✓ Documentation updated

✓ Security reviewed

✓ Logging implemented

✓ Error handling complete

✓ Standards followed

✓ Existing functionality reused

✓ No duplicated implementation introduced

✓ Integration Standards followed

✓ Architecture documents complied with
---

# Compliance

Every future implementation prompt shall include:

"Follow the MAP Nexus™ Development Standards (11_Development_Standards.md)."

This document is the authoritative engineering standard for MAP Version 2.

---

# Related Documents

00_Master_Roadmap.md

01_Product_Architecture.md

02_Portal_Architecture.md

03_Backend_Architecture.md

04_API_Architecture.md

05_Database_Architecture.md

06_AI_Architecture.md

07_Reporting_Architecture.md

08_Security_Architecture.md

09_Deployment_Architecture.md

10_Implementation_Roadmap.md

11_Development_Standards.md

12_Implementation_Integration_Standards.md