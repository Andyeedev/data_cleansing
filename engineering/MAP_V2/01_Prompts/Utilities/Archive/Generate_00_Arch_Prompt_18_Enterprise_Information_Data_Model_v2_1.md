
# 
---
Prompt 18_v_2_1 has been rejected because it drifted into enterprise data architecture (TOGAF-style Information Architecture) instead of documenting the actual MAP Nexus implementation. It introduced concepts such as maturity assessments, target states, governance frameworks, AI roadmaps, business ownership models, and future-state architecture that are outside the scope of this repository analys
---
# Generate_00_Arch_Prompt_18_Enterprise_Information_Data_Model.md

# Prompt 18 — Enterprise Information & Data Model

## Objective

Generate the complete **Enterprise Information & Data Model** for MAP Nexus™.

This deliverable is an **Enterprise Architecture artefact** aligned with TOGAF Information Architecture principles.

It must define how business capabilities are supported by enterprise information assets, including:

- Business information model
- Enterprise data domains
- Logical information entities
- Master data model
- Reference data model
- Metadata architecture
- Data lineage model
- Information lifecycle model
- Data ownership and governance model
- Enterprise data roadmap

This is NOT a software design document.

Do NOT produce:
- Physical ERD
- SQL schemas
- ORM models
- API designs
- Frontend designs
- Implementation code

---

# Required Context

MAP Nexus™ is an enterprise migration validation platform.

It provides:

- Migration project management
- Source and target discovery
- Dataset mapping
- Column mapping
- Validation rules
- Validation controls
- Execution orchestration
- Exception management
- Governance decisions
- Release approvals
- Reporting and analytics
- RBAC security
- Multi-tenancy
- Audit and compliance

The platform follows a metadata-driven architecture.

---

# Critical Generation Rules

## Rule 1 — Evidence Based Only

All statements must be based on discovered platform capabilities.

Do NOT invent:
- tables
- APIs
- services
- modules
- entities
- ownership structures

If capability does not exist:
mark as:

"Target State Capability — Not Currently Implemented"

---

## Rule 2 — Separate Current State and Target State

Every major section must clearly separate:

### Current State

What exists today.

Evidence required:

- schema
- table
- service
- capability

### Target State

Enterprise architecture recommendation.

Clearly label as:

"Future Capability"

---

## Rule 3 — Correct Enterprise Statistics

Before generating documents:

Calculate and validate:

- Number of schemas
- Number of tables
- Number of views
- Number of logical entities
- Number of master entities
- Number of reference datasets
- Number of metadata entities
- Number of lineage relationships

Statistics must reconcile across all generated documents.

No conflicting numbers allowed.




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

# Required Output Documents

Generate:

---

# 01_Executive_Summary.md

Include:

## Purpose

Explain the enterprise information architecture.

## Scope

Include:

- Business Information Model
- Data Domains
- Logical Model
- Master Data
- Reference Data
- Metadata
- Lineage
- Governance
- Lifecycle

## Enterprise Information Assessment

Include:

| Area | Current Maturity | Target Maturity |
|---|---|---|
| Data Architecture |
| Metadata |
| Lineage |
| Governance |
| Quality |
| Security |

## Key Findings

Include:

### Information Risks

### Governance Gaps

### Metadata Gaps

### Lineage Gaps

## Roadmap

Include:

Phase 1:
Foundation

Phase 2:
Metadata & Lineage

Phase 3:
Governance

Phase 4:
Enterprise Data Platform

---

# 02_Enterprise_Information_Model.md

Define enterprise information objects.

For each object provide:

| Attribute | Description |
|-|-|
| Business Purpose |
| Business Definition |
| Domain |
| Owner |
| Consumers |
| Producers |
| Criticality |
| Classification |
| Retention |
| Business Rules |
| Relationships |
| Current Evidence |
| Target State |

Minimum required objects:

## Migration Domain

- Tenant
- Project
- System
- Connection
- Credential
- Dataset
- Dataset Column
- Dataset Mapping
- Column Mapping

## Validation Domain

- Rule
- Control
- Validation Batch
- Control Result
- Exception
- Execution Result

## Governance Domain

- Governance Decision
- Risk Assessment
- Release Decision
- Approval

## Platform Domain

- User
- Role
- Permission
- Workflow
- Task
- Notification
- Calendar Event
- Feature Flag
- Configuration

## Audit Domain

- Audit Event
- Security Event
- Login History

---

# 03_Business_Data_Domains.md

Define enterprise data domains.

For each domain include:

- Purpose
- Business Owner
- Information Objects
- Current Capability
- Target Capability
- Maturity Assessment
- Evidence

Required domains:

1. Migration Management
2. Validation Management
3. Governance & Compliance
4. Reporting & Analytics
5. Platform Services
6. Administration
7. Security
8. Audit

Provide a final domain summary table.

---

# 04_Master_Reference_Data_Model.md

Define:

## Master Data

Include:

- Tenant
- User
- Organisation
- Project
- System
- Dataset
- Rule
- Control

For each:

- Purpose
- Ownership
- Quality Rules
- Lifecycle

## Reference Data

Include:

- Status
- Severity
- Rule Types
- Decision Types
- Environment Types
- Classification Types

---

# 05_Logical_Data_Model.md

Provide logical information relationships.

NOT physical database design.

Include:

- Entity relationships
- Cardinality
- Business meaning

Example:

Tenant

contains

Projects

contain

Datasets

contain

Mappings

produce

Validation Results

produce

Governance Decisions

produce

Release Decisions

---

# 06_Information_Lifecycle_Model.md

Define lifecycle:

Stages:

1. Creation
2. Discovery
3. Classification
4. Validation
5. Usage
6. Governance
7. Retention
8. Archiving
9. Disposal

For each:

- Owner
- Controls
- Data quality requirements

---

# 07_Data_Lineage_Model.md

Define:

## Current State

Document existing lineage capability.

## Target State

Define:

- Source lineage
- Transformation lineage
- Validation lineage
- Reporting lineage

Include lineage maturity roadmap.

Do NOT claim lineage exists unless evidenced.

---

# 08_Metadata_Model.md

Define metadata architecture:

## Technical Metadata

Examples:

- Schema
- Table
- Column
- Data Type

## Business Metadata

Examples:

- Definition
- Owner
- Classification

## Operational Metadata

Examples:

- Execution time
- Quality score
- SLA

## Lineage Metadata

Examples:

- Source
- Target
- Transformation

---

# 09_Data_Ownership_Governance.md

Define:

## Ownership Model

Roles:

- Data Owner
- Data Steward
- Technical Owner
- Consumer

## Governance Processes

Include:

- Data approval
- Change management
- Quality management
- Classification
- Retention

---

# 10_Enterprise_Data_Roadmap.md

Provide:

Short term:
0-3 months

Medium term:
3-12 months

Long term:
12-24 months

Include:

- Capability
- Business Value
- Priority
- Dependencies

---

# Final Validation Requirements

Before completing:

Confirm:

✅ All statistics reconcile  
✅ No invented implementation details  
✅ Current and target state separated  
✅ Evidence provided where applicable  
✅ Enterprise architecture terminology used  
✅ No software design leakage  
✅ All documents consistent with each other  

Output status:

Architecture Review Ready


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
