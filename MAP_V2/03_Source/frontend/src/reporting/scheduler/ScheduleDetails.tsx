import { Calendar, Clock, User, Bell, ArrowLeft } from 'lucide-react';
import { useReportScheduler } from './hooks/useReportScheduler';

export const ScheduleDetails = () => {
  const { schedules } = useReportScheduler();
  const schedule = schedules[0];

  if (!schedule) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-100">Schedule Details</h1>
        <p className="text-neutral-60">No schedule selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-neutral-10 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-neutral-70" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">{schedule.reportName}</h1>
          <p className="text-neutral-60">Schedule configuration and details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-20 rounded-lg p-6">
          <h2 className="font-medium text-neutral-100 mb-4">Configuration</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-neutral-50" />
              <div>
                <div className="text-sm text-neutral-50">Frequency</div>
                <div className="font-medium text-neutral-100 capitalize">{schedule.frequency}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-neutral-50" />
              <div>
                <div className="text-sm text-neutral-50">Time</div>
                <div className="font-medium text-neutral-100">{schedule.time} ({schedule.timeZone})</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-neutral-50" />
              <div>
                <div className="text-sm text-neutral-50">Owner</div>
                <div className="font-medium text-neutral-100">{schedule.owner}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-neutral-50" />
              <div>
                <div className="text-sm text-neutral-50">Priority</div>
                <div className="font-medium text-neutral-100 capitalize">{schedule.priority}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-20 rounded-lg p-6">
          <h2 className="font-medium text-neutral-100 mb-4">Status & Dates</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-neutral-50">Status</div>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                schedule.status === 'active' ? 'bg-success-100 text-success-700' :
                schedule.status === 'paused' ? 'bg-warning-100 text-warning-700' :
                'bg-neutral-200 text-neutral-60'
              }`}>
                {schedule.status}
              </span>
            </div>
            <div>
              <div className="text-sm text-neutral-50">Start Date</div>
              <div className="font-medium text-neutral-100">{schedule.startDate}</div>
            </div>
            {schedule.endDate && (
              <div>
                <div className="text-sm text-neutral-50">End Date</div>
                <div className="font-medium text-neutral-100">{schedule.endDate}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-neutral-50">Created</div>
              <div className="font-medium text-neutral-100">{schedule.createdAt}</div>
            </div>
            <div>
              <div className="text-sm text-neutral-50">Last Updated</div>
              <div className="font-medium text-neutral-100">{schedule.updatedAt}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-20 rounded-lg p-6">
          <h2 className="font-medium text-neutral-100 mb-4">Recipients</h2>
          <div className="space-y-2">
            {schedule.recipients.map((recipient) => (
              <div key={recipient} className="flex items-center gap-2 p-2 bg-neutral-5 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm text-neutral-100">{recipient}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-neutral-20 rounded-lg p-6">
          <h2 className="font-medium text-neutral-100 mb-4">Notifications</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-70">Email</span>
              <div className={`w-10 h-5 rounded-full relative ${schedule.notifications.email ? 'bg-blue-600' : 'bg-neutral-300'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${schedule.notifications.email ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-70">Teams</span>
              <div className={`w-10 h-5 rounded-full relative ${schedule.notifications.teams ? 'bg-blue-600' : 'bg-neutral-300'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${schedule.notifications.teams ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-70">SMS</span>
              <div className={`w-10 h-5 rounded-full relative ${schedule.notifications.sms ? 'bg-blue-600' : 'bg-neutral-300'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${schedule.notifications.sms ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-70">Web</span>
              <div className={`w-10 h-5 rounded-full relative ${schedule.notifications.web ? 'bg-blue-600' : 'bg-neutral-300'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${schedule.notifications.web ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
