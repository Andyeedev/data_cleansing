# MAP MVP Screen Catalogue

| Field | Value |
|-------|-------|
| **Document** | MAP MVP Screen Catalogue |
| **Version** | 1.0 |
| **Date** | June 2026 |
| **Status** | Official |

---

## Overview

This catalogue defines every screen in the MAP (Migration Assurance Platform) MVP release. Each screen is assigned a unique identifier, classified by category, and prioritised for sprint delivery. The MVP covers 37 production screens across 4 categories plus 3 future-state screens.

---

## 1. Core Application Screens (SCR-001 — SCR-022)

### SCR-001 — Executive Dashboard

| Field | Value |
|-------|-------|
| **Purpose** | Single-pane executive view of all migration activity, compliance posture, and cost savings across the organisation. |
| **Category** | Core |
| **Complexity** | High |
| **Priority** | P0 |
| **Sprint** | 1 |

**Key Elements:** 4 KPI cards, migration timeline chart, findings-by-severity donut, cost-savings bar chart, recent migrations table, date/subscription/status filters.

---

### SCR-002 — Project List

| Field | Value |
|-------|-------|
| **Purpose** | Displays all migration projects with status, progress, and summary metrics in a searchable, sortable table. |
| **Category** | Core |
| **Complexity** | Medium |
| **Priority** | P0 |
| **Sprint** | 1 |

**Key Elements:** Search bar, status filter tabs, data table (name, subscription, status, progress %, owner, dates), pagination, "Create Project" button.

---

### SCR-003 — Project Detail

| Field | Value |
|-------|-------|
| **Purpose** | Full view of a single migration project including summary KPIs, tabbed sections for overview, resources, validations, findings, and reports. |
| **Category** | Core |
| **Complexity** | High |
| **Priority** | P0 |
| **Sprint** | 1 |

**Key Elements:** Project header (name, status badge, owner, dates), KPI row, tabbed content (Overview, Resources, Validations, Findings, Reports, Settings), action buttons (Edit, Delete, Archive).

---

### SCR-004 — Create Project

| Field | Value |
|-------|-------|
| **Purpose** | Multi-step wizard to define a new migration project with subscription, scope, schedule, and team assignment. |
| **Category** | Core |
| **Complexity** | Medium |
| **Priority** | P0 |
| **Sprint** | 1 |

**Key Elements:** Stepper (Basic Info → Scope → Schedule → Review), form fields (name, description, subscription picker, date range, team selector), validation messages, back/next/submit buttons.

---

### SCR-005 — Subscription List

| Field | Value |
|-------|-------|
| **Purpose** | Lists all Azure subscriptions connected to MAP with connection status, resource count, and last scan time. |
| **Category** | Core |
| **Complexity** | Low |
| **Priority** | P1 |
| **Sprint** | 2 |

**Key Elements:** Search bar, status filter, data table (subscription name, ID, status, resource count, last scan, actions), "Connect Subscription" button, pagination.

---

### SCR-006 — Connect Subscription

| Field | Value |
|-------|-------|
| **Purpose** | Guided workflow to authenticate and register an Azure subscription for discovery and validation. |
| **Category** | Core |
| **Complexity** | Medium |
| **Priority** | P1 |
| **Sprint** | 2 |

**Key Elements:** Multi-step form (Select Subscription → Authenticate → Configure Permissions → Verify → Confirm), Azure AD login flow, permission checklist, success/failure feedback.

---

### SCR-007 — Resource Inventory

| Field | Value |
|-------|-------|
| **Purpose** | Comprehensive catalogue of all discovered Azure resources across subscriptions with type, status, and cost data. |
| **Category** | Core |
| **Complexity** | Medium |
| **Priority** | P0 |
| **Sprint** | 2 |

**Key Elements:** Advanced filter bar (type, status, subscription, region, cost range), data table (name, type, status, subscription, region, monthly cost, last modified), export button, bulk selection.

---

### SCR-008 — Resource Detail

