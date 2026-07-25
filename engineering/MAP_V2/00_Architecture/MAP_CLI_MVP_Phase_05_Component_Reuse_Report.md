# MAP_CLI_MVP_Phase_05_Component_Reuse_Report.md

**Phase:** 5 — Approved Design Reference Components
**Date:** 2026-07-21
**Status:** COMPLETE — Awaiting Approval
**Authoritative Source:** Docs 16, 21, 22, 23, 24 (approved architecture)

---

## 1. Goal

Compare the frozen frontend with approved architecture policy. Identify presentation components for **design reference** that:
- Contain no unapproved business logic
- Do not conflict with approved architecture principles
- Do not introduce mock data or placeholder behaviour where MAP CLI functionality exists or is defined

No component may be reused simply because it exists. Every component classified for design reference must include a justification showing:
1. The component is presentation-only and contains no unapproved business logic
2. It does not conflict with approved architecture principles
3. It does not introduce mock data where MAP CLI functionality exists or is defined

---

## 2. Source of Truth

| Source | Role |
|--------|------|
| **Doc 16** — Enterprise Business Capability Model | Defines all business capabilities, domains, ownership |
| **Doc 21** — Enterprise Runtime Metadata Contract | Defines capability metadata, routing, navigation, permissions |
| **Doc 22** — Enterprise Navigation Contract | Defines navigation architecture, single source of truth |
| **Doc 23** — Enterprise API Contract | Defines API patterns |
| **Doc 24** — Enterprise Data Contract | Defines data patterns |
| **Existing MAP CLI implementation** (`frontend-mvp/`) | Current implementation baseline |

The frozen frontend (`MAP_V2/03_Source/frontend/`) is **not** the source of truth. It is a read-only reference that may contain hardcoded business logic, mock data, and patterns that conflict with approved architecture.

---

## 3. Frozen Frontend Audit Summary

### 3.1 Structure Overview

| Directory | Files | Content |
|-----------|-------|---------|
| `src/ai/` | ~90 | AI assistant, insights, recommendations, report generator, framework |
| `src/portal/` | ~100 | 9 portal modules with sub-pages, framework, metadata, routing |
| `src/reporting/` | ~80 | Report centre, scheduler, distribution, viewer, HTML reports |
| `src/components/` | ~50 | Common components, widget system, layout (legacy) |
| `src/layout/` | ~20 | Application shell, header, sidebar, footer, breadcrumb |
| `src/navigation/` | ~12 | Navigation system (sidebar, mobile, breadcrumb) |
| `src/pages/` | ~20 | Page-level components (home, dashboard, migration, validation, etc.) |
| `src/dashboard/` | ~25 | Charts, widgets, tables |
| `src/services/` | 7 | API service modules |
| `src/authentication/` | ~15 | Auth pages, context, components, services |
| `src/hooks/` | 4 | Global custom hooks |
| `src/theme/` | ~20 | Design token system |
| `src/config/` | 5 | Configuration files |
| **Total** | **~350+** | TypeScript/TSX source files |

### 3.2 Key Architectural Conflicts

| Conflict | Frozen Frontend | Approved Architecture (Docs 16/21/22) |
|----------|----------------|--------------------------------------|
| Navigation source | Hardcoded in `navigation.config.ts` and `PortalMetadata.ts` | Derived from runtime metadata (Doc 21 §6), API-driven |
| Navigation groups | 4 sections (main, portals, operations, system) | 4 groups (main, operations, system, portals) — similar but must derive from metadata |
| Route definitions | 55+ hardcoded route constants in `config/routes.ts` | Routes defined in capability metadata records (Doc 21 §5) |
| Auth context | Nested providers: AuthProvider → NavigationProvider → AIContextProvider → PortalProvider | Mock auth with hardcoded user object (id: '1', roles: ['admin']) |
| Widget system | WidgetFactory, WidgetRegistry, useWidget — business logic in components | Presentation-only components preferred |
| Portal framework | PortalProvider with 3 sub-contexts (Portal, Navigation, Permissions) | Navigation consumed from metadata, not independent context |

