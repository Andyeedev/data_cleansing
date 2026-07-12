import { PageTitle } from '../../components/layout/PageTitle';
import { ComingSoon } from '../../components/common/ComingSoon';

export const ValidationResultsPage = () => {
  return (
    <div>
      <PageTitle
        title="Validation Results"
        subtitle="Review data validation results and errors"
      />
      <ComingSoon
        title="Validation Results"
        description="This page will display validation results with error details and resolution suggestions."
      />
    </div>
  );
};
