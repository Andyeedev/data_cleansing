# 07_Standards_Compliance_Analysis.md

# Standards Compliance Analysis

### MAP Nexus Enterprise Architecture — Gap Analysis Phase C

---

## Purpose

This document identifies standards compliance gaps across the MAP Nexus repository. It analyses naming, numbering, folder, and metadata inconsistencies. No redesign, rewriting, merging, or new architecture is proposed.

---

## 1. Naming Inconsistencies

| # | Canonical Term | Variants Found | Documents Affected | Impact |
|---|----------------|----------------|--------------------|--------|
| NI-01 | MAP Nexus Engine | Migration Engine, Validation Engine, MAP Engine, Financial Services Migration Validation Engine | 03_Backend_Architecture.md, 15_Enterprise_Functional_Traceability_Architecture.md, 13_Architecture_Compliance_Audit.md, 20_Enterprise_Implementation_Architecture/, 11_Development_Standards.md | Cross-document traceability broken; 5 variants for 1 product |
| NI-02 | MAP Nexus Enterprise Platform | MAP Nexus Enterprise Platform, MAP Nexus | 02_Portal_Architecture.md, 15_Enterprise_Functional_Traceability_Architecture.md, 16_Enterprise_Business_Capability_Model.md | Branding inconsistency; trademark symbol applied inconsistently |
| NI-03 | Enterprise Portal | React Frontend, Portal, Frontend | 00_Master_Roadmap.md, 15_Enterprise_Functional_Traceability_Architecture.md, 19_Enterprise_Solution_Architecture/ | 4 variants; audience-specific terms used interchangeably |
| NI-04 | Report Centre | Reporting Centre | 02_Portal_Architecture.md, 15_Enterprise_Functional_Traceability_Architecture.md | UK vs US spelling variant |
| NI-05 | MAP Copilot | AI Copilot, AI / MAP Copilot | 00_Master_Roadmap.md, 17_Enterprise_Business_Process_Model/, 16_Enterprise_Business_Capability_Model.md | 3 variants; product name not standardised |
| NI-06 | Backend Services | Business Services, Backend Architecture | 19_Enterprise_Solution_Architecture/, 03_Backend_Architecture.md | Architectural layer vs service concept conflated |
| NI-07 | Validation | Validation Execution, Validation Pipeline | 03_Backend_Architecture.md, 15_Enterprise_Functional_Traceability_Architecture.md | Generic term vs implementation-specific term |
| NI-08 | Migration | Migration Management, Migration Centre | 16_Enterprise_Business_Capability_Model.md, 02_Portal_Architecture.md | Capability vs portal name conflated |
| NI-09 | Governance | Governance & Compliance, Governance Centre | 16_Enterprise_Business_Capability_Model.md, 02_Portal_Architecture.md | Domain vs portal name conflated |
| NI-10 | Reporting | Reporting & Analytics, Reporting Centre | 16_Enterprise_Business_Capability_Model.md, 02_Portal_Architecture.md | Domain vs portal name conflated |
| NI-11 | Platform | Platform Services, Platform Domain | 16_Enterprise_Business_Capability_Model.md, 03_Backend_Architecture.md | Product vs domain vs service conflated |
| NI-12 | Administration | Administration Domain, Administration Service | 16_Enterprise_Business_Capability_Model.md, 03_Backend_Architecture.md | Domain vs service conflated |
| NI-13 | Core Engine | Python Migration Engine | 03_Backend_Architecture.md, 15_Enterprise_Functional_Traceability_Architecture.md | Technology prefix inconsistency |
| NI-14 | Database | PostgreSQL, Data Layer | 03_Backend_Architecture.md, 15_Enterprise_Functional_Traceability_Architecture.md | Product name vs architectural term |
| NI-15 | API | REST API, FastAPI | 04_API_Architecture.md, 15_Enterprise_Functional_Traceability_Architecture.md | Protocol vs framework conflated |

---

## 2. Numbering Inconsistencies