| Field | Value |
|-------|-------|
| **Purpose** | Deep view of a single Azure resource including configuration, dependencies, cost, and migration readiness. |
| **Category** | Core |
| **Complexity** | Medium |
| **Priority** | P1 |
| **Sprint** | 2 |

**Key Elements:** Resource header (name, type, status, subscription), tabbed content (Configuration, Dependencies, Cost, Validation, History), property grid, dependency links, related resources list.

---

### SCR-009 — Dependency Map

| Field | Value |
|-------|-------|
| **Purpose** | Visual representation of resource dependencies across the migration scope to identify risks and sequencing. |
| **Category** | Core |
| **Complexity** | High |
| **Priority** | P1 |
| **Sprint** | 2 |

**Key Elements:** Interactive graph/canvas (nodes = resources, edges = dependencies), legend, zoom/pan controls, filter by type/status, detail panel on node click, minimap.

---

### SCR-010 — Validation Runs

| Field | Value |
|-------|-------|
| **Purpose** | Lists all validation execution runs with status, findings summary, duration, and date. |
| **Category** | Core |
| **Complexity** | Medium |
| **Priority** | P0 |
| **Sprint** | 3 |

**Key Elements:** Search bar, status filter, data table (run ID, project, status, findings count, duration, date), "Execute Validation" button, pagination.

---

### SCR-011 — Validation Run Detail

| Field | Value |
|-------|-------|
| **Purpose** | Detailed view of a single validation run showing all checks executed, results, findings, and execution log. |
| **Category** | Core |
| **Complexity** | Medium |
| **Priority** | P1 |
| **Sprint** | 3 |

**Key Elements:** Run header (ID, status, project, duration, date), summary KPIs (total checks, pass/fail/warn counts), findings table, execution log, re-run button, export button.

---

### SCR-012 — Validation Execute

| Field | Value |
|-------|-------|
| **Purpose** | Configuration screen to select validation rules, target scope, and execute a new validation run. |
| **Category** | Core |
| **Complexity** | Medium |
| **Priority** | P0 |
| **Sprint** | 3 |

**Key Elements:** Rule selection checklist, scope selector (project/resource), schedule options (now/later/recurring), advanced options panel, "Run Now" button, estimated duration display.

---

### SCR-013 — Findings List

| Field | Value |
|-------|-------|
| **Purpose** | Aggregated view of all validation findings across projects with severity, status, and assignment. |
| **Category** | Core |
| **Complexity** | Medium |
| **Priority** | P0 |
| **Sprint** | 3 |

**Key Elements:** Severity filter (Critical/High/Medium/Low), status filter (Open/In Progress/Resolved/Dismissed), data table (finding ID, title, severity, status, project, resource, assignee), bulk actions, export.

---

### SCR-014 — Finding Detail

| Field | Value |
|-------|-------|
| **Purpose** | Full view of a single finding including description, impact analysis, remediation guidance, and activity history. |
| **Category** | Core |
| **Complexity** | Medium |
| **Priority** | P1 |
| **Sprint** | 3 |

**Key Elements:** Finding header (ID, title, severity badge, status badge), description, impact summary, remediation steps, affected resources list, activity timeline, comment section, status change button, edit button.

---

### SCR-015 — Report List

| Field | Value |
|-------|-------|
| **Purpose** | Lists all generated reports with type, project, status, and download links. |
| **Category** | Core |
| **Complexity** | Low |
| **Priority** | P1 |
| **Sprint** | 4 |

**Key Elements:** Search bar, type filter (Compliance/Executive/Technical), data table (report name, project, type, generated date, status, actions), "Generate Report" button, pagination.

---

### SCR-016 — Report Generate

| Field | Value |
|-------|-------|
| **Purpose** | Wizard to configure and generate a new report selecting template, scope, format, and distribution. |
| **Category** | Core |
| **Complexity** | Medium |
| **Priority** | P1 |
| **Sprint** | 4 |

