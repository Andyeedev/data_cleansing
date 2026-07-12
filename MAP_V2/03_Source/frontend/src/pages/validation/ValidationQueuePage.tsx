import { PageTitle } from '../../components/layout/PageTitle';
import { ComingSoon } from '../../components/common/ComingSoon';

export const ValidationQueuePage = () => {
  return (
    <div>
      <PageTitle
        title="Validation Queue"
        subtitle="Manage pending validation tasks"
      />
      <ComingSoon
        title="Validation Queue"
        description="This page will show pending validation tasks with priority and status."
      />
    </div>
  );
};
