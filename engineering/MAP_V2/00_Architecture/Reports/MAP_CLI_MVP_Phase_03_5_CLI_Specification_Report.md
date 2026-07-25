# MAP CLI MVP — Phase 3.5: CLI Specification Verification Report

**Phase:** 3.5 — MAP CLI Specification Verification
**Date:** 2026-07-20
**Status:** COMPLETE — Awaiting Approval
**Authoritative Source:** engineering/MAP_V2/00_Architecture/ (all architecture documents)

---

## 1. Goal

Per the execution plan:

> "Audit the current MAP CLI implementation against the approved policy. Determine which capabilities are already implemented, which are partially implemented, and which approved policy capabilities are not yet implemented by the current MAP CLI."

> "Verify whether an approved metadata contract exists. If none is found, record the finding in the Policy Gap Report."

> "Verify whether an approved metadata contract, command structure and runtime lifecycle exist."

This report records findings only. No design, no proposals, no architecture changes.

---

## 2. Verification Methodology

### 2.1 Metadata Contract Verification

Traversed all architecture documents under `engineering/MAP_V2/00_Architecture/` searching for:
- Any document titled or described as a "metadata contract"
- Any definition of capability metadata (machine-readable format for runtime generation)
- Any schema defining how capabilities are described for navigation or UI generation

### 2.2 Navigation Contract Verification

Traversed all architecture documents under `engineering/MAP_V2/00_Architecture/` searching for:
- Any document titled or described as a "navigation contract"
- Any canonical navigation definition that prescribes how navigation should be structured
- Any formal specification linking capabilities to navigation items

### 2.3 CLI Specification Verification

Verified each of the 34 business capabilities against the MAP CLI implementation in `app/`.

---

## 3. Metadata Contract Verification

### 3.1 Architecture Documents Searched

| Document | Contains Metadata Contract? | Finding |
|----------|---------------------------|---------|
| `00_Master_Roadmap.md` | No | Roadmap document |
| `01_Load_Architecture.md` | No | Architecture loading instructions |
| `02_Portal_Architecture.md` | No | Defines navigation at design level (sections, user journeys) — not a formal contract |
| `03_Backend_Architecture.md` | No | Backend service definitions |
| `04_API_Architecture.md` | No | API endpoint definitions |
| `05_Database_Architecture.md` | No | Database schema |
| `06_AI_Architecture.md` | No | AI architecture |
| `07_Reporting_Architecture.md` | No | Reporting architecture |
| `08_Security_Architecture.md` | No | Security architecture |
| `09_Deployment_Architecture.md` | No | Deployment architecture |
| `10_Implementation_Roadmap.md` | No | Implementation roadmap |
| `11_Development_Standards.md` | No | Development standards |
| `12_Platform_Integration_Architecture.md` | No | Integration contracts (API, messaging) — not capability metadata |
| `13_Architecture_Compliance_Audit.md` | No | Compliance audit |
| `15_Enterprise_Functional_Traceability_Architecture.md` | No | Functional traceability |
| `16_Enterprise_Business_Capability_Model.md` | No | Business capability definitions (policy level) — not machine-readable metadata |
| `999_Master_Architecture_Consolidation/` | No | Consolidation reports |

### 3.2 Metadata Model Found

`999_Master_Architecture_Consolidation_Phase_B/06_Master_Metadata_Model.md` defines metadata fields for **architecture documents** in the repository:

| Field | Purpose |
|-------|---------|
| Document ID | Unique identifier for architecture documents |
| Repository ID | Repository instance identifier |
| Version | Document version |
| Owner | Document maintainer |
| Layer | Architecture layer classification |
| Domain | Architecture domain classification |
| Status | Document lifecycle state |
| Parent/Children | Document hierarchy |
| Dependencies | Document dependencies |
| Duplicate Groups | Duplicate register references |
| Contradictions | Contradiction register references |
| Evidence Sources | Source references |
| Last Updated | ISO 8601 date |

**Finding:** This metadata model is for **architecture document management**, not for **runtime capability description**. It does not define how capabilities should be described in a machine-readable format for UI generation, navigation, or runtime behavior.

### 3.3 Metadata Contract Finding

**No approved metadata contract was found after traversing the approved architecture.**

The approved architecture documents define capabilities at a policy level (Doc 16) and describe implementation details (Doc 03, Doc 04, Doc 05), but no document defines a formal metadata contract that specifies:
- How capabilities should be described in a machine-readable format
- What fields a capability metadata record must contain
- How capability metadata maps to navigation, UI, or runtime behavior

---

## 4. Navigation Contract Verification

### 4.1 Architecture Documents Searched

| Document | Contains Navigation Contract? | Finding |
|----------|------------------------------|---------|
| `02_Portal_Architecture.md` | No | Defines navigation at design level: "The Portal navigation consists of the following major sections" (Home, Executive Dashboard, Migration Centre, etc.) — design principles, not a formal contract |
| `19_Enterprise_Solution_Architecture/08_Frontend_Architecture.md` | No | Describes existing navigation implementation (NavigationProvider, routes, portals) — implementation description, not a contract |
| `20_Enterprise_Implementation_Architecture/06_Configuration_Implementation.md` | No | Lists `navigation.ts` as a config file — implementation reference |

### 4.2 Navigation Implementations Found in Codebase

3 competing navigation systems exist in the frontend:

