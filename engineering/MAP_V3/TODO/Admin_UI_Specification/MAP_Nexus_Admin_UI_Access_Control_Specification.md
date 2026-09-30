# MAP Nexus — Admin UI & Access-Control Specification

**Version:** 1.0  
**Status:** Design specification for implementation review  
**Project:** MAP Nexus / MAP_V3  
**Audience:** OpenCode implementation team + product owner  
**Implementation rule:** No code is defined by this document. Implementation must follow this specification and must not introduce parallel/duplicate access-control models.

## 1. Executive decision

The Admin experience is a deliberate hybrid:

- **Design B — Administration Console:** persistent left rail + content/detail pane.
- **Design C — Mission Control:** the `/administration` landing page is a dashboard with governance, capacity, entitlement, security and operational information.
- **Design A — Capability Cards:** dashboard tiles/cards provide status and shortcuts into existing administration sections.
- **Single access model:** `Identity → Role → Permission → Subscription Entitlement → Tenant/Object Scope`.

The tenant dropdown/switcher is **included in this specification** but was intentionally deferred during the earlier UI concept exercise. It is now defined below.

## 2. Non-negotiable principles

1. One authoritative permission model.
2. UI visibility is not security; backend/API authorization is authoritative.
3. Tenant isolation is enforced server-side and at query/object scope.
4. Super Admin is platform/global; Tenant Admin is tenant-scoped.
5. Subscription entitlements are independent of RBAC permissions.
6. Do not create separate permission systems for reports, menus, pages and objects.
7. Preserve existing working functionality and contracts unless this specification explicitly changes them.
8. Do not add duplicate routes, services, tables or permission stores where an existing canonical implementation can be extended.
9. System roles are protected; custom roles are tenant-scoped.
10. Usage limits must be derived from subscription/tenant configuration and enforced server-side.
11. Security-sensitive administrative actions must be auditable.
12. Do not hard-code plan limits or role behavior in multiple frontend components.

## 3. High-level architecture

```text

User / Principal
      │
      ▼
Identity + Tenant Context
      │
      ▼
Role(s) resolved for tenant
      │
      ▼
Permission grants (resource : action)
      │
      ▼
Subscription entitlement gates
      │
      ▼
Tenant / object scope
      │
      ├──────────────► Navigation visibility
      ├──────────────► Page / route access
      ├──────────────► API authorization
      ├──────────────► Object-level access
      └──────────────► Report / feature access

```

The effective authorization envelope controls navigation, routes, API calls, object access and feature/report access.

## 4. Administration shell

```text

┌──────────────────────────────────────────────────────────────────────────────┐
│ MAP Nexus / Administration                                                   │
├───────────────────────┬──────────────────────────────────────────────────────┤
│ ADMINISTRATION        │ OVERVIEW / DETAIL PANE                               │
│                       │                                                      │
│ ▸ Overview            │  Mission Control Dashboard                           │
│ ▸ Users               │  ┌──────────────┐ ┌──────────────┐                  │
│ ▸ Roles & Permissions │  │ Access       │ │ Entitlements │                  │
│ ▸ Invitations         │  │ Capacity     │ │ vs Plan      │                  │
│ ▸ Registrations       │  └──────────────┘ └──────────────┘                  │
│ ▸ Tenants             │  ┌──────────────┐ ┌──────────────┐                  │
│ ▸ Subscriptions       │  │ Security &   │ │ Governance / │                  │
│ ▸ Settings            │  │ Health       │ │ Findings     │                  │
│ ▸ Feature Flags       │  └──────────────┘ └──────────────┘                  │
│ ▸ Security            │                                                      │
│ ▸ Notifications       │  Quick actions → Users / Projects / Reports / etc.  │
│ ▸ Maintenance         │                                                      │
│                       │                                                      │
│ (filtered by effective│ Clicking a card or rail item opens a detail pane.   │
│ permissions + tenant  │                                                      │
│ scope + entitlement)  │                                                      │
└───────────────────────┴──────────────────────────────────────────────────────┘

```

### Persistent rail

The Administration rail contains these logical sections:

- Overview
- Users
- Roles & Permissions
- Invitations
- Registrations
- Tenants
- Subscriptions
- Settings
- Feature Flags
- Security
- Notifications
- Maintenance

The exact visibility is calculated from the effective permission + entitlement + tenant scope. The rail is a UX projection of the same authorization model used by the backend.

