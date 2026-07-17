import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';
import { isSameDay } from 'date-fns';

/**
 * STATUS_DOT_COLOR — maps a day's dominant attendance status to a
 * dot color, matching the legend in your screenshot exactly:
 * Present (green), Absent (red), Late (amber), Leave (amber/brown),
 * Weekend (neutral gray, no data expected).
 */
const STATUS_DOT_COLOR = {
  Present: 'bg-success',
  Late: 'bg-warning',
  Absent: 'bg-danger',
  Leave: 'bg-warning',
  'Half Day': 'bg-info',
  Holiday: 'bg-text-secondary',
};

/**
 * CalendarDayCell — one cell in the monthly attendance calendar grid.
 *
 * @param {Object} props
 * @param {Date} props.date
 * @param {string|null} props.status - dominant status for this day, if any
 * @param {boolean} [props.isCurrentMonth]
 * @param {() => void} [props.onClick]
 */
export function CalendarDayCell({ date, status, isCurrentMonth = true, onClick }) {
  const today = isSameDay(date, new Date());
  const dotColor = status ? STATUS_DOT_COLOR[status] : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'aspect-square w-full rounded-input border border-transparent p-2 text-left',
        'hover:border-border transition-colors',
        today && 'bg-primary/10 border-primary/30',
        !isCurrentMonth && 'opacity-40'
      )}
    >
      <span className="text-sm text-text-primary">{date.getDate()}</span>
      {dotColor && (
        <span className={cn('block w-1.5 h-1.5 rounded-full mt-1', dotColor)} />
      )}
    </button>
  );
}

CalendarDayCell.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  status: PropTypes.string,
  isCurrentMonth: PropTypes.bool,
  onClick: PropTypes.func,
};