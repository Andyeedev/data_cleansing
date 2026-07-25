# Generate_00_Arch_Prompt_18_Enterprise_Information_Data_Model

## Objective

Produce the complete **Enterprise Information & Data Model** for the MAP Nexus platform using **only evidence from the existing source code, database schema, configuration, metadata, APIs and architecture documents**.

This is an **Enterprise Architecture deliverable**, **not** a software design document.

The objective is to document the enterprise information architecture, logical data model, business data domains, master data, metadata, lineage, ownership, governance and information lifecycle.

Do **not** invent entities, tables, relationships, business objects or metadata that cannot be supported by evidence.

---

# Required Output Folder

17 has completed.

Create

```
18_Enterprise_Information_Data_Model/
```

containing exactly the following documents.

```
18_Enterprise_Information_Data_Model/

01_Executive_Summary.md

02_Enterprise_Information_Model.md

03_Business_Data_Domains.md

04_Master_Reference_Data_Model.md

05_Logical_Data_Model.md

06_Information_Lifecycle_Model.md

07_Data_Lineage_Model.md

08_Metadata_Model.md

09_Data_Ownership_Governance.md

10_Enterprise_Data_Roadmap.md
```

---

# General Rules

Use evidence only from

* source code
* PostgreSQL schemas
* SQL Views
* APIs
* ORM models
* YAML
* JSON
* configuration
* architecture documentation
* migration scripts

Every statement must be evidence-based.

If something is missing, state

```
Not implemented
```

Never invent.


--


# Required Deliverables

Produce the following markdown documents.
# Working Output

Generate all artefacts into the temporary engineering output area.

engineering/
└── MAP_V2/
    └── 02_Output/
        └── 18_Enterprise_Information_Data_Model/
---

# Document Requirements

---

# 01_Executive_Summary.md

Include

Executive Summary

Purpose

Scope

Enterprise Information Statistics

| Metric | Value |

Examples

Business Data Domains

Logical Entities

Reference Data Sets

Master Data Entities

Metadata Entities

Lineage Relationships

Information Owners

Data Stewards

Current State Assessment

Target State Assessment

Key Findings

Top Information Risks

Top Governance Gaps

Top Metadata Gaps

Top Lineage Gaps

Roadmap Summary

Supporting Documents

Approval

---

# 02_Enterprise_Information_Model.md

Create the enterprise information architecture.

For every Business Information Object document

Business Purpose

Business Description

Business Owner

Primary Consumers

Primary Producers

Business Criticality

Sensitivity Classification

Retention Requirement

Business Rules

Relationships

Supporting Systems

Evidence

Include diagrams using ASCII.

Example

```
Customer

|
+-- Accounts

|
+-- Balances

|
+-- Transactions
```

---

# 03_Business_Data_Domains.md

Identify every business data domain.

Examples

Migration

Validation

Governance

Security

Platform

Reporting

Administration

Reference Data

Metadata

Audit

For every domain include

Purpose

Owner

Contained Business Objects

Contained Tables

Contained APIs

Contained Services

Contained Metadata

Current Maturity

Evidence

Produce summary tables.

---

# 04_Master_Reference_Data_Model.md

Separate

Master Data

Reference Data

Transactional Data

Configuration Data

Metadata

For every master entity include

Purpose

Primary Keys

Natural Keys

Relationships

Owner

Lifecycle

Quality Rules

Evidence

Examples

Projects

Systems

Datasets

Users

Roles

Tenants

Controls

Rules

Capabilities

Reference Data examples

Status

Severity

Risk Levels

Execution States

Rule Types

Control Types

Permission Types

Event Types

Evidence required.

---

# 05_Logical_Data_Model.md

Produce enterprise logical data model.

Do NOT generate physical ERD.

Instead produce logical model.

Include

Business Entity

Business Description

Attributes

Relationships

Cardinality

Primary Business Keys

Alternate Keys

Dependencies

Business Rules

Supporting Tables

Evidence

Create logical relationship diagrams.

---

# 06_Information_Lifecycle_Model.md

Document lifecycle.

Examples

Create

Update

Validate

Approve

Execute

Archive

Delete

Retention

For every major information object define

Creation Event

Modification Event

Approval

Usage

Archiving

Deletion

Retention

Owner

Evidence

Include lifecycle diagrams.

---

# 07_Data_Lineage_Model.md

Produce complete lineage.

Show

Source

Transformation

Storage

Consumption

Reporting

Dashboards

Governance

Audit

For every major dataset include

Origin

Consumers

Transformations

Derived Objects

Lineage Direction

Refresh

Dependencies

Evidence

Highlight lineage gaps.

---

# 08_Metadata_Model.md

Document metadata architecture.

Include

Technical Metadata

Business Metadata

Operational Metadata

Execution Metadata

Governance Metadata

Reference Metadata

Configuration Metadata

For each metadata category include

Purpose

Tables

Fields

Owner

Consumers

Update Frequency

Evidence

Identify metadata gaps.

---

# 09_Data_Ownership_Governance.md

Produce enterprise governance model.

For every business domain include

Business Owner

Technical Owner

Data Steward

Custodian

Consumers

Approvers

RACI

Policies

Standards

Classification

Sensitivity

Compliance

Audit

Evidence

Include governance matrix.

---

# 10_Enterprise_Data_Roadmap.md

Assess current maturity.

Identify

Strengths

Weaknesses

Gaps

Technical Debt

Master Data Gaps

Metadata Gaps

Governance Gaps

Lineage Gaps

Quality Gaps

Security Gaps

Prioritise

High

Medium

Low

Produce roadmap

Phase 1

Quick Wins

Phase 2

Metadata

Phase 3

Governance

Phase 4

Enterprise Data Platform

Estimate

Business Value

Complexity

Dependencies

Priority

---

# Quality Requirements

Every document must contain

Version

Status

Date

Classification

Purpose

Scope

Tables

Evidence

Findings

Recommendations

Approval

---

# Mandatory Evidence Rule

Every architectural statement must reference actual implementation evidence.

Where implementation is missing, explicitly state

```
Current Implementation

Not implemented.
```

Do not speculate.

---

# Expected Outcome

The completed Prompt 18 should provide a comprehensive enterprise information architecture describing:

* Business Information Model
* Enterprise Data Domains
* Logical Data Model
* Master & Reference Data
* Metadata Architecture
* Data Lineage
* Information Lifecycle
* Data Governance
* Ownership Model
* Enterprise Data Roadmap

and serve as the authoritative information architecture reference for the MAP Nexus platform.


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
