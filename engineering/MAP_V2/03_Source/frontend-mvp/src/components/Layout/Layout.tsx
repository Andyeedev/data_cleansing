import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Bell } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { RoleSwitcher } from '../RoleSwitcher/RoleSwitcher';
import { NotificationPanel } from '../header/NotificationPanel';
import { UserProfileMenu } from '../header/UserProfileMenu';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useUnreadCount } from '../../hooks/useNotifications';

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  breadcrumb?: ReactNode;
  loading?: boolean;
}

export function Layout({ sidebar, children, breadcrumb, loading }: LayoutProps) {
  const { user, logout } = useAuth();
  const { count: unreadCount, refetch: refetchCount } = useUnreadCount();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
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

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  };

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

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
            gap: 'var(--space-sm)',
          }}
        >
          <RoleSwitcher />
          <ThemeToggle />

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={toggleNotifications}
              aria-label="Notifications"
              style={{
                background: 'none',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                padding: '6px 10px',
                cursor: 'pointer',
                color: 'var(--color-text)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9,
                  background: '#d13438',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  lineHeight: 1,
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
          </div>

          {/* User Profile Avatar */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={toggleProfile}
              aria-label="User menu"
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {initials}
            </button>
            {showProfile && <UserProfileMenu onClose={() => setShowProfile(false)} />}
          </div>
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
