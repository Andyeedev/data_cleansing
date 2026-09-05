# MAP Nexus Enterprise Platform — Enterprise Navigation Contract

**Document ID:** 22
**Version:** 1.0
**Date:** 2026-07-20
**Status:** Draft — Pending Review
**Classification:** Architecture Standard

---

## 1. Purpose

This document defines the **canonical navigation architecture** for the MAP Nexus™ platform. It establishes a single source of truth for navigation, resolving Policy Gap PG-2 identified in Phase 2 and verified in Phase 3.5.

This document defines what navigation is, where it originates, who owns it, and how it relates to business capabilities, runtime metadata, routing, permissions, and portals.

---

## 2. Scope

| In Scope | Out of Scope |
|----------|-------------|
| Navigation architecture | Implementation details |
| Navigation principles | Frontend component designs |
| Navigation ownership | CLI command implementations |
| Navigation governance | Database schema changes |
| Relationship to capabilities | API endpoint implementations |
| Relationship to runtime metadata | |
| Relationship to routing | |
| Relationship to permissions | |
| Portal navigation | |

---

## 3. Definitions

| Term | Definition |
|------|-----------|
| **Navigation** | The hierarchical structure through which users access platform capabilities. |
| **Navigation Item** | A single element in the navigation structure, representing a capability or group of capabilities. |
| **Navigation Group** | A logical grouping of navigation items (e.g. `main`, `operations`, `system`). |
| **Navigation Source** | The origin from which navigation is derived. |
| **Navigation Consumer** | A component that renders or uses navigation (e.g. sidebar, portal, breadcrumb). |
| **Capability** | A business capability as defined in Doc 16. |
| **Runtime Metadata** | The metadata contract defined in Doc 21. |

---

## 4. Navigation Principles

The following principles govern navigation in MAP:

1. Navigation is derived from approved business capabilities.
2. Navigation is not an independent architectural artefact.
3. Navigation consumers shall never become the source of truth.
4. Runtime metadata supplies navigation information.
5. Portals consume navigation.
6. Routes consume navigation.
7. Permissions filter navigation visibility.
8. Only one canonical navigation definition shall exist.
9. Duplicate navigation definitions are prohibited.
10. Navigation shall be consistent across all portals and frontends.

---

## 5. Canonical Navigation Model

### 5.1 Single Source of Truth

**Decision 1: The Runtime Metadata Contract (Doc 21) is the single source of truth for navigation.**

Navigation is defined within the capability metadata record (Doc 21 §6). Each capability that appears in navigation has a navigation metadata record specifying:

- `capabilityId` — reference to the capability
- `navItemId` — unique navigation item identifier
- `label` — display label
- `icon` — icon identifier
- `navGroup` — navigation group membership
- `navOrder` — display order
- `parentNavItemId` — hierarchical parent
- `visible` — visibility flag
- `badge` — notification badge configuration

### 5.2 Derived, Not Manual

**Decision 2: Navigation is derived from capability metadata records.**

Navigation is a derivative of the approved business capability model (Doc 16) as expressed through the runtime metadata contract (Doc 21). Navigation items are not created independently; they are generated from capability metadata records.

### 5.3 Single Definition

**Decision 3: Multiple navigation definitions are prohibited.**

Only one canonical navigation definition shall exist. This definition resides in the runtime metadata contract (Doc 21 §6). Any other navigation definition is a consumer or derived artefact, not an independent authority.

---

## 6. Navigation Hierarchy

### 6.1 Hierarchy Structure

Navigation items are organised in a hierarchy of up to 3 levels:

```
Level 0: Business Domain (e.g. Migration, Validation, Governance)
Level 1: Capability (e.g. Projects, Connections, Discovery)
Level 2: Sub-capability (e.g. Connection Details) [optional]
```

### 6.2 Hierarchy Rules

1. Each navigation item may have zero or one parent.
2. Each navigation item may have zero or more children.
3. Hierarchy depth shall not exceed 3 levels.
4. Parent-child relationships shall be consistent with the capability hierarchy in Doc 16.

### 6.3 Navigation Groups

Navigation items are assigned to navigation groups based on their portal context:

| Group | Description | Portals |
|-------|-------------|---------|
| `main` | Primary navigation sidebar | Executive Dashboard |
| `operations` | Operations workspace navigation | Operations, Migration, Governance, Reporting, Task Management |
| `system` | System administration navigation | Security, Administration, AI |
| `portals` | Portal-specific navigation | Task Management |

---

## 7. Relationship to Business Capabilities

### 7.1 Capability Derivation

Navigation is derived from business capabilities as defined in Doc 16. Every capability exposed through navigation corresponds to exactly one business capability.

### 7.2 Capability Hierarchy to Navigation Hierarchy

| Doc 16 Hierarchy | Navigation Hierarchy |
|-----------------|---------------------|
| Domain | Domain Group (Level 0) |
| Capability | Capability (Level 1) |
| Sub-capability | Sub-capability (Level 2) |

### 7.3 Capability Properties to Navigation Properties

| Doc 16 Property | Navigation Property |
|----------------|---------------------|
| Capability name | `label` |
| Domain | `navGroup` |
| Business owner | Ownership reference |
| Primary users | Permission reference |

