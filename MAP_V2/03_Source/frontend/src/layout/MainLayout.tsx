import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ApplicationShell } from './ApplicationShell';

export const MainLayout = () => {
  return (
    <ApplicationShell>
      <Toaster position="top-right" />
      <Outlet />
    </ApplicationShell>
  );
};
