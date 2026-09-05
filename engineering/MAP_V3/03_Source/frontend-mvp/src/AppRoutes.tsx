import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/Shell/Shell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthLayout } from './components/AuthLayout';
import { LoginPage } from './routes/LoginPage';
import { SessionExpiredPage } from './routes/SessionExpiredPage';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { ValidationFilterProvider } from './context/ValidationFilterContext';

const DashboardPage = lazy(() => import('./routes/DashboardPage').then(m => ({ default: m.DashboardPage })));
const MigrationPage = lazy(() => import('./routes/MigrationPage').then(m => ({ default: m.MigrationPage })));
const DiscoveryPage = lazy(() => import('./routes/DiscoveryPage').then(m => ({ default: m.DiscoveryPage })));
const MappingPage = lazy(() => import('./routes/MappingPage').then(m => ({ default: m.MappingPage })));
const ValidationPage = lazy(() => import('./routes/ValidationPage').then(m => ({ default: m.ValidationPage })));
const ValidationResultsPage = lazy(() => import('./routes/ValidationResultsPage').then(m => ({ default: m.ValidationResultsPage })));
const GovernancePage = lazy(() => import('./routes/GovernancePage').then(m => ({ default: m.GovernancePage })));
const ReportsPage = lazy(() => import('./routes/ReportsPage').then(m => ({ default: m.ReportsPage })));
const OperationsPage = lazy(() => import('./routes/OperationsPage').then(m => ({ default: m.OperationsPage })));
const OperationsExecutionPage = lazy(() => import('./routes/OperationsExecutionPage').then(m => ({ default: m.OperationsExecutionPage })));
const TaskManagementPage = lazy(() => import('./routes/TaskManagementPage').then(m => ({ default: m.TaskManagementPage })));
const TaskDetailPage = lazy(() => import('./routes/TaskDetailPage').then(m => ({ default: m.TaskDetailPage })));
const WorkflowsPage = lazy(() => import('./routes/WorkflowsPage').then(m => ({ default: m.WorkflowsPage })));
const NotificationsPage = lazy(() => import('./routes/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const SystemsPage = lazy(() => import('./routes/SystemsPage').then(m => ({ default: m.SystemsPage })));
const SystemDetailPage = lazy(() => import('./routes/SystemDetailPage').then(m => ({ default: m.SystemDetailPage })));
const AdministrationPage = lazy(() => import('./routes/AdministrationPage').then(m => ({ default: m.AdministrationPage })));
const UsersPage = lazy(() => import('./routes/UsersPage').then(m => ({ default: m.UsersPage })));
const UserDetailPage = lazy(() => import('./routes/UserDetailPage').then(m => ({ default: m.UserDetailPage })));
const RolesPage = lazy(() => import('./routes/RolesPage').then(m => ({ default: m.RolesPage })));
const RoleDetailPage = lazy(() => import('./routes/RoleDetailPage').then(m => ({ default: m.RoleDetailPage })));
const SettingsPage = lazy(() => import('./routes/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotFoundPage = lazy(() => import('./routes/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const AccessDeniedPage = lazy(() => import('./routes/AccessDeniedPage').then(m => ({ default: m.AccessDeniedPage })));
const MigrationProjectsPage = lazy(() => import('./routes/MigrationProjectsPage').then(m => ({ default: m.MigrationProjectsPage })));
const ConnectionDiagnosticsPage = lazy(() => import('./routes/ConnectionDiagnosticsPage').then(m => ({ default: m.ConnectionDiagnosticsPage })));
const DiscoveryTreeTablePage = lazy(() => import('./routes/DiscoveryTreeTablePage').then(m => ({ default: m.DiscoveryTreeTablePage })));
const MappingSpreadsheetPage = lazy(() => import('./routes/MappingSpreadsheetPage').then(m => ({ default: m.MappingSpreadsheetPage })));
const ValidationRulesPage = lazy(() => import('./routes/ValidationRulesPage').then(m => ({ default: m.ValidationRulesPage })));
const ValidationDiscoveryPage = lazy(() => import('./routes/ValidationDiscoveryPage').then(m => ({ default: m.ValidationDiscoveryPage })));
const MigrationTimelinePage = lazy(() => import('./routes/MigrationTimelinePage').then(m => ({ default: m.MigrationTimelinePage })));
const MigrationDatasetsPage = lazy(() => import('./routes/MigrationDatasetsPage').then(m => ({ default: m.MigrationDatasetsPage })));
const MigrationSchedulesPage = lazy(() => import('./routes/MigrationSchedulesPage').then(m => ({ default: m.MigrationSchedulesPage })));
const MigrationOverviewPage = lazy(() => import('./routes/MigrationOverviewNew').then(m => ({ default: m.MigrationOverviewNew })));
const ProfilePage = lazy(() => import('./routes/ProfilePage').then(m => ({ default: m.ProfilePage })));
const UserSettingsPage = lazy(() => import('./routes/UserSettingsPage').then(m => ({ default: m.UserSettingsPage })));
const AboutPage = lazy(() => import('./routes/AboutPage').then(m => ({ default: m.AboutPage })));
const ValidationCentrePage = lazy(() => import('./routes/ValidationCentrePage').then(m => ({ default: m.ValidationCentrePage })));
const ReportSuitePage = lazy(() => import('./routes/reports/ReportSuitePage').then(m => ({ default: m.ReportSuitePage })));
const PermissionsPage = lazy(() => import('./routes/PermissionsPage').then(m => ({ default: m.PermissionsPage })));

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={<AuthLayout><PublicRoute><LoginPage /></PublicRoute></AuthLayout>} />
        <Route path="/session-expired" element={<AuthLayout><SessionExpiredPage /></AuthLayout>} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        <Route element={<ProtectedRoute><ErrorBoundary><Shell /></ErrorBoundary></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ValidationFilterProvider><DashboardPage /></ValidationFilterProvider>} />

          <Route path="/migration" element={<MigrationPage />} />
          <Route path="/migration/overview" element={<MigrationOverviewPage />} />
          <Route path="/migration/projects" element={<MigrationProjectsPage />} />
          <Route path="/migration/datasets" element={<MigrationDatasetsPage />} />
          <Route path="/migration/schedules" element={<MigrationSchedulesPage />} />
          <Route path="/migration/connections" element={<SystemsPage />} />
          <Route path="/migration/connections/new" element={<SystemsPage />} />
          <Route path="/migration/connections/:id" element={<SystemDetailPage />} />
          <Route path="/migration/connections/diagnostics" element={<ConnectionDiagnosticsPage />} />
          <Route path="/migration/mappings/spreadsheet" element={<MappingSpreadsheetPage />} />
          <Route path="/migration/timeline" element={<MigrationTimelinePage />} />
          <Route path="/migration/discovery" element={<DiscoveryPage />} />
          <Route path="/migration/discovery/tree" element={<DiscoveryTreeTablePage />} />
          <Route path="/migration/mappings" element={<Navigate to="/migration/mappings/spreadsheet" replace />} />
          <Route path="/migration/column-mappings" element={<Navigate to="/migration/mappings/spreadsheet" replace />} />
          <Route path="/migration/execution" element={<MigrationPage />} />
          <Route path="/migration/reports" element={<ReportsPage />} />
          <Route path="/migration/workspace" element={<MigrationPage />} />

          <Route path="/validation" element={<ValidationPage />} />
          <Route path="/validation-centre" element={<ValidationFilterProvider><ValidationCentrePage /></ValidationFilterProvider>} />
          <Route path="/validation/rules" element={<ValidationFilterProvider><ValidationRulesPage /></ValidationFilterProvider>} />
          <Route path="/validation/rule-discovery" element={<ValidationFilterProvider><ValidationDiscoveryPage /></ValidationFilterProvider>} />
          <Route path="/validation/results" element={<ValidationFilterProvider><ValidationResultsPage /></ValidationFilterProvider>} />
          <Route path="/validation/results/:batchId" element={<ValidationFilterProvider><ValidationResultsPage /></ValidationFilterProvider>} />
          <Route path="/validation/queue" element={<ValidationPage />} />

          <Route path="/governance" element={<GovernancePage />} />
          <Route path="/governance/overview" element={<GovernancePage />} />
          <Route path="/governance/compliance" element={<GovernancePage />} />
          <Route path="/governance/controls" element={<GovernancePage />} />
          <Route path="/governance/exceptions" element={<GovernancePage />} />
          <Route path="/governance/risk" element={<GovernancePage />} />
          <Route path="/governance/audit" element={<GovernancePage />} />
          <Route path="/governance/approvals" element={<GovernancePage />} />

          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/suite/:section" element={<ReportSuitePage />} />
          <Route path="/reports/executive" element={<ReportsPage />} />
          <Route path="/reports/operational" element={<ReportsPage />} />
          <Route path="/reports/migration" element={<ReportsPage />} />
          <Route path="/reports/validation" element={<ReportsPage />} />
          <Route path="/reports/governance" element={<ReportsPage />} />
          <Route path="/reports/audit" element={<ReportsPage />} />
          <Route path="/reports/templates" element={<ReportsPage />} />
          <Route path="/reports/distribution" element={<ReportsPage />} />

          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/operations/execution" element={<ValidationFilterProvider><OperationsExecutionPage /></ValidationFilterProvider>} />
          <Route path="/operations/monitoring" element={<OperationsPage />} />
          <Route path="/operations/alerts" element={<OperationsPage />} />
          <Route path="/operations/schedules" element={<OperationsPage />} />
          <Route path="/operations/retry" element={<OperationsPage />} />
          <Route path="/operations/health" element={<OperationsPage />} />

          <Route path="/tasks" element={<TaskManagementPage />} />
          <Route path="/tasks/dashboard" element={<TaskManagementPage />} />
          <Route path="/tasks/my" element={<TaskManagementPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />

          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/administration" element={<AdministrationPage />} />
          <Route path="/administration/users" element={<ValidationFilterProvider><UsersPage /></ValidationFilterProvider>} />
          <Route path="/administration/users/new" element={<UserDetailPage />} />
          <Route path="/administration/users/:id" element={<UserDetailPage />} />
          <Route path="/administration/roles" element={<RolesPage />} />
          <Route path="/administration/roles/new" element={<RoleDetailPage />} />
          <Route path="/administration/roles/:id" element={<RoleDetailPage />} />
          <Route path="/administration/tenants" element={<AdministrationPage />} />
          <Route path="/administration/settings" element={<SettingsPage />} />
          <Route path="/administration/permissions" element={<PermissionsPage />} />
          <Route path="/administration/feature-flags" element={<SettingsPage />} />
          <Route path="/administration/security" element={<AdministrationPage />} />
          <Route path="/administration/notifications" element={<AdministrationPage />} />
          <Route path="/administration/maintenance" element={<AdministrationPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
