Prompt — Generate_00_Arch_999_Master_Gap_Analysis_Phase_C.md

You are an Enterprise Architecture Repository Auditor.

Your task is to analyse the entire consolidated MAP Nexus Enterprise Architecture Repository produced during 999_Master_Architecture_Consolidation_Phase_B.

Do NOT redesign the architecture.

Do NOT rewrite documents.

Do NOT merge documents.

Do NOT invent new architecture.

Your objective is to identify gaps only.

# Objectives

Produce

Generate_00_Arch_999_Master_Gap_Analysis_Phase_C.md

This document becomes the master gap analysis for the complete architecture repository.

# Scope

Analyse every architecture document including:

Enterprise Planning
Core Architecture
Enterprise Application Architecture
Functional Traceability
Business Capability Model
Business Process Model
Information/Data Model
Enterprise Solution Architecture
Enterprise Implementation Architecture

Analyse all 81 documents.

Review Categories

For every document analyse:

# 1. Coverage

Does the document completely cover its intended subject?

Missing sections?

Missing architecture views?

Missing models?

Missing references?

# 2. Cross-document consistency

Check consistency between documents.

Examples:

Business Capability

↓

Business Process

↓

Solution Architecture

↓

Implementation

Are there breaks?

Missing mappings?

Conflicting terminology?

Duplicate ownership?

Conflicting architecture statements?

# 3. Traceability

Verify traceability across:

Requirements

↓

Capabilities

↓

Processes

↓

Applications

↓

Services

↓

APIs

↓

Database

↓

Deployment

↓

Implementation

Identify any broken chains.

# 4. Architecture completeness

Determine whether major enterprise architecture domains are fully represented.

Examples

Business

Application

Data

Technology

Security

Integration

Deployment

Governance

Operations

Monitoring

AI

Compliance

Configuration

Master Data

Reference Data

Runtime

Infrastructure

Identify missing architectural viewpoints.

# 5. Duplicate content

Identify:

Duplicated documents

Duplicated architecture descriptions

Duplicated diagrams

Duplicated responsibilities

Duplicated implementation guidance

# 6. Circular references

Locate

documents referencing each other incorrectly

missing parent references

missing child references

orphaned documents

# 7. Repository structure issues

Review repository organisation.

Determine if folders remain logical.

Determine whether hierarchy is consistent.

Identify misplaced documents.

# 8. Standards compliance

Check consistency of:

Naming

Versioning

Numbering

Directory naming

Heading conventions

Section ordering

Document metadata

# 9. Missing architecture deliverables

Determine whether any major enterprise architecture deliverables are absent.

Examples:

Risk Architecture

Governance Architecture

Operational Architecture

Support Architecture

Disaster Recovery

Business Continuity

Data Governance

AI Governance

Security Operations

Service Catalogue

Application Portfolio

Technology Portfolio

Decision Logs

Standards Catalogue

Architecture Principles

Reference Architectures

Only recommend additions if they represent recognised enterprise architecture deliverables.

# 10. Maturity assessment

Assess repository maturity.

Use categories:

Initial

Developing

Defined

Managed

Optimised

Provide maturity for each architecture layer.

---

# Required Deliverables

Produce the following markdown documents.
# Working Output

Generate all artefacts into the temporary engineering output area.

engineering/
└── MAP_V2/
    └── 02_Output/
        └──999_Master_Architecture_Consolidation/
            └──999_Master_Gap_Analysis_Phase_C/


---

# Output Structure

Produce the report using the following sections.

# 01_Executive_Summary.md

Overall repository health

Overall completeness

Overall maturity

Overall consistency

Overall traceability

Overall confidence

# 02_Repository_Statistics.md

Total documents

Documents analysed

Architecture layers

Domains covered

Cross references

Broken references

Duplicate areas

Missing areas

Coverage percentage

Estimated maturity

# 03_Gap_Analysis_by_Architecture_Layer.md

For each layer provide:

Current coverage

Strengths

Weaknesses

Missing deliverables

Recommendations

Priority

Impact

# 04_Cross_Layer_Gap_Analysis.md

Analyse interactions between layers.

Business → Application

Application → Data

Data → Technology

Technology → Deployment

Deployment → Implementation

Implementation → Operations

Identify any missing connections.

# 05_Traceability_Gap_Analysis.md

Identify

missing mappings

broken chains

orphan components

missing dependencies

# 06_Duplicate_Analysis.md

List

duplicate documents

duplicate sections

duplicate responsibilities

duplicate architecture

# 07_Standards_Compliance_Analysis.md

List:

naming inconsistencies

numbering inconsistencies

folder inconsistencies

metadata inconsistencies

# 08_Missing_Deliverables.md

Provide a table.

| Missing Deliverable | Why Required | Priority | Recommended Phase |

# 08_Repository_Risk_Assessment.md

Identify risks caused by gaps.

Rate

Low

Medium

High

Critical

# 09_Recommended_Remediation_Roadmap.md

Organise remediation into:

Phase C1

Critical gaps

Phase C2

Traceability improvements

Phase C3

Repository consistency

Phase C4

Architecture maturity improvements

# 10_Final_Repository_Assessment.md

Provide

Repository completeness (%)

Architecture consistency (%)

Traceability (%)

Governance readiness

Implementation readiness

Enterprise readiness

Overall recommendation

# Constraints

Do NOT modify architecture.

Do NOT merge documents.

Do NOT create replacement architecture.

Do NOT remove documents.

Only identify gaps.

Recommendations must preserve backward compatibility with the existing repository.

Base every finding on evidence from the existing repository. Where evidence is insufficient, explicitly mark the finding as an observation or recommendation rather than a confirmed gap.


---


# Production Promotion

After engineering review and explicit user approval, promote all:



to

engineering/
└── MAP_V2/
    └── 00_Architecture/
        └──999_Master_Architecture_Consolidation/
            └──999_Master_Gap_Analysis_Phase_C/
            (same files)