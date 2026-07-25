# MAP_CLI_MVP_Phase_01_Frontend_Freeze_Report.md

**Phase:** 1 — Freeze Current Frontend
**Date:** 2026-07-20
**Status:** COMPLETE — Awaiting Approval
**Authoritative Source:** engineering/MAP_V2/00_Architecture/ (all architecture documents)

---

## 1. Goal

Freeze the entire existing frontend. No new functionality may be added. It becomes a read-only reference implementation. Only inventory and comparison activities are permitted.

---

## 2. Freeze Declaration

The frontend at `MAP_V2/03_Source/frontend/` is hereby **FROZEN**.

- No new features, components, or pages may be added.
- No modifications to existing components, routing, navigation, or state management.
- No new API integrations or service connections.
- The codebase is preserved as-is for reference during Phases 2–5.

---

## 3. Frontend Location

```
MAP_V2/
└── 03_Source/
    └── frontend/          (FROZEN — reference only)
```

---

## 4. Baseline Inventory

### 4.1 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | ^19.2.7 |
| Build | Vite | ^8.1.1 |
| Routing | react-router-dom | ^7.18.1 |
| Styling | Tailwind CSS | ^4.3.2 |
| Charts | Recharts | ^3.9.2 |
| Data Grid | AG Grid | ^36.0.0 |
| Forms | react-hook-form | ^7.81.0 |
| Validation | Zod | ^4.4.3 |
| Icons | Lucide React | ^1.23.0 |
| State | React Context (multi-layered) | — |
| Notifications | react-toastify | ^11.1.0 |
| HTTP | Native fetch + Axios (legacy) | — |
| Data Fetching | @tanstack/react-query (declared, limited use) | ^5.101.2 |

### 4.2 Source File Count

| Directory | Approximate Files | Description |
|-----------|-------------------|-------------|
| `src/ai/` | ~90 | AI assistant, insights, recommendations, report generator, framework |
| `src/portal/` | ~100 | 9 portal modules with sub-pages, framework, metadata, routing |
| `src/reporting/` | ~80 | Report centre, scheduler, distribution, viewer, HTML reports |
| `src/components/` | ~50 | Common components, widget system, layout (legacy) |
| `src/layout/` | ~20 | Application shell, header, sidebar, footer, breadcrumb |
| `src/navigation/` | ~10 | Navigation system (sidebar, mobile, breadcrumb) |
| `src/pages/` | ~20 | Page-level components (home, dashboard, migration, validation, etc.) |
| `src/dashboard/` | ~25 | Charts, widgets, tables |
| `src/services/` | 7 | API service modules |
| `src/authentication/` | ~15 | Auth pages, context, components, services |
| `src/hooks/` | 4 | Global custom hooks |
| `src/theme/` | ~20 | Design token system |
| `src/config/` | 5 | Configuration files |
| **Total** | **~350+** | TypeScript/TSX source files |

### 4.3 Architecture Overview

**Bootstrap sequence:**
```
index.html → main.tsx → App.tsx → BrowserRouter → AuthProvider → NavigationProvider → AIContextProvider → PortalRoutes → PortalProvider → Routes
```

**Context providers (nested):**
1. AuthProvider — authentication state, login/logout
2. NavigationProvider — sidebar, breadcrumbs, mobile drawer
3. AIContextProvider — AI subsystem state
4. PortalProvider — portal framework (3 sub-contexts: Portal, Navigation, Permissions)

---

## 5. Component Inventory

### 5.1 Pages (20 page-level components)

