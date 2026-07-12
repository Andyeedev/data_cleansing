import { CheckCircle, Clock, Circle, ListTodo } from 'lucide-react';
import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';
import type { SystemWidgetProps } from '../types/WidgetProps';

const statusConfig: Record<string, { icon: typeof Circle; color: string }> = {
  completed: { icon: CheckCircle, color: 'text-success-500' },
  in_progress: { icon: Clock, color: 'text-warning-500' },
  pending: { icon: Circle, color: 'text-neutral-60' },
};

export const TaskWidget = ({ data }: WidgetProps) => {
  const systemData = data as SystemWidgetProps['data'];
  const tasks = systemData?.tasks || [];

  return (
    <WidgetBody>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <ListTodo className="w-8 h-8 text-neutral-60 mx-auto" />
              <p className="text-sm text-neutral-60 mt-2">No tasks</p>
            </div>
          </div>
        ) : (
          tasks.map((task) => {
            const cfg = statusConfig[task.status] || statusConfig.pending;
            const Icon = cfg.icon;

            return (
              <div
                key={task.id}
                className="flex items-center gap-3 p-2 hover:bg-neutral-20 rounded-lg transition-colors"
              >
                <Icon className={`w-4 h-4 ${cfg.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-100">{task.title}</p>
                </div>
                {task.dueDate && (
                  <span className="text-xs text-neutral-60">{task.dueDate}</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </WidgetBody>
  );
};
