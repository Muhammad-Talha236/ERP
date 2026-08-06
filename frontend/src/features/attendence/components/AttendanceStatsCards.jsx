import PropTypes from 'prop-types';
import { CheckCircle2, Clock, XCircle, CalendarDays } from 'lucide-react';

export function AttendanceStatsCards({ todayRecords = [] }) {
  const total = todayRecords.length;
  const present = todayRecords.filter((r) => r.status === 'Present').length;
  const late = todayRecords.filter((r) => r.status === 'Late').length;
  const absent = todayRecords.filter((r) => r.status === 'Absent').length;
  const leave = todayRecords.filter((r) => r.status === 'Leave' || r.status === 'Half Day').length;

  const stats = [
    { title: 'Present today', value: present, icon: CheckCircle2, color: 'text-success bg-success/15' },
    { title: 'Late arrivals', value: late, icon: Clock, color: 'text-warning bg-warning/15' },
    { title: 'Absent', value: absent, icon: XCircle, color: 'text-danger bg-danger/15' },
    { title: 'On leave', value: leave, icon: CalendarDays, color: 'text-info bg-info/15' },
  ];

  return (
    // Grid: Mobile par 2 columns, Desktop par 4 columns
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title} className="rounded-card border border-border bg-background p-4 sm:p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-text-secondary truncate">{stat.title}</span>
              <div className={`p-2 rounded-xl ${stat.color}`}>
                <Icon size={18} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              {stat.value}
              {total > 0 && <span className="text-xs font-normal text-text-secondary ml-1.5">/ {total}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

AttendanceStatsCards.propTypes = {
  todayRecords: PropTypes.array,
};