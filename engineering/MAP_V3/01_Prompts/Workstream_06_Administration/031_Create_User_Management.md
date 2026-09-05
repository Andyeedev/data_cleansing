MAP Nexus™ Enterprise Platform
Prompt 031
Create User Management

Version: 5.0

Prompt ID: 031

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

Enhance the User Management portal within the Administration Portal for MAP Nexus™.

User Management provides comprehensive user lifecycle management including user directory, user provisioning, profile management, access control, and user analytics.

This prompt enhances the placeholder UI created in Prompt 015 with full user management functionality.

---

Objective

Develop a complete User Management module capable of:

User Directory — Search, filter, and manage all platform users
User Provisioning — Create, invite, and onboard new users
Profile Management — User details, preferences, and avatars
Access Control — Role assignments, permissions, and access reviews
User Lifecycle — Onboarding, active, suspended, deactivated states
User Analytics — Usage patterns, activity logs, and engagement metrics
Bulk Operations — Import, export, and batch user management
Security — Password policies, MFA, and session management

---

Design Principles

User Management shall be

Tenant Aware — Users scoped to tenant
Role Based — RBAC enforcement
Auditable — Full user activity audit trail
Secure — Password hashing, MFA, session management
Extensible — Custom fields and attributes
Compliant — GDPR, data retention, privacy
Metadata Driven — Configuration over code
API Ready — RESTful API integration points

---

Architecture

User Management communicates through

Administration Portal
↓
User Management UI
↓
User Management Hook (useUserManagement)
↓
User Management Service
↓
User Management API (Future)

---

Folder Structure

Enhance

src/
portal/
administration/
UserManagement.tsx (Enhance existing)
hooks/
useUserManagement.ts
services/
userManagement.service.ts
types/
userManagement.types.ts
components/
UserDirectory.tsx
UserProvisioning.tsx
UserProfile.tsx
UserAccessControl.tsx
UserLifecycle.tsx
UserAnalytics.tsx
BulkUserOperations.tsx
UserSecurity.tsx
UserInvitation.tsx
UserActivityLog.tsx
UserSessions.tsx
UserReports.tsx

---

User Types

User

id: string
email: string
firstName: string
lastName: string
displayName: string
avatar?: string
status: UserStatus
roles: UserRole[]
permissions: UserPermission[]
tenantId: string
organisationId?: string
departmentId?: string
lastLoginAt?: Date
createdAt: Date
updatedAt: Date
createdBy: string
metadata?: Record<string, unknown>

UserStatus

enum UserStatus {
Active = 'active',
Inactive = 'inactive',
Suspended = 'suspended',
Pending = 'pending',
Locked = 'locked',
Deactivated = 'deactivated'
}

UserRole

id: string
name: string
description: string
permissions: UserPermission[]
assignedAt: Date
assignedBy: string

UserPermission

id: string
name: string
resource: string
action: string
conditions?: PermissionCondition[]

UserSession

id: string
userId: string
ipAddress: string
userAgent: string
location?: string
createdAt: Date
expiresAt: Date
isActive: boolean

UserActivity

id: string
userId: string
action: string
resource: string
resourceId?: string
metadata?: Record<string, unknown>
ipAddress: string
timestamp: Date

---

Hook: useUserManagement

const useUserManagement = (config?: UserManagementConfig) => {
return {
// User CRUD
users: User[],
selectedUser: User | null,
loading: boolean,
error: string | null,

// Actions
fetchUsers: (filters?: UserFilters) => Promise<void>,
getUserById: (id: string) => Promise<User>,
createUser: (data: CreateUserData) => Promise<User>,
updateUser: (id: string, data: UpdateUserData) => Promise<User>,
deleteUser: (id: string) => Promise<void>,
bulkImport: (file: File) => Promise<BulkImportResult>,

// User Lifecycle
activateUser: (id: string) => Promise<User>,
deactivateUser: (id: string) => Promise<User>,
suspendUser: (id: string, reason: string) => Promise<User>,
unlockUser: (id: string) => Promise<User>,
resetPassword: (id: string) => Promise<void>,
forcePasswordReset: (id: string) => Promise<void>,

// Role Management
assignRole: (userId: string, roleId: string) => Promise<User>,
removeRole: (userId: string, roleId: string) => Promise<User>,
getUserRoles: (userId: string) => Promise<UserRole[]>,

// Sessions
getUserSessions: (userId: string) => Promise<UserSession[]>,
revokeSession: (userId: string, sessionId: string) => Promise<void>,
revokeAllSessions: (userId: string) => Promise<void>,

// Activity
getUserActivity: (userId: string, filters?: ActivityFilters) => Promise<UserActivity[]>,

// Analytics
getUserStats: () => Promise<UserStats>,
getUserEngagement: (userId: string) => Promise<UserEngagement>,

// Search
searchUsers: (query: string) => Promise<User[]>,
filterUsers: (filters: UserFilters) => Promise<User[]>,
};
};

