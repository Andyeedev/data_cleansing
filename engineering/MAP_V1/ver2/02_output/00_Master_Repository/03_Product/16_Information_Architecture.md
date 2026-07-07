# MAP MVP Information Architecture

| Field    | Value                              |
| -------- | ---------------------------------- |
| Document | MAP MVP Information Architecture   |
| Version  | 1.0                                |
| Date     | June 2026                          |
| Status   | Official                           |

---

## 1. Application Hierarchy

The MAP platform is structured around the migration lifecycle. Each top-level section maps to a phase of the workflow.

```
MAP Platform
├── Dashboard (Executive Overview)
│   ├── Migration Progress Summary
│   ├── Resource Counts by Status
│   ├── Validation Pass/Fail Rates
│   ├── Recent Activity Feed
│   └── Quick Actions
│
├── Projects
│   ├── Project List (filterable, sortable table)
│   ├── Project Detail
│   │   ├── Overview Tab
│   │   ├── Migrations Tab
│   │   ├── Timeline Tab
│   │   ├── Team Tab
│   │   └── Settings Tab
│   └── Create Project (modal or dedicated page)
│
├── Discovery
│   ├── Subscriptions
│   │   ├── Subscription List
│   │   └── Subscription Detail
│   ├── Resource Inventory
│   │   ├── Resource Table (filterable by type, region, status)
│   │   └── Resource Detail
│   └── Dependency Map
│       ├── Visual Dependency Graph
│       └── Dependency Table View
│
├── Validation
│   ├── Validation Runs
│   │   ├── Runs List (filterable by status, project, date)
│   │   └── Run Detail
│   │       ├── Execution Summary
│   │       ├── Rule Results
│   │       └── Logs
│   ├── Run Detail (standalone deep link)
│   └── Findings
│       ├── Findings List (filterable by severity, category)
│       ├── Finding Detail
│       └── Finding Trend Analysis
│
├── Reports
│   ├── Report List
│   ├── Generate Report (wizard or form)
│   │   ├── Select Scope
│   │   ├── Configure Sections
│   │   ├── Preview
│   │   └── Export
│   └── Download Center
│
├── Governance
│   ├── Policies
│   │   ├── Policy List
│   │   ├── Policy Detail
│   │   └── Create/Edit Policy
│   └── Compliance
│       ├── Compliance Dashboard
│       ├── Compliance Report History
│       └── Policy Violation Detail
│
├── AI Insights
│   ├── Insight Feed
│   ├── Insight Detail
│   └── Recommendations
│
├── Administration
│   ├── Users
│   │   ├── User List
│   │   ├── User Detail
│   │   └── Invite User
│   ├── Roles
│   │   ├── Role List
│   │   └── Role Detail / Edit Permissions
│   ├── Settings
│   │   ├── General Settings
│   │   ├── Notification Preferences
│   │   └── Integration Settings
│   ├── Audit Log
│   │   ├── Audit Log Table (filterable by user, action, date)
│   │   └── Audit Entry Detail
│   └── API Keys
│       ├── API Key List
│       └── Create/Revoke API Key
│
├── Notifications
│   ├── Notification Panel (dropdown or slide-out)
│   └── Notification Preferences
│
├── Help & Documentation
│   ├── Searchable Help Center
│   ├── Contextual Help Tooltips
│   └── Release Notes
│
└── Profile
    ├── Account Settings
    ├── Preferences
    └── Sign Out
```

---

## 2. Navigation Structure

MAP uses a three-tier navigation model: primary, secondary, and contextual.

### 2.1 Primary Navigation (Left Sidebar)

The left sidebar is the persistent, always-visible primary navigation. It provides access to all major sections of the platform.

- Fixed position on the left edge of the viewport
- Always visible (collapsible on tablet/mobile)
- Contains top-level sections: Dashboard, Projects, Discovery, Validation, Reports, Governance, AI Insights, Administration
- Bottom section: Settings, Help, Profile
- Active section indicated with accent color and background highlight
- Supports grouping with section dividers

### 2.2 Secondary Navigation (Top Bar)

The top bar provides global utilities and location context.

- **Left:** Breadcrumb trail showing current location hierarchy
- **Center:** Global search bar (Cmd/Ctrl+K shortcut)
- **Right:** Notification bell, user avatar with dropdown menu

### 2.3 Contextual Navigation (In-Page)

Contextual navigation appears within screens to manage sub-sections and actions.

- **Tabs:** Switch between views within a section (e.g., Overview / Migrations / Timeline on Project Detail)
- **Back buttons:** Return to the parent list from a detail view
- **Action menus:** Context-specific actions (Edit, Delete, Export) placed in the top-right of content areas
- **Pagination:** Table and list pagination at the bottom of data sets
- **Filters:** Inline filter controls above data tables

---

## 3. Menu Hierarchy

### 3.1 Left Sidebar Menu

| Group      | Icon          | Label            | Tooltip                  |
| ---------- | ------------- | ---------------- | ------------------------ |
| —          | Home          | Dashboard        | Executive overview       |
| Primary    | Folder        | Projects         | Manage migration projects|
| Primary    | Search        | Discovery        | Explore subscriptions    |
| Primary    | CheckCircle   | Validation       | Run and review validations|
| Primary    | FileText      | Reports          | Generate and download    |
| Primary    | Shield        | Governance       | Policies and compliance  |
| Primary    | Sparkles      | AI Insights      | AI-powered recommendations|
| Secondary  | Users         | Administration   | Users, roles, settings   |
| —          | —             | —                | — (divider)             |
| Bottom     | Bell          | Notifications    | View notifications       |
| Bottom     | Settings      | Settings         | Platform configuration   |
| Bottom     | HelpCircle    | Help             | Documentation & support  |
| Bottom     | User          | Profile          | Account settings         |

