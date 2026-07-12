import { useLocation } from 'react-router-dom';
import { PortalShell } from '../framework/PortalShell';
import { PortalRegistry } from '../registry/PortalRegistry';
import { AdministrationOverview } from './AdministrationOverview';
import { TenantManagement } from './TenantManagement';
import { OrganisationManagement } from './OrganisationManagement';
import { UserManagement } from './UserManagement';
import { RoleManagement } from './RoleManagement';
import { PermissionManagement } from './PermissionManagement';
import { SubscriptionManagement } from './SubscriptionManagement';
import { Licensing } from './Licensing';
import { PlatformConfiguration } from './PlatformConfiguration';
import { FeatureFlags } from './FeatureFlags';
import { SystemSettings } from './SystemSettings';
import { JobScheduler } from './JobScheduler';
import { NotificationManagement } from './NotificationManagement';
import { EnvironmentManagement } from './EnvironmentManagement';
import { MaintenanceCentre } from './MaintenanceCentre';
import { HealthMonitoring } from './HealthMonitoring';
import { AdministrationDashboard } from './AdministrationDashboard';

const routeComponents: Record<string, React.ComponentType> = {
  '/administration': AdministrationOverview,
  '/administration/overview': AdministrationOverview,
  '/administration/tenants': TenantManagement,
  '/administration/organisations': OrganisationManagement,
  '/administration/users': UserManagement,
  '/administration/roles': RoleManagement,
  '/administration/permissions': PermissionManagement,
  '/administration/subscriptions': SubscriptionManagement,
  '/administration/licensing': Licensing,
  '/administration/configuration': PlatformConfiguration,
  '/administration/feature-flags': FeatureFlags,
  '/administration/system-settings': SystemSettings,
  '/administration/scheduler': JobScheduler,
  '/administration/notifications': NotificationManagement,
  '/administration/environment': EnvironmentManagement,
  '/administration/maintenance': MaintenanceCentre,
  '/administration/health': HealthMonitoring,
  '/administration/dashboard': AdministrationDashboard,
};

export const AdministrationPortal = () => {
  const location = useLocation();
  const portal = PortalRegistry.get('administration');

  if (!portal) {
    return <div className="p-8 text-center text-neutral-60">Administration Portal not found</div>;
  }

  const PageComponent = routeComponents[location.pathname] || AdministrationOverview;

  return (
    <PortalShell portal={portal}>
      <PageComponent />
    </PortalShell>
  );
};
