import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../authentication/components/ProtectedRoute';
import { PublicRoute } from '../../authentication/components/PublicRoute';
import { MainLayout } from '../../layout/MainLayout';
import { AuthLayout } from '../../layout/AuthLayout';
import { ErrorBoundary } from '../../layout/ErrorBoundary';
import { PortalProvider } from '../framework/PortalProvider';

// Auth Pages
import { LoginPage } from '../../authentication/pages/LoginPage';
import { LogoutPage } from '../../authentication/pages/LogoutPage';
import { ForgotPasswordPage } from '../../authentication/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../authentication/pages/ResetPasswordPage';
import { AccessDeniedPage } from '../../authentication/pages/AccessDeniedPage';
import { AccountLockedPage } from '../../authentication/pages/AccountLockedPage';
import { SessionExpiredPage } from '../../authentication/pages/SessionExpiredPage';
import { VerifyMFAPage } from '../../authentication/pages/VerifyMFAPage';
import { ChangePasswordPage } from '../../authentication/pages/ChangePasswordPage';
import { ProfilePage } from '../../authentication/pages/ProfilePage';

// Portal Pages
import { HomePage } from '../../pages/HomePage';
import { ExecutiveDashboardPage } from '../../pages/dashboard/ExecutiveDashboardPage';
import { OperationsPortal } from '../operations/OperationsPortal';
import { MigrationPortal } from '../migration/MigrationPortal';
import { GovernancePortal } from '../governance/GovernancePortal';
import { ReportingPortal } from '../reporting/ReportingPortal';
import { SecurityPortal } from '../security/SecurityPortal';
import { AdministrationPortal } from '../administration/AdministrationPortal';
import { ValidationRulesPage } from '../../pages/validation/ValidationRulesPage';
import { ValidationResultsPage } from '../../pages/validation/ValidationResultsPage';
import { ValidationQueuePage } from '../../pages/validation/ValidationQueuePage';
import { RiskPage } from '../../pages/risk/RiskPage';
import { AIAssistantPage } from '../../pages/ai/AIAssistantPage';
import { AIInsightsPage } from '../../pages/ai/AIInsightsPage';
import { AIRecommendationsPage } from '../../pages/ai/AIRecommendationsPage';
import { AIReportGeneratorPage } from '../../pages/ai/AIReportGeneratorPage';
import { ReportCentre } from '../../reporting/centre/ReportCentre';
import { ReportScheduler } from '../../reporting/scheduler/ReportScheduler';
import { ReportDistributionCentre } from '../../reporting/distribution/ReportDistributionCentre';
import { SettingsPage } from '../../pages/settings/SettingsPage';
import { HelpPage } from '../../pages/help/HelpPage';
import { NotFound } from '../../components/common/NotFound';

import { ROUTES } from '../../config/routes';