---

## 4. Reuse Decision Rules

Every component was evaluated against these rules:

| Rule | Description |
|------|-------------|
| **R1** | Component must be presentation-only (no business logic, no API calls, no state management beyond UI state) |
| **R2** | Component must not contain hardcoded navigation, routes, or workflow definitions |
| **R3** | Component must not introduce mock data or placeholder behaviour where MAP CLI functionality exists or is defined |
| **R4** | Component must align with the API-driven architecture (Doc 21/22) |
| **R5** | Component must not depend on rejected components (contexts, providers, hardcoded configs) |
| **R6** | Reuse must include a justification showing no unapproved business logic and no architecture conflict |

---

## 5. Component Classification

### 5.1 Approved for Design Reference — Presentation-Only Components

These components are pure display wrappers with no business logic, no hardcoded navigation, and no mock data. They are approved as **design reference only** — not for direct code reuse. Any future adoption must be adapted to the MVP styling approach (CSS variables).

#### 5.1.1 Common Components (`src/components/common/`)

| Component | File | Lines | Reuse Justification |
|-----------|------|-------|---------------------|
| **LoadingSpinner** | `components/common/LoadingSpinner.tsx` | 21 | Pure display: renders a CSS spinner with optional text. No business logic, no navigation, no mock data. Aligns with R1–R5. |
| **AccessDenied** | `components/common/AccessDenied.tsx` | 31 | Pure display: renders 403 error with back button. Uses `useNavigate(-1)` for back navigation only — no hardcoded routes. Aligns with R1–R5. |
| **ErrorPage** | `components/common/ErrorPage.tsx` | — | Pure display: generic error page. No business logic. Aligns with R1–R5. |
| **NotFound** | `components/common/NotFound.tsx` | — | Pure display: 404 page. No business logic. Aligns with R1–R5. |
| **ComingSoon** | `components/common/ComingSoon.tsx` | — | Pure display: placeholder page. **Caution:** Only use where the approved architecture explicitly allows placeholder pages (i.e., capabilities defined in Doc 16 but not yet implemented). Do not use to hide missing MAP CLI functionality. Aligns with R1–R5. |
| **NoData** | `components/common/NoData.tsx` | — | Pure display: empty state. No business logic. Aligns with R1–R5. |
| **LoadingScreen** | `components/common/LoadingScreen.tsx` | — | Pure display: full-screen loading. No business logic. Aligns with R1–R5. |

**Note:** The MVP frontend already has `LoadingSpinner` at `components/LoadingSpinner/LoadingSpinner.tsx`. The frozen version uses Tailwind classes while the MVP uses CSS variables. **Recommendation: Keep MVP version** — it aligns with the existing styling approach. The frozen version may be referenced for size/variant patterns only.

#### 5.1.2 Design Tokens (`src/theme/`) — Candidate Design Reference

