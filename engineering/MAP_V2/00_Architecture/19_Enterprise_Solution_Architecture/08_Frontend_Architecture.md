# 08_Frontend_Architecture.md

# Frontend Architecture

### MAP Nexus Enterprise Solution Architecture

---

## Purpose

This document describes the React frontend architecture, routing, portals, services, and state management.

---

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | React | 19 |
| Language | TypeScript | Latest |
| Build Tool | Vite | Latest |
| Routing | React Router | v6 |
| Styling | Tailwind CSS | Latest |
| HTTP Client | Fetch API + Axios interceptors | Native |

---

## File Inventory

| Category | Count |
|----------|-------|
| TypeScript files (.ts) | ~200 |
| TSX files (.tsx) | ~325 |
| **Total** | **525** |

---

## Application Entry

### Root Component
- **File**: `MAP_V2/03_Source/frontend/src/App.tsx:7`
- **Structure**:
  ```
  <Router>
    <AuthProvider>
      <NavigationProvider>
        <AIContextProvider>
          <PortalRoutes />
        </AIContextProvider>
      </NavigationProvider>
    </AuthProvider>
  </Router>
  ```

### Context Providers
| Provider | File | Purpose |
|----------|------|---------|
| AuthProvider | `src/authentication/context/AuthProvider.tsx:16` | Authentication state |
| NavigationProvider | `src/navigation/NavigationProvider.tsx` | Navigation state |
| AIContextProvider | `src/ai/` | AI features state |
| PortalProvider | `src/portal/framework/PortalProvider.tsx` | Portal state |

---

## Routing

### Route Configuration
- **File**: `MAP_V2/03_Source/frontend/src/config/routes.ts:1`
- **Pattern**: Centralized route constants

### Portal Routes
- **File**: `MAP_V2/03_Source/frontend/src/portal/routing/PortalRoutes.tsx:48`
- **Pattern**: Nested routes with `ProtectedRoute` and `PublicRoute`

---

## 9 Portals

### 1. Executive Portal
- **Route**: `/dashboard/executive`
- **Component**: `ExecutiveDashboardPage`
- **File**: `src/pages/dashboard/ExecutiveDashboardPage.tsx`

### 2. Operations Portal
- **Route**: `/operations/*`
- **Component**: `OperationsPortal`
- **File**: `src/portal/operations/OperationsPortal.tsx`
- **Sub-routes**: overview, executions, queues, schedules, monitoring, alerts, retry

### 3. Migration Portal
- **Route**: `/migration/*`
- **Component**: `MigrationPortal`
- **File**: `src/portal/migration/MigrationPortal.tsx`
- **Sub-routes**: overview, projects, execution, datasets, mappings, schedules, history, reports, workspace

### 4. Validation Portal
- **Route**: `/validation/*`
- **Components**: `ValidationRulesPage`, `ValidationResultsPage`, `ValidationQueuePage`
- **Files**: `src/pages/validation/ValidationRulesPage.tsx`, `ValidationResultsPage.tsx`, `ValidationQueuePage.tsx`

### 5. Governance Portal
- **Route**: `/governance/*`
- **Component**: `GovernancePortal`
- **File**: `src/portal/governance/GovernancePortal.tsx`
- **Sub-routes**: overview, compliance, policies, controls, exceptions, risk, audit, reports, workspace

### 6. Risk Portal
- **Route**: `/risk/*`
- **Component**: `RiskPage`
- **File**: `src/pages/risk/RiskPage.tsx`
- **Sub-routes**: assessment, register, matrix

### 7. Reports Portal
- **Route**: `/reports/*`
- **Component**: `ReportingPortal`
- **File**: `src/portal/reporting/ReportingPortal.tsx`
- **Sub-routes**: overview, executive, operational, migration, validation, governance, audit, regulatory, scheduled, templates, distribution, workspace

### 8. Security Portal
- **Route**: `/security/*`
- **Component**: `SecurityPortal`
- **File**: `src/portal/security/SecurityPortal.tsx`
- **Sub-routes**: overview, credentials, encryption, keys, certificates, identity-providers, authentication, mfa, sessions, api-security, audit-logs, security-events, threat-monitoring, compliance, dashboard

### 9. Administration Portal
- **Route**: `/administration/*`
- **Component**: `AdministrationPortal`
- **File**: `src/portal/administration/AdministrationPortal.tsx`
- **Sub-routes**: overview, tenants, organisations, users, roles, permissions, subscriptions, licensing, configuration, feature-flags, system-settings, scheduler, notifications, environment, maintenance, health, dashboard

### Additional Portals
| Portal | Route | Component |
|--------|-------|-----------|
| AI Portal | `/ai/*` | `AIAssistantPage`, `AIInsightsPage`, `AIRecommendationsPage`, `AIReportGeneratorPage` |
| Report Centre | `/report-centre/*` | `ReportCentre` |
| Report Scheduler | `/scheduler/*` | `ReportScheduler` |
| Report Distribution | `/distribution/*` | `ReportDistributionCentre` |
| Task Management | `/task-management/*` | `TaskManagementPortal` |

