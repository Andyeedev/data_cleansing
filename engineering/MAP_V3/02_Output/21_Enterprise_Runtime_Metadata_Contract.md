# MAP Nexus Enterprise Platform — Enterprise Runtime Metadata Contract

**Document ID:** 21
**Version:** 1.0
**Date:** 2026-07-20
**Status:** Draft — Pending Review
**Classification:** Architecture Standard

---

## 1. Purpose

This document defines the **canonical runtime metadata contract** for the MAP Nexus™ platform. It establishes the minimum metadata required for each business capability to support:

- Capability identification
- Routing
- Navigation
- Permissions
- API mapping
- Frontend generation
- CLI/API/frontend traceability

This contract resolves **Policy Gap PG-1** identified in Phase 2 and verified in Phase 3.5.

---

## 2. Context

Phase 3.5 verified that no approved runtime metadata contract existed within the approved MAP architecture. The approved architecture documents define capabilities at a policy level (Doc 16) and describe implementation details (Doc 03, Doc 04, Doc 05), but no document defines a formal metadata contract that specifies how capabilities should be described in a machine-readable format.

This document establishes that contract.

---

## 3. Scope

| In Scope | Out of Scope |
|----------|-------------|
| Capability metadata structure | Implementation details |
| Routing metadata | Database schema changes |
| Navigation metadata | Frontend component designs |
| Permission metadata | CLI command implementations |
| API mapping metadata | New business capabilities |
| Frontend generation metadata | Platform redesign |
| Cross-layer traceability | |

---

## 4. Metadata Contract

### 4.1 Capability Metadata Record

Every business capability in MAP shall have a corresponding metadata record containing the following fields:

| # | Field | Type | Mandatory | Description |
|---|-------|------|-----------|-------------|
| 1 | `capabilityId` | String | Yes | Unique identifier. Format: `{domain}.{capability}` e.g. `migration.connectionManagement` |
| 2 | `domain` | Enum | Yes | Business domain. Must match Doc 16 §3 domain classification. |
| 3 | `name` | String | Yes | Human-readable capability name. |
| 4 | `description` | String | Yes | Purpose of the capability. |
| 5 | `version` | String | Yes | Semantic version of the metadata record. |
| 6 | `status` | Enum | Yes | Lifecycle state: `active`, `deprecated`, `planned`, `removed`. |
| 7 | `owner` | String | Yes | Business owner team. Must match Doc 16 §4 ownership. |
| 8 | `primaryUsers` | List[String] | Yes | Primary user roles. Must match Doc 16 §4 user classification. |
| 9 | `policyReference` | String | Yes | Reference to Doc 16 section. e.g. `Doc 16 §4.1 #1.2` |
| 10 | `cliReference` | String | No | Reference to CLI implementation module. e.g. `app/db/connection_resolver.py` |
| 11 | `apiReference` | String | No | Reference to API endpoint. e.g. `/api/v1/systems/` |
| 12 | `databaseReference` | List[String] | No | References to database objects. e.g. `["core.system_registry"]` |
| 13 | `frontendReference` | String | No | Reference to frontend consumer. e.g. `useSystems.ts` |
| 14 | `implementationStatus` | Enum | Yes | Current implementation state: `covered`, `partial`, `missing` |

### 4.2 Domain Enumeration

| Domain ID | Domain Name | Value |
|-----------|-------------|-------|
| 1 | Migration Management | `migration` |
| 2 | Validation Management | `validation` |
| 3 | Governance & Compliance | `governance` |
| 4 | Reporting & Analytics | `reporting` |
| 5 | Platform Services | `platform` |
| 6 | Administration | `administration` |

### 4.3 Status Enumeration

| Status | Description |
|--------|-------------|
| `active` | Capability is implemented and in use |
| `deprecated` | Capability is superseded or no longer recommended |
| `planned` | Capability is defined in policy but not yet implemented |
| `removed` | Capability has been removed from the platform |

### 4.4 Implementation Status Enumeration

| Status | Description |
|--------|-------------|
| `covered` | CLI/API/frontend fully implemented and connected |
| `partial` | Some layers implemented, gaps exist |
| `missing` | No implementation exists |

---

## 5. Routing Metadata

### 5.1 Routing Record

Each capability that exposes a frontend route shall have a routing metadata record:

| # | Field | Type | Mandatory | Description |
|---|-------|------|-----------|-------------|
| 1 | `capabilityId` | String | Yes | Reference to capability metadata record. |
| 2 | `routePath` | String | Yes | Frontend route path. e.g. `/systems` |
| 3 | `routeKey` | String | Yes | Route constant name. e.g. `SYSTEMS` |
| 4 | `parentRoute` | String | No | Parent route path. e.g. `/administration` |
| 5 | `isDefault` | Boolean | No | Whether this is the default route for the parent. |
| 6 | `requiresAuth` | Boolean | Yes | Whether authentication is required. Default: `true`. |
| 7 | `requiresRole` | List[String] | No | Roles required to access this route. |

