import { Bot } from 'lucide-react';
import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';
import type { AIWidgetProps } from '../types/WidgetProps';

export const AISummaryWidget = ({ data }: WidgetProps) => {
  const aiData = data as AIWidgetProps['data'];

  return (
    <WidgetBody>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-100">AI Summary</p>
            <p className="text-xs text-neutral-60">Generated insights</p>
          </div>
        </div>

        {aiData?.summary ? (
          <p className="text-sm text-neutral-60 leading-relaxed">{aiData.summary}</p>
        ) : (
          <div className="flex items-center justify-center h-32 bg-gradient-to-br from-primary-50 to-transparent rounded-lg border border-primary-100">
            <p className="text-sm text-primary-600">AI analysis placeholder</p>
          </div>
        )}
      </div>
    </WidgetBody>
  );
};