---

## Navigation System

### Configuration
- **File**: `MAP_V2/03_Source/frontend/src/config/navigation.ts:10`
- **Structure**: `NavItem[]` with label, path, icon, children

### Top-Level Navigation
| Label | Path | Children |
|-------|------|----------|
| Home | `/` | — |
| Executive Dashboard | `/dashboard/executive` | — |
| Migration | `/migration` | Overview, Jobs, History |
| Validation | `/validation` | Rules, Results, Queue |
| Governance | `/governance` | Policies, Compliance, Audit |
| Risk | `/risk` | Assessment, Register, Matrix |
| Reports | `/reports` | Standard, Custom, Scheduled |
| Administration | `/administration` | Users, Roles, Settings |
| AI Assistant | `/ai` | Assistant, Insights, Prompts |
| Settings | `/settings` | Profile, Preferences |
| Help | `/help` | Documentation, Support |

---

## Frontend Services (7)

| Service | File | Purpose |
|---------|------|---------|
| AdminService | `src/services/AdminService.ts` | User/role CRUD |
| AIService | `src/services/AIService.ts` | AI chat, insights |
| GovernanceService | `src/services/GovernanceService.ts` | Governance data |
| MigrationService | `src/services/MigrationService.ts` | Migration jobs |
| ReportingService | `src/services/ReportingService.ts` | Report generation |
| RiskService | `src/services/RiskService.ts` | Risk assessment |
| ValidationService | `src/services/ValidationService.ts` | Validation rules/results |

---

## API Integration

### API Client
- **File**: `MAP_V2/03_Source/frontend/src/api/client.ts:1`
- **Pattern**: Fetch-based client with JWT token injection
- **Base URL**: `/api/v1`
- **Methods**: `api.get()`, `api.post()`, `api.put()`, `api.delete()`

### API Endpoints
- **File**: `MAP_V2/03_Source/frontend/src/api/endpoints.ts:1`
- **Pattern**: Centralized endpoint constants

### Interceptors
- **File**: `MAP_V2/03_Source/frontend/src/api/interceptors.ts:5`
- **Request**: Attach JWT token from localStorage
- **Response**: Handle 401 → redirect to session expired

---

## Authentication

### Auth Provider
- **File**: `MAP_V2/03_Source/frontend/src/authentication/context/AuthProvider.tsx:16`
- **State**: `user`, `token`, `isAuthenticated`, `isLoading`
- **Methods**: `login()`, `logout()`, `refreshToken()`, `updateUser()`

### Token Storage
- **Primary**: `localStorage.getItem('access_token')`
- **Fallbacks**: `sessionStorage`, `map_nexus_token`, `map_nexus_auth_token`

### Protected Routes
- **File**: `src/authentication/components/ProtectedRoute.tsx`
- **Pattern**: Redirect to `/login` if not authenticated

---

## State Management

### Pattern
- **Primary**: React Context + useState/useCallback hooks
- **No Redux/Zustand**: Simple state management via Context

### Contexts
| Context | File | Purpose |
|---------|------|---------|
| AuthContext | `src/authentication/context/AuthContext.tsx` | Auth state |
| NavigationContext | `src/navigation/NavigationContext.tsx` | Nav state |
| AIContext | `src/ai/` | AI features |
| PortalContext | `src/portal/framework/PortalContext.tsx` | Portal state |

### Custom Hooks
| Hook | File | Purpose |
|------|------|---------|
| useWorkflows | `src/hooks/useWorkflows.ts` | Workflow data |
| useTasks | `src/hooks/useTasks.ts` | Task data |
| useNotifications | `src/hooks/useNotifications.ts` | Notification data |
| useCalendar | `src/hooks/useCalendar.ts` | Calendar data |
| useWidget | `src/components/widgets/hooks/useWidget.ts` | Widget data |
| useAI | `src/ai/hooks/useAI.ts` | AI features |
| useAIUsage | `src/ai/hooks/useAIUsage.ts` | AI usage |
| useAIRegistry | `src/ai/hooks/useAIRegistry.ts` | AI registry |
| useAIAudit | `src/ai/hooks/useAIAudit.ts` | AI audit |

---

## Dashboard Components

### Framework
- **File**: `src/dashboard/framework/`
- **Components**: `DashboardPage`, `DashboardLayout`, `DashboardGrid`, `DashboardSection`, `DashboardToolbar`, `DashboardFilters`, `DashboardContext`, `DashboardActions`, `WidgetContainer`, `WidgetHeader`, `WidgetFooter`

