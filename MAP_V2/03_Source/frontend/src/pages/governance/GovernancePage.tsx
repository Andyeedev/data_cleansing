import { PageTitle } from '../../components/layout/PageTitle';
import { ComingSoon } from '../../components/common/ComingSoon';

export const GovernancePage = () => {
  return (
    <div>
      <PageTitle
        title="Governance"
        subtitle="Manage policies, compliance, and audit trails"
      />
      <ComingSoon
        title="Governance"
        description="This section will provide governance tools for policy management, compliance monitoring, and audit logging."
      />
    </div>
  );
};
