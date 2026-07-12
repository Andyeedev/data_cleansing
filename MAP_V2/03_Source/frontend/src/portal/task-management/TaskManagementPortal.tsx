import { useLocation } from 'react-router-dom';
import { PortalShell } from '../framework/PortalShell';
import { PortalRegistry } from '../registry/PortalRegistry';
import { TaskDashboard } from './TaskDashboard';
import { MyTasks } from './MyTasks';
import { AllTasks } from './AllTasks';
import { TaskWorkflows } from './TaskWorkflows';
import { TaskApprovals } from './TaskApprovals';
import { TaskCalendar } from './TaskCalendar';
import { TaskNotifications } from './TaskNotifications';

const routeComponents: Record<string, React.ComponentType> = {
  '/task-management': TaskDashboard,
  '/task-management/dashboard': TaskDashboard,
  '/task-management/my-tasks': MyTasks,
  '/task-management/tasks': AllTasks,
  '/task-management/workflows': TaskWorkflows,
  '/task-management/approvals': TaskApprovals,
  '/task-management/calendar': TaskCalendar,
  '/task-management/notifications': TaskNotifications,
};

export const TaskManagementPortal = () => {
  const location = useLocation();
  const portal = PortalRegistry.get('task-management');

  if (!portal) {
    return <div className="p-8 text-center text-neutral-60">Task Management Portal not found</div>;
  }

  const PageComponent = routeComponents[location.pathname] || TaskDashboard;

  return (
    <PortalShell portal={portal}>
      <PageComponent />
    </PortalShell>
  );
};
