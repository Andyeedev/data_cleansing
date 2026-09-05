# 09 — Frontend Implementation

## Application Structure

Root: `MAP_V2/03_Source/frontend/src/`

```
src/
  ai/                    # AI framework, widgets, hooks, services
  api/                   # API client, endpoints, interceptors
  authentication/        # Auth provider, context, pages, components
  components/            # Shared widgets, common components
  config/                # Routes, navigation, constants, theme, environment
  context/               # React context providers
  dashboard/             # Dashboard framework, charts, widgets, tables
  hooks/                 # Custom hooks (useTasks, useWorkflows, etc.)
  layout/                # ApplicationShell, MainLayout, Header, Sidebar
  navigation/            # Navigation config and types
  pages/                 # Page-level components
  portal/                # 9 portal modules + framework + routing
  reporting/             # Report centre, scheduler, viewer, distribution
  services/              # Frontend service layer (7 services)
  styles/                # Global styles
  theme/                 # Design tokens, component styles, dashboard themes
  types/                 # TypeScript type definitions
  utils/                 # Utility functions
```

## Portals (9 portals)

Defined in `MAP_V2/03_Source/frontend/src/portal/`:

| Portal | Directory | Main Component |
|--------|-----------|---------------|
| Executive | `portal/executive/` | `ExecutivePortal.tsx` |
| Migration | `portal/migration/` | `MigrationPortal.tsx` |
| Governance | `portal/governance/` | `GovernancePortal.tsx` |
| Reporting | `portal/reporting/` | `ReportingPortal.tsx` |
| Security | `portal/security/` | `SecurityPortal.tsx` |
| Administration | `portal/administration/` | `AdministrationPortal.tsx` |
| Operations | `portal/operations/` | `OperationsPortal.tsx` |
| Task Management | `portal/task-management/` | `TaskManagementPortal.tsx` |
| Validation | Pages in `pages/validation/` | `ValidationRulesPage.tsx` |

Additional portal infrastructure:
- `portal/framework/` — `PortalProvider`, `PortalShell`, `PortalRenderer`, `PortalLayout`, `PortalContext`, `PortalHeader`, `PortalFooter`, `PortalError`, `PortalContent`, `PortalBreadcrumb`, `PortalLoader`
- `portal/routing/` — `PortalRoutes.tsx` (central route definitions)
- `portal/types/` — Portal type definitions
- `portal/hooks/` — Portal-specific hooks
- `portal/registry/` — Portal registry
- `portal/metadata/` — Portal metadata
- `portal/permissions/` — Portal permission definitions

## Routing

### Route Definitions

File: `MAP_V2/03_Source/frontend/src/config/routes.ts`

68 route constants defined in `ROUTES` object covering:
- Auth routes: `/login`, `/logout`, `/forgot-password`, `/session-expired`, `/access-denied`
- Dashboard: `/dashboard`, `/dashboard/executive`
- Migration: `/migration`, `/migration/overview`, `/migration/jobs`, `/migration/history`
- Validation: `/validation`, `/validation/rules`, `/validation/results`, `/validation/queue`
- Governance: `/governance`, `/governance/policies`, `/governance/compliance`, `/governance/audit`
- Risk: `/risk`, `/risk/assessment`, `/risk/register`, `/risk/matrix`
- Reports: `/reports`, `/reports/standard`, `/reports/custom`, `/reports/scheduled`
- Administration: `/administration`, `/administration/users`, `/administration/roles`, `/administration/settings`
- Task Management: `/task-management`, `/task-management/dashboard`, `/task-management/my-tasks`
- AI: `/ai`, `/ai/assistant`, `/ai/insights`, `/ai/prompts`
- Settings: `/settings`, `/settings/profile`, `/settings/preferences`
- Help: `/help`, `/help/documentation`, `/help/support`

### PortalRoutes

File: `MAP_V2/03_Source/frontend/src/portal/routing/PortalRoutes.tsx`

