import { Modal } from './shared/Modal';
import { StatusPill } from './reports/reportWidgets';
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

function getRecommendation(table: SchemaNode): { text: string; action: string; colorClass: string; bgClass: string } {
  if (table.status === 'matched' && table.target_table) {
    return {
      text: `This table maps to "${table.target_table}" with high confidence. Columns align well.`,
      action: 'Accept this match or review alternatives.',
      colorClass: 'text-green-700',
      bgClass: 'bg-green-50 border-l-green-500',
    };
  }
  if (table.status === 'modified' && table.target_table) {
    return {
      text: `This table maps to "${table.target_table}" but needs review. Confidence is moderate — column types may differ or business logic may not align.`,
      action: 'Review column comparison below. Accept if columns are compatible, or reject to find alternative.',
      colorClass: 'text-yellow-700',
      bgClass: 'bg-yellow-50 border-l-yellow-400',
    };
  }
  if (table.status === 'unmatched' && table.mapped_from_table) {
    return {
      text: `This table is a target that receives data from "${table.mapped_from_table}".`,
      action: 'Verify the mapping is correct.',
      colorClass: 'text-blue-700',
      bgClass: 'bg-blue-50 border-l-blue-500',
    };
  }
  if (table.status === 'unmatched') {
    return {
      text: 'No source table found with compatible column structure.',
      action: 'Consider creating a view or ETL transform, or add this table to a future migration batch.',
      colorClass: 'text-red-700',
      bgClass: 'bg-red-50 border-l-red-500',
    };
  }
  return {
    text: 'Status unknown.',
    action: 'Manual review recommended.',
    colorClass: 'text-gray-500',
    bgClass: 'bg-gray-50 border-l-gray-300',
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
          className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-200"
        >
          Close
        </button>
      }
    >
      <div className="flex items-center gap-3 mb-5">
        <StatusPill status={getStatusLabel(table.status)} />
        {table.confidence != null && (
          <span className="text-sm text-gray-500">
            Confidence: {Math.round(table.confidence * 100)}%
          </span>
        )}
        {table.target_table && (
          <span className="text-sm text-gray-500">
            → {table.target_table}
          </span>
        )}
        {table.mapped_from_table && !table.target_table && (
          <span className="text-sm text-gray-500">
            ← {table.mapped_from_table}
          </span>
        )}
      </div>

      <div className="mb-5">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Match Rationale
        </h4>
        <p className="text-sm text-gray-900 leading-relaxed m-0">
          {rationale}
        </p>
      </div>

      {columns.length > 0 && (
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Columns ({columns.length})
          </h4>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-2 py-1.5 font-semibold text-gray-700">Column</th>
                  <th className="text-left px-2 py-1.5 font-semibold text-gray-700">Type</th>
                  <th className="text-left px-2 py-1.5 font-semibold text-gray-700">Nullable</th>
                  <th className="text-left px-2 py-1.5 font-semibold text-gray-700">PK</th>
                  <th className="text-left px-2 py-1.5 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((col) => (
                  <tr key={col.id} className="border-t border-gray-100">
                    <td className="px-2 py-1.5 font-mono text-gray-900">{col.name}</td>
                    <td className="px-2 py-1.5 text-gray-500">{col.data_type || '—'}</td>
                    <td className="px-2 py-1.5 text-gray-700">{col.is_nullable ? 'Yes' : 'No'}</td>
                    <td className="px-2 py-1.5 text-gray-700">{col.is_primary_key ? '✓' : ''}</td>
                    <td className="px-2 py-1.5">
                      <StatusPill status={col.status === 'matched' ? 'Matched' : 'Unmatched'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className={`p-3 rounded-md border-l-[3px] ${recommendation.bgClass}`}>
        <h4 className={`text-sm font-semibold mb-1 ${recommendation.colorClass}`}>
          Recommendation
        </h4>
        <p className="text-sm text-gray-900 m-0 leading-relaxed">
          {recommendation.text}
        </p>
        <p className="text-xs text-gray-500 mt-1 italic m-0">
          {recommendation.action}
        </p>
      </div>
    </Modal>
  );
}
