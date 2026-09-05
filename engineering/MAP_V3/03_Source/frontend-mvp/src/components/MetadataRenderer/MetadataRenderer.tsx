import type { SchemaObject, ColumnDetail } from '../../types/metadata';

interface MetadataRendererProps {
  data: SchemaObject[];
  onSelect?: (item: SchemaObject) => void;
}

export function MetadataRenderer({ data, onSelect }: MetadataRendererProps) {
  if (!data || data.length === 0) {
    return <p style={{ color: 'var(--color-text-secondary)' }}>No metadata available.</p>;
  }

  return (
    <div data-testid="metadata-renderer">
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data.map((item) => (
          <li key={item.id} style={{ marginBottom: '4px' }}>
            <button
              onClick={() => onSelect?.(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 12px',
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                color: 'var(--color-text)',
                fontSize: '14px',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                {item.type === 'schema' ? '📂' : item.type === 'table' ? '📋' : item.type === 'view' ? '👁️' : '🔹'}
              </span>
              <span>{item.name}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginLeft: 'auto' }}>
                {item.type}
              </span>
            </button>
            {item.children && item.children.length > 0 && (
              <div style={{ marginLeft: '20px', marginTop: '4px' }}>
                <MetadataRenderer data={item.children} onSelect={onSelect} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ColumnDetailTableProps {
  columns: ColumnDetail[];
}

export function ColumnDetailTable({ columns }: ColumnDetailTableProps) {
  if (!columns || columns.length === 0) {
    return <p style={{ color: 'var(--color-text-secondary)' }}>No columns.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
          <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
          <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
          <th style={{ textAlign: 'center', padding: '8px' }}>Nullable</th>
          <th style={{ textAlign: 'center', padding: '8px' }}>PK</th>
          <th style={{ textAlign: 'center', padding: '8px' }}>FK</th>
        </tr>
      </thead>
      <tbody>
        {columns.map((col) => (
          <tr key={col.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td style={{ padding: '8px' }}>{col.name}</td>
            <td style={{ padding: '8px', color: 'var(--color-text-secondary)' }}>{col.dataType}</td>
            <td style={{ padding: '8px', textAlign: 'center' }}>{col.nullable ? '✓' : ''}</td>
            <td style={{ padding: '8px', textAlign: 'center' }}>{col.isPrimaryKey ? '✓' : ''}</td>
            <td style={{ padding: '8px', textAlign: 'center' }}>{col.isForeignKey ? '✓' : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
