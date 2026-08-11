import { Modal } from './shared/Modal';
import { StatusBadge } from './shared/StatusBadge';
import type { SchemaNode } from '../types/discovery';

interface DiscoveryDetailModalProps {
  open: boolean;
  table: SchemaNode | null;
  onClose: () => void;
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'matched': return 'Matched';
    case 'modified': return 'Review Required';
    case 'unmatched': return 'Unmatched';
    case 'unmatched_source': return 'Source Only';
    case 'unmatched_target': return 'Target Only';
    default: return status;
  }
}

function getStatusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'matched': return 'success';
    case 'modified': return 'warning';
    case 'unmatched': return 'danger';
    default: return 'info';
  }
}

function getRecommendation(table: SchemaNode): { text: string; action: string; color: string } {
  if (table.status === 'matched' && table.target_table) {
    return {
      text: `This table maps to "${table.target_table}" with high confidence. Columns align well.`,
      action: 'Accept this match or review alternatives.',
      color: 'var(--color-success)',
    };
  }
  if (table.status === 'modified' && table.target_table) {
    return {
      text: `This table maps to "${table.target_table}" but needs review. Confidence is moderate — column types may differ or business logic may not align.`,
      action: 'Review column comparison below. Accept if columns are compatible, or reject to find alternative.',
      color: 'var(--color-warning)',
    };
  }
  if (table.status === 'unmatched' && table.mapped_from_table) {
    return {
      text: `This table is a target that receives data from "${table.mapped_from_table}".`,
      action: 'Verify the mapping is correct.',
      color: 'var(--color-info)',
    };
  }
  if (table.status === 'unmatched') {
    return {
      text: 'No source table found with compatible column structure.',
      action: 'Consider creating a view or ETL transform, or add this table to a future migration batch.',
      color: 'var(--color-danger)',
    };
  }
  return {
    text: 'Status unknown.',
    action: 'Manual review recommended.',
    color: 'var(--color-text-secondary)',
  };
}

function getMatchRationale(table: SchemaNode): string {
  if (table.status === 'matched' && table.confidence && table.confidence >= 0.9) {
    return 'High confidence match — column names and types align closely.';
  }
  if (table.status === 'matched' && table.confidence && table.confidence >= 0.7) {
    return 'Good match — most columns align. Minor differences may exist.';
  }
  if (table.status === 'modified') {
    return 'Partial match — some columns align but differences detected (type mismatch or missing columns).';
  }
  if (table.status === 'unmatched' && table.mapped_from_table) {
    return `This table is mapped as a target from "${table.mapped_from_table}".`;
  }
  if (table.status === 'unmatched') {
    return 'No matching source table found in the discovery scan.';
  }
  return 'Match analysis pending.';
}

export function DiscoveryDetailModal({ open, table, onClose }: DiscoveryDetailModalProps) {
  if (!table) return null;

  const recommendation = getRecommendation(table);
  const rationale = getMatchRationale(table);
  const columns = table.columns || [];

  return (
    <Modal
      open={open}
      title={`${table.name} — Match Details`}
      onClose={onClose}
      footer={
        <button
          onClick={onClose}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          Close
        </button>
      }
    >
      {/* Status + Confidence */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <StatusBadge status={getStatusLabel(table.status)} variant={getStatusVariant(table.status)} />
        {table.confidence != null && (
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Confidence: {Math.round(table.confidence * 100)}%
          </span>
        )}
        {table.target_table && (
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            → {table.target_table}
          </span>
        )}
        {table.mapped_from_table && !table.target_table && (
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            ← {table.mapped_from_table}
          </span>
        )}
      </div>

      {/* Match Rationale */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Match Rationale
        </h4>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', lineHeight: 1.5, margin: 0 }}>
          {rationale}
        </p>
      </div>

      {/* Column Comparison */}
      {columns.length > 0 && (
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Columns ({columns.length})
          </h4>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-xs)' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-secondary)' }}>
                  <th style={{ textAlign: 'left', padding: 'var(--space-xs) var(--space-sm)', fontWeight: 600 }}>Column</th>
                  <th style={{ textAlign: 'left', padding: 'var(--space-xs) var(--space-sm)', fontWeight: 600 }}>Type</th>
                  <th style={{ textAlign: 'left', padding: 'var(--space-xs) var(--space-sm)', fontWeight: 600 }}>Nullable</th>
                  <th style={{ textAlign: 'left', padding: 'var(--space-xs) var(--space-sm)', fontWeight: 600 }}>PK</th>
                  <th style={{ textAlign: 'left', padding: 'var(--space-xs) var(--space-sm)', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((col) => (
                  <tr key={col.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--space-xs) var(--space-sm)', fontFamily: 'monospace' }}>{col.name}</td>
                    <td style={{ padding: 'var(--space-xs) var(--space-sm)', color: 'var(--color-text-secondary)' }}>{col.data_type || '—'}</td>
                    <td style={{ padding: 'var(--space-xs) var(--space-sm)' }}>{col.is_nullable ? 'Yes' : 'No'}</td>
                    <td style={{ padding: 'var(--space-xs) var(--space-sm)' }}>{col.is_primary_key ? '✓' : ''}</td>
                    <td style={{ padding: 'var(--space-xs) var(--space-sm)' }}>
                      <StatusBadge status={col.status === 'matched' ? 'Matched' : 'Unmatched'} size="sm" variant={col.status === 'matched' ? 'success' : 'danger'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommendation */}
      <div style={{
        padding: 'var(--space-md)',
        background: `color-mix(in srgb, ${recommendation.color} 10%, transparent)`,
        borderRadius: 'var(--radius)',
        borderLeft: `3px solid ${recommendation.color}`,
      }}>
        <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-xs)', color: recommendation.color }}>
          Recommendation
        </h4>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', margin: 0, lineHeight: 1.5 }}>
          {recommendation.text}
        </p>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', margin: 'var(--space-xs) 0 0', fontStyle: 'italic' }}>
          {recommendation.action}
        </p>
      </div>
    </Modal>
  );
}
