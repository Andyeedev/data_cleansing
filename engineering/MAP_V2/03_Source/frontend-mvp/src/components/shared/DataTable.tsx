import { useState, useMemo } from 'react';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  empty?: string;
  pagination?: { page: number; pageSize: number; total: number; onPageChange: (page: number) => void };
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  keyExtractor: (row: T) => string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading,
  empty = 'No data available',
  pagination,
  onSort,
  keyExtractor,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    const newDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDir(newDir);
    onSort?.(key, newDir);
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        Loading...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        {empty}
      </div>
    );
  }

  return (
    <div style={{ overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
        <thead>
          <tr style={{ borderBottom: 'var(--border-width) solid var(--color-border)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: 'left',
                  padding: 'var(--space-sm) var(--space-md)',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  width: col.width,
                  cursor: col.sortable ? 'pointer' : 'default',
                  userSelect: col.sortable ? 'none' : undefined,
                }}
                onClick={() => col.sortable && handleSort(col.key)}
                aria-sort={sortKey === col.key ? sortDir === 'asc' ? 'ascending' : 'descending' : undefined}
              >
                {col.label}
                {sortKey === col.key && (sortDir === 'asc' ? ' ↑' : ' ↓')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={keyExtractor(row)} style={{ borderBottom: 'var(--border-width) solid var(--color-border)' }}>
              {columns.map((col) => (
                <td key={col.key} style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <div style={{ padding: 'var(--space-sm) var(--space-md)', display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)} ({pagination.total} items)
          </span>
        </div>
      )}
    </div>
  );
}
