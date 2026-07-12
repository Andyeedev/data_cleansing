import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const mappings = [
  { id: 'm1', dataset: 'Customer Master', columns: 24, mapped: 24, status: 'valid', health: 100 },
  { id: 'm2', dataset: 'Transaction History', columns: 18, mapped: 16, status: 'pending', health: 89 },
  { id: 'm3', dataset: 'Account Data', columns: 15, mapped: 15, status: 'valid', health: 100 },
  { id: 'm4', dataset: 'Product Catalog', columns: 12, mapped: 10, status: 'pending', health: 83 },
  { id: 'm5', dataset: 'Compliance Records', columns: 32, mapped: 30, status: 'pending', health: 94 },
];

const statusStyles = {
  valid: 'bg-success-50 text-success-500',
  pending: 'bg-warning-50 text-warning-500',
  invalid: 'bg-error-50 text-error-500',
};

export const MigrationMappings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-100">Mapping Management</h2>
        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors">
          New Mapping
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { id: 'map-total', label: 'Total Mappings', value: 156 },
          { id: 'map-valid', label: 'Valid', value: 142 },
          { id: 'map-pending', label: 'Pending', value: 14 },
          { id: 'map-health', label: 'Mapping Health', value: '91%' },
        ].map((kpi) => (
          <WidgetRenderer
            key={kpi.id}
            config={{ id: kpi.id, type: 'kpi', title: kpi.label, size: 'md' } as WidgetConfig}
            data={{ value: kpi.value, label: kpi.label }}
          />
        ))}
      </div>

      <div className="bg-white border border-neutral-30 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-30">
          <h3 className="text-sm font-semibold text-neutral-100">Dataset Mappings</h3>
        </div>
        <div className="divide-y divide-neutral-30">
          {mappings.map((mapping) => (
            <div key={mapping.id} className="p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-100">{mapping.dataset}</p>
                <p className="text-xs text-neutral-60">{mapping.mapped}/{mapping.columns} columns mapped</p>
              </div>
              <div className="w-20">
                <div className="h-2 bg-neutral-20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${mapping.health}%` }} />
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusStyles[mapping.status as keyof typeof statusStyles]}`}>
                {mapping.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
