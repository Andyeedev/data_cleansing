import { PageTitle } from '../../components/layout/PageTitle';
import { ComingSoon } from '../../components/common/ComingSoon';

export const ReportsPage = () => {
  return (
    <div>
      <PageTitle
        title="Reports"
        subtitle="Generate and manage reports"
      />
      <ComingSoon
        title="Reports"
        description="This section will provide standard reports, custom report builder, and scheduled report management."
      />
    </div>
  );
};
