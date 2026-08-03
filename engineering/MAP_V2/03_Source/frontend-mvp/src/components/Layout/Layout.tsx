import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeToggle } from '../ThemeToggle';
import { RoleSwitcher } from '../RoleSwitcher/RoleSwitcher';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  breadcrumb?: ReactNode;
  loading?: boolean;
}

export function Layout({ sidebar, children, breadcrumb, loading }: LayoutProps) {
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!loading) {
      mainRef.current?.focus();
    }
  }, [loading]);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    window.location.href = '/login';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <aside
        data-testid="sidebar"
        role="complementary"
        aria-label="Sidebar"
        style={{
          width: 'var(--sidebar-width)',
          background: 'var(--color-sidebar)',
          color: 'var(--color-sidebar-text)',
          padding: 'var(--space-md)',
          flexShrink: 0,
          overflowY: 'auto',
        }}
      >
        <div style={{ marginBottom: 'var(--space-lg)', fontWeight: 600, fontSize: 'var(--font-size-h3)', color: 'white' }}>
          MAP Nexus
        </div>
        {sidebar}
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          data-testid="header"
          role="banner"
          aria-label="Header"
          style={{
            height: 'var(--header-height)',
            background: 'var(--color-header-bg)',
            borderBottom: 'var(--border-width) solid var(--color-header-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 var(--space-lg)',
          }}
        >
          <RoleSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              marginLeft: 'var(--space-md)',
              padding: 'var(--space-sm) var(--space-md)',
              background: 'var(--color-danger)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-base)',
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        </header>

        {breadcrumb && (
          <nav aria-label="Breadcrumb" style={{ padding: '0 var(--space-lg)', borderBottom: 'var(--border-width) solid var(--color-border)' }}>
            {breadcrumb}
          </nav>
        )}

        <main
          id="main-content"
          ref={mainRef}
          data-testid="content"
          role="main"
          tabIndex={-1}
          style={{
            flex: 1,
            padding: 'var(--space-lg)',
            background: 'var(--color-bg)',
            outline: 'none',
          }}
        >
          {loading ? <LoadingSpinner /> : children}
        </main>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        variant="warning"
        confirmLabel="Log Out"
      />
    </div>
  );
}
