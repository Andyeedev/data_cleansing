import { ShieldCheck } from 'lucide-react';
import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';

export const AuditReportWidget = ({ config, data }: WidgetProps) => {
  const auditData = data as { summary?: string; findings?: string[] } | undefined;

  return (
    <WidgetBody>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-100">Audit Report</p>
            <p className="text-xs text-neutral-60">{config.title || 'Compliance Audit'}</p>
          </div>
        </div>

        {auditData?.summary ? (
          <p className="text-sm text-neutral-60">{auditData.summary}</p>
        ) : (
          <div className="flex items-center justify-center h-32 bg-neutral-20 rounded-lg">
            <p className="text-sm text-neutral-60">Audit report placeholder</p>
          </div>
        )}

        {auditData?.findings && auditData.findings.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-neutral-60 uppercase">Findings</p>
            {auditData.findings.map((finding, i) => (
              <div key={i} className="p-2 bg-neutral-20 rounded text-sm text-neutral-100">
                {finding}
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetBody>
  );
};
