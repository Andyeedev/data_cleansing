import { PortalShell } from '../framework/PortalShell';
import { PortalRegistry } from '../registry/PortalRegistry';
import { ExecutiveHome } from './ExecutiveHome';

export const ExecutivePortal = () => {
  const portal = PortalRegistry.get('executive');

  if (!portal) {
    return <div className="p-8 text-center text-neutral-60">Executive Portal not found</div>;
  }

  return (
    <PortalShell portal={portal}>
      <ExecutiveHome />
    </PortalShell>
  );
};
