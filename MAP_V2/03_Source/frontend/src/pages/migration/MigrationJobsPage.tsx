import { PageTitle } from '../../components/layout/PageTitle';
import { ComingSoon } from '../../components/common/ComingSoon';

export const MigrationJobsPage = () => {
  return (
    <div>
      <PageTitle
        title="Migration Jobs"
        subtitle="View and manage individual migration jobs"
      />
      <ComingSoon
        title="Migration Jobs"
        description="This page will list all migration jobs with filtering, sorting, and job details."
      />
    </div>
  );
};
