import { Link } from 'react-router-dom';

interface ActionItem {
  label: string;
  path: string;
  color?: string;
  icon?: string;
  adminOnly?: boolean;
}

interface ExecutiveActionsProps {
  isAdmin: boolean;
  isManager: boolean;
}

const defaultActions: ActionItem[] = [
  { label: 'Manage Systems', path: '/systems', color: 'var(--color-primary)', icon: '⚙️', adminOnly: true },
  { label: 'Start Migration', path: '/migration', color: '#6366f1', icon: '🚀' },
  { label: 'View Operations', path: '/operations', color: '#374151', icon: '📊' },
  { label: 'Validation Rules', path: '/validation', color: 'var(--color-success)', icon: '✓' },
  { label: 'Governance', path: '/governance', color: 'var(--color-warning)', icon: '🛡️' },
  { label: 'Reports', path: '/reports', color: '#8b5cf6', icon: '📈' },
];

export function ExecutiveActions({ isAdmin, isManager }: ExecutiveActionsProps) {
  const actions = defaultActions.filter(action => {
    if (action.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Quick Actions</h2>
      <div style={gridStyle}>
        {actions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            style={{
              ...buttonStyle,
              background: action.color || 'var(--color-primary)',
            }}
          >
            {action.icon && <span style={iconStyle}>{action.icon}</span>}
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  marginBottom: 'var(--space-lg)',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text)',
  marginBottom: 'var(--space-md)',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: 'var(--space-sm)',
};

const buttonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-sm)',
  padding: 'var(--space-md)',
  color: 'white',
  borderRadius: 'var(--radius)',
  textDecoration: 'none',
  fontWeight: 'var(--font-weight-medium)',
  fontSize: 'var(--font-size-sm)',
  transition: 'opacity 0.2s',
};

const iconStyle: React.CSSProperties = {
  fontSize: 'var(--icon-md)',
};