| Page | Path | Classification |
|------|------|---------------|
| HomePage | `src/pages/HomePage.tsx` | **Hardcoded navigation** — feature cards with inline routes |
| ExecutiveDashboardPage | `src/pages/dashboard/ExecutiveDashboardPage.tsx` | Business logic |
| MigrationOverviewPage | `src/pages/migration/MigrationOverviewPage.tsx` | Business logic |
| MigrationJobsPage | `src/pages/migration/MigrationJobsPage.tsx` | Business logic |
| MigrationHistoryPage | `src/pages/migration/MigrationHistoryPage.tsx` | Business logic |
| ValidationRulesPage | `src/pages/validation/ValidationRulesPage.tsx` | Business logic |
| ValidationResultsPage | `src/pages/validation/ValidationResultsPage.tsx` | Business logic |
| ValidationQueuePage | `src/pages/validation/ValidationQueuePage.tsx` | Business logic |
| GovernancePage | `src/pages/governance/GovernancePage.tsx` | Business logic |
| RiskPage | `src/pages/risk/RiskPage.tsx` | Business logic |
| ReportsPage | `src/pages/reports/ReportsPage.tsx` | Business logic |
| AdministrationPage | `src/pages/administration/AdministrationPage.tsx` | Business logic |
| AIAssistantPage | `src/pages/ai/AIAssistantPage.tsx` | Business logic |
| AIInsightsPage | `src/pages/ai/AIInsightsPage.tsx` | Business logic |
| AIRecommendationsPage | `src/pages/ai/AIRecommendationsPage.tsx` | Business logic |
| AIReportGeneratorPage | `src/pages/ai/AIReportGeneratorPage.tsx` | Business logic |
| SettingsPage | `src/pages/settings/SettingsPage.tsx` | Business logic |
| HelpPage | `src/pages/help/HelpPage.tsx` | Presentation-only |

### 5.2 Portal Pages (~80 components across 9 portals)

| Portal | Components | Navigation Style |
|--------|-----------|-----------------|
| Executive | 12 components | Hardcoded in PortalMetadata |
| Operations | 14 components | Hardcoded in PortalMetadata |
| Migration | 10 components | Hardcoded in PortalMetadata |
| Governance | 7 components | Hardcoded in PortalMetadata |
| Reporting | 14 components | Hardcoded in PortalMetadata |
| Security | 17 components | Hardcoded in PortalMetadata |
| Administration | 17 components | Hardcoded in PortalMetadata |
| Task Management | 8 components | Hardcoded in PortalMetadata |
| AI | 4 pages | Hardcoded in routes |

### 5.3 Authentication Pages (10 components)

| Page | Classification |
|------|---------------|
| LoginPage | Business logic — API call to `/api/v1/auth/login` |
| LogoutPage | Business logic — clears auth state |
| ForgotPasswordPage | Business logic — API call |
| ResetPasswordPage | Business logic — API call with token |
| ChangePasswordPage | Business logic — API call |
| ProfilePage | Business logic — user profile display/edit |
| VerifyMFAPage | Business logic — MFA verification |
| SessionExpiredPage | Presentation-only |
| AccessDeniedPage | Presentation-only |
| AccountLockedPage | Presentation-only |

### 5.4 Reusable Components

**Presentation-only (safe for reuse evaluation):**

| Category | Components | Count |
|----------|-----------|-------|
| Common | AccessDenied, ComingSoon, ErrorPage, LoadingScreen, LoadingSpinner, NoData, NotFound | 7 |
| Layout (current) | ApplicationShell, AuthLayout, BlankLayout, ContentArea, EnvironmentBanner, Footer, Header, LoadingOverlay, MainLayout, PageContainer, PageHeader, StatusBar | 12 |
| Layout (legacy) | Breadcrumb, ContentArea, Footer, Header, MainLayout, PageTitle, Sidebar | 7 |
| Widget Base | Widget, WidgetBody, WidgetError, WidgetFooter, WidgetHeader, WidgetLoader | 6 |
| Widget Cards | KPIWidget, MetricWidget, StatusWidget | 3 |
| Widget Charts | AreaChart, BarChart, Gauge, LineChart, PieChart | 5 |
| Widget System | Timeline, Task, Notification | 3 |
| Widget Tables | Grid, SummaryTable | 2 |
| Dashboard Widgets | KPICard, MigrationCard, ValidationCard, RiskCard, TrendCard, StatusCard, SummaryCard, InformationCard, ChartPanel, TablePanel, ProgressPanel, ReportPanel, ActivityPanel, AIInsightPanel | 14 |
| Dashboard Charts | AreaChart, BarChart, DonutChart, GaugeChart, HeatmapChart, LineChart, PieChart, TimelineChart | 8 |
| Navigation | NavigationGroup, TopNavigation, MobileNavigation, Breadcrumb, Footer | 5 |

