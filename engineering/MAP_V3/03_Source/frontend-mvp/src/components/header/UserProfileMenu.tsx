import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserProfileMenuProps {
  onClose: () => void;
}

export function UserProfileMenu({ onClose }: UserProfileMenuProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = async () => {
    onClose();
    await logout();
    window.location.href = '/login';
  };

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
    },
  ];

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        right: 0,
        top: '100%',
        marginTop: 8,
        width: 260,
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {/* User Info */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: 14,
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontWeight: 600,
            fontSize: 14,
            color: 'var(--color-text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {user?.name || 'User'}
          </div>
          <div style={{
            fontSize: 12,
            color: 'var(--color-text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {user?.email || 'user@example.com'}
          </div>
          {user?.roles && user.roles.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 2,
            }}>
              <Shield size={10} style={{ color: 'var(--color-text-secondary)' }} />
              <span style={{
                fontSize: 11,
                color: 'var(--color-text-secondary)',
              }}>
                {user.roles[0]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div style={{ padding: '4px 0' }}>
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gap: 10,
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text)',
              fontSize: 13,
              textAlign: 'left',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            <item.icon size={16} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{item.label}</span>
            <ChevronRight size={14} style={{ color: 'var(--color-text-secondary)', opacity: 0.5 }} />
          </button>
        ))}
      </div>

      {/* Sign Out */}
      <div style={{ borderTop: '1px solid var(--color-border)', padding: '4px 0' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: 10,
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-danger)',
            fontSize: 13,
            textAlign: 'left',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>Sign out</span>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
        </button>
      </div>
    </div>
  );
}