---

Components

UserDirectory

Full user listing with search, filters, and bulk actions.

Features:
- Search by name, email, role
- Filter by status, role, department, date
- Sort by name, email, last login, created
- Bulk select and actions
- Export to CSV/Excel
- User quick view panel

UserProvisioning

Create and invite new users.

Features:
- Single user creation form
- Bulk user import (CSV/Excel)
- Invitation workflow
- Role assignment during provisioning
- Welcome email templates
- Provisioning status tracking

UserProfile

Detailed user profile view.

Features:
- Personal information
- Role and permission display
- Activity timeline
- Session history
- Documents and attachments
- Notes and comments
- Edit capabilities

UserAccessControl

Manage user roles and permissions.

Features:
- Role assignment interface
- Permission matrix view
- Access review workflow
- Temporary access grants
- Access audit trail
- Compliance reporting

UserLifecycle

Manage user lifecycle states.

Features:
- Onboarding workflow
- Status transitions
- Offboarding checklist
- Data retention policies
- Lifecycle automation
- Approval workflows

UserAnalytics

User engagement and usage analytics.

Features:
- Login frequency charts
- Feature usage metrics
- Activity heatmaps
- Engagement scores
- Trend analysis
- Comparative analytics

---

Widget Configuration

UserManagement widgets:

{ id: 'usr-1', type: 'status', title: 'User Directory', size: 'lg' }
{ id: 'usr-2', type: 'status', title: 'Active Users', size: 'lg' }
{ id: 'usr-3', type: 'status', title: 'User Activity', size: 'lg' }
{ id: 'usr-4', type: 'status', title: 'User Lifecycle', size: 'lg' }
{ id: 'usr-5', type: 'status', title: 'Account Status', size: 'lg' }

---

API Integration Points (Future)

GET /api/v1/users — List users
GET /api/v1/users/:id — Get user
POST /api/v1/users — Create user
PUT /api/v1/users/:id — Update user
DELETE /api/v1/users/:id — Delete user
POST /api/v1/users/:id/activate — Activate user
POST /api/v1/users/:id/deactivate — Deactivate user
POST /api/v1/users/:id/suspend — Suspend user
GET /api/v1/users/:id/roles — Get user roles
POST /api/v1/users/:id/roles — Assign role
DELETE /api/v1/users/:id/roles/:roleId — Remove role
GET /api/v1/users/:id/sessions — Get user sessions
DELETE /api/v1/users/:id/sessions/:sessionId — Revoke session
GET /api/v1/users/:id/activity — Get user activity

---

Security Considerations

Password Policy
Minimum 12 characters
Upper, lower, number, special
Password history (12 minimum)
Account lockout (5 failed attempts)

MFA Support
TOTP authentication
SMS verification
Email verification
Backup codes

Session Management
Configurable session timeout
Concurrent session limits
Session invalidation on password change
Device tracking

Data Protection
GDPR compliance
Data retention policies
Right to erasure
Data export capabilities

---

Acceptance Criteria

1. User directory displays all users with search and filters
2. User provisioning supports single and bulk creation
3. User profiles display complete user information
4. Role assignment works correctly
5. User lifecycle states transition properly
6. User analytics display engagement metrics
7. Bulk operations complete without errors
8. Security policies enforce correctly
9. Audit trail captures all user actions
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

User collaboration features
User group management
User preference sync
User activity notifications
User performance metrics
User learning paths

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
