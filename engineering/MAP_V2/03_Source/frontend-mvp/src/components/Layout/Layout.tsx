import type { ReactNode } from 'react';
import { ThemeToggle } from '../ThemeToggle';
import { RoleSwitcher } from '../RoleSwitcher/RoleSwitcher';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  breadcrumb?: ReactNode;
  loading?: boolean;
}

export function Layout({ sidebar, children, breadcrumb, loading }: LayoutProps) {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      window.location.href = '/login';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        data-testid="sidebar"
        style={{
          width: 'var(--sidebar-width)',
          background: 'var(--color-sidebar)',
          color: 'var(--color-sidebar-text)',
          padding: 16,
          flexShrink: 0,
          overflowY: 'auto',
        }}
      >
        <div style={{ marginBottom: 24, fontWeight: 600, fontSize: 18, color: 'white' }}>
          MAP Nexus
        </div>
        {sidebar}
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          data-testid="header"
          style={{
            height: 'var(--header-height)',
            background: 'var(--color-header-bg)',
            borderBottom: '1px solid var(--color-header-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 24px',
          }}
        >
          <RoleSwitcher />
          <ThemeToggle />
          <button
            onClick={handleLogout}
            style={{ 
              marginLeft: 16, 
              padding: '8px 16px', 
              background: 'var(--color-error)', 
              color: 'white', 
              border: 'none', 
              borderRadius: 4, 
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Logout
          </button>
        </header>
        {breadcrumb && (
          <div style={{ padding: '0 24px', borderBottom: '1px solid var(--color-border)' }}>
            {breadcrumb}
          </div>
        )}
        <main
          data-testid="content"
          style={{
            flex: 1,
            padding: 24,
            background: 'var(--color-bg)',
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: '3px solid var(--color-border)',
                  borderTopColor: 'var(--color-sidebar-active)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}