# MAP MVP Wireframes

| Field | Value |
|-------|-------|
| **Document** | MAP MVP Wireframes |
| **Version** | 1.0 |
| **Date** | June 2026 |
| **Status** | Official |

---

## Overview

Low-fidelity ASCII wireframes for all 22 core application screens (SCR-001 — SCR-022). Each wireframe documents the content area layout, key components, navigation flow, user interactions, business rules, responsive behaviour, and accessibility considerations.

**Layout Shell (shared by all screens):**

```
┌─────────────────────────────────────────────────────────────┐
│  MAP    [Search]                [Notifications] [User ▾]    │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│ Dashboard│  [Breadcrumbs]           [Page Actions]          │
│ Projects │──────────────────────────────────────────────────│
│ Discovery│                                                  │
│  Subs    │  [Page Content]                                  │
│  Resources│                                                 │
│  Deps    │                                                  │
│ Validation│                                                 │
│  Runs    │                                                  │
│  Findings│                                                  │
│ Reports  │                                                  │
│ Govern.  │                                                  │
│ AI Insp. │                                                  │
│ Admin    │──────────────────────────────────────────────────│
│ Settings │  v1.0 | Help | Terms | Status                    │
└──────────┴──────────────────────────────────────────────────┘
```

---

## SCR-001 — Executive Dashboard

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Breadcrumbs] Dashboard > Executive          [Date Range ▾] [Export]│
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │ 47           │ │ 94.2%        │ │ 12           │ │ 87%          ││
│  │ Total Migr.  │ │ Success Rate │ │ Active Finds │ │ Compliance   ││
│  │ ▲ 8 this wk  │ │ ▲ 1.2%       │ │ ▼ 3 resolved │ │ ▲ 2%         ││
│  │ [sparkline]  │ │ [sparkline]  │ │ [sparkline]  │ │ [sparkline]  ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘│
│                                                                      │
│  ┌─────────────────────────────┐ ┌────────────────────────────────┐  │
│  │ Migration Timeline (Line)   │ │ Findings by Severity (Donut)  │  │
│  │                             │ │                                │  │
│  │  ▲                          │ │      ┌───┐                     │  │
│  │  │    ╱╲    ╱╲             │ │   ╱──┤   ├──╲                  │  │
│  │  │   ╱  ╲──╱  ╲──╱╲       │ │  │   │ ● │   │ Critical 2      │  │
│  │  │──╱                  ╲── │ │  │   │   │   │ High 8          │  │
│  │  │                        │ │   ╲──┤   ├──╱  Medium 15        │  │
│  │  └──────────────────────► │ │      └───┘       Low 7          │  │
│  │    Jan  Feb  Mar  Apr     │ │                                │  │
│  └─────────────────────────────┘ └────────────────────────────────┘  │
│                                                                      │
│  ┌─────────────────────────────┐ ┌────────────────────────────────┐  │
│  │ Cost Savings (Bar)          │ │ Resource Types (Horizontal)   │  │
│  │                             │ │                                │  │
│  │  ▲                          │ │  VMs       ████████████  312   │  │
│  │  │  ████                    │ │  DBs       ████████      187   │  │
│  │  │  ████  ████              │ │  Storage   ██████        142   │  │
│  │  │  ████  ████  ████        │ │  Web App   ████           89   │  │
│  │  │  ████  ████  ████  ████  │ │  AKS       ███            56   │  │
│  │  └──────────────────────► │ │                                │  │
│  │    Q1    Q2    Q3    Q4   │ │                                │  │
│  └─────────────────────────────┘ └────────────────────────────────┘  │
│                                                                      │
│  Recent Migrations                                                    │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Name          │ Subscription  │ Status   │ Progress │ Date      ││
│  │───────────────│───────────────│──────────│──────────│───────────││
│  │ ERP Phase 1   │ Prod-Sub-001  │ ● Active │ 78%      │ 2026-06-15││
│  │ CRM Migration │ Prod-Sub-002  │ ● Active │ 45%      │ 2026-06-20││
│  │ Data Lake v2  │ Dev-Sub-003   │ ○ Pending│ 0%       │ 2026-07-01││
│  │ Web Apps      │ Prod-Sub-001  │ ● Active │ 92%      │ 2026-06-10││
│  │ DB Consolidate│ Prod-Sub-004  │ ● Active │ 61%      │ 2026-06-18││
│  └──────────────────────────────────────────────────────────────────┘│
│  View All →                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** KPI card (4x), Line chart, Donut chart, Bar chart (2x), Data table, Date range picker, Export button.

**Navigation Flow:**
- From: Login (SCR-030), Sidebar navigation
- To: Project Detail (SCR-003), Finding Detail (SCR-014), all screens via sidebar

**User Interactions:**
- Click KPI card → drill-down to relevant list
- Click chart element → filter to segment
- Click table row → navigate to project detail
- Change date range → all widgets refresh
- Export → download PDF/Excel

**Business Rules:**
- KPIs update in real-time (60-second refresh)
- Date range defaults to "Last 30 days"
- Only projects with status "Active" or "Completed" in selected range

**Responsive Behaviour:**
- Desktop: 4-column KPI grid, 2-column chart grid
- Tablet: 2-column KPI grid, stacked charts
- Mobile: Single column, charts full-width, table horizontal scroll

**Accessibility:**
- KPI cards announced by screen readers with values
- Charts have text alternative summaries
- All interactive elements keyboard-focusable
- Colour is never sole indicator (icons + labels)

---

## SCR-002 — Project List

