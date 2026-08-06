import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';
import { isSameDay } from 'date-fns';

const STATUS_DOT_COLOR = {
  Present: 'bg-success',
  Late: 'bg-warning',
  Absent: 'bg-danger',
  Leave: 'bg-warning',
  'Half Day': 'bg-info',
  Holiday: 'bg-text-secondary',
};

export function CalendarDayCell({ date, status, isCurrentMonth = true, isSelected = false, onClick }) {
  const today = isSameDay(date, new Date());
  const dotColor = status ? STATUS_DOT_COLOR[status] : null;

  return (
   <button
  type="button"
  onClick={onClick}
  className={cn(
    'h-14 w-14 rounded-input border border-transparent p-1 text-left flex flex-col items-center justify-center',
    'hover:border-border transition-colors',
    today && !isSelected && 'bg-primary/10 border-primary/30',
    isSelected && 'bg-primary border-primary',
    !isCurrentMonth && 'opacity-40'
  )}
>
  <span
    className={cn(
      'text-xs',
      isSelected ? 'text-white' : 'text-text-primary'
    )}
  >
    {date.getDate()}
  </span>

  {dotColor && (
    <span
      className={cn(
        'mt-0.5 h-1 w-1 rounded-full',
        isSelected ? 'bg-white' : dotColor
      )}
    />
  )}
</button>
  );
}

CalendarDayCell.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  status: PropTypes.string,
  isCurrentMonth: PropTypes.bool,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
};