### 3.2 Top Bar Elements

| Position | Element            | Description                                |
| -------- | ------------------ | ------------------------------------------ |
| Left     | Breadcrumbs        | Location trail: MAP > Section > Item       |
| Center   | Search Bar         | Global search across all entities           |
| Right    | Notification Bell  | Unread count badge, dropdown panel          |
| Right    | User Avatar        | Dropdown: Profile, Preferences, Sign Out    |

---

## 4. Screen Relationships

### 4.1 Primary Navigation Flows

```
Dashboard ──────> Projects ──────> Project Detail
    │                  │                  │
    │                  │                  ├──> Migrations ──> Migration Detail
    │                  │                  ├──> Timeline
    │                  │                  └──> Settings
    │                  │
    │                  └──> Create Project
    │
    ├──> Discovery ──────> Subscriptions
    │         │
    │         ├──> Resource Inventory ──> Resource Detail
    │         │
    │         └──> Dependency Map
    │
    ├──> Validation ──────> Validation Runs
    │         │
    │         ├──> Run Detail
    │         │
    │         └──> Findings ──> Finding Detail
    │
    ├──> Reports ──────> Report List
    │         │
    │         ├──> Generate Report
    │         │
    │         └──> Download
    │
    ├──> Governance ──────> Policies
    │         │
    │         └──> Compliance
    │
    ├──> AI Insights ──> Insight Detail
    │
    └──> Administration ──> Users / Roles / Settings / Audit / API Keys
```

### 4.2 Cross-Screen Linking Rules

| From                    | To                          | Trigger                            |
| ----------------------- | --------------------------- | ---------------------------------- |
| Dashboard               | Project Detail              | Click project card                 |
| Dashboard               | Validation Run Detail       | Click recent validation            |
| Project Detail          | Resource Inventory (filtered) | Click project resources link     |
| Validation Run Detail   | Finding Detail              | Click finding row                  |
| Finding Detail          | Validation Run Detail       | Click source run                   |
| Resource Detail         | Dependency Map              | Click dependency link              |
| Compliance              | Policy Detail               | Click violating policy             |
| Any list view           | Detail view                 | Click row / item name              |
| Any detail view         | Parent list                 | Back button or breadcrumb          |

---

## 5. User Journeys

### 5.1 Journey 1: First-Time Setup (Onboarding)

```
Sign In
  │
  ▼
Welcome Screen ──> Profile Setup (name, role, org)
  │
  ▼
Connect Azure Subscription (OAuth or service principal)
  │
  ▼
Select Subscriptions to Monitor
  │
  ▼
Create First Project
  │
  ▼
Run Discovery
  │
  ▼
Dashboard (populated with initial data)
```

**Key screens:** Welcome, Profile Setup, Subscription Connection, Subscription Selection, Create Project, Discovery, Dashboard

**Goal:** User has a connected subscription, a project, and initial discovery data within 15 minutes.

### 5.2 Journey 2: Connect Subscription → Discover Resources → Run Validation

```
Projects > Project Detail
  │
  ▼
Discovery > Subscriptions
  │
  ├── Connect New Subscription (if not yet connected)
  │
  ▼
Discovery > Resource Inventory
  │
  ├── Filter / Select resources
  │
  ▼
Validation > Create Validation Run
  │
  ├── Select rules / policy scope
  ├── Configure run parameters
  │
  ▼
Validation > Validation Runs (run in progress)
  │
  ▼
Run Detail (results)
  │
  ├── View pass/fail summary
  ├── Drill into findings
```

**Key screens:** Project Detail, Subscriptions, Resource Inventory, Create Validation Run, Validation Runs, Run Detail, Findings

**Goal:** Validate that selected resources meet migration criteria and identify blockers.

### 5.3 Journey 3: Review Findings → Generate Report → Share with Team

```
Validation > Findings
  │
  ├── Filter by severity / category
  ├── Review individual findings
  │
  ▼
Reports > Generate Report
  │
  ├── Select scope (project, migration, date range)
  ├── Configure sections (summary, findings, recommendations)
  ├── Preview
  │
  ▼
Export (PDF / Excel / JSON)
  │
  ▼
Share via link or download
```

**Key screens:** Findings, Finding Detail, Generate Report, Preview, Download

**Goal:** Produce a shareable migration readiness report for stakeholders.

### 5.4 Journey 4: Create Policy → Monitor Compliance → Audit Trail

```
Governance > Policies
  │
  ├── Create New Policy
  │   ├── Define rules
  │   ├── Set scope (subscription, resource type)
  │   └── Save
  │
  ▼
Governance > Compliance
  │
  ├── View compliance status by policy
  ├── Identify violations
  │
  ▼
Compliance Report Detail
  │
  ├── Drill into violation details
  │
  ▼
Administration > Audit Log
  │
  ├── Filter by user / action / date
  └── View change history
```

**Key screens:** Policy List, Create Policy, Compliance Dashboard, Compliance Report, Audit Log

**Goal:** Establish governance rules, monitor adherence, and maintain an auditable change history.

---

*End of document.*