```
┌──────────────────────────────────────────────────────────────────────┐
│  Projects                              [Create Project]  [Export ▾] │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [Search projects...]  [All ▾] [Status ▾] [Owner ▾] [Date ▾]       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ ☐ │ Name          │ Status  │ Progress │ Owner  │ Updated      ││
│  │──────────────────│─────────│──────────│────────│──────────────││
│  │ ☐ │ ERP Phase 1   │ ● Active│ ██████ 78│ J.Smith│ 2026-06-28  ││
│  │ ☐ │ CRM Migration │ ● Active│ ████   45│ A.Jones│ 2026-06-27  ││
│  │ ☐ │ Data Lake v2  │ ○ Pending│ ░░░░░  0│ J.Smith│ 2026-06-25  ││
│  │ ☐ │ Web Apps      │ ● Active│ █████ 92│ B.Wilson│ 2026-06-28  ││
│  │ ☐ │ DB Consolidate│ ● Active│ █████ 61│ A.Jones│ 2026-06-26  ││
│  │ ☐ │ Network Hub   │ ◐ Review│ ████   80│ C.Brown│ 2026-06-24  ││
│  │ ☐ │ Security Hard.│ ● Active│ ███    35│ B.Wilson│ 2026-06-23  ││
│  │ ☐ │ API Gateway   │ ✓ Done  │ █████ 100│ J.Smith│ 2026-06-20  ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Showing 1-8 of 23   « 1 2 3 »     [10 per page ▾]                  │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Search input, Filter dropdowns (4x), Data table with sorting, Pagination, Checkbox selection, Status badges.

**Navigation Flow:**
- From: Executive Dashboard (SCR-001), Sidebar
- To: Project Detail (SCR-003), Create Project (SCR-004)

**User Interactions:**
- Click column header → sort ascending/descending
- Click row → navigate to project detail
- Click "Create Project" → open create wizard
- Select rows → bulk actions menu (Archive, Delete)
- Use filters → instant table update (debounced)

**Business Rules:**
- Default sort: Updated date descending
- Status filter options: All, Active, Pending, Review, Completed, Archived
- Only users with "Create Project" permission see Create button
- Archived projects hidden by default

**Responsive Behaviour:**
- Desktop: Full table
- Tablet: Condensed columns, hide Owner
- Mobile: Card layout per project, swipe actions

**Accessibility:**
- Table headers are `<th>` with scope
- Row selection announced by screen reader
- Pagination keyboard navigable
- Sort order indicated by icon + aria-sort

---

## SCR-003 — Project Detail

```
┌──────────────────────────────────────────────────────────────────────┐
│  Projects > ERP Phase 1                  [Edit] [Archive] [Delete]  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ERP Phase 1                                              ● Active  │
│  ERP workload migration to Azure West Europe                       │
│  Owner: J.Smith | Subscription: Prod-Sub-001 | Created: 2026-06-01 │
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │ Resources    │ │ Validations  │ │ Findings     │ │ Compliance   ││
│  │ 124          │ │ 8 runs       │ │ 12 open      │ │ 87%          ││
│  │ ▲ 3 this wk  │ │ ▲ 2 new      │ │ ▼ 4 resolved │ │ ▲ 5%         ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘│
│                                                                      │
│  [Overview] [Resources] [Validations] [Findings] [Reports] [Settings]│
│  ──────────────────────────────────────────────────────────────────  │
│                                                                      │
│  Overview Tab                                                        │
│  ┌──────────────────────────────┐ ┌────────────────────────────────┐│
│  │ Migration Progress           │ │ Recent Activity                ││
│  │                              │ │                                ││
│  │  ████████████████░░░░  78%   │ │  ● Validation run completed    ││
│  │  ████████████████░░░░        │ │    2h ago - 12 findings        ││
│  │                              │ │  ● Finding resolved            ││
│  │  Phase 1: Discovery ✓        │ │    4h ago - ERP-001            ││
│  │  Phase 2: Validation ●       │ │  ● Resource scanned            ││
│  │  Phase 3: Migration ○        │ │    6h ago - 3 resources        ││
│  │  Phase 4: Verification ○     │ │  ● Policy evaluated            ││
│  │                              │ │    1d ago - 94% compliant      ││
│  └──────────────────────────────┘ └────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Header with status badge, KPI row (4x), Tab navigation (6 tabs), Progress bar, Timeline list.

**Navigation Flow:**
- From: Project List (SCR-002), Dashboard links
- To: Resource Inventory (SCR-007), Validation Runs (SCR-010), Findings List (SCR-013), Report List (SCR-015)

**User Interactions:**
- Click tab → switch content panel
- Click KPI → filter to related view
- Click activity item → navigate to detail
- Click "Edit" → inline edit mode or modal
- Click "Archive" → confirmation dialog

**Business Rules:**
- Only owner/admin can edit/delete
- Archived projects are read-only
- Phase progression requires all previous phases complete
- Findings tab shows badge with count

**Responsive Behaviour:**
- Desktop: Full layout with 2-column content
- Tablet: Tabs become scrollable, KPI row 2x2
- Mobile: Tabs become dropdown, stacked content

**Accessibility:**
- Tabs keyboard navigable with arrow keys
- Tab panel associated via aria-controls
- Status badge has aria-label with text equivalent
- Delete requires confirmation (focus trap in dialog)

---

## SCR-004 — Create Project

```
┌──────────────────────────────────────────────────────────────────────┐
│  Create New Project                                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────┐    ┌───────┐    ┌───────┐    ┌───────┐                   │
│  │ 1.    │───▶│ 2.    │───▶│ 3.    │───▶│ 4.    │                   │
│  │ Basic │    │ Scope │    │Schdul │    │Review │                   │
│  └───────┘    └───────┘    └───────┘    └───────┘                   │
│                                                                      │
│  Step 2 of 4: Define Scope                                           │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Subscription                                                     ││
│  │ ┌──────────────────────────────────────────────────────────┐    ││
│  │ │ ▼ Select Azure Subscription                              │    ││
│  │ │   ○ Prod-Sub-001 (Production)                            │    ││
│  │ │   ○ Prod-Sub-002 (Production)                            │    ││
│  │ │   ○ Dev-Sub-003 (Development)                            │    ││
│  │ │   ○ Dev-Sub-004 (Development)                            │    ││
│  │ └──────────────────────────────────────────────────────────┘    ││
│  │                                                                  ││
│  │ Resource Types to Include                                        ││
│  │ ┌──────────────────────────────────────────────────────────┐    ││
│  │ │ ☑ Virtual Machines          ☑ SQL Databases              │    ││
│  │ │ ☑ App Services              ☑ Storage Accounts            │    ││
│  │ │ ☑ AKS Clusters              ☐ Azure Functions             │    ││
│  │ │ ☑ Virtual Networks          ☑ Key Vaults                  │    ││
│  │ └──────────────────────────────────────────────────────────┘    ││
│  │                                                                  ││
│  │ Region Filter                                                    ││
│  │ ┌──────────────────────────────────────────────────────────┐    ││
│  │ │ ☑ West Europe    ☑ North Europe   ☐ East US             │    ││
│  │ └──────────────────────────────────────────────────────────┘    ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  [← Back]                                    [Next →]               │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Stepper indicator, Form fields, Dropdown selector, Checkbox group, Region filter, Back/Next buttons.

**Navigation Flow:**
- From: Project List (SCR-002), "Create Project" button
- To: Project Detail (SCR-003) on completion, Project List on cancel

**User Interactions:**
- Click stepper step → jump to step (if completed)
- Toggle checkboxes → add/remove items
- Click "Next" → validate current step, advance
- Click "Back" → return to previous step
- Click "Cancel" → confirmation dialog if data entered

**Business Rules:**
- Step 1: Name (required, max 100 chars), Description (required, max 500 chars), Owner (auto-set)
- Step 2: At least 1 subscription, at least 1 resource type
- Step 3: Start date (must be ≥ today), End date (must be > start)
- Step 4: Summary review with edit buttons per step
- Form state persisted to localStorage for draft recovery

**Responsive Behaviour:**
- Desktop: Full wizard layout
- Tablet: Steps become horizontal scrollable
- Mobile: Steps collapse to "Step 2 of 4" with back/next

**Accessibility:**
- Step changes announced by aria-live region
- Form fields have associated labels
- Error messages linked via aria-describedby
- Required fields indicated by aria-required

---

## SCR-005 — Subscription List

```
┌──────────────────────────────────────────────────────────────────────┐
│  Subscriptions                     [Connect Subscription]  [Refresh] │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [Search subscriptions...]  [All Status ▾]                           │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Name            │ Subscription ID   │ Status │ Resources │ Scan  ││
│  │─────────────────│───────────────────│────────│───────────│───────││
│  │ Production-001  │ a1b2c3d4-e5f6-... │ ● OK   │ 312       │ 2h ago││
│  │ Production-002  │ f7g8h9i0-j1k2-... │ ● OK   │ 187       │ 2h ago││
│  │ Development-003 │ l3m4n5o6-p7q8-... │ ● OK   │ 89        │ 1d ago││
│  │ Development-004 │ r9s0t1u2-v3w4-... │ ◐ Warn │ 45        │ 3d ago││
│  │ Sandbox-005     │ x5y6z7a8-b9c0-... │ ● OK   │ 23        │ 5h ago││
│  │ Test-006        │ d1e2f3g4-h5i6-... │ ○ Error│ 12        │ 7d ago││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Showing 1-6 of 6        [10 per page ▾]                            │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Search input, Status filter, Data table, Connection status indicators, "Connect Subscription" button.

