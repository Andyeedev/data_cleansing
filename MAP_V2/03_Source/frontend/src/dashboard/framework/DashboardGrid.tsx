import type { DashboardGridProps } from './dashboard.types';

export const DashboardGrid = ({
  children,
  columns = 12,
  className = '',
}: DashboardGridProps) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4 ${className}`}
    >
      {children}
    </div>
  );
};
