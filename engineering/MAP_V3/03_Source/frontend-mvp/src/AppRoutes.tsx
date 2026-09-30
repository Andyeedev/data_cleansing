import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/Shell/Shell';
import { AdminConsole } from './components/AdminConsole/AdminConsole';
import { TenantProvider } from './tenant/TenantContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthLayout } from './components/AuthLayout';
import { LoginPage } from './routes/LoginPage';
import { SessionExpiredPage } from './routes/SessionExpiredPage';
import { SuspendedTenantPage } from './routes/SuspendedTenantPage';
import { BlockedTenantPage } from './routes/BlockedTenantPage';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { ValidationFilterProvider } from './context/ValidationFilterContext';
import { useProject } from './context/ProjectContext';
import { useAuth } from './context/AuthContext';

const DashboardPage = lazy(() => import('./routes/DashboardPage').then(m => ({ default: m.DashboardPage })));
const MigrationPage = lazy(() => import('./routes/MigrationPage').then(m => ({ default: m.MigrationPage })));
const DiscoveryPage = lazy(() => import('./routes/DiscoveryPage').then(m => ({ default: m.DiscoveryPage })));

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
const MissionControlPage = lazy(() => import('./routes/administration/MissionControlPage').then(m => ({ default: m.MissionControlPage })));
const SubscriptionsSectionPage = lazy(() => import('./routes/administration/SubscriptionsSectionPage').then(m => ({ default: m.SubscriptionsSectionPage })));
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
// OC-REPORT-001 — Report Studio is a SIBLING of the curated Report Suite.
// /reports/suite/** is deliberately untouched.
const ReportListPage = lazy(() => import('./routes/reports/ReportListPage').then(m => ({ default: m.ReportListPage })));
const ReportViewer = lazy(() => import('./routes/reports/ReportViewer').then(m => ({ default: m.ReportViewer })));
const ReportEditorPage = lazy(() => import('./routes/reports/ReportEditorPage').then(m => ({ default: m.ReportEditorPage })));
const PermissionsPage = lazy(() => import('./routes/PermissionsPage').then(m => ({ default: m.PermissionsPage })));
const WelcomePage = lazy(() => import('./routes/onboarding/WelcomePage').then(m => ({ default: m.WelcomePage })));
const OnboardingSetupPage = lazy(() => import('./routes/onboarding/OnboardingSetupPage').then(m => ({ default: m.OnboardingSetupPage })));
const OnboardingHubPage = lazy(() => import('./routes/onboarding/OnboardingHubPage').then(m => ({ default: m.OnboardingHubPage })));
const SubscriptionPlansPage = lazy(() => import('./routes/billing/SubscriptionPlansPage').then(m => ({ default: m.SubscriptionPlansPage })));
const BillingSubscriptionPage = lazy(() => import('./routes/billing/BillingSubscriptionPage').then(m => ({ default: m.BillingSubscriptionPage })));
const BillingSuccessPage = lazy(() => import('./routes/billing/BillingSuccessPage').then(m => ({ default: m.BillingSuccessPage })));
const BillingCancelPage = lazy(() => import('./routes/billing/BillingCancelPage').then(m => ({ default: m.BillingCancelPage })));
const AcceptInvitePage = lazy(() => import('./routes/invites/AcceptInvitePage').then(m => ({ default: m.AcceptInvitePage })));
const InvitationsPage = lazy(() => import('./routes/administration/InvitationsPage').then(m => ({ default: m.InvitationsPage })));
const RegistrationsPage = lazy(() => import('./routes/administration/RegistrationsPage').then(m => ({ default: m.RegistrationsPage })));
const TenantsPage = lazy(() => import('./routes/administration/TenantsPage').then(m => ({ default: m.TenantsPage })));
const SecurityPage = lazy(() => import('./routes/administration/SecurityPage').then(m => ({ default: m.SecurityPage })));
const AdminNotificationsPage = lazy(() => import('./routes/administration/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const MaintenancePage = lazy(() => import('./routes/administration/MaintenancePage').then(m => ({ default: m.MaintenancePage })));
const FeatureFlagsPage = lazy(() => import('./routes/administration/FeatureFlagsPage').then(m => ({ default: m.FeatureFlagsPage })));
const ForgotPasswordPage = lazy(() => import('./routes/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./routes/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('./routes/auth/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));
const ResendVerificationPage = lazy(() => import('./routes/auth/ResendVerificationPage').then(m => ({ default: m.ResendVerificationPage })));

function HomeRedirect() {
  const { availableProjects, isLoading } = useProject();
  const { userRoles } = useAuth();
  const isSuperAdmin = userRoles.some(r => r === 'Super Admin');
  if (isLoading) return <LoadingSpinner />;
  if (isSuperAdmin) return <Navigate to="/onboarding/welcome" replace />;
  return <Navigate to={availableProjects.length === 0 ? '/onboarding/welcome' : '/dashboard'} replace />;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={<AuthLayout><PublicRoute><LoginPage /></PublicRoute></AuthLayout>} />
        <Route path="/session-expired" element={<AuthLayout><SessionExpiredPage /></AuthLayout>} />
        <Route path="/suspended" element={<AuthLayout><SuspendedTenantPage /></AuthLayout>} />
        <Route path="/blocked" element={<AuthLayout><BlockedTenantPage /></AuthLayout>} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route path="/forgot-password" element={<AuthLayout><PublicRoute><ForgotPasswordPage /></PublicRoute></AuthLayout>} />
        <Route path="/reset-password" element={<AuthLayout><PublicRoute><ResetPasswordPage /></PublicRoute></AuthLayout>} />
        <Route path="/verify-email" element={<AuthLayout><VerifyEmailPage /></AuthLayout>} />
        <Route path="/resend-verification" element={<AuthLayout><ResendVerificationPage /></AuthLayout>} />

        <Route path="/invites/accept" element={<AuthLayout><AcceptInvitePage /></AuthLayout>} />

          <Route element={<ProtectedRoute><ErrorBoundary><Shell /></ErrorBoundary></ProtectedRoute>}>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/dashboard" element={<ValidationFilterProvider><DashboardPage /></ValidationFilterProvider>} />

          <Route path="/onboarding/welcome" element={<WelcomePage />} />
          <Route path="/onboarding/setup" element={<OnboardingSetupPage />} />
          <Route path="/onboarding/hub" element={<OnboardingHubPage />} />

          <Route path="/subscription/plans" element={<SubscriptionPlansPage />} />
          <Route path="/billing/subscription" element={<BillingSubscriptionPage />} />
          <Route path="/billing/success" element={<BillingSuccessPage />} />
          <Route path="/billing/cancel" element={<BillingCancelPage />} />

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
      {/* OC-REPORT-001 Report Studio.

          Wrapped in TenantProvider, the same way /administration is, so the
          Studio reads the real tenant scope. Without it, useTenantScope() falls
          back to identity-derived behaviour, which for a Super Admin always
          yields their OWN tenant - so a ?tenant_id= deep link was silently
          ignored and a Super Admin could only ever be judged on their own
          tenant's plan. */}
      <Route path="/reports/studio" element={<TenantProvider><ReportListPage /></TenantProvider>} />
      <Route path="/reports/studio/:reportId" element={<TenantProvider><ReportViewer /></TenantProvider>} />
      <Route path="/reports/studio/:reportId/view" element={<TenantProvider><ReportViewer /></TenantProvider>} />
      <Route path="/reports/studio/:reportId/edit" element={<TenantProvider><ReportEditorPage /></TenantProvider>} />
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

          {/* Phase B: administration console — persistent rail + detail pane.
              /administration renders Mission Control; every section keeps its
              own ProtectedRoute guard and the backend remains authoritative. */}
          <Route path="/administration" element={<ProtectedRoute requiredRoles={['Super Admin', 'Tenant Admin']}><TenantProvider><AdminConsole /></TenantProvider></ProtectedRoute>}>
            <Route index element={<MissionControlPage />} />
            <Route path="users" element={<ProtectedRoute requiredPermissions={['users:list']}><ValidationFilterProvider><UsersPage /></ValidationFilterProvider></ProtectedRoute>} />
            <Route path="users/new" element={<ProtectedRoute requiredPermissions={['users:list']}><UserDetailPage /></ProtectedRoute>} />
            <Route path="users/:id" element={<ProtectedRoute requiredPermissions={['users:list']}><UserDetailPage /></ProtectedRoute>} />
            <Route path="roles" element={<ProtectedRoute requiredPermissions={['roles:list']}><RolesPage /></ProtectedRoute>} />
            <Route path="roles/new" element={<ProtectedRoute requiredPermissions={['roles:list']}><RoleDetailPage /></ProtectedRoute>} />
            <Route path="roles/:id" element={<ProtectedRoute requiredPermissions={['roles:list']}><RoleDetailPage /></ProtectedRoute>} />
            <Route path="tenants" element={<ProtectedRoute requiredRoles={['Super Admin']}><TenantsPage /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute requiredPermissions={['settings:read']}><SettingsPage /></ProtectedRoute>} />
            <Route path="permissions" element={<ProtectedRoute requiredRoles={['Super Admin']}><PermissionsPage /></ProtectedRoute>} />
            <Route path="feature-flags" element={<ProtectedRoute requiredRoles={['Super Admin']}><FeatureFlagsPage /></ProtectedRoute>} />
            <Route path="security" element={<ProtectedRoute requiredRoles={['Super Admin']}><SecurityPage /></ProtectedRoute>} />
            <Route path="notifications" element={<ProtectedRoute requiredRoles={['Super Admin']}><AdminNotificationsPage /></ProtectedRoute>} />
            <Route path="maintenance" element={<ProtectedRoute requiredRoles={['Super Admin']}><MaintenancePage /></ProtectedRoute>} />
            <Route path="invitations" element={<ProtectedRoute requiredPermissions={['invitations:read']}><ValidationFilterProvider><InvitationsPage /></ValidationFilterProvider></ProtectedRoute>} />
            <Route path="registrations" element={<ProtectedRoute requiredRoles={['Super Admin']}><ValidationFilterProvider><RegistrationsPage /></ValidationFilterProvider></ProtectedRoute>} />
            <Route path="subscriptions" element={<ProtectedRoute requiredRoles={['Super Admin']}><SubscriptionsSectionPage /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
