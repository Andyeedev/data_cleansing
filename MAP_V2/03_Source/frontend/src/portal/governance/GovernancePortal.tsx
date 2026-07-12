import { useLocation } from 'react-router-dom';
import { PortalShell } from '../framework/PortalShell';
import { PortalRegistry } from '../registry/PortalRegistry';
import { GovernanceOverview } from './GovernanceOverview';
import { Compliance } from './Compliance';
import { Policies } from './Policies';
import { Controls } from './Controls';
import { Exceptions } from './Exceptions';
import { RiskGovernance } from './RiskGovernance';
import { AuditCentre } from './AuditCentre';
import { RegulatoryReporting } from './RegulatoryReporting';
import { GovernanceWorkspace } from './GovernanceWorkspace';

const routeComponents: Record<string, React.ComponentType> = {
  '/governance': GovernanceOverview,
  '/governance/overview': GovernanceOverview,
  '/governance/compliance': Compliance,
  '/governance/policies': Policies,
  '/governance/controls': Controls,
  '/governance/exceptions': Exceptions,
  '/governance/risk': RiskGovernance,
  '/governance/audit': AuditCentre,
  '/governance/reports': RegulatoryReporting,
  '/governance/workspace': GovernanceWorkspace,
};

export const GovernancePortal = () => {
  const location = useLocation();
  const portal = PortalRegistry.get('governance');

  if (!portal) {
    return <div className="p-8 text-center text-neutral-60">Governance Portal not found</div>;
  }

  const PageComponent = routeComponents[location.pathname] || GovernanceOverview;

  return (
    <PortalShell portal={portal}>
      <PageComponent />
    </PortalShell>
  );
};
