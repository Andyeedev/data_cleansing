import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from '../../navigation/Sidebar';
import { TopNavigation } from '../../navigation/TopNavigation';
import { Footer } from '../../navigation/Footer';
import { Breadcrumb } from '../../navigation/Breadcrumb';
import { MobileNavigation } from '../../navigation/MobileNavigation';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-10">
      <Toaster position="top-right" />
      <MobileNavigation />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)]">
          <TopNavigation />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <Breadcrumb />
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};
