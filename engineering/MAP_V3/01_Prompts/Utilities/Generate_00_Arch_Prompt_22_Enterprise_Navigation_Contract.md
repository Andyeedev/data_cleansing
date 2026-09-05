# Generate_00_Arch_Prompt_22_Enterprise_Navigation_Contract.md

# ROLE

You are acting as the MAP Nexus Enterprise Architecture Review Board.

You are NOT designing software.

You are producing an enterprise architecture policy document that becomes part of the approved architecture.

This document resolves Policy Gap PG-2 identified during Phase 2 and verified during Phase 3.5.

The document must be architecture-only.

Do NOT include implementation code.

Do NOT redesign the platform.

Do NOT invent new business capabilities.

---

# AUTHORITATIVE SOURCES

Use ONLY the approved architecture contained within:

engineering/MAP_V2/00_Architecture/

including (but not limited to):

- Enterprise Business Capability Model
- Portal Architecture
- Frontend Architecture
- API Architecture
- Backend Architecture
- Database Architecture
- Security Architecture
- Runtime Metadata Contract (Document 21)

Also review:

MAP_CLI_MVP_Phase_01_Frontend_Freeze_Report.md

particularly the navigation inventory.

---

# CONTEXT

Phase 1 discovered three competing navigation systems:

• PortalMetadata.ts

• navigation.config.ts

• routes.ts

No approved architecture document defines which one is authoritative.

Phase 3.5 therefore verified Policy Gap PG-2:

"No approved canonical navigation contract exists."

This document closes that gap.

---

# OBJECTIVE

Produce

22_Enterprise_Navigation_Contract.md

which becomes part of

engineering/MAP_V2/00_Architecture/

---

# REQUIRED OUTCOME

The document shall define ONE canonical navigation architecture.

It shall explain:

• what navigation is

• what it is NOT

• where navigation originates

• who owns navigation

• how navigation relates to business capabilities

• how navigation relates to runtime metadata

• how navigation relates to routing

• how permissions affect navigation

• how portals derive navigation

• how future frontends consume navigation

without specifying implementation.

---

# REQUIRED SECTIONS

Minimum sections:

1. Purpose

2. Scope

3. Definitions

4. Navigation Principles

5. Canonical Navigation Model

6. Navigation Hierarchy

7. Relationship to Business Capabilities

8. Relationship to Runtime Metadata Contract

9. Relationship to Routing

10. Relationship to Permissions

11. Portal Navigation

12. Navigation Ownership

13. Navigation Governance

14. Architecture Updates Required

15. Cross References

16. Version History

---

# REQUIRED DECISIONS

The document MUST explicitly answer:

## Decision 1

What is the SINGLE source of truth for navigation?

## Decision 2

Is navigation manually defined?

or

derived?

## Decision 3

Can multiple navigation definitions exist?

## Decision 4

Can a frontend create navigation independently?

## Decision 5

Can routes exist without navigation?

## Decision 6

Can navigation exist without capabilities?

---

# REQUIRED ARCHITECTURAL PRINCIPLES

The document shall define principles such as:

- Navigation is derived from approved business capabilities.

- Navigation is not an independent architectural artefact.

- Navigation consumers shall never become the source of truth.

- Runtime metadata supplies navigation information.

- Portals consume navigation.

- Routes consume navigation.

- Permissions filter navigation visibility.

- Only one canonical navigation definition shall exist.

- Duplicate navigation definitions are prohibited.

---

# MUST RESOLVE

The document must explicitly state how the following are reconciled:

PortalMetadata

navigation.config

routes

Explain that these are consumers (or derived artefacts) rather than separate architectural authorities.

Do NOT discuss implementation refactoring.

Only define architectural ownership.

---

# CONSISTENCY REQUIREMENTS

The document MUST align with:

Document 16

Document 02

Document 04

Document 21 (Runtime Metadata Contract)

No contradictions may exist.

---

# OUTPUT

Produce ONLY the completed architecture document.

Do not include explanations.

Do not include commentary.

Do not include implementation guidance.

Do not produce code.

The result must be suitable for promotion into:



---
# Required Deliverables

Produce a draft document.
# Working Output

Generate artefacts into the temporary engineering output area.

engineering/
└── MAP_V2/
    └── 02_Output/
        └──22_Enterprise_Navigation_Contract.md


---


# Production Promotion

Only promote to production after engineering review draft document:

to

engineering/
└── MAP_V2/
    └── 00_Architecture/
        └──22_Enterprise_Navigation_Contract.md