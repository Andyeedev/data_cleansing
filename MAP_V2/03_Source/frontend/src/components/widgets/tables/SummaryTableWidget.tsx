import { ClipboardList } from 'lucide-react';
import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';
import type { TableWidgetProps } from '../types/WidgetProps';

export const SummaryTableWidget = ({ data }: WidgetProps) => {
  const tableData = data as TableWidgetProps['data'];

  if (!tableData || !tableData.columns || tableData.columns.length === 0) {
    return (
      <WidgetBody>
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <ClipboardList className="w-12 h-12 text-neutral-60 mx-auto" />
            <p className="text-sm text-neutral-60 mt-2">No summary data</p>
          </div>
        </div>
      </WidgetBody>
    );
  }

  return (
    <WidgetBody>
      <div className="space-y-3">
        {tableData.rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-neutral-20 rounded-lg"
          >
            {tableData.columns.slice(0, 2).map((col, j) => (
              <div key={col.key} className={j === 0 ? 'flex-1' : 'text-right'}>
                <p className={`text-sm ${j === 0 ? 'font-medium text-neutral-100' : 'text-neutral-60'}`}>
                  {String(row[col.key] ?? '')}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </WidgetBody>
  );
};
