interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const getVisiblePages = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (page > 3) pages.push('...');

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (page < totalPages - 2) pages.push('...');

    pages.push(totalPages);

    return pages;
  };

  return (
    <nav aria-label="Pagination" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', fontSize: 'var(--font-size-sm)' }}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        style={{
          padding: 'var(--space-xs) var(--space-sm)',
          background: 'transparent',
          border: 'var(--border-width) solid var(--color-border)',
          borderRadius: 'var(--radius)',
          cursor: page <= 1 ? 'not-allowed' : 'pointer',
          opacity: page <= 1 ? 0.5 : 1,
          color: 'var(--color-text)',
        }}
      >
        ←
      </button>

      {getVisiblePages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} style={{ padding: '0 var(--space-xs)', color: 'var(--color-text-secondary)' }}>
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            style={{
              padding: 'var(--space-xs) var(--space-sm)',
              background: p === page ? 'var(--color-primary)' : 'transparent',
              color: p === page ? '#ffffff' : 'var(--color-text)',
              border: `var(--border-width) solid ${p === page ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontWeight: p === page ? 600 : 400,
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        style={{
          padding: 'var(--space-xs) var(--space-sm)',
          background: 'transparent',
          border: 'var(--border-width) solid var(--color-border)',
          borderRadius: 'var(--radius)',
          cursor: page >= totalPages ? 'not-allowed' : 'pointer',
          opacity: page >= totalPages ? 0.5 : 1,
          color: 'var(--color-text)',
        }}
      >
        →
      </button>

      <span style={{ marginLeft: 'var(--space-sm)', color: 'var(--color-text-secondary)' }}>
        {total} items
      </span>
    </nav>
  );
}
