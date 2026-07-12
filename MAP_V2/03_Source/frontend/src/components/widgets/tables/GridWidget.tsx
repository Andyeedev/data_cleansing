import { Table } from 'lucide-react';
import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';
import type { TableWidgetProps } from '../types/WidgetProps';

export const GridWidget = ({ data }: WidgetProps) => {
  const tableData = data as TableWidgetProps['data'];

  if (!tableData || !tableData.columns || tableData.columns.length === 0) {
    return (
      <WidgetBody>
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <Table className="w-12 h-12 text-neutral-60 mx-auto" />
            <p className="text-sm text-neutral-60 mt-2">No data available</p>
          </div>
        </div>
      </WidgetBody>
    );
  }

  return (
    <WidgetBody className="p-0">
      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-30">
              {tableData.columns.map((col) => (
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
            {tableData.rows.length === 0 ? (
              <tr>
                <td
                  colSpan={tableData.columns.length}
                  className="px-4 py-8 text-center text-sm text-neutral-60"
                >
                  No rows
                </td>
              </tr>
            ) : (
              tableData.rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-neutral-30 last:border-0 hover:bg-neutral-20 transition-colors"
                >
                  {tableData.columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-neutral-100">
                      {String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </WidgetBody>
  );
};