**Navigation Flow:**
- From: Sidebar, Project Detail (SCR-003)
- To: Connect Subscription (SCR-006), Resource Inventory (SCR-007)

**User Interactions:**
- Click "Connect Subscription" → open connection wizard
- Click row → view resources for subscription
- Click status badge → view diagnostic details
- Click "Refresh" → trigger re-scan

**Business Rules:**
- Only Admin/Owner can connect subscriptions
- Error status shows troubleshooting link
- Warn status indicates permission or quota issues
- Subscription ID truncated with tooltip for full ID

**Responsive Behaviour:**
- Desktop: Full table
- Tablet: Hide Subscription ID column
- Mobile: Card layout with swipe to actions

**Accessibility:**
- Status indicators include text labels
- Table sortable columns have aria-sort
- Connection flow keyboard navigable

---

## SCR-006 — Connect Subscription

```
┌──────────────────────────────────────────────────────────────────────┐
│  Connect Azure Subscription                                     ✕    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────┐    ┌───────┐    ┌───────┐    ┌───────┐                   │
│  │ 1.    │───▶│ 2.    │───▶│ 3.    │───▶│ 4.    │                   │
│  │Select │    │ Auth  │    │Perms  │    │Done   │                   │
│  └───────┘    └───────┘    └───────┘    └───────┘                   │
│                                                                      │
│  Step 2: Authenticate with Azure AD                                  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  ┌────────────────────────────────────────────────────┐          ││
│  │  │          [Microsoft Azure AD Logo]                 │          ││
│  │  │                                                    │          ││
│  │  │  Click below to authenticate via Azure AD          │          ││
│  │  │  and grant MAP read access to your subscription.   │          ││
│  │  │                                                    │          ││
│  │  │  ┌──────────────────────────────────────────┐      │          ││
│  │  │  │    Sign in with Microsoft                │      │          ││
│  │  │  └──────────────────────────────────────────┘      │          ││
│  │  │                                                    │          ││
│  │  │  Required permissions:                             │          ││
│  │  │  ☑ Reader (Subscription)                           │          ││
│  │  │  ☑ Reader (Resource Group)                         │          ││
│  │  │  ☑ Cost Management Reader                         │          ││
│  │  └────────────────────────────────────────────────────┘          ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  [← Back]                                              [Cancel]      │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Multi-step wizard, Azure AD login button, Permission checklist, Loading states, Success/error feedback.

**Navigation Flow:**
- From: Subscription List (SCR-005)
- To: Subscription List (SCR-005) on completion

**User Interactions:**
- Click "Sign in with Microsoft" → Azure AD redirect
- Review permissions → confirm
- Handle errors → retry or cancel

**Business Rules:**
- Service principal created via Azure AD app registration
- Permissions validated after authentication
- Maximum 50 subscriptions per tenant
- Connection health checked every 4 hours

**Responsive Behaviour:**
- Desktop: Modal overlay
- Mobile: Full-screen wizard

**Accessibility:**
- Loading states announced by aria-live
- Error messages focused automatically
- Azure AD login accessible via keyboard

---

## SCR-007 — Resource Inventory

```
┌──────────────────────────────────────────────────────────────────────┐
│  Resource Inventory                          [Export ▾] [Refresh]   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [Search resources...]  [Type ▾] [Status ▾] [Sub ▾] [Region ▾]     │
│                                                                      │
│  312 resources found    ☐ Select All                                 │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ ☐ │ Name            │ Type    │ Status │ Subscription│ Cost/mo ││
│  │─────────────────────│─────────│────────│─────────────│─────────││
│  │ ☐ │ web-prod-01     │ VM      │ ● Run  │ Prod-001    │ $245    ││
│  │ ☐ │ api-prod-01     │ VM      │ ● Run  │ Prod-001    │ $189    ││
│  │ ☐ │ sql-primary     │ SQL DB  │ ● Run  │ Prod-001    │ $1,240  ││
│  │ ☐ │ storage-data01  │ Storage │ ● Run  │ Prod-001    │ $67     ││
│  │ ☐ │ aks-cluster-01  │ AKS     │ ● Run  │ Prod-001    │ $890    ││
│  │ ☐ │ vnet-prod       │ VNet    │ ● Run  │ Prod-001    │ $12     ││
│  │ ☐ │ keyvault-prod   │ KV      │ ● Run  │ Prod-001    │ $3      ││
│  │ ☐ │ app-web-prod    │ App Svc │ ◐ Warn │ Prod-001    │ $312    ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Total Cost: $2,958/mo      Showing 1-8 of 312  « 1 2 ... 40 »      │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Search input, Multi-filter bar, Data table with sorting, Pagination, Cost column, Bulk selection, Total cost summary.

**Navigation Flow:**
- From: Subscription List (SCR-005), Project Detail (SCR-003)
- To: Resource Detail (SCR-008), Dependency Map (SCR-009)

**User Interactions:**
- Click column header → sort
- Click row → resource detail
- Select checkboxes → bulk actions (Tag, Validate, Export)
- Change filters → instant update
- Click "Refresh" → re-scan

**Business Rules:**
- Cost data from Azure Cost Management API
- Status: Running, Stopped, Deallocated, Failed, Unknown
- Resources scoped to project subscriptions only
- Export supports CSV, Excel, JSON formats

**Responsive Behaviour:**
- Desktop: Full table
- Tablet: Hide Cost column, show on expand
- Mobile: Card layout with key details

**Accessibility:**
- Cost values formatted with aria-label (e.g., "245 US dollars")
- Sort state announced
- Keyboard navigation for table rows

---

## SCR-008 — Resource Detail