### Detail pane

Only one administration section is the active working area at a time. Use a consistent breadcrumb:

`Administration → <Section> → <Detail>`

The detail pane should reuse existing page/table/card components where practical.

## 5. Mission Control dashboard

`/administration` is the landing dashboard.

Recommended dashboard areas:

1. **Governance posture**
   - overall posture/status
   - findings/alerts count
   - link to Audit/Governance

2. **Access capacity**
   - users used / allowed
   - projects used / allowed
   - connections used / allowed
   - shortcuts such as Invite User / Manage Seats

3. **Entitlements vs plan**
   - enabled features
   - unavailable/limited features
   - upgrade/manage-plan shortcut where permitted

4. **Security & health**
   - API/database/notification health
   - active sessions
   - failed logins
   - security-policy shortcut

5. **Role & permission matrix**
   - compact view of effective role coverage
   - link to Roles & Permissions

6. **Pending registrations / operational alerts**
   - only where the principal has access
   - each card links to the relevant section

7. **Quick actions**
   - only actions the principal is permitted to execute.

### Dashboard behavior

Cards are shortcuts, not a second navigation hierarchy.

A card must:
- respect the same permission/entitlement checks as the destination;
- show meaningful current state;
- not expose cross-tenant data to tenant-scoped users;
- not allow a disabled action to bypass backend authorization.

## 6. Tenant dropdown / tenant switcher

The tenant selector is part of the Admin dashboard/console header.

### Super Admin

```text

SUPER ADMIN
┌───────────────────────────────┐
│ Tenant: All Tenants       ▾   │
├───────────────────────────────┤
│ ✓ All Tenants                 │
│   Tenant A                    │
│   Tenant B                    │
│   Tenant C                    │
└───────────────────────────────┘
             │
             ├── All Tenants → aggregate/cross-tenant view
             └── Tenant X    → scoped tenant view

TENANT ADMIN
┌───────────────────────────────┐
│ Tenant: Current Tenant    ▾   │
├───────────────────────────────┤
│ ✓ Current Tenant              │
└───────────────────────────────┘
Tenant Admin must not select or inspect another tenant.

```

Rules:
- `All Tenants` is available to Super Admin.
- Selecting a tenant changes the dashboard and all tenant-scoped detail views to that tenant context.
- All-Tenants views must clearly identify aggregate/cross-tenant data.
- Switching tenant must not mutate the user's role; it changes the viewing/working scope.
- Super Admin retains global controls separately from tenant-scoped controls.
- The selected tenant must be included in API/query context and enforced server-side.

### Tenant Admin

Tenant Admin is locked to its own tenant:
- no tenant picker containing other tenants;
- no cross-tenant aggregate view;
- no route/API parameter may be used to escape tenant scope;
- the UI may display the current tenant as a non-switchable selector or label.

### Context behavior

Changing tenant must refresh:
- dashboard KPIs/charts;
- users;
- projects;
- systems/connections;
- reports;
- findings/audit views;
- entitlement/usage values where tenant-specific.

Global platform data may remain visible only where the user's permission allows it.

## 7. Role model

| Role | Scope | Administration | Tenant access |
|---|---|---|---|
| Super Admin | Platform/global | Full administration; tenant lifecycle; plans; global security; cross-tenant views | All tenants |
| Tenant Admin | Tenant | Tenant users, roles, permissions within allowed boundary, invitations, settings, operations | Own tenant only |
| Migration Lead | Tenant | No general administration | Own tenant; migration/validation operations |
| Data Analyst | Tenant | No general administration | Own tenant; reporting/validation |
| Team Member | Tenant | No general administration | Own tenant; assigned/allowed objects |
| Viewer | Tenant | Read-only | Own tenant; read-only objects/reports |

**Important:** Existing frontend role strings such as `admin`, `manager`, `viewer`, `super_admin` must not become a second role taxonomy. Canonical role identity should be normalized and mapped consistently.

## 8. Permission model

Use a single resource/action capability model.

```text
resource : action
users : view
users : create
users : edit
users : disable

projects : view
projects : create
projects : edit
projects : delete

reports.validation : view
reports.validation : export
```

Representative resources:

