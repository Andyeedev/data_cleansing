import type { ReactNode } from 'react';

interface PortalContentProps {
  children: ReactNode;
  maxWidth?: string;
  className?: string;
}

export const PortalContent = ({
  children,
  maxWidth = 'max-w-7xl',
  className = '',
}: PortalContentProps) => {
  return (
    <div className={`${maxWidth} mx-auto ${className}`}>
      {children}
    </div>
  );
};