```
┌──────────────────────────────────────────────────────────────────────┐
│  Resources > web-prod-01                                        VM  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  web-prod-01                                    ● Running            │
│  Virtual Machine | West Europe | Prod-Sub-001                       │
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │ Monthly Cost │ │ Dependencies │ │ Validation   │ │ Compliance   ││
│  │ $245         │ │ 4            │ │ Passed       │ │ 92%          ││
│  │ ▲ $12 from   │ │ 2 upstream   │ │ 8 checks     │ │ ▲ 3%         ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘│
│                                                                      │
│  [Configuration] [Dependencies] [Cost] [Validation] [History]        │
│  ──────────────────────────────────────────────────────────────────  │
│                                                                      │
│  Configuration Tab                                                   │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Property              │ Value                                    ││
│  │───────────────────────│──────────────────────────────────────────││
│  │ VM Size               │ Standard_D4s_v3                          ││
│  │ Operating System      │ Ubuntu 22.04 LTS                         ││
│  │ Private IP            │ 10.0.1.4                                 ││
│  │ Public IP             │ 52.174.xx.xx                             ││
│  │ OS Disk Size          │ 128 GB (Premium SSD)                     ││
│  │ Data Disks            │ 1 (512 GB Premium SSD)                   ││
│  │ VNet                  │ vnet-prod                                ││
│  │ Subnet                │ web-tier                                 ││
│  │ NSG                   │ nsg-web                                  ││
│  │ Created               │ 2025-03-15                               ││
│  │ Last Modified         │ 2026-06-28                               ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Resource header with type badge, KPI row (4x), Tab navigation (5 tabs), Property grid.

**Navigation Flow:**
- From: Resource Inventory (SCR-007), Dependency Map (SCR-009)
- To: Dependency Map (SCR-009), Validation Runs (SCR-010)

**User Interactions:**
- Click tabs → switch content
- Click dependency link → navigate to that resource
- Click "Validation" → view validation results
- Hover property → show full value if truncated

**Business Rules:**
- Resource type determines available tabs
- Cost data refreshed daily
- Dependencies auto-discovered via Azure Resource Graph
- Validation results from most recent run

**Responsive Behaviour:**
- Desktop: Full layout
- Tablet: Tabs scroll horizontally
- Mobile: Tabs become accordion

**Accessibility:**
- Property grid uses `<dl>` markup
- Tabs keyboard navigable
- Resource type badge has aria-label

---

## SCR-009 — Dependency Map

```
┌──────────────────────────────────────────────────────────────────────┐
│  Dependency Map > ERP Phase 1              [Fit View] [Zoom In/Out] │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [Filter: All Types ▾]  [Status: All ▾]  [Layout: Force ▾]          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │                    ┌──────────┐                                  ││
│  │        ┌──────────│ vnet-prod│──────────┐                       ││
│  │        │          └──────────┘          │                       ││
│  │        │                                │                       ││
│  │  ┌─────┴─────┐                    ┌─────┴─────┐                 ││
│  │  │web-prod-01│────────────────────│api-prod-01│                 ││
│  │  └─────┬─────┘                    └─────┬─────┘                 ││
│  │        │                                │                       ││
│  │        │          ┌──────────┐          │                       ││
│  │        └──────────│sql-primary│─────────┘                       ││
│  │                   └──────────┘                                  ││
│  │                        │                                        ││
│  │                   ┌────┴────┐                                   ││
│  │                   │storage- │                                   ││
│  │                   │data01   │                                   ││
│  │                   └─────────┘                                   ││
│  │                                                                  ││
│  │  ┌─────────────────────────────────────┐                       ││
│  │  │ ● VM    ● SQL DB    ● Storage      │                       ││
│  │  │ ── Depends On   ══ Network Conn.   │                       ││
│  │  └─────────────────────────────────────┘                       ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Selected: web-prod-01 (VM) | Dependencies: 2 | Dependents: 1      │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Interactive graph canvas, Filter controls, Zoom controls, Layout selector, Legend, Selection info bar.

**Navigation Flow:**
- From: Resource Inventory (SCR-007), Resource Detail (SCR-008)
- To: Resource Detail (SCR-008) on node click

**User Interactions:**
- Click node → select, show details panel
- Double-click node → navigate to resource detail
- Drag node → reposition
- Scroll → zoom in/out
- Pan canvas → drag background
- Hover edge → highlight dependency path

**Business Rules:**
- Maximum 500 nodes per view (performance)
- Auto-layout algorithms: Force-directed, Hierarchical, Circular
- Orphan resources shown in sidebar list
- Critical path highlighted when findings exist

**Responsive Behaviour:**
- Desktop: Full canvas with sidebar
- Tablet: Canvas with floating controls
- Mobile: Simplified list view with basic connections

**Accessibility:**
- Keyboard navigation between nodes
- Screen reader announces node type and connections
- High-contrast mode for colour-blind users
- Alternative table view available

---

## SCR-010 — Validation Runs

```
┌──────────────────────────────────────────────────────────────────────┐
│  Validation Runs                         [Execute Validation]        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [Search runs...]  [All Status ▾]  [Project ▾]  [Date Range ▾]      │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Run ID    │ Project     │ Status  │ Findings │ Duration │ Date  ││
│  │───────────│─────────────│─────────│──────────│──────────│───────││
│  │ VR-0421   │ ERP Phase 1 │ ● Pass  │ 0        │ 4m 32s   │ Jun 28││
│  │ VR-0420   │ CRM Mig.    │ ● Pass  │ 2 (H)    │ 3m 18s   │ Jun 27││
│  │ VR-0419   │ ERP Phase 1 │ ◐ Warn  │ 5 (M)    │ 4m 28s   │ Jun 26││
│  │ VR-0418   │ Web Apps    │ ● Pass  │ 0        │ 2m 15s   │ Jun 25││
│  │ VR-0417   │ CRM Mig.    │ ✗ Fail  │ 8 (C)    │ 3m 42s   │ Jun 24││
│  │ VR-0416   │ DB Consol.  │ ● Pass  │ 1 (L)    │ 5m 01s   │ Jun 23││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Showing 1-6 of 89       « 1 2 ... 15 »     [25 per page ▾]         │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Search input, Multi-filter bar, Data table, Status badges, Pagination, "Execute Validation" button.

**Navigation Flow:**
- From: Project Detail (SCR-003), Sidebar
- To: Validation Run Detail (SCR-011), Validation Execute (SCR-012)

**User Interactions:**
- Click "Execute Validation" → open execute form
- Click row → run detail
- Click status badge → filter by status
- Sort columns → reorder runs

**Business Rules:**
- Runs limited to 1 per project at a time
- Status: Pending, Running, Passed, Warning, Failed, Error
- Findings count in parentheses indicates severity (C=Critical, H=High, M=Medium, L=Low)
- Duration includes all rule evaluations

**Responsive Behaviour:**
- Desktop: Full table
- Tablet: Hide Duration column
- Mobile: Card layout

**Accessibility:**
- Status icons have text labels
- Table navigable via keyboard
- Findings count announced with severity context

---

## SCR-011 — Validation Run Detail

```
┌──────────────────────────────────────────────────────────────────────┐
│  Runs > VR-0417                                        [Re-run] [Export]│
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  VR-0417 — CRM Migration                                    ✗ Failed│
│  Executed: 2026-06-24 14:32 UTC | Duration: 3m 42s | Rules: 24      │
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │ 24           │ │ 16           │ │ 8            │ │ 0            ││
│  │ Total Checks │ │ Passed       │ │ Findings     │ │ Warnings     ││
│  │              │ │ (66.7%)      │ │ (8 Critical) │ │              ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘│
│                                                                      │
│  [Findings] [Execution Log] [Configuration]                          │
│  ──────────────────────────────────────────────────────────────────  │
│                                                                      │
│  Findings Tab                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ ID       │ Rule        │ Resource      │ Severity │ Message      ││
│  │──────────│─────────────│───────────────│──────────│──────────────││
│  │ F-1847   │ VM-SEC-001  │ api-prod-01   │ ● Crit   │ No NSG assoc.││
│  │ F-1848   │ VM-SEC-001  │ web-prod-01   │ ● Crit   │ No NSG assoc.││
│  │ F-1849   │ SQL-BAK-003 │ sql-primary   │ ● Crit   │ No backup    ││
│  │ F-1850   │ VM-PATCH-02 │ api-prod-01   │ ● Crit   │ 45d unpatched││
│  │ F-1851   │ VM-PATCH-02 │ web-prod-01   │ ● Crit   │ 45d unpatched││
│  │ F-1852   │ STG-ENCR-01 │ storage-data01│ ● Crit   │ No encryption││
│  │ F-1853   │ AKS-VER-01  │ aks-cluster-01│ ● Crit   │ Outdated K8s ││
│  │ F-1854   │ VM-SIZE-01  │ api-prod-01   │ ● Crit   │ Over-provis. ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Run header, KPI row (4x), Tab navigation, Findings table with severity, Action buttons.

