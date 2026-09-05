# Generate_00_Arch_Prompt_18_Enterprise_Information_Data_Model.md

# Prompt 18 — Enterprise Information & Data Model


You are continuing generation of the MAP Nexus Enterprise Architecture documentation.

This is **Prompt 18**.

Follow ALL standards defined in Prompt 00.

---

# OBJECTIVE

Produce a complete technical reference describing the **current implemented Enterprise Information & Data Model**.

This is **NOT** an enterprise data strategy.

This is **NOT** TOGAF Information Architecture.

This is **NOT** a future-state roadmap.

Document ONLY what exists in the repository.

Every statement must be supported by evidence.

Do not invent tables.

Do not invent ownership.

Do not invent governance.

Do not invent metadata.

Do not invent lineage.

---

# REQUIRED ANALYSIS

Analyse the complete repository including:

- PostgreSQL schemas
- SQL DDL
- SQL migrations
- constraints
- foreign keys
- indexes
- triggers
- views
- materialized views
- ORM models
- repository layer
- services
- DTOs
- entities
- database access layer

Determine:

- actual schemas
- actual tables
- actual relationships
- actual keys
- actual lookup tables
- actual reference tables
- actual audit tables
- actual history tables
- actual metadata tables
- actual bridge tables
- actual configuration tables

Only document what physically exists.



---



# Required Deliverables

Produce the following markdown documents.
# Working Output

Generate all artefacts into the temporary engineering output area.

engineering/
└── MAP_V2/
    └── 02_Output/
        └── 18_Enterprise_Information_Data_Model/
---

# OUTPUT DOCUMENTS

Produce exactly these markdown files.

---

## 01_Executive_Summary.md

Include

- purpose
- scope
- schemas discovered
- total tables
- total views
- total materialized views
- total foreign keys
- total indexes
- total lookup tables
- major observations

---

## 02_Database_Schema_Inventory.md

For every schema provide

Purpose

Tables

Views

Functions

Triggers

Sequences

Relationships

Dependencies

---

## 03_Table_Catalogue.md

For every table

Schema

Purpose

Primary Key

Foreign Keys

Columns

Indexes

Constraints

Referenced By

Used By

Evidence

---

## 04_Logical_Data_Model.md

Describe the implemented logical model.

Include diagrams showing

Tenant

Projects

Datasets

Mappings

Rules

Controls

Execution

Reporting

Platform

Audit

Relationships must come from actual FK definitions.

---

## 05_Master_and_Reference_Data.md

Identify

Master data

Reference data

Lookup tables

Configuration tables

Status tables

Enumerations

Explain how each is used.

Do not invent MDM.

---

## 06_Database_Relationships.md

Document

One-to-one

One-to-many

Many-to-many

Bridge tables

Composite keys

Dependency chains

Include Mermaid ER diagrams.

---

## 07_Data_Flow.md

Describe implemented data movement.

Examples

Discovery

Mapping

Execution

Validation

Reporting

Audit

Use actual code paths.

---

## 08_Audit_and_History_Model.md

Identify

Audit tables

History tables

Execution logs

Event logs

Tracking tables

Retention if implemented.

---

## 09_Configuration_Model.md

Document

System settings

Feature flags

Rule configuration

Weight configuration

Execution configuration

Platform configuration

Only implemented configuration.

---

## 10_Database_Statistics.md

Provide

Schemas

Tables

Views

Functions

Triggers

Indexes

Constraints

Foreign Keys

Unique Keys

Check Constraints

Sequences

Materialized Views

Bridge Tables

Lookup Tables

Configuration Tables

Audit Tables

History Tables

Largest Schemas

Most Referenced Tables

---

# RULES

Everything must be evidence-based.

Never invent:

- business owners
- governance
- maturity levels
- future roadmap
- AI recommendations
- target state
- TOGAF commentary
- business classifications

This prompt documents ONLY the implemented information and data structures.

Repository truth always overrides assumptions.

If something does not exist:

State:

"Not implemented."

Do not propose improvements.

Do not recommend changes.

Do not redesign anything.

Produce documentation only.



---


# Production Promotion

After engineering review and explicit user approval, promote all:



to

engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── 18_Enterprise_Information_Data_Model/
            (same files)



**Version:** 2.1

**Status:** Engineering Review Prompt














