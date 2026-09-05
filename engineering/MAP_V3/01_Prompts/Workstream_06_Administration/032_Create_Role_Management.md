MAP Nexus™ Enterprise Platform
Prompt 032
Create Role Management

Version: 5.0

Prompt ID: 032

Workstream: 06 — Administration

Status: Draft — Pending Review

---

Prerequisites

Complete

Workstream 01 — Platform Foundation
Prompt 000 — Prepare Development Environment
Prompt 001 — Create React Enterprise Solution
Prompt 002 — Create Enterprise Theme System
Prompt 003 — Create Enterprise Navigation System
Prompt 004 — Create Authentication Module
Prompt 005 — Create Enterprise Application Shell
Prompt 006 — Create Analytics & Dashboard Framework
Prompt 007 — Create Widget Framework

Workstream 02 — Portal Development
Prompt 008 — Create Portal Framework
Prompt 009 — Create Executive Portal
Prompt 010 — Create Operations Portal
Prompt 011 — Create Migration Portal
Prompt 012 — Create Governance Portal
Prompt 013 — Create Reporting Portal
Prompt 014 — Create Security Portal
Prompt 015 — Create Administration Portal

Workstream 03 — Presentation Engine
Prompt 016 — Create HTML Reporting Framework
Prompt 017 — Create Report Centre
Prompt 018 — Create Report Viewer
Prompt 019 — Create Report Scheduler
Prompt 020 — Create Report Distribution

Workstream 04 — AI Platform
Prompt 021 — Create AI Framework
Prompt 022 — Create AI Assistant
Prompt 023 — Create AI Insights
Prompt 024 — Create AI Recommendations
Prompt 025 — Create AI Report Generator

---

Purpose

Enhance the Role Management portal within the Administration Portal for MAP Nexus™.

Role Management provides comprehensive role-based access control (RBAC) including role definition, permission management, role hierarchy, and role analytics.

This prompt enhances the placeholder UI created in Prompt 015 with full role management functionality.

---

Objective

Develop a complete Role Management module capable of:

Role Directory — Search, filter, and manage all platform roles
Role Definition — Create, edit, and delete roles
Permission Management — Assign and manage permissions per role
Role Hierarchy — Parent-child role relationships
Role Templates — Predefined role templates for common use cases
Role Assignment — Bulk role assignment and removal
Role Analytics — Usage, distribution, and compliance metrics
Role Auditing — Full audit trail for role changes

---

Design Principles

Role Management shall be

Hierarchical — Parent-child role relationships
Granular — Fine-grained permission control
Auditable — Full audit trail for all changes
Secure — Role change approvals required
Extensible — Custom roles and permissions
Compliant — Separation of duties enforcement
Metadata Driven — Configuration over code
API Ready — RESTful API integration points

---

Architecture

Role Management communicates through

Administration Portal
↓
Role Management UI
↓
Role Management Hook (useRoleManagement)
↓
Role Management Service
↓
Role Management API (Future)

---

Folder Structure

Enhance

src/
portal/
administration/
RoleManagement.tsx (Enhance existing)
hooks/
useRoleManagement.ts
services/
roleManagement.service.ts
types/
roleManagement.types.ts
components/
RoleDirectory.tsx
RoleDefinition.tsx
RolePermissionMatrix.tsx
RoleHierarchy.tsx
RoleTemplates.tsx
RoleAssignment.tsx
RoleAnalytics.tsx
RoleAuditLog.tsx
RoleComparison.tsx
RoleReports.tsx
RoleApprovalWorkflow.tsx
RoleCompliance.tsx

---

Role Types

Role

id: string
name: string
description: string
type: RoleType
parentId?: string
level: number
permissions: RolePermission[]
userCount: number
isSystem: boolean
isDefault: boolean
status: RoleStatus
tenantId: string
createdAt: Date
updatedAt: Date
createdBy: string
metadata?: Record<string, unknown>

RoleType

enum RoleType {
System = 'system',
Custom = 'custom',
Template = 'template',
Virtual = 'virtual'
}

RoleStatus

enum RoleStatus {
Active = 'active',
Inactive = 'inactive',
Deprecated = 'deprecated',
Draft = 'draft'
}

RolePermission

id: string
name: string
resource: string
actions: PermissionAction[]
conditions?: PermissionCondition[]
granted: boolean

PermissionAction

enum PermissionAction {
Create = 'create',
Read = 'read',
Update = 'update',
Delete = 'delete',
Execute = 'execute',
Approve = 'approve',
Export = 'export',
Import = 'import'
}