**Navigation Flow:**
- From: Validation Runs (SCR-010)
- To: Finding Detail (SCR-014), Validation Execute (SCR-012)

**User Interactions:**
- Click "Re-run" → execute form with same config
- Click "Export" → download results (PDF/CSV)
- Click finding row → finding detail
- Click tab → switch content

**Business Rules:**
- Re-run creates new run with same configuration
- Execution log shows per-rule timing and errors
- Findings grouped by severity
- Run cannot be deleted if findings are linked to active issues

**Responsive Behaviour:**
- Desktop: Full layout
- Tablet: KPI row 2x2
- Mobile: Stacked KPIs, scrollable table

**Accessibility:**
- Severity indicated by icon + text + colour
- Findings table sortable and keyboard navigable
- Run ID is a heading for screen reader navigation

---

## SCR-012 — Validation Execute

```
┌──────────────────────────────────────────────────────────────────────┐
│  Execute Validation                                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Target Project                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ ▼ ERP Phase 1                                                    ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Validation Rules                                                    │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ ☑ Select All (24 rules)                                          ││
│  │ ☑ Security (8 rules)                                             ││
│  │   ☑ VM-SEC-001 — VM security group association                   ││
│  │   ☑ VM-SEC-002 — VM disk encryption                              ││
│  │   ☑ SQL-SEC-001 — SQL firewall rules                             ││
│  │ ☑ Compliance (6 rules)                                           ││
│  │   ☑ COM-AUD-001 — Audit logging enabled                          ││
│  │   ☑ COM-TAG-001 — Resource tagging required                      ││
│  │ ☑ Performance (5 rules)                                          ││
│  │ ☑ Cost (5 rules)                                                 ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Schedule                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ ● Run Now     ○ Schedule for later                               ││
│  │              ○ Set up recurring (Daily/Weekly)                    ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Est. Duration: ~4 minutes    Est. Findings: 0-15                    │
│                                                                      │
│  [Cancel]                                              [Run Now ▶]  │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Project selector, Rule checklist (expandable categories), Schedule options, Estimate display, Action buttons.

**Navigation Flow:**
- From: Validation Runs (SCR-010), Project Detail (SCR-003)
- To: Validation Runs (SCR-010) with new run on execution

**User Interactions:**
- Expand/collapse rule categories
- Toggle individual rules or categories
- Select schedule option
- Click "Run Now" → execute and redirect

**Business Rules:**
- At least 1 rule must be selected
- Run limit: 3 concurrent per project
- Recurring schedules require active subscription
- Estimated duration based on resource count × rule complexity

**Responsive Behaviour:**
- Desktop: Full form layout
- Tablet: Stacked sections
- Mobile: Collapsible sections

**Accessibility:**
- Checkbox groups use fieldset/legend
- Schedule options use radio buttons with labels
- Estimates announced via aria-live

---

## SCR-013 — Findings List

```
┌──────────────────────────────────────────────────────────────────────┐
│  Findings                               [Export ▾] [Bulk Actions ▾] │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [Search findings...]  [Severity ▾] [Status ▾] [Project ▾]          │
│                                                                      │
│  ☐ Select All (42 findings)                                          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ ☐ │ ID      │ Title              │ Sev │ Status  │ Project │Age ││
│  │──────────────│────────────────────│─────│─────────│─────────│────││
│  │ ☐ │ F-1847   │ No NSG on VM       │ ●C  │ ● Open  │ ERP Ph1│ 4d ││
│  │ ☐ │ F-1849   │ No SQL backup      │ ●C  │ ◐ InPr  │ ERP Ph1│ 4d ││
│  │ ☐ │ F-1852   │ Storage no encrypt │ ●C  │ ● Open  │ ERP Ph1│ 4d ││
│  │ ☐ │ F-1854   │ VM over-provisioned│ ●H  │ ● Open  │ ERP Ph1│ 4d ││
│  │ ☐ │ F-1860   │ Deprecated API     │ ●M  │ ● Open  │ CRM Mig│ 3d ││
│  │ ☐ │ F-1862   │ Missing tag: Cost  │ ●L  │ ○ Dismiss│ CRM Mig│ 3d ││
│  │ ☐ │ F-1865   │ Expired cert       │ ●H  │ ◐ InPr  │ Web App│ 2d ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Summary: ● Critical 12  ● High 18  ● Medium 8  ● Low 4            │
│  Showing 1-7 of 42        « 1 2 ... 6 »                             │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Search input, Multi-filter bar, Data table, Severity badges, Status badges, Bulk selection, Summary bar, Pagination.

**Navigation Flow:**
- From: Validation Run Detail (SCR-011), Project Detail (SCR-003), Sidebar
- To: Finding Detail (SCR-014)

**User Interactions:**
- Click row → finding detail
- Select checkboxes → bulk actions (Assign, Resolve, Dismiss, Export)
- Filter by severity → instant update
- Click summary badges → filter to that severity

**Business Rules:**
- Severity: Critical (C), High (H), Medium (M), Low (L)
- Status: Open, In Progress, Resolved, Dismissed
- Age = days since creation
- Bulk actions limited by permission level

**Responsive Behaviour:**
- Desktop: Full table
- Tablet: Hide Age column
- Mobile: Card layout with swipe actions

**Accessibility:**
- Severity indicated by icon + text + colour
- Status indicated by icon + text + colour
- Bulk actions keyboard accessible
- Summary announced via aria-live

---

## SCR-014 — Finding Detail

```
┌──────────────────────────────────────────────────────────────────────┐
│  Findings > F-1847                              [Edit] [Resolve]     │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  F-1847 — No Network Security Group associated                     │
│  ● Critical | ● Open | ERP Phase 1 | Created: 2026-06-24            │
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │ Severity     │ │ Affected     │ │ Rule         │ │ Assignment   ││
│  │ Critical     │ │ Resources    │ │ VM-SEC-001   │ │ Unassigned   ││
│  │ Business Risk│ │ 3            │ │ Security     │ │              ││
│  │ High         │ │              │ │ Category     │ │              ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘│
│                                                                      │
│  [Details] [Remediation] [Resources] [Activity]                      │
│  ──────────────────────────────────────────────────────────────────  │
│                                                                      │
│  Description                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ The following VMs do not have a Network Security Group (NSG)    ││
│  │ associated with their network interface. This means there are   ││
│  │ no network-level access controls in place, potentially allowing ││
│  │ unrestricted inbound/outbound traffic.                           ││
│  │                                                                  ││
│  │ Impact: High risk of unauthorised access and data exfiltration. ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Remediation Steps                                                   │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ 1. Create or identify an appropriate NSG                        ││
│  │ 2. Define inbound/outbound security rules                       ││
│  │ 3. Associate NSG with each affected NIC                         ││
│  │ 4. Validate connectivity and security                           ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Affected Resources                                                  │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ api-prod-01  │ VM    │ Prod-001 │ West Europe   │ View →        ││
│  │ web-prod-01  │ VM    │ Prod-001 │ West Europe   │ View →        ││
│  │ app-web-prod │ App Svc│ Prod-001│ West Europe   │ View →        ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Activity Feed                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Jun 28 │ Finding assigned to J.Smith                            ││
│  │ Jun 24 │ Finding created by VR-0417 validation run              ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Finding header, KPI row, Tab navigation, Description panel, Remediation steps, Affected resources list, Activity feed.

**Navigation Flow:**
- From: Findings List (SCR-013), Validation Run Detail (SCR-011)
- To: Resource Detail (SCR-008), Validation Runs (SCR-010)

**User Interactions:**
- Click "Edit" → modify assignment/severity
- Click "Resolve" → resolution form
- Click resource → navigate to resource detail
- Click tab → switch content

**Business Rules:**
- Critical findings require resolution within SLA (configurable)
- Resolution requires description and optional evidence upload
- Dismissed findings hidden from active list
- Activity feed immutable

**Responsive Behaviour:**
- Desktop: Full layout with tabs
- Tablet: KPI row 2x2
- Mobile: Stacked sections, tabs become accordion

**Accessibility:**
- Severity announced with urgency context
- Remediation steps as ordered list
- Resource links keyboard navigable
- Activity feed uses `<time>` elements

---

## SCR-015 — Report List

```
┌──────────────────────────────────────────────────────────────────────┐
│  Reports                              [Generate Report]              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [Search reports...]  [All Types ▾]  [Project ▾]                     │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Name              │ Project     │ Type       │ Generated │Status ││
│  │───────────────────│─────────────│────────────│───────────│───────││
│  │ ERP Compliance Q2 │ ERP Phase 1 │ Compliance │ Jun 28    │ ✓ Done││
│  │ CRM Executive Sum.│ CRM Mig.    │ Executive  │ Jun 25    │ ✓ Done││
│  │ ERP Tech Report   │ ERP Phase 1 │ Technical  │ Jun 24    │ ✓ Done││
│  │ Q2 Cost Analysis  │ All         │ Executive  │ Jun 22    │ ○ Proc││
│  │ Web Apps Findings │ Web Apps    │ Technical  │ Jun 20    │ ✓ Done││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Showing 1-5 of 12        « 1 2 3 »                                 │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Search input, Filter dropdowns, Data table, Status indicators, "Generate Report" button.

