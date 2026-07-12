import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const auditWidgets: WidgetConfig[] = [
  { id: 'audit-dash', type: 'status', title: 'Audit Dashboard', size: 'full' },
  { id: 'audit-findings', type: 'status', title: 'Audit Findings', size: 'lg' },
  { id: 'audit-packs', type: 'grid', title: 'Audit Packs', size: 'lg' },
  { id: 'audit-history', type: 'timeline', title: 'Audit History', size: 'lg' },
  { id: 'audit-evidence', type: 'grid', title: 'Audit Evidence', size: 'lg' },
];

export const AuditCentre = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Audit Centre</h1>
        <p className="text-sm text-neutral-60 mt-1">Internal and external audit management</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {auditWidgets.map((widget) => (
          <WidgetRenderer key={widget.id} config={widget} data={{}} />
        ))}
      </div>
    </div>
  );
};
