import { Routes, Route, Navigate } from 'react-router-dom';
import { SchedulerDashboard } from './SchedulerDashboard';
import { ScheduleExplorer } from './ScheduleExplorer';
import { ScheduleDetails } from './ScheduleDetails';
import { ScheduleEditor } from './ScheduleEditor';
import { ScheduleCalendar } from './ScheduleCalendar';
import { ScheduleTimeline } from './ScheduleTimeline';
import { ScheduleHistory } from './ScheduleHistory';
import { ScheduleQueue } from './ScheduleQueue';
import { ScheduleTemplates } from './ScheduleTemplates';
import { ScheduleNotifications } from './ScheduleNotifications';
import { ScheduleLogs } from './ScheduleLogs';
import { ScheduleStatistics } from './ScheduleStatistics';
import { SchedulerSettings } from './SchedulerSettings';
import { SchedulerWorkspace } from './SchedulerWorkspace';

const schedulerRoutes: Record<string, React.ComponentType> = {
  '': SchedulerDashboard,
  schedules: ScheduleExplorer,
  calendar: ScheduleCalendar,
  timeline: ScheduleTimeline,
  queue: ScheduleQueue,
  history: ScheduleHistory,
  templates: ScheduleTemplates,
  notifications: ScheduleNotifications,
  logs: ScheduleLogs,
  statistics: ScheduleStatistics,
  settings: SchedulerSettings,
  workspace: SchedulerWorkspace,
  'details/:id': ScheduleDetails,
  'editor/:id?': ScheduleEditor,
};

export const ReportScheduler = () => {
  return (
    <Routes>
      <Route index element={<SchedulerDashboard />} />
      {Object.entries(schedulerRoutes).map(([path, Component]) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="*" element={<Navigate to="/scheduler" replace />} />
    </Routes>
  );
};