| System | File | Structure | Used By |
|--------|------|-----------|---------|
| Portal Metadata | `src/portal/metadata/PortalMetadata.ts` | 9 portals, each with hardcoded `navigation` arrays | Portal framework |
| Navigation Config | `src/navigation/navigation.config.ts` | 17 top-level nav items with paths, icons, children | Sidebar component |
| Route Constants | `src/config/routes.ts` | 55+ route constants | Various components |

### 4.3 Navigation Contract Finding

**Multiple navigation implementations were identified. No approved canonical navigation contract was found after traversing the approved architecture.**

The approved architecture documents describe navigation at a design level (Portal Architecture §Primary Navigation) and describe the existing implementation (Frontend Architecture), but no document defines a formal navigation contract that specifies:
- A single source of truth for navigation structure
- How navigation items are derived from capability metadata
- How the 3 competing navigation systems should be reconciled

---

## 5. CLI Specification Verification

### 5.1 CLI Implementation Status

Verified each of the 34 business capabilities against the MAP CLI implementation in `app/`:

| Status | Count | Capabilities |
|--------|-------|-------------|
| **Implemented** | 12 | 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3 |
| **Partially Implemented** | 7 | 1.1, 4.1, 4.2, 4.3, 4.4, 6.7, 6.8 |
| **Not Implemented** | 15 | 3.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6 |

### 5.2 Implemented Capabilities (12)

These capabilities have CLI commands or internal engine logic:

| # | Capability | CLI Implementation |
|---|-----------|-------------------|
| 1.2 | Connection Management | `connection_resolver` |
| 1.3 | Dataset Discovery | CLI `discover` command |
| 1.4 | Dataset Mapping | Auto-created during discovery |
| 1.5 | Column Mapping | Auto-created during discovery |
| 2.1 | Rule Discovery | `auto_rule_discovery` |
| 2.2 | Control Discovery | `execution_engine` Step 4 |
| 2.3 | Validation Execution | 6-step pipeline |
| 2.4 | Checkpointing | Checkpoint/resume logic |
| 2.5 | Retry Engine | `rule_retry_manager` |
| 3.1 | Governance Decisions | `decision_engine` |
| 3.2 | Risk Scoring | `scoring_engine`, `risk_scoring` |
| 3.3 | Release Gates | Release gate enforcement |

### 5.3 Partially Implemented Capabilities (7)

These capabilities have partial CLI (internal logic but no user-facing command):

| # | Capability | Partial Implementation |
|---|-----------|----------------------|
| 1.1 | Project Management | Batch-level only — no project CRUD |
| 4.1 | Executive Reporting | SQL views only — no API |
| 4.2 | Operational Reporting | SQL views only — no API |
| 4.3 | Governance Reporting | SQL views only — no API |
| 4.4 | Technical Reporting | SQL views only — no API |
| 6.7 | Audit Trail | Middleware logging only — no API |
| 6.8 | Maintenance & Health | Health endpoints only — no CLI |

### 5.4 Not Implemented Capabilities (15)

These capabilities have no CLI implementation:

| # | Capability | Evidence |
|---|-----------|----------|
| 3.4 | Approvals | No CLI command found |
| 4.5 | Dashboard Services | No CLI command found |
| 4.6 | Export Services | CLI `export` exists but no dashboard/export_history |
| 5.1 | Workflow Management | No CLI command found |
| 5.2 | Task Management | No CLI command found |
| 5.3 | Notification Services | No CLI command found |
| 5.4 | Calendar Services | No CLI command found |
| 5.5 | AI / MAP Copilot | No implementation found |
| 5.6 | Authentication | No CLI command found |
| 6.1 | User Management | No CLI command found |
| 6.2 | Role & Permission Mgmt | No CLI command found |
| 6.3 | Tenant Management | No implementation found |
| 6.4 | System Settings | No CLI command found |
| 6.5 | Feature Flags | No CLI command found |
| 6.6 | Security Management | Fernet encryption only — no dedicated CLI |

---

## 6. Policy Gaps Identified

| # | Gap | Finding | Evidence |
|---|-----|---------|----------|
| PG-1 | Metadata contract | No approved metadata contract was found after traversing the approved architecture. The `06_Master_Metadata_Model.md` defines metadata for architecture documents, not for runtime capabilities. | All architecture documents searched — see Section 3 |
| PG-2 | Navigation contract | Multiple navigation implementations were identified (PortalMetadata.ts, navigation.config.ts, routes.ts). Phase 3.5 could not verify the existence of an approved canonical navigation contract. | All architecture documents searched — see Section 4 |
| PG-9 | CLI gaps | 15 of 34 capabilities have no CLI implementation. 7 capabilities have partial CLI. | CLI verification — see Section 5 |

---

## 7. Phase 3.5 Gate

**Phase 4 cannot proceed until architecture approval gates defined in the execution plan have been satisfied.**

**Findings:**
- No approved metadata contract was found after traversing all architecture documents
- No approved canonical navigation contract was found after traversing all architecture documents
- 15 of 34 capabilities have no CLI implementation
- 7 of 34 capabilities have partial CLI
- The `06_Master_Metadata_Model.md` defines metadata for architecture documents, not for runtime capabilities

**STOP. Do not continue to the next phase. Produce the report, wait for user approval, and only proceed after explicit approval.**