### 5.2 Route Path Conventions

| Convention | Example | Description |
|-----------|---------|-------------|
| Root path | `/{domain}` | Domain root. e.g. `/migration` |
| Capability path | `/{domain}/{capability}` | Capability path. e.g. `/migration/projects` |
| Nested path | `/{domain}/{parent}/{child}` | Nested capability. e.g. `/administration/users/roles` |

---

## 6. Navigation Metadata

### 6.1 Navigation Record

Each capability that appears in navigation shall have a navigation metadata record:

| # | Field | Type | Mandatory | Description |
|---|-------|------|-----------|-------------|
| 1 | `capabilityId` | String | Yes | Reference to capability metadata record. |
| 2 | `navItemId` | String | Yes | Unique navigation item identifier. |
| 3 | `label` | String | Yes | Display label in navigation. |
| 4 | `icon` | String | Yes | Icon identifier (Lucide icon name). |
| 5 | `navGroup` | Enum | Yes | Navigation group: `main`, `operations`, `system`, `portals`. |
| 6 | `navOrder` | Integer | Yes | Display order within the navigation group. |
| 7 | `parentNavItemId` | String | No | Parent navigation item for nested menus. |
| 8 | `visible` | Boolean | Yes | Whether item is visible in navigation. Default: `true`. |
| 9 | `badge` | Object | No | Badge configuration for notification counts. |

### 6.2 Navigation Group Enumeration

| Group | Description | Portals |
|-------|-------------|---------|
| `main` | Primary navigation sidebar | Executive Dashboard |
| `operations` | Operations workspace navigation | Operations, Migration, Governance, Reporting, Task Management |
| `system` | System administration navigation | Security, Administration, AI |
| `portals` | Portal-specific navigation | Task Management |

### 6.3 Navigation Hierarchy

Navigation items may be nested up to 2 levels:

```
Level 0: Domain (e.g. Migration)
Level 1: Capability (e.g. Projects, Connections)
Level 2: Sub-capability (e.g. Connection Details) [optional]
```

---

## 7. Permission Metadata

### 7.1 Permission Record

Each capability shall have a permission metadata record:

| # | Field | Type | Mandatory | Description |
|---|-------|------|-----------|-------------|
| 1 | `capabilityId` | String | Yes | Reference to capability metadata record. |
| 2 | `permissionKey` | String | Yes | Permission identifier. Format: `{domain}:{action}` e.g. `migration:read` |
| 3 | `description` | String | Yes | Human-readable permission description. |
| 4 | `allowedRoles` | List[String] | Yes | Roles that have this permission by default. |
| 5 | `requireAll` | Boolean | No | Whether all roles are required (AND) vs any role (OR). Default: `false`. |

### 7.2 Permission Actions

| Action | Description |
|--------|-------------|
| `read` | View capability data |
| `write` | Create or update capability data |
| `delete` | Delete capability data |
| `execute` | Execute capability operations |
| `manage` | Full management access |
| `approve` | Approve capability actions |

### 7.3 Role Definitions

| Role | Description |
|------|-------------|
| `admin` | Full platform access |
| `manager` | Management access to assigned domains |
| `operator` | Operational access to migration and validation |
| `analyst` | Read access to reporting and analytics |
| `viewer` | Read-only access |
| `migration-engineer` | Migration-specific operations |
| `compliance-officer` | Governance and compliance operations |
| `auditor` | Audit and reporting access |
| `security-analyst` | Security operations |
| `ai-user` | AI assistant access |

---

## 8. API Mapping Metadata

### 8.1 API Mapping Record

Each capability that exposes an API endpoint shall have an API mapping record:

| # | Field | Type | Mandatory | Description |
|---|-------|------|-----------|-------------|
| 1 | `capabilityId` | String | Yes | Reference to capability metadata record. |
| 2 | `apiBase` | String | Yes | API base path. e.g. `/api/v1/systems` |
| 3 | `methods` | List[String] | Yes | Supported HTTP methods. e.g. `["GET", "POST", "PUT", "DELETE"]` |
| 4 | `authRequired` | Boolean | Yes | Whether authentication is required. Default: `true`. |
| 5 | `requiredPermissions` | List[String] | No | Permissions required to access the API. |
| 6 | `rateLimit` | String | No | Rate limit configuration. e.g. `5/minute` |
| 7 | `version` | String | Yes | API version. Default: `v1`. |

### 8.2 API Path Conventions

| Convention | Example | Description |
|-----------|---------|-------------|
| Collection | `/{resource}` | GET (list), POST (create) |
| Instance | `/{resource}/{id}` | GET (read), PUT (update), DELETE (delete) |
| Action | `/{resource}/{id}/{action}` | POST (execute action) |
| Nested | `/{resource}/{id}/{child}` | GET (list children), POST (create child) |

