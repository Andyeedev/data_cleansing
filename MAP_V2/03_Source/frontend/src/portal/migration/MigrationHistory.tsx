import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const history = [
  { id: 'h1', name: 'Customer Batch 17', date: 'Today 10:30', duration: '12m 34s', records: '11,890', status: 'success' },
  { id: 'h2', name: 'Transaction Run 41', date: 'Today 09:15', duration: '8m 21s', records: '9,100', status: 'success' },
  { id: 'h3', name: 'Customer Batch 16', date: 'Yesterday 16:45', duration: '14m 02s', records: '12,100', status: 'success' },
  { id: 'h4', name: 'Account Sync 11', date: 'Yesterday 14:20', duration: '6m 45s', records: '5,600', status: 'success' },
  { id: 'h5', name: 'Transaction Run 40', date: 'Yesterday 11:00', duration: '-', records: '0', status: 'failed' },
];

const statusStyles = {
  success: 'bg-success-50 text-success-500',
  failed: 'bg-error-50 text-error-500',
  partial: 'bg-warning-50 text-warning-500',
};

export const MigrationHistory = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-neutral-100">Migration History</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { id: 'hist-total', label: 'Total Runs', value: 234 },
          { id: 'hist-success', label: 'Successful', value: 231 },
          { id: 'hist-failed', label: 'Failed', value: 3 },
          { id: 'hist-rate', label: 'Success Rate', value: '98.7%' },
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
          <h3 className="text-sm font-semibold text-neutral-100">Previous Runs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left p-3 text-xs font-semibold text-neutral-60">Name</th>
                <th className="text-left p-3 text-xs font-semibold text-neutral-60">Date</th>
                <th className="text-left p-3 text-xs font-semibold text-neutral-60">Duration</th>
                <th className="text-left p-3 text-xs font-semibold text-neutral-60">Records</th>
                <th className="text-left p-3 text-xs font-semibold text-neutral-60">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors cursor-pointer">
                  <td className="p-3 font-medium text-neutral-100">{item.name}</td>
                  <td className="p-3 text-neutral-60">{item.date}</td>
                  <td className="p-3 text-neutral-60">{item.duration}</td>
                  <td className="p-3 text-neutral-60">{item.records}</td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusStyles[item.status as keyof typeof statusStyles]}`}>
                      {item.status}
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
