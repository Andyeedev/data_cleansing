import { PageTitle } from '../../components/layout/PageTitle';
import { ComingSoon } from '../../components/common/ComingSoon';

export const SettingsPage = () => {
  return (
    <div>
      <PageTitle
        title="Settings"
        subtitle="Manage your profile and preferences"
      />
      <ComingSoon
        title="Settings"
        description="This section will provide profile management, notification preferences, and display settings."
      />
    </div>
  );
};
