import { useState } from 'react';
import { Calendar, Clock, Filter, Grid, List } from 'lucide-react';
import { useReportScheduler } from './hooks/useReportScheduler';
import type { ScheduleFrequency } from './types/SchedulerTypes';

const frequencyTabs: { id: ScheduleFrequency | 'all'; label: string }[] = [
  { id: 'all', label: 'All Schedules' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'annually', label: 'Annual' },
  { id: 'event-driven', label: 'Event Driven' },
  { id: 'on-demand', label: 'On Demand' },
];

export const ScheduleExplorer = () => {
  const { schedules, filters, setFilters } = useReportScheduler();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<ScheduleFrequency | 'all'>('all');

  const filteredSchedules = activeTab === 'all'
    ? schedules
    : schedules.filter((s) => s.frequency === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">Schedule Explorer</h1>
          <p className="text-neutral-60">Browse schedules by frequency</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-neutral-60 hover:bg-neutral-100'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-neutral-60 hover:bg-neutral-100'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {frequencyTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-10 text-neutral-70 hover:bg-neutral-20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-50" />
          <input
            type="text"
            placeholder="Search schedules..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-neutral-20 rounded-lg bg-white text-neutral-100 placeholder-neutral-50"
          />
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedules.map((schedule) => (
            <div key={schedule.id} className="bg-white border border-neutral-20 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-neutral-100">{schedule.reportName}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  schedule.status === 'active' ? 'bg-success-100 text-success-700' :
                  schedule.status === 'paused' ? 'bg-warning-100 text-warning-700' :
                  'bg-neutral-200 text-neutral-60'
                }`}>
                  {schedule.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-neutral-60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="capitalize">{schedule.frequency}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{schedule.time} ({schedule.timeZone})</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Details
                </button>
                <button className="px-3 py-1.5 text-sm border border-neutral-20 text-neutral-70 rounded-lg hover:bg-neutral-50">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-neutral-20 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-5 border-b border-neutral-20">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Report</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Frequency</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Time</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Priority</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Owner</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="border-b border-neutral-10 hover:bg-neutral-5">
                  <td className="px-4 py-3 text-sm text-neutral-100 font-medium">{schedule.reportName}</td>
                  <td className="px-4 py-3 text-sm text-neutral-60 capitalize">{schedule.frequency}</td>
                  <td className="px-4 py-3 text-sm text-neutral-60">{schedule.time}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      schedule.priority === 'critical' ? 'bg-danger-100 text-danger-700' :
                      schedule.priority === 'high' ? 'bg-warning-100 text-warning-700' :
                      'bg-neutral-200 text-neutral-60'
                    }`}>
                      {schedule.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      schedule.status === 'active' ? 'bg-success-100 text-success-700' :
                      schedule.status === 'paused' ? 'bg-warning-100 text-warning-700' :
                      'bg-neutral-200 text-neutral-60'
                    }`}>
                      {schedule.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-60">{schedule.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