### Widgets (15)
| Widget | File |
|--------|------|
| ActivityPanel | `src/dashboard/widgets/ActivityPanel.tsx` |
| AIInsightPanel | `src/dashboard/widgets/AIInsightPanel.tsx` |
| ChartPanel | `src/dashboard/widgets/ChartPanel.tsx` |
| InformationCard | `src/dashboard/widgets/InformationCard.tsx` |
| KPICard | `src/dashboard/widgets/KPICard.tsx` |
| MigrationCard | `src/dashboard/widgets/MigrationCard.tsx` |
| ProgressPanel | `src/dashboard/widgets/ProgressPanel.tsx` |
| ReportPanel | `src/dashboard/widgets/ReportPanel.tsx` |
| RiskCard | `src/dashboard/widgets/RiskCard.tsx` |
| StatusCard | `src/dashboard/widgets/StatusCard.tsx` |
| SummaryCard | `src/dashboard/widgets/SummaryCard.tsx` |
| TablePanel | `src/dashboard/widgets/TablePanel.tsx` |
| TrendCard | `src/dashboard/widgets/TrendCard.tsx` |
| ValidationCard | `src/dashboard/widgets/ValidationCard.tsx` |

### Charts (7)
| Chart | File |
|-------|------|
| AreaChart | `src/dashboard/charts/AreaChart.tsx` |
| BarChart | `src/dashboard/charts/BarChart.tsx` |
| DonutChart | `src/dashboard/charts/DonutChart.tsx` |
| GaugeChart | `src/dashboard/charts/GaugeChart.tsx` |
| HeatmapChart | `src/dashboard/charts/HeatmapChart.tsx` |
| LineChart | `src/dashboard/charts/LineChart.tsx` |
| PieChart | `src/dashboard/charts/PieChart.tsx` |
| TimelineChart | `src/dashboard/charts/TimelineChart.tsx` |

---

## Reporting Components

### Viewer
- **Directory**: `src/reporting/viewer/`
- **Components**: `ReportViewer`, `ReportCanvas`, `ReportToolbar`, `ReportSidebar`, `ReportSearch`, `ReportProperties`, `ReportPrintPreview`, `ReportOutline`, `ReportNavigation`, `ReportMetadata`, `ReportHeader`, `ReportFullscreen`, `ReportFooter`, `ReportComments`, `ReportBookmarks`, `ReportAnnotations`, `ReportZoom`

### Scheduler
- **Directory**: `src/reporting/scheduler/`
- **Components**: `ReportScheduler`, `ScheduleCalendar`, `ScheduleDetails`, `ScheduleEditor`, `ScheduleExplorer`, `ScheduleHistory`, `ScheduleLogs`, `ScheduleNotifications`, `ScheduleQueue`, `ScheduleStatistics`, `ScheduleTemplates`, `ScheduleTimeline`, `SchedulerDashboard`, `SchedulerSettings`, `SchedulerWorkspace`

### Report Centre
- **Directory**: `src/reporting/centre/`
- **Component**: `ReportCentre`

### Distribution
- **Directory**: `src/reporting/distribution/`
- **Component**: `ReportDistributionCentre`

---

## AI Components

### Framework
- **Directory**: `src/ai/framework/`
- **Components**: `AIFramework`, `AIEngine`, `AIPipeline`, `AIConfiguration`, `AIRegistry`, `AIQuota`, `AISettings`, `AIUsage`, `AIAudit`

### Report Generator
- **Directory**: `src/ai/report-generator/`
- **Components**: `AIReportGenerator`, `ChartGenerator`, `ComplianceReport`, `CustomReportBuilder`, `DataStoryTeller`, `ExecutiveSummary`, `NarrativeGenerator`, `ReportGeneratorDashboard`, `ReportGeneratorExplorer`, `ReportTemplateEngine`, `SummaryGenerator`, `TechnicalReport`

### Widgets
- **Directory**: `src/ai/widgets/`
- **Components**: `AIInsightWidget`, `AIRecommendationWidget`, `AIStatusWidget`, `AIUsageWidget`

---

## Evidence

| Component | File Path |
|-----------|-----------|
| App root | `MAP_V2/03_Source/frontend/src/App.tsx:7` |
| Portal routes | `src/portal/routing/PortalRoutes.tsx:48` |
| Routes config | `src/config/routes.ts:1` |
| Navigation config | `src/config/navigation.ts:10` |
| API client | `src/api/client.ts:1` |
| API endpoints | `src/api/endpoints.ts:1` |
| Interceptors | `src/api/interceptors.ts:5` |
| Auth provider | `src/authentication/context/AuthProvider.tsx:16` |
| Admin service | `src/services/AdminService.ts` |
| Validation service | `src/services/ValidationService.ts` |
| File count | 525 TypeScript/TSX files |

---

*Document Version: 1.0 | Evidence-Based: Yes | File References: 50+*
