import { Routes, Route } from 'react-router-dom';
import { Shell } from './components/Shell/Shell';
import { HomePage } from './routes/HomePage';
import { DashboardPage } from './routes/DashboardPage';
import { MigrationPage } from './routes/MigrationPage';
import { DiscoveryPage } from './routes/DiscoveryPage';
import { MappingPage } from './routes/MappingPage';
import { ValidationPage } from './routes/ValidationPage';
import { ValidationResultsPage } from './routes/ValidationResultsPage';
import { ExecutionHistoryPage } from './routes/ExecutionHistoryPage';
import { GovernancePage } from './routes/GovernancePage';
import { ReportsPage } from './routes/ReportsPage';
import { OperationsPage } from './routes/OperationsPage';
import { TaskManagementPage } from './routes/TaskManagementPage';
import { TaskDetailPage } from './routes/TaskDetailPage';
import { WorkflowsPage } from './routes/WorkflowsPage';
import { NotificationsPage } from './routes/NotificationsPage';
import { CalendarPage } from './routes/CalendarPage';
import { ApprovalsPage } from './routes/ApprovalsPage';
import { ApprovalDetailPage } from './routes/ApprovalDetailPage';
import { SystemsPage } from './routes/SystemsPage';
import { SystemDetailPage } from './routes/SystemDetailPage';
import { AdministrationPage } from './routes/AdministrationPage';
import { UsersPage } from './routes/UsersPage';
import { UserDetailPage } from './routes/UserDetailPage';
import { RolesPage } from './routes/RolesPage';
import { RoleDetailPage } from './routes/RoleDetailPage';
import { SettingsPage } from './routes/SettingsPage';
import { NotFoundPage } from './routes/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/migration" element={<MigrationPage />} />
        <Route path="/migration/projects" element={<MigrationPage />} />
        <Route path="/migration/connections" element={<SystemsPage />} />
        <Route path="/migration/connections/new" element={<SystemsPage />} />
        <Route path="/migration/connections/:id" element={<SystemDetailPage />} />
        <Route path="/migration/discovery" element={<DiscoveryPage />} />
        <Route path="/migration/mappings" element={<MappingPage />} />
        <Route path="/migration/column-mappings" element={<MappingPage />} />
        <Route path="/migration/execution" element={<MigrationPage />} />
        <Route path="/migration/history" element={<MigrationPage />} />
        <Route path="/migration/reports" element={<ReportsPage />} />
        <Route path="/migration/workspace" element={<MigrationPage />} />

        <Route path="/validation" element={<ValidationPage />} />
        <Route path="/validation/rules" element={<ValidationPage />} />
        <Route path="/validation/rule-discovery" element={<ValidationPage />} />
        <Route path="/validation/results/:batchId" element={<ValidationResultsPage />} />
        <Route path="/validation/history" element={<ExecutionHistoryPage />} />
        <Route path="/validation/queue" element={<ValidationPage />} />
        <Route path="/validation/controls" element={<ValidationPage />} />

        <Route path="/governance" element={<GovernancePage />} />
        <Route path="/governance/overview" element={<GovernancePage />} />
        <Route path="/governance/compliance" element={<GovernancePage />} />
        <Route path="/governance/controls" element={<GovernancePage />} />
        <Route path="/governance/exceptions" element={<GovernancePage />} />
        <Route path="/governance/risk" element={<GovernancePage />} />
        <Route path="/governance/audit" element={<GovernancePage />} />
        <Route path="/governance/approvals" element={<GovernancePage />} />

        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports/executive" element={<ReportsPage />} />
        <Route path="/reports/operational" element={<ReportsPage />} />
        <Route path="/reports/migration" element={<ReportsPage />} />
        <Route path="/reports/validation" element={<ReportsPage />} />
        <Route path="/reports/governance" element={<ReportsPage />} />
        <Route path="/reports/audit" element={<ReportsPage />} />
        <Route path="/reports/templates" element={<ReportsPage />} />
        <Route path="/reports/distribution" element={<ReportsPage />} />

        <Route path="/operations" element={<OperationsPage />} />
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
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
        <Route path="/approvals/:id" element={<ApprovalDetailPage />} />

        <Route path="/administration" element={<AdministrationPage />} />
        <Route path="/administration/users" element={<UsersPage />} />
        <Route path="/administration/users/new" element={<UserDetailPage />} />
        <Route path="/administration/users/:id" element={<UserDetailPage />} />
        <Route path="/administration/roles" element={<RolesPage />} />
        <Route path="/administration/roles/new" element={<RoleDetailPage />} />
        <Route path="/administration/roles/:id" element={<RoleDetailPage />} />
        <Route path="/administration/tenants" element={<AdministrationPage />} />
        <Route path="/administration/settings" element={<SettingsPage />} />
        <Route path="/administration/feature-flags" element={<SettingsPage />} />
        <Route path="/administration/security" element={<AdministrationPage />} />
        <Route path="/administration/notifications" element={<AdministrationPage />} />
        <Route path="/administration/maintenance" element={<AdministrationPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