**Contains business logic (rejected for reuse):**

| Category | Components | Count |
|----------|-----------|-------|
| Widget Engine | WidgetFactory, WidgetRenderer, WidgetRegistry, useWidget | 4 |
| Widget AI | AISummary, AIRecommendation, AIInsight | 3 |
| Widget Reports | HtmlReport, AuditReport | 2 |
| Navigation Logic | NavigationContext, NavigationProvider, NavigationItem, Sidebar | 4 |
| Layout Logic | Breadcrumb, ErrorBoundary, GlobalSearch, NotificationPanel, QuickActions, Sidebar, UserProfileMenu | 7 |
| AI Assistant | AIAssistant, AIConversation, AIConversationHistory, AICommandPalette, AIContextPanel, AINotificationPanel, AISuggestionPanel | 7 |
| AI Insights | 11 components | 11 |
| AI Recommendations | 13 components | 13 |
| AI Report Generator | 12 components | 12 |
| Dashboard Tables | TableContainer | 1 |

### 5.5 Services (7 API service modules)

| Service | Methods | Classification |
|---------|---------|---------------|
| AdminService | getUsers, getUser, createUser, updateUser, deleteUser, getRoles, getSettings, updateSettings | Business logic |
| AIService | chat, getInsights, getPrompts | Business logic |
| GovernanceService | getPolicies, getCompliance, getAuditLog | Business logic |
| MigrationService | getJobs, getJob, startJob, stopJob, getJobStatus | Business logic |
| ReportingService | getStandardReports, getCustomReports, getScheduledReports, generateReport | Business logic |
| RiskService | getAssessment, getRegister, getMatrix | Business logic |
| ValidationService | getRules, getRule, createRule, updateRule, deleteRule, getResults, getQueue | Business logic |

### 5.6 Design Token System (presentation-only, safe for reuse evaluation)

| Token File | Purpose |
|-----------|---------|
| `src/theme/colours.ts` | Full color palette with dark mode |
| `src/theme/typography.ts` | Font families, sizes, weights |
| `src/theme/spacing.ts` | Spacing scale, grid, layout |
| `src/theme/radius.ts` | Border radius tokens |
| `src/theme/borders.ts` | Border styles |
| `src/theme/shadows.ts` | Box shadow tokens |
| `src/theme/animations.ts` | Transition/animation tokens |
| `src/theme/breakpoints.ts` | Responsive breakpoints |
| `src/theme/zindex.ts` | Z-index scale |
| `src/theme/icons.ts` | Icon sizes |
| `src/theme/components/` | alerts, buttons, cards, dialogs, forms, tables |
| `src/theme/dashboard/` | kpi, progress, risk, score, trend, validation |

---

## 6. Navigation Inventory

### 6.1 Navigation Systems (dual)

**System 1: Sidebar Navigation**
- File: `src/navigation/navigation.config.ts`
- 17 top-level items, 4 sections (Main, Portals, Operations, System)
- Hardcoded in TypeScript, config-driven rendering

**System 2: Portal Metadata Navigation**
- File: `src/portal/metadata/PortalMetadata.ts`
- 9 portal definitions, each with hardcoded `navigation` arrays
- Used for portal sub-navigation

### 6.2 Hardcoded Navigation Locations

| File | Type | Description |
|------|------|-------------|
| `src/navigation/navigation.config.ts` | Hardcoded config | 17 top-level nav items with paths, icons, children |
| `src/config/navigation.ts` | Hardcoded config | Simpler flat nav (possibly legacy) |
| `src/portal/metadata/PortalMetadata.ts` | Hardcoded config | 9 portals with inline navigation arrays |
| `src/pages/HomePage.tsx` | Hardcoded inline | 4 feature cards with inline route paths |
| `src/layout/QuickActions.tsx` | Hardcoded inline | Quick action buttons with route paths |
| `src/config/routes.ts` | Hardcoded constants | 55+ route path constants |