**Navigation Flow:**
- From: Project Detail (SCR-003), Sidebar
- To: Report Generate (SCR-016), Report Viewer (SCR-017)

**User Interactions:**
- Click row → open report viewer
- Click "Generate Report" → open wizard
- Click download icon → download PDF/Excel

**Business Rules:**
- Report types: Compliance, Executive, Technical, Custom
- Status: Processing, Done, Failed
- Processing time varies by scope (1-30 minutes)
- Reports auto-expire after 90 days (configurable)

**Responsive Behaviour:**
- Desktop: Full table
- Tablet: Hide Type column
- Mobile: Card layout

**Accessibility:**
- Status indicated by icon + text
- Table sortable and keyboard navigable
- Download links have aria-label with report name

---

## SCR-016 — Report Generate

```
┌──────────────────────────────────────────────────────────────────────┐
│  Generate Report                                                     │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Template                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             ││
│  │ │Compliance│ │Executive │ │Technical │ │ Custom   │             ││
│  │ │  📋      │ │  📊      │ │  🔧      │ │  ⚙️      │             ││
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘             ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Scope                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Project: [▼ ERP Phase 1]                                         ││
│  │ Date Range: [Jun 1, 2026] to [Jun 30, 2026]                     ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Sections                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ ☑ Executive Summary        ☑ Findings Detail                     ││
│  │ ☑ Migration Status         ☐ Resource Inventory                  ││
│  │ ☑ Compliance Overview      ☐ Cost Analysis                       ││
│  │ ☑ Recommendations          ☑ Remediation Steps                   ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Format & Distribution                                               │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Format: ● PDF  ○ Excel  ○ PowerPoint                            ││
│  │ Recipients: [j.smith@company.com, a.jones@company.com]           ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  [Cancel]                                              [Generate ▶] │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Template cards, Scope selector, Section checkboxes, Format radio buttons, Recipient input, Action buttons.

**Navigation Flow:**
- From: Report List (SCR-015)
- To: Report List (SCR-015) on generation

**User Interactions:**
- Click template card → select
- Toggle sections → include/exclude
- Select format → change output type
- Enter recipients → email distribution
- Click "Generate" → start processing

**Business Rules:**
- At least 3 sections required
- Maximum 10 recipients
- PDF max 50MB, Excel unlimited
- Processing queued; estimated time shown

**Responsive Behaviour:**
- Desktop: Full form layout
- Tablet: Stacked sections
- Mobile: Collapsible sections

**Accessibility:**
- Template cards keyboard selectable
- Checkbox groups use fieldset/legend
- Format options use radio buttons with labels

---

## SCR-017 — Report Viewer

```
┌──────────────────────────────────────────────────────────────────────┐
│  Report: ERP Compliance Q2    [Download PDF] [Email] [Print]  [X]   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────┐ ┌───────────────────────┐│
│  │  Page 1 of 12    [Prev] [Next]        │ │ Metadata              ││
│  │                                       │ │ Project: ERP Phase 1  ││
│  │  ┌───────────────────────────────────┐│ │ Generated: Jun 28     ││
│  │  │                                   ││ │ Version: 1.0          ││
│  │  │     ERP Compliance Report         ││ │ Format: PDF           ││
│  │  │     Q2 2026                       ││ │                       ││
│  │  │                                   ││ │ Sections:             ││
│  │  │     Generated: June 28, 2026      ││ │ ☑ Executive Summary   ││
│  │  │     by MAP Platform               ││ │ ☑ Migration Status    ││
│  │  │                                   ││ │ ☑ Compliance          ││
│  │  │  ──────────────────────────────── ││ │ ☑ Findings            ││
│  │  │                                   ││ │ ☑ Recommendations     ││
│  │  │  Executive Summary                ││ │                       ││
│  │  │  This report covers the           ││ │ [Download PDF]        ││
│  │  │  migration validation for         ││ │ [Download Excel]      ││
│  │  │  ERP Phase 1 during Q2 2026...    ││ │                       ││
│  │  │                                   ││ │                       ││
│  │  └───────────────────────────────────┘│ │                       ││
│  │                                       │ │                       ││
│  └───────────────────────────────────────┘ └───────────────────────┘│
│                                                                      │
│  [Zoom: 100% ▾]  [Fit Width]  [Fit Page]                           │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** PDF viewer canvas, Page navigation, Zoom controls, Download buttons, Metadata sidebar.

**Navigation Flow:**
- From: Report List (SCR-015)
- To: Report List (SCR-015) on close

**User Interactions:**
- Scroll → navigate pages
- Zoom in/out → resize view
- Click download → save file
- Click "Email" → send to recipients
- Click "Print" → browser print dialog

**Business Rules:**
- PDF rendered server-side (no client PDF library)
- Maximum 100 pages per report
- Print follows PDF layout
- Email uses platform email service

**Responsive Behaviour:**
- Desktop: Viewer + sidebar
- Tablet: Viewer only (sidebar as drawer)
- Mobile: Full-screen viewer, toolbar at bottom

**Accessibility:**
- PDF has text layer for screen readers
- Keyboard navigation between pages
- Zoom controls keyboard accessible
- Print preserves structure

---

## SCR-018 — Policy List

