import { Settings, Clock, RefreshCw, Bell } from 'lucide-react';

export const SchedulerSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Scheduler Settings</h1>
        <p className="text-neutral-60">Configure default scheduler behaviour and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="font-medium text-neutral-100">General Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Default Time Zone</label>
              <select className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100">
                <option>UTC</option>
                <option>US/Eastern</option>
                <option>US/Pacific</option>
                <option>Europe/London</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Default Time</label>
              <input type="time" defaultValue="08:00" className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Max Concurrent Jobs</label>
              <input type="number" defaultValue={5} className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-purple-600" />
            <h2 className="font-medium text-neutral-100">Retry Policy</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Max Retries</label>
              <input type="number" defaultValue={3} className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Retry Delay (seconds)</label>
              <input type="number" defaultValue={60} className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Timeout (seconds)</label>
              <input type="number" defaultValue={300} className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-green-600" />
            <h2 className="font-medium text-neutral-100">Notification Preferences</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-70">Email on success</span>
              <div className="w-10 h-5 bg-neutral-300 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-70">Email on failure</span>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-70">Daily summary</span>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-orange-600" />
            <h2 className="font-medium text-neutral-100">Maintenance Window</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">Start Time</label>
              <input type="time" defaultValue="02:00" className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-70 mb-1">End Time</label>
              <input type="time" defaultValue="04:00" className="w-full px-3 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-70">Skip schedules during maintenance</span>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 text-sm border border-neutral-20 text-neutral-70 rounded-lg hover:bg-neutral-50">
          Reset to Defaults
        </button>
        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Save Settings
        </button>
      </div>
    </div>
  );
};