Uses `react-router-dom` v7 with nested `<Routes>` and `<Route>` elements:
- Public routes wrapped in `<AuthLayout>` and `<PublicRoute>`
- Protected routes wrapped in `<ProtectedRoute>` and `<ErrorBoundary>`
- All protected routes rendered inside `<MainLayout>` with `<Outlet />`

## Layouts

### ApplicationShell

File: `MAP_V2/03_Source/frontend/src/layout/ApplicationShell.tsx`

Composes the application chrome:
- `EnvironmentBanner` — shows environment indicator
- `Header` — top navigation bar
- `Sidebar` — left navigation panel (conditional via `showSidebar` prop)
- `Breadcrumb` — navigation breadcrumb
- `Footer` — bottom bar
- `StatusBar` — status indicator
- `LoadingOverlay` — loading state overlay

### MainLayout

File: `MAP_V2/03_Source/frontend/src/layout/MainLayout.tsx`

Wraps `<ApplicationShell>` with `<Toaster>` and `<Outlet />` for nested route rendering.

### Additional Layout Components

| Component | File |
|-----------|------|
| `AuthLayout` | `layout/AuthLayout.tsx` |
| `BlankLayout` | `layout/BlankLayout.tsx` |
| `Header` | `layout/Header.tsx` |
| `Sidebar` | `layout/Sidebar.tsx` |
| `Footer` | `layout/Footer.tsx` |
| `Breadcrumb` | `layout/Breadcrumb.tsx` |
| `StatusBar` | `layout/StatusBar.tsx` |
| `PageHeader` | `layout/PageHeader.tsx` |
| `PageContainer` | `layout/PageContainer.tsx` |
| `ContentArea` | `layout/ContentArea.tsx` |
| `GlobalSearch` | `layout/GlobalSearch.tsx` |
| `QuickActions` | `layout/QuickActions.tsx` |
| `NotificationPanel` | `layout/NotificationPanel.tsx` |
| `UserProfileMenu` | `layout/UserProfileMenu.tsx` |
| `EnvironmentBanner` | `layout/EnvironmentBanner.tsx` |
| `ErrorBoundary` | `layout/ErrorBoundary.tsx` |
| `LoadingOverlay` | `layout/LoadingOverlay.tsx` |

## Components

Total TSX files in `frontend/src/`: **407**

### Dashboard Framework

| Component | File |
|-----------|------|
| `DashboardLayout` | `dashboard/framework/DashboardLayout.tsx` |
| `DashboardPage` | `dashboard/framework/DashboardPage.tsx` |
| `DashboardGrid` | `dashboard/framework/DashboardGrid.tsx` |
| `DashboardSection` | `dashboard/framework/DashboardSection.tsx` |
| `DashboardToolbar` | `dashboard/framework/DashboardToolbar.tsx` |
| `DashboardFilters` | `dashboard/framework/DashboardFilters.tsx` |
| `DashboardContext` | `dashboard/framework/DashboardContext.tsx` |
| `DashboardActions` | `dashboard/framework/DashboardActions.tsx` |
| `WidgetContainer` | `dashboard/framework/WidgetContainer.tsx` |
| `WidgetHeader` | `dashboard/framework/WidgetHeader.tsx` |
| `WidgetFooter` | `dashboard/framework/WidgetFooter.tsx` |

### Dashboard Charts

| Chart | File |
|-------|------|
| `AreaChart` | `dashboard/charts/AreaChart.tsx` |
| `BarChart` | `dashboard/charts/BarChart.tsx` |
| `DonutChart` | `dashboard/charts/DonutChart.tsx` |
| `GaugeChart` | `dashboard/charts/GaugeChart.tsx` |
| `HeatmapChart` | `dashboard/charts/HeatmapChart.tsx` |
| `LineChart` | `dashboard/charts/LineChart.tsx` |
| `PieChart` | `dashboard/charts/PieChart.tsx` |
| `TimelineChart` | `dashboard/charts/TimelineChart.tsx` |

### Dashboard Widgets