```
┌──────────────────────────────────────────────────────────────────────┐
│  Policies                              [Create Policy]               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [Search policies...]  [Category ▾]  [Status ▾]  [Enforcement ▾]    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Name              │ Category  │ Status │ Enforce │ Compliance   ││
│  │───────────────────│───────────│────────│─────────│──────────────││
│  │ NSG Required      │ Security  │ ● Active│ Audit  │ 78% ████████░││
│  │ Encryption Mandate│ Security  │ ● Active│ Enforce│ 92% ██████████││
│  │ Backup Policy     │ Compliance│ ● Active│ Enforce│ 65% ██████░░░││
│  │ Tagging Standard  │ Governance│ ● Active│ Audit  │ 45% ████░░░░░││
│  │ Cost Limits       │ Cost      │ ○ Draft │ —      │ N/A         ││
│  │ Patch Currency    │ Security  │ ● Active│ Enforce│ 88% █████████░││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Showing 1-6 of 15        « 1 2 3 »                                 │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Search input, Multi-filter bar, Data table, Compliance progress bars, Status/Enforcement badges, "Create Policy" button.

**Navigation Flow:**
- From: Compliance Dashboard (SCR-021), Sidebar
- To: Policy Detail (SCR-019), Create Policy (SCR-020)

**User Interactions:**
- Click row → policy detail
- Click "Create Policy" → policy form
- Click compliance bar → view violations

**Business Rules:**
- Enforcement modes: Audit (log only), Enforce (block + log)
- Compliance = resources passing / total resources
- Draft policies not evaluated
- Maximum 50 active policies

**Responsive Behaviour:**
- Desktop: Full table
- Tablet: Hide Enforcement column
- Mobile: Card layout with compliance bar

**Accessibility:**
- Compliance percentage announced
- Status/Enforcement have text labels
- Table sortable and keyboard navigable

---

## SCR-019 — Policy Detail

```
┌──────────────────────────────────────────────────────────────────────┐
│  Policies > NSG Required             [Edit] [Evaluate Now] [Disable] │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  NSG Required                                     ● Active | Audit  │
│  All VMs and App Services must have an associated NSG               │
│  Category: Security | Last Evaluated: Jun 28, 2026                  │
│                                                                      │
│  Compliance: 78% ████████████████░░░░░░░░░░░░░░░░░░░ 312/400 pass   │
│                                                                      │
│  [Rule Definition] [Violations] [Compliance History] [Settings]      │
│  ──────────────────────────────────────────────────────────────────  │
│                                                                      │
│  Rule Definition Tab                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Resource Type: Virtual Machine, App Service                      ││
│  │                                                                  ││
│  │ Condition:                                                       ││
│  │   networkInterfaces[].networkSecurityGroup.id IS NOT NULL        ││
│  │                                                                  ││
│  │ Logic: AND                                                       ││
│  │   - resource.type IN ["Microsoft.Compute/virtualMachines",       ││
│  │     "Microsoft.Web/sites"]                                        ││
│  │   - resource.networkInterfaces[0].networkSecurityGroup.id        ││
│  │     IS NULL                                                      ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Compliance Trend (30 days)                                          │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │  ▲                                                               ││
│  │  │              ╱──╲    ╱──╲                                     ││
│  │  │         ╱───╱    ╲──╱    ╲───╱                               ││
│  │  │    ╱───╱                                    ╱───              ││
│  │  │───╱                                                        ││
│  │  └──────────────────────────────────────────────────────►      ││
│  │    Jun 1     Jun 10    Jun 20    Jun 30                       ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Recent Violations                                                   │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Resource          │ Type    │ Subscription │ Detected           ││
│  │───────────────────│─────────│──────────────│────────────────────││
│  │ app-web-prod      │ App Svc │ Prod-001     │ Jun 28, 14:32 UTC  ││
│  │ worker-prod-01    │ VM      │ Prod-001     │ Jun 28, 14:32 UTC  ││
│  │ test-vm-01        │ VM      │ Dev-003      │ Jun 27, 09:15 UTC  ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Policy header, Compliance progress bar, Tab navigation, Rule definition editor, Compliance trend chart, Violations table.

**Navigation Flow:**
- From: Policy List (SCR-018)
- To: Resource Detail (SCR-008), Policy List (SCR-018)

**User Interactions:**
- Click "Edit" → policy form
- Click "Evaluate Now" → trigger immediate evaluation
- Click violation row → resource detail
- Click tab → switch content

**Business Rules:**
- Evaluate Now runs within 5 minutes
- Disabling policy retains evaluation history
- Rule syntax validated before save
- Compliance trend calculated daily

**Responsive Behaviour:**
- Desktop: Full layout with tabs
- Tablet: Chart full-width
- Mobile: Stacked sections

**Accessibility:**
- Compliance percentage announced
- Rule definition has syntax highlighting
- Trend chart has text alternative
- Violations table keyboard navigable

---

## SCR-020 — Create Policy

```
┌──────────────────────────────────────────────────────────────────────┐
│  Create Policy                                                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Basic Information                                                   │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Name: [_________________________________] (required, max 100)    ││
│  │ Description: [_____________________________________________]    ││
│  │           [_____________________________________________]        ││
│  │ Category: [▼ Security]                                           ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Rule Builder                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Resource Types:                                                  ││
│  │ ☑ Virtual Machines  ☑ App Services  ☐ SQL Databases  ☐ All      ││
│  │                                                                  ││
│  │ Conditions:                                                      ││
│  │ ┌────────────────────────────────────────────────────────────┐  ││
│  │ │ IF resource.type = "Microsoft.Compute/virtualMachines"     │  ││
│  │ │ AND networkInterfaces[0].networkSecurityGroup.id IS NULL   │  ││
│  │ │ THEN FAIL                                                  │  ││
│  │ │                                                            │  ││
│  │ │ [+ Add Condition]  [+ Add Group]                           │  ││
│  │ └────────────────────────────────────────────────────────────┘  ││
│  │                                                                  ││
│  │ Message: [_________________________________]                     ││
│  │ "VM does not have an associated Network Security Group"          ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Enforcement                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ ● Audit (log violations, allow deployment)                       ││
│  │ ○ Enforce (block deployment, log violations)                     ││
│  │                                                                  ││
│  │ Notify: ☑ Email  ☑ In-App  ○ Webhook                            ││
│  │ Recipients: [security@company.com]                               ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  [Test Policy]  [Save as Draft]                       [Publish]      │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Form fields, Rule builder (condition editor), Resource type checkboxes, Enforcement mode, Notification config, Action buttons.

**Navigation Flow:**
- From: Policy List (SCR-018), "Create Policy" button
- To: Policy Detail (SCR-019) on publish, Policy List on cancel

**User Interactions:**
- Fill form fields → validation on blur
- Add conditions → dynamic rule builder
- Toggle enforcement mode → update options
- Click "Test Policy" → dry run against sample data
- Click "Publish" → create and activate

**Business Rules:**
- Name unique within category
- Rule syntax validated by backend
- Test runs against last 100 resources
- Draft can be published later
- Audit mode default for new policies

**Responsive Behaviour:**
- Desktop: Full form layout
- Tablet: Stacked sections
- Mobile: Collapsible sections

**Accessibility:**
- Form fields have labels and descriptions
- Error messages linked via aria-describedby
- Condition editor keyboard navigable
- Enforcement options use radio buttons

---

## SCR-021 — Compliance Dashboard

```
┌──────────────────────────────────────────────────────────────────────┐
│  Compliance Dashboard                    [Date Range ▾] [Export]     │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │           Overall Compliance Score                               ││
│  │                                                                  ││
│  │              ┌─────────┐                                         ││
│  │             │   87%    │                                         ││
│  │             │  ▲ 2%    │                                         ││
│  │             │ from     │                                         ││
│  │             │ last mo  │                                         ││
│  │              └─────────┘                                         ││
│  │                                                                  ││
│  │  356 / 400 resources compliant                                   ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─────────────────────────────┐ ┌────────────────────────────────┐  │
│  │ Compliance by Policy        │ │ Compliance by Resource Type    │  │
│  │ (Horizontal Bar)            │ │ (Horizontal Bar)               │  │
│  │                             │ │                                │  │
│  │  NSG Required  ████████ 78% │ │  VMs       ██████████████ 92% │  │
│  │  Encryption    █████████ 92% │ │  App Svc   ████████████  87%  │  │
│  │  Backup Policy ██████   65% │ │  SQL DB    ████████████  85%  │  │
│  │  Tagging       ████     45% │ │  Storage   ██████████████ 95%  │  │
│  │  Patch Currency████████ 88% │ │  AKS       ██████████    78%  │  │
│  └─────────────────────────────┘ └────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Compliance Trend (90 days)                                       ││
│  │  ▲                                                               ││
│  │  │         ╱╲     ╱╲     ╱╲                                     ││
│  │  │    ╱───╱  ╲───╱  ╲───╱  ╲──╱                                ││
│  │  │───╱                                               ╱──        ││
│  │  └──────────────────────────────────────────────────────►      ││
│  │    Apr       May        Jun       Jul                         ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Top Violations                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Policy           │ Violations │ Trend │ Affected Resources       ││
│  │──────────────────│────────────│───────│─────────────────────────││
│  │ Tagging Standard │ 220        │ ▲ +15 │ 220 resources           ││
│  │ Backup Policy    │ 140        │ ▼ -8  │ 140 resources           ││
│  │ NSG Required     │ 88         │ ▼ -12 │ 88 resources            ││
│  │ Patch Currency   │ 48         │ ▲ +5  │ 48 resources            ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Overall score gauge, Compliance by policy bar chart, Compliance by resource type bar chart, Trend line chart, Violations table.