---

## 9. Frontend Generation Metadata

### 9.1 Frontend Record

Each capability that has a frontend consumer shall have a frontend metadata record:

| # | Field | Type | Mandatory | Description |
|---|-------|------|-----------|-------------|
| 1 | `capabilityId` | String | Yes | Reference to capability metadata record. |
| 2 | `portalId` | String | Yes | Portal this capability belongs to. |
| 3 | `componentName` | String | Yes | Primary React component name. |
| 4 | `componentPath` | String | Yes | Path to component file. |
| 5 | `hookName` | String | No | Custom hook name for data fetching. |
| 6 | `hookPath` | String | No | Path to hook file. |
| 7 | `widgetConfigs` | List[Object] | No | Widget configurations for dashboard rendering. |

### 9.2 Portal Definitions

| Portal ID | Portal Name | Category | Route |
|-----------|-------------|----------|-------|
| `executive` | Executive Portal | executive | `/dashboard/executive` |
| `operations` | Operations Portal | operations | `/operations` |
| `migration` | Migration Portal | migration | `/migration` |
| `governance` | Governance Portal | governance | `/governance` |
| `reporting` | Reporting Portal | reporting | `/reports` |
| `security` | Security Portal | security | `/security` |
| `administration` | Administration Portal | administration | `/administration` |
| `ai` | AI Portal | ai | `/ai` |
| `task-management` | Task Management Portal | operations | `/task-management` |

---

## 10. Cross-Layer Traceability

### 10.1 Traceability Matrix

Each capability metadata record enables traceability across all layers:

```
Policy (Doc 16)
    ↓ policyReference
Capability Metadata
    ↓ cliReference → CLI Implementation
    ↓ apiReference → API Endpoint
    ↓ databaseReference → Database Objects
    ↓ frontendReference → Frontend Consumer
    ↓ routePath → Routing
    ↓ navItemId → Navigation
    ↓ permissionKey → Permissions
```

### 10.2 Gap Identification

When any of the following are missing from a capability metadata record, a gap exists:

| Missing Field | Gap Type | Impact |
|--------------|----------|--------|
| `cliReference` | CLI gap | No CLI implementation |
| `apiReference` | API gap | No API endpoint |
| `databaseReference` | Database gap | No database objects |
| `frontendReference` | Frontend gap | No frontend consumer |
| `routePath` | Routing gap | No frontend route |
| `navItemId` | Navigation gap | Not in navigation |

---

## 11. Navigation Contract Decision

### 11.1 Decision

**Navigation is part of this metadata contract.**

### 11.2 Rationale

1. The 3 competing navigation systems (PortalMetadata.ts, navigation.config.ts, routes.ts) exist because there is no single metadata contract that defines how capabilities map to navigation items.

2. Navigation is a direct derivative of capability metadata. A capability's domain, name, and permissions determine where it appears in navigation and who can see it.

3. Separating navigation into a separate contract would create a new synchronization problem — the same problem that caused the 3 competing systems.

4. The existing frontend types (NavigationItem, PortalDefinition) already define the structure that this metadata contract specifies. This contract formalizes what was previously hardcoded.

### 11.3 Architectural Guidance

The navigation metadata in this contract (Section 6) defines the canonical source of truth. Existing navigation systems shall be reconciled against this contract:

| Current System | Reconciliation |
|---------------|----------------|
| `PortalMetadata.ts` | Portal definitions should be derived from capability metadata by domain |
| `navigation.config.ts` | Navigation items should be derived from capability metadata by navGroup |
| `routes.ts` | Route constants should be derived from capability metadata by routePath |

---

## 12. Cross References

| Document | Relationship |
|----------|-------------|
| Doc 16 — Enterprise Business Capability Model | Source of capability definitions |
| Doc 15 — Enterprise Functional Traceability Architecture | Functional traceability to engine capabilities |
| Doc 03 — Backend Architecture | Backend service implementations |
| Doc 04 — API Architecture | API endpoint definitions |
| Doc 05 — Database Architecture | Database schema and tables |
| Doc 08 — Security Architecture | Security and permission definitions |
| Doc 02 — Portal Architecture | Portal design principles |
| Doc 19/08 — Frontend Architecture | Frontend implementation structure |

---

## 13. Architecture Updates Required

Updates to existing architecture documents and any new deliverables shall be handled through the approved architecture change process.

---

## 14. Implementation Notes

### 14.1 Storage

This contract defines the metadata structure. Storage of metadata records is defined elsewhere.

### 14.2 Runtime Consumption

Runtime consumers shall consume the approved metadata contract. Navigation, routing, and permissions shall be derived from capability metadata.

---

## 15. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | Architecture | Initial draft — resolves PG-1 |

---

**END OF DOCUMENT**
