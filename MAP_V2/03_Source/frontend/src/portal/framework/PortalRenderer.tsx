import { useMemo } from 'react';
import { PortalRegistry } from '../registry/PortalRegistry';
import { PortalShell } from './PortalShell';
import { PortalLoader } from './PortalLoader';
import { PortalError } from './PortalError';
import { usePortal } from './PortalContext';

interface PortalRendererProps {
  portalId: string;
  fallback?: React.ReactNode;
}

export const PortalRenderer = ({ portalId, fallback }: PortalRendererProps) => {
  const { isLoading, error } = usePortal();

  const portal = useMemo(() => PortalRegistry.get(portalId), [portalId]);

  if (isLoading) {
    return <PortalLoader portal={portal || undefined} />;
  }

  if (error) {
    return (
      <PortalError
        error={error}
        portal={portal || undefined}
        onNavigateHome={() => window.location.href = '/'}
      />
    );
  }

  if (!portal) {
    return (
      <PortalError
        error={`Portal "${portalId}" not found`}
        onNavigateHome={() => window.location.href = '/'}
      />
    );
  }

  if (!portal.enabled) {
    return (
      <PortalError
        error={`Portal "${portal.name}" is currently disabled`}
        portal={portal}
        onNavigateHome={() => window.location.href = '/'}
      />
    );
  }

  return (
    <PortalShell portal={portal}>
      {fallback || (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-neutral-100 mb-2">{portal.name}</h2>
            <p className="text-neutral-60">{portal.description}</p>
          </div>
        </div>
      )}
    </PortalShell>
  );
};
