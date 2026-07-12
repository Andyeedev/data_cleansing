import { PageTitle } from '../../components/layout/PageTitle';
import { ComingSoon } from '../../components/common/ComingSoon';

export const ValidationRulesPage = () => {
  return (
    <div>
      <PageTitle
        title="Validation Rules"
        subtitle="Configure and manage data validation rules"
      />
      <ComingSoon
        title="Validation Rules"
        description="This page will allow you to create, edit, and manage validation rules for data quality checks."
      />
    </div>
  );
};
