import { PageTitle } from '../../components/layout/PageTitle';
import { ComingSoon } from '../../components/common/ComingSoon';

export const MigrationOverviewPage = () => {
  return (
    <div>
      <PageTitle
        title="Migration Overview"
        subtitle="Monitor and manage data migration processes"
      />
      <ComingSoon
        title="Migration Overview"
        description="This page will display migration job status, progress tracking, and summary statistics."
      />
    </div>
  );
};