| Widget | File |
|--------|------|
| `KPICard` | `dashboard/widgets/KPICard.tsx` |
| `SummaryCard` | `dashboard/widgets/SummaryCard.tsx` |
| `StatusCard` | `dashboard/widgets/StatusCard.tsx` |
| `TrendCard` | `dashboard/widgets/TrendCard.tsx` |
| `RiskCard` | `dashboard/widgets/RiskCard.tsx` |
| `ValidationCard` | `dashboard/widgets/ValidationCard.tsx` |
| `MigrationCard` | `dashboard/widgets/MigrationCard.tsx` |
| `InformationCard` | `dashboard/widgets/InformationCard.tsx` |
| `ChartPanel` | `dashboard/widgets/ChartPanel.tsx` |
| `TablePanel` | `dashboard/widgets/TablePanel.tsx` |
| `ReportPanel` | `dashboard/widgets/ReportPanel.tsx` |
| `ProgressPanel` | `dashboard/widgets/ProgressPanel.tsx` |
| `ActivityPanel` | `dashboard/widgets/ActivityPanel.tsx` |
| `AIInsightPanel` | `dashboard/widgets/AIInsightPanel.tsx` |

### Dashboard Types

File: `dashboard/framework/dashboard.types.ts`

Defines `DashboardType` as: `executive | migration | validation | governance | risk | reporting | administration | ai`

## Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useTasks` | `hooks/useTasks.ts` | Fetch task list with filters |
| `useMyTasks` | `hooks/useTasks.ts` | Fetch current user's tasks |
| `useTask` | `hooks/useTasks.ts` | Fetch single task by ID |
| `useCreateTask` | `hooks/useTasks.ts` | Create task mutation |
| `useUpdateTask` | `hooks/useTasks.ts` | Update task mutation |
| `useDeleteTask` | `hooks/useTasks.ts` | Delete task mutation |
| `useWorkflows` | `hooks/useWorkflows.ts` | Fetch workflow list |
| `useWorkflow` | `hooks/useWorkflows.ts` | Fetch single workflow |
| `useNotifications` | `hooks/useNotifications.ts` | Notification management |
| `useCalendar` | `hooks/useCalendar.ts` | Calendar event management |

### AI Hooks

| Hook | File |
|------|------|
| `useAI` | `ai/hooks/useAI.ts` |
| `useAIAudit` | `ai/hooks/useAIAudit.ts` |
| `useAIRegistry` | `ai/hooks/useAIRegistry.ts` |
| `useAIUsage` | `ai/hooks/useAIUsage.ts` |

### Widget Hook

| Hook | File |
|------|------|
| `useWidget` | `components/widgets/hooks/useWidget.ts` |

### Reporting Hook

| Hook | File |
|------|------|
| `useReportScheduler` | `reporting/scheduler/hooks/useReportScheduler.ts` |

## Services (7 frontend services)

| Service | File | Purpose |
|---------|------|---------|
| `AdminService` | `services/AdminService.ts` | Administration API |
| `AIService` | `services/AIService.ts` | AI assistant API |
| `GovernanceService` | `services/GovernanceService.ts` | Governance API |
| `MigrationService` | `services/MigrationService.ts` | Migration API |
| `ReportingService` | `services/ReportingService.ts` | Reporting API |
| `RiskService` | `services/RiskService.ts` | Risk management API |
| `ValidationService` | `services/ValidationService.ts` | Validation API |

Additionally, `ai/services/AIService.ts` provides the AI-specific service layer.

## API Layer

### API Client

File: `MAP_V2/03_Source/frontend/src/api/client.ts`

```typescript
const API_BASE = '/api/v1';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
    || localStorage.getItem('token') || sessionStorage.getItem('token')
    || localStorage.getItem('map_nexus_token') || localStorage.getItem('map_nexus_auth_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  // ... error handling and JSON parsing
}

export const api = {
  get: <T>(endpoint: string) => fetchApi<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) => fetchApi<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) => fetchApi<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'DELETE' }),
};
```

