import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReportScheduler } from './hooks/useReportScheduler';

type CalendarView = 'day' | 'week' | 'month' | 'agenda';

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

export const ScheduleCalendar = () => {
  const { schedules } = useReportScheduler();
  const [view, setView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = generateCalendarDays(year, month);
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getSchedulesForDay = (day: number) => {
    return schedules.filter((s) => {
      const d = new Date(s.startDate);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">Schedule Calendar</h1>
          <p className="text-neutral-60">Visual calendar of scheduled reports</p>
        </div>
        <div className="flex gap-2">
          {(['day', 'week', 'month', 'agenda'] as CalendarView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
                view === v ? 'bg-blue-600 text-white' : 'bg-neutral-10 text-neutral-70 hover:bg-neutral-20'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-neutral-20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-neutral-10 rounded-lg">
            <ChevronLeft className="w-5 h-5 text-neutral-70" />
          </button>
          <h2 className="text-lg font-semibold text-neutral-100">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-neutral-10 rounded-lg">
            <ChevronRight className="w-5 h-5 text-neutral-70" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-neutral-20">
          {weekDays.map((day) => (
            <div key={day} className="bg-neutral-5 px-2 py-3 text-center text-sm font-medium text-neutral-70">
              {day}
            </div>
          ))}
          {days.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="bg-white min-h-[100px]" />;
            const daySchedules = getSchedulesForDay(day);
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            return (
              <div key={day} className={`bg-white min-h-[100px] p-2 ${isToday ? 'bg-blue-50' : ''}`}>
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-neutral-70'}`}>
                  {day}
                </div>
                {daySchedules.slice(0, 2).map((s) => (
                  <div key={s.id} className="text-xs bg-blue-100 text-blue-700 rounded px-1 py-0.5 mb-0.5 truncate">
                    {s.reportName}
                  </div>
                ))}
                {daySchedules.length > 2 && (
                  <div className="text-xs text-neutral-50">+{daySchedules.length - 2} more</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {view === 'agenda' && (
        <div className="bg-white border border-neutral-20 rounded-lg p-4">
          <h3 className="font-medium text-neutral-100 mb-4">Upcoming Agenda</h3>
          <div className="space-y-3">
            {schedules.filter((s) => s.status === 'active').map((s) => (
              <div key={s.id} className="flex items-center gap-4 p-3 bg-neutral-5 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <div className="font-medium text-neutral-100">{s.reportName}</div>
                  <div className="text-sm text-neutral-60 capitalize">{s.frequency} at {s.time}</div>
                </div>
                <div className="text-sm text-neutral-50">{s.owner}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
