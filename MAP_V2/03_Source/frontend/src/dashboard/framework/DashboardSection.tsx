import type { DashboardSectionProps } from './dashboard.types';

export const DashboardSection = ({
  title,
  children,
  className = '',
}: DashboardSectionProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-neutral-100 mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
};