### API Endpoints

File: `MAP_V2/03_Source/frontend/src/api/endpoints.ts`

Defines endpoint constants for: `AUTH`, `USERS`, `MIGRATION`, `VALIDATION`, `GOVERNANCE`, `RISK`, `REPORTS`, `AI`, `ADMIN`.

### Interceptors

File: `MAP_V2/03_Source/frontend/src/api/interceptors.ts`

Axios interceptors for:
- **Request**: Attaches `Authorization: Bearer {token}` from `localStorage`
- **Response**: On 401, clears tokens and redirects to `/session-expired`

## Authentication

### AuthProvider

File: `authentication/context/AuthProvider.tsx`

### AuthContext

File: `authentication/context/AuthContext.tsx`

### AuthService

File: `authentication/services/AuthService.ts`

Methods:
- `login(credentials)` — authenticate user
- `logout()` — end session
- `refresh()` — refresh JWT token
- `forgotPassword(email)` — send reset email
- `resetPassword(data)` — reset with token
- `verifyMFA(data)` — verify MFA code
- `changePassword(data)` — change password
- `getProviderConfig(provider)` — returns OAuth config for Microsoft, Google, GitHub, or local

### Protected/Public Routes

| Component | File |
|-----------|------|
| `ProtectedRoute` | `authentication/components/ProtectedRoute.tsx` |
| `PublicRoute` | `authentication/components/PublicRoute.tsx` |

### Auth Pages (10 pages)

| Page | File |
|------|------|
| `LoginPage` | `authentication/pages/LoginPage.tsx` |
| `LogoutPage` | `authentication/pages/LogoutPage.tsx` |
| `ForgotPasswordPage` | `authentication/pages/ForgotPasswordPage.tsx` |
| `ResetPasswordPage` | `authentication/pages/ResetPasswordPage.tsx` |
| `AccessDeniedPage` | `authentication/pages/AccessDeniedPage.tsx` |
| `AccountLockedPage` | `authentication/pages/AccountLockedPage.tsx` |
| `SessionExpiredPage` | `authentication/pages/SessionExpiredPage.tsx` |
| `VerifyMFAPage` | `authentication/pages/VerifyMFAPage.tsx` |
| `ChangePasswordPage` | `authentication/pages/ChangePasswordPage.tsx` |
| `ProfilePage` | `authentication/pages/ProfilePage.tsx` |

## Dashboard Framework

The dashboard system is built around:

1. **DashboardContext** — manages state (current dashboard, filters, refresh)
2. **DashboardLayout** — grid-based layout container
3. **DashboardGrid** — responsive grid system
4. **WidgetContainer** — wraps individual widgets with header/footer
5. **DashboardToolbar** — refresh, export, print, filter, search, AI assistant actions

Supported dashboard types: `executive`, `migration`, `validation`, `governance`, `risk`, `reporting`, `administration`, `ai`

## Design System

### Theme Tokens

Directory: `theme/`

| Module | File | Purpose |
|--------|------|---------|
| Colours | `theme/colours.ts` | Color palette |
| Typography | `theme/typography.ts` | Font styles |
| Spacing | `theme/spacing.ts` | Spacing scale |
| Shadows | `theme/shadows.ts` | Box shadows |
| Radius | `theme/radius.ts` | Border radius |
| Borders | `theme/borders.ts` | Border styles |
| Breakpoints | `theme/breakpoints.ts` | Responsive breakpoints |
| Z-Index | `theme/zindex.ts` | Layering system |
| Animations | `theme/animations.ts` | Transition definitions |
| Icons | `theme/icons.ts` | Icon mappings |

### Component Styles

| Module | File |
|--------|------|
| Alerts | `theme/components/alerts.ts` |
| Buttons | `theme/components/buttons.ts` |
| Cards | `theme/components/cards.ts` |
| Dialogs | `theme/components/dialogs.ts` |
| Forms | `theme/components/forms.ts` |
| Tables | `theme/components/tables.ts` |
