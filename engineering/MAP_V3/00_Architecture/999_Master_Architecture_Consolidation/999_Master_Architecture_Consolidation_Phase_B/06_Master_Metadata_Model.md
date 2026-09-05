# 06_Master_Metadata_Model.md

# Master Metadata Model

### MAP Nexus Enterprise Architecture

---

## Purpose

This document defines the metadata fields required for every architecture document in the MAP Nexus repository. All documents must carry these fields to enable search, governance, traceability, and consolidation.

---

## Metadata Fields

| # | Field | Description | Data Type | Mandatory | Default Value |
|---|-------|-------------|-----------|-----------|---------------|
| 1 | Document ID | Unique identifier for the document within the repository. Format: `MAP-<Layer>-<Domain>-<Seq>` | String | Yes | — |
| 2 | Repository ID | Identifier for the repository instance this document belongs to. Format: `MAP-NEXUS-V2` | String | Yes | `MAP-NEXUS-V2` |
| 3 | Version | Semantic version of the document content. Format: `MAJOR.MINOR` | String | Yes | `1.0` |
| 4 | Owner | Person or team responsible for maintaining the document content. | String | Yes | — |
| 5 | Layer | Architecture layer the document belongs to. Must match one of the 8 repository layers. | Enum | Yes | — |
| 6 | Domain | Architecture domain the document addresses. Must match one of the 9 repository domains. | Enum | Yes | — |
| 7 | Status | Current lifecycle state of the document. | Enum | Yes | `Draft` |
| 8 | Parent | Document ID of the parent document in the repository hierarchy. Null if top-level. | String | No | `Null` |
| 9 | Children | List of Document IDs of child documents in the repository hierarchy. Empty list if leaf. | List[String] | No | `[]` |
| 10 | Dependencies | List of Document IDs that this document depends on or references. | List[String] | No | `[]` |
| 11 | Duplicate Groups | List of Duplicate Group IDs from Phase A Duplicate Register that this document belongs to. | List[String] | No | `[]` |
| 12 | Contradictions | List of Contradiction IDs from Phase A Contradiction Register that this document is involved in. | List[String] | No | `[]` |
| 13 | Evidence Sources | List of source references (file paths, line numbers) providing evidence for the document content. | List[String] | No | `[]` |
| 14 | Last Updated | ISO 8601 date of the most recent content change. | Date | Yes | — |

---

## Enumerations

### Layer Values

| Layer ID | Layer Name | Description |
|----------|------------|-------------|
| L1 | Core Architecture | Core architectural documents (00-13) |
| L2 | Enterprise Application Architecture | Application architecture (14) |
| L3 | Enterprise Functional Traceability | Functional traceability (15) |
| L4 | Enterprise Business Capability Model | Business capability mapping (16) |
| L5 | Enterprise Business Process Model | Business process architecture (17) |
| L6 | Enterprise Information Data Model | Data model architecture (18) |
| L7 | Enterprise Solution Architecture | Solution design (19) |
| L8 | Enterprise Implementation Architecture | Implementation details (20) |

### Domain Values

| Domain ID | Domain Name |
|-----------|-------------|
| D01 | Enterprise Architecture Planning |
| D02 | Application Architecture |
| D03 | Data Architecture |
| D04 | Integration Architecture |
| D05 | Technology Architecture |
| D06 | Business Architecture |
| D07 | Security Architecture |
| D08 | Infrastructure Architecture |
| D09 | Business Intelligence Architecture |

### Status Values

| Status | Description |
|--------|-------------|
| Draft | Document is under initial authoring |
| Review | Document is under peer or stakeholder review |
| Approved | Document has been approved for use |
| Deprecated | Document is superseded or no longer authoritative |
| Archived | Document is retained for historical reference only |

---

## Metadata Assignment Rules

1. Every document in the repository MUST have all 14 metadata fields populated.
2. Document IDs MUST be unique across the entire repository.
3. Layer and Domain MUST match the classification from Phase A Repository Inventory.
4. Duplicate Groups MUST reference valid Duplicate Group IDs from Phase A Duplicate Register (02_Duplicate_Register.md).
5. Contradictions MUST reference valid Contradiction IDs from Phase A Contradiction Register (03_Contradiction_Register.md).
6. Evidence Sources MUST reference specific file paths and line numbers from the source architecture documents.
7. Parent/Children relationships MUST form a valid tree (no cycles, single root).

---

**Version:** 1.0

**Status:** Phase B Definition