| # | Inconsistency | Evidence | Documents Affected | Severity |
|---|---------------|----------|--------------------|----------|
| NBI-01 | Document number prefix format varies | Layer 1 uses `00_Master` through `13_Arch` (no leading zero on 001_Load_Architecture.md but leading zero on 02-13) | 001_Load_Architecture.md vs 02_Portal_Architecture.md | Medium |
| NBI-02 | Three-digit vs two-digit prefixes | `001_Load_Architecture.md` (3-digit) vs `02_Portal_Architecture.md` (2-digit) | Layer 1 files | Low |
| NBI-03 | Subdirectory numbering scheme | `14_Enterprise_Application_Architecture/` uses `01`-`010` (4-digit `002`-`010`), while `17_` uses `01`-`10`, and `18_` uses `01`-`10`, and `19_` uses `01`-`18`, and `20_` uses `01`-`17` | All subdirectories | Medium |
| NBI-04 | Inconsistent zero-padding in subdirectories | `002_Load_Source_Code.md` through `010_...` use leading zeros in 14_Enterprise_Application_Architecture/ but `01` through `18` use two digits without leading zero in 19_Enterprise_Solution_Architecture/ | Layer 2, Layer 5-8 | Medium |
| NBI-05 | Duplicate document numbering across layers | `01_Product_Architecture.md` exists in 14_Enterprise_Application_Architecture/, and `01_Executive_Summary.md` exists in 17/, 18/, 19/, 20/ | Multiple subdirectories | Low |

---

## 3. Folder Inconsistencies

| # | Inconsistency | Evidence | Impact | Severity |
|---|---------------|----------|--------|----------|
| FI-01 | Standalone files vs subdirectories at same layer | Layer 1 files are standalone `.md` files (00-13), while Layers 2, 5-8 use subdirectories (14/, 17/, 18/, 19/, 20/) | Inconsistent repository structure; Layer 1 cannot be extended without restructuring | Medium |
| FI-02 | Mixed standalone and directory at Layer 1 | `001_Load_Architecture.md` sits alongside `02_Portal_Architecture.md` etc. | No clear separation between standalone docs and grouped docs | Low |
| FI-03 | Layer 3 and Layer 4 are single-file layers | `15_Enterprise_Functional_Traceability_Architecture.md` and `16_Enterprise_Business_Capability_Model.md` are single files, not directories | Inconsistent with Layers 5-8 which use directories for similar scope | Medium |
| FI-04 | Layer naming convention inconsistency | Layers 1-4 use descriptive names; Layers 5-8 use numbered prefixes only | Reader must cross-reference to understand layer purpose | Low |
| FI-05 | Subdirectory naming inconsistency | `14_Enterprise_Application_Architecture/` uses full descriptive name; `17_Enterprise_Business_Process_Model/` uses full name; `19_Enterprise_Solution_Architecture/` uses full name; but file prefixes inside vary | Inconsistent discoverability | Low |

---

## 4. Metadata Inconsistencies

| # | Inconsistency | Evidence | Impact | Severity |
|---|---------------|----------|--------|----------|
| MI-01 | No version metadata in architecture documents | Documents do not carry frontmatter version fields; Phase A inventory is the only versioned source | Cannot trace document evolution; no change history | High |
| MI-02 | No document owner metadata | No author, team, or ownership field in any architecture document | Cannot assign accountability for accuracy | High |
| MI-03 | No status metadata | Documents lack status fields (Draft, Approved, Deprecated) | Cannot determine document currency | High |
| MI-04 | No last-modified metadata | No timestamp or modification date in documents | Cannot determine freshness of content | Medium |
| MI-05 | No cross-reference metadata | Documents do not declare dependencies on other documents | Traceability relies on manual inspection only | High |
| MI-06 | No classification metadata | Documents lack security classification or sensitivity labels | Cannot enforce access controls at document level | Medium |
| MI-07 | Inconsistent section heading format | Some documents use `##` headers, others use `###`; some use `---` separators, others do not | Inconsistent navigation and rendering | Low |
| MI-08 | No table of contents metadata | Documents lack structured TOC metadata | Cannot programmatically generate navigation | Low |

---

## Summary

| Category | Gap Count | Critical | High | Medium | Low |
|----------|-----------|----------|------|--------|-----|
| Naming Inconsistencies | 15 | 0 | 0 | 8 | 7 |
| Numbering Inconsistencies | 5 | 0 | 0 | 3 | 2 |
| Folder Inconsistencies | 5 | 0 | 0 | 2 | 3 |
| Metadata Inconsistencies | 8 | 0 | 4 | 2 | 2 |
| **Total** | **33** | **0** | **4** | **15** | **14** |

---

**Version:** 1.0

**Status:** Phase C — Gap Analysis (identification only)