PermissionCondition

field: string
operator: string
value: unknown

RoleHierarchy

id: string
roleId: string
parentRoleId?: string
childRoleIds: string[]
level: number
path: string

RoleTemplate

id: string
name: string
description: string
category: string
permissions: RolePermission[]
usageCount: number
isPublic: boolean

RoleAssignment

id: string
roleId: string
userId: string
assignedAt: Date
assignedBy: string
expiresAt?: Date
isTemporary: boolean
approvalStatus: ApprovalStatus

ApprovalStatus

enum ApprovalStatus {
Pending = 'pending',
Approved = 'approved',
Rejected = 'rejected',
Expired = 'expired'
}

RoleAuditEntry

id: string
roleId: string
action: string
changes: RoleChange[]
performedBy: string
timestamp: Date
reason?: string

RoleChange

field: string
oldValue: unknown
newValue: unknown

---

Hook: useRoleManagement

const useRoleManagement = (config?: RoleManagementConfig) => {
return {
// Role CRUD
roles: Role[],
selectedRole: Role | null,
loading: boolean,
error: string | null,

// Actions
fetchRoles: (filters?: RoleFilters) => Promise<void>,
getRoleById: (id: string) => Promise<Role>,
createRole: (data: CreateRoleData) => Promise<Role>,
updateRole: (id: string, data: UpdateRoleData) => Promise<Role>,
deleteRole: (id: string) => Promise<void>,
cloneRole: (id: string, name: string) => Promise<Role>,

// Permissions
getRolePermissions: (roleId: string) => Promise<RolePermission[]>,
updateRolePermissions: (roleId: string, permissions: RolePermission[]) => Promise<Role>,
grantPermission: (roleId: string, permissionId: string) => Promise<Role>,
revokePermission: (roleId: string, permissionId: string) => Promise<Role>,

// Hierarchy
getRoleHierarchy: () => Promise<RoleHierarchy[]>,
setParentRole: (roleId: string, parentRoleId: string) => Promise<Role>,
removeParentRole: (roleId: string) => Promise<Role>,
getChildRoles: (roleId: string) => Promise<Role[]>,

// Templates
getRoleTemplates: () => Promise<RoleTemplate[]>,
createFromTemplate: (templateId: string, name: string) => Promise<Role>,

// Assignment
assignRoleToUser: (roleId: string, userId: string, options?: AssignmentOptions) => Promise<RoleAssignment>,
removeRoleFromUser: (roleId: string, userId: string) => Promise<void>,
bulkAssignRole: (roleId: string, userIds: string[]) => Promise<RoleAssignment[]>,
getRoleAssignments: (roleId: string) => Promise<RoleAssignment[]>,

// Analytics
getRoleStats: () => Promise<RoleStats>,
getRoleUsage: (roleId: string) => Promise<RoleUsage>,
getRoleDistribution: () => Promise<RoleDistribution[]>,

// Audit
getRoleAuditLog: (roleId: string) => Promise<RoleAuditEntry[]>,

// Search
searchRoles: (query: string) => Promise<Role[]>,
filterRoles: (filters: RoleFilters) => Promise<Role[]>,
compareRoles: (roleIds: string[]) => Promise<RoleComparison>,
};
};

---

Components

RoleDirectory

Full role listing with search, filters, and bulk actions.

Features:
- Search by name, description, type
- Filter by type, status, hierarchy level
- Sort by name, user count, created
- Bulk select and actions
- Role quick view panel
- Export capabilities

RoleDefinition

Create and edit role definitions.

Features:
- Role creation form
- Role editing interface
- Description and metadata
- Role type selection
- Parent role assignment
- System role protection
- Clone from existing role

RolePermissionMatrix

Visual permission matrix for role-permission mapping.

Features:
- Grid view of roles vs permissions
- Bulk permission toggling
- Permission inheritance display
- Conflict detection
- Copy permissions between roles
- Permission search and filter

RoleHierarchy

Visual role hierarchy tree.

Features:
- Tree view of role hierarchy
- Drag-and-drop reordering
- Parent-child relationship management
- Inheritance path visualization
- Depth limit enforcement
- Circular reference prevention

RoleTemplates

Predefined role templates for common use cases.

Features:
- Template library browsing
- Template categories
- Template preview
- Create role from template
- Custom template creation
- Template sharing

RoleAssignment

Bulk role assignment interface.

