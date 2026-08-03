interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  COMPLETED: { bg: 'rgba(40, 167, 69, 0.1)', color: 'var(--color-success)' },
  PASS: { bg: 'rgba(40, 167, 69, 0.1)', color: 'var(--color-success)' },
  ACTIVE: { bg: 'rgba(40, 167, 69, 0.1)', color: 'var(--color-success)' },
  RUNNING: { bg: 'rgba(255, 193, 7, 0.1)', color: 'var(--color-warning)' },
  PENDING: { bg: 'rgba(255, 193, 7, 0.1)', color: 'var(--color-warning)' },
  IN_PROGRESS: { bg: 'rgba(255, 193, 7, 0.1)', color: 'var(--color-warning)' },
  FAILED: { bg: 'rgba(220, 53, 69, 0.1)', color: 'var(--color-danger)' },
  FAIL: { bg: 'rgba(220, 53, 69, 0.1)', color: 'var(--color-danger)' },
  ERROR: { bg: 'rgba(220, 53, 69, 0.1)', color: 'var(--color-danger)' },
  BLOCKED: { bg: 'rgba(220, 53, 69, 0.1)', color: 'var(--color-danger)' },
  HIGH: { bg: 'rgba(220, 53, 69, 0.1)', color: 'var(--color-danger)' },
  MEDIUM: { bg: 'rgba(255, 193, 7, 0.1)', color: 'var(--color-warning)' },
  LOW: { bg: 'rgba(40, 167, 69, 0.1)', color: 'var(--color-success)' },
  INACTIVE: { bg: 'rgba(108, 117, 125, 0.1)', color: 'var(--color-text-secondary)' },
  PAUSED: { bg: 'rgba(108, 117, 125, 0.1)', color: 'var(--color-text-secondary)' },
  DRAFT: { bg: 'rgba(108, 117, 125, 0.1)', color: 'var(--color-text-secondary)' },
  UNKNOWN: { bg: 'rgba(108, 117, 125, 0.1)', color: 'var(--color-text-secondary)' },
};

const sizeStyles: Record<string, { padding: string; fontSize: string }> = {
  sm: { padding: '2px 6px', fontSize: 'var(--font-size-xs)' },
  md: { padding: '4px 8px', fontSize: 'var(--font-size-sm)' },
  lg: { padding: '6px 12px', fontSize: 'var(--font-size-base)' },
};

export function StatusBadge({ status, variant, size = 'md', ariaLabel }: StatusBadgeProps) {
  const colors = variant
    ? { bg: `var(--color-${variant === 'danger' ? 'danger' : variant})`, color: '#fff' }
    : statusColors[status.toUpperCase()] || statusColors.INACTIVE;
  const sizeStyle = sizeStyles[size];

  return (
    <span
      role="status"
      aria-label={ariaLabel || status}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontWeight: 500,
        borderRadius: 'var(--radius-full)',
        background: colors.bg,
        color: colors.color,
        lineHeight: 1.4,
      }}
    >
      {status}
    </span>
  );
}
