import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * StatCard — a single summary metric card, used across every
 * module's page header row (Employees, Attendance, Materials, Wages).
 *
 * Matches the Dashboard Cards spec in the UI/UX doc: icon, label,
 * value, with an optional colored icon-background accent (matched
 * to the metric's meaning — e.g. green for "Active", amber for
 * "On Leave" — passed in by the parent, not hardcoded here).
 *
 * @param {Object} props
 * @param {string} props.label - e.g. "Total", "Active", "On Leave"
 * @param {string|number} props.value - the metric itself, e.g. 8
 * @param {React.ComponentType} [props.icon] - Lucide icon component
 * @param {'primary'|'success'|'warning'|'danger'|'info'} [props.accent]
 */
export function StatCard({ label, value, icon: Icon, accent = 'primary', className }) {
  return (
    <div
      className={cn(
        'flex-1 min-w-[180px] rounded-card border border-border bg-background p-lg',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">{label}</p>

        {Icon && (
          <div
            className={cn(
              'w-9 h-9 rounded-input flex items-center justify-center shrink-0',
              accentStyles[accent]
            )}
          >
            <Icon size={16} />
          </div>
        )}
      </div>

      <p className="text-3xl font-bold text-text-primary mt-3">{value}</p>
    </div>
  );
}

/**
 * accentStyles — background/text color combos for the icon circle,
 * keyed by semantic accent name. Defined outside the component so
 * it isn't recreated on every render.
 */
const accentStyles = {
  primary: 'bg-primary/15 text-primary',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  info: 'bg-info/15 text-info',
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  accent: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'info']),
  className: PropTypes.string,
};