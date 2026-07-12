import { PageTitle } from '../../components/layout/PageTitle';
import { ComingSoon } from '../../components/common/ComingSoon';

export const RiskPage = () => {
  return (
    <div>
      <PageTitle
        title="Risk Management"
        subtitle="Assess, monitor, and mitigate risks"
      />
      <ComingSoon
        title="Risk Management"
        description="This section will provide risk assessment tools, risk register, and risk matrix visualization."
      />
    </div>
  );
};
