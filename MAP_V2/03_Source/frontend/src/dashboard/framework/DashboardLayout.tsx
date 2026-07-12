import type { DashboardLayoutProps } from './dashboard.types';
import { DashboardProvider } from './DashboardContext';

export const DashboardLayout = ({ children, className = '' }: DashboardLayoutProps) => {
  return (
    <DashboardProvider>
      <div className={`min-h-[calc(100vh-8rem)] ${className}`}>
        {children}
      </div>
    </DashboardProvider>
  );
};
