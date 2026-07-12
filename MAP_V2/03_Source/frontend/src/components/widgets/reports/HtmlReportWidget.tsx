import { FileText } from 'lucide-react';
import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';
import type { ReportWidgetProps } from '../types/WidgetProps';

export const HtmlReportWidget = ({ data }: WidgetProps) => {
  const reportData = data as ReportWidgetProps['data'];

  if (!reportData || !reportData.content) {
    return (
      <WidgetBody>
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <FileText className="w-12 h-12 text-neutral-60 mx-auto" />
            <p className="text-sm text-neutral-60 mt-2">No report content</p>
          </div>
        </div>
      </WidgetBody>
    );
  }

  return (
    <WidgetBody>
      <div className="prose prose-sm max-w-none">
        {reportData.format === 'html' ? (
          <div dangerouslySetInnerHTML={{ __html: reportData.content }} />
        ) : (
          <pre className="whitespace-pre-wrap text-sm text-neutral-100 bg-neutral-20 p-4 rounded-lg">
            {reportData.content}
          </pre>
        )}
      </div>
    </WidgetBody>
  );
};
