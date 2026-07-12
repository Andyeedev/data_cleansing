import type { DashboardPageProps } from './dashboard.types';
import { PageHeader } from '../../layout/PageHeader';
import { DashboardToolbar } from './DashboardToolbar';

export const DashboardPage = ({
  title,
  subtitle,
  toolbar,
  children,
  className = '',
}: DashboardPageProps) => {
  return (
    <div className={className}>
      <PageHeader title={title} subtitle={subtitle} />
      {toolbar || <DashboardToolbar />}
      <div className="mt-4">{children}</div>
    </div>
  );
};
