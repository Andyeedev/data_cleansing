interface ErrorStateProps {
  title?: string;
  message: string;
  code?: string | number;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message, code, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      style={{
        padding: 'var(--space-xl)',
        textAlign: 'center',
        background: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-danger)',
      }}
    >
      <div style={{ fontSize: 'var(--icon-xl)', marginBottom: 'var(--space-md)', color: 'var(--color-danger)' }}>
        ⚠
      </div>
      <h3 style={{ fontSize: 'var(--font-size-h3)', color: 'var(--color-text)', marginBottom: 'var(--space-sm)' }}>
        {title}
      </h3>
      <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
        {message}
      </p>
      {code && (
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
          Error code: {code}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
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
          Retry
        </button>
      )}
    </div>
  );
}
