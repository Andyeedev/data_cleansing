import { useLocation } from 'react-router-dom';
import { PortalShell } from '../framework/PortalShell';
import { PortalRegistry } from '../registry/PortalRegistry';
import { ReportingOverview } from './ReportingOverview';
import { ExecutiveReports } from './ExecutiveReports';
import { OperationalReports } from './OperationalReports';
import { MigrationReports } from './MigrationReports';
import { ValidationReports } from './ValidationReports';
import { GovernanceReports } from './GovernanceReports';
import { AuditReports } from './AuditReports';
import { RegulatoryReports } from './RegulatoryReports';
import { ScheduledReports } from './ScheduledReports';
import { ReportTemplates } from './ReportTemplates';
import { ReportDistribution } from './ReportDistribution';
import { ReportingWorkspace } from './ReportingWorkspace';

const routeComponents: Record<string, React.ComponentType> = {
  '/reports': ReportingOverview,
  '/reports/overview': ReportingOverview,
  '/reports/executive': ExecutiveReports,
  '/reports/operational': OperationalReports,
  '/reports/migration': MigrationReports,
  '/reports/validation': ValidationReports,
  '/reports/governance': GovernanceReports,
  '/reports/audit': AuditReports,
  '/reports/regulatory': RegulatoryReports,
  '/reports/scheduled': ScheduledReports,
  '/reports/templates': ReportTemplates,
  '/reports/distribution': ReportDistribution,
  '/reports/workspace': ReportingWorkspace,
};

export const ReportingPortal = () => {
  const location = useLocation();
  const portal = PortalRegistry.get('reporting');

  if (!portal) {
    return <div className="p-8 text-center text-neutral-60">Reporting Portal not found</div>;
  }

  const PageComponent = routeComponents[location.pathname] || ReportingOverview;

  return (
    <PortalShell portal={portal}>
      <PageComponent />
    </PortalShell>
  );
};
