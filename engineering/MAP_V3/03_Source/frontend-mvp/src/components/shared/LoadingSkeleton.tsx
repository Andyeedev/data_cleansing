interface LoadingSkeletonProps {
  rows?: number;
  variant?: 'card' | 'table' | 'list' | 'text' | 'circle';
  height?: string | number;
  width?: string | number;
  style?: React.CSSProperties;
}

const skeletonAnimation: React.CSSProperties = {
  background: 'linear-gradient(90deg, var(--color-bg-secondary) 25%, var(--color-border) 50%, var(--color-bg-secondary) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: 'var(--radius)',
};

export function LoadingSkeleton({ rows = 3, variant = 'text', height = 16, width, style }: LoadingSkeletonProps) {
  if (variant === 'circle') {
    return (
      <div role="status" aria-label="Loading" style={{ display: 'flex', gap: 'var(--space-md)', ...style }}>
        <div style={{ ...skeletonAnimation, width: 48, height: 48, borderRadius: '50%' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div style={{ ...skeletonAnimation, height: 16, width: '60%' }} />
          <div style={{ ...skeletonAnimation, height: 12, width: '40%' }} />
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div role="status" aria-label="Loading" style={{ ...skeletonAnimation, height: height || 120, width: width || '100%', ...style }} />
    );
  }

  if (variant === 'table') {
    return (
      <div role="status" aria-label="Loading" style={style}>
        <div style={{ ...skeletonAnimation, height: 40, width: '100%', marginBottom: 'var(--space-sm)' }} />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ ...skeletonAnimation, height: 36, width: '100%', marginBottom: 'var(--space-xs)' }} />
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div role="status" aria-label="Loading" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', ...style }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <div style={{ ...skeletonAnimation, width: 32, height: 32, borderRadius: 'var(--radius)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...skeletonAnimation, height: 14, width: '70%', marginBottom: 'var(--space-xs)' }} />
              <div style={{ ...skeletonAnimation, height: 10, width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div role="status" aria-label="Loading" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', ...style }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ ...skeletonAnimation, height, width: width || '100%' }} />
      ))}
    </div>
  );
}
