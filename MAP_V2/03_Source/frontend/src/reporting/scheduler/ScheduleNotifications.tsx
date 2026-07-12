import { Mail, MessageSquare, Smartphone, Globe } from 'lucide-react';
import { useReportScheduler } from './hooks/useReportScheduler';

export const ScheduleNotifications = () => {
  const { schedules } = useReportScheduler();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Notification Settings</h1>
        <p className="text-neutral-60">Configure email, Teams, SMS and web notifications</p>
      </div>

      <div className="bg-white border border-neutral-20 rounded-lg p-6">
        <h2 className="font-medium text-neutral-100 mb-4">Default Notification Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-neutral-5 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-neutral-100">Email Notifications</div>
                <div className="text-sm text-neutral-60">Receive schedule alerts via email</div>
              </div>
            </div>
            <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-neutral-5 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-neutral-100">Teams Notifications</div>
                <div className="text-sm text-neutral-60">Post alerts to Microsoft Teams</div>
              </div>
            </div>
            <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-neutral-5 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-neutral-100">SMS Notifications</div>
                <div className="text-sm text-neutral-60">Critical alerts via text message</div>
              </div>
            </div>
            <div className="w-12 h-6 bg-neutral-300 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-neutral-5 rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium text-neutral-100">Web Notifications</div>
                <div className="text-sm text-neutral-60">In-app browser notifications</div>
              </div>
            </div>
            <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-20 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-neutral-5 border-b border-neutral-20">
          <h3 className="font-medium text-neutral-100">Per-Schedule Notification Settings</h3>
        </div>
        <table className="w-full">
          <thead className="bg-neutral-5 border-b border-neutral-20">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Report</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-neutral-70">
                <Mail className="w-4 h-4 inline" />
              </th>
              <th className="text-center px-4 py-3 text-sm font-medium text-neutral-70">
                <MessageSquare className="w-4 h-4 inline" />
              </th>
              <th className="text-center px-4 py-3 text-sm font-medium text-neutral-70">
                <Smartphone className="w-4 h-4 inline" />
              </th>
              <th className="text-center px-4 py-3 text-sm font-medium text-neutral-70">
                <Globe className="w-4 h-4 inline" />
              </th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="border-b border-neutral-10 hover:bg-neutral-5">
                <td className="px-4 py-3 text-sm text-neutral-100 font-medium">{schedule.reportName}</td>
                <td className="px-4 py-3 text-center">
                  <div className={`w-5 h-5 rounded mx-auto ${schedule.notifications.email ? 'bg-blue-600' : 'bg-neutral-200'}`} />
                </td>
                <td className="px-4 py-3 text-center">
                  <div className={`w-5 h-5 rounded mx-auto ${schedule.notifications.teams ? 'bg-purple-600' : 'bg-neutral-200'}`} />
                </td>
                <td className="px-4 py-3 text-center">
                  <div className={`w-5 h-5 rounded mx-auto ${schedule.notifications.sms ? 'bg-green-600' : 'bg-neutral-200'}`} />
                </td>
                <td className="px-4 py-3 text-center">
                  <div className={`w-5 h-5 rounded mx-auto ${schedule.notifications.web ? 'bg-orange-600' : 'bg-neutral-200'}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