**Navigation Flow:**
- From: Sidebar, Executive Dashboard (SCR-001)
- To: Policy Detail (SCR-019), Findings List (SCR-013)

**User Interactions:**
- Click policy bar → policy detail
- Click resource type bar → filtered resource list
- Click trend point → specific date compliance
- Click "Export" → download report

**Business Rules:**
- Score = (compliant resources / total resources) × 100
- Trend shows 90-day rolling window
- Violations sorted by count descending
- Minimum 1 policy required for score calculation

**Responsive Behaviour:**
- Desktop: 2-column chart grid
- Tablet: Stacked charts
- Mobile: Summary cards only, charts hidden

**Accessibility:**
- Score announced as "87 percent"
- Charts have text alternatives
- Tables keyboard navigable
- Trend indicates direction (improving/declining)

---

## SCR-022 — AI Insights

```
┌──────────────────────────────────────────────────────────────────────┐
│  AI Insights                             [Refresh] [History]         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [All Categories ▾]  [Confidence: All ▾]  [Impact: All ▾]           │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ 🤖 Migration Sequencing Recommendation           Confidence: 94%││
│  │ ─────────────────────────────────────────────────────────────── ││
│  │ Migrate database tier before application tier to avoid           ││
│  │ connection string failures. Recommended order:                   ││
│  │ 1. SQL Primary → 2. API Servers → 3. Web Frontend               ││
│  │                                                                  ││
│  │ Impact: High | Affected: ERP Phase 1                            ││
│  │ [Apply] [Dismiss] [Details →]                                   ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ 💰 Cost Optimisation Opportunity                  Confidence: 87%││
│  │ ─────────────────────────────────────────────────────────────── ││
│  │ 12 VMs identified running at <10% average CPU utilisation        ││
│  │ over 30 days. Downsizing from D4s_v3 to D2s_v3 could save       ││
│  │ approximately $1,440/month.                                      ││
│  │                                                                  ││
│  │ Impact: High | Savings: $1,440/mo                               ││
│  │ [Apply] [Dismiss] [Details →]                                   ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ ⚠️ Risk Mitigation Alert                         Confidence: 91%││
│  │ ─────────────────────────────────────────────────────────────── ││
│  │ SQL Primary database has no failover group configured.           ││
│  │ Recommend creating geo-replication to secondary region           ││
│  │ before migration to prevent data loss during cutover.            ││
│  │                                                                  ││
│  │ Impact: Critical | Affected: ERP Phase 1                        ││
│  │ [Apply] [Dismiss] [Details →]                                   ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Was this helpful?  👍 Yes   👎 No   [Feedback]                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Components:** Insight cards, Confidence percentage, Impact badge, Apply/Dismiss actions, Feedback mechanism, Category filters.

**Navigation Flow:**
- From: Sidebar, Executive Dashboard (SCR-001)
- To: Various screens based on recommendation type

**User Interactions:**
- Click "Apply" → execute recommended action (with confirmation)
- Click "Dismiss" → remove from active list
- Click "Details" → expanded view with evidence
- Click thumbs up/down → feedback for model improvement
- Filter by category → update list

**Business Rules:**
- Insights generated weekly and on-demand
- Confidence score based on data quality and rule certainty
- Impact: Critical/High/Medium/Low
- Apply actions logged in audit trail
- Feedback improves future recommendations

**Responsive Behaviour:**
- Desktop: Full-width cards
- Tablet: Stacked cards
- Mobile: Collapsible cards with summary

**Accessibility:**
- Confidence announced as percentage
- Impact indicated by icon + text + colour
- Actions keyboard accessible
- Feedback buttons have labels

---

## Summary

| Screen | Components | Complexity | Responsive Strategy |
|--------|------------|------------|---------------------|
| SCR-001 | KPI cards, Charts (3x), Table | High | 4→2→1 column grid |
| SCR-002 | Search, Filters, Table | Medium | Table → Card |
| SCR-003 | Header, KPIs, Tabs | High | 2-col → Stacked |
| SCR-004 | Stepper, Forms | Medium | Horizontal → Dropdown |
| SCR-005 | Search, Table | Low | Table → Card |
| SCR-006 | Wizard, Auth flow | Medium | Modal → Full-screen |
| SCR-007 | Search, Multi-filter, Table | Medium | Table → Card |
| SCR-008 | Header, KPIs, Tabs, Properties | Medium | Tabs → Accordion |
| SCR-009 | Graph canvas, Controls | High | Canvas → List |
| SCR-010 | Search, Filters, Table | Medium | Table → Card |
| SCR-011 | Header, KPIs, Tabs, Table | Medium | 2-col → Stacked |
| SCR-012 | Forms, Checklists | Medium | Full → Collapsible |
| SCR-013 | Search, Multi-filter, Table | Medium | Table → Card |
| SCR-014 | Header, KPIs, Tabs, Panels | Medium | Tabs → Accordion |
| SCR-015 | Search, Filters, Table | Low | Table → Card |
| SCR-016 | Cards, Forms, Checkboxes | Medium | Full → Collapsible |
| SCR-017 | PDF viewer, Sidebar | Medium | Viewer + Drawer |
| SCR-018 | Search, Filters, Table | Medium | Table → Card |
| SCR-019 | Header, Tabs, Charts, Table | Medium | Tabs → Stacked |
| SCR-020 | Forms, Rule builder | High | Full → Collapsible |
| SCR-021 | Gauge, Charts (3x), Table | High | 2-col → Stacked |
| SCR-022 | Insight cards, Filters | High | Cards → Collapsible |
