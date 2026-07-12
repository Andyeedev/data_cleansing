import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const generateCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startPadding = firstDay.getDay();
  const days: (number | null)[] = [];
  for (let i = 0; i < startPadding; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
};

const mockTasks = [
  { id: '1', title: 'Validate dataset', date: '2026-07-15', color: 'bg-blue-500' },
  { id: '2', title: 'Review policies', date: '2026-07-18', color: 'bg-yellow-500' },
  { id: '3', title: 'Execute batch', date: '2026-07-12', color: 'bg-green-500' },
  { id: '4', title: 'Update mappings', date: '2026-07-14', color: 'bg-red-500' },
];

export const TaskCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1));
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = generateCalendarDays(year, month);
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const getTasksForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockTasks.filter(t => t.date === dateStr);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Calendar</h1>
        <p className="text-neutral-600 mt-1">View tasks and deadlines</p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-neutral-100 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">{monthName} {year}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-neutral-100 rounded-lg">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-neutral-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-neutral-50 p-2 text-center text-sm font-medium text-neutral-600">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => (
            <div 
              key={index} 
              className={`bg-white p-2 min-h-[80px] ${day === today.getDate() && month === today.getMonth() ? 'bg-blue-50' : ''}`}
            >
              {day && (
                <>
                  <span className={`text-sm ${day === today.getDate() ? 'font-bold text-blue-600' : 'text-neutral-900'}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {getTasksForDay(day).map(task => (
                      <div key={task.id} className={`text-xs text-white px-1 py-0.5 rounded ${task.color}`}>
                        {task.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
