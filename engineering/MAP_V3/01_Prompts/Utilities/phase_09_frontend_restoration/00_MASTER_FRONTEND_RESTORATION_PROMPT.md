
# 00_MASTER_FRONTEND_RESTORATION_PROMPT


Objective

The objective of this master prompt is to analyse the Phase 09 Frontend Restoration Specification and generate a set of focused implementation prompts organised by functional workstream.

Each generated prompt must be:

self-contained
implementation-ready
based only on the sections assigned to that workstream
preserve all technical detail
preserve traceability back to the original specification
avoid duplication with other workstreams
clearly identify dependencies on other prompts

The generated prompts will be used independently by OpenCode to implement each workstream.

---------

## Implementation Directive – Mandatory

> **This section is governed by `09Z_Implementation_Governance.md`. Refer to that document for all implementation rules, gap analysis templates, definition of done, testing requirements, and coding standards.**
> 
> **All rules in the governance document are mandatory. No implementation may begin until the gap analysis has been completed.**

---------
# Phase 09A — Platform Foundation

Objective

Build the reusable application framework that every functional area depends upon.

09A.1 Design System
Design tokens
Typography
Colour palette
Icons
Shadows
Responsive grid
Animation
Accessibility tokens
09A.2 Shared Components
MetricCard
DataTable
StatusBadge
ProgressBar
EmptyState
ErrorState
LoadingSkeleton
Modal
ConfirmDialog
Toast
Pagination
SearchBar
TabBar
09A.3 Application Shell
Login
Authentication
JWT handling
Protected Routes
AppShell
Sidebar
Navigation
Responsive navigation
Layout containers
09A.4 Platform Services
Notification service
Toast service
Error handling
API client
State management
Permission guards
Phase 09B — Migration & Execution

Objective

Restore operational execution capability.

Migration
Migration Dashboard
Systems
Batch execution
Batch history
Batch detail
Execution progress
Batch polling
Validation Reports
APIs
/migration/*
/validation/*
Phase 09C — Governance & Compliance

Restore governance functionality.

Compliance
Compliance dashboard
Audit
Exceptions
Approvals
Governance metrics
Compliance KPIs
APIs
/governance/*
Phase 09D — Operations

Restore operational monitoring.

Monitoring
Health
Alerts
Service Status
Platform monitoring
APIs
/operations/*
Phase 09E — Platform Administration

Administrative capabilities.

Administration
Users
Roles
Settings
Notifications
Tasks
APIs
/users/*
/roles/*
/tasks/*
/notifications/*
/settings/*
Phase 09F — Cross-Cutting Platform Services

Everything that supports every page.

State Machines
Loading
Error
Empty
Success
Retry
Error Recovery
401
403
404
422
429
500
503
Performance
Polling
Lazy loading
Bundle optimisation
Pagination
Debounce
Accessibility
WCAG
Keyboard navigation
ARIA
Screen readers
Testing
Unit
Integration
E2E
Accessibility
Performance
API contract tests
Phase 09G — Future Modules

Hidden behind feature flags.

Reports
Mapping
AI
Security Portal
Advanced Workflow




---

# Inputs


MAP_V2/
│
├── 01_prompts/
│   └── utilities/
│       └── phase_09_frontend_restoration/
│
│           00_MASTER_FRONTEND_RESTORATION_PROMPT.md
│
│           09A_Platform_Foundation.md
│           09B_Migration_Execution.md
│           09C_Governance_Compliance.md
│           09D_Operations.md
│           09E_Platform_Administration.md
│           09F_Cross_Cutting_Platform_Services.md
│           09G_Future_Modules.md



---

# Production Promotion

After engineering review and explicit user approval, promote only:


to


└── 00_outputs/
    └── utilities/
        └── phase_09_Frontend_Architecture/
            (generated architecture)