### 6.3 Routes

- Single centralized route file: `src/portal/routing/PortalRoutes.tsx`
- 55+ route constants defined in `src/config/routes.ts`
- Public routes: 8 (login, logout, forgot-password, reset-password, access-denied, session-expired, verify-mfa, account-locked)
- Protected routes: 47+ across all portals

---

## 7. Issues Found

### 7.1 Duplicate Components

| Duplicate Set | Location A | Location B | Recommendation |
|--------------|-----------|-----------|----------------|
| Auth pages | `src/authentication/pages/` | `src/pages/authentication/` | 5 duplicate pages |
| Layout components | `src/layout/` | `src/components/layout/` | 7 duplicate components |
| AI widgets | `src/ai/widgets/` | `src/components/widgets/ai/` | 3 duplicate widgets |

### 7.2 Dead/Orphaned Code

| File | Issue |
|------|-------|
| `src/api/interceptors.ts` | Axios interceptor — not used (client.ts uses fetch) |
| `src/authentication/services/AuthService.ts` | Mock auth service — not used by AuthProvider |
| `src/config/navigation.ts` | Simpler nav config — may be legacy, not used by current Sidebar |

### 7.3 Storage Key Mismatch

- `AuthProvider` stores token as `access_token`
- `config/constants.ts` defines `AUTH_TOKEN = 'map_nexus_auth_token'`
- `api/client.ts` searches multiple keys (fallback chain)
- `api/interceptors.ts` reads `STORAGE_KEYS.AUTH_TOKEN`

### 7.4 Mock/Auth Issues

- `AuthProvider.login()` constructs hardcoded user object (id: '1', roles: ['admin'])
- `AuthService.ts` returns mock tokens
- No real user data fetched from API after login

---

## 8. Reuse Candidates (Presentation-Only)

The following component categories are **presentation-only** and may be evaluated for reuse in Phase 5:

| Category | Count | Justification |
|----------|-------|---------------|
| Common components (AccessDenied, ErrorPage, LoadingScreen, etc.) | 7 | Pure display, no business logic |
| Layout components (ApplicationShell, AuthLayout, BlankLayout, ContentArea, Footer, Header, LoadingOverlay, MainLayout, PageContainer, PageHeader, StatusBar) | 12 | Structural layout, no business logic |
| Widget base components (Widget, WidgetBody, WidgetError, WidgetFooter, WidgetHeader, WidgetLoader) | 6 | Pure display wrappers |
| Widget cards (KPIWidget, MetricWidget, StatusWidget) | 3 | Data display via props |
| Widget charts (AreaChart, BarChart, Gauge, LineChart, PieChart) | 5 | Recharts wrappers |
| Dashboard widgets (14 card/panel types) | 14 | Data display via props |
| Dashboard charts (8 chart types) | 8 | Recharts wrappers |
| Design token system | 20 | Pure TypeScript tokens, no logic |
| **Total candidates** | **75** | |

---

## 9. Phase 1 Gate

**Recommendation:** PROCEED to Phase 2

**Findings:**
- Frontend is frozen as reference-only
- 350+ source files inventoried across 13 directories
- 9 portal modules with ~80 portal page components
- 20 page-level components
- 10 authentication pages
- 75 presentation-only components identified as reuse candidates
- 60+ components contain business logic (rejected for reuse)
- Dual navigation systems identified (both hardcoded)
- 12 duplicate components found across 3 duplicate sets
- 3 dead/orphaned code files identified
- Storage key mismatch documented
- Mock auth behavior documented

**Policy Gaps:** None discovered during Phase 1.

**STOP. Do not continue to the next phase. Produce the report, wait for user approval, and only proceed after explicit approval.**
