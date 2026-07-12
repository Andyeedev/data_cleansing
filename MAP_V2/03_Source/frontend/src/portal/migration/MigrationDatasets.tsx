import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const datasets = [
  { id: 'd1', name: 'Customer Master', source: 'Oracle DB', target: 'Azure SQL', status: 'healthy', records: '1.2M', size: '2.4 GB' },
  { id: 'd2', name: 'Transaction History', source: 'MySQL', target: 'Azure SQL', status: 'healthy', records: '8.5M', size: '4.8 GB' },
  { id: 'd3', name: 'Account Data', source: 'PostgreSQL', target: 'Azure SQL', status: 'warning', records: '890K', size: '1.2 GB' },
  { id: 'd4', name: 'Product Catalog', source: 'MongoDB', target: 'Azure Cosmos', status: 'healthy', records: '45K', size: '256 MB' },
  { id: 'd5', name: 'Compliance Records', source: 'SQL Server', target: 'Azure SQL', status: 'healthy', records: '2.1M', size: '3.2 GB' },
];

const statusStyles = {
  healthy: 'bg-success-50 text-success-500',
  warning: 'bg-warning-50 text-warning-500',
  failed: 'bg-error-50 text-error-500',
};

export const MigrationDatasets = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-100">Dataset Management</h2>
        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors">
          Add Dataset
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { id: 'ds-total', label: 'Total Datasets', value: 156 },
          { id: 'ds-mapped', label: 'Mapped', value: 142 },
          { id: 'ds-pending', label: 'Pending', value: 14 },
          { id: 'ds-health', label: 'Dataset Health', value: '97%' },
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
          <h3 className="text-sm font-semibold text-neutral-100">Dataset Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left p-3 text-xs font-semibold text-neutral-60">Name</th>
                <th className="text-left p-3 text-xs font-semibold text-neutral-60">Source</th>
                <th className="text-left p-3 text-xs font-semibold text-neutral-60">Target</th>
                <th className="text-left p-3 text-xs font-semibold text-neutral-60">Records</th>
                <th className="text-left p-3 text-xs font-semibold text-neutral-60">Size</th>
                <th className="text-left p-3 text-xs font-semibold text-neutral-60">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300">
              {datasets.map((ds) => (
                <tr key={ds.id} className="hover:bg-neutral-50 transition-colors cursor-pointer">
                  <td className="p-3 font-medium text-neutral-100">{ds.name}</td>
                  <td className="p-3 text-neutral-60">{ds.source}</td>
                  <td className="p-3 text-neutral-60">{ds.target}</td>
                  <td className="p-3 text-neutral-60">{ds.records}</td>
                  <td className="p-3 text-neutral-60">{ds.size}</td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusStyles[ds.status as keyof typeof statusStyles]}`}>
                      {ds.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
