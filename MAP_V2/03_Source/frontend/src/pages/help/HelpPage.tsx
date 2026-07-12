import { PageTitle } from '../../components/layout/PageTitle';
import { ComingSoon } from '../../components/common/ComingSoon';

export const HelpPage = () => {
  return (
    <div>
      <PageTitle
        title="Help & Support"
        subtitle="Documentation and support resources"
      />
      <ComingSoon
        title="Help & Support"
        description="This section will provide documentation, tutorials, FAQs, and support contact information."
      />
    </div>
  );
};