Features:
- User selection for assignment
- Role selection for assignment
- Temporary assignment with expiry
- Approval workflow integration
- Assignment history
- Conflict detection

RoleAnalytics

Role usage and distribution analytics.

Features:
- Role usage frequency
- User distribution by role
- Permission coverage analysis
- Compliance metrics
- Trend analysis
- Gap identification

RoleAuditLog

Complete audit trail for role changes.

Features:
- Change history timeline
- Before/after comparison
- User attribution
- Reason tracking
- Export capabilities
- Compliance reporting

RoleComparison

Compare multiple roles side by side.

Features:
- Permission difference view
- User overlap detection
- Hierarchy comparison
- Usage comparison
- Merge recommendations
- Conflict identification

---

Widget Configuration

RoleManagement widgets:

{ id: 'role-1', type: 'status', title: 'Role Directory', size: 'lg' }
{ id: 'role-2', type: 'status', title: 'Active Roles', size: 'lg' }
{ id: 'role-3', type: 'status', title: 'Role Assignments', size: 'lg' }
{ id: 'role-4', type: 'status', title: 'Permission Coverage', size: 'lg' }
{ id: 'role-5', type: 'status', title: 'Role Hierarchy', size: 'lg' }

---

API Integration Points (Future)

GET /api/v1/roles — List roles
GET /api/v1/roles/:id — Get role
POST /api/v1/roles — Create role
PUT /api/v1/roles/:id — Update role
DELETE /api/v1/roles/:id — Delete role
GET /api/v1/roles/:id/permissions — Get role permissions
PUT /api/v1/roles/:id/permissions — Update role permissions
GET /api/v1/roles/:id/hierarchy — Get role hierarchy
PUT /api/v1/roles/:id/hierarchy — Update role hierarchy
GET /api/v1/roles/:id/assignments — Get role assignments
POST /api/v1/roles/:id/assignments — Assign role to user
DELETE /api/v1/roles/:id/assignments/:userId — Remove role from user
GET /api/v1/roles/:id/audit — Get role audit log
GET /api/v1/roles/templates — Get role templates
POST /api/v1/roles/compare — Compare roles

---

Security Considerations

Role Change Control
Approval workflow for role changes
Separation of duties enforcement
Role change notifications
Emergency role assignment process

Permission Management
Least privilege principle
Permission inheritance rules
Permission conflict resolution
Time-bound permissions

Audit Requirements
Complete change audit trail
User attribution
Reason tracking
Compliance reporting

Access Controls
Role management access restricted
System role protection
Role deletion safeguards
Bulk operation approvals

---

Acceptance Criteria

1. Role directory displays all roles with search and filters
2. Role creation and editing works correctly
3. Permission matrix accurately reflects role permissions
4. Role hierarchy displays correctly with inheritance
5. Role templates can be used to create new roles
6. Role assignment works for individual and bulk operations
7. Role analytics display usage metrics
8. Audit trail captures all role changes
9. Role comparison shows differences accurately
10. API integration points are defined

---

Dependencies

Widget Framework (Prompt 007)
Portal Framework (Prompt 008)
Administration Portal (Prompt 015)
Theme System (Prompt 002)
Navigation System (Prompt 003)

---

Future Enhancements

Role-based workflow automation
Role-based notification rules
Role-based reporting
Role-based access reviews
Role-based compliance checks
Role-based analytics

---

# Architecture References

This prompt shall comply with the following architecture documents:

- 05_Database_Architecture.md — Database schema model (core, engine, reporting, platform, audit)
- 11_Development_Standards.md — Coding standards, repository structure, API standards
- 12_Platform_Integration_Architecture.md — Component boundaries, integration contracts

## Schema Model

This implementation targets the **platform** schema within the **migration_engine** database.

```
migration_engine
├── core       ← What we migrate (metadata, connections, datasets, mappings)
├── engine     ← How we execute (batch, controls, rules, governance, scoring)
├── reporting  ← Results (dimensions, report templates, scheduling)
├── platform   ← MAP V2 features (users, roles, workflows, tasks, notifications, calendar, settings)
└── audit      ← Immutable history (audit events, security events, login history, API logs)
```

## Backend Location

The backend application root is `app/` at the project root.

```
app/
├── api/routes/      # FastAPI route handlers
├── api/models/      # Pydantic request/response models
├── services/        # Business logic
├── db/repositories/ # Data access
```

## API Standard

All APIs use the `/api/v1/` prefix with REST conventions and JWT Bearer Token authentication.