| Resource | Example actions | UI surfaces |
|---|---|---|
| users | view, create, edit, disable | Users card, Users page, API |
| roles | view, create, edit, assign | Roles & Permissions |
| invitations | view, create, revoke | Invitations |
| registrations | view, convert | Registrations (Super Admin boundary) |
| tenants | view, create, suspend, edit | Tenants (Super Admin boundary) |
| projects | view, create, edit, delete | Projects |
| systems/connections | view, create, test, edit | Systems / Connections |
| reports | view, export | Reports |
| security | view, manage permitted policy | Security |
| maintenance | view, execute permitted operation | Maintenance |
| subscriptions | view, manage | Subscription / Plans |

The same permission must drive:
- navigation visibility;
- route/page access;
- API authorization;
- object-level access;
- report/feature access.

Do not rely on `requiredRoles` alone for security. Existing `requiredRoles` / `capabilityId` mechanisms can remain as frontend projections during migration to the canonical permission model.

## 9. Subscription entitlements

RBAC answers **who may perform an action**.

Subscription entitlement answers **whether the tenant's plan includes the capability**.

```text
Effective access =
    Identity
    AND Role permission
    AND Subscription entitlement
    AND Tenant/object scope
```

Example:
- Tenant Admin has `reports.validation:view`.
- The tenant's plan includes validation reporting.
- The user may view validation reporting for that tenant.
- If the plan does not include it, the UI may show it as unavailable/upgrade-required, but the API must also reject unauthorized use.

Usage limits such as users, projects and connections must be plan-driven and enforced server-side.

## 10. Super Admin vs Tenant Admin

### Super Admin

May, subject to explicit permission:
- view/manage all tenants;
- create, suspend and manage tenants;
- manage plans/subscriptions;
- manage global security and platform settings;
- manage system roles and permission templates;
- lock/unlock users;
- view cross-tenant operational/governance information;
- switch tenant context.

### Tenant Admin

May, within own tenant and permitted subscription boundary:
- manage tenant users;
- invite/revoke users;
- manage tenant roles within allowed boundaries;
- manage tenant permissions where delegated;
- manage projects, systems and connections;
- manage tenant settings;
- access tenant reports and operational information;
- perform permitted maintenance/security actions.

Tenant Admin must not:
- create/suspend/delete other tenants;
- change subscription plans unless explicitly delegated by a future product decision;
- modify global platform permissions;
- modify Super Admin access;
- access another tenant's objects/data.

## 11. Role & permission management

System roles:
- Super Admin
- Tenant Admin
- Migration Lead
- Data Analyst
- Team Member
- Viewer

System roles are protected.

Custom roles:
- tenant-scoped;
- created from allowed templates/capabilities;
- cannot cross tenant boundaries;
- cannot grant capabilities outside the tenant's subscription entitlement;
- cannot grant protected Super Admin/global capabilities.

The Roles UI should show:
- role name;
- scope;
- assigned users;
- capabilities;
- protected/system status;
- subscription restrictions where relevant.

## 12. Users and subscription capacity

The Users screen should show current usage against plan limits where applicable.

Example:
`5 / 5 users`

Rules:
- user creation/invitation must check entitlement/seat limits server-side;
- UI should explain why an action is unavailable;
- Super Admin may inspect tenant capacity;
- Tenant Admin sees only its own tenant capacity;
- no frontend-only bypass.

## 13. Navigation and route rules

```text

/administration
      │
      ▼
Mission Control (Overview)
      │
      ├── capability card ───────┐
      │                          ▼
      └── rail item ───────► /administration/<section>
                                   │
                                   ▼
                              Detail pane
                                   │
                                   ▼
                           /<section>/<detail>

```

For every admin destination:
1. navigation checks effective capability/entitlement;
2. route protection checks authorization;
3. API endpoint checks authorization;
4. database/query layer enforces tenant/object scope.

A hidden menu item is not a security control.

## 14. Dashboard data and charts

The first implementation should remain intentionally simple.

Preferred visuals:
- KPI/usage cards;
- compact progress bars;
- small trend charts only where data has a meaningful time dimension;
- status indicators;
- findings/alerts counts;
- role/permission summary.

Do not introduce complex charting solely for visual decoration.

Refresh:
- dashboard should have a consistent refresh mechanism;
- data should indicate whether it is live/current or last refreshed;
- avoid excessive API calls by aggregating dashboard data where practical.

## 15. Security and audit requirements

Security-sensitive actions should be auditable, including where applicable:
- user creation/disable/lock/unlock;
- role assignment;
- permission changes;
- invitation/revocation;
- tenant creation/suspension;
- plan/subscription changes;
- security policy changes;
- maintenance actions;
- cross-tenant context changes where appropriate.

