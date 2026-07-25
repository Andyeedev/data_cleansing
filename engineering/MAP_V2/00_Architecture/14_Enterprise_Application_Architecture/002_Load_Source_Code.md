# MAP Nexus™ Enterprise Platform

# Architecture Generation Framework

## Module 002 — Load Source Code

**Framework Version:** 1.0

**Module:** 002_Load_Source_Code.md

**Status:** Approved

**Classification:** Enterprise Architecture Generation Framework

---

# Purpose

This module analyses the actual MAP implementation.

Unlike Module 001, which loads the intended architecture, this module analyses the physical implementation currently deployed across the MAP platform.

Its purpose is to understand how the software has actually been implemented.

No assumptions shall be made.

No code shall be modified.

No architecture shall be generated.

Only analysis shall occur.

---

# Objective

Construct a complete inventory of the existing MAP implementation.

Determine

• Existing frontend implementation

• Existing backend implementation

• Existing Python Validation Engine

• Existing API endpoints

• Existing database structure

• Existing integrations

• Existing workflows

• Existing reporting

The output of this module becomes the factual implementation baseline used by subsequent Architecture Generation modules.

---

# Source Locations

Analyse the following repositories.

## React Frontend

Read

engineering/

└── MAP_V2/

    └── 03_Source/

        └── frontend/

---

## Backend API

Read

engineering/

└── MAP_V2/

    └── 03_Source/

        └── backend/

---

## Python Validation Engine

Read

Financial_services_Migration_product/

ver1.4/

fs-migration-validation-engine/

---

## Database

Read

migration_engine

Schemas

core

engine

platform

---

# Frontend Discovery

Analyse

Application Shell

Navigation

Routing

Layouts

Pages

Components

Widgets

Portal structure

State management

Context providers

Authentication

Authorisation

AI Components

Workflow Components

Reporting Components

Task Management

Notification Centre

Calendar

Administration

Settings

Shared Components

Reusable Components

Determine

Current implementation maturity

Implemented features

Missing features

Unused components

Shared frameworks

Dependency relationships

---

# Backend Discovery

Analyse

FastAPI structure

Routers

Controllers

Services

Repositories

Models

Schemas

Middleware

Security

Configuration

Dependency injection

Logging

Error handling

Background services

Determine

Existing business services

Service ownership

Service dependencies

Existing APIs

Shared services

Reusable services

Missing services

---

# Python Validation Engine Discovery

Analyse

Application entry points

Execution engine

Control engine

Rule engine

Governance engine

Workflow execution

Auto discovery

Metadata engine

Checkpoint engine

Retry engine

Reporting

Audit

Logging

Notification

Determine

Existing capabilities

Reusable services

Public interfaces

Internal interfaces

Execution contracts

API candidates

Workflow ownership

---

# Database Discovery

Analyse

Schemas

core

engine

platform

Determine

Tables

Views

Materialised Views

Functions

Stored procedures

Sequences

Constraints

Indexes

Relationships

Audit columns

Metadata ownership

Entity ownership

Cross-schema relationships

Shared entities

Unused entities

---

# API Discovery

Discover

Available endpoints

Endpoint ownership

Versioning

Authentication

Authorisation

Input models

Output models

DTO reuse

Response contracts

Error contracts

---

# Reporting Discovery

Determine

Report framework

Report generation

Report scheduling

Distribution

Export

Presentation engine

AI reporting

Existing report types

---

# Workflow Discovery

Determine

Workflow framework

Approval framework

Notifications

Task management

Calendar

Workflow execution

Workflow state

Workflow persistence

---

# AI Discovery

Determine

AI Framework

Assistant

Recommendations

Insights

Prompt routing

Provider adapters

Conversation framework

Current implementation maturity

---

# Repository Relationships

Construct

Frontend

↓

API

↓

Python Engine

↓

Repository Layer

↓

Database

Determine every interaction.

Document every dependency.

---

# Integration Analysis

Determine

Frontend directly accessing database

Frontend bypassing APIs

Backend bypassing services

Python bypassing repositories

Duplicate business logic

Duplicate APIs

Duplicate services

Architecture violations

---

# Existing Contracts

Identify

API contracts

Database contracts

Service contracts

Workflow contracts

Reporting contracts

AI contracts

Integration contracts

---

# Outputs

Produce

Source_Code_Model.md

Repository_Map.md

Dependency_Graph.md

Implementation_Inventory.md

Integration_Map.md

---

# Output Location

Generate

engineering/

└── MAP_V2/

    └── 02_Output/

        └── Enterprise_Architecture/

            └── Module_002/

---

# Validation

Validate

✓ Frontend analysed

✓ Backend analysed

✓ Python Engine analysed

✓ APIs analysed

✓ Database analysed

✓ Reporting analysed

✓ Workflow analysed

✓ AI analysed

✓ Integration paths discovered

✓ Dependency graph created

✓ No implementation performed

---

# Success Criteria

Module 002 is complete when

✓ Every MAP codebase has been analysed

✓ Every repository has been inventoried

✓ Integration paths have been identified

✓ Existing contracts have been documented

✓ Dependency graph has been produced

✓ Platform implementation has been fully understood

✓ Ready for Module 003 — Analyse Backend