**Key Elements:** Template selector, scope selector (project/date range), format options (PDF/Excel/PowerPoint), section toggles, recipient list, "Generate" button, preview option.

---

### SCR-017 — Report Viewer

| Field | Value |
|-------|-------|
| **Purpose** | In-app viewer for rendered reports with zoom, page navigation, and export options. |
| **Category** | Core |
| **Complexity** | Medium |
| **Priority** | P1 |
| **Sprint** | 4 |

**Key Elements:** PDF viewer canvas, page navigation, zoom controls, download button (PDF/Excel), email share button, print button, metadata sidebar (project, date, version).

---

### SCR-018 — Policy List

| Field | Value |
|-------|-------|
| **Purpose** | Displays all governance policies with category, status, enforcement mode, and compliance rate. |
| **Category** | Core |
| **Complexity** | Medium |
| **Priority** | P1 |
| **Sprint** | 4 |

**Key Elements:** Category filter, status filter, data table (policy name, category, status, enforcement, compliance rate, last evaluated), "Create Policy" button, pagination.

---

### SCR-019 — Policy Detail

| Field | Value |
|-------|-------|
| **Purpose** | Full view of a governance policy including rule definition, scope, compliance history, and violation list. |
| **Category** | Core |
| **Complexity** | Medium |
| **Priority** | P1 |
| **Sprint** | 4 |

**Key Elements:** Policy header (name, status badge, category), rule definition editor, scope selector, compliance trend chart, recent violations table, edit/delete buttons, "Evaluate Now" button.

---

### SCR-020 — Create Policy

| Field | Value |
|-------|-------|
| **Purpose** | Form to author a new governance policy with rule logic, scope, enforcement mode, and notification settings. |
| **Category** | Core |
| **Complexity** | High |
| **Priority** | P1 |
| **Sprint** | 4 |

**Key Elements:** Form (name, description, category picker), rule builder (condition editor with AND/OR logic), scope selector, enforcement mode toggle (Audit/Enforce), notification config, test button, save/publish buttons.

---

### SCR-021 — Compliance Dashboard

| Field | Value |
|-------|-------|
| **Purpose** | Aggregated view of compliance posture across all policies, resources, and subscriptions. |
| **Category** | Core |
| **Complexity** | High |
| **Priority** | P1 |
| **Sprint** | 4 |

**Key Elements:** Overall compliance score KPI, compliance-by-policy donut, compliance-by-resource bar chart, trend line chart, violations table, policy list, date range filter.

---

### SCR-022 — AI Insights

| Field | Value |
|-------|-------|
| **Purpose** | AI-powered recommendations for migration sequencing, risk mitigation, and cost optimisation. |
| **Category** | Core |
| **Complexity** | High |
| **Priority** | P2 |
| **Sprint** | 5 |

**Key Elements:** Insight cards (recommendation, confidence %, impact), filtering by category (Sequencing/Risk/Cost), recommendation detail view, "Apply Recommendation" action, feedback mechanism (thumbs up/down), history of applied insights.

---

## 2. Admin Screens (SCR-023 — SCR-029)

### SCR-023 — User Management

| Field | Value |
|-------|-------|
| **Purpose** | Admin screen to view, create, edit, and deactivate user accounts. |
| **Category** | Admin |
| **Complexity** | Medium |
| **Priority** | P0 |
| **Sprint** | 1 |

**Key Elements:** Search bar, status filter, data table (name, email, role, status, last login, actions), "Invite User" button, bulk actions, pagination.

---

### SCR-024 — User Detail

| Field | Value |
|-------|-------|
| **Purpose** | Full view of a user account including profile, role assignments, activity history, and session data. |
| **Category** | Admin |
| **Complexity** | Low |
| **Priority** | P1 |
| **Sprint** | 1 |

**Key Elements:** User profile header, role assignment panel, activity log, session list, edit/disable/delete buttons.

---

### SCR-025 — Role Management

