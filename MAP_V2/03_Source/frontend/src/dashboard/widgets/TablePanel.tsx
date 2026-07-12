import { Table } from 'lucide-react';
import type { TablePanelProps } from '../framework/dashboard.types';

export const TablePanel = ({
  title,
  columns = [],
  data = [],
  className = '',
}: TablePanelProps) => {
  return (
    <div className={`rounded-xl border border-neutral-30 bg-white overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-neutral-30">
        <h3 className="text-sm font-semibold text-neutral-100">{title}</h3>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <Table className="w-12 h-12 text-neutral-60 mx-auto" />
            <p className="text-sm text-neutral-60 mt-2">No data available</p>
          </div>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-30">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-neutral-60 uppercase"
                    style={{ width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-neutral-30 last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-neutral-100">
                      {(row as Record<string, unknown>)[col.key] as string}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
