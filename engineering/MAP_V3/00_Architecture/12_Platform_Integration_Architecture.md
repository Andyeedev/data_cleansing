
# MAP Nexus™ Enterprise Platform

## Development Standards

**Version:** 2.0

**Document:** 12_Platform_Integration_Architecture.md

**Status:** Approved Baseline

**Classification:** Internal Architecture Standard

---



# Purpose

This document defines the integration architecture for the MAP Nexus™ Enterprise Platform.

It establishes the authoritative contracts, responsibilities, communication patterns and integration boundaries between all major platform components, including:

• React Frontend
• Python Backend Engine
• FastAPI Services
• PostgreSQL Database
• Shared Components
• AI Platform
• Reporting Platform
• Future Enterprise Services

This document serves as the single source of truth for how platform components interact.

All implementation prompts, development workstreams and engineering activities shall comply with this architecture.

Its objectives are to:

• ensure consistent integration across the platform
• prevent duplicated functionality
• preserve existing investments in the Python Migration Engine
• define clear ownership of responsibilities
• minimise implementation defects caused by architectural ambiguity
• support future expansion without requiring architectural redesign

I would also add a Scope section immediately after the Purpose:

Scope

This document governs:

• Repository structure
• Frontend responsibilities
• Backend responsibilities
• API responsibilities
• Database ownership
• Integration contracts
• Authentication boundaries
• Communication protocols
• Service responsibilities
• Shared components
• Prompt implementation guidance

It does not define business functionality or implementation sequencing, which are covered by the Implementation Roadmap.



1. Overall Platform Architecture

Describe the three-layer architecture.

Presentation Layer
MAP V2 React

↓

API Layer

↓

Business Engine
Python

↓

Data Layer
PostgreSQL
2. Frontend Responsibilities

Document that React is responsible for:

UI
Dashboards
Portals
Widgets
Navigation
Reports
AI Chat UI
Workflow Designer

React must never

access PostgreSQL directly
execute business rules
execute migration controls
perform reconciliation
execute workflows

Everything goes through REST APIs.

3. Backend Responsibilities

Document the Python engine.

Current root

app/

Current execution

python -m app.main run --config config.yaml

Python owns

• workflow execution
• migration execution
• control execution
• rule engine
• orchestration
• AI provider execution
• governance
• scheduling
• reporting generation

4. Database Responsibilities

Database

migration_engine

Schemas

core

engine

reporting

platform

audit

Document ownership.

core

Master metadata

Connections

Datasets

Mappings

Projects

Tenants

engine

Execution

Checkpoints

Execution history

Batch history

Failures

Recovery

Results

Governance

Reporting

Dimensions

Report templates

Scheduled reports

Export history

platform

Users

Roles

Permissions

Workflows

Approvals

Tasks

Notifications

Calendar

System settings

Feature flags

Subscriptions

audit

Audit events

Security events

Login history

API logs

Configuration history

This immediately tells future prompts exactly where tables belong.

5. API Standards

Define

REST

/api/v1/

Convention

GET

POST

PUT

DELETE

Authentication

JWT

Bearer Token

JSON only

No direct DB access from React.

6. Folder Standards

Frontend

src/

Backend

app/

SQL

database/

migrations/

Architecture

00_Architecture/

Prompt Library

01_Prompts/

Temporary Output

02_Output/
7. Integration Rules

This is probably the most important section.

For example

Whenever a frontend prompt requires

Business Logic

↓

Call existing Python API.

Whenever a backend prompt requires

Persistence

↓

Use existing PostgreSQL database.

Whenever a database prompt requires

New tables

↓

Use existing

migration_engine

database.

Never create a second database.

Never duplicate business logic already implemented.

Never bypass APIs.

8. Existing Engine Context

This is hugely valuable.

Document the existing execution pipeline.

Exactly like the output you showed.

Connection Resolution

↓

Dataset Mapping

↓

Rule Discovery

↓

Control Discovery

↓

Control Execution

↓

Governance Decision

Now AI understands that the backend already exists.

Instead of inventing new execution logic it simply exposes it.

9. Future AI Context

Document

React

↓

AI API

↓

Python AI Framework

↓

Provider Adapter

↓

Ollama

Claude

OpenAI

Azure

Gemini

LM Studio

No prompt afterwards will ever accidentally connect React directly to an LLM.

10. Prompt Instructions

At the end I'd add mandatory instructions.

Every future prompt shall

✓ Read this document first

✓ Reuse existing backend

✓ Reuse existing database

✓ Reuse existing API standards

✓ Never duplicate business logic

✓ Never create duplicate tables

✓ Never bypass integration contracts

✓ Preserve backward compatibility