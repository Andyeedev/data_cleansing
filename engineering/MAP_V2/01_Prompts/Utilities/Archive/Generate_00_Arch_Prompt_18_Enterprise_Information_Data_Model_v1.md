# Generate_00_Arch_Prompt_18_Enterprise_Information_Data_Model.md

Prompt ID: 18
Phase: Enterprise Architecture
Document: Enterprise Information & Data Model
Prerequisite: Prompt 16 (Enterprise Capability Model), Prompt 17 (Application Architecture)
Execution Mode: Evidence-Based Repository Analysis (No Assumptions)

OBJECTIVE

Produce the definitive Enterprise Information & Data Model for MAP Nexus.

This is not a database design document.

This is not an ERD.

This is an Enterprise Architecture information model describing:

Enterprise business information
Business data domains
Information ownership
Master data
Reference data
Metadata
Logical information architecture
Information lifecycle
Data lineage
Governance
Data stewardship
Information quality
Enterprise data roadmap

The analysis must only use evidence found inside the repository.

If something does not exist, record it as a Gap.

Never invent information.

REPOSITORY SCOPE

Analyse the complete repository including:

PostgreSQL schemas
SQL DDL
SQL migrations
Views
Stored procedures
Functions
Triggers
Prisma schemas
ORM models
DTOs
Domain models
Entity classes
Services
Repositories
APIs
Controllers
Validation layer
Metadata tables
Configuration
YAML
JSON
Documentation
ADRs
Architecture documents
STRICT RULES
NEVER

Do not invent:

tables
views
APIs
services
metadata
ownership
governance
domains
business rules

Everything must have repository evidence.

IF SOMETHING DOES NOT EXIST

Record it as

Gap

with evidence.

Example

Gap

No metadata catalogue exists.

Evidence

No metadata tables found.



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


OUTPUT STRUCTURE

Generate exactly these documents.

01_Executive_Summary.md

Include

Purpose

Scope

Current Information Landscape

Repository Statistics

Actual

Schemas
Tables
Views
Procedures
Functions
Metadata Tables
Business Domains
Master Data Entities

Current maturity

Target maturity

Top information risks

Top governance gaps

Top metadata gaps

Top lineage gaps

Roadmap summary

Supporting documents

02_Enterprise_Information_Model.md

Identify every major business information object.

For each include

Business Purpose

Business Description

Business Owner

Consumers

Producers

Business Criticality

Sensitivity

Retention

Business Rules

Relationships

Supporting Systems

Repository Evidence

Only repository evidence.

03_Business_Data_Domains.md

Identify every actual business data domain.

Examples

Migration

Validation

Governance

Platform

Security

Audit

Reporting

Metadata

Only if present.

For every domain include

Purpose

Contained Objects

Contained Tables

Contained Views

Contained APIs

Contained Services

Contained Metadata

Owner

Current maturity

Evidence

04_Master_Reference_Data_Model.md

Identify

Master Data

Reference Data

Lookup Data

Configuration Data

Enumerations

Code Sets

For each include

Purpose

Authoritative Source

Update Process

Consumers

Evidence

If missing

record Gap.

05_Logical_Data_Model.md

Produce enterprise logical model.

NOT SQL.

Show

Business Entities

Relationships

Ownership

Aggregation

Composition

Dependencies

Business Keys

Natural Keys

Surrogate Keys

Do not invent.

06_Information_Lifecycle_Model.md

Describe lifecycle.

Discovery

Creation

Capture

Validation

Storage

Usage

Transformation

Archival

Retention

Deletion

Evidence for each stage.

If absent

Gap.

07_Data_Lineage_Model.md

Analyse actual lineage.

Source

Transformation

Destination

Views

Materialisation

Dependencies

Cross-schema flow

Batch flow

ETL

Validation flow

If no lineage exists

state so.

Do not fabricate.

08_Metadata_Model.md

Identify repository metadata.

Technical metadata

Business metadata

Operational metadata

Execution metadata

Validation metadata

Configuration metadata

Repository evidence

Metadata tables

Metadata services

Metadata APIs

If missing

Gap.

09_Data_Ownership_Governance.md

Analyse

Ownership

Stewardship

Custodianship

Security

Classification

Quality

Policies

Compliance

Audit

Approval

Repository evidence only.

If governance is absent

record Gap.

10_Enterprise_Data_Roadmap.md

Using repository findings

produce roadmap.

Current maturity

Target maturity

Quick wins

Medium improvements

Long-term improvements

Prioritise

High

Medium

Low

Every recommendation must reference repository evidence.

EVIDENCE REQUIREMENTS

Every statement must include evidence.

Examples

Evidence

core.projects

engine.rule_registry

platform.users

migration_validation_batch

src/services/discovery_service.py

prisma/schema.prisma

VALIDATION

Before finishing verify

✓ Every object exists

✓ Counts reconcile across documents

✓ Tables match repository

✓ Views match repository

✓ APIs match repository

✓ Services match repository

✓ No fabricated objects

✓ No fabricated ownership

✓ No fabricated governance

✓ Every recommendation references evidence

FINAL OUTPUT

Produce all ten Markdown documents.

Evidence only.

No assumptions.

No hallucinations.

No implementation.

No SQL generation.

No code changes.

Enterprise Architecture documentation only.


---


# Production Promotion

After engineering review and explicit user approval, promote all:



to

engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── 18_Enterprise_Information_Data_Model/
            (same files)























