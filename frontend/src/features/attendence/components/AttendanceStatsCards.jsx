import { CheckCircle2, Clock, XCircle, CalendarClock } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';

/**
 * AttendanceStatsCards — "Present today / Late arrivals / Absent /
 * On leave" summary row at the top of the Attendance page.
 *
 * Counts are derived from today's attendance records passed in,
 * so they always reflect what's actually loaded — no separate
 * state to keep in sync.
 *
 * @param {Object} props
 * @param {AttendanceRecord[]} props.todayRecords
 */
export function AttendanceStatsCards({ todayRecords }) {
  const present = todayRecords.filter((r) => r.status === 'Present').length;
  // "Late" is derived here rather than stored as its own status —
  // any Present record with a check-in after 08:30 counts as late,
  // matching the UI-only distinction documented in attendance.mock.js
  const late = todayRecords.filter(
    (r) => r.status === 'Present' && r.checkIn && r.checkIn > '08:30'
  ).length;
  const absent = todayRecords.filter((r) => r.status === 'Absent').length;
  const onLeave = todayRecords.filter((r) => r.status === 'Leave').length;

  return (
    <div className="flex flex-wrap gap-4">
      <StatCard label="Present today" value={present} icon={CheckCircle2} accent="success" />
      <StatCard label="Late arrivals" value={late} icon={Clock} accent="warning" />
      <StatCard label="Absent" value={absent} icon={XCircle} accent="danger" />
      <StatCard label="On leave" value={onLeave} icon={CalendarClock} accent="info" />
    </div>
  );
}