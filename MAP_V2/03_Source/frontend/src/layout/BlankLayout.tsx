import { Outlet } from 'react-router-dom';

export const BlankLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-10">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
