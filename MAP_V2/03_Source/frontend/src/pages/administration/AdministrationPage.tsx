import { PageTitle } from '../../components/layout/PageTitle';
import { ComingSoon } from '../../components/common/ComingSoon';

export const AdministrationPage = () => {
  return (
    <div>
      <PageTitle
        title="Administration"
        subtitle="Manage users, roles, and system settings"
      />
      <ComingSoon
        title="Administration"
        description="This section will provide user management, role-based access control, and system configuration."
      />
    </div>
  );
};