export const PortalRoutes = () => {
  return (
    <PortalProvider>
      <Routes>
        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route path={ROUTES.LOGOUT} element={<LogoutPage />} />
          <Route path={ROUTES.ACCESS_DENIED} element={<AccessDeniedPage />} />
          <Route path={ROUTES.SESSION_EXPIRED} element={<SessionExpiredPage />} />
          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />
          <Route path="/verify-mfa" element={<VerifyMFAPage />} />
          <Route path="/account-locked" element={<AccountLockedPage />} />
        </Route>

        {/* Protected Portal Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <MainLayout />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />

          {/* Executive Portal */}
          <Route path="dashboard/executive" element={<ExecutiveDashboardPage />} />

          {/* Operations Portal */}
          <Route path="operations" element={<OperationsPortal />} />
          <Route path="operations/overview" element={<OperationsPortal />} />
          <Route path="operations/executions" element={<OperationsPortal />} />
          <Route path="operations/queues" element={<OperationsPortal />} />
          <Route path="operations/schedules" element={<OperationsPortal />} />
          <Route path="operations/monitoring" element={<OperationsPortal />} />
          <Route path="operations/alerts" element={<OperationsPortal />} />
          <Route path="operations/retry" element={<OperationsPortal />} />

          {/* Migration Portal */}
          <Route path="migration" element={<MigrationPortal />} />
          <Route path="migration/overview" element={<MigrationPortal />} />
          <Route path="migration/projects" element={<MigrationPortal />} />
          <Route path="migration/execution" element={<MigrationPortal />} />
          <Route path="migration/datasets" element={<MigrationPortal />} />
          <Route path="migration/mappings" element={<MigrationPortal />} />
          <Route path="migration/schedules" element={<MigrationPortal />} />
          <Route path="migration/history" element={<MigrationPortal />} />
          <Route path="migration/reports" element={<MigrationPortal />} />
          <Route path="migration/workspace" element={<MigrationPortal />} />

          {/* Validation Portal */}
          <Route path="validation/rules" element={<ValidationRulesPage />} />
          <Route path="validation/results" element={<ValidationResultsPage />} />
          <Route path="validation/queue" element={<ValidationQueuePage />} />
          <Route path="validation" element={<ValidationRulesPage />} />

          {/* Governance Portal */}
          <Route path="governance" element={<GovernancePortal />} />
          <Route path="governance/overview" element={<GovernancePortal />} />
          <Route path="governance/compliance" element={<GovernancePortal />} />
          <Route path="governance/policies" element={<GovernancePortal />} />
          <Route path="governance/controls" element={<GovernancePortal />} />
          <Route path="governance/exceptions" element={<GovernancePortal />} />
          <Route path="governance/risk" element={<GovernancePortal />} />
          <Route path="governance/audit" element={<GovernancePortal />} />
          <Route path="governance/reports" element={<GovernancePortal />} />
          <Route path="governance/workspace" element={<GovernancePortal />} />

          {/* Risk Portal */}
          <Route path="risk" element={<RiskPage />} />
          <Route path="risk/assessment" element={<RiskPage />} />
          <Route path="risk/register" element={<RiskPage />} />
          <Route path="risk/matrix" element={<RiskPage />} />

          {/* Reports Portal */}
          <Route path="reports" element={<ReportingPortal />} />
          <Route path="reports/overview" element={<ReportingPortal />} />
          <Route path="reports/executive" element={<ReportingPortal />} />
          <Route path="reports/operational" element={<ReportingPortal />} />
          <Route path="reports/migration" element={<ReportingPortal />} />
          <Route path="reports/validation" element={<ReportingPortal />} />
          <Route path="reports/governance" element={<ReportingPortal />} />
          <Route path="reports/audit" element={<ReportingPortal />} />
          <Route path="reports/regulatory" element={<ReportingPortal />} />
          <Route path="reports/scheduled" element={<ReportingPortal />} />
          <Route path="reports/templates" element={<ReportingPortal />} />
          <Route path="reports/distribution" element={<ReportingPortal />} />
          <Route path="reports/workspace" element={<ReportingPortal />} />

          {/* Security Portal */}
          <Route path="security" element={<SecurityPortal />} />
          <Route path="security/overview" element={<SecurityPortal />} />
          <Route path="security/credentials" element={<SecurityPortal />} />
          <Route path="security/encryption" element={<SecurityPortal />} />
          <Route path="security/keys" element={<SecurityPortal />} />
          <Route path="security/certificates" element={<SecurityPortal />} />
          <Route path="security/identity-providers" element={<SecurityPortal />} />
          <Route path="security/authentication" element={<SecurityPortal />} />
          <Route path="security/mfa" element={<SecurityPortal />} />
          <Route path="security/sessions" element={<SecurityPortal />} />
          <Route path="security/api-security" element={<SecurityPortal />} />
          <Route path="security/audit-logs" element={<SecurityPortal />} />
          <Route path="security/security-events" element={<SecurityPortal />} />
          <Route path="security/threat-monitoring" element={<SecurityPortal />} />
          <Route path="security/compliance" element={<SecurityPortal />} />
          <Route path="security/dashboard" element={<SecurityPortal />} />

          {/* Administration Portal */}
          <Route path="administration" element={<AdministrationPortal />} />
          <Route path="administration/overview" element={<AdministrationPortal />} />
          <Route path="administration/tenants" element={<AdministrationPortal />} />
          <Route path="administration/organisations" element={<AdministrationPortal />} />
          <Route path="administration/users" element={<AdministrationPortal />} />
          <Route path="administration/roles" element={<AdministrationPortal />} />
          <Route path="administration/permissions" element={<AdministrationPortal />} />
          <Route path="administration/subscriptions" element={<AdministrationPortal />} />
          <Route path="administration/licensing" element={<AdministrationPortal />} />
          <Route path="administration/configuration" element={<AdministrationPortal />} />
          <Route path="administration/feature-flags" element={<AdministrationPortal />} />
          <Route path="administration/system-settings" element={<AdministrationPortal />} />
          <Route path="administration/scheduler" element={<AdministrationPortal />} />
          <Route path="administration/notifications" element={<AdministrationPortal />} />
          <Route path="administration/environment" element={<AdministrationPortal />} />
          <Route path="administration/maintenance" element={<AdministrationPortal />} />
          <Route path="administration/health" element={<AdministrationPortal />} />
          <Route path="administration/dashboard" element={<AdministrationPortal />} />

          {/* AI Portal */}
          <Route path="ai" element={<AIAssistantPage />} />
          <Route path="ai/assistant" element={<AIAssistantPage />} />
          <Route path="ai/insights" element={<AIInsightsPage />} />
          <Route path="ai/recommendations" element={<AIRecommendationsPage />} />
          <Route path="ai/report-generator" element={<AIReportGeneratorPage />} />

          {/* Report Centre */}
          <Route path="report-centre" element={<ReportCentre />} />
          <Route path="report-centre/explorer" element={<ReportCentre />} />
          <Route path="report-centre/recent" element={<ReportCentre />} />
          <Route path="report-centre/favourites" element={<ReportCentre />} />
          <Route path="report-centre/scheduled" element={<ReportCentre />} />
          <Route path="report-centre/shared" element={<ReportCentre />} />
          <Route path="report-centre/my" element={<ReportCentre />} />
          <Route path="report-centre/templates" element={<ReportCentre />} />
          <Route path="report-centre/categories" element={<ReportCentre />} />
          <Route path="report-centre/preview" element={<ReportCentre />} />
          <Route path="report-centre/details" element={<ReportCentre />} />
          <Route path="report-centre/history" element={<ReportCentre />} />
          <Route path="report-centre/queue" element={<ReportCentre />} />
          <Route path="report-centre/search" element={<ReportCentre />} />
          <Route path="report-centre/filters" element={<ReportCentre />} />
          <Route path="report-centre/workspace" element={<ReportCentre />} />

          {/* Report Scheduler */}
          <Route path="scheduler" element={<ReportScheduler />} />
          <Route path="scheduler/*" element={<ReportScheduler />} />

          {/* Report Distribution Centre */}
          <Route path="distribution" element={<ReportDistributionCentre />} />
          <Route path="distribution/*" element={<ReportDistributionCentre />} />

          {/* Settings & Help */}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </PortalProvider>
  );
};
