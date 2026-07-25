# Generate_00_Arch_999_Master_Architecture_Repository_Phase_B.md

# Prompt — Master Architecture Repository Consolidation

## Phase B — Repository Consolidation Model

---

# Objective

Using the completed outputs from **999_Master_Architecture_Consolidation_Phase_A_v2**, generate the **Master Architecture Repository Model**.

This phase **does not merge documents**.

This phase defines **how the repository should be organised** after consolidation.

No architecture content should be rewritten.

No duplicate content should be removed.

No implementation changes should be proposed.

This phase produces only the consolidation blueprint.

---

# Inputs

Use all outputs from Phase A:

* 01_Repository_Inventory.md
* 02_Duplicate_Register.md
* 03_Contradiction_Register.md
* 04_Terminology_Register.md
* 05_Architecture_Coverage_Register.md
* 06_Evidence_Gaps_Register.md

---

# Required Outputs

Generate the following repository documents.

---

# 01_Master_Repository_Structure.md

Produce the proposed repository hierarchy.

For every document include

* Repository ID
* Current Location
* Proposed Location
* Architecture Layer
* Domain
* Parent Document
* Child Documents
* Status

Do not rename content.

Do not merge content.

Simply define where every document belongs.

---

# 02_Master_Document_Register.md

Produce a complete document register.

For every document include

* Document ID
* Filename
* Purpose
* Architecture Domain
* Architecture Layer
* Owner
* Status

Example

```
ARCH-019-07

Backend Architecture

Layer:
Enterprise Solution Architecture

Domain:
Application Architecture

Owner:
Architecture Team

Status:
Current
```

---

# 03_Duplicate_Group_Register.md

Convert the duplicate register into duplicate groups.

Example

```
DG-001

JWT Authentication

Documents

08

19

20

Severity

Critical

Reason

Same implementation appears in three documents.
```

Every duplicate group shall contain

* Group ID
* Topic
* Documents involved
* Severity
* Duplicate Type

Duplicate types include

* Conceptual
* Design
* Implementation
* Inventory
* Summary
* Reference

Do not recommend which document should become authoritative.

---

# 04_Contradiction_Classification_Register.md

Classify every contradiction.

Possible classifications

* Technology Version
* Inventory Count
* Implementation Difference
* Terminology
* Architecture Decision
* Metric
* Process
* Configuration
* Unknown

For every contradiction provide

* Contradiction ID
* Classification
* Documents involved
* Evidence
* Severity

No resolutions.

---

# 05_Master_Terminology_Catalogue.md

Create the canonical terminology catalogue.

Columns

* Canonical Term
* Alternative Terms
* Documents Used
* Domain

Do not decide which wording is correct.

Only record the relationships.

---

# 06_Master_Metadata_Model.md

Define the metadata required for every architecture document.

Include fields such as

* Document ID
* Repository ID
* Version
* Owner
* Layer
* Domain
* Status
* Parent
* Children
* Dependencies
* Duplicate Groups
* Contradictions
* Evidence Sources
* Last Updated

This is the metadata model only.

---

# 07_Master_Traceability_Model.md

Produce the repository traceability model.

Show relationships between

Business

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

Implementation

↓

Deployment

↓

Security

↓

Operations

Represent the relationships as matrices and hierarchical mappings.

Do not infer missing relationships.

Only use evidence.

---

# 08_Master_Repository_Gap_Register.md

Combine

Coverage Register

and

Evidence Register

into one consolidated gap register.

Columns

* Area
* Missing Evidence
* Missing Documentation
* Missing Verification
* Severity

No recommendations.

---

# 09_Master_Repository_Statistics.md

Produce repository statistics.

Include

* Total Documents
* Documents by Layer
* Documents by Domain
* Duplicate Groups
* Contradictions
* Evidence Gaps
* Terminology Variants
* Repository Coverage
* Repository Completeness

All statistics must be derived from Phase A outputs.

---

# 10_Master_Repository_Index.md

Produce the master index for the architecture repository.

For every document provide

* Document ID
* Title
* Layer
* Domain
* Parent
* Children
* Cross References

This becomes the navigation catalogue for the repository.

---

# Constraints

The model shall

* NOT rewrite architecture.
* NOT merge documents.
* NOT delete documents.
* NOT resolve contradictions.
* NOT remove duplicates.
* NOT invent new architecture.
* NOT infer undocumented relationships.
* NOT change technical decisions.

The output must remain completely evidence-driven.

---

# Deliverable

Produce the ten repository consolidation documents described above.

The resulting output shall define the complete repository structure that will be used as the foundation for **Phase C — Architecture Consolidation and Canonicalisation**.