---

## 8. Relationship to Runtime Metadata Contract

### 8.1 Metadata as Source

The runtime metadata contract (Doc 21) is the source of truth for navigation. Navigation metadata is defined within the capability metadata record (Doc 21 §6).

### 8.2 Metadata Fields

The following fields in the capability metadata record define navigation:

| Field | Purpose |
|-------|---------|
| `capabilityId` | Links navigation to capability |
| `navItemId` | Unique navigation identifier |
| `label` | Display text |
| `icon` | Visual identifier |
| `navGroup` | Group membership |
| `navOrder` | Display order |
| `parentNavItemId` | Hierarchical position |
| `visible` | Visibility control |
| `badge` | Notification display |

### 8.3 Metadata Consumer Relationship

Navigation consumers (sidebars, portals, breadcrumbs) shall consume the approved metadata contract. They shall not define, modify, or extend navigation independently.

---

## 9. Relationship to Routing

### 9.1 Routing as Separate Concern

Routing is a separate architectural concern from navigation. Routing defines URL paths; navigation defines user-accessible items.

### 9.2 Routing Metadata

Routing is defined in the runtime metadata contract (Doc 21 §5). Each capability that exposes a frontend route has a routing metadata record specifying `routePath`, `routeKey`, and authentication requirements.

### 9.3 Routes Without Navigation

**Decision 5: Routes can exist without navigation.**

A capability may have a route without appearing in navigation. This occurs when:
- The capability is accessed via direct URL
- The capability is a sub-page of another capability
- The capability is deprecated but still accessible

### 9.4 Navigation Without Routes

Every navigable capability shall expose a canonical route. A navigation item without a route has no functional purpose.

---

## 10. Relationship to Permissions

### 10.1 Permission Filtering

Navigation visibility is filtered by permissions. A navigation item is visible to a user only if the user has the required permissions.

### 10.2 Permission Metadata

Permissions are defined in the runtime metadata contract (Doc 21 §7). Each capability has a permission metadata record specifying `permissionKey`, `allowedRoles`, and `requireAll`.

### 10.3 Permission to Navigation Mapping

| Permission Property | Navigation Effect |
|--------------------|--------------------|
| `allowedRoles` | Determines which roles see the navigation item |
| `requireAll` | Determines whether all roles or any role is required |
| `permissionKey` | Links navigation to capability permissions |

---

## 11. Portal Navigation

### 11.1 Portal Definition

Portals are defined in Doc 02 (Portal Architecture). Each portal has a primary navigation structure.

### 11.2 Portal to Navigation Mapping

| Portal | Navigation Group |
|--------|-----------------|
| Executive Dashboard | `main` |
| Operations Portal | `operations` |
| Migration Portal | `operations` |
| Governance Portal | `operations` |
| Reporting Portal | `operations` |
| Security Portal | `system` |
| Administration Portal | `system` |
| AI Portal | `system` |
| Task Management Portal | `portals` |

### 11.3 Portal Consumption

Portals consume navigation from the runtime metadata contract. Portals shall not define, modify, or extend navigation independently.

---

## 12. Navigation Ownership

### 12.1 Ownership Model

| Artefact | Owner |
|----------|-------|
| Business capabilities | Architecture (Doc 16) |
| Capability metadata | Architecture (Doc 21) |
| Navigation metadata | Architecture (Doc 21) |
| Navigation contract | Architecture (Doc 22) |
| Portal definitions | Architecture (Doc 02) |
| Navigation consumers | Implementation |

### 12.2 Ownership Principle

**Decision 4: A frontend cannot create navigation independently.**

Navigation is governed by the approved architecture and derived from the Runtime Metadata Contract. Frontends are consumers of navigation metadata. They shall not define, duplicate, or extend navigation independently. Any navigation change requires an architecture update through the approved change process.

---

## 13. Navigation Governance

### 13.1 Governance Process

Navigation changes shall follow the approved architecture change process:

1. Change request submitted
2. Architecture review
3. Impact assessment on existing navigation
4. Approval or rejection
5. Architecture document update
6. Consumer reconciliation

### 13.2 Consistency Requirements

Navigation shall be consistent across:

- All portals
- All frontends
- All navigation consumers
- The runtime metadata contract

### 13.3 Conflict Resolution

When navigation conflicts arise between consumers, the runtime metadata contract (Doc 21) is the authoritative source. Consumers shall be reconciled against the metadata contract.

---

## 14. Architecture Updates Required

Updates to existing architecture documents and any new deliverables shall be handled through the approved architecture change process.

---

## 15. Cross References

| Document | Relationship |
|----------|-------------|
| Doc 16 — Enterprise Business Capability Model | Source of capability definitions |
| Doc 21 — Enterprise Runtime Metadata Contract | Source of navigation metadata |
| Doc 02 — Portal Architecture | Portal definitions and design principles |
| Doc 04 — API Architecture | API endpoint definitions |
| Doc 08 — Security Architecture | Security and permission definitions |

---

## 16. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | Architecture | Initial draft — resolves PG-2 |

---

**END OF DOCUMENT**
