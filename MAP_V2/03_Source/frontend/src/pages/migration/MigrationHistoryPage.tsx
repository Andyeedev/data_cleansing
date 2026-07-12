import { PageTitle } from '../../components/layout/PageTitle';
import { ComingSoon } from '../../components/common/ComingSoon';

export const MigrationHistoryPage = () => {
  return (
    <div>
      <PageTitle
        title="Migration History"
        subtitle="Review historical migration data and logs"
      />
      <ComingSoon
        title="Migration History"
        description="This page will display historical migration records with audit trails and detailed logs."
      />
    </div>
  );
};
