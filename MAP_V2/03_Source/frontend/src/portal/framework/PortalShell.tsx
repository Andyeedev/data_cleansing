import type { ReactNode } from 'react';
import type { PortalDefinition } from '../types/PortalDefinition';

interface PortalShellProps {
  portal: PortalDefinition;
  children: ReactNode;
  className?: string;
}

export const PortalShell = ({
  portal,
  children,
  className = '',
}: PortalShellProps) => {
  return (
    <div
      className={`min-h-[calc(100vh-8rem)] ${className}`}
      data-portal-id={portal.id}
      data-portal-name={portal.name}
    >
      {children}
    </div>
  );
};
