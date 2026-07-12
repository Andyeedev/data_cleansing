import { ArrowLeft, Save, X } from 'lucide-react';
import { useReportScheduler } from './hooks/useReportScheduler';

export const ScheduleEditor = () => {
  const { schedules } = useReportScheduler();
  const schedule = schedules[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-neutral-10 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-neutral-70" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-100">
              {schedule ? 'Edit Schedule' : 'Create Schedule'}
            </h1>
            <p className="text-neutral-60">Configure schedule parameters</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-20 text-neutral-70 rounded-lg hover:bg-neutral-50">
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Save className="w-4 h-4" />
            Save Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-20 rounded-lg p-6">
          <h2 className="font-medium text-neutral-100 mb-4">Report Selection</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Report</label>
              <select className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100">
                <option>Select a report...</option>
                <option>Executive Dashboard Report</option>
                <option>Migration Progress Report</option>
                <option>Validation Results Report</option>
                <option>Governance Compliance Report</option>
                <option>Risk Assessment Report</option>
                <option>Security Audit Report</option>
                <option>Platform Health Report</option>
                <option>Audit Trail Report</option>
                <option>AI Insights Report</option>
                <option>Quarterly Executive Briefing</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-20 rounded-lg p-6">
          <h2 className="font-medium text-neutral-100 mb-4">Schedule Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Frequency</label>
              <select className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="event-driven">Event Driven</option>
                <option value="on-demand">On Demand</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Start Date</label>
              <input type="date" className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">End Date</label>
              <input type="date" className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Time</label>
              <input type="time" defaultValue="08:00" className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Time Zone</label>
              <select className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100">
                <option>UTC</option>
                <option>US/Eastern</option>
                <option>US/Pacific</option>
                <option>Europe/London</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-20 rounded-lg p-6">
          <h2 className="font-medium text-neutral-100 mb-4">Priority & Ownership</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Priority</label>
              <select className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Owner</label>
              <input type="text" placeholder="Enter owner name" className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Recipients</label>
              <input type="text" placeholder="Enter email addresses" className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-20 rounded-lg p-6">
          <h2 className="font-medium text-neutral-100 mb-4">Notifications</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-70">Email Notifications</span>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-70">Teams Notifications</span>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-70">SMS Notifications</span>
              <div className="w-10 h-5 bg-neutral-300 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-70">Web Notifications</span>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