| Field | Value |
|-------|-------|
| **Purpose** | Define and manage RBAC roles with granular permission assignments. |
| **Category** | Admin |
| **Complexity** | High |
| **Priority** | P0 |
| **Sprint** | 1 |

**Key Elements:** Role list sidebar, permission matrix editor (module → read/create/update/delete checkboxes), role name/description fields, user assignment panel, save/delete buttons.

---

### SCR-026 — Settings

| Field | Value |
|-------|-------|
| **Purpose** | Platform configuration including general settings, integrations, email, and security options. |
| **Category** | Admin |
| **Complexity** | Medium |
| **Priority** | P0 |
| **Sprint** | 2 |

**Key Elements:** Settings tabs (General, Integrations, Email, Security, Billing), form fields per tab, save button, reset defaults button, warning dialogs for destructive changes.

---

### SCR-027 — Audit Log

| Field | Value |
|-------|-------|
| **Purpose** | Searchable, immutable record of all user and system actions for compliance and forensics. |
| **Category** | Admin |
| **Complexity** | Medium |
| **Priority** | P1 |
| **Sprint** | 3 |

**Key Elements:** Advanced search (user, action, date range, resource), data table (timestamp, user, action, resource, IP, status), export button, detail drawer on row click, pagination.

---

### SCR-028 — API Keys

| Field | Value |
|-------|-------|
| **Purpose** | Manage API keys for programmatic access including creation, rotation, and revocation. |
| **Category** | Admin |
| **Complexity** | Low |
| **Priority** | P2 |
| **Sprint** | 5 |

**Key Elements:** API key list (name, prefix, created, last used, expires, status), "Generate Key" button, key detail drawer (full key shown once, usage stats, revoke button), rate limit display.

---

### SCR-029 — System Health

| Field | Value |
|-------|-------|
| **Purpose** | Real-time monitoring of platform services, dependencies, and infrastructure health. |
| **Category** | Admin |
| **Complexity** | High |
| **Priority** | P2 |
| **Sprint** | 5 |

**Key Elements:** Service status grid (name, status, latency, uptime %), resource utilisation gauges (CPU, memory, storage), dependency health, alert panel, log viewer, refresh controls.

---

## 3. Auth Screens (SCR-030 — SCR-032)

### SCR-030 — Login

| Field | Value |
|-------|-------|
| **Purpose** | Primary authentication screen with email/password and SSO options. |
| **Category** | Auth |
| **Complexity** | Low |
| **Priority** | P0 |
| **Sprint** | 0 |

**Key Elements:** Logo, email field, password field, "Sign In" button, "Forgot Password" link, SSO button (Microsoft/Azure AD), "Request Access" link, error messages.

---

### SCR-031 — SSO Callback

| Field | Value |
|-------|-------|
| **Purpose** | Handles OAuth/OIDC callback from identity provider after SSO authentication. |
| **Category** | Auth |
| **Complexity** | Low |
| **Priority** | P0 |
| **Sprint** | 0 |

**Key Elements:** Loading spinner, status message, error handling with retry, redirect logic.

---

### SCR-032 — Password Reset

| Field | Value |
|-------|-------|
| **Purpose** | Self-service password reset flow triggered from login or admin action. |
| **Category** | Auth |
| **Complexity** | Low |
| **Priority** | P1 |
| **Sprint** | 1 |

**Key Elements:** Email input form, "Send Reset Link" button, success confirmation, password reset form (new password, confirm), validation rules, strength indicator.

---

## 4. Support Screens (SCR-033 — SCR-037)

### SCR-033 — Notifications

| Field | Value |
|-------|-------|
| **Purpose** | Centre for in-app and email notifications with user preferences. |
| **Category** | Support |
| **Complexity** | Medium |
| **Priority** | P1 |
| **Sprint** | 3 |

**Key Elements:** Notification bell (unread count badge), dropdown panel (recent notifications), full notification list, read/unread status, notification preferences form, mark all read button.

---

