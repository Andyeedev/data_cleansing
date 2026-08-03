interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  icon?: string;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div
      style={{
        padding: 'var(--space-xl)',
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
      }}
    >
      {icon && (
        <div style={{ fontSize: 'var(--icon-xl)', marginBottom: 'var(--space-md)' }}>
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: 'var(--font-size-h3)', color: 'var(--color-text)', marginBottom: 'var(--space-sm)' }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: 'var(--font-size-base)', maxWidth: 400, margin: '0 auto', marginBottom: action ? 'var(--space-lg)' : 0 }}>
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--color-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-base)',
            fontWeight: 500,
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
