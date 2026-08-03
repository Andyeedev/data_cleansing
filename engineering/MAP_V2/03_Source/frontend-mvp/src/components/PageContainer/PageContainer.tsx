import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: string;
  padding?: boolean;
  className?: string;
}

export function PageContainer({ 
  children, 
  maxWidth = 'var(--container-xl)',
  padding = true,
  className 
}: PageContainerProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth,
        margin: '0 auto',
        padding: padding ? 'var(--space-lg)' : 0,
      }}
    >
      {children}
    </div>
  );
}