### SCR-034 — Help Center

| Field | Value |
|-------|-------|
| **Purpose** | In-app help with searchable articles, FAQs, and contact support option. |
| **Category** | Support |
| **Complexity** | Low |
| **Priority** | P2 |
| **Sprint** | 5 |

**Key Elements:** Search bar, category navigation, article list, article viewer, "Contact Support" button, feedback form, context-sensitive help links.

---

### SCR-035 — Documentation

| Field | Value |
|-------|-------|
| **Purpose** | Full product documentation viewer with navigation, search, and versioning. |
| **Category** | Support |
| **Complexity** | Low |
| **Priority** | P2 |
| **Sprint** | 5 |

**Key Elements:** Sidebar navigation (collapsible tree), content area, search, version selector, table of contents, code snippets, copy buttons, external links.

---

### SCR-036 — Profile

| Field | Value |
|-------|-------|
| **Purpose** | User profile management including personal info, preferences, and security settings. |
| **Category** | Support |
| **Complexity** | Low |
| **Priority** | P1 |
| **Sprint** | 2 |

**Key Elements:** Avatar, personal info form (name, email, phone), preferences (theme, timezone, language), security (password change, MFA, sessions), notification preferences, save button.

---

### SCR-037 — Activity Feed

| Field | Value |
|-------|-------|
| **Purpose** | Chronological feed of all user and system activities relevant to the current user. |
| **Category** | Support |
| **Complexity** | Low |
| **Priority** | P2 |
| **Sprint** | 4 |

**Key Elements:** Timeline view, activity items (icon, description, timestamp, user), filter by type, load more button, link to related entities.

---

## 5. Future Screens (Not MVP)

### SCR-038 — Copilot Chat

| Field | Value |
|-------|-------|
| **Purpose** | AI-powered chat assistant for natural language queries about migration status, findings, and recommendations. |
| **Category** | Future |
| **Complexity** | High |
| **Priority** | P3 |
| **Sprint** | Future |

---

### SCR-039 — Mobile Dashboard

| Field | Value |
|-------|-------|
| **Purpose** | Responsive mobile-optimised dashboard for on-the-go monitoring of critical KPIs and alerts. |
| **Category** | Future |
| **Complexity** | High |
| **Priority** | P3 |
| **Sprint** | Future |

---

### SCR-040 — Marketplace

| Field | Value |
|-------|-------|
| **Purpose** | Discovery and installation of community and partner validation rules, templates, and integrations. |
| **Category** | Future |
| **Complexity** | High |
| **Priority** | P3 |
| **Sprint** | Future |

---

## Summary Statistics

| Category | Count | Priority Breakdown |
|----------|-------|--------------------|
| Core | 22 | P0: 10, P1: 10, P2: 2 |
| Admin | 7 | P0: 3, P1: 2, P2: 2 |
| Auth | 3 | P0: 2, P1: 1 |
| Support | 5 | P1: 2, P2: 3 |
| Future | 3 | P3: 3 |
| **Total** | **40** | **P0: 15, P1: 15, P2: 7, P3: 3** |

## Sprint Distribution

| Sprint | Screens | IDs |
|--------|---------|-----|
| 0 | 2 | SCR-030, SCR-031 |
| 1 | 6 | SCR-001, SCR-002, SCR-003, SCR-004, SCR-023, SCR-024, SCR-025, SCR-032 |
| 2 | 5 | SCR-005, SCR-006, SCR-007, SCR-008, SCR-009, SCR-026, SCR-036 |
| 3 | 4 | SCR-010, SCR-011, SCR-012, SCR-013, SCR-014, SCR-027, SCR-033 |
| 4 | 5 | SCR-015, SCR-016, SCR-017, SCR-018, SCR-019, SCR-020, SCR-021, SCR-037 |
| 5 | 3 | SCR-022, SCR-028, SCR-029, SCR-034, SCR-035 |
| Future | 3 | SCR-038, SCR-039, SCR-040 |