| Token File | Lines | Design Reference Justification |
|------------|-------|-------------------------------|
| **colours.ts** | 182 | Pure TypeScript colour palette with light/dark mode. No logic, no business behaviour. **Candidate design reference** — values may inform the MVP colour system. |
| **typography.ts** | 188 | Pure TypeScript font scale. No logic. **Candidate design reference** — values may inform the MVP typography system. |
| **spacing.ts** | 83 | Pure TypeScript spacing/grid/layout tokens. No logic. **Candidate design reference** — values may inform the MVP spacing system. |
| **radius.ts** | — | Border radius tokens. Pure data. **Candidate design reference.** |
| **borders.ts** | — | Border style tokens. Pure data. **Candidate design reference.** |
| **shadows.ts** | — | Box shadow tokens. Pure data. **Candidate design reference.** |
| **animations.ts** | — | Transition/animation tokens. Pure data. **Candidate design reference.** |
| **breakpoints.ts** | — | Responsive breakpoint tokens. Pure data. **Candidate design reference.** |
| **zindex.ts** | — | Z-index scale tokens. Pure data. **Candidate design reference.** |
| **icons.ts** | — | Icon size tokens. Pure data. **Candidate design reference.** |
| **components/** (alerts, buttons, cards, dialogs, forms, tables) | 7 files | Component-level token definitions. Pure data. **Candidate design reference.** |
| **dashboard/** (kpi, progress, risk, score, trend, validation) | 7 files | Dashboard-specific tokens. Pure data. **Candidate design reference.** |

**Note:** The MVP frontend uses CSS variables (`variables.css`) rather than TypeScript tokens. The frozen theme tokens are a more comprehensive design system but are **not automatically reusable**. **Recommendation: Candidate design reference** — the TypeScript token values may inform future MVP design decisions, but direct adoption requires conversion to CSS variables and alignment with the existing styling approach.

#### 5.1.3 Dashboard Cards (`src/dashboard/widgets/`)

| Component | Lines | Reuse Justification |
|-----------|-------|---------------------|
| **KPICard** | 80 | Pure display: renders title, value, delta, trend bars, icon, footer via props. No API calls, no navigation, no business logic. Aligns with R1–R5. |
| **StatusCard** | — | Pure display: status indicator card. No business logic. Aligns with R1–R5. |
| **TrendCard** | — | Pure display: trend indicator card. No business logic. Aligns with R1–R5. |
| **SummaryCard** | — | Pure display: summary data card. No business logic. Aligns with R1–R5. |
| **InformationCard** | — | Pure display: information card. No business logic. Aligns with R1–R5. |
| **MigrationCard** | — | Pure display: migration status card. No business logic. Aligns with R1–R5. |
| **ValidationCard** | — | Pure display: validation status card. No business logic. Aligns with R1–R5. |
| **RiskCard** | — | Pure display: risk indicator card. No business logic. Aligns with R1–R5. |
| **ChartPanel** | — | Pure display: chart container. No business logic. Aligns with R1–R5. |
| **TablePanel** | — | Pure display: table container. No business logic. Aligns with R1–R5. |
| **ProgressPanel** | — | Pure display: progress indicator. No business logic. Aligns with R1–R5. |
| **ReportPanel** | — | Pure display: report container. No business logic. Aligns with R1–R5. |
| **ActivityPanel** | — | Pure display: activity feed. No business logic. Aligns with R1–R5. |
| **AIInsightPanel** | — | Pure display: insight container. No business logic. Aligns with R1–R5. |

**Caveat:** These cards accept typed props and render data. They do NOT fetch data or contain business logic. However, they use Tailwind classes. **Recommendation: Reference for structure and prop patterns** — the MVP uses CSS variables, so styling would need adaptation.

#### 5.1.4 Dashboard Charts (`src/dashboard/charts/`)

| Component | Lines | Reuse Justification |
|-----------|-------|---------------------|
| **LineChart** | 32 | Placeholder display: renders a static placeholder with icon and label. No actual Recharts integration. No business logic. Aligns with R1–R5. |
| **BarChart** | — | Placeholder display. Same pattern. Aligns with R1–R5. |
| **AreaChart** | — | Placeholder display. Same pattern. Aligns with R1–R5. |
| **PieChart** | — | Placeholder display. Same pattern. Aligns with R1–R5. |
| **DonutChart** | — | Placeholder display. Same pattern. Aligns with R1–R5. |
| **GaugeChart** | — | Placeholder display. Same pattern. Aligns with R1–R5. |
| **HeatmapChart** | — | Placeholder display. Same pattern. Aligns with R1–R5. |
| **TimelineChart** | — | Placeholder display. Same pattern. Aligns with R1–R5. |

**Caveat:** These are **static placeholders** — they render an icon and text, not actual charts. The MVP frontend does not yet have chart components. **Recommendation: Do NOT reuse** — these are empty shells with no Recharts integration. Better to build real chart components from scratch aligned with the approved design tokens.

#### 5.1.5 Widget Base (`src/components/widgets/base/`)

| Component | Lines | Reuse Justification |
|-----------|-------|---------------------|
| **Widget** | 80 | Pure display wrapper: renders header, body, footer, loading/error/empty/offline states via props. No business logic. Aligns with R1–R5. |
| **WidgetHeader** | — | Pure display: title, subtitle, icon, action buttons. No business logic. Aligns with R1–R5. |
| **WidgetFooter** | — | Pure display: footer container. No business logic. Aligns with R1–R5. |
| **WidgetBody** | — | Pure display: body container. No business logic. Aligns with R1–R5. |
| **WidgetLoader** | — | Pure display: loading spinner. No business logic. Aligns with R1–R5. |
| **WidgetError** | — | Pure display: error state with retry button. No business logic. Aligns with R1–R5. |

**Caveat:** These use `WidgetConfig`, `WidgetState`, `WidgetAction` types from `components/widgets/types/`. They also depend on Tailwind classes. **Recommendation: Reference for prop patterns** — types are useful but styling needs adaptation.

#### 5.1.6 Widget Cards (`src/components/widgets/cards/`)

| Component | Lines | Reuse Justification |
|-----------|-------|---------------------|
| **KPIWidget** | 67 | Pure display: renders KPI value, label, icon, delta, trend via typed props. No API calls, no navigation. Aligns with R1–R5. |
| **MetricWidget** | — | Pure display: metric display. No business logic. Aligns with R1–R5. |
| **StatusWidget** | — | Pure display: status indicator. No business logic. Aligns with R1–R5. |

**Caveat:** Same Tailwind dependency as other widgets. **Recommendation: Reference for prop patterns only.**

---

### 5.2 REJECTED — Components with Business Logic or Architecture Conflicts

These components were evaluated and rejected based on one or more rules (R1–R6).

#### 5.2.1 Navigation System (`src/navigation/`)

| Component | Rejection Reason | Rules Violated |
|-----------|-----------------|----------------|
| **navigation.config.ts** (391 lines) | Hardcoded navigation with 17 top-level items, 4 sections, 90+ routes. Conflicts with Doc 22 §5.1 (metadata as source of truth). | R2, R3, R4, R5 |
| **NavigationContext.tsx** | Context provider for navigation state. Business logic — manages sidebar expand, mobile drawer, navigation state. | R1, R5 |
| **NavigationProvider.tsx** | Context provider implementation. Business logic. | R1, R5 |
| **NavigationItem.tsx** | Renders nav items from hardcoded config. Tightly coupled to `navigation.config.ts`. | R2, R5 |
| **NavigationGroup.tsx** | Renders nav groups from hardcoded config. | R2, R5 |
| **Sidebar.tsx** (navigation) | Uses hardcoded `navigation.config.ts` and `NavigationContext`. | R2, R5 |
| **MobileNavigation.tsx** | Uses hardcoded config. | R2, R5 |
| **TopNavigation.tsx** | Uses hardcoded config. | R2, R5 |
| **Breadcrumb.tsx** (navigation) | Generates breadcrumb from URL path segments, not from metadata. | R4 |
| **Footer.tsx** (navigation) | Uses `APP_VERSION` from hardcoded config. Minor, but coupled. | R5 |

**Replacement:** The MVP frontend already has `DynamicNavigation` (API-driven, Doc 21/22 compliant) and `Breadcrumb` (metadata-driven). These are the correct implementations.

#### 5.2.2 Layout Components (`src/layout/`)

| Component | Rejection Reason | Rules Violated |
|-----------|-----------------|----------------|
| **ApplicationShell.tsx** | Composes rejected components (Header, Sidebar, Footer, Breadcrumb from navigation). Uses hardcoded `EnvironmentBanner`. | R5 |
| **Header.tsx** | Uses `useNavigation()` (rejected context). Contains theme toggle with local state, notification panel, profile menu — business logic. | R1, R5 |
| **Sidebar.tsx** | Uses `useNavigation()` and `navigationConfig` (both rejected). | R2, R5 |
| **Footer.tsx** | Uses `APP_VERSION` from `config/constants.ts`. Minor coupling. | R5 |
| **Breadcrumb.tsx** | Generates breadcrumb from URL path segments, not from navigation metadata. | R4 |
| **MainLayout.tsx** | Composes rejected layout components. | R5 |
| **PageContainer.tsx** | Pure display wrapper — **potential reuse candidate** but depends on rejected layout system. | R5 |
| **PageHeader.tsx** | Pure display — **potential reuse candidate** but styled with Tailwind. | — |
| **StatusBar.tsx** | Pure display — **potential reuse candidate** but coupled to rejected shell. | R5 |
| **ContentArea.tsx** | Pure display — **potential reuse candidate** but coupled to rejected shell. | R5 |
| **EnvironmentBanner.tsx** | Display-only but hardcoded environment string. Minor. | — |
| **LoadingOverlay.tsx** | Pure display — **potential reuse candidate**. | — |
| **ErrorBoundary.tsx** | Business logic — error boundary with retry. Useful pattern but already in React ecosystem. | — |
| **GlobalSearch.tsx** | Business logic — search with state management. | R1 |
| **NotificationPanel.tsx** | Business logic — notification state and display. | R1 |
| **QuickActions.tsx** | Hardcoded route paths in action buttons. | R2, R3 |
| **UserProfileMenu.tsx** | Business logic — profile menu with auth state. | R1 |

**Replacement:** The MVP frontend has `Layout.tsx` (API-driven, accepts sidebar/breadcrumb as props). This is the correct implementation.

#### 5.2.3 Legacy Layout Components (`src/components/layout/`)

| Component | Rejection Reason |
|-----------|-----------------|
| **Breadcrumb.tsx** | Duplicate of navigation breadcrumb. URL-based, not metadata-based. |
| **ContentArea.tsx** | Duplicate of layout ContentArea. |
| **Footer.tsx** | Duplicate of layout Footer. |
| **Header.tsx** | Duplicate of layout Header. |
| **MainLayout.tsx** | Duplicate of layout MainLayout. |
| **PageTitle.tsx** | Duplicate of layout PageHeader. |
| **Sidebar.tsx** | Duplicate of layout Sidebar. |

All duplicates of rejected components. **Rejected.**

#### 5.2.4 Portal System (`src/portal/`)

| Directory | Rejection Reason | Rules Violated |
|-----------|-----------------|----------------|
| **portal/framework/** (11 files) | Business logic: PortalProvider, PortalContext, PortalShell, PortalLayout — full portal framework with nested contexts. Conflicts with API-driven architecture. | R1, R4, R5 |
| **portal/metadata/PortalMetadata.ts** | Hardcoded portal definitions with inline navigation arrays. Conflicts with Doc 22 §5.1. | R2, R3, R4 |
| **portal/routing/PortalRoutes.tsx** | Hardcoded route definitions for 55+ routes. Conflicts with Doc 21 §5. | R2, R4 |
| **portal/permissions/PortalPermissions.ts** | Business logic — permission checking. | R1 |
| **portal/registry/PortalRegistry.ts** | Business logic — portal registration. | R1 |
| **portal/hooks/** (8 files) | Business logic — dashboard data hooks. | R1 |
| **portal/types/** (12 files) | Type definitions — **potential reuse** for type patterns. | — |
| **portal/administration/** (19 files) | Business logic — admin pages with hardcoded data. | R1, R3 |
| **portal/executive/** (12 files) | Business logic — executive dashboard pages. | R1 |
| **portal/governance/** (11 files) | Business logic — governance pages. | R1 |
| **portal/migration/** (10 files) | Business logic — migration pages. | R1 |
| **portal/operations/** (14 files) | Business logic — operations pages. | R1 |
| **portal/reporting/** (14 files) | Business logic — reporting pages. | R1 |
| **portal/security/** (17 files) | Business logic — security pages. | R1 |
| **portal/task-management/** (8 files) | Business logic — task management pages. | R1 |

**Replacement:** The MVP frontend has portal landing pages (HomePage, DashboardPage, etc.) that are placeholder but correctly structured. The approved architecture defines capabilities in Doc 16 — pages should be built from those, not from frozen portal definitions.

#### 5.2.5 AI System (`src/ai/`)

| Directory | Rejection Reason |
|-----------|-----------------|
| **ai/assistant/** (11 files) | Business logic — AI chat, command palette, conversation history. |
| **ai/components/** (3 files) | Business logic — AI error boundary, status indicator. |
| **ai/framework/** (11 files) | Business logic — AI engine, pipeline, registry, audit, quota. |
| **ai/hooks/** (5 files) | Business logic — AI hooks. |
| **ai/insights/** (12 files) | Business logic — anomaly detection, pattern detection, predictions. |
| **ai/providers/** (1 file) | Business logic — AI provider. |
| **ai/recommendations/** (14 files) | Business logic — recommendation engine. |
| **ai/report-generator/** (13 files) | Business logic — report generation. |
| **ai/services/** (2 files) | Business logic — AI API service. |
| **ai/widgets/** (5 files) | Business logic — AI widgets with data fetching. |

All contain business logic, mock data, or hardcoded behaviour. **All rejected.**

#### 5.2.6 Reporting System (`src/reporting/`)

| Directory | Rejection Reason |
|-----------|-----------------|
| **reporting/centre/** (21 files) | Business logic — report centre with hardcoded data. |
| **reporting/distribution/** (21 files) | Business logic — distribution system. |
| **reporting/html/** (31 files) | Business logic — HTML report generation with templates. |
| **reporting/scheduler/** (19 files) | Business logic — report scheduler. |
| **reporting/viewer/** (25 files) | Business logic — report viewer with annotations, bookmarks, zoom. |

All contain business logic, mock data, or hardcoded behaviour. **All rejected.**

#### 5.2.7 Dashboard System (`src/dashboard/`)

| Directory | Rejection Reason |
|-----------|-----------------|
| **dashboard/framework/** (12 files) | Business logic — DashboardContext, DashboardGrid, DashboardLayout with state management. |
| **dashboard/tables/** (1 file) | Business logic — TableContainer. |

Business logic. **Rejected.**

#### 5.2.8 Pages (`src/pages/`)

All 20 page components contain business logic, hardcoded data, or hardcoded navigation. **All rejected.**

#### 5.2.9 Authentication (`src/authentication/`)

All auth pages, context, services contain business logic. The MVP frontend has `AuthContext.tsx` with mock auth. **All rejected** — the MVP implementation is the correct baseline.

#### 5.2.10 Services (`src/services/`)

All 7 API service modules contain business logic. **All rejected.**

#### 5.2.11 Config (`src/config/`)

| File | Rejection Reason |
|------|-----------------|
| **constants.ts** | Hardcoded constants (APP_VERSION, STORAGE_KEYS). Minor but coupled. |
| **environment.ts** | Environment config. May be useful but coupled to deployment model. |
| **navigation.ts** | Duplicate navigation config. Rejected per Doc 22 §5.3 (duplicate definitions prohibited). |
| **routes.ts** | 55+ hardcoded route constants. Conflicts with Doc 21 §5 (routes from metadata). |
| **theme.ts** | Theme config — **potential reuse** for theme switching pattern. |

#### 5.2.12 Widget System (`src/components/widgets/`)

| Directory | Rejection Reason |
|-----------|-----------------|
| **widgets/ai/** (3 files) | Business logic — AI widgets. |
| **widgets/engine/** (2 files) | Business logic — WidgetFactory, WidgetRenderer. |
| **widgets/hooks/** (1 file) | Business logic — useWidget. |
| **widgets/registry/** (1 file) | Business logic — WidgetRegistry. |
| **widgets/reports/** (2 files) | Business logic — report widgets. |
| **widgets/system/** (3 files) | Business logic — task, notification, timeline widgets. |
| **widgets/tables/** (2 files) | Business logic — grid, summary table widgets. |

Business logic. **Rejected.**

---

## 6. Reuse Decision Summary

### 6.1 Approved for Design Reference

| Category | Components | Count | Reference Type |
|----------|-----------|-------|----------------|
| **Common components** | LoadingSpinner, AccessDenied, ErrorPage, NotFound, ComingSoon (use with caution), NoData, LoadingScreen | 7 | Reference for prop patterns; MVP has own LoadingSpinner |
| **Design tokens** | colours, typography, spacing, radius, borders, shadows, animations, breakpoints, zindex, icons, components/*, dashboard/* | 20 | **Candidate design reference** — values may inform MVP design; requires CSS variable conversion |
| **Dashboard cards** | KPICard, StatusCard, TrendCard, SummaryCard, InformationCard, MigrationCard, ValidationCard, RiskCard, ChartPanel, TablePanel, ProgressPanel, ReportPanel, ActivityPanel, AIInsightPanel | 14 | Reference for prop patterns and structure |
| **Widget base** | Widget, WidgetHeader, WidgetFooter, WidgetBody, WidgetLoader, WidgetError | 6 | Reference for prop patterns and state handling |
| **Widget cards** | KPIWidget, MetricWidget, StatusWidget | 3 | Reference for prop patterns |
| **Total** | | **50** | **Design reference only — no direct code reuse** |

### 6.2 Rejected

| Category | Components | Count | Primary Reason |
|----------|-----------|-------|----------------|
| **Navigation system** | navigation.config.ts, NavigationContext/Provider, NavigationItem, NavigationGroup, Sidebar, MobileNavigation, TopNavigation, Breadcrumb | 12 | Hardcoded navigation — conflicts with Doc 22 |
| **Layout (current)** | ApplicationShell, Header, Sidebar, Footer, Breadcrumb, MainLayout, etc. | 19 | Depends on rejected navigation system |
| **Layout (legacy)** | Breadcrumb, ContentArea, Footer, Header, MainLayout, PageTitle, Sidebar | 7 | Duplicates of rejected components |
| **Portal framework** | PortalProvider, PortalContext, PortalShell, PortalLayout, PortalBreadcrumb, etc. | 11 | Business logic, conflicts with API-driven architecture |
| **Portal pages** | All 9 portal modules (administration, executive, governance, migration, operations, reporting, security, task-management) | ~100 | Business logic, hardcoded data |
| **Portal metadata/routing** | PortalMetadata, PortalRoutes, PortalPermissions, PortalRegistry | 4 | Hardcoded navigation/routes — conflicts with Docs 21/22 |
| **Portal hooks/types** | 8 hooks, 12 type files | 20 | Business logic in hooks; types are reference-only |
| **AI system** | All 11 subdirectories | ~90 | Business logic, mock data |
| **Reporting system** | All 5 subdirectories | ~100 | Business logic, mock data |
| **Dashboard framework** | DashboardContext, DashboardGrid, DashboardLayout, etc. | 12 | Business logic |
| **Pages** | All 20 page components | 20 | Business logic, hardcoded data |
| **Authentication** | All auth pages, context, services | ~15 | Business logic |
| **Services** | All 7 API service modules | 7 | Business logic |
| **Config** | constants, routes, navigation, environment | 5 | Hardcoded constants, duplicate navigation |
| **Widget system** | WidgetFactory, WidgetRegistry, useWidget, AI/report/system widgets | 12 | Business logic |
| **Total** | | **~324** | **Rejected** |

---

## 7. Specific Findings

### 7.1 Duplicate Navigation Definitions (Doc 22 §5.3 Violation)

The frozen frontend contains **3 separate navigation definitions**:
1. `src/navigation/navigation.config.ts` — 17 top-level items, 4 sections
2. `src/config/navigation.ts` — Simpler flat nav (possibly legacy)
3. `src/portal/metadata/PortalMetadata.ts` — 9 portals with inline navigation arrays

Doc 22 §5.3 states: *"Multiple navigation definitions are prohibited."*

**Finding:** All three are rejected. The MVP frontend correctly uses a single API-driven navigation source (`/api/v1/navigation`).

### 7.2 Hardcoded Routes (Doc 21 §5 Violation)

The frozen frontend defines 55+ route constants in `src/config/routes.ts` and hardcodes them in `PortalRoutes.tsx`.

Doc 21 §5 states: *"Routes are defined in the runtime metadata contract."*

**Finding:** Rejected. The MVP frontend correctly derives routes from navigation metadata.

### 7.3 Mock Auth Behaviour

The frozen frontend's `AuthProvider` constructs a hardcoded user object:
```typescript
{ id: '1', roles: ['admin'] }
```

The MVP frontend's `AuthContext.tsx` also uses mock auth but with a role-switching mechanism for development purposes. This is acceptable for the MVP phase.

**Finding:** Both are mock implementations. The MVP version is more flexible (supports role switching). Keep MVP version.

### 7.4 Widget Engine vs. Presentation Widgets

The frozen frontend has two widget layers:
1. **Widget engine** (`WidgetFactory`, `WidgetRegistry`, `useWidget`) — business logic, dynamic widget loading
2. **Presentation widgets** (`KPIWidget`, `MetricWidget`, `StatusWidget`) — pure display via props

Only the presentation widgets are reuse candidates. The engine is rejected.

### 7.5 Tailwind vs. CSS Variables

The frozen frontend uses Tailwind CSS classes throughout. The MVP frontend uses CSS variables (`variables.css`).

**Finding:** Direct code reuse is not possible without styling adaptation. Reuse is limited to **reference for prop patterns, component structure, and design token values**.

---

## 8. Recommendations

### 8.1 Immediate Actions (Phase 5)

1. **No direct code reuse** — all frozen frontend components use Tailwind; MVP uses CSS variables
2. **Design token reference** — `theme/colours.ts`, `typography.ts`, `spacing.ts` provide a comprehensive design system that could be migrated to CSS variables as a future exercise
3. **Prop pattern reference** — `KPICard`, `Widget`, `WidgetHeader` show well-structured prop interfaces that may inform future MVP component design
4. **No mock data introduction** — the frozen frontend's portal pages contain hardcoded mock data; do not port this to the MVP
5. **ComingSoon caution** — only use placeholder pages where the approved architecture explicitly allows them (capabilities defined in Doc 16 but not yet implemented)

### 8.2 Future Considerations

1. **Design token migration** — convert `theme/*.ts` tokens to CSS variables for the MVP (separate exercise, not part of Phase 5)
2. **Chart components** — build real Recharts-based chart components (frozen versions are placeholders)
3. **Widget system** — consider building a lightweight widget wrapper inspired by the frozen `Widget` component but using CSS variables

---

## 9. Phase 5 Gate

**Recommendation:** PROCEED to Phase 6

**Findings:**
- 350+ files audited across 55+ directories
- 50 components classified as **design reference only** (no direct code reuse due to Tailwind vs. CSS variable mismatch)
- 324 components **rejected** (business logic, hardcoded navigation, mock data, architecture conflicts)
- No direct code reuse recommended — all reuse is limited to design reference patterns
- Design tokens are **candidate design reference** — values may inform MVP but require CSS variable conversion
- ComingSoon components are **approved with caution** — only use where architecture explicitly allows placeholder pages
- Frozen frontend's navigation system conflicts with Doc 22 (3 duplicate definitions)
- Frozen frontend's route system conflicts with Doc 21 §5 (hardcoded vs. metadata-derived)
- MVP frontend correctly implements API-driven architecture per Docs 21/22
- No mock data or placeholder behaviour should be introduced from frozen frontend

**Policy Gaps:** None discovered during Phase 5.

**STOP. Do not continue to the next phase. Produce the report, wait for user approval, and only proceed after explicit approval.**
