import { useLocation } from 'react-router-dom';
import { PortalShell } from '../framework/PortalShell';
import { PortalRegistry } from '../registry/PortalRegistry';
import { MigrationOverview } from './MigrationOverview';
import { MigrationProjects } from './MigrationProjects';
import { MigrationExecution } from './MigrationExecution';
import { MigrationDatasets } from './MigrationDatasets';
import { MigrationMappings } from './MigrationMappings';
import { MigrationSchedules } from './MigrationSchedules';
import { MigrationHistory } from './MigrationHistory';
import { MigrationReports } from './MigrationReports';
import { MigrationWorkspace } from './MigrationWorkspace';

const routeComponents: Record<string, React.ComponentType> = {
  '/migration': MigrationOverview,
  '/migration/overview': MigrationOverview,
  '/migration/projects': MigrationProjects,
  '/migration/execution': MigrationExecution,
  '/migration/datasets': MigrationDatasets,
  '/migration/mappings': MigrationMappings,
  '/migration/schedules': MigrationSchedules,
  '/migration/history': MigrationHistory,
  '/migration/reports': MigrationReports,
  '/migration/workspace': MigrationWorkspace,
};

export const MigrationPortal = () => {
  const location = useLocation();
  const portal = PortalRegistry.get('migration');

  if (!portal) {
    return <div className="p-8 text-center text-neutral-60">Migration Portal not found</div>;
  }

  const PageComponent = routeComponents[location.pathname] || MigrationOverview;

  return (
    <PortalShell portal={portal}>
      <PageComponent />
    </PortalShell>
  );
};
