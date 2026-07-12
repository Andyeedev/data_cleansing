import { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, Bug } from 'lucide-react';
import { useReportScheduler } from './hooks/useReportScheduler';
import type { LogLevel } from './types/SchedulerTypes';

const levelTabs: { id: LogLevel | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <Info className="w-4 h-4" /> },
  { id: 'info', label: 'Info', icon: <Info className="w-4 h-4" /> },
  { id: 'warning', label: 'Warning', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'error', label: 'Error', icon: <AlertCircle className="w-4 h-4" /> },
  { id: 'debug', label: 'Debug', icon: <Bug className="w-4 h-4" /> },
];

export const ScheduleLogs = () => {
  const { logs } = useReportScheduler();
  const [activeLevel, setActiveLevel] = useState<LogLevel | 'all'>('all');

  const filteredLogs = activeLevel === 'all'
    ? logs
    : logs.filter((l) => l.level === activeLevel);

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'info': return 'bg-blue-100 text-blue-700';
      case 'warning': return 'bg-warning-100 text-warning-700';
      case 'error': return 'bg-danger-100 text-danger-700';
      case 'debug': return 'bg-neutral-200 text-neutral-60';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Scheduler Logs</h1>
        <p className="text-neutral-60">View scheduler activity and error logs</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {levelTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveLevel(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
              activeLevel === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-10 text-neutral-70 hover:bg-neutral-20'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-neutral-20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-5 border-b border-neutral-20">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Timestamp</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Level</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Schedule</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Message</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b border-neutral-10 hover:bg-neutral-5">
                <td className="px-4 py-3 text-sm text-neutral-60 font-mono">{log.timestamp}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getLevelColor(log.level)}`}>
                    {log.level}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-neutral-100">{log.scheduleName}</td>
                <td className="px-4 py-3 text-sm text-neutral-60">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
