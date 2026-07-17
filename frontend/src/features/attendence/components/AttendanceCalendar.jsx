import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
} from 'date-fns';
import { CalendarDayCell } from './CalendarDayCell';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const LEGEND_ITEMS = [
  { label: 'Present', color: 'bg-success' },
  { label: 'Absent', color: 'bg-danger' },
  { label: 'Late', color: 'bg-warning' },
  { label: 'Leave', color: 'bg-warning' },
  { label: 'Weekend', color: 'bg-text-secondary/40' },
];

/**
 * AttendanceCalendar — monthly grid view of attendance, matching
 * the design screenshot: month title, colored legend, 7-column
 * weekday grid with a status dot per day.
 *
 * @param {Object} props
 * @param {Date} props.currentMonth - any date within the month to display
 * @param {AttendanceRecord[]} props.records - ALL records for this month
 * @param {(date: Date) => void} [props.onDayClick]
 */
export function AttendanceCalendar({ currentMonth, records, onDayClick }) {
  // Build the full grid of days to display, including the leading/
  // trailing days from adjacent months needed to fill complete weeks.
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Quick lookup: "2026-07-15" -> that day's attendance status.
  // If multiple records somehow exist for the same date (shouldn't,
  // per business rules), the last one wins — acceptable for display.
  const statusByDate = useMemo(() => {
    const map = {};
    records.forEach((rec) => {
      map[rec.attendanceDate] = rec.status;
    });
    return map;
  }, [records]);

  return (
    <div className="rounded-card border border-border bg-background p-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <p className="text-sm text-text-secondary">Your attendance overview</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Weekday header row */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i} className="text-center text-xs font-semibold text-text-secondary py-1">
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          return (
            <CalendarDayCell
              key={dateKey}
              date={day}
              status={statusByDate[dateKey] ?? null}
              isCurrentMonth={isSameMonth(day, currentMonth)}
              onClick={() => onDayClick?.(day)}
            />
          );
        })}
      </div>
    </div>
  );
}

AttendanceCalendar.propTypes = {
  currentMonth: PropTypes.instanceOf(Date).isRequired,
  records: PropTypes.array.isRequired,
  onDayClick: PropTypes.func,
};