Audit records should identify actor, tenant/context, action, target object, timestamp and outcome where the existing audit model supports it.

## 16. Onboarding and subscription provisioning

Subscription selection should establish the tenant's entitlement envelope.

Conceptually:

```text
Selected Plan
     │
     ▼
Tenant Provisioning
     │
     ├── subscription/plan
     ├── limits
     ├── entitlements
     ├── default role templates
     └── enabled capabilities
```

Do not duplicate plan logic in onboarding, dashboard, users, reports and administration pages. Use the canonical subscription/entitlement source.

## 17. Implementation constraints for OpenCode

Before changing code:
1. Inspect the current implementation of navigation, permissions, roles, subscription/plan data, tenant context and route guards.
2. Reuse existing services/tables/components where possible.
3. Identify any conflicting/duplicate permission or role stores before modifying them.
4. Produce a file-level implementation plan for approval if the change affects backend authorization or schema.
5. Preserve backward compatibility for working APIs unless a deliberate migration is approved.
6. Do not add migrations merely to make the UI appear to work.
7. Do not weaken TypeScript, authentication or authorization checks.
8. Do not commit unrelated cleanup.
9. Keep changes within the agreed work package.
10. After implementation, verify frontend build, targeted tests, backend tests and representative authenticated/unauthenticated access cases.

## 18. Acceptance criteria

1. Administration opens on a Mission Control dashboard.
1. Persistent Administration rail is available on every administration screen.
1. Rail, cards, routes and API authorization use one authoritative capability/permission model.
1. Super Admin can use a tenant filter/switcher with an All Tenants option.
1. Tenant Admin is restricted to the current tenant and cannot switch to another tenant.
1. Dashboard cards expose useful status and shortcuts without becoming a second navigation system.
1. A card or rail item opens the corresponding console detail pane.
1. Subscription entitlements can hide, disable or mark unavailable capabilities without bypassing server-side authorization.
1. No frontend-only role check is treated as sufficient security.
1. Global/platform controls are unavailable to Tenant Admin even if a frontend route is manually opened.
1. System roles are protected; custom roles must not grant capabilities outside the tenant/plan boundary.
1. Usage limits (users/projects/connections/etc.) are visible where relevant and enforced server-side.
1. Audit events exist for security-sensitive administration actions.
1. The implementation preserves existing working routes and services unless explicitly changed by this specification.
1. No new duplicate permission store is introduced.

## 19. Implementation sequence

**Stage A — Access-control foundation**
- normalize canonical role vocabulary;
- confirm authoritative permission source;
- confirm tenant/object scope enforcement;
- confirm entitlement source.

**Stage B — Administration shell**
- persistent rail;
- Mission Control landing;
- capability cards;
- detail-pane navigation.

**Stage C — Tenant context**
- Super Admin tenant switcher;
- All Tenants mode;
- Tenant Admin locked tenant scope;
- context propagation and refresh.

**Stage D — Dashboard data**
- capacity;
- entitlements;
- governance;
- security/health;
- operational alerts;
- quick actions.

**Stage E — Admin sections**
- Users;
- Roles & Permissions;
- Invitations;
- Registrations;
- Tenants;
- Subscriptions;
- Settings;
- Feature Flags;
- Security;
- Notifications;
- Maintenance.

**Stage F — Verification**
- build;
- tests;
- RBAC matrix;
- tenant isolation;
- entitlement checks;
- audit evidence.

Do not implement all stages in one uncontrolled change. Each stage should be reviewed and verified before the next.

## 20. Explicit non-goals

This specification does not define:
- billing-provider implementation;
- payment checkout flow;
- redesign of the entire MAP Nexus application shell;
- migration engine logic;
- data validation rule logic;
- unrelated frontend cleanup;
- new permission stores;
- speculative AI administration features.

## 21. OpenCode handover instruction

Treat this document as the authoritative Admin UI and Access-Control design baseline for the next implementation work package.

Before implementation, reconcile it against the live MAP_V3 codebase and report:
- existing components/services/tables that can be reused;
- conflicts with the current role/permission model;
- any schema changes that are genuinely required;
- any existing routes that would be affected;
- proposed staged implementation plan.

**Do not begin broad implementation until the reconciliation and staged plan are reviewed.**
